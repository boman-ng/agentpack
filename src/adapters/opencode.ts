import {
  applyEdits,
  modify,
  parse as parseJsonc,
  type FormattingOptions,
  type ParseError,
} from "jsonc-parser";
import { join } from "node:path";
import type {
  AdapterValidation,
  AgentAdapter,
  ConfigConflict,
  HomeLayout,
  InstallMode,
  McpDefinition,
  RenderedMcpConfig,
} from "../types.js";
import { isRecord } from "../util/values.js";
import { pathExists } from "../util/fs.js";
import {
  commandOnPath,
  entryHash,
  jsonText,
  requireConfigRecord,
  staticHeaders,
} from "./shared.js";

export class OpenCodeAdapter implements AgentAdapter {
  readonly id = "opencode" as const;
  readonly displayName = "OpenCode";

  async detect(layout: HomeLayout): Promise<boolean> {
    return (await commandOnPath("opencode")) || (await pathExists(layout.opencodeHome));
  }

  instructionPath(layout: HomeLayout): string {
    return join(layout.opencodeHome, "AGENTS.md");
  }

  skillsPath(layout: HomeLayout): string {
    return join(layout.opencodeHome, "skills");
  }

  mcpPath(layout: HomeLayout): string {
    return join(layout.opencodeHome, "opencode.json");
  }

  renderMcp(
    existing: string | undefined,
    servers: McpDefinition[],
    mode: InstallMode,
    ownedIds: ReadonlySet<string>,
    target: string,
  ): RenderedMcpConfig {
    const parsed = parseJsoncObject(existing, "OpenCode config " + target);
    const pathPrefix = mcpPathPrefix();
    const table = mode === "append" ? valueAtPath(parsed, pathPrefix) : {};
    const conflicts: ConfigConflict[] = [];
    const hashes: Record<string, string> = {};
    const renderedEntries: Record<string, unknown> = {};
    for (const server of servers) {
      if (
        mode === "append" &&
        Object.hasOwn(table, server.id) &&
        !ownedIds.has(server.id)
      ) {
        conflicts.push({
          target,
          component: "mcp:" + server.id,
          message: "OpenCode MCP server name already exists and is not managed by AgentPack.",
          reconcilable: true,
        });
        continue;
      }
      const rendered = renderServer(server);
      renderedEntries[server.id] = rendered;
      hashes[server.id] = entryHash(rendered);
    }
    if (conflicts.length > 0) {
      return { content: existing ?? "", entryHashes: hashes, conflicts };
    }

    let content =
      existing === undefined || existing.trim().length === 0
        ? jsonText({ $schema: "https://opencode.ai/config.json" })
        : existing;
    const formatting = formattingFor(content);
    if (mode === "overwrite") {
      content = applyEdits(
        content,
        modify(content, pathPrefix, renderedEntries, {
          formattingOptions: formatting,
        }),
      );
      return { content, entryHashes: hashes, conflicts };
    }
    for (const server of servers) {
      const path = [...pathPrefix, server.id];
      content = applyEdits(
        content,
        modify(content, path, renderedEntries[server.id], {
          formattingOptions: formatting,
        }),
      );
    }
    return { content, entryHashes: hashes, conflicts };
  }

  removeMcp(existing: string, ids: string[]): string {
    parseJsoncObject(existing, "OpenCode config");
    const pathPrefix = mcpPathPrefix();
    let content = existing;
    const formatting = formattingFor(content);
    for (const id of ids) {
      content = applyEdits(content, modify(content, [...pathPrefix, id], undefined, { formattingOptions: formatting }));
    }
    return content;
  }

  entryHash(content: string, id: string): string | undefined {
    const parsed = parseJsoncObject(content, "OpenCode config");
    const prefix = mcpPathPrefix();
    const table = valueAtPath(parsed, prefix);
    if (!Object.hasOwn(table, id)) {
      return undefined;
    }
    return entryHash(table[id]);
  }

  validateMcp(content: string, expectedIds: string[]): AdapterValidation {
    try {
      const parsed = parseJsoncObject(content, "OpenCode config");
      const table = valueAtPath(parsed, mcpPathPrefix());
      for (const id of expectedIds) {
        if (!Object.hasOwn(table, id)) {
          return { ok: false, message: "Missing OpenCode MCP entry " + id };
        }
      }
      return { ok: true, message: "OpenCode JSONC parsed and expected MCP entries exist." };
    } catch (error) {
      return { ok: false, message: errorMessage(error) };
    }
  }
}

function parseJsoncObject(
  content: string | undefined,
  context: string,
): Record<string, unknown> {
  if (content === undefined || content.trim().length === 0) {
    return {};
  }
  const errors: ParseError[] = [];
  const value: unknown = parseJsonc(content, errors, { allowTrailingComma: true });
  if (errors.length > 0) {
    throw new Error(context + " contains invalid JSONC at offset " + errors[0]?.offset);
  }
  return requireConfigRecord(value, context);
}

function mcpPathPrefix(): string[] {
  return ["mcp"];
}

function valueAtPath(
  parsed: Record<string, unknown>,
  path: string[],
): Record<string, unknown> {
  let current: unknown = parsed;
  for (const segment of path) {
    if (!isRecord(current)) {
      return {};
    }
    current = current[segment];
  }
  return current === undefined ? {} : requireConfigRecord(current, "OpenCode MCP table");
}

function renderServer(server: McpDefinition): Record<string, unknown> {
  const headers = staticHeaders(server);
  if (server.bearerTokenEnvVar !== undefined) {
    headers.Authorization = "Bearer {env:" + server.bearerTokenEnvVar + "}";
  }
  return {
    type: "remote",
    url: server.url,
    oauth: false,
    headers,
    enabled: true,
  };
}

function formattingFor(content: string): FormattingOptions {
  return {
    insertSpaces: true,
    tabSize: 2,
    eol: content.includes("\r\n") ? "\r\n" : "\n",
  };
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
