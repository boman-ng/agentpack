# AgentPack Repository Instructions

This repository is the canonical source for `boman-ng/agentpack`. The global instructions installed for users live at `instructions/global/AGENTS.md`; do not replace this repository-development file with that payload.

## Architecture

- Keep intent in `agentpack.yaml`, component catalogs, and profiles. Target filesystem paths and vendor-specific formats belong to adapters.
- Skills use the Agent Skills `SKILL.md` format. `skills/sources.yaml` and the catalog are canonical; the planner resolves selected Git branch heads to immutable commits before adapters materialize them.
- MCP catalog entries contain environment-variable names only. Never add credential values.
- Installer effects follow plan → backup → apply → validate → state. A failed apply must roll back its exact targets.
- Overwrite mode owns only global instructions, the shared skills directory, and MCP configuration. Never remove credentials, sessions, logs, or an entire CLI home.

## Development

- Use Node.js 22 or newer, npm, and Git.
- Run `npm test` for behavior changes and `npm run check` before release handoff.
- Run end-to-end installer tests only with an explicit temporary `--home`; never test mutations against the real user home.
- Keep generated lock hashes reproducible with `npm run lock`.
- Preserve third-party provenance, notices, and licenses. Open-source skills are fetched from their declared Git sources at plan time; do not add a bundled fallback snapshot.
- Keep append-mode collisions fail-closed. Existing unmanaged skills or MCP names must not be overwritten silently.

## Review

Before completion, verify all three adapters in isolated homes, both install modes, backup creation, plan-only behavior, selectable components, idempotent updates, doctor, and uninstall safety.
