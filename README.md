# AgentPack

AgentPack is a vendor-neutral, opt-in online installer for global agent instructions, Agent Skills, and MCP server configuration for Codex CLI, Kimi Code CLI, and OpenCode.

The repository keeps one canonical source catalog. At plan time, AgentPack fetches each selected open-source skill from its declared Git branch, resolves the branch head to an immutable commit, and renders each agent's native files from that exact revision. Installing the npm package has no side effects: there is no `postinstall` script, and user configuration changes only after an `agentpack install` plan is previewed and approved.

> **License boundary:** the Academic Research Suite fetched by AgentPack is licensed under CC BY-NC 4.0. Its non-commercial restriction applies after selection and installation. AgentPack's original code is MIT-licensed, but an installation containing third-party skills is mixed-license; read [THIRD_PARTY_LICENSES.md](THIRD_PARTY_LICENSES.md) before redistribution or commercial use.

## What is included

- The current global Codex instructions, copied verbatim to `instructions/global/AGENTS.md` and protected by `agentpack.lock`.
- The local `cleanup` maintenance skill.
- Online source declarations for the latest `main` revision of `academic-research-skills-codex`, `pbakaus/impeccable`, and all 12 skills from `emilkowalski/skills`.
- AnySearch's remote Streamable HTTP MCP server at `https://api.anysearch.com/mcp`.
- Universal adapters for Codex, Kimi Code, and OpenCode, plus generated native Codex and Kimi plugin packages.

Skill metadata is organized by category and domain in `skills/catalog.yaml`; online repository/ref declarations live in `skills/sources.yaml`. Only AgentPack's local `cleanup` skill is stored in the repository. The catalogs, profiles, and provenance records are the source of truth; downloaded checkouts and generated native packages are temporary or derived artifacts.

## Online source resolution

Node.js 22+, npm, Git, and network access to the selected repositories are required. For every selected Git source, `install`, `plan`, `diff`, and `update`:

1. fetch the configured branch head without tags or credentials;
2. resolve it to an immutable commit SHA;
3. validate the selected path and `SKILL.md` metadata;
4. show the repository, ref, and SHA in the plan;
5. apply only the staged content whose hash still matches that plan.

Here, `latest` means the current head of the exact branch declared by that source—currently `refs/heads/main` for every online skill source. AgentPack does not fall back to a bundled or cached snapshot. A network, Git, missing-path, or validation failure stops before user-home mutation. Temporary checkouts are removed after apply, rejection, dry run, or failure. The installed source revision and content hash are recorded in state; `agentpack update` repeats resolution and installs a newer head when available.

## Quick start

From this checkout:

```bash
npm ci
npm run build
node dist/cli.js list
node dist/cli.js install
node dist/cli.js doctor
```

After the package is published, the equivalent global installation is:

```bash
npm install --global @boman-ng/agentpack
agentpack install
```

In a terminal, `install` opens guided setup:

1. select detected agent CLIs with arrow keys and Space;
2. choose replace or merge behavior;
3. choose a concise profile or search for individual skills;
4. watch selected source branches resolve online;
5. review exact target paths, backup scope, source commits, and network boundaries;
6. install, return to change the choices, or cancel without writing files.

The guided flow suggests the `minimal` profile but does not apply anything until `Install now` is selected. `Ctrl+C` cancels cleanly. An existing AgentPack setup is preselected when reconfiguring it; its recorded adapters remain selected, and the prompt can add more adapters.

Flags are the automation interface. Supplying selection flags skips guided setup and prints the complete plan; in a non-interactive shell it remains plan-only unless `--yes` is present. `--json` never opens the TUI or appends human-readable output. Use `--dry-run` to prohibit application explicitly.

```bash
agentpack install --agents codex,kimi --profile coding --yes
```

The non-interactive defaults are intentionally conservative:

- install mode: `overwrite`;
- global instructions: always selected;
- skills: none;
- MCP servers: none.

Nothing selects every catalog component implicitly; `full`, `--all-skills`, and `--all-mcp` remain explicit choices.

## Select components

Select individual components:

```bash
agentpack plan \
  --agents codex,kimi \
  --skills cleanup,academic-research-suite \
  --mcp anysearch
```

Or choose an opt-in profile:

| Profile | Selection |
|---|---|
| `minimal` | `cleanup`; no MCP |
| `coding` | maintenance, browser automation, and frontend design skills; AnySearch |
| `research` | `cleanup`, Academic Research Suite; AnySearch |
| `frontend` | frontend, browser automation, animation, prototyping, and mobile UI skills; no MCP |
| `full` | every catalog skill and MCP server |

`--all-skills` and `--all-mcp` are explicit shortcuts. `--skills none` or `--mcp none` selects an empty set.

## Install modes

| Behavior | `overwrite` (default) | `append` |
|---|---|---|
| Global instructions | Replace the target instruction file | Adopt an exact canonical copy, or add/refresh one marked AgentPack block |
| Skills | Replace the exact AgentPack-managed entries for each selected adapter | Add or refresh selected managed skills beside unrelated vendor skills |
| MCP | Replace the adapter's MCP namespace with the exact selection; preserve other settings | Semantically merge selected servers and preserve unrelated configuration |
| Collision handling | Exact selected instruction, skill, and MCP targets are intentionally replaced | Unmanaged skill directories and MCP names block apply |

Overwrite owns only the supported global instruction file, exact selected or previously managed skill entries, and each adapter's MCP namespace. It never replaces a vendor's whole `skills` directory or whole general configuration file, so unrelated skills, Codex's `.system` subtree, and non-MCP settings survive. It also never removes an agent's credentials, sessions, logs, cache, or entire home directory. A deselected managed skill is removed only while its recorded hash still matches; drift blocks the plan.

Schema v1 records one pack-wide adapter list and component selection. Reconfiguring an existing installation must include every recorded adapter in `--agents`; adapters can be added, but removing one requires uninstalling the pack first. Append mode takes the union of the recorded and requested skills and MCP servers, then fills that selection across every listed adapter. Overwrite applies the exact requested selection across every listed adapter. Catalog changes that move an installed skill ID to a different target, or reuse its target for another ID, fail closed instead of being auto-migrated; uninstall before adopting that changed identity. Uninstall removes only content whose recorded hash still matches; edited managed content is reported as a conflict and preserved.

## Reconcile ownership conflicts

Append mode blocks when a selected skill directory or MCP name already exists without AgentPack ownership. Use `reconcile` to migrate that boundary explicitly:

```bash
agentpack reconcile --agents codex,kimi --profile coding
```

Catalog-equivalent content is proposed as `ADOPT`: AgentPack leaves the target bytes unchanged, backs up the target, and records its source revision or semantic MCP hash. Divergent content requires one decision per component:

- `Keep unmanaged` preserves the existing content and excludes that component from AgentPack on every selected target.
- `Replace from catalog` backs up and replaces only conflicting targets while preserving unrelated skills and configuration.
- `Abort` leaves every target and the state unchanged.

Interactive reconciliation defaults to `Keep unmanaged`. For automation, repeat `--resolve` with explicit component decisions:

```bash
agentpack reconcile \
  --agents codex,kimi \
  --profile coding \
  --resolve skill:impeccable=replace \
  --resolve mcp:anysearch=replace \
  --yes
```

Reconciliation is append-only; it never turns a component collision into permission to overwrite an entire skills directory or MCP file. A `keep` decision is component-wide because schema v1 records one shared selection. If AgentPack already manages that MCP on another target, split ownership is rejected instead of creating state that cannot be updated reliably.

## Adapter paths

| Agent | Global instructions | Skills | MCP configuration |
|---|---|---|---|
| Codex | `$CODEX_HOME/AGENTS.md` or `~/.codex/AGENTS.md` | `$CODEX_HOME/skills` or `~/.codex/skills` | `$CODEX_HOME/config.toml` or `~/.codex/config.toml` |
| Kimi Code | `$KIMI_CODE_HOME/AGENTS.md` or `~/.kimi-code/AGENTS.md` | `$KIMI_CODE_HOME/skills` or `~/.kimi-code/skills` | `$KIMI_CODE_HOME/mcp.json` or `~/.kimi-code/mcp.json` |
| OpenCode | `$XDG_CONFIG_HOME/opencode/AGENTS.md` or `~/.config/opencode/AGENTS.md` | `$XDG_CONFIG_HOME/opencode/skills` or `~/.config/opencode/skills` | `$XDG_CONFIG_HOME/opencode/opencode.json` or `~/.config/opencode/opencode.json` |

Each adapter owns all of its installed content. A selected skill source is resolved once, then copied independently to every recorded adapter; MCP selection follows the same pack-wide rule. A normal plan or install neither creates nor installs into a shared user-agent directory, and vendor targets that lexically or physically resolve there are rejected. Codex TOML comments and unrelated keys, Kimi JSON keys, and OpenCode JSONC comments are preserved in append mode. OpenCode MCP entries use its official `mcp.<name>` layout.

The Kimi paths are first-class [`KIMI_CODE_HOME` resources](https://github.com/MoonshotAI/kimi-code/blob/9d2304c23ca30c781b1a39540971dcaef085a500/docs/en/configuration/data-locations.md). OpenCode documents its [global rules](https://opencode.ai/docs/rules) and [global skills](https://opencode.ai/docs/skills) beneath the XDG configuration home. Codex global instructions and MCP use [`CODEX_HOME`](https://developers.openai.com/codex/guides/agents-md), but the Codex 0.150.1 implementation labels `$CODEX_HOME/skills` as a [deprecated compatibility location](https://github.com/openai/codex/blob/90854393966b21e9ebfd21b122334eb09a20c93d/codex-rs/ext/skills/src/host_roots.rs); the current public [Codex Skills guide](https://developers.openai.com/codex/skills) recommends the cross-client user location instead. AgentPack deliberately uses this still-discovered compatibility location to satisfy strict vendor-directory isolation. A future Codex release may remove that discovery path, so Codex upgrades require a real skill-discovery check rather than assuming continued support.

State created by AgentPack 0.2.0 can record legacy shared targets. The next unchanged `agentpack update` recognizes only those exact state-owned paths, verifies their hashes, installs an independent copy for every recorded adapter, removes only the old AgentPack content, and preserves unrelated legacy files and directories. Reconfiguration is blocked until that one-time migration finishes; no legacy runtime fallback remains afterward. This compatibility boundary can be removed when 0.2.0 state is no longer supported.

`--home PATH` creates a fully isolated layout beneath that path and ignores `CODEX_HOME`, `KIMI_CODE_HOME`, and `XDG_CONFIG_HOME`. Without `--home`, absolute environment paths are used directly and relative values resolve from the current working directory, matching normal CLI path resolution. The isolated override is intended for tests, previews, and advanced controlled installs on Linux, macOS, and Windows.

## AnySearch

AgentPack configures AnySearch in anonymous mode, which the upstream server supports with lower rate limits. The package writes the endpoint and the non-secret `X-Anysearch-Client` header only; it does not request an email address, create an account, or persist an API key.

Enabling AnySearch permits an agent to send search queries and requested URLs to a third-party remote service. Review the [AnySearch project](https://github.com/anysearch-ai/anysearch-mcp-server) and its service terms before selecting it.

## agent-browser

The `agent-browser` catalog entry tracks `vercel-labs/agent-browser`'s `main` branch and installs its official `skills/agent-browser` discovery skill. The skill loads version-matched browser workflows from the separately installed CLI with `agent-browser skills get core`; AgentPack does not install or upgrade that executable or Chrome. Follow the [upstream installation guide](https://github.com/vercel-labs/agent-browser#installation) before using the skill.

## Plans, backups, and recovery

The mutation lifecycle is:

```text
load + validate → select → fetch + resolve sources → preview → verify targets + staged hashes → backup → apply → validate → record state
```

Before apply, AgentPack confirms that every previewed target still matches the version used to build the plan. If another process or the user changes a target, apply stops and asks for a fresh preview.

Every changed target is copied under `~/.agentpack/backups/<timestamp-id>/` before mutation. A failed apply restores those exact targets. Managed hashes and selection state live in `~/.agentpack/state.json`; `agentpack doctor` reports canonical lock drift or installed-content drift.

## Commands

| Command | Purpose |
|---|---|
| `list` | List profiles, categorized skills, and MCP servers |
| `plan` / `diff` | Render the proposed changes without writing |
| `install` | Preview and apply a new selection |
| `reconcile` | Adopt equivalent unmanaged components or explicitly keep/replace divergent collisions |
| `update` | Resolve the recorded skill selection online again, then install newer source heads and re-render adapters |
| `doctor` | Validate the canonical lock, state, and managed hashes |
| `uninstall` | Preview and remove hash-matching managed content |
| `native-build` | Materialize native Codex and Kimi plugin packages under `dist/native/` |

Run `agentpack --help` for every flag. Machine-readable plans and doctor output are available with `--json`.

## Native packages

Build native artifacts from the online source catalog:

```bash
npm run native:build
```

This creates:

- `dist/native/codex/agentpack/`, with `.codex-plugin/plugin.json`, skills, licenses, and `.mcp.json`;
- `dist/native/kimi/agentpack/`, with `kimi.plugin.json`, skills, licenses, and MCP declarations.

`native-build` performs the same online resolution at build time and records the resolved revisions in each generated plugin's `AGENTPACK_SOURCES.json`. Those directories are point-in-time build artifacts, not AgentPack's install source, and are intentionally excluded from the npm tarball. The online CLI is the normal installation path and the only path that resolves source heads for each invocation.

Kimi can install the generated local directory from its TUI with `/plugins install <absolute-path>` and then activate it with `/reload` or a new session. Codex native distribution uses its plugin marketplace/browser flow; the universal `agentpack` installer remains the direct local-install path and does not modify a personal marketplace.

OpenCode receives the same resolved catalog skills and configuration through the universal adapter, so AgentPack does not maintain a third duplicate plugin format.

## Development and source updates

```bash
npm run check
npm run native:build
npm pack --dry-run
```

Online source metadata lives in `skills/sources.yaml`; `agentpack.lock` protects AgentPack-owned instructions, local skills, catalogs, and source declarations, but deliberately does not pin moving upstream branches. Changing a repository, tracked ref, skill path, or expected license is a reviewed source-catalog change and requires `npm run lock`, the full check, an isolated online installation, and applicable upstream quality gates. Runtime plans and installation state—not the package lock—own resolved upstream commit SHAs.

## Release automation

CI runs the canonical lock check, behavior suite, and native distribution build on Node.js 22 across Ubuntu, macOS, and Windows for every branch push and pull request. The same workflow is reusable and gates every release.

Stable releases are tag-driven. After the package version and canonical manifest version are updated together and CI passes, push the matching `vMAJOR.MINOR.PATCH` tag. The release workflow:

1. repeats the complete three-platform CI matrix at the tagged commit;
2. rejects a tag that does not exactly match `package.json` or whose commit is not contained in `origin/main`;
3. builds and smoke-tests the installable npm tarball;
4. writes a SHA-256 checksum and a GitHub build-provenance attestation;
5. publishes that exact tarball as the public `@boman-ng/agentpack` npm package with npm provenance;
6. creates the GitHub Release from the existing tag with generated notes.

The release job uses Node.js 24 with npm's dependency cache disabled and publishes through npm provenance. Because npm trusted publishing cannot be configured until the package exists, the first npm release needs a short-lived read/write token with bypass 2FA enabled in the `NPM_TOKEN` Actions secret. After that bootstrap release, configure `release.yml` as the package's trusted GitHub Actions publisher and remove the token; the same workflow then uses OIDC without a long-lived credential. A rerun accepts an existing npm version only when its registry integrity matches the newly built tarball, and repairs same-named GitHub Release assets, so a partial release failure can be retried safely.

Native packages remain online-resolved build outputs rather than release assets; the universal CLI tarball remains the installable artifact and resolves configured skill branches at each plan, install, or update invocation.

See [SECURITY.md](SECURITY.md) for the security model and [THIRD_PARTY_LICENSES.md](THIRD_PARTY_LICENSES.md) for provenance and license boundaries.
