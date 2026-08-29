import { homedir } from "node:os";
import { isAbsolute, join, resolve } from "node:path";
import type { HomeLayout } from "./types.js";

function absoluteFrom(value: string): string {
  return isAbsolute(value) ? value : resolve(value);
}

export function createHomeLayout(homeOverride?: string): HomeLayout {
  const home = resolve(homeOverride ?? homedir());
  const isolated = homeOverride !== undefined;

  const codexHome = isolated
    ? join(home, ".codex")
    : process.env.CODEX_HOME
      ? absoluteFrom(process.env.CODEX_HOME)
      : join(home, ".codex");

  const kimiHome = isolated
    ? join(home, ".kimi-code")
    : process.env.KIMI_CODE_HOME
      ? absoluteFrom(process.env.KIMI_CODE_HOME)
      : join(home, ".kimi-code");

  const xdgConfig = isolated
    ? join(home, ".config")
    : process.env.XDG_CONFIG_HOME
      ? absoluteFrom(process.env.XDG_CONFIG_HOME)
      : join(home, ".config");

  const stateRoot = join(home, ".agentpack");

  return {
    home,
    stateRoot,
    stateFile: join(stateRoot, "state.json"),
    backupsRoot: join(stateRoot, "backups"),
    codexHome,
    kimiHome,
    opencodeHome: join(xdgConfig, "opencode"),
  };
}
