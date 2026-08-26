import { join, relative } from "node:path";
import type { LoadedPack } from "./types.js";
import { hashPath, readTextIfExists } from "./util/fs.js";
import { portablePath } from "./util/values.js";

export interface AgentPackLock {
  schemaVersion: 1;
  pack: {
    name: string;
    version: string;
  };
  sources: Array<{
    id: string;
    kind: string;
    repository: string;
    license: string;
    commit?: string;
    ref?: string;
    root?: string;
  }>;
  artifacts: {
    instructions: {
      path: string;
      sha256: string;
    };
    skills: Array<{
      id: string;
      name: string;
      category: string;
      domain: string;
      path: string;
      sourceId: string;
      sha256?: string;
    }>;
    mcp: Array<{
      id: string;
      path: string;
      sourceId: string;
      sha256: string;
    }>;
    profiles: Array<{
      id: string;
      path: string;
      sha256: string;
    }>;
  };
}

export async function buildLock(pack: LoadedPack): Promise<AgentPackLock> {
  const skillSources = pack.skillSources
    .map((source) => {
      const entry: AgentPackLock["sources"][number] = {
        id: source.id,
        kind: source.kind,
        repository: source.repository,
        license: source.license,
      };
      if (source.kind === "git") {
        entry.ref = source.ref;
      } else {
        entry.root = portablePath(relative(pack.root, source.root));
      }
      return entry;
    });
  const mcpSources: AgentPackLock["sources"] = pack.mcp.map((server) => ({
    id: server.source.id,
    kind: "mcp-configuration",
    repository: server.source.repository,
    license: server.source.license,
    commit: server.source.commit,
  }));
  const sources = [...skillSources, ...mcpSources].sort((a, b) => a.id.localeCompare(b.id));
  if (new Set(sources.map((source) => source.id)).size !== sources.length) {
    throw new Error("Duplicate source id while building agentpack.lock");
  }

  return {
    schemaVersion: 1,
    pack: {
      name: pack.name,
      version: pack.version,
    },
    sources,
    artifacts: {
      instructions: {
        path: portablePath(relative(pack.root, pack.instructionPath)),
        sha256: await hashPath(pack.instructionPath),
      },
      skills: await Promise.all(
        [...pack.skills]
          .sort((a, b) => a.id.localeCompare(b.id))
          .map(async (skill) => {
            const source = pack.skillSources.find(
              (candidate) => candidate.id === skill.sourceId,
            );
            if (source === undefined) {
              throw new Error("Unknown source while building lock: " + skill.sourceId);
            }
            const entry: AgentPackLock["artifacts"]["skills"][number] = {
              id: skill.id,
              name: skill.name,
              category: skill.category,
              domain: skill.domain,
              path: skill.path,
              sourceId: skill.sourceId,
            };
            if (source.kind === "local") {
              entry.sha256 = await hashPath(join(source.root, skill.path));
            }
            return entry;
          }),
      ),
      mcp: await Promise.all(
        [...pack.mcp]
          .sort((a, b) => a.id.localeCompare(b.id))
          .map(async (server) => ({
            id: server.id,
            path: portablePath(relative(pack.root, server.sourcePath)),
            sourceId: server.source.id,
            sha256: await hashPath(server.sourcePath),
          })),
      ),
      profiles: await Promise.all(
        [...pack.profiles]
          .sort((a, b) => a.id.localeCompare(b.id))
          .map(async (profile) => ({
            id: profile.id,
            path: portablePath(relative(pack.root, profile.sourcePath)),
            sha256: await hashPath(profile.sourcePath),
          })),
      ),
    },
  };
}

export function serializeLock(lock: AgentPackLock): string {
  return JSON.stringify(lock, null, 2) + "\n";
}

export async function lockMatches(pack: LoadedPack): Promise<boolean> {
  const current = await readTextIfExists(pack.root + "/agentpack.lock");
  return current !== undefined && current === serializeLock(await buildLock(pack));
}
