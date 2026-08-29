import { sep } from "node:path";
import { adapterById } from "./adapters/index.js";
import type { ChangePlan, HomeLayout, LoadedPack, PlanAction } from "./types.js";
import { portablePath } from "./util/values.js";

export function formatPlan(plan: ChangePlan, pack: LoadedPack): string {
  const operation = planOperation(plan);
  const lines = [
    `AgentPack ${operation} plan`,
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
  if (plan.reconciliation !== undefined) {
    lines.push("", "Ownership reconciliation");
    lines.push(...formatReconciliation(plan.reconciliation));
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
    lines.push("", `Status    Ready to ${operation}`);
  }
  return lines.join("\n") + "\n";
}

export function planAsJson(plan: ChangePlan): string {
  return (
    JSON.stringify(
      {
        pack: { name: plan.packName, version: plan.packVersion },
        operation: planOperation(plan),
        mode: plan.mode,
        adapters: plan.adapters,
        selection: plan.selection,
        resolvedSources: plan.resolvedSources,
        actions: plan.actions.map((action) => publicAction(action)),
        conflicts: plan.conflicts,
        reconciliation: plan.reconciliation,
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

  if (plan.reconciliation !== undefined) {
    lines.push("", "Ownership reconciliation");
    lines.push(...formatReconciliation(plan.reconciliation));
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
      "  " + action.operation.toUpperCase().padEnd(8) + "[" + action.adapter + "] skills",
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
    "  REMOVE  [" + action.adapter + "] skills",
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
  const owner =
    action.adapter === "legacy"
      ? "Legacy"
      : adapterById(action.adapter).displayName;
  return owner + " skills";
}

export function displayHomePath(path: string, home: string): string {
  if (path === home) return "~";
  const displayed = path.startsWith(home + sep) ? "~/" + path.slice(home.length + 1) : path;
  return portablePath(displayed);
}

function plural(count: number, word: string): string {
  return count === 1 ? word : word + "s";
}

function planOperation(plan: ChangePlan): "install" | "reconcile" | "uninstall" {
  return plan.uninstall ? "uninstall" : plan.reconcile ? "reconcile" : "install";
}

function formatReconciliation(
  reconciliation: NonNullable<ChangePlan["reconciliation"]>,
): string[] {
  const lines: string[] = [];
  for (const component of reconciliation.adopted) {
    lines.push("  ADOPT    " + component + " (catalog-equivalent; content unchanged)");
  }
  for (const component of reconciliation.replaced) {
    lines.push("  REPLACE  " + component + " (targeted replacement with backup)");
  }
  for (const component of reconciliation.kept) {
    lines.push("  KEEP     " + component + " (unmanaged and excluded on every target)");
  }
  if (lines.length === 0) {
    lines.push("  No ownership changes selected");
  }
  return lines;
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
    adapter: action.adapter,
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
