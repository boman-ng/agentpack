import { execFile } from "node:child_process";
import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, relative, resolve, sep } from "node:path";
import { validateSkillDirectory } from "./manifest.js";
import type {
  ChangePlan,
  GitSkillSource,
  LoadedPack,
  ResolvedGitSource,
  SkillDefinition,
  SkillSource,
  SkillSourceRevision,
} from "./types.js";
import { hashPath, pathExists } from "./util/fs.js";

export interface PreparedSkill {
  skill: SkillDefinition;
  sourcePath: string;
  sourceHash: string;
  sourceRevision: SkillSourceRevision;
}

export interface PreparedSkills {
  skills: PreparedSkill[];
  resolvedSources: ResolvedGitSource[];
  temporaryPaths: string[];
}

interface GitCheckout {
  root: string;
  revision: SkillSourceRevision;
  resolved: ResolvedGitSource;
}

export async function prepareSelectedSkills(
  pack: LoadedPack,
  skillIds: string[],
): Promise<PreparedSkills> {
  const selected = skillIds.map((id) => {
    const skill = pack.skills.find((candidate) => candidate.id === id);
    if (skill === undefined) {
      throw new Error("Unknown skill: " + id);
    }
    return skill;
  });
  const sources = new Map(pack.skillSources.map((source) => [source.id, source]));
  const gitSources = uniqueSources(
    selected
      .map((skill) => requireSource(sources, skill.sourceId))
      .filter((source): source is GitSkillSource => source.kind === "git"),
  );
  let temporaryRoot: string | undefined;
  try {
    const checkouts = new Map<string, GitCheckout>();
    if (gitSources.length > 0) {
      const stagingRoot = await mkdtemp(join(tmpdir(), "agentpack-sources-"));
      temporaryRoot = stagingRoot;
      const gitConfig = join(stagingRoot, "gitconfig");
      const hooks = join(stagingRoot, "hooks");
      await writeFile(gitConfig, "", "utf8");
      await mkdir(hooks);
      const settled = await Promise.allSettled(
        gitSources.map((source, index) =>
          fetchGitSource(source, join(stagingRoot, "source-" + index), gitConfig, hooks),
        ),
      );
      const failure = settled.find((result) => result.status === "rejected");
      if (failure?.status === "rejected") {
        throw failure.reason;
      }
      for (const result of settled) {
        if (result.status === "fulfilled") {
          checkouts.set(result.value.revision.id, result.value);
        }
      }
    }

    const prepared = await Promise.all(
      selected.map(async (skill): Promise<PreparedSkill> => {
        const source = requireSource(sources, skill.sourceId);
        const sourceRoot =
          source.kind === "local"
            ? source.root
            : requireCheckout(checkouts, source.id).root;
        const sourcePath = resolveSourcePath(sourceRoot, skill.path, skill.id);
        if (!(await pathExists(sourcePath))) {
          throw new Error(
            "Skill path does not exist in source " + source.id + ": " + skill.path,
          );
        }
        await validateSkillDirectory(skill, sourcePath);
        return {
          skill,
          sourcePath,
          sourceHash: await hashPath(sourcePath),
          sourceRevision:
            source.kind === "local"
              ? {
                  id: source.id,
                  kind: source.kind,
                  repository: source.repository,
                  packVersion: pack.version,
                }
              : requireCheckout(checkouts, source.id).revision,
        };
      }),
    );
    return {
      skills: prepared,
      resolvedSources: [...checkouts.values()]
        .map((checkout) => checkout.resolved)
        .sort((a, b) => a.id.localeCompare(b.id)),
      temporaryPaths: temporaryRoot === undefined ? [] : [temporaryRoot],
    };
  } catch (error) {
    if (temporaryRoot !== undefined) {
      await rm(temporaryRoot, { recursive: true, force: true });
    }
    throw error;
  }
}

export async function disposePreparedSkills(prepared: PreparedSkills): Promise<void> {
  await Promise.all(
    prepared.temporaryPaths.map((path) => rm(path, { recursive: true, force: true })),
  );
}

export async function disposeInstallPlan(plan: ChangePlan): Promise<void> {
  await Promise.all(
    plan.temporaryPaths.map((path) => rm(path, { recursive: true, force: true })),
  );
  plan.temporaryPaths.length = 0;
}

async function fetchGitSource(
  source: GitSkillSource,
  checkout: string,
  gitConfig: string,
  hooks: string,
): Promise<GitCheckout> {
  await mkdir(checkout);
  const environment = {
    ...withoutGitOverrides(process.env),
    GIT_CONFIG_GLOBAL: gitConfig,
    GIT_CONFIG_NOSYSTEM: "1",
    GIT_LFS_SKIP_SMUDGE: "1",
    GIT_TERMINAL_PROMPT: "0",
    GCM_INTERACTIVE: "never",
  };
  try {
    await runGit(["init", "--quiet", checkout], environment);
    await runGit(
      [
        "-c",
        "core.hooksPath=" + hooks,
        "-C",
        checkout,
        "fetch",
        "--quiet",
        "--depth=1",
        "--no-tags",
        source.repository,
        source.ref,
      ],
      environment,
    );
    await runGit(
      [
        "-c",
        "core.hooksPath=" + hooks,
        "-C",
        checkout,
        "checkout",
        "--quiet",
        "--detach",
        "FETCH_HEAD",
      ],
      environment,
    );
    const commit = (
      await runGit(["-C", checkout, "rev-parse", "HEAD"], environment)
    ).trim();
    if (!/^[0-9a-f]{40,64}$/.test(commit)) {
      throw new Error("Git returned an invalid commit id");
    }
    await rm(join(checkout, ".git"), { recursive: true, force: true });
    return {
      root: checkout,
      revision: {
        id: source.id,
        kind: source.kind,
        repository: source.repository,
        ref: source.ref,
        commit,
      },
      resolved: {
        id: source.id,
        repository: source.repository,
        ref: source.ref,
        commit,
      },
    };
  } catch (error) {
    throw new Error(
      "Unable to fetch online skill source " + source.id + ": " + errorMessage(error),
    );
  }
}

function withoutGitOverrides(environment: NodeJS.ProcessEnv): NodeJS.ProcessEnv {
  return Object.fromEntries(
    Object.entries(environment).filter(
      ([name]) => !name.startsWith("GIT_") && name !== "GCM_INTERACTIVE",
    ),
  );
}

function runGit(args: string[], env: NodeJS.ProcessEnv): Promise<string> {
  return new Promise((resolveOutput, reject) => {
    execFile(
      "git",
      args,
      {
        encoding: "utf8",
        env,
        maxBuffer: 5 * 1024 * 1024,
        timeout: 120_000,
        windowsHide: true,
      },
      (error, stdout, stderr) => {
        if (error !== null) {
          const detail = stderr.trim();
          reject(new Error(detail.length > 0 ? detail : error.message));
          return;
        }
        resolveOutput(stdout);
      },
    );
  });
}

function resolveSourcePath(root: string, path: string, skillId: string): string {
  const target = resolve(root, path);
  const rel = relative(resolve(root), target);
  if (rel === ".." || rel.startsWith(".." + sep) || rel === "") {
    throw new Error("Skill path escapes or equals its source root: " + skillId);
  }
  return target;
}

function requireSource(
  sources: ReadonlyMap<string, SkillSource>,
  id: string,
): SkillSource {
  const source = sources.get(id);
  if (source === undefined) {
    throw new Error("Unknown skill source: " + id);
  }
  return source;
}

function requireCheckout(
  checkouts: ReadonlyMap<string, GitCheckout>,
  id: string,
): GitCheckout {
  const checkout = checkouts.get(id);
  if (checkout === undefined) {
    throw new Error("Online skill source was not prepared: " + id);
  }
  return checkout;
}

function uniqueSources(sources: GitSkillSource[]): GitSkillSource[] {
  return [...new Map(sources.map((source) => [source.id, source])).values()];
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
