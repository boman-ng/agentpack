# AgentPack

My personal Codex instructions, skills, and optional MCP configuration, kept in Git so I can review changes and restore the same setup on another machine. Others can use the collection or fork it for their own preferences.

Codex reads the installation guide, asks what you want, and performs the setup using its available tools. AgentPack has no CLI, installation script, package build, or plugin distribution.

## Install with Codex

You need a working Codex CLI and Git. Paste this into Codex:

```text
Install https://github.com/boman-ng/agentpack from its master branch.
Read README.md and INSTALL.md first, then inspect my Codex setup.
Ask which local skills and complete suites I want, along with
instructions and optional MCP. Show the exact content that will
be replaced or removed. After I confirm that scope, complete the backup,
installation, and verification without asking again about settled choices.
Report the installed revisions, verification results, and backup location.
```

Start with the global instructions and select suites for the work you do. The local Dev suite includes four independently callable skills: `dev` coordinates work, `dev-build` implements behavior, `dev-clean` maintains existing work, and `dev-test` provides independent testing. The local Design suite includes `design` for coordination and planning, `design-intent` for intent and professional terminology in any domain, `design-build` for frontend delivery, and `design-review` for evidence-based review. Install each selected suite in full. Third-party suites and AnySearch are optional. Only user-level Codex configuration is supported.

Design reuses available design specialists and project capabilities. Its production source changes, including CSS and components, require the complete Dev suite; selecting Design does not automatically select Dev or upstream suites. Without Dev, intent clarification, planning, and read-only review remain available. Design turns Krug's usability and Williams's visual principles into decisions and checks, with evidence-led iteration toward applicable Awwwards, Webby Awards, and FWA-winning quality.

Recommend selecting the optional one-member Answer me with HTML suite alongside Design; selection remains explicit. Design Intent prefers interactive HTML for every necessary clarification when the provider and a user-accessible channel are available. Users choose or comment, then copy the page's Reply into chat. Otherwise the same remaining questions use native tools or the disclosed chat fallback. Precise terminology answers stay direct. Disposable explanation generation does not require Dev.

**Selected components are taken over:** selected skill and MCP collections are replaced with your confirmed selection, including removal of entries not in that selection. Skipped components stay unchanged. The shared `~/.agents/skills` directory may also be used by other clients, so replacing that collection affects their shared skills too. Codex shows the actual targets and archives existing content before making changes. See [INSTALL.md](INSTALL.md) for the boundaries and recovery instructions.

## Contents

| Content | Purpose |
|---|---|
| [Global instructions](instructions/AGENTS.md) | Cross-task decision principles, clear communication, evidence standards, and authorization boundaries |
| [Dev suite](skills/dev/SKILL.md) | Coordinate [development](skills/dev-build/SKILL.md), [maintenance](skills/dev-clean/SKILL.md), and [independent testing](skills/dev-test/SKILL.md) using shared engineering rules |
| [Design suite](skills/design/SKILL.md) | Coordinate [intent clarification](skills/design-intent/SKILL.md), [frontend delivery](skills/design-build/SKILL.md), and [quality review](skills/design-review/SKILL.md), reusing specialist skills |
| [Skill catalog and sources](SOURCES.md) | Local skills and complete optional upstream suites at recorded Git commits |
| [AnySearch configuration](mcp/codex.toml) | Optional anonymous remote search MCP |

Browse skills by task: [engineering development and maintenance](SOURCES.md#engineering-development-and-maintenance), [interface design and development](SOURCES.md#interface-design-and-development), [research and academic writing](SOURCES.md#research-and-academic-writing), or [browser and app automation](SOURCES.md#browser-and-app-automation). Categories help you find capabilities; select Dev, Design, and third-party suites as complete units. Opening a category does not select everything in it. Design's `design-intent` can also handle terminology and intent outside interface work without starting a design workflow.

The nine optional third-party suites contain 28 skills, fetched from their recorded sources when selected; they are not bundled here. Their required tools are separate: installing the `agent-browser` skill, for example, does not install its executable or a browser. Archify creates interactive technical diagrams; its renderer needs Node.js, and its full validation workflow needs Chrome or Chromium. Answer me with HTML is pinned to `v0.4.15`; its bundled CLI needs Node.js >=20 with no npm install or rebuild, and its complete license record is preserved for installation. It does not create a user-accessible delivery channel automatically. Motion's connected tools need separate MCP setup and may require account or paid access. [SOURCES.md](SOURCES.md) records prerequisites and licenses. Academic Research Suite has a non-commercial license.

## Update and recover

Ask Codex to read [INSTALL.md](INSTALL.md), inspect your installation record, and update the same components from the current `master` commit. To reproduce a previous setup, provide the recorded AgentPack commit instead. Updating AgentPack uses the upstream commits in that revision's source list; upgrading an upstream dependency means reviewing and changing that list.

The former standalone `cleanup` skill is now `dev-clean` within Dev; `ui-translate` is now `design-intent` within Design. Neither old name has an alias. Older selections of `cleanup`, `dev`, or `ui-translate` require review of the corresponding complete suite and the added and removed names before migration. Design's production implementation requirement is a separate Dev selection, not an automatic addition. Updating this checkout alone does not change installed skills.

Edit personal instructions and local skills in your checkout or fork, then commit and push them. Installed files are copies; direct edits to a selected installation target will be overwritten on the next update.

For recovery, ask Codex to inspect the recorded backup and restore the affected targets. There is no automatic background updater or state-driven uninstall. Existing installation backups remain available until you choose to remove them.

## Maintenance

Keep content, source revisions, and links valid. Installation changes are exercised in disposable directories, never against the maintainer's real Codex configuration.

Earlier software releases remain identifiable by their Git tags. Their installation commands, build workflows, and state formats do not apply to this content-based setup.

Original material is MIT-licensed. See [third-party attribution](THIRD_PARTY_LICENSES.md) and the [security and recovery boundaries](SECURITY.md).
