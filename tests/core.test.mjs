import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import {
  cp,
  mkdtemp,
  mkdir,
  readFile,
  readdir,
  rm,
  symlink,
  writeFile,
} from "node:fs/promises";
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
import { loadPack, validateSkillDirectory } from "../dist/manifest.js";
import { displayHomePath, formatGuidedReview, formatPlan, planAsJson } from "../dist/plan-output.js";
import { buildInstallPlan } from "../dist/planner.js";
import { disposeInstallPlan } from "../dist/sources.js";
import { findPackRoot } from "../dist/runtime.js";
import { loadState } from "../dist/state.js";
import { applyUninstallPlan, buildUninstallPlan } from "../dist/uninstall.js";
import { hashPath } from "../dist/util/fs.js";
import { portablePath, sha256 } from "../dist/util/values.js";

const execFileAsync = promisify(execFile);
const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const pack = await loadPack(repositoryRoot);
const anysearch = pack.mcp.find((server) => server.id === "anysearch");
assert.ok(anysearch);
const adapters = {
  codex: new CodexAdapter(),
  kimi: new KimiAdapter(),
  opencode: new OpenCodeAdapter(),
};

function skillTarget(layout, adapterId, name, ...parts) {
  return join(adapters[adapterId].skillsPath(layout), name, ...parts);
}

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

async function createLegacyState(home, layout) {
  const canonical = await readFile(pack.instructionPath, "utf8");
  const legacyInstructions = join(home, ".agents", "AGENTS.md");
  const legacySkill = join(home, ".agents", "skills", "cleanup");
  const codexInstructions = join(layout.codexHome, "AGENTS.md");
  await put(legacyInstructions, canonical);
  await put(codexInstructions, canonical);
  await mkdir(dirname(legacySkill), { recursive: true });
  await cp(
    join(repositoryRoot, "skills", "maintenance", "code-quality", "cleanup"),
    legacySkill,
    { recursive: true },
  );
  const state = {
    schemaVersion: 1,
    pack: { name: pack.name, version: "0.2.0" },
    installedAt: "2026-08-29T00:00:00.000Z",
    mode: "overwrite",
    adapters: ["codex", "kimi"],
    selection: { skillIds: ["cleanup"], mcpIds: [] },
    managed: {
      instructions: [
        {
          adapter: "codex",
          path: codexInstructions,
          strategy: "overwrite",
          contentHash: sha256(canonical),
        },
        {
          adapter: "kimi",
          path: legacyInstructions,
          strategy: "overwrite",
          contentHash: sha256(canonical),
        },
      ],
      skills: [
        {
          id: "cleanup",
          name: "cleanup",
          path: legacySkill,
          contentHash: await hashPath(legacySkill),
          source: {
            id: "boman-cleanup",
            kind: "local",
            repository: "https://github.com/boman-ng/agentpack",
            packVersion: "0.2.0",
          },
        },
      ],
      mcp: [],
    },
  };
  await put(layout.stateFile, JSON.stringify(state, null, 2) + "\n");
  return { state, legacyInstructions, legacySkill };
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
  assert.equal(pack.version, "0.3.0");
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

test("unsafe skill names are rejected before adapter path construction", async () => {
  const cleanup = pack.skills.find((skill) => skill.id === "cleanup");
  assert.ok(cleanup);
  const directory = join(
    repositoryRoot,
    "skills",
    "maintenance",
    "code-quality",
    "cleanup",
  );
  for (const name of [".system", "../escape", "two--hyphens"]) {
    await assert.rejects(
      validateSkillDirectory({ ...cleanup, name }, directory),
      /must contain only lowercase letters, digits, and single hyphens/,
    );
  }
});

test("a skill source root cannot be a symlink", async (t) => {
  const { home } = await temporaryHome(t);
  const cleanup = pack.skills.find((skill) => skill.id === "cleanup");
  assert.ok(cleanup);
  const realSkill = join(home, "real-skill");
  await put(
    join(realSkill, "SKILL.md"),
    "---\nname: cleanup\ndescription: symlink fixture\n---\n",
  );
  const linkedSkill = join(home, "linked-skill");
  await symlink(realSkill, linkedSkill, process.platform === "win32" ? "junction" : "dir");
  await assert.rejects(
    validateSkillDirectory(cleanup, linkedSkill),
    /Skill root must be a real directory/,
  );
});

test("selected skill sources reject non-portable or escaping symlinks", async (t) => {
  const { home, layout } = await temporaryHome(t);
  const cleanup = pack.skills.find((skill) => skill.id === "cleanup");
  assert.ok(cleanup);
  const sourceRoot = join(home, "fixture-source");
  const skillRoot = join(sourceRoot, "cleanup");
  await put(
    join(skillRoot, "SKILL.md"),
    "---\nname: cleanup\ndescription: symlink fixture\n---\n",
  );
  const payload = join(skillRoot, "payload");
  await put(join(payload, "value.txt"), "payload\n");
  await put(join(sourceRoot, "outside", "value.txt"), "outside\n");
  const fixturePack = {
    ...pack,
    skills: [{ ...cleanup, sourceId: "symlink-fixture", path: "cleanup" }],
    skillSources: [
      {
        id: "symlink-fixture",
        kind: "local",
        root: sourceRoot,
        repository: "https://example.invalid/symlink-fixture",
        license: "MIT",
      },
    ],
  };
  const link = join(skillRoot, "linked");
  await symlink(
    payload,
    link,
    process.platform === "win32" ? "junction" : "dir",
  );
  await assert.rejects(
    buildInstallPlan(fixturePack, layout, {
      mode: "overwrite",
      adapters: ["codex"],
      selection: { skillIds: ["cleanup"], mcpIds: [] },
    }),
    /non-portable absolute symlink/,
  );
  if (process.platform === "win32") {
    return;
  }
  await rm(link);
  await symlink("../outside", link, "dir");
  await assert.rejects(
    buildInstallPlan(fixturePack, layout, {
      mode: "overwrite",
      adapters: ["codex"],
      selection: { skillIds: ["cleanup"], mcpIds: [] },
    }),
    /symlink outside its root/,
  );
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

test("adapter contracts keep every managed surface in its vendor home", async (t) => {
  const { home, layout } = await temporaryHome(t);
  assert.deepEqual(
    ["codex", "kimi", "opencode"].map((id) => ({
      id,
      instructions: adapters[id].instructionPath(layout),
      skills: adapters[id].skillsPath(layout),
      mcp: adapters[id].mcpPath(layout),
    })),
    [
      {
        id: "codex",
        instructions: join(home, ".codex", "AGENTS.md"),
        skills: join(home, ".codex", "skills"),
        mcp: join(home, ".codex", "config.toml"),
      },
      {
        id: "kimi",
        instructions: join(home, ".kimi-code", "AGENTS.md"),
        skills: join(home, ".kimi-code", "skills"),
        mcp: join(home, ".kimi-code", "mcp.json"),
      },
      {
        id: "opencode",
        instructions: join(home, ".config", "opencode", "AGENTS.md"),
        skills: join(home, ".config", "opencode", "skills"),
        mcp: join(home, ".config", "opencode", "opencode.json"),
      },
    ],
  );

  const plan = await buildInstallPlan(pack, layout, {
    mode: "overwrite",
    adapters: ["codex", "kimi", "opencode"],
    selection: { skillIds: ["cleanup"], mcpIds: [] },
  });
  try {
    const skillActions = plan.actions.filter((action) => action.kind === "skills");
    assert.deepEqual(skillActions.map((action) => action.adapter), ["codex", "kimi", "opencode"]);
    assert.equal(
      plan.actions.some((action) => action.target.startsWith(join(home, ".agents"))),
      false,
    );
    assert.equal(planAsJson(plan).includes(join(home, ".agents")), false);
  } finally {
    await disposeInstallPlan(plan);
  }
});

test("relative vendor-home environment variables follow CLI cwd resolution", async (t) => {
  const { home } = await temporaryHome(t);
  const layoutModule = new URL("../dist/layout.js", import.meta.url).href;
  const script =
    `import { createHomeLayout } from ${JSON.stringify(layoutModule)};` +
    "const layout=createHomeLayout();" +
    "process.stdout.write(JSON.stringify({cwd:process.cwd(),codex:layout.codexHome,kimi:layout.kimiHome,opencode:layout.opencodeHome}));";
  const { stdout } = await execFileAsync(
    process.execPath,
    ["--input-type=module", "--eval", script],
    {
      cwd: home,
      env: {
        ...process.env,
        CODEX_HOME: "codex-relative",
        KIMI_CODE_HOME: "kimi-relative",
        XDG_CONFIG_HOME: "xdg-relative",
      },
    },
  );
  const { cwd, ...homes } = JSON.parse(stdout);
  assert.deepEqual(homes, {
    codex: join(cwd, "codex-relative"),
    kimi: join(cwd, "kimi-relative"),
    opencode: join(cwd, "xdg-relative", "opencode"),
  });
});

test("planner rejects shared-user and overlapping adapter targets", async (t) => {
  const { home, layout } = await temporaryHome(t);
  await assert.rejects(
    buildInstallPlan(pack, { ...layout, kimiHome: join(home, ".agents") }, {
      mode: "overwrite",
      adapters: ["kimi"],
      selection: { skillIds: [], mcpIds: [] },
    }),
    /must not use the shared user-agent directory/,
  );
  await assert.rejects(
    buildInstallPlan(pack, { ...layout, kimiHome: join(home, ".AGENTS") }, {
      mode: "overwrite",
      adapters: ["kimi"],
      selection: { skillIds: [], mcpIds: [] },
    }),
    /must not use the shared user-agent directory/,
  );

  await assert.rejects(
    buildInstallPlan(
      pack,
      {
        ...layout,
        codexHome: join(home, "vendor"),
        kimiHome: join(home, "vendor", "skills", "cleanup"),
      },
      {
        mode: "overwrite",
        adapters: ["codex", "kimi"],
        selection: { skillIds: [], mcpIds: [] },
      },
    ),
    /targets overlap/,
  );

  const aliasPlan = await buildInstallPlan(pack, layout, {
    mode: "overwrite",
    adapters: ["kimi"],
    selection: { skillIds: [], mcpIds: [] },
  });
  const sharedHome = join(home, ".agents");
  await mkdir(sharedHome, { recursive: true });
  await symlink(
    sharedHome,
    layout.kimiHome,
    process.platform === "win32" ? "junction" : "dir",
  );
  await assert.rejects(
    applyInstallPlan(pack, layout, aliasPlan),
    /physical targets must not use the shared user-agent directory/,
  );
  await assert.rejects(readFile(join(sharedHome, "AGENTS.md"), "utf8"));
  await assert.rejects(
    buildInstallPlan(pack, layout, {
      mode: "overwrite",
      adapters: ["kimi"],
      selection: { skillIds: [], mcpIds: [] },
    }),
    /physical targets must not use the shared user-agent directory/,
  );

  const brokenLegacy = await temporaryHome(t);
  await symlink(
    join(brokenLegacy.home, "missing-legacy-target"),
    join(brokenLegacy.home, ".agents"),
    process.platform === "win32" ? "junction" : "dir",
  );
  const unaffected = await buildInstallPlan(pack, brokenLegacy.layout, {
    mode: "overwrite",
    adapters: ["codex", "kimi"],
    selection: { skillIds: [], mcpIds: [] },
  });
  await disposeInstallPlan(unaffected);

  const nestedAlias = await temporaryHome(t);
  const nestedVendor = join(nestedAlias.home, "vendor");
  const nestedSharedTarget = join(nestedVendor, "skills", "cleanup");
  await mkdir(nestedSharedTarget, { recursive: true });
  await symlink(
    nestedSharedTarget,
    join(nestedAlias.home, ".agents"),
    process.platform === "win32" ? "junction" : "dir",
  );
  await assert.rejects(
    buildInstallPlan(pack, { ...nestedAlias.layout, kimiHome: nestedVendor }, {
      mode: "overwrite",
      adapters: ["kimi"],
      selection: { skillIds: ["cleanup"], mcpIds: [] },
    }),
    /physical targets must not use the shared user-agent directory/,
  );

  if (process.platform !== "win32") {
    const danglingAlias = await temporaryHome(t);
    const futureVendor = join(danglingAlias.home, "future-vendor");
    await symlink(futureVendor, join(danglingAlias.home, ".agents"), "dir");
    await assert.rejects(
      buildInstallPlan(pack, { ...danglingAlias.layout, kimiHome: futureVendor }, {
        mode: "overwrite",
        adapters: ["kimi"],
        selection: { skillIds: [], mcpIds: [] },
      }),
      /physical targets must not use the shared user-agent directory/,
    );
  }
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

test("overwrite records ownership of an exact unmanaged instruction file", async (t) => {
  const { layout } = await temporaryHome(t);
  const canonical = await readFile(pack.instructionPath, "utf8");
  const target = join(layout.codexHome, "AGENTS.md");
  await put(target, canonical);

  const plan = await buildInstallPlan(pack, layout, {
    mode: "overwrite",
    adapters: ["codex"],
    selection: { skillIds: [], mcpIds: [] },
  });
  const action = plan.actions.find(
    (candidate) => candidate.kind === "file" && candidate.component === "instructions",
  );
  assert.equal(action?.operation, "adopt");
  assert.equal(plan.backupTargets[0], layout.stateFile);

  const result = await applyInstallPlan(pack, layout, plan);
  assert.deepEqual(result.state.managed.instructions, [
    {
      adapter: "codex",
      path: target,
      strategy: "overwrite",
      contentHash: sha256(canonical),
    },
  ]);
  assert.equal(await readFile(target, "utf8"), canonical);
});

test("overwrite refreshes stale ownership when targets already match a changed pack", async (t) => {
  const { home, layout } = await temporaryHome(t);
  const initialPlan = await buildInstallPlan(pack, layout, {
    mode: "overwrite",
    adapters: ["codex"],
    selection: { skillIds: ["cleanup"], mcpIds: ["anysearch"] },
  });
  const initial = await applyInstallPlan(pack, layout, initialPlan);

  const changedPack = structuredClone(pack);
  const changedInstructions =
    (await readFile(pack.instructionPath, "utf8")) + "\n# Changed pack fixture\n";
  changedPack.instructionPath = join(home, "changed-AGENTS.md");
  await put(changedPack.instructionPath, changedInstructions);
  const changedServer = changedPack.mcp.find((server) => server.id === "anysearch");
  assert.ok(changedServer);
  changedServer.url = "https://changed.example.invalid/mcp";
  const changedSkill = changedPack.skills.find((skill) => skill.id === "cleanup");
  const changedSource = changedPack.skillSources.find(
    (source) => source.id === changedSkill?.sourceId,
  );
  assert.ok(changedSkill && changedSource?.kind === "local");
  changedSource.root = join(home, "changed-source");
  changedSkill.path = "cleanup";
  await mkdir(changedSource.root, { recursive: true });
  await cp(
    join(repositoryRoot, "skills", "maintenance", "code-quality", "cleanup"),
    join(changedSource.root, changedSkill.path),
    { recursive: true },
  );
  const changedSkillFile = join(changedSource.root, changedSkill.path, "SKILL.md");
  await writeFile(
    changedSkillFile,
    (await readFile(changedSkillFile, "utf8")) + "\nChanged pack fixture\n",
    "utf8",
  );
  const installedSkill = skillTarget(layout, "codex", "cleanup");
  await rm(installedSkill, { recursive: true });
  await cp(join(changedSource.root, changedSkill.path), installedSkill, {
    recursive: true,
  });
  const mcpTarget = adapters.codex.mcpPath(layout);
  const existingMcp = await readFile(mcpTarget, "utf8");
  const changedMcp = adapters.codex.renderMcp(
    existingMcp,
    [changedServer],
    "overwrite",
    new Set(),
    mcpTarget,
  ).content;
  await writeFile(join(layout.codexHome, "AGENTS.md"), changedInstructions, "utf8");
  await writeFile(mcpTarget, changedMcp, "utf8");

  const plan = await buildInstallPlan(changedPack, layout, {
    mode: "overwrite",
    adapters: ["codex"],
    selection: { skillIds: ["cleanup"], mcpIds: ["anysearch"] },
    previousState: initial.state,
  });
  assert.deepEqual(
    plan.actions
      .filter((action) => action.kind === "file")
      .map((action) => [action.component, action.operation]),
    [
      ["instructions", "adopt"],
      ["mcp", "adopt"],
    ],
  );
  const skillAction = plan.actions.find((action) => action.kind === "skills");
  assert.equal(skillAction?.entries[0]?.operation, "adopt");
  const result = await applyInstallPlan(changedPack, layout, plan, initial.state);
  assert.equal(result.state.managed.instructions[0]?.contentHash, sha256(changedInstructions));
  assert.equal(
    result.state.managed.mcp[0]?.entries.anysearch,
    adapters.codex.entryHash(changedMcp, "anysearch"),
  );
  assert.equal(
    result.state.managed.skills[0]?.contentHash,
    await hashPath(installedSkill),
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
    await readFile(skillTarget(layout, "codex", "online-demo", "SKILL.md"), "utf8"),
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
    await readFile(skillTarget(layout, "codex", "online-demo", "SKILL.md"), "utf8"),
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

  const overwritten = new OpenCodeAdapter().renderMcp(
    '{\n  // preserve overwrite comment\n  "theme": "kept",\n  "mcp": "obsolete"\n}\n',
    [],
    "overwrite",
    new Set(),
    "/isolated/.config/opencode/opencode.json",
  );
  assert.match(overwritten.content, /preserve overwrite comment/);
  assert.deepEqual(parseJsonc(overwritten.content), {
    theme: "kept",
    mcp: {},
  });
});

test("append install is transactional, idempotent, diagnosable, and safely uninstallable", async (t) => {
  const { home, layout } = await temporaryHome(t);
  const codexInstructions = "User Codex rules\n";
  const kimiInstructions = "User generic rules\n";
  const opencodeInstructions = "User OpenCode rules\n";
  await put(join(layout.codexHome, "AGENTS.md"), codexInstructions);
  await put(join(layout.kimiHome, "AGENTS.md"), kimiInstructions);
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
    skillTarget(layout, "kimi", "user-skill", "SKILL.md"),
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
  for (const adapterId of ["codex", "kimi", "opencode"]) {
    assert.ok(await readFile(skillTarget(layout, adapterId, "cleanup", "SKILL.md"), "utf8"));
  }
  assert.ok(await readFile(skillTarget(layout, "kimi", "user-skill", "SKILL.md"), "utf8"));
  await assert.rejects(readdir(join(home, ".agents")));
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
  assert.equal(await readFile(join(layout.kimiHome, "AGENTS.md"), "utf8"), kimiInstructions);
  assert.equal(
    await readFile(join(layout.opencodeHome, "AGENTS.md"), "utf8"),
    opencodeInstructions,
  );
  for (const adapterId of ["codex", "kimi", "opencode"]) {
    await assert.rejects(readFile(skillTarget(layout, adapterId, "cleanup", "SKILL.md"), "utf8"));
  }
  assert.ok(await readFile(skillTarget(layout, "kimi", "user-skill", "SKILL.md"), "utf8"));
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
});

test("overwrite resets only supported configuration surfaces and preserves credentials", async (t) => {
  const { layout } = await temporaryHome(t);
  await put(
    join(layout.codexHome, "config.toml"),
    'model = "preserve-me"\n\n[mcp_servers.old]\nurl = "https://old.invalid/mcp"\n',
  );
  await put(join(layout.codexHome, "credentials.json"), '{"token":"preserve-me"}\n');
  await put(join(layout.kimiHome, "credentials", "account.json"), '{"keep":true}\n');
  await put(
    join(layout.kimiHome, "mcp.json"),
    '{"other":"preserve-me","mcpServers":{"old":{"url":"https://old.invalid/mcp"}}}\n',
  );
  await put(
    join(layout.opencodeHome, "opencode.json"),
    '{\n  // preserve this comment\n  "theme": "preserve-me",\n  "mcp": {"old": {"type": "remote", "url": "https://old.invalid/mcp"}}\n}\n',
  );
  await put(
    skillTarget(layout, "codex", ".system", "sentinel.txt"),
    "Codex-owned system data\n",
  );
  await put(
    skillTarget(layout, "kimi", "user-skill", "SKILL.md"),
    "---\nname: user-skill\ndescription: preserve in overwrite\n---\n",
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
  assert.equal(
    await readFile(skillTarget(layout, "codex", ".system", "sentinel.txt"), "utf8"),
    "Codex-owned system data\n",
  );
  assert.match(
    await readFile(skillTarget(layout, "kimi", "user-skill", "SKILL.md"), "utf8"),
    /preserve in overwrite/,
  );
  assert.equal(
    await readFile(join(layout.codexHome, "AGENTS.md"), "utf8"),
    await readFile(pack.instructionPath, "utf8"),
  );
  const codexConfig = await readFile(join(layout.codexHome, "config.toml"), "utf8");
  const parsedCodex = parseToml(codexConfig, { integersAsBigInt: false });
  assert.equal(parsedCodex.model, "preserve-me");
  assert.equal(parsedCodex.mcp_servers, undefined);
  const kimiConfig = JSON.parse(
    await readFile(join(layout.kimiHome, "mcp.json"), "utf8"),
  );
  assert.equal(kimiConfig.other, "preserve-me");
  assert.deepEqual(kimiConfig.mcpServers, {});
  const openCodeText = await readFile(join(layout.opencodeHome, "opencode.json"), "utf8");
  assert.match(openCodeText, /preserve this comment/);
  const openCode = parseJsonc(openCodeText);
  assert.deepEqual(openCode.mcp, {});
  assert.equal(openCode.theme, "preserve-me");
  const state = await loadState(layout.stateFile);
  assert.ok(state);
  assert.deepEqual(state.selection, { skillIds: [], mcpIds: [] });
  assert.equal((await runDoctor(pack, layout, state)).every((check) => check.ok), true);
});

test("overwrite removes only unchanged AgentPack skills from each adapter", async (t) => {
  const { home, layout } = await temporaryHome(t);
  const initialPlan = await buildInstallPlan(pack, layout, {
    mode: "append",
    adapters: ["codex", "kimi", "opencode"],
    selection: { skillIds: ["cleanup"], mcpIds: [] },
  });
  const initial = await applyInstallPlan(pack, layout, initialPlan);
  for (const adapterId of ["codex", "kimi", "opencode"]) {
    await put(
      skillTarget(layout, adapterId, "user-skill", "SKILL.md"),
      "---\nname: user-skill\ndescription: preserve sibling\n---\n",
    );
  }
  await put(
    skillTarget(layout, "codex", ".system", "sentinel.txt"),
    "preserve system skill cache\n",
  );

  const plan = await buildInstallPlan(pack, layout, {
    mode: "overwrite",
    adapters: ["codex", "kimi", "opencode"],
    selection: { skillIds: [], mcpIds: [] },
    previousState: initial.state,
  });
  const removals = plan.actions.filter((action) => action.kind === "skills-remove");
  assert.equal(removals.length, 3);
  assert.equal(removals.every((action) => action.entries.length === 1), true);
  assert.equal(
    plan.backupTargets.some((target) =>
      ["codex", "kimi", "opencode"].some(
        (id) => target === adapters[id].skillsPath(layout),
      ),
    ),
    false,
  );

  const result = await applyInstallPlan(pack, layout, plan, initial.state);
  for (const adapterId of ["codex", "kimi", "opencode"]) {
    await assert.rejects(
      readFile(skillTarget(layout, adapterId, "cleanup", "SKILL.md"), "utf8"),
    );
    assert.match(
      await readFile(skillTarget(layout, adapterId, "user-skill", "SKILL.md"), "utf8"),
      /preserve sibling/,
    );
  }
  assert.equal(
    await readFile(skillTarget(layout, "codex", ".system", "sentinel.txt"), "utf8"),
    "preserve system skill cache\n",
  );
  assert.deepEqual(result.state.selection.skillIds, []);
  assert.equal(result.state.managed.skills.length, 0);
  await assert.rejects(readdir(join(home, ".agents")));
});

test("catalog identity changes fail closed instead of rewriting skill ownership", async (t) => {
  const { layout } = await temporaryHome(t);
  const initialPlan = await buildInstallPlan(pack, layout, {
    mode: "overwrite",
    adapters: ["codex"],
    selection: { skillIds: ["cleanup"], mcpIds: [] },
  });
  const initial = await applyInstallPlan(pack, layout, initialPlan);
  const changedPack = structuredClone(pack);
  const changedSkill = changedPack.skills.find((skill) => skill.id === "cleanup");
  assert.ok(changedSkill);
  changedSkill.id = "cleanup-renamed";

  const plan = await buildInstallPlan(changedPack, layout, {
    mode: "overwrite",
    adapters: ["codex"],
    selection: { skillIds: ["cleanup-renamed"], mcpIds: [] },
    previousState: initial.state,
  });
  assert.match(plan.conflicts[0]?.message ?? "", /different catalog id/);
  await assert.rejects(
    applyInstallPlan(changedPack, layout, plan, initial.state),
    /conflicts/,
  );
  assert.match(
    await readFile(skillTarget(layout, "codex", "cleanup", "SKILL.md"), "utf8"),
    /name: cleanup/,
  );
  assert.deepEqual((await loadState(layout.stateFile))?.selection.skillIds, ["cleanup"]);
});

test("schema v1 keeps one skill selection across every recorded adapter", async (t) => {
  const { layout } = await temporaryHome(t);
  const initialPlan = await buildInstallPlan(pack, layout, {
    mode: "append",
    adapters: ["codex"],
    selection: { skillIds: ["cleanup"], mcpIds: [] },
  });
  const initial = await applyInstallPlan(pack, layout, initialPlan);

  await assert.rejects(
    buildInstallPlan(pack, layout, {
      mode: "overwrite",
      adapters: ["kimi"],
      selection: { skillIds: [], mcpIds: [] },
      previousState: initial.state,
    }),
    /requires every recorded adapter.*codex/,
  );

  const addKimi = await buildInstallPlan(pack, layout, {
    mode: "append",
    adapters: ["codex", "kimi"],
    selection: { skillIds: [], mcpIds: [] },
    previousState: initial.state,
  });
  assert.deepEqual(addKimi.selection.skillIds, ["cleanup"]);
  assert.ok(
    addKimi.actions.some(
      (action) =>
        action.kind === "skills" &&
        action.adapter === "kimi" &&
        action.entries.some((entry) => entry.id === "cleanup"),
    ),
  );
  const expanded = await applyInstallPlan(pack, layout, addKimi, initial.state);
  assert.equal(expanded.state.managed.skills.length, 2);
  assert.match(
    await readFile(skillTarget(layout, "kimi", "cleanup", "SKILL.md"), "utf8"),
    /name: cleanup/,
  );

  const clearEverywhere = await buildInstallPlan(pack, layout, {
    mode: "overwrite",
    adapters: ["codex", "kimi"],
    selection: { skillIds: [], mcpIds: [] },
    previousState: expanded.state,
  });
  assert.equal(
    clearEverywhere.actions.filter((action) => action.kind === "skills-remove").length,
    2,
  );
  const cleared = await applyInstallPlan(
    pack,
    layout,
    clearEverywhere,
    expanded.state,
  );
  assert.deepEqual(cleared.state.selection.skillIds, []);
  assert.equal(cleared.state.managed.skills.length, 0);
});

test("schema v1 fills the recorded MCP selection into every added adapter", async (t) => {
  const { layout } = await temporaryHome(t);
  const initialPlan = await buildInstallPlan(pack, layout, {
    mode: "append",
    adapters: ["codex"],
    selection: { skillIds: [], mcpIds: ["anysearch"] },
  });
  const initial = await applyInstallPlan(pack, layout, initialPlan);

  const addKimi = await buildInstallPlan(pack, layout, {
    mode: "append",
    adapters: ["codex", "kimi"],
    selection: { skillIds: [], mcpIds: [] },
    previousState: initial.state,
  });
  assert.deepEqual(addKimi.selection.mcpIds, ["anysearch"]);
  assert.ok(
    addKimi.actions.some(
      (action) =>
        action.kind === "file" &&
        action.component === "mcp" &&
        action.adapter === "kimi",
    ),
  );
  const expanded = await applyInstallPlan(pack, layout, addKimi, initial.state);
  assert.deepEqual(expanded.state.selection.mcpIds, ["anysearch"]);
  assert.deepEqual(
    expanded.state.managed.mcp.map((entry) => entry.adapter),
    ["codex", "kimi"],
  );
  assert.equal(
    expanded.state.managed.mcp.every(
      (entry) => typeof entry.entries.anysearch === "string",
    ),
    true,
  );
  assert.equal((await runDoctor(pack, layout, expanded.state)).every((check) => check.ok), true);

  const update = await buildInstallPlan(pack, layout, {
    mode: "append",
    adapters: expanded.state.adapters,
    selection: { skillIds: [], mcpIds: [] },
    previousState: expanded.state,
  });
  assert.equal(update.actions.length, 0);
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
  const args = [
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
  ];
  const { stdout } = await execFileAsync(
    process.execPath,
    args,
    { cwd: repositoryRoot },
  );
  const output = JSON.parse(stdout);
  assert.equal(output.mode, "overwrite");
  assert.deepEqual(output.selection, { skillIds: [], mcpIds: [] });
  await assert.rejects(readFile(join(home, ".agentpack", "state.json"), "utf8"));

  const applied = await execFileAsync(process.execPath, [...args, "--yes"], {
    cwd: repositoryRoot,
  });
  assert.equal(JSON.parse(applied.stdout).operation, "install");
  assert.ok(await loadState(join(home, ".agentpack", "state.json")));
  const removed = await execFileAsync(
    process.execPath,
    [
      join(repositoryRoot, "dist", "cli.js"),
      "uninstall",
      "--json",
      "--home",
      home,
      "--yes",
    ],
    { cwd: repositoryRoot },
  );
  assert.equal(JSON.parse(removed.stdout).operation, "uninstall");
  assert.equal(await loadState(join(home, ".agentpack", "state.json")), undefined);
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
  assert.match(stdout, /agentpack reconcile \[options\]/);
  assert.match(stdout, /--resolve COMPONENT=ACTION/);
  assert.doesNotMatch(stdout, /comma-separated/);
});

test("CLI reconcile previews and applies explicit targeted replacements", async (t) => {
  const { home, layout } = await temporaryHome(t);
  const skillFile = skillTarget(layout, "codex", "cleanup", "SKILL.md");
  const mcpPath = join(layout.codexHome, "config.toml");
  await put(
    skillFile,
    "---\nname: cleanup\ndescription: unmanaged CLI fixture\n---\n",
  );
  await put(
    mcpPath,
    '[mcp_servers.anysearch]\nurl = "https://unmanaged.invalid/mcp"\n',
  );
  const cli = join(repositoryRoot, "dist", "cli.js");
  const baseArgs = [
    cli,
    "reconcile",
    "--home",
    home,
    "--agents",
    "codex",
    "--skills",
    "cleanup",
    "--mcp",
    "anysearch",
  ];

  const preview = await execFileAsync(process.execPath, [...baseArgs, "--json"], {
    cwd: repositoryRoot,
  });
  const parsed = JSON.parse(preview.stdout);
  assert.equal(parsed.operation, "reconcile");
  assert.equal(parsed.conflicts.length, 2);
  assert.equal(parsed.conflicts.every((conflict) => conflict.reconcilable), true);
  assert.equal(await loadState(layout.stateFile), undefined);

  const applied = await execFileAsync(
    process.execPath,
    [
      ...baseArgs,
      "--resolve",
      "skill:cleanup=replace",
      "--resolve",
      "mcp:anysearch=replace",
      "--yes",
    ],
    { cwd: repositoryRoot },
  );
  assert.match(applied.stdout, /^AgentPack reconcile plan/m);
  assert.match(applied.stdout, /REPLACE\s+skill:cleanup/);
  assert.match(applied.stdout, /Reconciliation complete\. Backup:/);
  const state = await loadState(layout.stateFile);
  assert.ok(state);
  assert.deepEqual(state.selection, {
    skillIds: ["cleanup"],
    mcpIds: ["anysearch"],
  });
  assert.equal((await runDoctor(pack, layout, state)).every((check) => check.ok), true);

  await assert.rejects(
    execFileAsync(
      process.execPath,
      [...baseArgs, "--resolve", "skill:not-selected=replace", "--yes"],
      { cwd: repositoryRoot },
    ),
    /does not match an unmanaged collision/,
  );
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

test("planning rejects a state object that no longer matches the state file", async (t) => {
  const { layout } = await temporaryHome(t);
  const initialPlan = await buildInstallPlan(pack, layout, {
    mode: "overwrite",
    adapters: ["codex"],
    selection: { skillIds: [], mcpIds: [] },
  });
  const initial = await applyInstallPlan(pack, layout, initialPlan);
  const changedState = structuredClone(initial.state);
  changedState.installedAt = "2099-01-01T00:00:00.000Z";
  await writeFile(
    layout.stateFile,
    JSON.stringify(changedState, null, 2) + "\n",
    "utf8",
  );

  await assert.rejects(
    buildInstallPlan(pack, layout, {
      mode: "overwrite",
      adapters: ["codex", "kimi"],
      selection: initial.state.selection,
      previousState: initial.state,
    }),
    /state changed before planning/,
  );
  await assert.rejects(readFile(join(layout.kimiHome, "AGENTS.md"), "utf8"));
});

test("apply validates unchanged managed targets before recording success", async (t) => {
  const { layout } = await temporaryHome(t);
  const initialPlan = await buildInstallPlan(pack, layout, {
    mode: "append",
    adapters: ["codex"],
    selection: { skillIds: ["cleanup"], mcpIds: [] },
  });
  const initial = await applyInstallPlan(pack, layout, initialPlan);
  const expandPlan = await buildInstallPlan(pack, layout, {
    mode: "append",
    adapters: ["codex", "kimi"],
    selection: { skillIds: [], mcpIds: [] },
    previousState: initial.state,
  });
  const codexSkill = skillTarget(layout, "codex", "cleanup", "SKILL.md");
  await writeFile(
    codexSkill,
    (await readFile(codexSkill, "utf8")) + "\nconcurrent edit\n",
    "utf8",
  );

  await assert.rejects(
    applyInstallPlan(pack, layout, expandPlan, initial.state),
    /Managed skill changed during apply/,
  );
  assert.match(await readFile(codexSkill, "utf8"), /concurrent edit/);
  await assert.rejects(readFile(join(layout.kimiHome, "AGENTS.md"), "utf8"));
  assert.deepEqual((await loadState(layout.stateFile))?.adapters, ["codex"]);
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
  await assert.rejects(readFile(skillTarget(layout, "codex", "cleanup", "SKILL.md"), "utf8"));
  assert.equal(await loadState(layout.stateFile), undefined);
  assert.equal((await readdir(layout.backupsRoot)).length, 1);
});

test("append mode refuses unmanaged skill and MCP collisions", async (t) => {
  const { layout } = await temporaryHome(t);
  const unmanagedSkill = "---\nname: cleanup\ndescription: user-owned collision\n---\n";
  await put(skillTarget(layout, "codex", "cleanup", "SKILL.md"), unmanagedSkill);
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
    await readFile(skillTarget(layout, "codex", "cleanup", "SKILL.md"), "utf8"),
    unmanagedSkill,
  );
  assert.equal(await readFile(join(layout.codexHome, "config.toml"), "utf8"), unmanagedMcp);
  assert.equal(await loadState(layout.stateFile), undefined);
});

test("reconcile adopts exact unmanaged skills and MCP entries", async (t) => {
  const { layout } = await temporaryHome(t);
  const cleanupSource = join(
    repositoryRoot,
    "skills",
    "maintenance",
    "code-quality",
    "cleanup",
  );
  for (const adapterId of ["codex", "kimi", "opencode"]) {
    const root = adapters[adapterId].skillsPath(layout);
    await mkdir(root, { recursive: true });
    await cp(cleanupSource, join(root, "cleanup"), { recursive: true });
  }

  for (const adapter of [new CodexAdapter(), new KimiAdapter(), new OpenCodeAdapter()]) {
    const target = adapter.mcpPath(layout);
    const rendered = adapter.renderMcp(undefined, [anysearch], "append", new Set(), target);
    await put(target, rendered.content);
  }

  const plan = await buildInstallPlan(pack, layout, {
    mode: "append",
    adapters: ["codex", "kimi", "opencode"],
    selection: { skillIds: ["cleanup"], mcpIds: ["anysearch"] },
    reconciliation: { resolutions: {} },
  });
  assert.equal(plan.conflicts.length, 0);
  assert.deepEqual(plan.reconciliation?.kept, []);
  assert.ok(plan.reconciliation?.adopted.includes("skill:cleanup@codex"));
  assert.ok(plan.reconciliation?.adopted.includes("skill:cleanup@kimi"));
  assert.ok(plan.reconciliation?.adopted.includes("skill:cleanup@opencode"));
  assert.ok(plan.reconciliation?.adopted.includes("mcp:anysearch@codex"));
  assert.ok(plan.reconciliation?.adopted.includes("mcp:anysearch@kimi"));
  assert.ok(plan.reconciliation?.adopted.includes("mcp:anysearch@opencode"));
  assert.equal(
    plan.actions
      .find((action) => action.kind === "skills")
      ?.entries.find((entry) => entry.id === "cleanup")?.operation,
    "adopt",
  );
  assert.equal(
    plan.actions.filter(
      (action) => action.kind === "file" && action.component === "mcp" && action.operation === "adopt",
    ).length,
    3,
  );

  const result = await applyInstallPlan(pack, layout, plan);
  assert.ok(result.backupPath);
  assert.equal((await runDoctor(pack, layout, result.state)).every((check) => check.ok), true);
  const update = await buildInstallPlan(pack, layout, {
    mode: "append",
    adapters: ["codex", "kimi", "opencode"],
    selection: result.state.selection,
    previousState: result.state,
  });
  assert.equal(update.conflicts.length, 0);
  assert.equal(update.actions.length, 0);

  const uninstall = await buildUninstallPlan(pack, layout, result.state);
  assert.equal(uninstall.conflicts.length, 0);
  await applyUninstallPlan(layout, uninstall);
  for (const adapterId of ["codex", "kimi", "opencode"]) {
    await assert.rejects(readFile(skillTarget(layout, adapterId, "cleanup", "SKILL.md"), "utf8"));
  }
  for (const adapter of [new CodexAdapter(), new KimiAdapter(), new OpenCodeAdapter()]) {
    const content = await readFile(adapter.mcpPath(layout), "utf8");
    assert.equal(adapter.entryHash(content, "anysearch"), undefined);
  }
});

test("reconcile adoption rejects a target changed after preview", async (t) => {
  const { layout } = await temporaryHome(t);
  const target = skillTarget(layout, "codex", "cleanup");
  await mkdir(adapters.codex.skillsPath(layout), { recursive: true });
  await cp(
    join(repositoryRoot, "skills", "maintenance", "code-quality", "cleanup"),
    target,
    { recursive: true },
  );
  const plan = await buildInstallPlan(pack, layout, {
    mode: "append",
    adapters: ["codex"],
    selection: { skillIds: ["cleanup"], mcpIds: [] },
    reconciliation: { resolutions: {} },
  });
  assert.equal(
    plan.actions
      .find((action) => action.kind === "skills")
      ?.entries.find((entry) => entry.id === "cleanup")?.operation,
    "adopt",
  );
  await writeFile(join(target, "SKILL.md"), "changed after preview\n", "utf8");

  await assert.rejects(applyInstallPlan(pack, layout, plan), /Plan is stale/);
  assert.equal(await readFile(join(target, "SKILL.md"), "utf8"), "changed after preview\n");
  assert.equal(await loadState(layout.stateFile), undefined);
});

test("reconcile replaces divergent unmanaged components transactionally", async (t) => {
  const { layout } = await temporaryHome(t);
  const unmanagedSkill = "---\nname: cleanup\ndescription: old unmanaged copy\n---\n";
  const unmanagedMcp =
    'model = "preserved"\n\n[mcp_servers.anysearch]\nurl = "https://old.invalid/mcp"\n';
  const skillPath = skillTarget(layout, "codex", "cleanup");
  const mcpPath = join(layout.codexHome, "config.toml");
  await put(join(skillPath, "SKILL.md"), unmanagedSkill);
  await put(mcpPath, unmanagedMcp);

  const plan = await buildInstallPlan(pack, layout, {
    mode: "append",
    adapters: ["codex"],
    selection: { skillIds: ["cleanup"], mcpIds: ["anysearch"] },
    reconciliation: {
      resolutions: {
        "skill:cleanup": "replace",
        "mcp:anysearch": "replace",
      },
    },
  });
  assert.equal(plan.conflicts.length, 0);
  assert.ok(plan.reconciliation?.replaced.includes("skill:cleanup@codex"));
  assert.ok(plan.reconciliation?.replaced.includes("mcp:anysearch@codex"));
  assert.equal(
    plan.actions
      .find((action) => action.kind === "skills")
      ?.entries.find((entry) => entry.id === "cleanup")?.operation,
    "replace",
  );

  const mcpAction = plan.actions.find(
    (action) => action.kind === "file" && action.component === "mcp",
  );
  assert.ok(mcpAction && mcpAction.kind === "file");
  mcpAction.after = "[invalid\n";
  await assert.rejects(applyInstallPlan(pack, layout, plan));
  assert.equal(await readFile(join(skillPath, "SKILL.md"), "utf8"), unmanagedSkill);
  assert.equal(await readFile(mcpPath, "utf8"), unmanagedMcp);
  assert.equal(await loadState(layout.stateFile), undefined);

  const retry = await buildInstallPlan(pack, layout, {
    mode: "append",
    adapters: ["codex"],
    selection: { skillIds: ["cleanup"], mcpIds: ["anysearch"] },
    reconciliation: {
      resolutions: {
        "skill:cleanup": "replace",
        "mcp:anysearch": "replace",
      },
    },
  });
  const result = await applyInstallPlan(pack, layout, retry);
  assert.ok(result.backupPath);
  const manifest = JSON.parse(
    await readFile(join(result.backupPath, "manifest.json"), "utf8"),
  );
  const skillBackup = manifest.items.find((item) => item.target === skillPath)?.snapshot;
  const mcpBackup = manifest.items.find((item) => item.target === mcpPath)?.snapshot;
  assert.ok(skillBackup);
  assert.ok(mcpBackup);
  assert.equal(
    await readFile(join(result.backupPath, skillBackup, "SKILL.md"), "utf8"),
    unmanagedSkill,
  );
  assert.equal(await readFile(join(result.backupPath, mcpBackup), "utf8"), unmanagedMcp);
  assert.match(await readFile(join(skillPath, "SKILL.md"), "utf8"), /name: cleanup/);
  const codex = parseToml(await readFile(mcpPath, "utf8"), { integersAsBigInt: false });
  assert.equal(codex.model, "preserved");
  assert.equal(codex.mcp_servers.anysearch.url, anysearch.url);
  assert.equal((await runDoctor(pack, layout, result.state)).every((check) => check.ok), true);

  const update = await buildInstallPlan(pack, layout, {
    mode: "append",
    adapters: ["codex"],
    selection: result.state.selection,
    previousState: result.state,
  });
  assert.equal(update.conflicts.length, 0);
  assert.equal(update.actions.length, 0);
});

test("reconcile keeps divergent components unmanaged by removing them from selection", async (t) => {
  const { layout } = await temporaryHome(t);
  const unmanagedSkill = "---\nname: cleanup\ndescription: keep this copy\n---\n";
  const unmanagedMcp =
    '[mcp_servers.anysearch]\nurl = "https://keep.invalid/mcp"\n';
  const skillFile = skillTarget(layout, "codex", "cleanup", "SKILL.md");
  const mcpPath = join(layout.codexHome, "config.toml");
  await put(skillFile, unmanagedSkill);
  await put(mcpPath, unmanagedMcp);

  const plan = await buildInstallPlan(pack, layout, {
    mode: "append",
    adapters: ["codex"],
    selection: { skillIds: ["cleanup"], mcpIds: ["anysearch"] },
    reconciliation: {
      resolutions: {
        "skill:cleanup": "keep",
        "mcp:anysearch": "keep",
      },
    },
  });
  assert.equal(plan.conflicts.length, 0);
  assert.deepEqual(plan.selection, { skillIds: [], mcpIds: [] });
  assert.deepEqual(plan.reconciliation?.kept, ["mcp:anysearch", "skill:cleanup"]);

  const result = await applyInstallPlan(pack, layout, plan);
  assert.equal(await readFile(skillFile, "utf8"), unmanagedSkill);
  assert.equal(await readFile(mcpPath, "utf8"), unmanagedMcp);
  assert.deepEqual(result.state.selection, { skillIds: [], mcpIds: [] });
  const update = await buildInstallPlan(pack, layout, {
    mode: "append",
    adapters: ["codex"],
    selection: result.state.selection,
    previousState: result.state,
  });
  assert.equal(update.conflicts.length, 0);
});

test("reconcile refuses a global keep that would split schema v1 MCP ownership", async (t) => {
  const { layout } = await temporaryHome(t);
  const initial = await buildInstallPlan(pack, layout, {
    mode: "append",
    adapters: ["kimi"],
    selection: { skillIds: [], mcpIds: ["anysearch"] },
  });
  const { state } = await applyInstallPlan(pack, layout, initial);
  await put(
    join(layout.codexHome, "config.toml"),
    '[mcp_servers.anysearch]\nurl = "https://codex-unmanaged.invalid/mcp"\n',
  );

  await assert.rejects(
    buildInstallPlan(pack, layout, {
      mode: "append",
      adapters: ["codex", "kimi"],
      selection: { skillIds: [], mcpIds: ["anysearch"] },
      previousState: state,
      reconciliation: { resolutions: { "mcp:anysearch": "keep" } },
    }),
    /already manages it on another target/,
  );
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
  const skillPath = skillTarget(layout, "codex", "cleanup", "SKILL.md");
  await writeFile(skillPath, (await readFile(skillPath, "utf8")) + "\nuser edit\n", "utf8");

  const uninstallPlan = await buildUninstallPlan(pack, layout, state);
  assert.equal(uninstallPlan.conflicts.length, 1);
  await assert.rejects(applyUninstallPlan(layout, uninstallPlan), /conflicts/);
  assert.match(await readFile(skillPath, "utf8"), /user edit/);
  assert.ok(await loadState(layout.stateFile));
});

test("legacy v0.2 shared targets migrate exactly once into vendor homes", async (t) => {
  const { home, layout } = await temporaryHome(t);
  const { state, legacyInstructions, legacySkill } = await createLegacyState(home, layout);
  await put(join(home, ".agents", "user-sentinel.txt"), "preserve unrelated data\n");

  await writeFile(
    join(legacySkill, "SKILL.md"),
    (await readFile(join(legacySkill, "SKILL.md"), "utf8")) + "\nuser drift\n",
    "utf8",
  );
  const blocked = await buildInstallPlan(pack, layout, {
    mode: "overwrite",
    adapters: ["codex", "kimi"],
    selection: state.selection,
    previousState: state,
  });
  assert.equal(blocked.conflicts.some((entry) => /Legacy managed skill/.test(entry.message)), true);
  await assert.rejects(applyInstallPlan(pack, layout, blocked, state), /conflicts/);
  await rm(legacySkill, { recursive: true });
  await cp(
    join(repositoryRoot, "skills", "maintenance", "code-quality", "cleanup"),
    legacySkill,
    { recursive: true },
  );

  await assert.rejects(
    buildInstallPlan(pack, layout, {
      mode: "overwrite",
      adapters: ["codex"],
      selection: state.selection,
      previousState: state,
    }),
    /must first be migrated unchanged/,
  );

  const plan = await buildInstallPlan(pack, layout, {
    mode: "overwrite",
    adapters: ["codex", "kimi"],
    selection: state.selection,
    previousState: state,
  });
  assert.equal(plan.conflicts.length, 0);
  assert.ok(
    plan.actions.some(
      (action) => action.kind === "skills-remove" && action.adapter === "legacy",
    ),
  );
  const result = await applyInstallPlan(pack, layout, plan, state);
  await assert.rejects(readFile(legacyInstructions, "utf8"));
  await assert.rejects(readFile(join(legacySkill, "SKILL.md"), "utf8"));
  assert.equal(
    await readFile(join(home, ".agents", "user-sentinel.txt"), "utf8"),
    "preserve unrelated data\n",
  );
  for (const adapterId of ["codex", "kimi"]) {
    assert.match(
      await readFile(skillTarget(layout, adapterId, "cleanup", "SKILL.md"), "utf8"),
      /name: cleanup/,
    );
  }
  assert.equal(
    await readFile(join(layout.kimiHome, "AGENTS.md"), "utf8"),
    await readFile(pack.instructionPath, "utf8"),
  );
  assert.equal(result.state.managed.skills.length, 2);
  assert.equal(
    JSON.stringify(result.state).includes(join(home, ".agents")),
    false,
  );
  assert.equal((await runDoctor(pack, layout, result.state)).every((check) => check.ok), true);

  const update = await buildInstallPlan(pack, layout, {
    mode: "overwrite",
    adapters: result.state.adapters,
    selection: result.state.selection,
    previousState: result.state,
  });
  assert.equal(update.actions.length, 0);
});

test("legacy v0.2 append update migrates every adapter and preserves unrelated data", async (t) => {
  const { home, layout } = await temporaryHome(t);
  const { state, legacyInstructions, legacySkill } = await createLegacyState(home, layout);
  state.mode = "append";
  await writeFile(layout.stateFile, JSON.stringify(state, null, 2) + "\n", "utf8");
  const sentinel = join(home, ".agents", "user-sentinel.txt");
  await put(sentinel, "preserve unrelated data\n");

  const plan = await buildInstallPlan(pack, layout, {
    mode: "append",
    adapters: state.adapters,
    selection: state.selection,
    previousState: state,
  });
  assert.equal(plan.conflicts.length, 0);
  const result = await applyInstallPlan(pack, layout, plan, state);

  await assert.rejects(readFile(legacyInstructions, "utf8"));
  await assert.rejects(readFile(join(legacySkill, "SKILL.md"), "utf8"));
  assert.equal(await readFile(sentinel, "utf8"), "preserve unrelated data\n");
  for (const adapterId of state.adapters) {
    assert.match(
      await readFile(skillTarget(layout, adapterId, "cleanup", "SKILL.md"), "utf8"),
      /name: cleanup/,
    );
  }
  assert.equal(result.state.pack.version, pack.version);
  assert.equal(result.state.mode, "append");
  assert.equal(result.state.managed.skills.length, state.adapters.length);
  assert.equal((await runDoctor(pack, layout, result.state)).every((check) => check.ok), true);

  const update = await buildInstallPlan(pack, layout, {
    mode: "append",
    adapters: result.state.adapters,
    selection: result.state.selection,
    previousState: result.state,
  });
  assert.equal(update.actions.length, 0);
});

test("legacy v0.2 update adopts vendor instructions when old ownership is absent", async (t) => {
  const { home, layout } = await temporaryHome(t);
  const { state, legacyInstructions } = await createLegacyState(home, layout);
  const canonical = await readFile(pack.instructionPath, "utf8");
  state.managed.instructions = [];
  await writeFile(layout.stateFile, JSON.stringify(state, null, 2) + "\n", "utf8");

  const plan = await buildInstallPlan(pack, layout, {
    mode: state.mode,
    adapters: state.adapters,
    selection: state.selection,
    previousState: state,
  });
  assert.equal(plan.conflicts.length, 0);
  const result = await applyInstallPlan(pack, layout, plan, state);

  assert.equal(await readFile(legacyInstructions, "utf8"), canonical);
  assert.equal(result.state.managed.instructions.length, state.adapters.length);
  for (const adapterId of state.adapters) {
    assert.equal(
      await readFile(adapters[adapterId].instructionPath(layout), "utf8"),
      canonical,
    );
  }
  assert.equal((await runDoctor(pack, layout, result.state)).every((check) => check.ok), true);
});

test("legacy v0.2 uninstall preserves instructions it never recorded as owned", async (t) => {
  const { home, layout } = await temporaryHome(t);
  const { state, legacyInstructions, legacySkill } = await createLegacyState(home, layout);
  const canonical = await readFile(pack.instructionPath, "utf8");
  const codexInstructions = adapters.codex.instructionPath(layout);
  state.managed.instructions = [];
  await writeFile(layout.stateFile, JSON.stringify(state, null, 2) + "\n", "utf8");

  const plan = await buildUninstallPlan(pack, layout, state);
  assert.equal(plan.conflicts.length, 0);
  assert.equal(
    plan.actions.some(
      (action) => action.kind === "file" && action.component === "instructions",
    ),
    false,
  );
  await applyUninstallPlan(layout, plan);

  assert.equal(await readFile(legacyInstructions, "utf8"), canonical);
  assert.equal(await readFile(codexInstructions, "utf8"), canonical);
  await assert.rejects(readFile(join(legacySkill, "SKILL.md"), "utf8"));
  assert.equal(await loadState(layout.stateFile), undefined);
});

test("state validation rejects a partially migrated legacy layout", async (t) => {
  const { home, layout } = await temporaryHome(t);
  const { state } = await createLegacyState(home, layout);
  const vendorSkill = skillTarget(layout, "codex", "cleanup");
  await mkdir(dirname(vendorSkill), { recursive: true });
  await cp(
    join(repositoryRoot, "skills", "maintenance", "code-quality", "cleanup"),
    vendorSkill,
    { recursive: true },
  );
  state.managed.skills[0].path = vendorSkill;
  state.managed.skills[0].contentHash = await hashPath(vendorSkill);
  await writeFile(layout.stateFile, JSON.stringify(state, null, 2) + "\n", "utf8");

  await assert.rejects(
    buildUninstallPlan(pack, layout, state),
    /legacy state must keep every managed skill in the shared layout/,
  );
});

test("legacy migration rejects a symlinked shared root", async (t) => {
  const { home, layout } = await temporaryHome(t);
  const { state } = await createLegacyState(home, layout);
  const sharedRoot = join(home, ".agents");
  const physicalRoot = join(home, "legacy-physical-root");
  await cp(sharedRoot, physicalRoot, { recursive: true });
  await rm(sharedRoot, { recursive: true });
  await symlink(
    physicalRoot,
    sharedRoot,
    process.platform === "win32" ? "junction" : "dir",
  );

  await assert.rejects(
    buildInstallPlan(pack, layout, {
      mode: "overwrite",
      adapters: state.adapters,
      selection: state.selection,
      previousState: state,
    }),
    /must be a real directory before migration/,
  );
});

test("legacy migration rejects a symlinked shared skills parent", async (t) => {
  const { home, layout } = await temporaryHome(t);
  const { state } = await createLegacyState(home, layout);
  const sharedSkills = join(home, ".agents", "skills");
  const physicalSkills = join(home, "legacy-physical-skills");
  await cp(sharedSkills, physicalSkills, { recursive: true });
  await rm(sharedSkills, { recursive: true });
  await symlink(
    physicalSkills,
    sharedSkills,
    process.platform === "win32" ? "junction" : "dir",
  );

  await assert.rejects(
    buildInstallPlan(pack, layout, {
      mode: "overwrite",
      adapters: state.adapters,
      selection: state.selection,
      previousState: state,
    }),
    /must be a real directory before migration.*skills/,
  );
});

test("instruction-only legacy migration ignores an unrelated shared skills symlink", async (t) => {
  const { home, layout } = await temporaryHome(t);
  const { state } = await createLegacyState(home, layout);
  state.selection.skillIds = [];
  state.managed.skills = [];
  await writeFile(layout.stateFile, JSON.stringify(state, null, 2) + "\n", "utf8");
  const sharedSkills = join(home, ".agents", "skills");
  const unrelatedSkills = join(home, "unrelated-shared-skills");
  await mkdir(unrelatedSkills, { recursive: true });
  await rm(sharedSkills, { recursive: true });
  await symlink(
    unrelatedSkills,
    sharedSkills,
    process.platform === "win32" ? "junction" : "dir",
  );

  const plan = await buildInstallPlan(pack, layout, {
    mode: "overwrite",
    adapters: state.adapters,
    selection: state.selection,
    previousState: state,
  });
  assert.equal(
    plan.actions.some(
      (action) => action.kind === "skills-remove" && action.adapter === "legacy",
    ),
    false,
  );
  await disposeInstallPlan(plan);
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
