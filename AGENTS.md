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
- Run `npm test` for behavior changes and `npm run check` before release handoff.
- Run end-to-end installer tests only with an explicit temporary `--home`; never test mutations against the real user home.
- Keep generated lock hashes reproducible with `npm run lock`.
- Preserve third-party provenance, notices, and licenses. Open-source skills are fetched from their declared Git sources at plan time; do not add a bundled fallback snapshot.
- Keep append-mode collisions fail-closed. Existing unmanaged skills or MCP names must not be overwritten silently.

## Review

Before completion, verify all three adapters in isolated homes, both install modes, backup creation, plan-only behavior, selectable components, idempotent updates, doctor, and uninstall safety.
