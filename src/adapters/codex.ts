import { parse, patch, stringify } from "@decimalturn/toml-patch";
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
  requireConfigRecord,
  staticHeaders,
} from "./shared.js";

export class CodexAdapter implements AgentAdapter {
  readonly id = "codex" as const;
  readonly displayName = "Codex CLI";

  async detect(layout: HomeLayout): Promise<boolean> {
    return (await commandOnPath("codex")) || (await pathExists(layout.codexHome));
  }

  instructionPath(layout: HomeLayout): string {
    return join(layout.codexHome, "AGENTS.md");
  }

  mcpPath(layout: HomeLayout): string {
    return join(layout.codexHome, "config.toml");
  }

  renderMcp(
    existing: string | undefined,
    servers: McpDefinition[],
    mode: InstallMode,
    ownedIds: ReadonlySet<string>,
    target: string,
  ): RenderedMcpConfig {
    const base =
      mode === "overwrite" ? {} : parseToml(existing ?? "", "Codex config " + target);
    const mcpServers = tableAt(base, "mcp_servers", "Codex mcp_servers");
    const conflicts: ConfigConflict[] = [];
    const hashes: Record<string, string> = {};

    for (const server of servers) {
      if (
        mode === "append" &&
        Object.hasOwn(mcpServers, server.id) &&
        !ownedIds.has(server.id)
      ) {
        conflicts.push({
          target,
          component: "mcp:" + server.id,
          message: "Codex MCP server name already exists and is not managed by AgentPack.",
        });
        continue;
      }
      const rendered = renderServer(server);
      mcpServers[server.id] = rendered;
      hashes[server.id] = entryHash(rendered);
    }
    if (conflicts.length > 0) {
      return { content: existing ?? "", entryHashes: hashes, conflicts };
    }
    if (Object.keys(mcpServers).length > 0) {
      base.mcp_servers = mcpServers;
    } else {
      delete base.mcp_servers;
    }
    const content =
      mode === "overwrite"
        ? stringify(base, { trailingNewline: 1 })
        : patch(existing ?? "", base, {
            updateOrder: false,
            ...(existing === undefined ? { trailingNewline: 1 } : {}),
          });
    return { content, entryHashes: hashes, conflicts };
  }

  removeMcp(existing: string, ids: string[]): string {
    const base = parseToml(existing, "Codex config");
    const current = base.mcp_servers;
    if (!isRecord(current)) {
      return existing;
    }
    for (const id of ids) {
      delete current[id];
    }
    if (Object.keys(current).length === 0) {
      delete base.mcp_servers;
    }
    return patch(existing, base, { updateOrder: false });
  }

  entryHash(content: string, id: string): string | undefined {
    const base = parseToml(content, "Codex config");
    const table = base.mcp_servers;
    if (!isRecord(table) || !Object.hasOwn(table, id)) {
      return undefined;
    }
    return entryHash(table[id]);
  }

  validateMcp(content: string, expectedIds: string[]): AdapterValidation {
    try {
      const base = parseToml(content, "Codex config");
      const table = base.mcp_servers;
      for (const id of expectedIds) {
        if (!isRecord(table) || !Object.hasOwn(table, id)) {
          return { ok: false, message: "Missing Codex MCP entry " + id };
        }
      }
      return { ok: true, message: "Codex TOML parsed and expected MCP entries exist." };
    } catch (error) {
      return { ok: false, message: errorMessage(error) };
    }
  }
}

function parseToml(content: string, context: string): Record<string, unknown> {
  if (content.trim().length === 0) {
    return {};
  }
  return requireConfigRecord(
    parse(content, { integersAsBigInt: false }),
    context,
  );
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
    http_headers: staticHeaders(server),
  };
  if (server.bearerTokenEnvVar !== undefined) {
    rendered.bearer_token_env_var = server.bearerTokenEnvVar;
  }
  return rendered;
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
