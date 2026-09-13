# AgentPack Repository Instructions

This repository is the canonical source for `boman-ng/agentpack`. The global instructions installed for users live at `instructions/global/AGENTS.md`; do not replace this repository-development file with that payload.

## Architecture

- Keep intent in `agentpack.yaml`, component catalogs, and profiles. Target filesystem paths and vendor-specific formats belong to adapters.
- Skills use the Agent Skills `SKILL.md` format. `skills/sources.yaml` and the catalog are canonical; the planner resolves selected Git branch heads to immutable commits before adapters materialize them.
- MCP catalog entries contain environment-variable names only. Never add credential values.
- Installer effects follow plan → backup → apply → validate → state. A failed apply must roll back its exact targets.
- Every adapter owns its instruction, skills, and MCP target paths. Resolve each selected skill source once, then materialize independent copies in the selected vendor directories.
- Overwrite mode owns only global instructions, exact selected or previously managed skill entries, and each adapter's MCP namespace. Never replace a whole vendor skills directory or general configuration file, or remove credentials, sessions, logs, cache, or an entire CLI home.

## Development

- Use Node.js 22 or newer, npm, and Git.
- Keep generated lock hashes reproducible with `npm run lock`.
- Preserve third-party provenance, notices, and licenses. Open-source skills are fetched from their declared Git sources at plan time; do not add a bundled fallback snapshot.
- Keep append-mode collisions fail-closed. Existing unmanaged skills or MCP names must not be overwritten silently.

## Verification

- Match verification to the changed surface. Use affected checks for localized edits. Shared installer, ownership, rollback, or adapter-contract changes require the full installer matrix: all three adapters, both install modes, backups, plan-only behavior, component selection, idempotent updates, doctor, and uninstall safety.
- Release qualification keeps the full installer matrix and existing project gates, including the three-platform CI and native distribution builds. Run `npm run check` before release handoff; it already includes `npm test`. Do not repeat unchanged checks without a material reason.
- Run installer tests only with an explicit temporary `--home` or the suite's disposable-home fixtures; never test mutations against the real user home. Within existing permissions, complete scoped fixes and rerun affected checks without stepwise approval.
