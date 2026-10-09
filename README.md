# AgentPack

My personal Codex instructions, skills, and optional MCP configuration, kept in Git for review and reuse across machines. Use the collection as-is or fork it for your preferences. Codex performs the setup from the guide; there is no AgentPack CLI or installer.

## Install with Codex

You need Codex CLI and Git. Paste this into Codex:

```text
Install https://github.com/boman-ng/agentpack from its master branch.
Read README.md and INSTALL.md, then inspect my Codex setup.
Ask which complete skill suites, instructions, and optional MCP I want.
Show the exact replacements and removals. Once that scope is confirmed,
back up, install, and verify it without asking again about settled choices.
Report the result, installed revisions, backup location, and any limits.
```

Only user-level Codex installation is supported. Selected skill and MCP collections are replaced with the confirmed selection, including removal of unselected entries. Skipped components stay unchanged. The shared `~/.agents/skills` directory can serve other clients; review its replacements before installation. [INSTALL.md](INSTALL.md) defines targets, backups, updates, and recovery.

## Contents

| Content | Purpose |
|---|---|
| [Global instructions](instructions/AGENTS.md) | Engineering principles, clear communication, and task boundaries |
| [Dev suite](skills/dev/SKILL.md) | Coordinate development, maintenance, independent testing, and Git delivery |
| [Design suite](skills/design/SKILL.md) | Clarify intent and terminology, shape interfaces, build, and review quality using specialist skills |
| [Skill catalog and sources](SOURCES.md) | Complete local and upstream suite selections, pinned revisions, prerequisites, and licenses |
| [AnySearch configuration](mcp/codex.toml) | Optional anonymous remote search MCP |

Install selected suites in full. Dev has five callable skills; Design has four. Design applies Krug's usability and Williams's visual principles, with self-review toward applicable Awwwards, Webby Awards, and FWA-winning quality. Its production implementation requires a separately selected Dev suite; intent, planning, and read-only review remain available without it.

Recommend the optional Answer me with HTML suite alongside Design for interactive clarification. Users answer on the page and copy its Reply into chat; Design uses native questions when HTML is unavailable. Precise terminology questions receive direct answers.

Browse [engineering](SOURCES.md#engineering-development-and-maintenance), [design](SOURCES.md#interface-design-and-development), [research](SOURCES.md#research-and-academic-writing), and [browser automation](SOURCES.md#browser-and-app-automation). The nine optional upstream suites contain 28 skills, fetched when selected. Their runtimes, services, and licenses are separate; Academic Research Suite is non-commercial. See the catalog before selecting.

## Update and maintain

Ask Codex to follow [INSTALL.md](INSTALL.md) using your installation record and the current `master` commit, or a recorded commit for reproduction. Review membership changes before updating older selections. Installed files are copies: keep lasting edits in your checkout or fork. Repository edits alone do not update the installation.

AgentPack uses `master` for the production installation source and `develop` for the next revision. Follow [Dev Git](skills/dev-git/SKILL.md) for Git Flow, rebase and fast-forward integration, classified atomic Conventional Commits, and workspace ownership. Local work is autonomous within scope; remote writes require human authorization.

Check affected content and links. Exercise installation changes in disposable directories. For recovery, restore the selected targets from the recorded backup as described in the installation guide.

AgentPack's original material is licensed under [MIT](LICENSE). Third-party material retains its [own terms](THIRD_PARTY_LICENSES.md). See [security and recovery](SECURITY.md).
