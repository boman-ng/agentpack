# Install AgentPack

Use this guide when the user requests installation, update, or recovery. Repository maintenance alone does not request installation. Use available Git, filesystem, and host tools; AgentPack has no installer. This guide covers user-level configuration.

## Discover the target host

Read [README.md](README.md), [SOURCES.md](SOURCES.md), and the previous installation record, if present. Establish the target agent CLI from the request and environment; the executing agent is not necessarily the installation target. Ask if the target is ambiguous.

Inspect the target's installed version, effective configuration, local help, and current official documentation. Establish its user instruction entrypoint and precedence, skill discovery locations and invocation, MCP configuration format and scope, and available validation/reload mechanisms. Account for environment overrides and resolve paths according to that host's rules. Show absolute targets; do not infer support from a familiar directory name or another client's layout.

If a target or capability cannot be established, pause that component and continue independent preparation. Do not guess a path, install a runtime or bridge, or change project/administrator configuration to manufacture support. If only explicit reading of skill files is available, explain that limitation and agree on a user-owned location; do not describe it as automatic skill discovery.

## Agree on the selection

Ask only about unsettled choices:

- **Instructions:** replace global instructions or skip. Recommend replacement.
- **Skills:** replace the agreed user skill collection with selected complete suites, clear it with an explicitly empty selection, or skip. Present the catalog by task, then expand chosen suites to every listed member. Recommend Dev for engineering, Design for design or intent clarification, and the optional Answer me with HTML suite alongside Design.
- **MCP:** replace the agreed user MCP collection with AnySearch, explicitly clear it, or skip. Recommend skipping unless remote search is wanted. AnySearch sends queries and requested URLs to an external service.

Design needs the complete Dev suite for production source changes and new validation. Intent, planning, and read-only review work without Dev. Explain this boundary and recommend Dev for implementation; do not add it automatically. Suite selection does not select another suite, install runtimes, or configure MCP.

Show the expanded skill names, exact replacements/removals, and existing unrelated entries that would disappear. Include the impact on other clients using shared locations. Discovery of multiple roots, duplicates, or overrides does not select them all for replacement: identify any user-owned copies or overrides that need retirement and include them in the concrete scope. An incomplete or older selection needs review of the full current membership. Once that scope is authorized, proceed without repeated confirmation unless it changes.

## Targets and ownership

| Selected component | Desired result | Archive and retire |
|---|---|---|
| Instructions | Copy [instructions/AGENTS.md](instructions/AGENTS.md) to the discovered user instruction entrypoint, using the host's filename or supported registration | Previous approved target and any explicitly selected user override |
| Skills | Replace the agreed collection with exactly the selected skill directories, named by their `SKILL.md` names | Previous collection and explicitly selected obsolete user copies; preserve built-in/system content |
| MCP | Map [AnySearch connection settings](mcp/anysearch.md) into the host's native user MCP collection, or clear that collection for an empty selection | Previous selected collection; preserve other settings and comments |

The source filename `AGENTS.md` does not prescribe the installed filename or loading mechanism. Any required user-level registration is part of the shown configuration change; preserve settings outside that scope. Skipped components and their legacy paths stay unchanged. Preserve system skills, plugins, project and administrator configuration, other clients' unselected locations, credentials, sessions, logs, and caches.

Inspect links and overlapping roots before writes. Archive a selected link as a link, then replace that entry with ordinary copied content; never prune through it. For a linked configuration file, read its effective content to preserve unrelated settings, but replace the approved link rather than its destination. Resolve overlaps with protected locations before the affected write.

## Prepare, archive, and apply

1. Obtain the requested AgentPack revision, defaulting to `master`, and record its full commit. Preserve existing checkout changes. Fetch selected upstream suites at the exact commits in SOURCES; an unavailable pin is a preparation failure, not a reason to use a branch head. Do not execute upstream setup scripts to obtain skill files.
2. Stage complete skill directories, including hidden resources, scripts, metadata, and notices. Validate membership, unique names, frontmatter, resources, and licenses. Local skills use `SKILL.md` without client-specific UI metadata; preserve any upstream metadata unchanged and assess host requirements separately. Local references must resolve inside their skill, except ordinary file references among members of the same complete local Dev or Design suite. Keep those members as siblings. Reject broken or escaping symlinks, cross-suite file references, and missing members/resources before changing targets. External skills use runtime discovery. Report host limitations and missing runtime prerequisites separately; installing prerequisites is a separate choice.
3. Add third-party attribution under each installed skill's `provenance/`, without overwriting upstream files, using [the attribution index](THIRD_PARTY_LICENSES.md) and its linked records. Preserve payloads unchanged. Motion requires its declaration record and a check of the pinned MIT package declaration. Answer me with HTML requires its complete preserved attribution directory after comparing the root license with the pinned source.
4. Back up every affected target and the previous installation record outside discovery roots, normally `~/.agentpack/backups/<unique-time>/`, with access restricted to the current user. Preserve links and earlier backups; record the target host, absolute targets, absent paths, and the confirmed scope. For shared configuration files, save both the complete snapshot and the old selected settings, including MCP entries or instruction registration. Keep credentials out of notes and reports.
5. Finish preparation before retiring live content. Recheck targets for concurrent changes and resolve any new state before applying the approved replacements. Use complete copies, not links into a temporary checkout; edit only the selected configuration fields using the host's supported format or tools. Do not change permissions or authentication as an installation shortcut. Helpers must use the approved targets and scope.
6. If application or local validation fails, restore only targets changed by this attempt, removing those originally absent. For concurrent configuration edits, preserve unrelated new settings as described under recovery. Keep the backup and report any incomplete restoration.

## Verify and record

- Compare installed payloads and provenance with staging. Check exact selected membership, local entrypoints, included metadata, and resource links at installed paths. Confirm explicitly retired copies and overrides are gone.
- Confirm skipped/protected content and settings outside scope are unchanged; validate the actual configuration format before reloading.
- Check instruction loading and skill discovery through the target host's supported inspection or invocation mechanism, using a fresh session when needed. Report remaining project/plugin/built-in duplicates without deleting them. File presence or explicit file reading alone does not establish automatic discovery; report unverified loading separately.
- Inspect the selected MCP collection with the host's native reader. For selected AnySearch, attempt a read-only connection/tool-list check when available; distinguish configuration validity from connectivity.
- After local validation, update `~/.agentpack/INSTALLATION.md`, separating entries by target host and effective absolute targets. Include AgentPack/upstream commits, selected/skipped components, suites and installed names, backup location, discovery/loading results, and unresolved prerequisites needed for update or recovery. Preserve other hosts' entries and skipped components' records. Bind a legacy record to its recorded targets; do not reuse it for a different host or overwrite it merely because it has no host label.

Report the result, material limits, backup location, and whether the target host needs a reload or fresh session. Separate files installed, host loading verified, and services connected. Newly installed instructions do not replace the current session's instructions.

## Update and restore

Use the matching host's recorded selections as update defaults and repeat this guide at the requested revision. Recheck effective paths and capabilities; changed targets need scope review, not automatic migration. Show added and removed names before settling the new scope; do not expand selections or re-enable skipped components automatically. Direct edits to installed targets are overwritten; lasting customization belongs in the user's checkout or fork.

| Older selection | Current replacement to review |
|---|---|
| Standalone `cleanup` or `dev` | Complete Dev suite; `cleanup` becomes `dev-clean` |
| Four-member Dev | Complete Dev suite including `dev-git` |
| `ui-translate` | Complete Design suite; `design-intent` replaces the old name; Dev remains a separate choice |

Old names have no aliases. Retire them only within authorized skill replacement, and record migration only after actual installation passes local validation. Older CLI state does not authorize arbitrary removals; use the targets above and preserve historical backups.

For recovery, agree on the backup, target host, and concrete targets, then restore only those targets. Immediate failure rollback may restore the full configuration snapshot if there are no concurrent edits; otherwise restore only the changed fields into the current file. Later configuration recovery restores only the selected old fields, such as the MCP collection, while preserving unrelated current settings. Remove only selected targets recorded as originally absent, and do not delete a shared configuration file that has gained unrelated settings. Restore only this attempt's installation-record entries while preserving concurrent updates for other hosts. Do not implicitly restore a whole host configuration directory or delete backups.
