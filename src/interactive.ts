import {
  autocompleteMultiselect,
  cancel,
  intro,
  isCancel,
  log,
  multiselect,
  note,
  outro,
  select,
  spinner,
} from "@clack/prompts";
import { adapterById, detectAdapters } from "./adapters/index.js";
import { applyInstallPlan } from "./installer.js";
import { displayHomePath, formatGuidedReview } from "./plan-output.js";
import { buildInstallPlan } from "./planner.js";
import { resolveSelection } from "./selection.js";
import { disposeInstallPlan } from "./sources.js";
import type {
  AdapterId,
  ChangePlan,
  ComponentSelection,
  HomeLayout,
  InstallMode,
  InstallState,
  LoadedPack,
} from "./types.js";

interface GuidedConfiguration {
  adapters: AdapterId[];
  mode: InstallMode;
  selection: ComponentSelection;
}

type ProfileChoice = string;
type ReviewAction = "apply" | "change" | "cancel";

class PromptCancelled extends Error {}

export async function runGuidedInstall(
  pack: LoadedPack,
  layout: HomeLayout,
  state: InstallState | undefined,
): Promise<void> {
  intro(`${pack.name} ${pack.version} - guided setup`);
  log.info("Nothing changes until you approve the plan. Existing targets are backed up first.");
  if (state !== undefined) {
    log.info("Existing AgentPack setup found. Its choices are preselected.");
  }

  const detected = await detectAdapters(pack.targets, layout);
  let defaults: GuidedConfiguration | undefined = state === undefined
    ? undefined
    : {
        adapters: [...state.adapters],
        mode: state.mode,
        selection: {
          skillIds: [...state.selection.skillIds],
          mcpIds: [...state.selection.mcpIds],
        },
      };
  let plan: ChangePlan | undefined;

  try {
    while (true) {
      const configuration = await promptConfiguration(pack, detected, defaults);
      const progress = spinner({ indicator: "timer" });
      progress.start("Resolving selected sources and inspecting target files");
      try {
        plan = await buildInstallPlan(pack, layout, {
          adapters: configuration.adapters,
          mode: configuration.mode,
          selection: configuration.selection,
          ...(state === undefined ? {} : { previousState: state }),
        });
        progress.stop(
          plan.resolvedSources.length === 0
            ? "Install plan ready"
            : `Resolved ${plan.resolvedSources.length} source ${plural(plan.resolvedSources.length, "revision")}`,
        );
      } catch (error) {
        progress.error("Could not prepare the install plan");
        throw error;
      }

      note(formatGuidedReview(plan, pack, layout), "Review installation");
      const action = await promptReviewAction(plan.conflicts.length > 0);
      if (action === "change") {
        await disposeInstallPlan(plan);
        plan = undefined;
        defaults = configuration;
        continue;
      }
      if (action === "cancel") {
        cancel("Installation canceled. No files were changed.");
        return;
      }

      const applying = spinner({ indicator: "timer" });
      applying.start("Backing up changed targets and applying AgentPack");
      try {
        const result = await applyInstallPlan(pack, layout, plan, state);
        applying.stop("AgentPack installed and validated");
        outro(
          result.backupPath === undefined
            ? "Ready. Run `agentpack doctor` to check this setup."
            : `Ready. Backup saved at ${displayHomePath(result.backupPath, layout.home)}.`,
        );
      } catch (error) {
        applying.error("Install failed; changed targets were restored from backup");
        throw error;
      }
      return;
    }
  } catch (error) {
    if (error instanceof PromptCancelled) {
      cancel("Installation canceled. No files were changed.");
      process.exitCode = 130;
      return;
    }
    throw error;
  } finally {
    if (plan !== undefined) {
      await disposeInstallPlan(plan);
    }
  }
}

export async function promptApplyPlan(options: {
  message: string;
  applyLabel: string;
  applyHint: string;
}): Promise<boolean> {
  try {
    const action = unwrap(
      await select<"apply" | "cancel">({
        message: options.message,
        initialValue: "cancel",
        options: [
          { value: "apply", label: options.applyLabel, hint: options.applyHint },
          { value: "cancel", label: "Cancel", hint: "Leave every target unchanged" },
        ],
      }),
    );
    if (action === "cancel") {
      cancel("Canceled. No files were changed.");
      return false;
    }
    return true;
  } catch (error) {
    if (error instanceof PromptCancelled) {
      cancel("Canceled. No files were changed.");
      process.exitCode = 130;
      return false;
    }
    throw error;
  }
}

async function promptConfiguration(
  pack: LoadedPack,
  detected: AdapterId[],
  defaults: GuidedConfiguration | undefined,
): Promise<GuidedConfiguration> {
  const initialAdapters = defaults?.adapters ?? detected;
  const adapters = unwrap(
    await multiselect<AdapterId>({
      message: "Which agents should AgentPack configure?",
      required: true,
      initialValues: initialAdapters,
      maxItems: pack.targets.length,
      options: pack.targets.map((id) => ({
        value: id,
        label: adapterById(id).displayName,
        hint: detected.includes(id) ? "detected" : "not detected in this home",
      })),
    }),
  );

  const mode = unwrap(
    await select<InstallMode>({
      message: "How should AgentPack manage supported configuration?",
      initialValue: defaults?.mode ?? "overwrite",
      options: [
        {
          value: "overwrite",
          label: "Replace the managed surfaces",
          hint: "recommended; exact selected set, with backup",
        },
        {
          value: "append",
          label: "Merge into the existing setup",
          hint: "preserves unmanaged entries; collisions stop the install",
        },
      ],
    }),
  );

  const profileChoice = unwrap(
    await select<ProfileChoice>({
      message: "What kind of setup do you want?",
      initialValue: profileChoiceFor(pack, defaults?.selection),
      maxItems: 8,
      options: [
        ...orderedProfiles(pack).map((profile) => ({
          value: profile.id,
          label: profileLabel(profile.id),
          hint: profile.description,
        })),
        {
          value: "instructions-only",
          label: "Instructions only",
          hint: "no skills and no MCP servers",
        },
        {
          value: "custom",
          label: "Custom selection",
          hint: "choose individual skills and MCP servers",
        },
      ],
    }),
  );

  let selection: ComponentSelection;
  if (profileChoice === "instructions-only") {
    selection = { skillIds: [], mcpIds: [] };
  } else if (profileChoice === "custom") {
    const skillIds = unwrap(
      await autocompleteMultiselect<string>({
        message: "Select skills",
        placeholder: "Type to filter; Enter accepts an empty selection",
        initialValues: defaults?.selection.skillIds ?? [],
        required: false,
        maxItems: 9,
        options: pack.skills.map((skill) => ({
          value: skill.id,
          label: skill.name,
          hint: `${skill.category}/${skill.domain}`,
        })),
      }),
    );
    const mcpIds = pack.mcp.length === 0
      ? []
      : unwrap(
          await multiselect<string>({
            message: "Select MCP servers",
            initialValues: defaults?.selection.mcpIds ?? [],
            required: false,
            maxItems: Math.min(pack.mcp.length, 8),
            options: pack.mcp.map((server) => ({
              value: server.id,
              label: server.name,
              hint: `${server.description.replace(/[.\s]+$/, "")}; sends requested data to ${new URL(server.url).host}`,
            })),
          }),
        );
    selection = resolveSelection(pack, { skills: skillIds, mcp: mcpIds });
  } else {
    selection = resolveSelection(pack, { profile: profileChoice });
  }

  return { adapters, mode, selection };
}

async function promptReviewAction(blocked: boolean): Promise<ReviewAction> {
  if (blocked) {
    log.error("This plan has conflicts and cannot be installed.");
    return unwrap(
      await select<ReviewAction>({
        message: "What would you like to do?",
        initialValue: "change",
        options: [
          { value: "change", label: "Change choices", hint: "return to guided setup" },
          { value: "cancel", label: "Cancel", hint: "leave every target unchanged" },
        ],
      }),
    );
  }
  return unwrap(
    await select<ReviewAction>({
      message: "Ready to install?",
      initialValue: "apply",
      options: [
        { value: "apply", label: "Install now", hint: "backup, apply, validate, and record state" },
        { value: "change", label: "Change choices", hint: "return to guided setup" },
        { value: "cancel", label: "Cancel", hint: "leave every target unchanged" },
      ],
    }),
  );
}

function orderedProfiles(pack: LoadedPack): LoadedPack["profiles"] {
  const order = new Map([
    ["minimal", 0],
    ["coding", 1],
    ["research", 2],
    ["frontend", 3],
    ["full", 4],
  ]);
  return [...pack.profiles].sort(
    (left, right) => (order.get(left.id) ?? 99) - (order.get(right.id) ?? 99),
  );
}

function profileChoiceFor(
  pack: LoadedPack,
  selection: ComponentSelection | undefined,
): ProfileChoice {
  if (selection === undefined) {
    return pack.profiles.some((profile) => profile.id === "minimal") ? "minimal" : "custom";
  }
  if (selection.skillIds.length === 0 && selection.mcpIds.length === 0) {
    return "instructions-only";
  }
  const match = pack.profiles.find(
    (profile) => sameIds(profile.skills, selection.skillIds) && sameIds(profile.mcp, selection.mcpIds),
  );
  return match?.id ?? "custom";
}

function sameIds(left: string[], right: string[]): boolean {
  const rightIds = new Set(right);
  return left.length === right.length && left.every((id) => rightIds.has(id));
}

function profileLabel(id: string): string {
  if (id === "minimal") return "Minimal (recommended)";
  if (id === "coding") return "Coding";
  if (id === "research") return "Research";
  if (id === "frontend") return "Frontend";
  if (id === "full") return "Full";
  return id;
}

function unwrap<Value>(value: Value | symbol): Value {
  if (isCancel(value)) {
    throw new PromptCancelled();
  }
  return value as Value;
}

function plural(count: number, word: string): string {
  return count === 1 ? word : word + "s";
}
