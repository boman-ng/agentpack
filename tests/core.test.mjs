import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { mkdtemp, mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import { parse as parseToml } from "@decimalturn/toml-patch";
import { parse as parseJsonc } from "jsonc-parser";

import { CodexAdapter } from "../dist/adapters/codex.js";
import { KimiAdapter } from "../dist/adapters/kimi.js";
import { OpenCodeAdapter } from "../dist/adapters/opencode.js";
import { runDoctor } from "../dist/doctor.js";
import { applyInstallPlan } from "../dist/installer.js";
import { createHomeLayout } from "../dist/layout.js";
import { loadPack } from "../dist/manifest.js";
import { displayHomePath, formatGuidedReview, formatPlan, planAsJson } from "../dist/plan-output.js";
import { buildInstallPlan } from "../dist/planner.js";
import { disposeInstallPlan } from "../dist/sources.js";
import { findPackRoot } from "../dist/runtime.js";
import { loadState } from "../dist/state.js";
import { applyUninstallPlan, buildUninstallPlan } from "../dist/uninstall.js";
import { portablePath } from "../dist/util/values.js";

const execFileAsync = promisify(execFile);
const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const pack = await loadPack(repositoryRoot);
const anysearch = pack.mcp.find((server) => server.id === "anysearch");
assert.ok(anysearch);

async function temporaryHome(t) {
  const home = await mkdtemp(join(tmpdir(), "agentpack-test-"));
  t.after(async () => {
    await rm(home, { recursive: true, force: true });
  });
  return { home, layout: createHomeLayout(home) };
}

async function put(path, content) {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, content, "utf8");
}

async function createOnlineFixture(home, body = "version one\n") {
  const repository = join(home, "upstream");
  await mkdir(repository, { recursive: true });
  await execFileAsync("git", ["init", "--quiet", "--initial-branch=main"], {
    cwd: repository,
  });
  await execFileAsync("git", ["config", "user.name", "AgentPack Test"], {
    cwd: repository,
  });
  await execFileAsync("git", ["config", "user.email", "agentpack@example.invalid"], {
    cwd: repository,
  });
  const skillFile = join(repository, "skills", "online-demo", "SKILL.md");
  const fixture = {
    repository,
    skillFile,
    onlinePack: {
      ...pack,
      skills: [
        {
          id: "online-demo",
          name: "online-demo",
          category: "test",
          domain: "fixture",
          sourceId: "online-fixture",
          path: "skills/online-demo",
        },
      ],
      skillSources: [
        {
          id: "online-fixture",
          kind: "git",
          repository,
          ref: "refs/heads/main",
          license: "MIT",
        },
      ],
    },
  };
  const commit = await commitOnlineFixture(fixture, body, "fixture");
  return { ...fixture, commit };
}

async function commitOnlineFixture(fixture, body, message) {
  await put(
    fixture.skillFile,
    "---\nname: online-demo\ndescription: fetched online\n---\n\n" + body,
  );
  await execFileAsync("git", ["add", "."], { cwd: fixture.repository });
  await execFileAsync("git", ["commit", "--quiet", "-m", message], {
    cwd: fixture.repository,
  });
  return (
    await execFileAsync("git", ["rev-parse", "HEAD"], { cwd: fixture.repository })
  ).stdout.trim();
}

test("canonical manifest loads categorized skills, profiles, and online sources", async () => {
  assert.equal(pack.name, "boman-ng/agentpack");
  assert.equal(pack.version, "0.1.0");
  assert.equal(
    JSON.parse(await readFile(join(repositoryRoot, "agentpack.lock"), "utf8")).schemaVersion,
    1,
  );
  assert.equal(pack.skills.length, 16);
  assert.deepEqual(pack.targets, ["codex", "kimi", "opencode"]);
  assert.ok(pack.profiles.some((profile) => profile.id === "full"));
  assert.equal(
    pack.profiles.find((profile) => profile.id === "full")?.skills.length,
    pack.skills.length,
  );
  assert.match(await readFile(pack.instructionPath, "utf8"), /^# Global Codex Instructions/m);
  const impeccable = pack.skillSources.find((source) => source.id === "impeccable");
  assert.equal(impeccable?.kind, "git");
  assert.equal(impeccable?.ref, "refs/heads/main");
  assert.equal(impeccable?.commit, undefined);
  const academic = pack.skillSources.find(
    (source) => source.id === "academic-research-skills-codex",
  );
  assert.equal(academic?.kind, "git");
  assert.equal(academic?.ref, "refs/heads/main");
  assert.equal(academic?.commit, undefined);
  const agentBrowser = pack.skillSources.find((source) => source.id === "agent-browser");
  assert.equal(agentBrowser?.kind, "git");
  assert.equal(agentBrowser?.repository, "https://github.com/vercel-labs/agent-browser.git");
  assert.equal(agentBrowser?.ref, "refs/heads/main");
  assert.equal(agentBrowser?.commit, undefined);
  assert.ok(
    pack.profiles.find((profile) => profile.id === "coding")?.skills.includes("agent-browser"),
  );
  assert.ok(
    pack.profiles.find((profile) => profile.id === "frontend")?.skills.includes("agent-browser"),
  );
  assert.equal(anysearch.source.id, "anysearch-mcp-server");
  assert.equal(anysearch.authenticationOptional, true);
  assert.equal(anysearch.bearerTokenEnvVar, undefined);
});

test("lock paths use portable separators on every operating system", async () => {
  assert.equal(portablePath("profiles\\coding.yaml"), "profiles/coding.yaml");
  const lock = JSON.parse(await readFile(join(repositoryRoot, "agentpack.lock"), "utf8"));
  const serializedPaths = [
    lock.artifacts.instructions.path,
    ...lock.artifacts.skills.map((skill) => skill.path),
    ...lock.artifacts.mcp.map((server) => server.path),
    ...lock.artifacts.profiles.map((profile) => profile.path),
  ];
  assert.equal(serializedPaths.some((path) => path.includes("\\")), false);
});

test("home-relative paths use portable separators in user-facing output", async (t) => {
  const { home } = await temporaryHome(t);
  assert.equal(displayHomePath(join(home, ".codex", "AGENTS.md"), home), "~/.codex/AGENTS.md");
});

test("append adopts an exact canonical instruction file without duplicating it", async (t) => {
  const { layout } = await temporaryHome(t);
  const canonical = await readFile(pack.instructionPath, "utf8");
  await put(join(layout.codexHome, "AGENTS.md"), canonical);

  const plan = await buildInstallPlan(pack, layout, {
    mode: "append",
    adapters: ["codex"],
    selection: { skillIds: [], mcpIds: [] },
  });
  const action = plan.actions.find(
    (candidate) => candidate.kind === "file" && candidate.component === "instructions",
  );
  assert.equal(action?.kind, "file");
  assert.equal(action?.after?.match(/^# Global Codex Instructions$/gm)?.length, 1);
  assert.match(action?.after ?? "", /agentpack:boman-ng\/agentpack:start/);

  const result = await applyInstallPlan(pack, layout, plan);
  assert.equal(result.state.managed.instructions[0]?.strategy, "managed-block");
  assert.equal(
    (await readFile(join(layout.codexHome, "AGENTS.md"), "utf8")).match(
      /^# Global Codex Instructions$/gm,
    )?.length,
    1,
  );
});

test("online install locks the previewed Git revision and update resolves latest", async (t) => {
  const { home, layout } = await temporaryHome(t);
  const fixture = await createOnlineFixture(home);
  const { onlinePack, repository } = fixture;
  const firstCommit = fixture.commit;

  const firstPlan = await buildInstallPlan(onlinePack, layout, {
    mode: "append",
    adapters: ["codex"],
    selection: { skillIds: ["online-demo"], mcpIds: [] },
  });
  assert.deepEqual(firstPlan.resolvedSources, [
    {
      id: "online-fixture",
      repository,
      ref: "refs/heads/main",
      commit: firstCommit,
    },
  ]);
  const publicPlan = planAsJson(firstPlan);
  assert.match(publicPlan, new RegExp(firstCommit));
  assert.doesNotMatch(publicPlan, /agentpack-sources-/);

  const secondCommit = await commitOnlineFixture(fixture, "version two\n", "version two");

  const firstResult = await applyInstallPlan(onlinePack, layout, firstPlan);
  assert.match(
    await readFile(join(layout.sharedSkills, "online-demo", "SKILL.md"), "utf8"),
    /version one/,
  );
  assert.equal(firstResult.state.managed.skills[0]?.source.commit, firstCommit);

  const updatePlan = await buildInstallPlan(onlinePack, layout, {
    mode: "append",
    adapters: ["codex"],
    selection: { skillIds: ["online-demo"], mcpIds: [] },
    previousState: firstResult.state,
  });
  assert.equal(updatePlan.resolvedSources[0]?.commit, secondCommit);
  const updateResult = await applyInstallPlan(
    onlinePack,
    layout,
    updatePlan,
    firstResult.state,
  );
  assert.match(
    await readFile(join(layout.sharedSkills, "online-demo", "SKILL.md"), "utf8"),
    /version two/,
  );
  assert.equal(updateResult.state.managed.skills[0]?.source.commit, secondCommit);
});

test("discarded online plans remove their temporary checkout", async (t) => {
  const { home, layout } = await temporaryHome(t);
  const { onlinePack } = await createOnlineFixture(home);
  const plan = await buildInstallPlan(onlinePack, layout, {
    mode: "append",
    adapters: ["codex"],
    selection: { skillIds: ["online-demo"], mcpIds: [] },
  });
  const stagedSource = plan.actions
    .find((action) => action.kind === "skills")
    ?.entries.at(0)?.source;
  assert.ok(stagedSource);
  assert.ok(await readFile(join(stagedSource, "SKILL.md"), "utf8"));
  await disposeInstallPlan(plan);
  await assert.rejects(readFile(join(stagedSource, "SKILL.md"), "utf8"));
});

test("apply rejects changed staged source before backup or user-home mutation", async (t) => {
  const { home, layout } = await temporaryHome(t);
  const { onlinePack } = await createOnlineFixture(home);
  const plan = await buildInstallPlan(onlinePack, layout, {
    mode: "append",
    adapters: ["codex"],
    selection: { skillIds: ["online-demo"], mcpIds: [] },
  });
  const stagedSource = plan.actions
    .find((action) => action.kind === "skills")
    ?.entries.at(0)?.source;
  assert.ok(stagedSource);
  await writeFile(join(stagedSource, "SKILL.md"), "tampered after preview\n", "utf8");

  await assert.rejects(
    applyInstallPlan(onlinePack, layout, plan),
    /Prepared online source changed or expired/,
  );
  await assert.rejects(readFile(join(layout.codexHome, "AGENTS.md"), "utf8"));
  await assert.rejects(readdir(layout.backupsRoot));
  assert.equal(await loadState(layout.stateFile), undefined);
});

test("online source validation fails closed without a bundled fallback", async (t) => {
  const { home, layout } = await temporaryHome(t);
  const { onlinePack } = await createOnlineFixture(home);
  onlinePack.skills[0].path = "skills/not-present";

  await assert.rejects(
    buildInstallPlan(onlinePack, layout, {
      mode: "append",
      adapters: ["codex"],
      selection: { skillIds: ["online-demo"], mcpIds: [] },
    }),
    /Skill path does not exist/,
  );
  await assert.rejects(readFile(join(layout.codexHome, "AGENTS.md"), "utf8"));
  await assert.rejects(readdir(layout.backupsRoot));
  assert.equal(await loadState(layout.stateFile), undefined);
});

test("Codex append preserves comments and unrelated TOML", () => {
  const adapter = new CodexAdapter();
  const existing =
    '# keep this comment\nmodel = "example"\n\n[mcp_servers.existing]\nurl = "https://existing.invalid/mcp"\n';
  const rendered = adapter.renderMcp(
    existing,
    [anysearch],
    "append",
    new Set(),
    "/isolated/.codex/config.toml",
  );
  assert.equal(rendered.conflicts.length, 0);
  assert.match(rendered.content, /# keep this comment/);
  const parsed = parseToml(rendered.content, { integersAsBigInt: false });
  assert.equal(parsed.model, "example");
  assert.equal(parsed.mcp_servers.existing.url, "https://existing.invalid/mcp");
  assert.equal(parsed.mcp_servers.anysearch.url, "https://api.anysearch.com/mcp");
  assert.equal(parsed.mcp_servers.anysearch.bearer_token_env_var, undefined);
  assert.ok(rendered.content.endsWith("\n"));
});

test("Kimi and OpenCode adapters render native MCP schemas and preserve JSONC", () => {
  const kimi = new KimiAdapter().renderMcp(
    '{"other":true,"mcpServers":{"existing":{"url":"https://existing.invalid"}}}\n',
    [anysearch],
    "append",
    new Set(),
    "/isolated/.kimi-code/mcp.json",
  );
  const kimiConfig = JSON.parse(kimi.content);
  assert.equal(kimiConfig.other, true);
  assert.equal(kimiConfig.mcpServers.anysearch.bearerTokenEnvVar, undefined);
  assert.ok(kimiConfig.mcpServers.existing);

  const opencodeExisting =
    '{\n  // preserve this comment\n  "$schema": "https://opencode.ai/config.json",\n  "theme": "dark",\n  "mcp": {}\n}\n';
  const opencode = new OpenCodeAdapter().renderMcp(
    opencodeExisting,
    [anysearch],
    "append",
    new Set(),
    "/isolated/.config/opencode/opencode.json",
  );
  assert.match(opencode.content, /preserve this comment/);
  const opencodeConfig = parseJsonc(opencode.content);
  assert.equal(opencodeConfig.theme, "dark");
  assert.equal(opencodeConfig.mcp.anysearch.headers.Authorization, undefined);
  assert.equal(opencodeConfig.mcp.anysearch.headers["X-Anysearch-Client"], "mcp/1.0.0");
});

test("append install is transactional, idempotent, diagnosable, and safely uninstallable", async (t) => {
  const { home, layout } = await temporaryHome(t);
  const codexInstructions = "User Codex rules\n";
  const kimiInstructions = "User generic rules\n";
  const opencodeInstructions = "User OpenCode rules\n";
  await put(join(layout.codexHome, "AGENTS.md"), codexInstructions);
  await put(join(layout.sharedAgentsHome, "AGENTS.md"), kimiInstructions);
  await put(join(layout.opencodeHome, "AGENTS.md"), opencodeInstructions);
  await put(
    join(layout.codexHome, "config.toml"),
    '# user comment\nmodel = "kept"\n\n[mcp_servers.existing]\nurl = "https://existing.invalid/mcp"\n',
  );
  await put(
    join(layout.kimiHome, "mcp.json"),
    '{"other":"kept","mcpServers":{"existing":{"url":"https://existing.invalid/mcp"}}}\n',
  );
  await put(
    join(layout.opencodeHome, "opencode.json"),
    '{\n  // user comment\n  "theme": "kept",\n  "mcp": {"existing":{"type":"remote","url":"https://existing.invalid/mcp"}}\n}\n',
  );
  await put(
    join(layout.sharedSkills, "user-skill", "SKILL.md"),
    "---\nname: user-skill\ndescription: user owned\n---\n",
  );

  const plan = await buildInstallPlan(pack, layout, {
    mode: "append",
    adapters: ["codex", "kimi", "opencode"],
    selection: { skillIds: ["cleanup"], mcpIds: ["anysearch"] },
  });
  assert.equal(plan.conflicts.length, 0);
  assert.equal(await loadState(layout.stateFile), undefined);

  const result = await applyInstallPlan(pack, layout, plan);
  assert.ok(result.backupPath);
  assert.ok(await readFile(join(result.backupPath, "manifest.json"), "utf8"));
  assert.match(await readFile(join(layout.codexHome, "AGENTS.md"), "utf8"), /^User Codex rules/);
  assert.match(
    await readFile(join(layout.codexHome, "AGENTS.md"), "utf8"),
    /agentpack:boman-ng\/agentpack:start/,
  );
  assert.ok(await readFile(join(layout.sharedSkills, "cleanup", "SKILL.md"), "utf8"));
  assert.ok(await readFile(join(layout.sharedSkills, "user-skill", "SKILL.md"), "utf8"));
  assert.match(await readFile(join(layout.codexHome, "config.toml"), "utf8"), /user comment/);
  assert.match(await readFile(join(layout.opencodeHome, "opencode.json"), "utf8"), /user comment/);

  const state = await loadState(layout.stateFile);
  assert.ok(state);
  const checks = await runDoctor(pack, layout, state);
  assert.equal(checks.every((check) => check.ok), true);

  const updatePlan = await buildInstallPlan(pack, layout, {
    mode: "append",
    adapters: ["codex", "kimi", "opencode"],
    selection: { skillIds: ["cleanup"], mcpIds: ["anysearch"] },
    previousState: state,
  });
  assert.equal(updatePlan.conflicts.length, 0);
  assert.equal(updatePlan.actions.length, 0);

  const uninstallPlan = await buildUninstallPlan(pack, layout, state);
  assert.equal(uninstallPlan.conflicts.length, 0);
  await applyUninstallPlan(layout, uninstallPlan);
  assert.equal(await loadState(layout.stateFile), undefined);
  assert.equal(await readFile(join(layout.codexHome, "AGENTS.md"), "utf8"), codexInstructions);
  assert.equal(await readFile(join(layout.sharedAgentsHome, "AGENTS.md"), "utf8"), kimiInstructions);
  assert.equal(
    await readFile(join(layout.opencodeHome, "AGENTS.md"), "utf8"),
    opencodeInstructions,
  );
  await assert.rejects(readFile(join(layout.sharedSkills, "cleanup", "SKILL.md"), "utf8"));
  assert.ok(await readFile(join(layout.sharedSkills, "user-skill", "SKILL.md"), "utf8"));
  const codexAfter = parseToml(
    await readFile(join(layout.codexHome, "config.toml"), "utf8"),
    { integersAsBigInt: false },
  );
  assert.equal(codexAfter.model, "kept");
  assert.ok(codexAfter.mcp_servers.existing);
  assert.equal(codexAfter.mcp_servers.anysearch, undefined);
  const kimiAfter = JSON.parse(await readFile(join(layout.kimiHome, "mcp.json"), "utf8"));
  assert.equal(kimiAfter.other, "kept");
  assert.ok(kimiAfter.mcpServers.existing);
  assert.equal(kimiAfter.mcpServers.anysearch, undefined);
  const opencodeAfter = parseJsonc(
    await readFile(join(layout.opencodeHome, "opencode.json"), "utf8"),
  );
  assert.equal(opencodeAfter.theme, "kept");
  assert.ok(opencodeAfter.mcp.existing);
  assert.equal(opencodeAfter.mcp.anysearch, undefined);
  void home;
});

test("overwrite resets only supported configuration surfaces and preserves credentials", async (t) => {
  const { layout } = await temporaryHome(t);
  await put(join(layout.codexHome, "config.toml"), 'model = "remove-me"\n');
  await put(join(layout.codexHome, "credentials.json"), '{"token":"preserve-me"}\n');
  await put(join(layout.kimiHome, "credentials", "account.json"), '{"keep":true}\n');
  await put(join(layout.opencodeHome, "opencode.json"), '{"theme":"remove-me"}\n');
  await put(
    join(layout.sharedSkills, "old-skill", "SKILL.md"),
    "---\nname: old-skill\ndescription: remove in overwrite\n---\n",
  );

  const plan = await buildInstallPlan(pack, layout, {
    mode: "overwrite",
    adapters: ["codex", "kimi", "opencode"],
    selection: { skillIds: [], mcpIds: [] },
  });
  assert.equal(plan.conflicts.length, 0);
  const result = await applyInstallPlan(pack, layout, plan);
  assert.ok(result.backupPath);
  assert.equal(
    await readFile(join(layout.codexHome, "credentials.json"), "utf8"),
    '{"token":"preserve-me"}\n',
  );
  assert.equal(
    await readFile(join(layout.kimiHome, "credentials", "account.json"), "utf8"),
    '{"keep":true}\n',
  );
  await assert.rejects(readFile(join(layout.sharedSkills, "old-skill", "SKILL.md"), "utf8"));
  assert.equal(
    await readFile(join(layout.codexHome, "AGENTS.md"), "utf8"),
    await readFile(pack.instructionPath, "utf8"),
  );
  const codexConfig = await readFile(join(layout.codexHome, "config.toml"), "utf8");
  assert.equal(Object.keys(parseToml(codexConfig, { integersAsBigInt: false })).length, 0);
  const openCode = JSON.parse(
    await readFile(join(layout.opencodeHome, "opencode.json"), "utf8"),
  );
  assert.deepEqual(openCode.mcp, {});
  assert.equal(openCode.theme, undefined);
  const state = await loadState(layout.stateFile);
  assert.ok(state);
  assert.deepEqual(state.selection, { skillIds: [], mcpIds: [] });
  assert.equal((await runDoctor(pack, layout, state)).every((check) => check.ok), true);
});

test("CLI plan has a scannable safe default and performs no writes", async (t) => {
  const { home } = await temporaryHome(t);
  const { stdout } = await execFileAsync(
    process.execPath,
    [
      join(repositoryRoot, "dist", "cli.js"),
      "plan",
      "--home",
      home,
      "--agents",
      "codex",
    ],
    { cwd: repositoryRoot },
  );
  assert.match(stdout, /Strategy  replace managed surfaces/);
  assert.match(stdout, /Skills    none/);
  assert.match(stdout, /MCP       none/);
  assert.match(stdout, /Status    Ready to install/);
  await assert.rejects(readFile(join(home, ".agentpack", "state.json"), "utf8"));
});

test("guided review exposes impact, backup, and MCP network boundaries", async (t) => {
  const { layout } = await temporaryHome(t);
  const plan = await buildInstallPlan(pack, layout, {
    mode: "overwrite",
    adapters: ["codex"],
    selection: { skillIds: [], mcpIds: ["anysearch"] },
  });
  try {
    const review = formatGuidedReview(plan, pack, layout);
    assert.match(review, /Agents\s+Codex CLI/);
    assert.match(review, /Strategy\s+replace managed surfaces/);
    assert.match(review, /~\/\.codex\/AGENTS\.md/);
    assert.match(review, /Backup\s+\d+ changed targets?/);
    assert.match(review, /Network\s+selected MCP servers may send requested data to/);
    assert.ok(review.includes(new URL(anysearch.url).host));
  } finally {
    await disposeInstallPlan(plan);
  }
});

test("JSON install output stays machine-readable and never opens the TUI", async (t) => {
  const { home } = await temporaryHome(t);
  const { stdout } = await execFileAsync(
    process.execPath,
    [
      join(repositoryRoot, "dist", "cli.js"),
      "install",
      "--json",
      "--home",
      home,
      "--agents",
      "codex",
      "--skills",
      "none",
      "--mcp",
      "none",
    ],
    { cwd: repositoryRoot },
  );
  const output = JSON.parse(stdout);
  assert.equal(output.mode, "overwrite");
  assert.deepEqual(output.selection, { skillIds: [], mcpIds: [] });
  await assert.rejects(readFile(join(home, ".agentpack", "state.json"), "utf8"));
});

test("plain plan and help describe the new guided interaction", async (t) => {
  const { layout } = await temporaryHome(t);
  const plan = await buildInstallPlan(pack, layout, {
    mode: "overwrite",
    adapters: ["codex"],
    selection: { skillIds: [], mcpIds: [] },
  });
  try {
    const output = formatPlan(plan, pack);
    assert.match(output, /^AgentPack install plan/);
    assert.match(output, /Changes \(\d+\)/);
    assert.match(output, /Credentials\s+values are never written/);
  } finally {
    await disposeInstallPlan(plan);
  }
  const { stdout } = await execFileAsync(
    process.execPath,
    [join(repositoryRoot, "dist", "cli.js"), "--help"],
    { cwd: repositoryRoot },
  );
  assert.match(stdout, /Guided setup when run in a terminal/);
  assert.doesNotMatch(stdout, /comma-separated/);
});

test("CLI version flags report the pack version", async () => {
  for (const argument of ["--version", "-v", "version"]) {
    const { stdout } = await execFileAsync(
      process.execPath,
      [join(repositoryRoot, "dist", "cli.js"), argument],
      { cwd: repositoryRoot },
    );
    assert.equal(stdout, pack.version + "\n");
  }
});

test("apply rejects a stale preview before backup or mutation", async (t) => {
  const { layout } = await temporaryHome(t);
  const target = join(layout.codexHome, "AGENTS.md");
  await put(target, "content seen by preview\n");
  const plan = await buildInstallPlan(pack, layout, {
    mode: "append",
    adapters: ["codex"],
    selection: { skillIds: [], mcpIds: [] },
  });

  await writeFile(target, "new user content after preview\n", "utf8");
  await assert.rejects(applyInstallPlan(pack, layout, plan), /Plan is stale/);
  assert.equal(await readFile(target, "utf8"), "new user content after preview\n");
  await assert.rejects(readdir(layout.backupsRoot));
  assert.equal(await loadState(layout.stateFile), undefined);
});

test("failed apply restores every changed target from its backup", async (t) => {
  const { layout } = await temporaryHome(t);
  const target = join(layout.codexHome, "AGENTS.md");
  await put(target, "original instructions\n");
  const plan = await buildInstallPlan(pack, layout, {
    mode: "append",
    adapters: ["codex"],
    selection: { skillIds: ["cleanup"], mcpIds: ["anysearch"] },
  });
  const mcpAction = plan.actions.find(
    (action) => action.kind === "file" && action.component === "mcp",
  );
  assert.ok(mcpAction && mcpAction.kind === "file");
  mcpAction.after = "[invalid\n";

  await assert.rejects(applyInstallPlan(pack, layout, plan));
  assert.equal(await readFile(target, "utf8"), "original instructions\n");
  await assert.rejects(readFile(join(layout.sharedSkills, "cleanup", "SKILL.md"), "utf8"));
  assert.equal(await loadState(layout.stateFile), undefined);
  assert.equal((await readdir(layout.backupsRoot)).length, 1);
});

test("append mode refuses unmanaged skill and MCP collisions", async (t) => {
  const { layout } = await temporaryHome(t);
  const unmanagedSkill = "---\nname: cleanup\ndescription: user-owned collision\n---\n";
  await put(join(layout.sharedSkills, "cleanup", "SKILL.md"), unmanagedSkill);
  const unmanagedMcp =
    '[mcp_servers.anysearch]\nurl = "https://user-owned.invalid/mcp"\n';
  await put(join(layout.codexHome, "config.toml"), unmanagedMcp);

  const plan = await buildInstallPlan(pack, layout, {
    mode: "append",
    adapters: ["codex"],
    selection: { skillIds: ["cleanup"], mcpIds: ["anysearch"] },
  });
  assert.equal(plan.conflicts.length, 2);
  await assert.rejects(applyInstallPlan(pack, layout, plan), /conflicts/);
  assert.equal(
    await readFile(join(layout.sharedSkills, "cleanup", "SKILL.md"), "utf8"),
    unmanagedSkill,
  );
  assert.equal(await readFile(join(layout.codexHome, "config.toml"), "utf8"), unmanagedMcp);
  assert.equal(await loadState(layout.stateFile), undefined);
});

test("append update refuses drifted managed instructions and MCP entries", async (t) => {
  const { layout } = await temporaryHome(t);
  const initialPlan = await buildInstallPlan(pack, layout, {
    mode: "append",
    adapters: ["codex"],
    selection: { skillIds: [], mcpIds: ["anysearch"] },
  });
  const { state } = await applyInstallPlan(pack, layout, initialPlan);
  const instructionsPath = join(layout.codexHome, "AGENTS.md");
  const mcpPath = join(layout.codexHome, "config.toml");
  const editedInstructions = (await readFile(instructionsPath, "utf8")).replace(
    "# Global Codex Instructions",
    "# User-edited Global Codex Instructions",
  );
  const editedMcp = (await readFile(mcpPath, "utf8")).replace(
    "https://api.anysearch.com/mcp",
    "https://user-edited.invalid/mcp",
  );
  await writeFile(instructionsPath, editedInstructions, "utf8");
  await writeFile(mcpPath, editedMcp, "utf8");

  const updatePlan = await buildInstallPlan(pack, layout, {
    mode: "append",
    adapters: ["codex"],
    selection: { skillIds: [], mcpIds: ["anysearch"] },
    previousState: state,
  });
  assert.equal(updatePlan.conflicts.length, 2);
  await assert.rejects(applyInstallPlan(pack, layout, updatePlan, state), /conflicts/);
  assert.equal(await readFile(instructionsPath, "utf8"), editedInstructions);
  assert.equal(await readFile(mcpPath, "utf8"), editedMcp);
});

test("uninstall refuses drifted managed content", async (t) => {
  const { layout } = await temporaryHome(t);
  const plan = await buildInstallPlan(pack, layout, {
    mode: "append",
    adapters: ["codex"],
    selection: { skillIds: ["cleanup"], mcpIds: [] },
  });
  const { state } = await applyInstallPlan(pack, layout, plan);
  const skillPath = join(layout.sharedSkills, "cleanup", "SKILL.md");
  await writeFile(skillPath, (await readFile(skillPath, "utf8")) + "\nuser edit\n", "utf8");

  const uninstallPlan = await buildUninstallPlan(pack, layout, state);
  assert.equal(uninstallPlan.conflicts.length, 1);
  await assert.rejects(applyUninstallPlan(layout, uninstallPlan), /conflicts/);
  assert.match(await readFile(skillPath, "utf8"), /user edit/);
  assert.ok(await loadState(layout.stateFile));
});

test("tampered state cannot redirect uninstall outside owned paths", async (t) => {
  const { home, layout } = await temporaryHome(t);
  const plan = await buildInstallPlan(pack, layout, {
    mode: "append",
    adapters: ["codex"],
    selection: { skillIds: ["cleanup"], mcpIds: [] },
  });
  const { state } = await applyInstallPlan(pack, layout, plan);
  const protectedPath = join(home, "user-data.txt");
  await put(protectedPath, "must survive\n");
  const tampered = structuredClone(state);
  assert.ok(tampered.managed.skills[0]);
  tampered.managed.skills[0].path = protectedPath;

  const checks = await runDoctor(pack, layout, tampered);
  assert.equal(checks.find((check) => check.label === "State ownership")?.ok, false);
  await assert.rejects(
    buildUninstallPlan(pack, layout, tampered),
    /Unsafe or inconsistent AgentPack state/,
  );
  assert.equal(await readFile(protectedPath, "utf8"), "must survive\n");
});
