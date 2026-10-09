# Install AgentPack with Codex

This guide is for Codex acting on an explicit user request to install, update, or restore AgentPack. Reading or maintaining this repository alone does not request installation. Use available Git, filesystem, and Codex tools; there is no AgentPack installer to invoke.

## Agree on the selection

Read [README.md](README.md), [SOURCES.md](SOURCES.md), and any previous installation record. Identify the user's home and the effective Codex home (`CODEX_HOME`, otherwise `~/.codex`). Resolve a relative `CODEX_HOME` against the starting working directory before changing directories. Use absolute target paths in the review.

Ask only about choices that are not already settled, preferably together:

- **Instructions:** replace the global instructions, or skip them. Recommend replacing them.
- **Skills:** take over the user skill collection with selected local skills and complete suites from SOURCES.md, or skip it. Present the catalog by task category, but select suites as units, not individual members. Categories do not select their contents automatically. Recommend the local Dev suite for development or maintenance according to the user's tasks; `ui-translate` is independently optional. An explicitly empty selection clears that collection; skipping it does not.
- **MCP:** take over the user MCP collection with AnySearch, explicitly clear it, or skip it. Recommend skipping it unless remote search is wanted. AnySearch sends queries and requested URLs to an external service.

Expand each chosen suite to every member in SOURCES.md before showing the scope. Include selected local skills, verify unique skill names, and show both suite names and the resulting skill list. If a request or older installation record names only some members of a suite, show the complete suite and the additional members before settling the selection; do not silently enlarge it or install a partial suite. A suite selection does not select other suites in the same category, install runtime dependencies, or configure MCP.

Dev is a local suite whose authoritative membership is in [SOURCES.md](SOURCES.md#local-dev-suite). Its four skill names are independent invocation entrypoints, not independent installation choices. Keep the directories as siblings so their explicit relative references resolve. The shared rules are ordinary resources; do not invent skill inheritance, dependency metadata, or an automatic dependency resolver.

Only user-level installation is supported. Do not change project configuration. Show existing entries and the exact targets to replace, archive, or remove before confirming the scope. Include unrelated entries that will disappear from a selected collection and explain the shared-skills impact. Once that concrete scope is authorized, continue without repeated confirmations; ask again only if it materially changes.

## Targets and ownership

| Selected component | Desired result | Existing content to archive and retire |
|---|---|---|
| Instructions | Copy [instructions/AGENTS.md](instructions/AGENTS.md) to `$CODEX_HOME/AGENTS.md` | Previous target and `$CODEX_HOME/AGENTS.override.md`; remove the override so the new file can take effect |
| Skills | Replace `~/.agents/skills` with exactly the selected skill directories, named by their `SKILL.md` names | Previous shared collection and ordinary entries in `$CODEX_HOME/skills`; preserve `$CODEX_HOME/skills/.system` |
| MCP | Replace only `mcp_servers` in `$CODEX_HOME/config.toml` with the selected definitions from [mcp/codex.toml](mcp/codex.toml), or remove that namespace for an empty selection | Previous namespace; preserve all other configuration keys and comments |

Skipped components, including their legacy paths, stay unchanged. Do not create `~/.agents/AGENTS.md`: it is not Codex's default global instruction entry. Do not delete an existing file there. The shared skills directory can serve other clients even though AgentPack supports only Codex; that impact must be part of the confirmed scope.

Preserve system skills, installed plugins, project instructions and skills, administrator configuration, other clients' directories, credentials, sessions, logs, and caches. These can provide additional instructions or skills; AgentPack does not promise an exclusive list across all Codex sources. Do not sweep the filesystem to remove them.

Inspect symbolic links and overlapping paths before writes. Do not follow a directory link while pruning its contents or modify a linked project. Archive a selected link as a link and replace that entry with ordinary copied content. For a linked configuration file, read its effective content to preserve unrelated settings, then replace the link at the approved path rather than writing through it. If roots overlap protected locations or cannot be scoped safely, stop before mutation and resolve that specific boundary with the user.

## Prepare, archive, and apply

1. Obtain a clean checkout of the requested AgentPack revision and record its full commit. Default to `master`; use the user's recorded commit for exact reproduction. Preserve any existing checkout's uncommitted work. Check out each selected upstream source at the full commit in SOURCES.md; never substitute a newer branch head when a pin is unavailable.
2. Stage every member of each selected suite and the selected local skills, including scripts, references, hidden resources, and embedded notices. Check the full suite membership against SOURCES.md, each `SKILL.md` name and description, UI metadata, resource availability, and declared license. Reject broken symlinks and symlinks escaping their selected skill directory. Check local resource references within that directory, with one exception: the complete local Dev suite may reference ordinary files in its other staged member directories. Resolve these references and require their real targets to stay within those Dev members; reject missing members, missing resources, and paths escaping the suite. This exception does not permit escaping symlinks or references to arbitrary installed skills, other suites, or a checkout outside staging. Retain relevant upstream license and notice files with each installed third-party skill under a `provenance/` subdirectory without overwriting upstream files. For Motion, also check the fixed source's MIT package declaration and copy the AgentPack license declaration record named in SOURCES.md into `provenance/`; the absence of an upstream LICENSE file is documented, not permission to invent one. Stop on source, path, membership, or license problems before changing targets; do not drop a failing member and continue with an incomplete suite. Report missing runtime prerequisites separately; installing a runtime is a separate user choice.
3. Before mutation, create a new backup outside all skill discovery roots, normally `~/.agentpack/backups/<unique-time>/`, accessible only to the current user. Copy every affected target, preserving links and recording which paths were absent. For an MCP change, snapshot the complete configuration file for immediate rollback and record its previous MCP namespace for later scoped recovery. Include any existing installation record in the backup. Save this mapping and the confirmed scope in a readable note; do not print configuration secrets. Do not overwrite earlier backups or the pre-AgentPack archive.
4. Finish source preparation and replacement content before retiring existing targets. Recheck that inspected targets have not changed. Copy instructions and skills unchanged, apart from added provenance files, and edit only the selected MCP namespace. If targets changed concurrently, inspect the new state before continuing. Do not clear a live collection while downloads are pending.
5. If application or local validation fails, restore targets changed by this attempt, including removing targets that were originally absent. Preserve the backup. Report partial changes or restoration failure; do not claim success. These are instructions to the executing agent, not a program-enforced atomic transaction.

Use complete copies rather than links into a temporary checkout. The built-in skill installer is optional: its destination and existing-target behavior may differ, so explicitly select the approved destination and never let a helper broaden the scope. Do not run an upstream repository's setup scripts merely to obtain its skill files.

## Verify and record

- Compare installed instructions and skill payloads with the staged sources; confirm the selected collection contains exactly the expanded suite members and chosen local skills, including their provenance records, and retired user roots no longer expose old copies. For Dev, verify all four entrypoints, their UI metadata, and shared resource references at the installed paths. Confirm the instruction override was retired when instructions were selected.
- Verify protected and skipped content, including non-MCP configuration, is unchanged. Check TOML validity before asking Codex to reload it.
- Check actual skill discovery with Codex's `/skills` UI or app-server `skills/list` interface. Start a fresh session when needed. Do not report runtime discovery as verified based solely on directory existence; identify remaining project, plugin, or built-in duplicates without deleting them.
- Inspect MCP configuration using `codex mcp list` or the native configuration reader. If AnySearch was selected, attempt a read-only connection/tool-list check when the environment permits it. Record configuration validity and connectivity separately; a network failure is not evidence that configuration writing failed.
- After local validation, write a concise record to `~/.agentpack/INSTALLATION.md`, preserving the previous record in the attempt's backup. Include the AgentPack commit, selected and skipped components, selected local skills and suite names, each suite's upstream commit, the actual installed skill names, absolute targets, backup location, checks performed, and any unverified runtime prerequisites or connectivity. Keep credentials out of this record and the user-facing report.

Finish by reporting what changed, what remains unverified, where the backup is, and whether a new Codex session is needed. Newly installed global instructions take effect in a fresh session; do not treat replacement of a file as replacement of the instructions governing the current conversation.

## Update and restore

For an update, read the record, use its local-skill and suite selections as the default, and repeat this guide from the requested AgentPack commit. Compare the old installed names with the newly expanded selection and show additions and removals before confirming the scope, including newly added local entries. For older records containing individual upstream names, use them to explain the previous installation, then settle complete suite choices as described above; they do not authorize automatic suite expansion. Do not silently re-enable skipped components. Direct edits to selected targets are replaced; lasting changes belong in the user's checkout or fork. Upstream upgrades are reviewed edits to SOURCES.md, not automatic branch tracking.

For older records selecting standalone `cleanup` or `dev`, explain that `cleanup` has been replaced by `dev-clean` and that Dev now installs as a complete suite. Show the exact old-to-new skill names, including removal of `cleanup` and additions from the suite, before settling the migration scope. Retire the installed `cleanup` only as part of the authorized skill-collection replacement; do not create an alias. If skills are skipped, preserve their installed files and record that this migration was not performed. Update the installation record only after an actual installation passes local validation, never merely because the repository or catalog changed.

For recovery, inspect the backup and current targets, agree on the snapshot and concrete targets, then restore only those targets. Immediate failure rollback may restore the whole configuration snapshot when there are no concurrent edits; later MCP recovery restores only its former namespace into the current file so unrelated later settings survive. Remove only selected targets recorded as originally absent. Never choose a backup, delete all backups, or restore an entire Codex home implicitly.

Older AgentPack state is historical evidence, not a new ownership database. When migrating, use this guide's explicit targets and preserve old backups. Do not execute the retired CLI, delete other clients' installations, or remove arbitrary paths listed in old state.

## Codex references

- [Global instruction discovery](https://developers.openai.com/codex/guides/agents-md)
- [Skill discovery](https://developers.openai.com/codex/skills)
- [MCP configuration](https://developers.openai.com/codex/mcp)
- [App-server skill discovery](https://developers.openai.com/codex/app-server)
