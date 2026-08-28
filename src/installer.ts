import { join } from "node:path";
import { adapterById } from "./adapters/index.js";
import { createBackup, restoreBackup } from "./backup.js";
import { managedInstructionHash } from "./instructions.js";
import { mcpById, skillById } from "./manifest.js";
import { assertPlanCurrent } from "./preconditions.js";
import { disposeInstallPlan } from "./sources.js";
import type {
  ChangePlan,
  HomeLayout,
  InstallState,
  LoadedPack,
  ManagedInstruction,
  ManagedMcp,
  ManagedSkill,
  PlanAction,
} from "./types.js";
import {
  atomicWrite,
  hashPath,
  pathExists,
  readTextIfExists,
  removePath,
  replaceDirectory,
  replacePath,
} from "./util/fs.js";
import { sha256, unique } from "./util/values.js";
import { writeState } from "./state.js";

export interface ApplyResult {
  state: InstallState;
  backupPath?: string;
}

export async function applyInstallPlan(
  pack: LoadedPack,
  layout: HomeLayout,
  plan: ChangePlan,
  previousState?: InstallState,
): Promise<ApplyResult> {
  try {
    return await applyPreparedInstallPlan(pack, layout, plan, previousState);
  } finally {
    await disposeInstallPlan(plan);
  }
}

async function applyPreparedInstallPlan(
  pack: LoadedPack,
  layout: HomeLayout,
  plan: ChangePlan,
  previousState?: InstallState,
): Promise<ApplyResult> {
  if (plan.uninstall) {
    throw new Error("Install apply received an uninstall plan");
  }
  if (plan.conflicts.length > 0) {
    throw new Error("Plan has conflicts and cannot be applied");
  }
  if (plan.actions.length === 0) {
    if (previousState === undefined) {
      throw new Error("Nothing to apply and no AgentPack state exists");
    }
    return { state: previousState };
  }

  await assertPlanCurrent(layout, plan);
  const backup = await createBackup(layout, plan.backupTargets);
  try {
    for (const action of plan.actions) {
      await applyAction(action);
    }
    await validateAppliedPlan(plan);
    const state = await buildNextState(pack, layout, plan, previousState, backup?.path);
    await writeState(layout.stateFile, state);
    const result: ApplyResult = { state };
    if (backup !== undefined) {
      result.backupPath = backup.path;
    }
    return result;
  } catch (error) {
    if (backup !== undefined) {
      try {
        await restoreBackup(backup);
      } catch (rollbackError) {
        throw new Error(
          "Install failed: " +
            errorMessage(error) +
            ". Rollback also failed: " +
            errorMessage(rollbackError),
        );
      }
    }
    throw error;
  }
}

async function applyAction(action: PlanAction): Promise<void> {
  if (action.kind === "file") {
    if (action.operation === "adopt") {
      return;
    }
    if (action.after === null) {
      await removePath(action.target);
    } else {
      await atomicWrite(action.target, action.after);
    }
    return;
  }
  if (action.kind === "skills-remove") {
    for (const entry of action.entries) {
      await removePath(entry.target);
    }
    return;
  }
  if (action.operation === "replace") {
    await replaceDirectory(
      action.target,
      action.entries.map((entry) => ({ source: entry.source, name: entry.name })),
    );
    return;
  }
  for (const entry of action.entries) {
    if (entry.operation === "adopt") {
      continue;
    }
    await replacePath(entry.source, entry.target);
  }
}

async function validateAppliedPlan(plan: ChangePlan): Promise<void> {
  for (const action of plan.actions) {
    if (action.kind === "file") {
      const actual = await readTextIfExists(action.target);
      const expected = action.after === null ? undefined : action.after;
      if (actual !== expected) {
        throw new Error("Post-write validation failed for " + action.target);
      }
      if (action.component === "mcp" && action.after !== null) {
        const expectedIds = Object.keys(action.entryHashes ?? {});
        const validation = adapterById(action.adapter).validateMcp(action.after, expectedIds);
        if (!validation.ok) {
          throw new Error(validation.message);
        }
      }
      continue;
    }
    if (action.kind === "skills") {
      for (const entry of action.entries) {
        const targetHash = await hashPath(entry.target);
        if (entry.sourceHash !== targetHash) {
          throw new Error("Installed skill hash mismatch: " + entry.id);
        }
      }
      continue;
    }
    for (const entry of action.entries) {
      if (await pathExists(entry.target)) {
        throw new Error("Removed skill still exists: " + entry.id);
      }
    }
  }
}

async function buildNextState(
  pack: LoadedPack,
  layout: HomeLayout,
  plan: ChangePlan,
  previousState: InstallState | undefined,
  backupPath: string | undefined,
): Promise<InstallState> {
  const previous =
    previousState?.pack.name === pack.name ? previousState : undefined;
  const instructions = mergeInstructions(previous, plan);
  const skills = await mergeSkills(pack, layout, previous, plan);
  const mcp = await mergeMcp(pack, layout, previous, plan);
  const adapters: InstallState["adapters"] = unique([
    ...(previous?.adapters ?? []),
    ...plan.adapters,
  ]);
  const state: InstallState = {
    schemaVersion: 1,
    pack: { name: pack.name, version: pack.version },
    installedAt: new Date().toISOString(),
    mode: plan.mode,
    adapters,
    selection: {
      skillIds: skills.map((entry) => entry.id),
      mcpIds: unique(mcp.flatMap((entry) => Object.keys(entry.entries))),
    },
    managed: {
      instructions,
      skills,
      mcp,
    },
  };
  if (backupPath !== undefined) {
    state.lastBackup = backupPath;
  }
  return state;
}

function mergeInstructions(
  previous: InstallState | undefined,
  plan: ChangePlan,
): ManagedInstruction[] {
  const byAdapter = new Map(
    (previous?.managed.instructions ?? []).map((entry) => [entry.adapter, entry]),
  );
  for (const adapterId of plan.adapters) {
    const action = plan.actions.find(
      (candidate) =>
        candidate.kind === "file" &&
        candidate.component === "instructions" &&
        candidate.adapter === adapterId,
    );
    if (action === undefined || action.kind !== "file" || action.after === null) {
      continue;
    }
    const strategy = action.strategy ?? "overwrite";
    const contentHash =
      strategy === "managed-block"
        ? managedInstructionHash(action.after)
        : sha256(action.after);
    if (contentHash === undefined) {
      throw new Error("Managed instruction block was not written for " + adapterId);
    }
    byAdapter.set(adapterId, {
      adapter: adapterId,
      path: action.target,
      strategy,
      contentHash,
    });
  }
  return [...byAdapter.values()].sort((a, b) => a.adapter.localeCompare(b.adapter));
}

async function mergeSkills(
  pack: LoadedPack,
  layout: HomeLayout,
  previous: InstallState | undefined,
  plan: ChangePlan,
): Promise<ManagedSkill[]> {
  const byId =
    plan.mode === "overwrite"
      ? new Map<string, ManagedSkill>()
      : new Map((previous?.managed.skills ?? []).map((entry) => [entry.id, entry]));
  const installedEntries = new Map(
    plan.actions
      .filter((action) => action.kind === "skills")
      .flatMap((action) => (action.kind === "skills" ? action.entries : []))
      .map((entry) => [entry.id, entry]),
  );
  for (const id of plan.selection.skillIds) {
    const skill = skillById(pack, id);
    const path = join(layout.sharedSkills, skill.name);
    const source = installedEntries.get(id)?.sourceRevision ?? byId.get(id)?.source;
    if (source === undefined) {
      throw new Error("Installed skill has no resolved source revision: " + id);
    }
    byId.set(id, {
      id,
      name: skill.name,
      path,
      contentHash: await hashPath(path),
      source,
    });
  }
  return [...byId.values()].sort((a, b) => a.id.localeCompare(b.id));
}

async function mergeMcp(
  pack: LoadedPack,
  layout: HomeLayout,
  previous: InstallState | undefined,
  plan: ChangePlan,
): Promise<ManagedMcp[]> {
  const byAdapter = new Map(
    (previous?.managed.mcp ?? []).map((entry) => [
      entry.adapter,
      { ...entry, entries: { ...entry.entries } },
    ]),
  );
  for (const adapterId of plan.adapters) {
    const adapter = adapterById(adapterId);
    const path = adapter.mcpPath(layout);
    const content = (await readTextIfExists(path)) ?? "";
    const current =
      plan.mode === "overwrite"
        ? { adapter: adapterId, path, entries: {} as Record<string, string> }
        : byAdapter.get(adapterId) ?? {
            adapter: adapterId,
            path,
            entries: {} as Record<string, string>,
          };
    for (const id of plan.selection.mcpIds) {
      mcpById(pack, id);
      const hash = adapter.entryHash(content, id);
      if (hash === undefined) {
        throw new Error("Installed MCP entry is missing after apply: " + adapterId + "/" + id);
      }
      current.entries[id] = hash;
    }
    byAdapter.set(adapterId, current);
  }
  return [...byAdapter.values()]
    .filter((entry) => Object.keys(entry.entries).length > 0)
    .sort((a, b) => a.adapter.localeCompare(b.adapter));
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
