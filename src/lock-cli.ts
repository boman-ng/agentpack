import { atomicWrite } from "./util/fs.js";
import { buildLock, serializeLock } from "./lock.js";
import { loadPack } from "./manifest.js";
import { findPackRoot } from "./runtime.js";

const root = await findPackRoot();
const pack = await loadPack(root);
const expected = serializeLock(await buildLock(pack));
const target = root + "/agentpack.lock";

if (process.argv.includes("--write")) {
  await atomicWrite(target, expected);
  process.stdout.write("Updated agentpack.lock\n");
} else if (process.argv.includes("--check")) {
  const { readFile } = await import("node:fs/promises");
  let current = "";
  try {
    current = await readFile(target, "utf8");
  } catch {
    process.stderr.write("agentpack.lock is missing\n");
    process.exitCode = 1;
  }
  if (current !== expected) {
    process.stderr.write("agentpack.lock is stale; run npm run lock\n");
    process.exitCode = 1;
  } else {
    process.stdout.write("agentpack.lock matches canonical assets\n");
  }
} else {
  throw new Error("Use --write or --check");
}
