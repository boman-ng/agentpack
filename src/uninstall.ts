import { adapterById } from "./adapters/index.js";
import { createBackup, restoreBackup } from "./backup.js";
import {
  managedInstructionHash,
  removeManagedInstructions,
} from "./instructions.js";
import { assertPlanCurrent } from "./preconditions.js";
import {
  assertAdapterTargetsSafe,
  assertLegacyTargetsSafe,
  assertStateOwnership,
  captureStateHash,
  legacySkillsPath,
  managedSkillOwner,
  stateUsesLegacyLayout,
} from "./state.js";
import type {
  ChangePlan,
  ConfigConflict,
  FilePlanAction,
  HomeLayout,
  InstallState,
  LoadedPack,
  PlanAction,
  SkillsRemovePlanAction,
} from "./types.js";
import {
  atomicWrite,
  hashPath,
  pathExists,
  readTextIfExists,
  removePath,
} from "./util/fs.js";
import { sha256, unique } from "./util/values.js";

export async function buildUninstallPlan(
  pack: LoadedPack,
  layout: HomeLayout,
  state: InstallState,
): Promise<ChangePlan> {
  assertStateOwnership(pack, layout, state);
  const expectedStateHash = await captureStateHash(layout, state);
  await assertAdapterTargetsSafe(layout, state.adapters);
  if (stateUsesLegacyLayout(layout, state)) {
    await assertLegacyTargetsSafe(
      layout,
      state.managed.skills.some(
        (entry) => managedSkillOwner(layout, entry) === "legacy",
      ),
    );
  }
  const actions: PlanAction[] = [];
  const conflicts: ConfigConflict[] = [];

  for (const entry of state.managed.instructions) {
    const existing = await readTextIfExists(entry.path);
    if (existing === undefined) {
      continue;
    }
    let after: string | null;
    if (entry.strategy === "managed-block") {
      const actual = managedInstructionHash(existing);
      if (actual !== entry.contentHash) {
        conflicts.push({
          target: entry.path,
          component: "instructions:" + entry.adapter,
          message: "Managed instruction block is missing or has been modified.",
        });
        continue;
      }
      const remaining = removeManagedInstructions(existing);
      after = remaining.trim().length === 0 ? null : remaining;
    } else {
      if (sha256(existing) !== entry.contentHash) {
        conflicts.push({
          target: entry.path,
          component: "instructions:" + entry.adapter,
          message: "Overwrite-installed instructions were modified after installation.",
        });
        continue;
      }
      after = null;
    }
    const action: FilePlanAction = {
      kind: "file",
      component: "instructions",
      adapter: entry.adapter,
      target: entry.path,
      operation: after === null ? "delete" : "replace",
      before: existing,
      after,
      summary: "Remove only AgentPack-managed global instructions.",
      strategy: entry.strategy,
    };
    actions.push(action);
  }

  const skillGroups = new Map<
    string,
    {
      adapter: SkillsRemovePlanAction["adapter"];
      target: string;
      entries: SkillsRemovePlanAction["entries"];
    }
  >();
  for (const entry of state.managed.skills) {
    if (!(await pathExists(entry.path))) {
      continue;
    }
    const actual = await hashPath(entry.path);
    if (actual !== entry.contentHash) {
      conflicts.push({
        target: entry.path,
        component: "skill:" + entry.id,
        message: "Installed skill was modified after installation.",
      });
      continue;
    }
    const owner = managedSkillOwner(layout, entry);
    if (owner === undefined) {
      throw new Error("Managed skill has no owning adapter: " + entry.id);
    }
    const target =
      owner === "legacy"
        ? legacySkillsPath(layout)
        : adapterById(owner).skillsPath(layout);
    const group = skillGroups.get(target) ?? {
      adapter: owner,
      target,
      entries: [],
    };
    group.entries.push({
      id: entry.id,
      name: entry.name,
      target: entry.path,
      beforeHash: actual,
    });
    skillGroups.set(target, group);
  }
  for (const group of skillGroups.values()) {
    actions.push({
      kind: "skills-remove",
      adapter: group.adapter,
      target: group.target,
      entries: group.entries,
      summary:
        "Remove AgentPack-managed skills and preserve unrelated vendor skill directories.",
    });
  }

  for (const entry of state.managed.mcp) {
    const existing = await readTextIfExists(entry.path);
    if (existing === undefined) {
      continue;
    }
    const adapter = adapterById(entry.adapter);
    let safe = true;
    for (const [id, expectedHash] of Object.entries(entry.entries)) {
      if (adapter.entryHash(existing, id) !== expectedHash) {
        conflicts.push({
          target: entry.path,
          component: "mcp:" + entry.adapter + "/" + id,
          message: "Managed MCP entry is missing or was modified after installation.",
        });
        safe = false;
      }
    }
    if (!safe) {
      continue;
    }
    const after = adapter.removeMcp(existing, Object.keys(entry.entries));
    if (after !== existing) {
      actions.push({
        kind: "file",
        component: "mcp",
        adapter: entry.adapter,
        target: entry.path,
        operation: "merge",
        before: existing,
        after,
        summary: "Remove AgentPack-managed MCP keys and preserve all other configuration.",
        entryHashes: {},
      });
    }
  }

  const backupTargets = unique([
    layout.stateFile,
    ...actions.flatMap((action) => {
      if (action.kind === "file") {
        return [action.target];
      }
      return action.entries.map((entry) => entry.target);
    }),
  ]);

  return {
    packName: pack.name,
    packVersion: pack.version,
    mode: state.mode,
    adapters: [...state.adapters],
    selection: {
      skillIds: [...state.selection.skillIds],
      mcpIds: [...state.selection.mcpIds],
    },
    actions,
    conflicts,
    backupTargets,
    expectedStateHash,
    resolvedSources: [],
    temporaryPaths: [],
    uninstall: true,
    reconcile: false,
  };
}

export async function applyUninstallPlan(
  layout: HomeLayout,
  plan: ChangePlan,
): Promise<string | undefined> {
  if (!plan.uninstall) {
    throw new Error("Uninstall apply received an install plan");
  }
  if (plan.conflicts.length > 0) {
    throw new Error("Uninstall plan has conflicts and cannot be applied");
  }
  await assertPlanCurrent(layout, plan);
  const backup = await createBackup(layout, plan.backupTargets);
  try {
    for (const action of plan.actions) {
      await applyUninstallAction(action);
    }
    await removePath(layout.stateFile);
    return backup?.path;
  } catch (error) {
    if (backup !== undefined) {
      try {
        await restoreBackup(backup);
      } catch (rollbackError) {
        throw new Error(
          "Uninstall failed: " +
            errorMessage(error) +
            ". Rollback also failed: " +
            errorMessage(rollbackError),
        );
      }
    }
    throw error;
  }
}

async function applyUninstallAction(action: PlanAction): Promise<void> {
  if (action.kind === "file") {
    if (action.after === null) {
      await removePath(action.target);
    } else {
      await atomicWrite(action.target, action.after);
    }
    return;
  }
  if (action.kind === "skills") {
    throw new Error("Uninstall plan cannot install skills");
  }
  for (const entry of action.entries) {
    await removePath(entry.target);
  }
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
