import { randomUUID } from "node:crypto";
import { cp, mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import type {
  BackupItem,
  BackupManifest,
  HomeLayout,
} from "./types.js";
import {
  atomicWrite,
  pathExists,
  removePath,
} from "./util/fs.js";

export interface CreatedBackup {
  path: string;
  manifest: BackupManifest;
}

export async function createBackup(
  layout: HomeLayout,
  targets: string[],
): Promise<CreatedBackup | undefined> {
  if (targets.length === 0) {
    return undefined;
  }
  const timestamp = new Date().toISOString().replaceAll(":", "-").replace(/\.\d{3}Z$/, "Z");
  const backupPath = join(layout.backupsRoot, timestamp + "-" + randomUUID().slice(0, 8));
  const itemsPath = join(backupPath, "items");
  await mkdir(itemsPath, { recursive: true });

  const items: BackupItem[] = [];
  for (const [index, target] of targets.entries()) {
    const existed = await pathExists(target);
    if (!existed) {
      items.push({ target, existed: false });
      continue;
    }
    const snapshot = join("items", String(index).padStart(4, "0"));
    await cp(target, join(backupPath, snapshot), {
      recursive: true,
      force: false,
      errorOnExist: true,
      preserveTimestamps: true,
      verbatimSymlinks: true,
    });
    items.push({ target, existed: true, snapshot });
  }

  const manifest: BackupManifest = {
    schemaVersion: 1,
    createdAt: new Date().toISOString(),
    items,
  };
  await atomicWrite(join(backupPath, "manifest.json"), JSON.stringify(manifest, null, 2) + "\n");
  return { path: backupPath, manifest };
}

export async function restoreBackup(backup: CreatedBackup): Promise<void> {
  const errors: string[] = [];
  for (const item of [...backup.manifest.items].reverse()) {
    try {
      await removePath(item.target);
      if (item.existed && item.snapshot !== undefined) {
        await mkdir(dirname(item.target), { recursive: true });
        await cp(join(backup.path, item.snapshot), item.target, {
          recursive: true,
          force: false,
          errorOnExist: true,
          preserveTimestamps: true,
          verbatimSymlinks: true,
        });
      }
    } catch (error) {
      errors.push(item.target + ": " + errorMessage(error));
    }
  }
  if (errors.length > 0) {
    throw new Error("Rollback failed for: " + errors.join("; "));
  }
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
