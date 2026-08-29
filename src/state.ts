import { lstat, readlink } from "node:fs/promises";
import { basename, dirname, join, resolve } from "node:path";
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
  isSafeSkillName,
  pathsOverlap,
  requireString,
  requireStringArray,
  stableJson,
} from "./util/values.js";
import {
  atomicWrite,
  hashRootFileContent,
  readTextIfExists,
  resolvePhysicalPath,
} from "./util/fs.js";

const LEGACY_SHARED_LAYOUT_PACK_VERSION = "0.2.0";

export async function loadState(path: string): Promise<InstallState | undefined> {
  const text = await readTextIfExists(path);
  return text === undefined ? undefined : parseState(text);
}

export async function captureStateHash(
  layout: HomeLayout,
  state: InstallState | undefined,
): Promise<string | null> {
  const text = await readTextIfExists(layout.stateFile);
  if (text === undefined) {
    if (state !== undefined) {
      throw new Error("AgentPack state disappeared before planning; reload and preview again");
    }
    return null;
  }
  if (state === undefined) {
    throw new Error("AgentPack state appeared before planning; reload and preview again");
  }
  const diskState = parseState(text);
  if (stableJson(diskState) !== stableJson(state)) {
    throw new Error("AgentPack state changed before planning; reload and preview again");
  }
  return hashRootFileContent(text);
}

function parseState(text: string): InstallState {
  const raw = requireRecord(JSON.parse(text), "state.json");
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
  errors.push(...adapterTargetErrors(layout, state.adapters));

  const instructionAdapters: string[] = [];
  for (const entry of state.managed.instructions) {
    instructionAdapters.push(entry.adapter);
    const expected = adapterById(entry.adapter).instructionPath(layout);
    if (
      resolve(entry.path) !== resolve(expected) &&
      !isLegacyInstructionEntry(layout, entry)
    ) {
      errors.push(entry.adapter + " instruction path is outside its owned target");
    }
    if (!state.adapters.includes(entry.adapter)) {
      errors.push(entry.adapter + " instruction owner is absent from state.adapters");
    }
  }
  collectDuplicates(instructionAdapters, "managed instruction adapter", errors);
  for (const adapter of state.adapters) {
    if (!instructionAdapters.includes(adapter)) {
      errors.push(adapter + " has no managed instruction target");
    }
  }

  const skillIds: string[] = [];
  const skillNames: string[] = [];
  let hasLegacySkills = false;
  let hasVendorSkills = false;
  for (const entry of state.managed.skills) {
    if (!isSafeSkillName(entry.name)) {
      errors.push("managed skill has unsafe name " + entry.name);
      continue;
    }
    const owner = managedSkillOwner(layout, entry);
    if (owner === undefined) {
      errors.push("managed skill " + entry.id + " is outside every adapter skills directory");
    } else if (owner === "legacy") {
      hasLegacySkills = true;
      skillIds.push(entry.id);
      skillNames.push(entry.name);
    } else {
      hasVendorSkills = true;
      skillIds.push(owner + ":" + entry.id);
      skillNames.push(owner + ":" + entry.name);
      if (!state.adapters.includes(owner)) {
        errors.push(owner + " skill owner is absent from state.adapters");
      }
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
  if (hasLegacySkills && hasVendorSkills) {
    errors.push("managed skills mix legacy shared and adapter-owned layouts");
  }
  collectDuplicates(skillIds, "managed skill id", errors);
  collectDuplicates(skillNames, "managed skill name", errors);
  const managedSkillIds = new Set(state.managed.skills.map((entry) => entry.id));
  for (const id of state.selection.skillIds) {
    if (!managedSkillIds.has(id)) {
      errors.push("selected skill " + id + " has no managed target");
    }
  }
  for (const id of managedSkillIds) {
    if (!state.selection.skillIds.includes(id)) {
      errors.push("managed skill " + id + " is absent from state.selection");
    }
  }
  if (!hasLegacySkills) {
    const managedPaths = new Set(
      state.managed.skills.map((entry) => resolve(entry.path)),
    );
    for (const adapter of state.adapters) {
      const root = adapterById(adapter).skillsPath(layout);
      for (const id of state.selection.skillIds) {
        const skill = state.managed.skills.find((entry) => entry.id === id);
        if (
          skill !== undefined &&
          !managedPaths.has(resolve(join(root, skill.name)))
        ) {
          errors.push(adapter + " has no managed target for selected skill " + id);
        }
      }
    }
  }

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
  const managedMcpIds = new Set(
    state.managed.mcp.flatMap((entry) => Object.keys(entry.entries)),
  );
  for (const id of state.selection.mcpIds) {
    if (!managedMcpIds.has(id)) {
      errors.push("selected MCP " + id + " has no managed target");
    }
    for (const adapter of state.adapters) {
      const managed = state.managed.mcp.find((entry) => entry.adapter === adapter);
      if (managed?.entries[id] === undefined) {
        errors.push(adapter + " has no managed target for selected MCP " + id);
      }
    }
  }
  for (const id of managedMcpIds) {
    if (!state.selection.mcpIds.includes(id)) {
      errors.push("managed MCP " + id + " is absent from state.selection");
    }
  }

  const legacyLayout = stateUsesLegacyLayout(layout, state);
  if (legacyLayout) {
    if (state.pack.version !== LEGACY_SHARED_LAYOUT_PACK_VERSION) {
      errors.push(
        "legacy shared layout is supported only for AgentPack " +
          LEGACY_SHARED_LAYOUT_PACK_VERSION +
          " state",
      );
    }
    if (state.managed.skills.some((entry) => managedSkillOwner(layout, entry) !== "legacy")) {
      errors.push("legacy state must keep every managed skill in the shared layout");
    }
    for (const entry of state.managed.instructions) {
      const expectedLegacy = entry.adapter === "kimi";
      if (isLegacyInstructionEntry(layout, entry) !== expectedLegacy) {
        errors.push(
          "legacy state has an unsupported " + entry.adapter + " instruction layout",
        );
      }
    }
  }
  return errors;
}

function adapterTargetErrors(
  layout: HomeLayout,
  adapters: AdapterId[],
): string[] {
  return targetRelationshipErrors(
    adapterTargets(layout, adapters),
    resolve(legacyAgentsPath(layout)),
    "targets",
  );
}

export async function adapterTargetSafetyErrors(
  layout: HomeLayout,
  adapters: AdapterId[],
): Promise<string[]> {
  const lexical = adapterTargetErrors(layout, adapters);
  const targets = await Promise.all(
    adapterTargets(layout, adapters).map(async (target) => ({
      ...target,
      path: await resolvePhysicalPath(target.path),
    })),
  );
  const physical = targetRelationshipErrors(
    targets,
    await legacyComparisonPath(layout),
    "physical targets",
  );
  return [...new Set([...lexical, ...physical])];
}

export async function assertAdapterTargetsSafe(
  layout: HomeLayout,
  adapters: AdapterId[],
): Promise<void> {
  const errors = await adapterTargetSafetyErrors(layout, adapters);
  if (errors.length > 0) {
    throw new Error("Unsafe adapter targets: " + errors.join("; "));
  }
}

export async function assertLegacyTargetsSafe(
  layout: HomeLayout,
  includeSkills: boolean,
): Promise<void> {
  const targets = [legacyAgentsPath(layout)];
  if (includeSkills) {
    targets.push(legacySkillsPath(layout));
  }
  for (const target of targets) {
    try {
      const info = await lstat(target);
      if (!info.isDirectory()) {
        throw new Error(
          "Legacy shared user-agent target must be a real directory before migration: " +
            target,
        );
      }
    } catch (error) {
      if (isNotFoundError(error)) {
        continue;
      }
      throw error;
    }
  }
}

async function legacyComparisonPath(layout: HomeLayout): Promise<string> {
  return resolvePathIntent(legacyAgentsPath(layout), new Set());
}

async function resolvePathIntent(
  path: string,
  visited: Set<string>,
): Promise<string> {
  const absolute = resolve(path);
  try {
    return await resolvePhysicalPath(absolute);
  } catch (error) {
    if (!isNotFoundError(error)) {
      throw error;
    }
  }

  let current = absolute;
  const missing: string[] = [];
  while (true) {
    let info;
    try {
      info = await lstat(current);
    } catch (error) {
      if (!isNotFoundError(error)) {
        throw error;
      }
      const parent = dirname(current);
      if (parent === current) {
        throw error;
      }
      missing.unshift(basename(current));
      current = parent;
      continue;
    }
    if (info.isSymbolicLink()) {
      const key = comparisonPath(current);
      if (visited.has(key)) {
        throw new Error("Shared user-agent path contains a symlink cycle: " + current);
      }
      visited.add(key);
      const target = resolve(dirname(current), await readlink(current), ...missing);
      return resolvePathIntent(target, visited);
    }
    return resolve(await resolvePhysicalPath(current), ...missing);
  }
}

function isNotFoundError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: unknown }).code === "ENOENT"
  );
}

interface AdapterTarget {
  adapter: AdapterId;
  component: "instructions" | "skills" | "MCP";
  path: string;
}

function adapterTargets(
  layout: HomeLayout,
  adapters: AdapterId[],
): AdapterTarget[] {
  return adapters.flatMap((adapter) => {
    const implementation = adapterById(adapter);
    return [
      {
        adapter,
        component: "instructions" as const,
        path: implementation.instructionPath(layout),
      },
      {
        adapter,
        component: "skills" as const,
        path: implementation.skillsPath(layout),
      },
      {
        adapter,
        component: "MCP" as const,
        path: implementation.mcpPath(layout),
      },
    ];
  });
}

function targetRelationshipErrors(
  targets: AdapterTarget[],
  prohibited: string,
  label: string,
): string[] {
  const errors: string[] = [];
  const comparableProhibited = comparisonPath(prohibited);
  for (const [index, target] of targets.entries()) {
    if (pathsOverlap(comparableProhibited, comparisonPath(target.path))) {
      errors.push(
        `${target.adapter} ${target.component} ${label} must not use the shared user-agent directory: ${target.path}`,
      );
    }
    for (const existing of targets.slice(0, index)) {
      if (pathsOverlap(comparisonPath(existing.path), comparisonPath(target.path))) {
        errors.push(
          existing.adapter +
            " " +
            existing.component +
            " and " +
            target.adapter +
            " " +
            target.component +
            " " +
            label +
            " overlap",
        );
      }
    }
  }
  return errors;
}

function comparisonPath(path: string): string {
  return resolve(path).toLowerCase();
}

export function stateUsesLegacyLayout(
  layout: HomeLayout,
  state: InstallState,
): boolean {
  return (
    state.managed.instructions.some((entry) =>
      isLegacyInstructionEntry(layout, entry),
    ) || state.managed.skills.some((entry) => managedSkillOwner(layout, entry) === "legacy")
  );
}

export function managedSkillOwner(
  layout: HomeLayout,
  entry: Pick<InstallState["managed"]["skills"][number], "name" | "path">,
): AdapterId | "legacy" | undefined {
  for (const adapter of ["codex", "kimi", "opencode"] as const) {
    const expected = join(adapterById(adapter).skillsPath(layout), entry.name);
    if (resolve(entry.path) === resolve(expected)) {
      return adapter;
    }
  }
  return resolve(entry.path) === resolve(join(legacySkillsPath(layout), entry.name))
    ? "legacy"
    : undefined;
}

export function legacyInstructionPath(layout: HomeLayout): string {
  return join(legacyAgentsPath(layout), "AGENTS.md");
}

export function legacySkillsPath(layout: HomeLayout): string {
  return join(legacyAgentsPath(layout), "skills");
}

export function legacyAgentsPath(layout: HomeLayout): string {
  return join(layout.home, ".agents");
}

function isLegacyInstructionEntry(
  layout: HomeLayout,
  entry: InstallState["managed"]["instructions"][number],
): boolean {
  return (
    entry.adapter === "kimi" &&
    resolve(entry.path) === resolve(legacyInstructionPath(layout))
  );
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
