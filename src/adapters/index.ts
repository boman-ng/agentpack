import type { AdapterId, AgentAdapter, HomeLayout } from "../types.js";
import { CodexAdapter } from "./codex.js";
import { KimiAdapter } from "./kimi.js";
import { OpenCodeAdapter } from "./opencode.js";

const adapters: Record<AdapterId, AgentAdapter> = {
  codex: new CodexAdapter(),
  kimi: new KimiAdapter(),
  opencode: new OpenCodeAdapter(),
};

export function adapterById(id: AdapterId): AgentAdapter {
  return adapters[id];
}

export async function detectAdapters(
  ids: AdapterId[],
  layout: HomeLayout,
): Promise<AdapterId[]> {
  const detected = await Promise.all(
    ids.map(async (id) => ({ id, present: await adapters[id].detect(layout) })),
  );
  return detected.filter((entry) => entry.present).map((entry) => entry.id);
}
