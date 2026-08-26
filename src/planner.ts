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
  ChangePlan,
  ComponentSelection,
  ConfigConflict,
  FilePlanAction,
  HomeLayout,
  InstallMode,
  InstallState,
  LoadedPack,
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
}

export async function buildInstallPlan(
  pack: LoadedPack,
  layout: HomeLayout,
  options: InstallPlanOptions,
): Promise<ChangePlan> {
  if (options.previousState !== undefined) {
    assertStateOwnership(pack, layout, options.previousState);
  }
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
    const servers = options.selection.mcpIds.map((id) => mcpById(pack, id));
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
      }
      const rendered = mcpSafe
        ? adapter.renderMcp(existingMcp, servers, options.mode, ownedIds, mcpTarget)
        : { content: existingMcp ?? "", entryHashes: {}, conflicts: [] };
      conflicts.push(...rendered.conflicts);
      if (rendered.content !== existingMcp && rendered.conflicts.length === 0) {
        const operation =
          existingMcp === undefined
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
            options.mode === "overwrite"
              ? "Replace this adapter's MCP configuration with the selected catalog entries."
              : "Semantically merge selected MCP entries while preserving other configuration.",
          entryHashes: rendered.entryHashes,
        });
      }
    }
  }

  const prepared = await prepareSelectedSkills(pack, options.selection.skillIds);
  try {
    const skillsAction = await buildSkillsAction(layout, options, conflicts, prepared.skills);
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
        skillIds: [...options.selection.skillIds],
        mcpIds: [...options.selection.mcpIds],
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
      conflicts.push({
        target,
        component: "skill:" + skill.id,
        message: "Skill directory already exists and is not managed by AgentPack.",
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
    summary: "Install resolved source revisions alongside existing skill directories.",
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
