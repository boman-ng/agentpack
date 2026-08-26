import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { loadPack } from "./manifest.js";
import { findPackRoot } from "./runtime.js";
import { disposePreparedSkills, prepareSelectedSkills } from "./sources.js";
import {
  atomicWrite,
  copyPath,
  removePath,
  replaceDirectory,
} from "./util/fs.js";

export async function buildNativeDistributions(
  root: string,
  output = join(root, "dist", "native"),
): Promise<string> {
  const pack = await loadPack(root);
  const prepared = await prepareSelectedSkills(
    pack,
    pack.skills.map((skill) => skill.id),
  );
  try {
    await removePath(output);

    const codexTarget = join(output, "codex", "agentpack");
    const kimiTarget = join(output, "kimi", "agentpack");
    await copyPath(pack.native.codex, codexTarget);
    await copyPath(pack.native.kimi, kimiTarget);

    const entries = prepared.skills.map((entry) => ({
      source: entry.sourcePath,
      name: entry.skill.name,
    }));
    await replaceDirectory(join(codexTarget, "skills"), entries);
    await replaceDirectory(join(kimiTarget, "skills"), entries);
    await adaptCodexSkillMetadata(codexTarget, pack.skills.map((skill) => skill.name));

    for (const target of [codexTarget, kimiTarget]) {
      await atomicWrite(
        join(target, "AGENTPACK_SOURCES.json"),
        JSON.stringify(
          {
            schemaVersion: 1,
            agentpackVersion: pack.version,
            resolvedSources: prepared.resolvedSources,
          },
          null,
          2,
        ) + "\n",
      );
      await copyPath(join(root, "LICENSE"), join(target, "LICENSE"));
      await copyPath(
        join(root, "THIRD_PARTY_LICENSES.md"),
        join(target, "THIRD_PARTY_LICENSES.md"),
      );
      await copyPath(join(root, "third_party"), join(target, "third_party"));
    }
    return output;
  } finally {
    await disposePreparedSkills(prepared);
  }
}

async function adaptCodexSkillMetadata(
  codexTarget: string,
  skillNames: string[],
): Promise<void> {
  const adapted: string[] = [];
  for (const name of skillNames) {
    const path = join(codexTarget, "skills", name, "SKILL.md");
    const before = await readFile(path, "utf8");
    const after = before.replace(/^disable-model-invocation:\s*true\s*\r?\n/m, "");
    if (after !== before) {
      await atomicWrite(path, after);
      adapted.push(name);
    }
  }
  const report = [
    "# Generated Codex adaptations",
    "",
    "The resolved upstream skills are unchanged. This generated Codex plugin removes",
    "`disable-model-invocation: true`, which the Codex plugin validator rejects, from:",
    "",
    ...adapted.map((name) => "- `" + name + "`"),
    "",
    "Each affected skill still states its explicit-invocation intent in `description`.",
    "",
  ].join("\n");
  await atomicWrite(join(codexTarget, "AGENTPACK_ADAPTATIONS.md"), report);
}

if (process.argv[1] !== undefined && import.meta.url === new URL("file:" + process.argv[1]).href) {
  const root = await findPackRoot();
  const output = await buildNativeDistributions(root);
  process.stdout.write("Built native distributions at " + output + "\n");
}
