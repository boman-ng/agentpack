import { homedir } from "node:os";
import { isAbsolute, join, resolve } from "node:path";
import type { HomeLayout } from "./types.js";

function absoluteFrom(value: string, base: string): string {
  return isAbsolute(value) ? value : resolve(base, value);
}

export function createHomeLayout(homeOverride?: string): HomeLayout {
  const home = resolve(homeOverride ?? homedir());
  const isolated = homeOverride !== undefined;

  const codexHome = isolated
    ? join(home, ".codex")
    : process.env.CODEX_HOME
      ? absoluteFrom(process.env.CODEX_HOME, home)
      : join(home, ".codex");

  const kimiHome = isolated
    ? join(home, ".kimi-code")
    : process.env.KIMI_CODE_HOME
      ? absoluteFrom(process.env.KIMI_CODE_HOME, home)
      : join(home, ".kimi-code");

  const xdgConfig = isolated
    ? join(home, ".config")
    : process.env.XDG_CONFIG_HOME
      ? absoluteFrom(process.env.XDG_CONFIG_HOME, home)
      : join(home, ".config");

  const sharedAgentsHome = join(home, ".agents");
  const stateRoot = join(home, ".agentpack");

  return {
    home,
    sharedAgentsHome,
    sharedSkills: join(sharedAgentsHome, "skills"),
    stateRoot,
    stateFile: join(stateRoot, "state.json"),
    backupsRoot: join(stateRoot, "backups"),
    codexHome,
    kimiHome,
    opencodeHome: join(xdgConfig, "opencode"),
  };
}
