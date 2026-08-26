import { sha256 } from "./util/values.js";

export const MANAGED_START = "<!-- agentpack:boman-ng/agentpack:start -->";
export const MANAGED_END = "<!-- agentpack:boman-ng/agentpack:end -->";

export function managedInstructionBlock(payload: string): string {
  return MANAGED_START + "\n" + payload.trimEnd() + "\n" + MANAGED_END + "\n";
}

export function appendInstructions(existing: string | undefined, payload: string): string {
  const block = managedInstructionBlock(payload);
  if (existing === undefined || existing.trim().length === 0) {
    return block;
  }
  const range = managedRange(existing);
  if (range !== undefined) {
    return existing.slice(0, range.start) + block + existing.slice(range.end);
  }
  return existing.trimEnd() + "\n\n" + block;
}

export function removeManagedInstructions(existing: string): string {
  const range = managedRange(existing);
  if (range === undefined) {
    throw new Error("AgentPack managed instruction block is missing");
  }
  const before = existing.slice(0, range.start).trimEnd();
  const after = existing.slice(range.end).trimStart();
  if (before.length === 0) {
    return after;
  }
  if (after.length === 0) {
    return before + "\n";
  }
  return before + "\n\n" + after;
}

export function managedInstructionHash(existing: string): string | undefined {
  const range = managedRange(existing);
  return range === undefined ? undefined : sha256(existing.slice(range.start, range.end));
}

function managedRange(content: string): { start: number; end: number } | undefined {
  const start = content.indexOf(MANAGED_START);
  if (start < 0) {
    return undefined;
  }
  const duplicate = content.indexOf(MANAGED_START, start + MANAGED_START.length);
  if (duplicate >= 0) {
    throw new Error("Multiple AgentPack managed instruction blocks found");
  }
  const endMarker = content.indexOf(MANAGED_END, start + MANAGED_START.length);
  if (endMarker < 0) {
    throw new Error("AgentPack managed instruction block has no end marker");
  }
  let end = endMarker + MANAGED_END.length;
  if (content.startsWith("\r\n", end)) {
    end += 2;
  } else if (content.startsWith("\n", end)) {
    end += 1;
  }
  return { start, end };
}
