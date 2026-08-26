import { createHash, randomUUID } from "node:crypto";
import {
  chmod,
  cp,
  lstat,
  mkdir,
  readFile,
  readdir,
  readlink,
  rename,
  rm,
  stat,
  writeFile,
} from "node:fs/promises";
import { basename, dirname, join, relative, resolve, sep } from "node:path";

export async function pathExists(path: string): Promise<boolean> {
  try {
    await lstat(path);
    return true;
  } catch (error) {
    if (isNotFound(error)) {
      return false;
    }
    throw error;
  }
}

export async function readTextIfExists(path: string): Promise<string | undefined> {
  try {
    return await readFile(path, "utf8");
  } catch (error) {
    if (isNotFound(error)) {
      return undefined;
    }
    throw error;
  }
}

export async function readJsonIfExists(path: string): Promise<unknown | undefined> {
  const text = await readTextIfExists(path);
  return text === undefined ? undefined : JSON.parse(text);
}

export async function atomicWrite(path: string, content: string): Promise<void> {
  await mkdir(dirname(path), { recursive: true });
  const temporary = join(dirname(path), "." + basename(path) + ".agentpack-" + randomUUID());
  let mode: number | undefined;
  try {
    mode = (await stat(path)).mode;
  } catch (error) {
    if (!isNotFound(error)) {
      throw error;
    }
  }
  await writeFile(temporary, content, { encoding: "utf8", mode: mode ?? 0o600 });
  if (mode !== undefined) {
    await chmod(temporary, mode);
  }
  await rename(temporary, path);
}

export async function copyPath(source: string, target: string): Promise<void> {
  await assertSafeSymlinks(source);
  await mkdir(dirname(target), { recursive: true });
  await cp(source, target, {
    recursive: true,
    errorOnExist: true,
    force: false,
    preserveTimestamps: true,
    verbatimSymlinks: true,
  });
}

export async function replaceDirectory(
  target: string,
  entries: Array<{ source: string; name: string }>,
): Promise<void> {
  await mkdir(dirname(target), { recursive: true });
  const stage = join(dirname(target), "." + basename(target) + ".agentpack-stage-" + randomUUID());
  const displaced = join(
    dirname(target),
    "." + basename(target) + ".agentpack-old-" + randomUUID(),
  );
  await mkdir(stage, { recursive: true });
  try {
    for (const entry of entries) {
      await copyPath(entry.source, join(stage, entry.name));
    }
    const hadTarget = await pathExists(target);
    if (hadTarget) {
      await rename(target, displaced);
    }
    try {
      await rename(stage, target);
    } catch (error) {
      if (hadTarget && (await pathExists(displaced))) {
        await rename(displaced, target);
      }
      throw error;
    }
    if (hadTarget) {
      await rm(displaced, { recursive: true, force: true });
    }
  } catch (error) {
    await rm(stage, { recursive: true, force: true });
    throw error;
  }
}

export async function replacePath(source: string, target: string): Promise<void> {
  await mkdir(dirname(target), { recursive: true });
  const stage = join(dirname(target), "." + basename(target) + ".agentpack-stage-" + randomUUID());
  const displaced = join(
    dirname(target),
    "." + basename(target) + ".agentpack-old-" + randomUUID(),
  );
  await copyPath(source, stage);
  const hadTarget = await pathExists(target);
  if (hadTarget) {
    await rename(target, displaced);
  }
  try {
    await rename(stage, target);
  } catch (error) {
    if (hadTarget && (await pathExists(displaced))) {
      await rename(displaced, target);
    }
    throw error;
  }
  if (hadTarget) {
    await rm(displaced, { recursive: true, force: true });
  }
}

export async function removePath(path: string): Promise<void> {
  await rm(path, { recursive: true, force: true });
}

export async function hashPath(path: string): Promise<string> {
  const hash = createHash("sha256");
  await feedHash(hash, path, "");
  return hash.digest("hex");
}

async function feedHash(hash: ReturnType<typeof createHash>, path: string, relativePath: string) {
  const info = await lstat(path);
  if (info.isSymbolicLink()) {
    hash.update("L\0" + relativePath + "\0" + (await readlink(path)) + "\0");
    return;
  }
  if (info.isFile()) {
    hash.update("F\0" + relativePath + "\0");
    hash.update(await readFile(path));
    hash.update("\0");
    return;
  }
  if (!info.isDirectory()) {
    throw new Error("Unsupported filesystem entry in managed content: " + path);
  }
  hash.update("D\0" + relativePath + "\0");
  const entries = await readdir(path);
  entries.sort();
  for (const entry of entries) {
    const childRelative = relativePath.length === 0 ? entry : relativePath + "/" + entry;
    await feedHash(hash, join(path, entry), childRelative);
  }
}

async function assertSafeSymlinks(root: string): Promise<void> {
  const rootAbsolute = resolve(root);
  const rootInfo = await lstat(rootAbsolute);
  if (!rootInfo.isDirectory()) {
    return;
  }
  const pending = [rootAbsolute];
  while (pending.length > 0) {
    const directory = pending.pop();
    if (directory === undefined) {
      break;
    }
    const entries = await readdir(directory, { withFileTypes: true });
    for (const entry of entries) {
      const path = join(directory, entry.name);
      if (entry.isDirectory()) {
        pending.push(path);
        continue;
      }
      if (!entry.isSymbolicLink()) {
        continue;
      }
      const target = resolve(dirname(path), await readlink(path));
      const rel = relative(rootAbsolute, target);
      if (rel === ".." || rel.startsWith(".." + sep)) {
        throw new Error("Skill contains a symlink outside its root: " + path);
      }
    }
  }
}

function isNotFound(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: unknown }).code === "ENOENT"
  );
}
