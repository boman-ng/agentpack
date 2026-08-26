import { access } from "node:fs/promises";
import { dirname, parse, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export async function findPackRoot(start?: string): Promise<string> {
  let current = resolve(start ?? dirname(fileURLToPath(import.meta.url)));
  const filesystemRoot = parse(current).root;
  while (true) {
    try {
      await access(resolve(current, "agentpack.yaml"));
      await access(resolve(current, "package.json"));
      return current;
    } catch {
      if (current === filesystemRoot) {
        throw new Error("Could not locate agentpack.yaml from " + (start ?? import.meta.url));
      }
      current = dirname(current);
    }
  }
}
