import { profileById } from "./manifest.js";
import type {
  ComponentSelection,
  LoadedPack,
  SelectionOptions,
} from "./types.js";
import { unique } from "./util/values.js";

export function resolveSelection(
  pack: LoadedPack,
  options: SelectionOptions,
): ComponentSelection {
  const profile =
    options.profile === undefined ? undefined : profileById(pack, options.profile);

  let skillIds = profile?.skills ?? [];
  let mcpIds = profile?.mcp ?? [];

  if (options.allSkills === true) {
    skillIds = pack.skills.map((skill) => skill.id);
  } else if (options.skills !== undefined) {
    skillIds = options.skills;
  }

  if (options.allMcp === true) {
    mcpIds = pack.mcp.map((server) => server.id);
  } else if (options.mcp !== undefined) {
    mcpIds = options.mcp;
  }

  skillIds = unique(skillIds);
  mcpIds = unique(mcpIds);
  assertKnown(skillIds, new Set(pack.skills.map((skill) => skill.id)), "skill");
  assertKnown(mcpIds, new Set(pack.mcp.map((server) => server.id)), "MCP server");

  return { skillIds, mcpIds };
}

export function parseComponentList(value: string): string[] {
  if (value.trim().toLowerCase() === "none") {
    return [];
  }
  return value
    .split(",")
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
}

function assertKnown(values: string[], known: Set<string>, kind: string): void {
  for (const value of values) {
    if (!known.has(value)) {
      throw new Error("Unknown " + kind + ": " + value);
    }
  }
}
