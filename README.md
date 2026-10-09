# AgentPack

My personal instructions, skills, and optional MCP connection settings for agent CLIs, kept in Git for review and reuse across hosts and machines. Use the collection as-is or fork it for your preferences. An agent performs setup from the guide; there is no AgentPack CLI or installer.

## Install with your agent

Use an agent with Git and filesystem access. Paste this request into your agent, naming the target CLI if it is not already clear:

```text
Install https://github.com/boman-ng/agentpack from its master branch.
Read README.md and INSTALL.md, identify the target agent CLI,
then inspect its setup and current official configuration guidance.
Ask which complete skill suites, instructions, and optional MCP I want.
Show the exact replacements and removals. Once that scope is confirmed,
back up, install, and verify it without asking again about settled choices.
Report the result, installed revisions, backup location, and any limits.
```

Installation is user-level. Discover the target host's instruction entrypoint, skill locations, and MCP configuration instead of assuming one client's layout. Within the confirmed targets, selected skill and MCP collections are replaced with the confirmed selection, including removal of unselected entries. Skipped components stay unchanged. Shared locations can affect other clients; review that impact before installation. [INSTALL.md](INSTALL.md) defines discovery, scope, backups, updates, and recovery.

Local skills use the [Agent Skills format](https://agentskills.io/specification). Hosts such as Codex CLI, Claude Code, and OpenCode have their own discovery and invocation mechanisms. Automatic skill loading, delegation, question tools, HTML delivery, and MCP access depend on the actual host; reusable instructions do not establish those capabilities.

## Contents

| Content | Purpose |
|---|---|
| [Global instructions](instructions/AGENTS.md) | Engineering principles, clear communication, and task boundaries |
| [Dev suite](skills/dev/SKILL.md) | Coordinate development, maintenance, independent testing, and Git delivery |
| [Design suite](skills/design/SKILL.md) | Clarify intent and terminology, shape interfaces, build, and review quality using specialist skills |
| [Skill catalog and sources](SOURCES.md) | Complete local and upstream suite selections, pinned revisions, prerequisites, and licenses |
| [AnySearch connection settings](mcp/anysearch.md) | Optional anonymous remote search MCP, mapped to the target host's format |

Install selected suites in full. Dev has five callable skills; Design has four. Design applies Krug's usability and Williams's visual principles, with self-review toward applicable Awwwards, Webby Awards, and FWA-winning quality. Its production implementation requires a separately selected Dev suite; intent, planning, and read-only review remain available without it.

Recommend the optional Answer me with HTML suite alongside Design for interactive clarification. Users answer on the page and copy its Reply into chat; Design uses native questions when HTML is unavailable. Precise terminology questions receive direct answers.

Browse [engineering](SOURCES.md#engineering-development-and-maintenance), [design](SOURCES.md#interface-design-and-development), [research](SOURCES.md#research-and-academic-writing), and [browser automation](SOURCES.md#browser-and-app-automation). The nine optional upstream suites contain 28 skills, fetched when selected. Their runtimes, services, and licenses are separate; Academic Research Suite is non-commercial. See the catalog before selecting.

## Update and maintain

Ask your agent to follow [INSTALL.md](INSTALL.md) for the target host using its installation record and the current `master` commit, or a recorded commit for reproduction. Review membership changes before updating older selections. Installed files are copies: keep lasting edits in your checkout or fork. Repository edits alone do not update the installation.

AgentPack uses `master` for the production installation source and `develop` for the next revision. Follow [Dev Git](skills/dev-git/SKILL.md) for Git Flow, rebase and fast-forward integration, classified atomic Conventional Commits, and workspace ownership. Local work is autonomous within scope; remote writes require human authorization.

Check affected content and links. Exercise installation changes in disposable directories. For recovery, restore the selected targets from the recorded backup as described in the installation guide.

AgentPack's original material is licensed under [MIT](LICENSE). Third-party material retains its [own terms](THIRD_PARTY_LICENSES.md). See [security and recovery](SECURITY.md).
