# AgentPack Repository Instructions

This repository is the canonical source for `boman-ng/agentpack`, a personal Codex configuration collection. Its default branch is `master`.

## Content and installation

- The user-facing entry is README.md; INSTALL.md owns installation and recovery instructions. SOURCES.md owns the optional skill list, immutable upstream revisions, and prerequisites.
- The global payload is instructions/AGENTS.md. This root file governs repository maintenance and must never be installed as the user's global instructions.
- Support Codex user-level configuration only. Keep installation agent-driven; do not introduce a CLI, installer script, adapter framework, profiles, schema, ownership database, or package build.
- Installation copies selected content without rewriting it. Upstream skills stay in their declared repositories; do not add bundled snapshots or fallback downloads.
- Selected collections have the replacement semantics in INSTALL.md. Preserve skipped components, built-ins, project files, plugins, credentials, sessions, and other settings. Archive affected targets before writes; keep backups outside discovery roots.
- MCP examples contain endpoints and environment-variable names, never credentials. Preserve third-party provenance, license texts, and notices.

## Verification and publication

- Check Markdown links, source revisions and skill paths, frontmatter, bundled references, license attribution, and the native TOML snippet when changing those surfaces.
- For installation-guide changes, exercise fresh setup, replacement, skipped components, repeated setup, preparation failure, and recovery in disposable directories. Never test installation mutations against the real user home.
- Verify skills with Codex's discovery interface where available. Report the tested Codex version and platform; distinguish valid MCP configuration from a working connection.
- Instructions guide an agent; they do not provide a program-enforced transaction guarantee. Report partial execution and recovery failures honestly.
- Use self-contained Conventional Commits. Preserve existing history and tags; publication, remote cleanup, or version changes require the user's authorization for those actions.
