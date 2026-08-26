import { sep } from "node:path";
import { adapterById } from "./adapters/index.js";
import type { ChangePlan, HomeLayout, LoadedPack, PlanAction } from "./types.js";

export function formatPlan(plan: ChangePlan, pack: LoadedPack): string {
  const lines = [
    `AgentPack ${plan.uninstall ? "uninstall" : "install"} plan`,
    "",
    `Pack      ${plan.packName}@${plan.packVersion}`,
    `Agents    ${plan.adapters.join(", ") || "none"}`,
    `Strategy  ${plan.mode === "overwrite" ? "replace managed surfaces" : "merge with existing setup"}`,
    `Skills    ${formatSelection(plan.selection.skillIds)}`,
    `MCP       ${formatSelection(plan.selection.mcpIds)}`,
  ];
  if (plan.resolvedSources.length > 0) {
    lines.push("", "Latest source revisions");
    for (const source of plan.resolvedSources) {
      lines.push(`  ${source.commit.slice(0, 8)}  ${source.id}`);
      lines.push(`            ${source.repository}#${source.ref.replace("refs/heads/", "")}`);
    }
  }
  lines.push("", `Changes (${plan.actions.length})`);
  if (plan.actions.length === 0) {
    lines.push("  No filesystem changes");
  } else {
    for (const action of plan.actions) {
      lines.push(...formatAction(action));
    }
  }
  if (plan.selection.mcpIds.length > 0) {
    lines.push("");
    lines.push("MCP connections");
    for (const id of plan.selection.mcpIds) {
      const server = pack.mcp.find((candidate) => candidate.id === id);
      if (server !== undefined) {
        const auth =
          server.bearerTokenEnvVar === undefined
            ? "no credential"
            : "optional env " + server.bearerTokenEnvVar;
        lines.push("  " + id + "  " + server.url + " (" + auth + ")");
      }
    }
  }
  lines.push("", "Safety");
  lines.push(
    plan.backupTargets.length > 0
      ? `  Backup       ${plan.backupTargets.length} changed ${plural(plan.backupTargets.length, "target")} before apply`
      : "  Backup       not needed",
  );
  lines.push("  Credentials  values are never written; only environment-variable names are stored");
  if (plan.uninstall) {
    lines.push("  State        removed after managed components are removed");
  }

  if (plan.conflicts.length > 0) {
    lines.push("", "Blocked by conflicts");
    for (const conflict of plan.conflicts) {
      lines.push("  " + conflict.component + " at " + conflict.target);
      lines.push("    " + conflict.message);
    }
  } else {
    lines.push("", `Status    Ready to ${plan.uninstall ? "uninstall" : "install"}`);
  }
  return lines.join("\n") + "\n";
}

export function planAsJson(plan: ChangePlan): string {
  return (
    JSON.stringify(
      {
        pack: { name: plan.packName, version: plan.packVersion },
        mode: plan.mode,
        adapters: plan.adapters,
        selection: plan.selection,
        resolvedSources: plan.resolvedSources,
        actions: plan.actions.map((action) => publicAction(action)),
        conflicts: plan.conflicts,
        backupRequired: plan.backupTargets.length > 0,
        writesCredentialValues: false,
      },
      null,
      2,
    ) + "\n"
  );
}

export function formatGuidedReview(
  plan: ChangePlan,
  pack: LoadedPack,
  layout: HomeLayout,
): string {
  const lines = [
    `Agents       ${plan.adapters.map((id) => adapterById(id).displayName).join(", ")}`,
    `Strategy     ${plan.mode === "overwrite" ? "replace managed surfaces" : "merge with existing setup"}`,
    `Skills       ${formatSelection(plan.selection.skillIds)}`,
    `MCP          ${formatSelection(plan.selection.mcpIds)}`,
    "",
    `Changes      ${plan.actions.length} ${plural(plan.actions.length, "target group")}`,
  ];

  for (const action of plan.actions) {
    lines.push(`  ${guidedActionLabel(action).padEnd(8)} ${guidedActionTitle(action)}`);
    lines.push(`           ${displayHomePath(action.target, layout.home)}`);
  }
  if (plan.actions.length === 0) {
    lines.push("  No filesystem changes");
  }

  if (plan.resolvedSources.length > 0) {
    lines.push("", "Latest source revisions");
    for (const source of plan.resolvedSources) {
      lines.push(`  ${source.commit.slice(0, 8)}  ${source.id} (${source.ref.replace("refs/heads/", "")})`);
    }
  }

  lines.push(
    "",
    `Backup       ${plan.backupTargets.length === 0 ? "not needed" : `${plan.backupTargets.length} changed ${plural(plan.backupTargets.length, "target")}`}`,
    "Credentials  values are never written",
  );
  if (plan.selection.mcpIds.length > 0) {
    const hosts = plan.selection.mcpIds
      .map((id) => pack.mcp.find((server) => server.id === id))
      .filter((server) => server !== undefined)
      .map((server) => new URL(server.url).host);
    lines.push(`Network      selected MCP servers may send requested data to ${hosts.join(", ")}`);
  }
  if (plan.conflicts.length > 0) {
    lines.push("", "Blocked by conflicts");
    for (const conflict of plan.conflicts) {
      lines.push(`  ${conflict.component}: ${displayHomePath(conflict.target, layout.home)}`);
      lines.push(`    ${conflict.message}`);
    }
  }
  return lines.join("\n");
}

function formatAction(action: PlanAction): string[] {
  if (action.kind === "file") {
    return [
      "  " + action.operation.toUpperCase().padEnd(8) + "[" + action.adapter + "] " + action.component,
      "          " + action.target,
      "          " + action.summary,
    ];
  }
  if (action.kind === "skills") {
    const lines = [
      "  " + action.operation.toUpperCase().padEnd(8) + "[shared] skills",
      "          " + action.target,
      "          " + action.summary,
    ];
    for (const entry of action.entries) {
      lines.push("          " + entry.operation.toUpperCase().padEnd(9) + entry.id);
    }
    if (action.entries.length === 0) {
      lines.push("          empty selection");
    }
    return lines;
  }
  const lines = [
    "  REMOVE  [shared] skills",
    "          " + action.target,
    "          " + action.summary,
  ];
  for (const entry of action.entries) {
    lines.push("          REMOVE   " + entry.id);
  }
  return lines;
}

function formatSelection(ids: string[]): string {
  return ids.length === 0 ? "none" : `${ids.length} selected - ${ids.join(", ")}`;
}

function guidedActionLabel(action: PlanAction): string {
  if (action.kind === "skills-remove") return "REMOVE";
  return action.operation.toUpperCase();
}

function guidedActionTitle(action: PlanAction): string {
  if (action.kind === "file") {
    return `${adapterById(action.adapter).displayName} ${action.component}`;
  }
  return action.kind === "skills" ? "Shared skills" : "Managed skills";
}

export function displayHomePath(path: string, home: string): string {
  if (path === home) return "~";
  return path.startsWith(home + sep) ? "~/" + path.slice(home.length + 1) : path;
}

function plural(count: number, word: string): string {
  return count === 1 ? word : word + "s";
}

function publicAction(action: PlanAction): Record<string, unknown> {
  if (action.kind === "file") {
    return {
      kind: action.kind,
      component: action.component,
      adapter: action.adapter,
      target: action.target,
      operation: action.operation,
      summary: action.summary,
    };
  }
  return {
    kind: action.kind,
    target: action.target,
    operation: action.kind === "skills" ? action.operation : "remove",
    entries: action.entries.map((entry) => ({
      id: entry.id,
      name: entry.name,
      source: "sourceRevision" in entry ? entry.sourceRevision : undefined,
      target: entry.target,
      operation: "operation" in entry ? entry.operation : "remove",
    })),
    summary: action.summary,
  };
}
