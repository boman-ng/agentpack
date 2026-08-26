#!/usr/bin/env node

import { parseArgs } from "node:util";
import { detectAdapters } from "./adapters/index.js";
import { runDoctor, formatDoctor } from "./doctor.js";
import { applyInstallPlan } from "./installer.js";
import { promptApplyPlan, runGuidedInstall } from "./interactive.js";
import { createHomeLayout } from "./layout.js";
import { loadPack } from "./manifest.js";
import { buildNativeDistributions } from "./native-build.js";
import { formatPlan, planAsJson } from "./plan-output.js";
import { buildInstallPlan } from "./planner.js";
import { findPackRoot } from "./runtime.js";
import { parseComponentList, resolveSelection } from "./selection.js";
import { disposeInstallPlan } from "./sources.js";
import { loadState } from "./state.js";
import type {
  AdapterId,
  ComponentSelection,
  InstallMode,
  LoadedPack,
  SelectionOptions,
} from "./types.js";
import { applyUninstallPlan, buildUninstallPlan } from "./uninstall.js";
import { assertAdapterId, unique } from "./util/values.js";

interface CliOptions {
  agents?: string;
  profile?: string;
  skills?: string;
  mcp?: string;
  mode?: string;
  home?: string;
  yes: boolean;
  dryRun: boolean;
  allSkills: boolean;
  allMcp: boolean;
  json: boolean;
  help: boolean;
  version: boolean;
}

async function main(): Promise<void> {
  const parsed = parseCli(process.argv.slice(2));
  const command = parsed.command;
  if (parsed.options.help) {
    process.stdout.write(helpText());
    return;
  }

  const versionRequested = parsed.options.version || command === "version";
  if (command === "help" && !versionRequested) {
    process.stdout.write(helpText());
    return;
  }

  const root = await findPackRoot();
  const pack = await loadPack(root);
  if (versionRequested) {
    process.stdout.write(pack.version + "\n");
    return;
  }
  if (command === "list") {
    process.stdout.write(formatCatalog(pack));
    return;
  }
  if (command === "native-build") {
    const output = await buildNativeDistributions(root);
    process.stdout.write("Built native distributions at " + output + "\n");
    return;
  }

  const layout = createHomeLayout(parsed.options.home);
  const state = await loadState(layout.stateFile);

  if (command === "doctor") {
    const checks = await runDoctor(pack, layout, state);
    process.stdout.write(
      parsed.options.json
        ? JSON.stringify(checks, null, 2) + "\n"
        : formatDoctor(checks),
    );
    if (checks.some((check) => !check.ok)) {
      process.exitCode = 1;
    }
    return;
  }

  if (command === "uninstall") {
    if (state === undefined) {
      throw new Error("No AgentPack state exists for the selected home");
    }
    const plan = await buildUninstallPlan(pack, layout, state);
    writePlan(plan, pack, parsed.options.json);
    if (!(await shouldApply(parsed.options, {
      message: "Apply this uninstall plan?",
      applyLabel: "Uninstall now",
      applyHint: "remove unchanged managed content and preserve a backup",
    }))) {
      return;
    }
    const backupPath = await applyUninstallPlan(layout, plan);
    process.stdout.write(
      "Uninstall complete." +
        (backupPath === undefined ? "" : " Backup: " + backupPath) +
        "\n",
    );
    return;
  }

  if (command !== "install" && command !== "plan" && command !== "diff" && command !== "update") {
    throw new Error("Unknown command: " + command);
  }

  const update = command === "update";
  if (update && state === undefined) {
    throw new Error("Cannot update because no AgentPack state exists for the selected home");
  }

  if (
    command === "install" &&
    isInteractiveTerminal(parsed.options) &&
    !hasConfigurationFlags(parsed.options)
  ) {
    await runGuidedInstall(pack, layout, state);
    return;
  }

  const adapters = await resolveAdapters(
    pack,
    layout,
    parsed.options.agents,
    update ? state?.adapters : undefined,
  );
  const selection = resolveCliSelection(pack, parsed.options, update ? state?.selection : undefined);
  const mode = resolveMode(parsed.options.mode, update ? state?.mode : undefined);
  const planOptions: Parameters<typeof buildInstallPlan>[2] = {
    mode,
    adapters,
    selection,
  };
  if (state !== undefined) {
    planOptions.previousState = state;
  }
  const plan = await buildInstallPlan(pack, layout, planOptions);
  try {
    writePlan(plan, pack, parsed.options.json);

    if (command === "plan" || command === "diff" || parsed.options.dryRun) {
      return;
    }
    if (!(await shouldApply(parsed.options, {
      message: "Apply this install plan?",
      applyLabel: "Install now",
      applyHint: "backup, apply, validate, and record state",
    }))) {
      return;
    }
    const result = await applyInstallPlan(pack, layout, plan, state);
    process.stdout.write(
      "Install complete." +
        (result.backupPath === undefined ? "" : " Backup: " + result.backupPath) +
        "\n",
    );
  } finally {
    await disposeInstallPlan(plan);
  }
}

function parseCli(argv: string[]): { command: string; options: CliOptions } {
  const parsed = parseArgs({
    args: argv,
    allowPositionals: true,
    strict: true,
    options: {
      agents: { type: "string" },
      profile: { type: "string" },
      skills: { type: "string" },
      mcp: { type: "string" },
      mode: { type: "string" },
      home: { type: "string" },
      yes: { type: "boolean", short: "y", default: false },
      "dry-run": { type: "boolean", default: false },
      "all-skills": { type: "boolean", default: false },
      "all-mcp": { type: "boolean", default: false },
      json: { type: "boolean", default: false },
      help: { type: "boolean", short: "h", default: false },
      version: { type: "boolean", short: "v", default: false },
    },
  });
  if (parsed.positionals.length > 1) {
    throw new Error("Unexpected positional arguments: " + parsed.positionals.slice(1).join(" "));
  }
  const options: CliOptions = {
    yes: parsed.values.yes ?? false,
    dryRun: parsed.values["dry-run"] ?? false,
    allSkills: parsed.values["all-skills"] ?? false,
    allMcp: parsed.values["all-mcp"] ?? false,
    json: parsed.values.json ?? false,
    help: parsed.values.help ?? false,
    version: parsed.values.version ?? false,
  };
  assignOption(options, "agents", parsed.values.agents);
  assignOption(options, "profile", parsed.values.profile);
  assignOption(options, "skills", parsed.values.skills);
  assignOption(options, "mcp", parsed.values.mcp);
  assignOption(options, "mode", parsed.values.mode);
  assignOption(options, "home", parsed.values.home);
  return {
    command: parsed.positionals[0] ?? "help",
    options,
  };
}

async function resolveAdapters(
  pack: LoadedPack,
  layout: ReturnType<typeof createHomeLayout>,
  raw: string | undefined,
  prior: AdapterId[] | undefined,
): Promise<AdapterId[]> {
  if (raw !== undefined) {
    const ids = unique(parseComponentList(raw));
    const adapters: AdapterId[] = [];
    for (const id of ids) {
      assertAdapterId(id);
      if (!pack.targets.includes(id)) {
        throw new Error("Adapter is not enabled by this pack: " + id);
      }
      adapters.push(id);
    }
    if (adapters.length === 0) {
      throw new Error("Select at least one adapter");
    }
    return adapters;
  }
  if (prior !== undefined && prior.length > 0) {
    return [...prior];
  }
  const detected = await detectAdapters(pack.targets, layout);
  if (detected.length === 0) {
    throw new Error("No supported CLI was detected; pass --agents explicitly");
  }
  return detected;
}

function resolveCliSelection(
  pack: LoadedPack,
  options: CliOptions,
  prior: ComponentSelection | undefined,
): ComponentSelection {
  if (!hasExplicitSelection(options) && prior !== undefined) {
    return {
      skillIds: [...prior.skillIds],
      mcpIds: [...prior.mcpIds],
    };
  }
  const selection: SelectionOptions = {
    allSkills: options.allSkills,
    allMcp: options.allMcp,
  };
  assignOption(selection, "profile", options.profile);
  if (options.skills !== undefined) {
    selection.skills = parseComponentList(options.skills);
  }
  if (options.mcp !== undefined) {
    selection.mcp = parseComponentList(options.mcp);
  }
  return resolveSelection(pack, selection);
}

function resolveMode(raw: string | undefined, prior: InstallMode | undefined): InstallMode {
  const value = raw ?? prior ?? "overwrite";
  if (value !== "overwrite" && value !== "append") {
    throw new Error("--mode must be overwrite or append");
  }
  return value;
}

function hasExplicitSelection(options: CliOptions): boolean {
  return (
    options.profile !== undefined ||
    options.skills !== undefined ||
    options.mcp !== undefined ||
    options.allSkills ||
    options.allMcp
  );
}

async function shouldApply(
  options: CliOptions,
  prompt: { message: string; applyLabel: string; applyHint: string },
): Promise<boolean> {
  if (options.dryRun) {
    return false;
  }
  if (options.yes) {
    return true;
  }
  if (options.json) {
    return false;
  }
  if (!isInteractiveTerminal(options)) {
    process.stdout.write("Plan only: pass --yes to apply in a non-interactive shell.\n");
    return false;
  }
  return promptApplyPlan(prompt);
}

function isInteractiveTerminal(options: CliOptions): boolean {
  return (
    process.stdin.isTTY === true &&
    process.stdout.isTTY === true &&
    !options.json &&
    !options.yes &&
    !options.dryRun
  );
}

function hasConfigurationFlags(options: CliOptions): boolean {
  return (
    options.agents !== undefined ||
    options.mode !== undefined ||
    hasExplicitSelection(options)
  );
}

function writePlan(
  plan: Awaited<ReturnType<typeof buildInstallPlan>> | Awaited<ReturnType<typeof buildUninstallPlan>>,
  pack: LoadedPack,
  json: boolean,
): void {
  process.stdout.write(json ? planAsJson(plan) : formatPlan(plan, pack));
}

function formatCatalog(pack: LoadedPack): string {
  const lines = [pack.name + "@" + pack.version, "", "Profiles:"];
  for (const profile of pack.profiles) {
    lines.push("  - " + profile.id + ": " + profile.description);
  }
  lines.push("", "Skills:");
  for (const skill of pack.skills) {
    lines.push("  - " + skill.id + " [" + skill.category + "/" + skill.domain + "]");
  }
  lines.push("", "MCP servers:");
  for (const server of pack.mcp) {
    lines.push("  - " + server.id + " [" + server.category + "/" + server.domain + "]");
  }
  return lines.join("\n") + "\n";
}

function helpText(): string {
  return [
    "AgentPack",
    "",
    "Usage:",
    "  agentpack list",
    "  agentpack plan [options]",
    "  agentpack install [options]       Guided setup when run in a terminal",
    "  agentpack update [options]",
    "  agentpack diff [options]",
    "  agentpack doctor [--home PATH] [--json]",
    "  agentpack uninstall [--home PATH] [--yes]",
    "",
    "Options:",
    "  --agents codex,kimi,opencode   Target adapters; detected when omitted",
    "  --mode overwrite|append        Install mode (default: overwrite)",
    "  --profile NAME                 Preselect an opt-in profile",
    "  --skills ID,ID|none            Explicit skill selection (default: none)",
    "  --mcp ID,ID|none               Explicit MCP selection (default: none)",
    "  --all-skills                   Select every catalog skill",
    "  --all-mcp                      Select every MCP server",
    "  --home PATH                    Isolated user home / advanced override",
    "  --dry-run                      Preview only",
    "  --yes, -y                      Skip prompts and apply the previewed plan",
    "  --json                         Machine-readable plan or doctor output",
    "  --help, -h                     Show help",
    "  --version, -v                  Show version",
    "",
    "Run `agentpack install` for guided setup. Ctrl+C cancels without changing files.",
    "Selected open-source skills are resolved online before review; apply installs the shown commits.",
    "Package installation itself never changes user configuration.",
  ].join("\n") + "\n";
}

function assignOption<
  Target extends object,
  Key extends keyof Target,
  Value extends Target[Key],
>(target: Target, key: Key, value: Value | undefined): void {
  if (value !== undefined) {
    target[key] = value;
  }
}

main().catch((error: unknown) => {
  process.stderr.write("agentpack: " + (error instanceof Error ? error.message : String(error)) + "\n");
  process.exitCode = 1;
});
