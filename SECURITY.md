# Security and recovery

Report vulnerabilities privately through this repository's GitHub security advisory channel.

AgentPack distributes content and installation guidance. It does not run an installer, background updater, or automatic migration. The executing Codex session is responsible for following [INSTALL.md](INSTALL.md) within the user's authorization and its host permissions.

- Installation requires an explicit user request and a confirmed scope showing actual replacements and removals. Selected user collections may include content created by other tools; their replacement is intentional only within that disclosed scope.
- Prepare selected sources before modifying targets. Use the commits in [SOURCES.md](SOURCES.md), inspect skill resources and licenses, and do not execute upstream setup code merely to copy a skill. A commit identifies content; it does not prove the content is safe.
- Inspect target links and overlapping roots. Do not let pruning traverse links into unrelated projects or protected locations.
- Preserve skipped components, built-in and plugin content, project configuration, credentials, sessions, logs, caches, and non-MCP settings.
- Archive affected targets outside discovery roots before changes. Preserve older recovery copies, record absent targets, and report failures and any incomplete recovery honestly.
- Backups may contain personal instructions or existing configuration secrets. Keep them local, restrict access to the current user, and never commit or publish them. Installation records and reports must not contain credentials.
- MCP examples contain no credentials. AnySearch is an optional third-party remote service; enabling it allows queries and requested URLs to leave the machine. Anonymous access does not imply service availability or unlimited usage.

Natural-language instructions do not enforce atomic application, rollback, or identical agent behavior. Verify the resulting files and actual Codex discovery, distinguish configuration from connectivity, and retain backups for interrupted runs. No automated cross-platform installation guarantee is made.

Use disposable directories for maintenance checks. Never validate installation changes against the maintainer's real home. See [third-party attribution](THIRD_PARTY_LICENSES.md) for the license boundaries of selected content.
