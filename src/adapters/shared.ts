import { access } from "node:fs/promises";
import { delimiter, extname, join } from "node:path";
import type { McpDefinition } from "../types.js";
import { isRecord, sha256, stableJson } from "../util/values.js";

export async function commandOnPath(command: string): Promise<boolean> {
  const pathValue = process.env.PATH;
  if (pathValue === undefined) {
    return false;
  }
  const windowsExtensions =
    process.platform === "win32"
      ? (process.env.PATHEXT ?? ".EXE;.CMD;.BAT;.COM").split(";")
      : [""];
  const hasExtension = extname(command).length > 0;
  for (const directory of pathValue.split(delimiter)) {
    if (directory.length === 0) {
      continue;
    }
    const extensions = hasExtension ? [""] : windowsExtensions;
    for (const extension of extensions) {
      try {
        await access(join(directory, command + extension));
        return true;
      } catch {
        // Continue searching PATH.
      }
    }
  }
  return false;
}

export function entryHash(value: unknown): string {
  return sha256(stableJson(value));
}

export function requireConfigRecord(value: unknown, context: string): Record<string, unknown> {
  if (!isRecord(value)) {
    throw new Error(context + " must be an object");
  }
  return value;
}

export function staticHeaders(server: McpDefinition): Record<string, string> {
  return { ...server.staticHeaders };
}

export function jsonText(value: unknown): string {
  return JSON.stringify(value, null, 2) + "\n";
}
