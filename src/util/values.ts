import { createHash } from "node:crypto";
import { isAbsolute, relative, resolve, sep } from "node:path";

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function requireRecord(value: unknown, context: string): Record<string, unknown> {
  if (!isRecord(value)) {
    throw new Error(context + " must be an object");
  }
  return value;
}

export function requireString(value: unknown, context: string): string {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(context + " must be a non-empty string");
  }
  return value;
}

export function requireBoolean(value: unknown, context: string): boolean {
  if (typeof value !== "boolean") {
    throw new Error(context + " must be a boolean");
  }
  return value;
}

export function requireStringArray(value: unknown, context: string): string[] {
  if (!Array.isArray(value) || value.some((item) => typeof item !== "string")) {
    throw new Error(context + " must be an array of strings");
  }
  return [...value];
}

export function optionalString(value: unknown, context: string): string | undefined {
  if (value === undefined) {
    return undefined;
  }
  return requireString(value, context);
}

export function unique<Value>(values: Value[]): Value[] {
  return [...new Set(values)];
}

export function isSafeSkillName(value: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);
}

export function pathsOverlap(left: string, right: string): boolean {
  const resolvedLeft = resolve(left);
  const resolvedRight = resolve(right);
  return (
    isPathInside(resolvedLeft, resolvedRight) ||
    isPathInside(resolvedRight, resolvedLeft)
  );
}

export function isPathInside(parent: string, candidate: string): boolean {
  const rel = relative(resolve(parent), resolve(candidate));
  return (
    rel === "" ||
    (!isAbsolute(rel) && rel !== ".." && !rel.startsWith(".." + sep))
  );
}

export function sha256(value: string | Buffer): string {
  return createHash("sha256").update(value).digest("hex");
}

export function stableJson(value: unknown): string {
  return JSON.stringify(sortValue(value));
}

export function portablePath(value: string): string {
  return value.replaceAll("\\", "/");
}

function sortValue(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(sortValue);
  }
  if (isRecord(value)) {
    const sorted: Record<string, unknown> = {};
    for (const key of Object.keys(value).sort()) {
      sorted[key] = sortValue(value[key]);
    }
    return sorted;
  }
  return value;
}

export function resolveInside(root: string, candidate: string, context: string): string {
  const absoluteRoot = resolve(root);
  const target = resolve(root, candidate);
  const rel = relative(absoluteRoot, target);
  if (rel === ".." || rel.startsWith("../") || rel.startsWith("..\\")) {
    throw new Error(context + " escapes its owning directory: " + candidate);
  }
  return target;
}

export function assertAdapterId(value: string): asserts value is "codex" | "kimi" | "opencode" {
  if (value !== "codex" && value !== "kimi" && value !== "opencode") {
    throw new Error("Unknown adapter: " + value);
  }
}
