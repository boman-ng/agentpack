import { lstat, readFile, readdir } from "node:fs/promises";
import { dirname, extname, isAbsolute, join, normalize, sep } from "node:path";
import { parse as parseYaml } from "yaml";
import type {
  AdapterId,
  LoadedPack,
  McpDefinition,
  ProfileDefinition,
  SkillDefinition,
  SkillSource,
} from "./types.js";
import {
  assertAdapterId,
  optionalString,
  isSafeSkillName,
  requireBoolean,
  requireRecord,
  requireString,
  requireStringArray,
  resolveInside,
} from "./util/values.js";

export async function loadPack(root: string): Promise<LoadedPack> {
  const manifestPath = join(root, "agentpack.yaml");
  const raw = requireRecord(await readYaml(manifestPath), "agentpack.yaml");
  requireSchemaVersion(raw, "agentpack.yaml");

  const name = requireString(raw.name, "agentpack.yaml.name");
  const version = requireString(raw.version, "agentpack.yaml.version");
  const description = requireString(raw.description, "agentpack.yaml.description");

  const packageJson = requireRecord(
    JSON.parse(await readFile(join(root, "package.json"), "utf8")),
    "package.json",
  );
  if (packageJson.name !== "@boman-ng/agentpack") {
    throw new Error("package.json.name must be @boman-ng/agentpack");
  }
  if (packageJson.version !== version) {
    throw new Error("agentpack.yaml.version and package.json.version must match");
  }

  const instructions = requireRecord(raw.instructions, "agentpack.yaml.instructions");
  const instructionPath = resolveInside(
    root,
    requireString(instructions.global, "agentpack.yaml.instructions.global"),
    "global instruction path",
  );
  await readFile(instructionPath, "utf8");

  const skillsConfig = requireRecord(raw.skills, "agentpack.yaml.skills");
  const skillsCatalogPath = resolveInside(
    root,
    requireString(skillsConfig.catalog, "agentpack.yaml.skills.catalog"),
    "skills catalog path",
  );
  const sourcesPath = resolveInside(
    root,
    requireString(skillsConfig.sources, "agentpack.yaml.skills.sources"),
    "skills sources path",
  );
  const skillSources = await loadSkillSources(sourcesPath);
  const skills = await loadSkills(skillsCatalogPath, skillSources);

  const mcpConfig = requireRecord(raw.mcp, "agentpack.yaml.mcp");
  const mcpCatalogPath = resolveInside(
    root,
    requireString(mcpConfig.catalog, "agentpack.yaml.mcp.catalog"),
    "MCP catalog path",
  );
  const mcp = await loadMcp(mcpCatalogPath);

  const profileConfig = requireRecord(raw.profiles, "agentpack.yaml.profiles");
  const profileDirectory = resolveInside(
    root,
    requireString(profileConfig.directory, "agentpack.yaml.profiles.directory"),
    "profiles directory",
  );
  const profiles = await loadProfiles(profileDirectory, skills, mcp);

  const targetValues = requireStringArray(raw.targets, "agentpack.yaml.targets");
  const targets: AdapterId[] = [];
  for (const target of targetValues) {
    assertAdapterId(target);
    targets.push(target);
  }
  assertUnique(targets, "adapter ids");

  const nativeRaw = requireRecord(raw.native, "agentpack.yaml.native");
  const native = {
    codex: resolveInside(
      root,
      requireString(nativeRaw.codex, "agentpack.yaml.native.codex"),
      "Codex native path",
    ),
    kimi: resolveInside(
      root,
      requireString(nativeRaw.kimi, "agentpack.yaml.native.kimi"),
      "Kimi native path",
    ),
  };

  return {
    root,
    name,
    version,
    description,
    instructionPath,
    skills,
    skillSources,
    mcp,
    profiles,
    targets,
    native,
  };
}

async function loadSkillSources(path: string): Promise<SkillSource[]> {
  const raw = requireRecord(await readYaml(path), path);
  requireSchemaVersion(raw, path);
  if (!Array.isArray(raw.sources)) {
    throw new Error(path + ".sources must be an array");
  }
  const base = dirname(path);
  const sources = raw.sources.map((value, index) => {
    const entry = requireRecord(value, path + ".sources[" + index + "]");
    const id = requireString(entry.id, "source.id");
    const kind = requireString(entry.kind, "source.kind");
    const repository = requireString(entry.repository, "source.repository");
    const license = requireString(entry.license, "source.license");
    if (kind === "local") {
      return {
        id,
        kind,
        repository,
        license,
        root: resolveInside(
          base,
          requireString(entry.root, "source.root"),
          "local source root",
        ),
      } satisfies SkillSource;
    }
    if (kind === "git") {
      assertPublicHttpsRepository(repository, id);
      const ref = requireString(entry.ref, "source.ref");
      if (!/^refs\/heads\/[A-Za-z0-9._/-]+$/.test(ref) || ref.includes("..")) {
        throw new Error("Git source ref must name a branch under refs/heads/: " + id);
      }
      return { id, kind, repository, license, ref } satisfies SkillSource;
    }
    throw new Error("Unsupported skill source kind for " + id + ": " + kind);
  });
  assertUnique(
    sources.map((source) => source.id),
    "skill source ids",
  );
  return sources;
}

async function loadSkills(
  catalogPath: string,
  sources: SkillSource[],
): Promise<SkillDefinition[]> {
  const raw = requireRecord(await readYaml(catalogPath), catalogPath);
  requireSchemaVersion(raw, catalogPath);
  if (!Array.isArray(raw.skills)) {
    throw new Error(catalogPath + ".skills must be an array");
  }
  const sourceIds = new Set(sources.map((source) => source.id));
  const skills: SkillDefinition[] = [];
  for (const [index, value] of raw.skills.entries()) {
    const entry = requireRecord(value, catalogPath + ".skills[" + index + "]");
    const sourceId = requireString(entry.sourceId, "skill.sourceId");
    if (!sourceIds.has(sourceId)) {
      throw new Error("Skill references unknown sourceId: " + sourceId);
    }
    const id = requireString(entry.id, "skill.id");
    const name = requireString(entry.name, "skill.name");
    assertSafeSkillName(id, "skill.id");
    assertSafeSkillName(name, "skill.name");
    const skill: SkillDefinition = {
      id,
      name,
      category: requireString(entry.category, "skill.category"),
      domain: requireString(entry.domain, "skill.domain"),
      sourceId,
      path: requireSourceRelativePath(
        requireString(entry.path, "skill.path"),
        "skill.path",
      ),
    };
    const source = sources.find((candidate) => candidate.id === sourceId);
    if (source?.kind === "local") {
      await validateSkillDirectory(
        skill,
        resolveInside(source.root, skill.path, "local skill path"),
      );
    }
    skills.push(skill);
  }
  assertUnique(
    skills.map((skill) => skill.id),
    "skill ids",
  );
  assertUnique(
    skills.map((skill) => skill.name),
    "skill names",
  );
  return skills;
}

export async function validateSkillDirectory(
  skill: SkillDefinition,
  directory: string,
): Promise<void> {
  assertSafeSkillName(skill.id, "skill.id");
  assertSafeSkillName(skill.name, "skill.name");
  const root = await lstat(directory);
  if (!root.isDirectory()) {
    throw new Error("Skill root must be a real directory: " + directory);
  }
  const text = await readFile(join(directory, "SKILL.md"), "utf8");
  const match = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/.exec(text);
  if (match === null || match[1] === undefined) {
    throw new Error("Skill has no YAML frontmatter: " + directory);
  }
  const frontmatter = requireRecord(parseYaml(match[1]), directory + "/SKILL.md");
  const declaredName = requireString(frontmatter.name, directory + " frontmatter.name");
  if (declaredName !== skill.name) {
    throw new Error(
      "Skill catalog name " + skill.name + " does not match frontmatter name " + declaredName,
    );
  }
  requireString(frontmatter.description, directory + " frontmatter.description");
}

function assertSafeSkillName(value: string, context: string): void {
  if (!isSafeSkillName(value)) {
    throw new Error(
      context + " must contain only lowercase letters, digits, and single hyphens",
    );
  }
}

function requireSourceRelativePath(value: string, context: string): string {
  if (isAbsolute(value) || value.includes("\\")) {
    throw new Error(context + " must be a portable relative path");
  }
  const normalized = normalize(value);
  if (
    normalized === "." ||
    normalized === ".." ||
    normalized.startsWith(".." + sep) ||
    normalized.split(sep).some((part) => part.toLowerCase() === ".git")
  ) {
    throw new Error(context + " escapes or targets Git metadata");
  }
  return normalized.split(sep).join("/");
}

function assertPublicHttpsRepository(repository: string, sourceId: string): void {
  let parsed: URL;
  try {
    parsed = new URL(repository);
  } catch {
    throw new Error("Git source repository is not a URL: " + sourceId);
  }
  if (
    parsed.protocol !== "https:" ||
    parsed.username !== "" ||
    parsed.password !== "" ||
    parsed.search !== "" ||
    parsed.hash !== ""
  ) {
    throw new Error("Git source repository must be a credential-free HTTPS URL: " + sourceId);
  }
}

async function loadMcp(catalogPath: string): Promise<McpDefinition[]> {
  const raw = requireRecord(await readYaml(catalogPath), catalogPath);
  requireSchemaVersion(raw, catalogPath);
  if (!Array.isArray(raw.servers)) {
    throw new Error(catalogPath + ".servers must be an array");
  }
  const base = dirname(catalogPath);
  const servers: McpDefinition[] = [];
  for (const [index, value] of raw.servers.entries()) {
    const entry = requireRecord(value, catalogPath + ".servers[" + index + "]");
    const id = requireString(entry.id, "MCP catalog id");
    const sourcePath = resolveInside(
      base,
      requireString(entry.path, "MCP catalog path"),
      "MCP definition path",
    );
    const spec = requireRecord(await readYaml(sourcePath), sourcePath);
    requireSchemaVersion(spec, sourcePath);
    if (requireString(spec.id, sourcePath + ".id") !== id) {
      throw new Error("MCP catalog id does not match definition id: " + id);
    }
    const transport = requireString(spec.transport, sourcePath + ".transport");
    if (transport !== "streamable-http") {
      throw new Error("Unsupported MCP transport: " + transport);
    }
    const headersRaw = requireRecord(spec.staticHeaders, sourcePath + ".staticHeaders");
    const staticHeaders: Record<string, string> = {};
    for (const [header, headerValue] of Object.entries(headersRaw)) {
      staticHeaders[header] = requireString(headerValue, sourcePath + ".staticHeaders." + header);
    }
    const sourceRaw = requireRecord(spec.source, sourcePath + ".source");
    const server: McpDefinition = {
      id,
      name: requireString(spec.name, sourcePath + ".name"),
      description: requireString(spec.description, sourcePath + ".description"),
      category: requireString(entry.category, "MCP category"),
      domain: requireString(entry.domain, "MCP domain"),
      transport,
      url: requireString(spec.url, sourcePath + ".url"),
      staticHeaders,
      authenticationOptional: requireBoolean(
        spec.authenticationOptional,
        sourcePath + ".authenticationOptional",
      ),
      source: {
        id: requireString(sourceRaw.id, sourcePath + ".source.id"),
        repository: requireString(sourceRaw.repository, sourcePath + ".source.repository"),
        commit: requireString(sourceRaw.commit, sourcePath + ".source.commit"),
        license: requireString(sourceRaw.license, sourcePath + ".source.license"),
      },
      sourcePath,
    };
    assignOptional(
      server,
      "bearerTokenEnvVar",
      optionalString(spec.bearerTokenEnvVar, sourcePath + ".bearerTokenEnvVar"),
    );
    servers.push(server);
  }
  assertUnique(
    servers.map((server) => server.id),
    "MCP ids",
  );
  return servers;
}

async function loadProfiles(
  directory: string,
  skills: SkillDefinition[],
  mcp: McpDefinition[],
): Promise<ProfileDefinition[]> {
  const entries = (await readdir(directory)).filter((name) => extname(name) === ".yaml").sort();
  const skillIds = new Set(skills.map((skill) => skill.id));
  const mcpIds = new Set(mcp.map((server) => server.id));
  const profiles: ProfileDefinition[] = [];
  for (const name of entries) {
    const sourcePath = join(directory, name);
    const raw = requireRecord(await readYaml(sourcePath), sourcePath);
    requireSchemaVersion(raw, sourcePath);
    const profile: ProfileDefinition = {
      id: requireString(raw.id, sourcePath + ".id"),
      description: requireString(raw.description, sourcePath + ".description"),
      skills: requireStringArray(raw.skills, sourcePath + ".skills"),
      mcp: requireStringArray(raw.mcp, sourcePath + ".mcp"),
      sourcePath,
    };
    for (const id of profile.skills) {
      if (!skillIds.has(id)) {
        throw new Error("Profile " + profile.id + " references unknown skill " + id);
      }
    }
    for (const id of profile.mcp) {
      if (!mcpIds.has(id)) {
        throw new Error("Profile " + profile.id + " references unknown MCP " + id);
      }
    }
    assertUnique(profile.skills, "skills in profile " + profile.id);
    assertUnique(profile.mcp, "MCP ids in profile " + profile.id);
    profiles.push(profile);
  }
  assertUnique(
    profiles.map((profile) => profile.id),
    "profile ids",
  );
  return profiles;
}

async function readYaml(path: string): Promise<unknown> {
  return parseYaml(await readFile(path, "utf8"));
}

function requireSchemaVersion(raw: Record<string, unknown>, context: string): void {
  if (raw.schemaVersion !== 1) {
    throw new Error(context + ".schemaVersion must be 1");
  }
}

function assertUnique(values: string[], context: string): void {
  const seen = new Set<string>();
  for (const value of values) {
    if (seen.has(value)) {
      throw new Error("Duplicate " + context + ": " + value);
    }
    seen.add(value);
  }
}

function assignOptional<
  Target extends object,
  Key extends keyof Target,
  Value extends Target[Key],
>(target: Target, key: Key, value: Value | undefined): void {
  if (value !== undefined) {
    target[key] = value;
  }
}

export function mcpById(pack: LoadedPack, id: string): McpDefinition {
  const server = pack.mcp.find((candidate) => candidate.id === id);
  if (server === undefined) {
    throw new Error("Unknown MCP server: " + id);
  }
  return server;
}

export function profileById(pack: LoadedPack, id: string): ProfileDefinition {
  const profile = pack.profiles.find((candidate) => candidate.id === id);
  if (profile === undefined) {
    throw new Error("Unknown profile: " + id);
  }
  return profile;
}
