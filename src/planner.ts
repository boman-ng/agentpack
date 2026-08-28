import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { adapterById } from "./adapters/index.js";
import {
  appendInstructions,
  managedInstructionBlock,
  managedInstructionHash,
} from "./instructions.js";
import { mcpById } from "./manifest.js";
import {
  disposePreparedSkills,
  prepareSelectedSkills,
  type PreparedSkill,
} from "./sources.js";
import { assertStateOwnership } from "./state.js";
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
  if (options.reconciliation !== undefined && options.mode !== "append") {
    throw new Error("Ownership reconciliation requires append mode");
  }
  assertKeepDoesNotSplitOwnership(options.reconciliation, options.previousState);
  const selection = effectiveSelection(options.selection, options.reconciliation);
  const effectiveOptions: InstallPlanOptions = { ...options, selection };
  const reconciliation: ReconciliationSummary = {
    adopted: [],
    replaced: [],
    kept: keptComponents(options.reconciliation),
  };
  const actions: ChangePlan["actions"] = [];
  const conflicts: ConfigConflict[] = [];
  const instructionPayload = await readFile(pack.instructionPath, "utf8");

  for (const adapterId of options.adapters) {
    const adapter = adapterById(adapterId);
    const instructionTarget = adapter.instructionPath(layout);
    const existingInstructions = await readTextIfExists(instructionTarget);
    const previousInstruction = options.previousState?.managed.instructions.find(
      (entry) => entry.adapter === adapterId,
    );
    let instructionSafe = true;
    if (options.mode === "append" && previousInstruction !== undefined) {
      const actualHash =
        existingInstructions === undefined
          ? undefined
          : previousInstruction.strategy === "managed-block"
            ? managedInstructionHash(existingInstructions)
            : sha256(existingInstructions);
      if (actualHash !== previousInstruction.contentHash) {
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
        : previousInstruction?.strategy === "overwrite"
          ? managedInstructionBlock(instructionPayload)
          : appendInstructions(existingInstructions, instructionPayload);
    if (instructionSafe && instructionAfter !== existingInstructions) {
      const operation =
        existingInstructions === undefined
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
        strategy: options.mode === "overwrite" ? "overwrite" : "managed-block",
      };
      actions.push(action);
    }

    const mcpTarget = adapter.mcpPath(layout);
    const existingMcp = await readTextIfExists(mcpTarget);
    const servers = selection.mcpIds.map((id) => mcpById(pack, id));
    if (options.mode === "overwrite" || servers.length > 0) {
      const ownedIds = new Set(
        options.previousState?.managed.mcp.find((entry) => entry.adapter === adapterId)
          ?.entries
          ? Object.keys(
              options.previousState.managed.mcp.find(
                (entry) => entry.adapter === adapterId,
              )?.entries ?? {},
            )
          : [],
      );
      let mcpSafe = true;
      const adoptedMcpIds = new Set<string>();
      if (options.mode === "append") {
        const previousEntries =
          options.previousState?.managed.mcp.find((entry) => entry.adapter === adapterId)
            ?.entries ?? {};
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
      if (
        rendered.conflicts.length === 0 &&
        (rendered.content !== existingMcp || adoptedMcpIds.size > 0)
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
              ? "Replace this adapter's MCP configuration with the selected catalog entries."
              : "Semantically merge selected MCP entries while preserving other configuration.",
          entryHashes: rendered.entryHashes,
        });
      }
    }
  }

  const prepared = await prepareSelectedSkills(pack, selection.skillIds);
  try {
    const skillsAction = await buildSkillsAction(
      layout,
      effectiveOptions,
      conflicts,
      prepared.skills,
      reconciliation,
    );
    if (skillsAction !== undefined) {
      actions.push(skillsAction);
    }

    const backupTargets = collectBackupTargets(actions, layout.stateFile);
    return {
      packName: pack.name,
      packVersion: pack.version,
      mode: options.mode,
      adapters: unique(options.adapters),
      selection: {
        skillIds: [...selection.skillIds],
        mcpIds: [...selection.mcpIds],
      },
      actions,
      conflicts,
      backupTargets,
      expectedStateHash: (await pathExists(layout.stateFile))
        ? await hashPath(layout.stateFile)
        : null,
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

async function buildSkillsAction(
  layout: HomeLayout,
  options: InstallPlanOptions,
  conflicts: ConfigConflict[],
  selected: PreparedSkill[],
  reconciliation: ReconciliationSummary,
): Promise<SkillsPlanAction | undefined> {
  if (options.mode === "overwrite") {
    const skillsExist = await pathExists(layout.sharedSkills);
    if (selected.length === 0 && !skillsExist) {
      return undefined;
    }
    return {
      kind: "skills",
      target: layout.sharedSkills,
      operation: "replace",
      entries: selected.map((prepared) => ({
        id: prepared.skill.id,
        name: prepared.skill.name,
        source: prepared.sourcePath,
        sourceHash: prepared.sourceHash,
        sourceRevision: prepared.sourceRevision,
        target: join(layout.sharedSkills, prepared.skill.name),
        operation: "install",
      })),
      summary: "Replace the shared Agent Skills directory with the resolved source revisions.",
      beforeHash: skillsExist ? await hashPath(layout.sharedSkills) : null,
    };
  }

  const previousByPath = new Map(
    (options.previousState?.managed.skills ?? []).map((entry) => [entry.path, entry]),
  );
  const entries: SkillInstallEntry[] = [];
  for (const prepared of selected) {
    const skill = prepared.skill;
    const target = join(layout.sharedSkills, skill.name);
    if (!(await pathExists(target))) {
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
    const managed = previousByPath.get(target);
    if (managed === undefined) {
      const currentHash = await hashPath(target);
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
          reconciliation.adopted.push("skill:" + skill.id);
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
          reconciliation.replaced.push("skill:" + skill.id);
          continue;
        }
      }
      conflicts.push({
        target,
        component: "skill:" + skill.id,
        message: "Skill directory already exists and is not managed by AgentPack.",
        reconcilable: true,
      });
      continue;
    }
    const currentHash = await hashPath(target);
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
  if (entries.length === 0) {
    return undefined;
  }
  return {
    kind: "skills",
    target: layout.sharedSkills,
    operation: "merge",
    entries,
    summary: "Install, adopt, or replace resolved skills alongside unrelated directories.",
  };
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
  const targets: string[] = [];
  for (const action of actions) {
    if (action.kind === "file") {
      targets.push(action.target);
    } else if (action.kind === "skills" && action.operation === "replace") {
      targets.push(action.target);
    } else {
      targets.push(...action.entries.map((entry) => entry.target));
    }
  }
  if (actions.length > 0) {
    targets.push(stateFile);
  }
  return unique(targets);
}
