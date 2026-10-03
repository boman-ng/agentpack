# AgentPack

My personal Codex instructions, skills, and optional MCP configuration, kept in Git so I can review changes and restore the same setup on another machine. Others can use the collection or fork it for their own preferences.

Codex reads the installation guide, asks what you want, and performs the setup using its available tools. AgentPack has no CLI, installation script, package build, or plugin distribution.

## Install with Codex

You need a working Codex CLI and Git. Paste this into Codex:

```text
Install https://github.com/boman-ng/agentpack from its master branch.
Read README.md and INSTALL.md first, then inspect my Codex setup.
Ask which local skills and complete third-party suites I want, along with
instructions and optional MCP. Show the exact content that will
be replaced or removed. After I confirm that scope, complete the backup,
installation, and verification without asking again about settled choices.
Report the installed revisions, verification results, and backup location.
```

Start with the global instructions and select skills for the work you do: `cleanup` for maintaining existing work, `dev` for complex feature development and changes across boundaries. They can be selected independently. Third-party skills and AnySearch are optional. Only user-level Codex configuration is supported.

**Selected components are taken over:** selected skill and MCP collections are replaced with your confirmed selection, including removal of entries not in that selection. Skipped components stay unchanged. The shared `~/.agents/skills` directory may also be used by other clients, so replacing that collection affects their shared skills too. Codex shows the actual targets and archives existing content before making changes. See [INSTALL.md](INSTALL.md) for the boundaries and recovery instructions.

## Contents

| Content | Purpose |
|---|---|
| [Global instructions](instructions/AGENTS.md) | Cross-task decision principles, clear communication, evidence standards, and authorization boundaries |
| [cleanup](skills/cleanup/SKILL.md) | Simplify and retire existing code, tests, configuration, documentation, and instructions |
| [dev](skills/dev/SKILL.md) | Guide complex development from acceptance and business ownership to verified delivery |
| [ui-translate](skills/ui-translate/SKILL.md) | Turn rough UI and motion ideas into frontend terms and developer descriptions |
| [Skill catalog and sources](SOURCES.md) | Local skills and complete optional upstream suites at recorded Git commits |
| [AnySearch configuration](mcp/codex.toml) | Optional anonymous remote search MCP |

Browse skills by task: [engineering development and maintenance](SOURCES.md#engineering-development-and-maintenance), [interface design and development](SOURCES.md#interface-design-and-development), [research and academic writing](SOURCES.md#research-and-academic-writing), or [browser and app automation](SOURCES.md#browser-and-app-automation). Categories help you find capabilities; select local skills individually and third-party suites as complete units. Opening a category does not select everything in it.

Third-party skills are fetched from their recorded sources when their suite is selected; they are not bundled here. Their required tools are separate: installing the `agent-browser` skill, for example, does not install its executable or a browser. Archify creates interactive technical diagrams; its renderer needs Node.js, and its full validation workflow needs Chrome or Chromium. Motion's connected tools need separate MCP setup and may require account or paid access. [SOURCES.md](SOURCES.md) records prerequisites and licenses. Academic Research Suite has a non-commercial license.

## Update and recover

Ask Codex to read [INSTALL.md](INSTALL.md), inspect your installation record, and update the same components from the current `master` commit. To reproduce a previous setup, provide the recorded AgentPack commit instead. Updating AgentPack uses the upstream commits in that revision's source list; upgrading an upstream dependency means reviewing and changing that list.

Edit personal instructions and local skills in your checkout or fork, then commit and push them. Installed files are copies; direct edits to a selected installation target will be overwritten on the next update.

For recovery, ask Codex to inspect the recorded backup and restore the affected targets. There is no automatic background updater or state-driven uninstall. Existing installation backups remain available until you choose to remove them.

## Maintenance

Keep content, source revisions, and links valid. Installation changes are exercised in disposable directories, never against the maintainer's real Codex configuration.

Earlier software releases remain identifiable by their Git tags. Their installation commands, build workflows, and state formats do not apply to this content-based setup.

Original material is MIT-licensed. See [third-party attribution](THIRD_PARTY_LICENSES.md) and the [security and recovery boundaries](SECURITY.md).
