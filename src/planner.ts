import { readFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { adapterById } from "./adapters/index.js";
import {
  appendInstructions,
  managedInstructionBlock,
  managedInstructionHash,
  removeManagedInstructions,
} from "./instructions.js";
import { mcpById } from "./manifest.js";
import {
  disposePreparedSkills,
  prepareSelectedSkills,
  type PreparedSkill,
} from "./sources.js";
import {
  assertAdapterTargetsSafe,
  assertLegacyTargetsSafe,
  assertStateOwnership,
  captureStateHash,
  legacyInstructionPath,
  legacySkillsPath,
  managedSkillOwner,
  stateUsesLegacyLayout,
} from "./state.js";
import type {
  AdapterId,
  AgentAdapter,
  ChangePlan,
  ComponentSelection,
  ConfigConflict,
  FilePlanAction,
  HomeLayout,
  InstallMode,
  InstallState,
  LoadedPack,
  McpDefinition,
  ReconciliationOptions,
  ReconciliationSummary,
  SkillInstallEntry,
  SkillsPlanAction,
  SkillsRemovePlanAction,
} from "./types.js";
import { hashPath, pathExists, readTextIfExists } from "./util/fs.js";
import { sha256, unique } from "./util/values.js";

export interface InstallPlanOptions {
  mode: InstallMode;
  adapters: AdapterId[];
  selection: ComponentSelection;
  previousState?: InstallState;
  reconciliation?: ReconciliationOptions;
}

export async function buildInstallPlan(
  pack: LoadedPack,
  layout: HomeLayout,
  options: InstallPlanOptions,
): Promise<ChangePlan> {
  if (options.previousState !== undefined) {
    assertStateOwnership(pack, layout, options.previousState);
  }
  if (new Set(options.adapters).size !== options.adapters.length) {
    throw new Error("Install adapters must be unique");
  }
  const expectedStateHash = await captureStateHash(layout, options.previousState);
  const migratingLegacy =
    options.previousState !== undefined &&
    stateUsesLegacyLayout(layout, options.previousState);
  if (migratingLegacy) {
    assertLegacyMigrationRequest(options);
    await assertLegacyTargetsSafe(
      layout,
      options.previousState?.managed.skills.some(
        (entry) => managedSkillOwner(layout, entry) === "legacy",
      ) ?? false,
    );
  }
  assertAdapterScopeIncludesState(options);
  await assertAdapterTargetsSafe(layout, options.adapters);
  if (options.reconciliation !== undefined && options.mode !== "append") {
    throw new Error("Ownership reconciliation requires append mode");
  }
  assertKeepDoesNotSplitOwnership(options.reconciliation, options.previousState);
  const requestedSelection = effectiveSelection(
    options.selection,
    options.reconciliation,
  );
  const selection: ComponentSelection = {
    skillIds:
      options.mode === "append"
        ? unique([
            ...(options.previousState?.selection.skillIds ?? []),
            ...requestedSelection.skillIds,
          ])
        : requestedSelection.skillIds,
    mcpIds:
      options.mode === "append"
        ? unique([
            ...(options.previousState?.selection.mcpIds ?? []),
            ...requestedSelection.mcpIds,
          ])
        : requestedSelection.mcpIds,
  };
  const reconciliation: ReconciliationSummary = {
    adopted: [],
    replaced: [],
    kept: keptComponents(options.reconciliation),
  };
  const actions: ChangePlan["actions"] = [];
  const conflicts: ConfigConflict[] = [];
  const instructionPayload = await readFile(pack.instructionPath, "utf8");

  if (migratingLegacy && options.previousState !== undefined) {
    actions.push(
      ...(await buildLegacyRemovalActions(layout, options.previousState, conflicts)),
    );
  }

  for (const adapterId of options.adapters) {
    const adapter = adapterById(adapterId);
    const instructionTarget = adapter.instructionPath(layout);
    const existingInstructions = await readTextIfExists(instructionTarget);
    const previousInstruction = options.previousState?.managed.instructions.find(
      (entry) => entry.adapter === adapterId,
    );
    const previousInstructionAtTarget =
      previousInstruction !== undefined &&
      resolve(previousInstruction.path) === resolve(instructionTarget)
        ? previousInstruction
        : undefined;
    let instructionSafe = true;
    if (options.mode === "append" && previousInstructionAtTarget !== undefined) {
      const actualHash =
        existingInstructions === undefined
          ? undefined
          : previousInstructionAtTarget.strategy === "managed-block"
            ? managedInstructionHash(existingInstructions)
            : sha256(existingInstructions);
      if (actualHash !== previousInstructionAtTarget.contentHash) {
        conflicts.push({
          target: instructionTarget,
          component: "instructions:" + adapterId,
          message: "Managed instructions were modified after installation.",
        });
        instructionSafe = false;
      }
    }
    const instructionAfter =
      options.mode === "overwrite"
        ? instructionPayload
        : previousInstructionAtTarget?.strategy === "overwrite"
          ? managedInstructionBlock(instructionPayload)
          : appendInstructions(existingInstructions, instructionPayload);
    const instructionStrategy =
      options.mode === "overwrite" ? "overwrite" : "managed-block";
    const instructionHash =
      instructionStrategy === "managed-block"
        ? managedInstructionHash(instructionAfter)
        : sha256(instructionAfter);
    if (instructionHash === undefined) {
      throw new Error("Unable to hash planned instructions for " + adapterId);
    }
    const instructionOwnershipChanges =
      previousInstructionAtTarget === undefined ||
      previousInstructionAtTarget.strategy !== instructionStrategy ||
      previousInstructionAtTarget.contentHash !== instructionHash;
    if (
      instructionSafe &&
      (instructionAfter !== existingInstructions ||
        instructionOwnershipChanges)
    ) {
      const operation =
        instructionAfter === existingInstructions
          ? "adopt"
          : existingInstructions === undefined
          ? "create"
          : options.mode === "overwrite"
            ? "replace"
            : "append";
      const action: FilePlanAction = {
        kind: "file",
        component: "instructions",
        adapter: adapterId,
        target: instructionTarget,
        operation,
        before: existingInstructions,
        after: instructionAfter,
        summary:
          options.mode === "overwrite"
            ? "Install canonical global instructions."
            : "Append or refresh the AgentPack managed instruction block.",
        strategy: instructionStrategy,
      };
      actions.push(action);
    }

    const mcpTarget = adapter.mcpPath(layout);
    const existingMcp = await readTextIfExists(mcpTarget);
    const previousMcp = options.previousState?.managed.mcp.find(
      (entry) => entry.adapter === adapterId,
    );
    const servers = selection.mcpIds.map((id) => mcpById(pack, id));
    if (options.mode === "overwrite" || servers.length > 0) {
      const ownedIds = new Set(Object.keys(previousMcp?.entries ?? {}));
      let mcpSafe = true;
      const adoptedMcpIds = new Set<string>();
      if (options.mode === "append") {
        const previousEntries = previousMcp?.entries ?? {};
        for (const server of servers) {
          const expectedHash = previousEntries[server.id];
          if (
            expectedHash !== undefined &&
            (existingMcp === undefined || adapter.entryHash(existingMcp, server.id) !== expectedHash)
          ) {
            conflicts.push({
              target: mcpTarget,
              component: "mcp:" + adapterId + "/" + server.id,
              message: "Managed MCP entry was modified after installation.",
            });
            mcpSafe = false;
          }
        }
        if (mcpSafe && options.reconciliation !== undefined) {
          for (const server of servers) {
            if (previousEntries[server.id] !== undefined || existingMcp === undefined) {
              continue;
            }
            const actualHash = adapter.entryHash(existingMcp, server.id);
            if (actualHash === undefined) {
              continue;
            }
            const expectedHash = expectedMcpEntryHash(adapter, server, mcpTarget);
            if (actualHash === expectedHash) {
              ownedIds.add(server.id);
              adoptedMcpIds.add(server.id);
              reconciliation.adopted.push(`mcp:${server.id}@${adapterId}`);
            } else if (
              options.reconciliation.resolutions[`mcp:${server.id}`] === "replace"
            ) {
              ownedIds.add(server.id);
              reconciliation.replaced.push(`mcp:${server.id}@${adapterId}`);
            }
          }
        }
      }
      const rendered = mcpSafe
        ? adapter.renderMcp(existingMcp, servers, options.mode, ownedIds, mcpTarget)
        : { content: existingMcp ?? "", entryHashes: {}, conflicts: [] };
      conflicts.push(...rendered.conflicts);
      const overwriteOwnershipChanges =
        options.mode === "overwrite" &&
        (!sameMembers(Object.keys(previousMcp?.entries ?? {}), selection.mcpIds) ||
          selection.mcpIds.some(
            (id) => previousMcp?.entries[id] !== rendered.entryHashes[id],
          ));
      if (
        rendered.conflicts.length === 0 &&
        (rendered.content !== existingMcp ||
          adoptedMcpIds.size > 0 ||
          overwriteOwnershipChanges)
      ) {
        const operation =
          rendered.content === existingMcp
            ? "adopt"
            : existingMcp === undefined
            ? "create"
            : options.mode === "overwrite"
              ? servers.length === 0
                ? "clear"
                : "replace"
              : "merge";
        actions.push({
          kind: "file",
          component: "mcp",
          adapter: adapterId,
          target: mcpTarget,
          operation,
          before: existingMcp,
          after: rendered.content,
          summary:
            operation === "adopt"
              ? "Adopt catalog-equivalent MCP entries without changing configuration."
              : options.mode === "overwrite"
              ? "Replace this adapter's MCP namespace with the selected catalog entries."
              : "Semantically merge selected MCP entries while preserving other configuration.",
          entryHashes: rendered.entryHashes,
        });
      }
    }
  }

  const prepared = await prepareSelectedSkills(pack, selection.skillIds);
  try {
    const skillsActions = await buildSkillsActions(
      layout,
      options,
      conflicts,
      prepared.skills,
      reconciliation,
    );
    actions.push(...skillsActions);

    const backupTargets = collectBackupTargets(actions, layout.stateFile);
    return {
      packName: pack.name,
      packVersion: pack.version,
      mode: options.mode,
      adapters: [...options.adapters],
      selection: {
        skillIds: [...selection.skillIds],
        mcpIds: [...selection.mcpIds],
      },
      actions,
      conflicts,
      backupTargets,
      expectedStateHash,
      resolvedSources: prepared.resolvedSources,
      temporaryPaths: prepared.temporaryPaths,
      uninstall: false,
      reconcile: options.reconciliation !== undefined,
      ...(options.reconciliation === undefined
        ? {}
        : { reconciliation: sortedReconciliation(reconciliation) }),
    };
  } catch (error) {
    await disposePreparedSkills(prepared);
    throw error;
  }
}

async function buildSkillsActions(
  layout: HomeLayout,
  options: InstallPlanOptions,
  conflicts: ConfigConflict[],
  selected: PreparedSkill[],
  reconciliation: ReconciliationSummary,
): Promise<Array<SkillsPlanAction | SkillsRemovePlanAction>> {
  const previousByPath = new Map(
    (options.previousState?.managed.skills ?? []).map((entry) => [
      resolve(entry.path),
      entry,
    ]),
  );
  const previousByOwnerAndId = new Map<string, InstallState["managed"]["skills"][number]>();
  for (const entry of options.previousState?.managed.skills ?? []) {
    const owner = managedSkillOwner(layout, entry);
    if (owner !== undefined && owner !== "legacy") {
      previousByOwnerAndId.set(owner + ":" + entry.id, entry);
    }
  }
  const selectedIds = new Set(selected.map((entry) => entry.skill.id));
  const actions: Array<SkillsPlanAction | SkillsRemovePlanAction> = [];

  for (const adapterId of options.adapters) {
    const skillsRoot = adapterById(adapterId).skillsPath(layout);
    const entries: SkillInstallEntry[] = [];
    const removals: SkillsRemovePlanAction["entries"] = [];
    const selectedTargets = new Set<string>();
    for (const prepared of selected) {
      const skill = prepared.skill;
      const target = join(skillsRoot, skill.name);
      selectedTargets.add(resolve(target));
      const exists = await pathExists(target);
      const currentHash = exists ? await hashPath(target) : null;
      const managed = previousByPath.get(resolve(target));
      const previousForId = previousByOwnerAndId.get(adapterId + ":" + skill.id);
      if (
        previousForId !== undefined &&
        resolve(previousForId.path) !== resolve(target)
      ) {
        conflicts.push({
          target: previousForId.path,
          component: "skill:" + skill.id,
          message:
            "Catalog skill target changed after installation; uninstall before adopting the new target.",
        });
        continue;
      }

      if (managed !== undefined && managed.id !== skill.id) {
        conflicts.push({
          target,
          component: "skill:" + skill.id,
          message:
            "Skill target is already managed for a different catalog id: " + managed.id,
        });
        continue;
      }

      if (options.mode === "overwrite") {
        if (
          managed !== undefined &&
          currentHash === prepared.sourceHash &&
          managed.contentHash === currentHash &&
          sameRevision(managed.source, prepared.sourceRevision)
        ) {
          continue;
        }
        entries.push({
          id: skill.id,
          name: skill.name,
          source: prepared.sourcePath,
          sourceHash: prepared.sourceHash,
          sourceRevision: prepared.sourceRevision,
          target,
          operation:
            currentHash === prepared.sourceHash
              ? "adopt"
              : exists
                ? "replace"
                : "install",
          beforeHash: currentHash,
        });
        continue;
      }

      if (!exists) {
        entries.push({
          id: skill.id,
          name: skill.name,
          source: prepared.sourcePath,
          sourceHash: prepared.sourceHash,
          sourceRevision: prepared.sourceRevision,
          target,
          operation: "install",
          beforeHash: null,
        });
        continue;
      }
      if (managed === undefined) {
        if (options.reconciliation !== undefined) {
          if (currentHash === prepared.sourceHash) {
            entries.push({
              id: skill.id,
              name: skill.name,
              source: prepared.sourcePath,
              sourceHash: prepared.sourceHash,
              sourceRevision: prepared.sourceRevision,
              target,
              operation: "adopt",
              beforeHash: currentHash,
            });
            reconciliation.adopted.push(`skill:${skill.id}@${adapterId}`);
            continue;
          }
          if (options.reconciliation.resolutions[`skill:${skill.id}`] === "replace") {
            entries.push({
              id: skill.id,
              name: skill.name,
              source: prepared.sourcePath,
              sourceHash: prepared.sourceHash,
              sourceRevision: prepared.sourceRevision,
              target,
              operation: "replace",
              beforeHash: currentHash,
            });
            reconciliation.replaced.push(`skill:${skill.id}@${adapterId}`);
            continue;
          }
        }
        conflicts.push({
          target,
          component: "skill:" + skill.id,
          message:
            adapterId +
            " skill directory already exists and is not managed by AgentPack.",
          reconcilable: true,
        });
        continue;
      }
      if (currentHash !== managed.contentHash) {
        conflicts.push({
          target,
          component: "skill:" + skill.id,
          message: "Managed skill was modified after installation; refusing to overwrite it.",
        });
        continue;
      }
      if (
        currentHash === prepared.sourceHash &&
        sameRevision(managed.source, prepared.sourceRevision)
      ) {
        continue;
      }
      entries.push({
        id: skill.id,
        name: skill.name,
        source: prepared.sourcePath,
        sourceHash: prepared.sourceHash,
        sourceRevision: prepared.sourceRevision,
        target,
        operation: "replace",
        beforeHash: currentHash,
      });
    }

    if (entries.length > 0) {
      actions.push({
        kind: "skills",
        adapter: adapterId,
        target: skillsRoot,
        operation: options.mode === "overwrite" ? "replace" : "merge",
        entries,
        summary:
          options.mode === "overwrite"
            ? "Replace only selected AgentPack skill entries; preserve other vendor skills."
            : "Install, adopt, or replace selected skills alongside other vendor skills.",
      });
    }

    if (options.mode === "overwrite") {
      for (const managed of options.previousState?.managed.skills ?? []) {
        if (
          managedSkillOwner(layout, managed) !== adapterId ||
          selectedIds.has(managed.id) ||
          selectedTargets.has(resolve(managed.path))
        ) {
          continue;
        }
        const exists = await pathExists(managed.path);
        const currentHash = exists ? await hashPath(managed.path) : null;
        if (currentHash !== null && currentHash !== managed.contentHash) {
          conflicts.push({
            target: managed.path,
            component: "skill:" + managed.id,
            message: "Deselected managed skill was modified; refusing to remove it.",
          });
          continue;
        }
        removals.push({
          id: managed.id,
          name: managed.name,
          target: managed.path,
          beforeHash: currentHash,
        });
      }
    }
    if (removals.length > 0) {
      actions.push({
        kind: "skills-remove",
        adapter: adapterId,
        target: skillsRoot,
        entries: removals,
        summary:
          "Remove only unchanged, deselected AgentPack-managed skills.",
      });
    }
  }
  return actions;
}

async function buildLegacyRemovalActions(
  layout: HomeLayout,
  state: InstallState,
  conflicts: ConfigConflict[],
): Promise<ChangePlan["actions"]> {
  const actions: ChangePlan["actions"] = [];
  const oldInstructionPath = legacyInstructionPath(layout);
  const instruction = state.managed.instructions.find(
    (entry) =>
      entry.adapter === "kimi" &&
      resolve(entry.path) === resolve(oldInstructionPath),
  );
  if (instruction !== undefined) {
    const existing = await readTextIfExists(instruction.path);
    let after: string | null = null;
    let safe = true;
    if (existing !== undefined) {
      const actual =
        instruction.strategy === "managed-block"
          ? managedInstructionHash(existing)
          : sha256(existing);
      if (actual !== instruction.contentHash) {
        conflicts.push({
          target: instruction.path,
          component: "instructions:kimi",
          message:
            "Legacy managed instructions were modified; refusing to migrate them.",
        });
        safe = false;
      } else if (instruction.strategy === "managed-block") {
        const remaining = removeManagedInstructions(existing);
        after = remaining.trim().length === 0 ? null : remaining;
      }
    }
    if (safe) {
      actions.push({
        kind: "file",
        component: "instructions",
        adapter: "kimi",
        target: instruction.path,
        operation: after === null ? "delete" : "replace",
        before: existing,
        after,
        summary:
          "Remove the exact legacy AgentPack instruction content after vendor migration.",
        strategy: instruction.strategy,
      });
    }
  }

  const entries: SkillsRemovePlanAction["entries"] = [];
  for (const skill of state.managed.skills) {
    if (managedSkillOwner(layout, skill) !== "legacy") {
      continue;
    }
    const exists = await pathExists(skill.path);
    const currentHash = exists ? await hashPath(skill.path) : null;
    if (currentHash !== null && currentHash !== skill.contentHash) {
      conflicts.push({
        target: skill.path,
        component: "skill:" + skill.id,
        message: "Legacy managed skill was modified; refusing to migrate it.",
      });
      continue;
    }
    entries.push({
      id: skill.id,
      name: skill.name,
      target: skill.path,
      beforeHash: currentHash,
    });
  }
  if (entries.length > 0) {
    actions.push({
      kind: "skills-remove",
      adapter: "legacy",
      target: legacySkillsPath(layout),
      entries,
      summary:
        "Remove only exact legacy AgentPack skill entries after vendor migration.",
    });
  }
  return actions;
}

function assertLegacyMigrationRequest(options: InstallPlanOptions): void {
  const state = options.previousState;
  if (state === undefined) {
    return;
  }
  if (
    options.reconciliation !== undefined ||
    options.mode !== state.mode ||
    !sameMembers(options.adapters, state.adapters) ||
    !sameMembers(options.selection.skillIds, state.selection.skillIds) ||
    !sameMembers(options.selection.mcpIds, state.selection.mcpIds)
  ) {
    throw new Error(
      "Legacy shared AgentPack state must first be migrated unchanged with `agentpack update`",
    );
  }
}

function assertAdapterScopeIncludesState(options: InstallPlanOptions): void {
  const omitted = (options.previousState?.adapters ?? []).filter(
    (adapter) => !options.adapters.includes(adapter),
  );
  if (omitted.length > 0) {
    throw new Error(
      "Schema v1 requires every recorded adapter in --agents; missing: " +
        omitted.join(", "),
    );
  }
}

function sameMembers(left: string[], right: string[]): boolean {
  return (
    left.length === right.length &&
    new Set(left).size === left.length &&
    left.every((entry) => right.includes(entry))
  );
}

function effectiveSelection(
  selection: ComponentSelection,
  reconciliation: ReconciliationOptions | undefined,
): ComponentSelection {
  if (reconciliation === undefined) {
    return {
      skillIds: [...selection.skillIds],
      mcpIds: [...selection.mcpIds],
    };
  }
  return {
    skillIds: selection.skillIds.filter(
      (id) => reconciliation.resolutions[`skill:${id}`] !== "keep",
    ),
    mcpIds: selection.mcpIds.filter(
      (id) => reconciliation.resolutions[`mcp:${id}`] !== "keep",
    ),
  };
}

function keptComponents(
  reconciliation: ReconciliationOptions | undefined,
): string[] {
  return reconciliation === undefined
    ? []
    : Object.entries(reconciliation.resolutions)
        .filter(([, resolution]) => resolution === "keep")
        .map(([component]) => component)
        .sort();
}

function assertKeepDoesNotSplitOwnership(
  reconciliation: ReconciliationOptions | undefined,
  state: InstallState | undefined,
): void {
  if (reconciliation === undefined || state === undefined) {
    return;
  }
  for (const [component, resolution] of Object.entries(reconciliation.resolutions)) {
    if (resolution !== "keep") {
      continue;
    }
    if (component.startsWith("skill:")) {
      const id = component.slice("skill:".length);
      if (state.managed.skills.some((entry) => entry.id === id)) {
        throw new Error(
          `Cannot keep ${component} unmanaged because AgentPack already manages it`,
        );
      }
      continue;
    }
    if (component.startsWith("mcp:")) {
      const id = component.slice("mcp:".length);
      if (state.managed.mcp.some((entry) => entry.entries[id] !== undefined)) {
        throw new Error(
          `Cannot keep ${component} unmanaged because AgentPack already manages it on another target`,
        );
      }
    }
  }
}

function expectedMcpEntryHash(
  adapter: AgentAdapter,
  server: McpDefinition,
  target: string,
): string {
  const rendered = adapter.renderMcp(undefined, [server], "append", new Set(), target);
  const hash = rendered.entryHashes[server.id];
  if (hash === undefined || rendered.conflicts.length > 0) {
    throw new Error("Unable to render expected MCP entry: " + adapter.id + "/" + server.id);
  }
  return hash;
}

function sortedReconciliation(
  reconciliation: ReconciliationSummary,
): ReconciliationSummary {
  return {
    adopted: unique(reconciliation.adopted).sort(),
    replaced: unique(reconciliation.replaced).sort(),
    kept: unique(reconciliation.kept).sort(),
  };
}

function sameRevision(
  left: SkillInstallEntry["sourceRevision"],
  right: SkillInstallEntry["sourceRevision"],
): boolean {
  return (
    left.id === right.id &&
    left.kind === right.kind &&
    left.repository === right.repository &&
    left.ref === right.ref &&
    left.commit === right.commit &&
    left.packVersion === right.packVersion
  );
}

function collectBackupTargets(
  actions: ChangePlan["actions"],
  stateFile: string,
): string[] {
  const targets: string[] = actions.length > 0 ? [stateFile] : [];
  for (const action of actions) {
    if (action.kind === "file") {
      targets.push(action.target);
    } else {
      targets.push(...action.entries.map((entry) => entry.target));
    }
  }
  return unique(targets);
}
