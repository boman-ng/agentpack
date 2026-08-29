import { resolve } from "node:path";
import { adapterById } from "./adapters/index.js";
import { createBackup, restoreBackup } from "./backup.js";
import { managedInstructionHash } from "./instructions.js";
import { mcpById } from "./manifest.js";
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
  replacePath,
} from "./util/fs.js";
import { sha256, unique } from "./util/values.js";
import { assertStateOwnership, writeState } from "./state.js";

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
    await assertPlanCurrent(layout, plan);
    await validateManagedState(previousState);
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
    assertStateOwnership(pack, layout, state);
    await validateManagedState(state);
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

async function validateManagedState(state: InstallState): Promise<void> {
  for (const entry of state.managed.instructions) {
    const content = await readTextIfExists(entry.path);
    const actual =
      content === undefined
        ? undefined
        : entry.strategy === "managed-block"
          ? managedInstructionHash(content)
          : sha256(content);
    if (actual !== entry.contentHash) {
      throw new Error(
        "Managed instructions changed during apply: " + entry.adapter,
      );
    }
  }
  for (const entry of state.managed.skills) {
    const actual = (await pathExists(entry.path))
      ? await hashPath(entry.path)
      : undefined;
    if (actual !== entry.contentHash) {
      throw new Error("Managed skill changed during apply: " + entry.id);
    }
  }
  for (const entry of state.managed.mcp) {
    const content = await readTextIfExists(entry.path);
    const adapter = adapterById(entry.adapter);
    for (const [id, expected] of Object.entries(entry.entries)) {
      const actual = content === undefined ? undefined : adapter.entryHash(content, id);
      if (actual !== expected) {
        throw new Error(
          "Managed MCP entry changed during apply: " + entry.adapter + "/" + id,
        );
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
  const instructions = mergeInstructions(layout, previous, plan);
  const skills = await mergeSkills(previous, plan);
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
      skillIds: unique(skills.map((entry) => entry.id)),
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
  layout: HomeLayout,
  previous: InstallState | undefined,
  plan: ChangePlan,
): ManagedInstruction[] {
  const byAdapter = new Map(
    (previous?.managed.instructions ?? []).map((entry) => [entry.adapter, entry]),
  );
  for (const action of plan.actions) {
    if (action.kind !== "file" || action.component !== "instructions") {
      continue;
    }
    const current = byAdapter.get(action.adapter);
    const ownsVendorTarget =
      resolve(action.target) ===
      resolve(adapterById(action.adapter).instructionPath(layout));
    if (action.after === null || !ownsVendorTarget) {
      if (
        current !== undefined &&
        resolve(current.path) === resolve(action.target)
      ) {
        byAdapter.delete(action.adapter);
      }
      continue;
    }
    const strategy = action.strategy ?? "overwrite";
    const contentHash =
      strategy === "managed-block"
        ? managedInstructionHash(action.after)
        : sha256(action.after);
    if (contentHash === undefined) {
      throw new Error(
        "Managed instruction block was not written for " + action.adapter,
      );
    }
    byAdapter.set(action.adapter, {
      adapter: action.adapter,
      path: action.target,
      strategy,
      contentHash,
    });
  }
  return [...byAdapter.values()].sort((a, b) => a.adapter.localeCompare(b.adapter));
}

async function mergeSkills(
  previous: InstallState | undefined,
  plan: ChangePlan,
): Promise<ManagedSkill[]> {
  const byPath = new Map(
    (previous?.managed.skills ?? []).map((entry) => [resolve(entry.path), entry]),
  );
  for (const action of plan.actions) {
    if (action.kind === "skills-remove") {
      for (const entry of action.entries) {
        byPath.delete(resolve(entry.target));
      }
      continue;
    }
    if (action.kind !== "skills") {
      continue;
    }
    for (const entry of action.entries) {
      byPath.set(resolve(entry.target), {
        id: entry.id,
        name: entry.name,
        path: entry.target,
        contentHash: await hashPath(entry.target),
        source: entry.sourceRevision,
      });
    }
  }
  return [...byPath.values()].sort(
    (a, b) => a.id.localeCompare(b.id) || a.path.localeCompare(b.path),
  );
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
    const action = plan.actions.find(
      (candidate) =>
        candidate.kind === "file" &&
        candidate.component === "mcp" &&
        candidate.adapter === adapterId,
    );
    if (action === undefined) {
      continue;
    }
    const adapter = adapterById(adapterId);
    const path = adapter.mcpPath(layout);
    if (resolve(action.target) !== resolve(path)) {
      throw new Error("MCP action is outside its adapter target: " + adapterId);
    }
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
    if (Object.keys(current.entries).length === 0) {
      byAdapter.delete(adapterId);
    } else {
      byAdapter.set(adapterId, current);
    }
  }
  return [...byAdapter.values()]
    .filter((entry) => Object.keys(entry.entries).length > 0)
    .sort((a, b) => a.adapter.localeCompare(b.adapter));
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
