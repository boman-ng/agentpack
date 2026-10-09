# Install AgentPack with Codex

Use this guide when the user requests installation, update, or recovery. Repository maintenance alone does not request installation. Use available Git, filesystem, and Codex tools; AgentPack has no installer. Only user-level Codex configuration is supported.

## Agree on the selection

Read [README.md](README.md), [SOURCES.md](SOURCES.md), and the previous installation record, if present. Identify the user's home and effective Codex home (`CODEX_HOME`, otherwise `~/.codex`); resolve a relative `CODEX_HOME` against the starting working directory. Show absolute targets.

Ask only about unsettled choices:

- **Instructions:** replace global instructions or skip. Recommend replacement.
- **Skills:** replace the user skill collection with selected complete suites, clear it with an explicitly empty selection, or skip. Present the catalog by task, then expand chosen suites to every listed member. Recommend Dev for engineering, Design for design or intent clarification, and the optional Answer me with HTML suite alongside Design.
- **MCP:** replace the user MCP collection with AnySearch, explicitly clear it, or skip. Recommend skipping unless remote search is wanted. AnySearch sends queries and requested URLs to an external service.

Design needs the complete Dev suite for production source changes and new validation. Intent, planning, and read-only review work without Dev. Explain this boundary and recommend Dev for implementation; do not add it automatically. Suite selection does not select another suite, install runtimes, or configure MCP.

Show the expanded skill names, exact replacements/removals, and existing unrelated entries that would disappear. The shared `~/.agents/skills` collection may serve other clients; include that impact. An incomplete or older selection needs review of the full current membership. Once the concrete scope is authorized, proceed without repeated confirmation unless it changes.

## Targets and ownership

| Selected component | Desired result | Archive and retire |
|---|---|---|
| Instructions | Copy [instructions/AGENTS.md](instructions/AGENTS.md) to `$CODEX_HOME/AGENTS.md` | Previous target and `$CODEX_HOME/AGENTS.override.md`; remove the override |
| Skills | Replace `~/.agents/skills` with exactly the selected skill directories, named by their `SKILL.md` names | Previous shared collection and ordinary entries in `$CODEX_HOME/skills`; preserve `.system` |
| MCP | Replace only `mcp_servers` in `$CODEX_HOME/config.toml` from [mcp/codex.toml](mcp/codex.toml), or remove that namespace for an empty selection | Previous namespace; preserve other keys and comments |

Skipped components and their legacy paths stay unchanged. Preserve system skills, plugins, project and administrator configuration, other clients' directories, credentials, sessions, logs, and caches. Leave `~/.agents/AGENTS.md` alone; it is not the default Codex global instruction target.

Inspect links and overlapping roots before writes. Archive a selected link as a link, then replace that entry with ordinary copied content; never prune through it. For a linked configuration file, read its effective content to preserve unrelated settings, but replace the approved link rather than its destination. Resolve overlaps with protected locations before the affected write.

## Prepare, archive, and apply

1. Obtain the requested AgentPack revision, defaulting to `master`, and record its full commit. Preserve existing checkout changes. Fetch selected upstream suites at the exact commits in SOURCES; an unavailable pin is a preparation failure, not a reason to use a branch head. Do not execute upstream setup scripts to obtain skill files.
2. Stage complete skill directories, including hidden resources, scripts, metadata, and notices. Validate membership, unique names, frontmatter, UI metadata, resources, and licenses. Local references must resolve inside their skill, except ordinary file references among members of the same complete local Dev or Design suite. Keep those members as siblings. Reject broken or escaping symlinks, cross-suite file references, and missing members/resources before changing targets. External skills use runtime discovery. Report missing runtime prerequisites separately; installing them is a separate choice.
3. Add third-party attribution under each installed skill's `provenance/`, without overwriting upstream files, using [the attribution index](THIRD_PARTY_LICENSES.md) and its linked records. Preserve payloads unchanged. Motion requires its declaration record and a check of the pinned MIT package declaration. Answer me with HTML requires its complete preserved attribution directory after comparing the root license with the pinned source.
4. Back up every affected target and the previous installation record outside discovery roots, normally `~/.agentpack/backups/<unique-time>/`, with access restricted to the current user. Preserve links and earlier backups; record absolute targets, absent paths, and the confirmed scope. For MCP, save both the complete configuration snapshot and its old MCP namespace. Keep credentials out of notes and reports.
5. Finish preparation before retiring live content. Recheck targets for concurrent changes and resolve any new state before applying the approved replacements. Use complete copies, not links into a temporary checkout; edit only the selected MCP namespace. Helpers must use the approved targets and scope.
6. If application or local validation fails, restore only targets changed by this attempt, removing those originally absent. For concurrent configuration edits, preserve unrelated new settings as described under recovery. Keep the backup and report any incomplete restoration.

## Verify and record

- Compare installed payloads and provenance with staging. Check exact selected membership, local entrypoints, metadata, and resource links at installed paths. Confirm retired user copies and the selected instruction override are gone.
- Confirm skipped/protected content and non-MCP settings are unchanged; validate TOML before reloading.
- Check skill discovery through Codex's `/skills` UI or app-server `skills/list`, using a fresh session when needed. Report remaining project/plugin/built-in duplicates without deleting them. File presence alone does not establish discovery.
- Inspect MCP with `codex mcp list` or a native reader. For selected AnySearch, attempt a read-only connection/tool-list check when available; distinguish configuration validity from connectivity.
- After local validation, write `~/.agentpack/INSTALLATION.md` with AgentPack/upstream commits, selected/skipped components, suites and installed names, absolute targets, backup location, and checks or unresolved prerequisites needed for the next update or recovery. Preserve skipped components' existing records.

Report the result, material limits, backup location, and whether a fresh Codex session is needed. Newly installed instructions do not replace the current session's instructions.

## Update and restore

Use the recorded selections as update defaults and repeat this guide at the requested revision. Show added and removed names before settling the new scope; do not expand selections or re-enable skipped components automatically. Direct edits to installed targets are overwritten; lasting customization belongs in the user's checkout or fork.

| Older selection | Current replacement to review |
|---|---|
| Standalone `cleanup` or `dev` | Complete Dev suite; `cleanup` becomes `dev-clean` |
| Four-member Dev | Complete Dev suite including `dev-git` |
| `ui-translate` | Complete Design suite; `design-intent` replaces the old name; Dev remains a separate choice |

Old names have no aliases. Retire them only within authorized skill replacement, and record migration only after actual installation passes local validation. Older CLI state does not authorize arbitrary removals; use the targets above and preserve historical backups.

For recovery, agree on the backup and concrete targets, then restore only those targets. Immediate failure rollback may restore the full configuration snapshot if there are no concurrent edits; later MCP recovery restores only the old namespace into the current file. Remove only selected targets recorded as originally absent. Do not implicitly restore a whole Codex home or delete backups.

## Codex references

- [Global instruction discovery](https://developers.openai.com/codex/guides/agents-md)
- [Skill discovery](https://developers.openai.com/codex/skills)
- [MCP configuration](https://developers.openai.com/codex/mcp)
- [App-server skill discovery](https://developers.openai.com/codex/app-server)
