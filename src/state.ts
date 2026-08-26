import { readFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { adapterById } from "./adapters/index.js";
import type {
  AdapterId,
  HomeLayout,
  InstallState,
  LoadedPack,
  SkillSourceRevision,
} from "./types.js";
import {
  requireRecord,
  requireString,
  requireStringArray,
} from "./util/values.js";
import { atomicWrite, pathExists } from "./util/fs.js";

export async function loadState(path: string): Promise<InstallState | undefined> {
  if (!(await pathExists(path))) {
    return undefined;
  }
  const raw = requireRecord(JSON.parse(await readFile(path, "utf8")), "state.json");
  if (raw.schemaVersion !== 1) {
    throw new Error("Unsupported AgentPack state schema");
  }
  const packRaw = requireRecord(raw.pack, "state.pack");
  const mode = requireString(raw.mode, "state.mode");
  if (mode !== "overwrite" && mode !== "append") {
    throw new Error("Invalid state.mode");
  }
  const adapterStrings = requireStringArray(raw.adapters, "state.adapters");
  const adapters = adapterStrings.map(parseAdapter);
  const selectionRaw = requireRecord(raw.selection, "state.selection");
  const managedRaw = requireRecord(raw.managed, "state.managed");
  if (
    !Array.isArray(managedRaw.instructions) ||
    !Array.isArray(managedRaw.skills) ||
    !Array.isArray(managedRaw.mcp)
  ) {
    throw new Error("state.managed collections must be arrays");
  }

  const state: InstallState = {
    schemaVersion: 1,
    pack: {
      name: requireString(packRaw.name, "state.pack.name"),
      version: requireString(packRaw.version, "state.pack.version"),
    },
    installedAt: requireString(raw.installedAt, "state.installedAt"),
    mode,
    adapters,
    selection: {
      skillIds: requireStringArray(selectionRaw.skillIds, "state.selection.skillIds"),
      mcpIds: requireStringArray(selectionRaw.mcpIds, "state.selection.mcpIds"),
    },
    managed: {
      instructions: managedRaw.instructions.map((value, index) => {
        const entry = requireRecord(value, "state.managed.instructions[" + index + "]");
        const strategy = requireString(entry.strategy, "instruction.strategy");
        if (strategy !== "overwrite" && strategy !== "managed-block") {
          throw new Error("Invalid instruction strategy");
        }
        return {
          adapter: parseAdapter(requireString(entry.adapter, "instruction.adapter")),
          path: requireString(entry.path, "instruction.path"),
          strategy,
          contentHash: requireString(entry.contentHash, "instruction.contentHash"),
        };
      }),
      skills: managedRaw.skills.map((value, index) => {
        const entry = requireRecord(value, "state.managed.skills[" + index + "]");
        return {
          id: requireString(entry.id, "skill.id"),
          name: requireString(entry.name, "skill.name"),
          path: requireString(entry.path, "skill.path"),
          contentHash: requireString(entry.contentHash, "skill.contentHash"),
          source: parseSkillSourceRevision(entry.source),
        };
      }),
      mcp: managedRaw.mcp.map((value, index) => {
        const entry = requireRecord(value, "state.managed.mcp[" + index + "]");
        const entriesRaw = requireRecord(entry.entries, "MCP entries");
        const entries: Record<string, string> = {};
        for (const [id, hash] of Object.entries(entriesRaw)) {
          entries[id] = requireString(hash, "MCP entry hash");
        }
        return {
          adapter: parseAdapter(requireString(entry.adapter, "MCP adapter")),
          path: requireString(entry.path, "MCP path"),
          entries,
        };
      }),
    },
  };
  if (raw.lastBackup !== undefined) {
    state.lastBackup = requireString(raw.lastBackup, "state.lastBackup");
  }
  return state;
}

export async function writeState(path: string, state: InstallState): Promise<void> {
  await atomicWrite(path, JSON.stringify(state, null, 2) + "\n");
}

export function assertStateOwnership(
  pack: LoadedPack,
  layout: HomeLayout,
  state: InstallState,
): void {
  const errors = stateOwnershipErrors(pack, layout, state);
  if (errors.length > 0) {
    throw new Error("Unsafe or inconsistent AgentPack state: " + errors.join("; "));
  }
}

export function stateOwnershipErrors(
  pack: LoadedPack,
  layout: HomeLayout,
  state: InstallState,
): string[] {
  const errors: string[] = [];
  if (state.pack.name !== pack.name) {
    errors.push("pack name is " + state.pack.name + ", expected " + pack.name);
  }
  collectDuplicates(state.adapters, "adapter", errors);
  collectDuplicates(state.selection.skillIds, "selected skill", errors);
  collectDuplicates(state.selection.mcpIds, "selected MCP", errors);

  const instructionAdapters: string[] = [];
  for (const entry of state.managed.instructions) {
    instructionAdapters.push(entry.adapter);
    const expected = adapterById(entry.adapter).instructionPath(layout);
    if (resolve(entry.path) !== resolve(expected)) {
      errors.push(entry.adapter + " instruction path is outside its owned target");
    }
    if (!state.adapters.includes(entry.adapter)) {
      errors.push(entry.adapter + " instruction owner is absent from state.adapters");
    }
  }
  collectDuplicates(instructionAdapters, "managed instruction adapter", errors);

  const skillIds: string[] = [];
  const skillNames: string[] = [];
  for (const entry of state.managed.skills) {
    skillIds.push(entry.id);
    skillNames.push(entry.name);
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(entry.name)) {
      errors.push("managed skill has unsafe name " + entry.name);
      continue;
    }
    if (resolve(entry.path) !== resolve(join(layout.sharedSkills, entry.name))) {
      errors.push("managed skill " + entry.id + " is outside the shared skills directory");
    }
    if (entry.source.kind === "git") {
      if (!/^refs\/heads\/[A-Za-z0-9._/-]+$/.test(entry.source.ref ?? "")) {
        errors.push("managed skill " + entry.id + " has an invalid Git ref");
      }
      if (!/^[0-9a-f]{40,64}$/.test(entry.source.commit ?? "")) {
        errors.push("managed skill " + entry.id + " has an invalid Git commit");
      }
    }
  }
  collectDuplicates(skillIds, "managed skill id", errors);
  collectDuplicates(skillNames, "managed skill name", errors);

  const mcpAdapters: string[] = [];
  for (const entry of state.managed.mcp) {
    mcpAdapters.push(entry.adapter);
    const expected = adapterById(entry.adapter).mcpPath(layout);
    if (resolve(entry.path) !== resolve(expected)) {
      errors.push(entry.adapter + " MCP path is outside its owned target");
    }
    if (!state.adapters.includes(entry.adapter)) {
      errors.push(entry.adapter + " MCP owner is absent from state.adapters");
    }
    for (const id of Object.keys(entry.entries)) {
      if (!/^[A-Za-z0-9._-]+$/.test(id)) {
        errors.push("managed MCP has unsafe id " + id);
      }
    }
  }
  collectDuplicates(mcpAdapters, "managed MCP adapter", errors);
  return errors;
}

function parseSkillSourceRevision(value: unknown): SkillSourceRevision {
  const raw = requireRecord(value, "skill.source");
  const kind = requireString(raw.kind, "skill.source.kind");
  const base = {
    id: requireString(raw.id, "skill.source.id"),
    repository: requireString(raw.repository, "skill.source.repository"),
  };
  if (kind === "git") {
    return {
      ...base,
      kind,
      ref: requireString(raw.ref, "skill.source.ref"),
      commit: requireString(raw.commit, "skill.source.commit"),
    };
  }
  if (kind === "local") {
    return {
      ...base,
      kind,
      packVersion: requireString(raw.packVersion, "skill.source.packVersion"),
    };
  }
  throw new Error("Invalid skill.source.kind");
}

function collectDuplicates(values: string[], kind: string, errors: string[]): void {
  const seen = new Set<string>();
  for (const value of values) {
    if (seen.has(value)) {
      errors.push("duplicate " + kind + " " + value);
    }
    seen.add(value);
  }
}

function parseAdapter(value: string): AdapterId {
  if (value !== "codex" && value !== "kimi" && value !== "opencode") {
    throw new Error("Unknown adapter in state: " + value);
  }
  return value;
}
