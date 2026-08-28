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

export class KimiAdapter implements AgentAdapter {
  readonly id = "kimi" as const;
  readonly displayName = "Kimi Code CLI";

  async detect(layout: HomeLayout): Promise<boolean> {
    return (await commandOnPath("kimi")) || (await pathExists(layout.kimiHome));
  }

  instructionPath(layout: HomeLayout): string {
    return join(layout.sharedAgentsHome, "AGENTS.md");
  }

  mcpPath(layout: HomeLayout): string {
    return join(layout.kimiHome, "mcp.json");
  }

  renderMcp(
    existing: string | undefined,
    servers: McpDefinition[],
    mode: InstallMode,
    ownedIds: ReadonlySet<string>,
    target: string,
  ): RenderedMcpConfig {
    const base =
      mode === "overwrite" ? {} : parseJsonObject(existing, "Kimi MCP config " + target);
    const current = tableAt(base, "mcpServers", "Kimi mcpServers");
    const conflicts: ConfigConflict[] = [];
    const hashes: Record<string, string> = {};
    for (const server of servers) {
      if (
        mode === "append" &&
        Object.hasOwn(current, server.id) &&
        !ownedIds.has(server.id)
      ) {
        conflicts.push({
          target,
          component: "mcp:" + server.id,
          message: "Kimi MCP server name already exists and is not managed by AgentPack.",
          reconcilable: true,
        });
        continue;
      }
      const rendered = renderServer(server);
      current[server.id] = rendered;
      hashes[server.id] = entryHash(rendered);
    }
    if (conflicts.length > 0) {
      return { content: existing ?? "", entryHashes: hashes, conflicts };
    }
    base.mcpServers = current;
    return { content: jsonText(base), entryHashes: hashes, conflicts };
  }

  removeMcp(existing: string, ids: string[]): string {
    const base = parseJsonObject(existing, "Kimi MCP config");
    const current = base.mcpServers;
    if (!isRecord(current)) {
      return existing;
    }
    for (const id of ids) {
      delete current[id];
    }
    base.mcpServers = current;
    return jsonText(base);
  }

  entryHash(content: string, id: string): string | undefined {
    const base = parseJsonObject(content, "Kimi MCP config");
    const table = base.mcpServers;
    if (!isRecord(table) || !Object.hasOwn(table, id)) {
      return undefined;
    }
    return entryHash(table[id]);
  }

  validateMcp(content: string, expectedIds: string[]): AdapterValidation {
    try {
      const base = parseJsonObject(content, "Kimi MCP config");
      const table = base.mcpServers;
      for (const id of expectedIds) {
        if (!isRecord(table) || !Object.hasOwn(table, id)) {
          return { ok: false, message: "Missing Kimi MCP entry " + id };
        }
      }
      return { ok: true, message: "Kimi JSON parsed and expected MCP entries exist." };
    } catch (error) {
      return { ok: false, message: errorMessage(error) };
    }
  }
}

function parseJsonObject(
  content: string | undefined,
  context: string,
): Record<string, unknown> {
  if (content === undefined || content.trim().length === 0) {
    return {};
  }
  return requireConfigRecord(JSON.parse(content), context);
}

function tableAt(
  base: Record<string, unknown>,
  key: string,
  context: string,
): Record<string, unknown> {
  const value = base[key];
  if (value === undefined) {
    return {};
  }
  return requireConfigRecord(value, context);
}

function renderServer(server: McpDefinition): Record<string, unknown> {
  const rendered: Record<string, unknown> = {
    url: server.url,
    headers: staticHeaders(server),
    enabled: true,
  };
  if (server.bearerTokenEnvVar !== undefined) {
    rendered.bearerTokenEnvVar = server.bearerTokenEnvVar;
  }
  return rendered;
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
