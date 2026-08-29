import { adapterById } from "./adapters/index.js";
import { managedInstructionHash } from "./instructions.js";
import { lockMatches } from "./lock.js";
import {
  adapterTargetSafetyErrors,
  managedSkillOwner,
  stateOwnershipErrors,
  stateUsesLegacyLayout,
} from "./state.js";
import type {
  DoctorCheck,
  HomeLayout,
  InstallState,
  LoadedPack,
} from "./types.js";
import {
  hashPath,
  pathExists,
  readTextIfExists,
} from "./util/fs.js";
import { sha256 } from "./util/values.js";

export async function runDoctor(
  pack: LoadedPack,
  layout: HomeLayout,
  state: InstallState | undefined,
): Promise<DoctorCheck[]> {
  const checks: DoctorCheck[] = [];
  checks.push({
    ok: await lockMatches(pack),
    label: "Canonical lock",
    detail: "agentpack.lock matches package-owned instructions, source metadata, local skills, MCP catalog, and profiles.",
  });
  checks.push({
    ok: state !== undefined,
    label: "Install state",
    detail:
      state === undefined
        ? "No state file exists at the selected home."
        : "State schema loaded for " + state.pack.name + "@" + state.pack.version + ".",
  });
  if (state === undefined) {
    return checks;
  }

  const legacyLayout = stateUsesLegacyLayout(layout, state);
  checks.push({
    ok: !legacyLayout,
    label: "Vendor layout",
    detail: legacyLayout
      ? "Legacy shared AgentPack targets remain; run `agentpack update` to migrate them."
      : "Instructions and skills use adapter-owned vendor directories.",
  });

  const ownershipErrors = stateOwnershipErrors(pack, layout, state);
  checks.push({
    ok: ownershipErrors.length === 0,
    label: "State ownership",
    detail:
      ownershipErrors.length === 0
        ? "Managed paths and owners stay within AgentPack boundaries."
        : ownershipErrors.join("; "),
  });

  const targetSafetyErrors = await adapterTargetSafetyErrors(layout, state.adapters);
  checks.push({
    ok: targetSafetyErrors.length === 0,
    label: "Adapter target safety",
    detail:
      targetSafetyErrors.length === 0
        ? "Vendor targets are distinct and do not resolve into the shared user-agent directory."
        : targetSafetyErrors.join("; "),
  });

  for (const entry of state.managed.instructions) {
    const content = await readTextIfExists(entry.path);
    const actual =
      content === undefined
        ? undefined
        : entry.strategy === "managed-block"
          ? managedInstructionHash(content)
          : sha256(content);
    checks.push({
      ok: actual === entry.contentHash,
      label: entry.adapter + " instructions",
      detail:
        actual === entry.contentHash
          ? "Managed instruction content matches state."
          : "Managed instruction content is missing or has drifted.",
    });
  }

  for (const entry of state.managed.skills) {
    const exists = await pathExists(entry.path);
    const actual = exists ? await hashPath(entry.path) : undefined;
    const owner = managedSkillOwner(layout, entry) ?? "unknown";
    checks.push({
      ok: actual === entry.contentHash,
      label: owner + " skill " + entry.id,
      detail:
        actual === entry.contentHash
          ? "Installed skill hash matches state (" + formatSourceRevision(entry.source) + ")."
          : "Installed skill is missing or has drifted.",
    });
  }

  for (const entry of state.managed.mcp) {
    const content = await readTextIfExists(entry.path);
    const adapter = adapterById(entry.adapter);
    for (const [id, expected] of Object.entries(entry.entries)) {
      const actual = content === undefined ? undefined : adapter.entryHash(content, id);
      checks.push({
        ok: actual === expected,
        label: entry.adapter + " MCP " + id,
        detail:
          actual === expected
            ? "MCP entry matches state."
            : "MCP entry is missing or has drifted.",
      });
    }
  }

  const knownAdapters = new Set(pack.targets);
  checks.push({
    ok: state.adapters.every((adapter) => knownAdapters.has(adapter)),
    label: "Adapter state",
    detail: "Every state adapter is supported by this pack.",
  });
  return checks;
}

function formatSourceRevision(source: InstallState["managed"]["skills"][number]["source"]): string {
  return source.kind === "git"
    ? source.id + "@" + source.commit
    : source.id + " from AgentPack " + source.packVersion;
}

export function formatDoctor(checks: DoctorCheck[]): string {
  const lines = ["AgentPack doctor", ""];
  for (const check of checks) {
    lines.push((check.ok ? "✓ " : "! ") + check.label + ": " + check.detail);
  }
  const failures = checks.filter((check) => !check.ok).length;
  lines.push("");
  lines.push(
    failures === 0
      ? "All checks passed."
      : String(failures) + " check(s) require attention.",
  );
  return lines.join("\n") + "\n";
}
