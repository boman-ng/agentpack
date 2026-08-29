import type { ChangePlan, HomeLayout } from "./types.js";
import {
  assertAdapterTargetsSafe,
  assertLegacyTargetsSafe,
  legacyAgentsPath,
} from "./state.js";
import { hashPath, pathExists, readTextIfExists } from "./util/fs.js";
import { isPathInside } from "./util/values.js";

export async function assertPlanCurrent(
  layout: HomeLayout,
  plan: ChangePlan,
): Promise<void> {
  await assertAdapterTargetsSafe(layout, plan.adapters);
  const legacyRoot = legacyAgentsPath(layout);
  const legacyActions = plan.actions.filter((action) =>
    isPathInside(legacyRoot, action.target),
  );
  if (legacyActions.length > 0) {
    await assertLegacyTargetsSafe(
      layout,
      legacyActions.some(
        (action) => action.kind === "skills-remove" && action.adapter === "legacy",
      ),
    );
  }
  await assertHashPrecondition(layout.stateFile, plan.expectedStateHash);
  for (const action of plan.actions) {
    if (action.kind === "file") {
      if ((await readTextIfExists(action.target)) !== action.before) {
        throw stalePlanError(action.target);
      }
      continue;
    }
    if (action.kind === "skills") {
      for (const entry of action.entries) {
        await assertHashPrecondition(entry.target, entry.beforeHash);
        await assertSourceCurrent(entry.source, entry.sourceHash, entry.id);
      }
      continue;
    }
    for (const entry of action.entries) {
      await assertHashPrecondition(entry.target, entry.beforeHash);
    }
  }
}

async function assertSourceCurrent(path: string, expected: string, id: string): Promise<void> {
  const actual = (await pathExists(path)) ? await hashPath(path) : null;
  if (actual !== expected) {
    throw new Error("Prepared online source changed or expired; preview again: " + id);
  }
}

async function assertHashPrecondition(path: string, expected: string | null): Promise<void> {
  const actual = (await pathExists(path)) ? await hashPath(path) : null;
  if (actual !== expected) {
    throw stalePlanError(path);
  }
}

function stalePlanError(path: string): Error {
  return new Error("Plan is stale because this target changed; preview again: " + path);
}
