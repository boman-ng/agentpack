# Install AgentPack

Use this guide when the user requests installation, update, or recovery. Repository maintenance alone does not request installation. Use available Git, filesystem, and host tools; AgentPack has no installer. This guide covers user-level configuration.

## Discover the target host

Read [README.md](README.md), the [suite manifest](#suite-manifest), and the previous installation record, if present. Establish the target agent CLI from the request and environment; the executing agent is not necessarily the installation target. Ask if the target is ambiguous.

Inspect the target's installed version, effective configuration, local help, and current official documentation. Establish its user instruction entrypoint and precedence, skill discovery locations and invocation, MCP configuration format and scope, and available validation/reload mechanisms. Account for environment overrides and resolve paths according to that host's rules. Show absolute targets; do not infer support from a familiar directory name or another client's layout.

If a target or capability cannot be established, pause that component and continue independent preparation. Do not guess a path, install a runtime or bridge, or change project/administrator configuration to manufacture support. If only explicit reading of skill files is available, explain that limitation and agree on a user-owned location; do not describe it as automatic skill discovery.

## Agree on the selection

Ask only about unsettled choices:

- **Instructions:** replace global instructions or skip. Recommend replacement.
- **Skills:** replace the agreed user skill collection with selected complete suites, clear it with an explicitly empty selection, or skip. Use the [README](README.md#upstream-skills) to explain the available suites, then expand each choice using the [manifest](#suite-manifest). Recommend Dev for engineering, Design for design or intent clarification, and the optional Answer me with HTML suite alongside Design.
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

1. Obtain the requested AgentPack revision, defaulting to `master`, and record its full commit. Preserve existing checkout changes. Fetch selected upstream suites at the exact commits in the [manifest](#upstream-revisions); an unavailable pin is a preparation failure, not a reason to use a branch head. Do not execute upstream setup scripts to obtain skill files.
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

## Suite manifest

Select complete suites; members remain independently callable. Instructions and MCP are separate choices. Local content follows the selected AgentPack commit; upstream skills are fetched only when selected. License summaries are in the [README](README.md#referenced-repositories), and required attribution is in [THIRD_PARTY_LICENSES.md](THIRD_PARTY_LICENSES.md). README reference material is not an installation choice.

### Local suites

Copy every member of a selected suite, with its complete resources, as sibling directories under the discovered skill root. Each member is a real entrypoint that explicitly loads shared resources.

| Suite | Skill | Directory |
|---|---|---|
| Dev | `dev` | [`skills/dev`](skills/dev/SKILL.md) |
| Dev | `dev-build` | [`skills/dev-build`](skills/dev-build/SKILL.md) |
| Dev | `dev-clean` | [`skills/dev-clean`](skills/dev-clean/SKILL.md) |
| Dev | `dev-test` | [`skills/dev-test`](skills/dev-test/SKILL.md) |
| Dev | `dev-git` | [`skills/dev-git`](skills/dev-git/SKILL.md) |
| Design | `design` | [`skills/design`](skills/design/SKILL.md) |
| Design | `design-intent` | [`skills/design-intent`](skills/design-intent/SKILL.md) |
| Design | `design-build` | [`skills/design-build`](skills/design-build/SKILL.md) |
| Design | `design-review` | [`skills/design-review`](skills/design-review/SKILL.md) |

### Upstream revisions

Fetch these full commits, not branch heads. Archify is pinned to `v3.0.1` and Answer me with HTML to `v0.4.15`. When upgrading a source, review its published membership, paths, resources, metadata, and licenses; update the pin and member list together.

| Suite | Repository | Full commit |
|---|---|---|
| ARS | [Imbad0202/academic-research-skills-codex](https://github.com/Imbad0202/academic-research-skills-codex) | `3c37ef8ab480ba1e9370309c24b99977ad44091f` |
| Archify | [tt-a1i/archify](https://github.com/tt-a1i/archify) | `2ab3cae7ac2c2a55d7386ca789d03c4fcd31816c` |
| Lieflat Charts | [larashero3-dotcom/lieflat-charts](https://github.com/larashero3-dotcom/lieflat-charts) | `eace082a317b696c5570c25826a53a7fa113e984` |
| Answer me with HTML | [QingYunA/answer-me-with-html](https://github.com/QingYunA/answer-me-with-html) | `0449a8961a6329360babe6a1cb20d0d6d3d04de5` |
| Impeccable | [pbakaus/impeccable](https://github.com/pbakaus/impeccable) | `9d715cc4f5564a990ca8345abfdd5df6dc9b41c8` |
| Browser | [vercel-labs/agent-browser](https://github.com/vercel-labs/agent-browser) | `d01253d9db28d75080e36da3c1c31ef89454731e` |
| Emil | [emilkowalski/skills](https://github.com/emilkowalski/skills) | `d16ebe60d09a5ba2afcb7054ede9d0a10c9f6128` |
| GSAP | [greensock/gsap-skills](https://github.com/greensock/gsap-skills) | `aed9cfd3277740755f6bfc1155c7aa645403b760` |
| Motion | [motiondivision/ai-kit](https://github.com/motiondivision/ai-kit) | `d1c5c26f424adfd47c112d894e9d424b57338c7e` |
| LottieFiles | [LottieFiles/motion-design-skill](https://github.com/LottieFiles/motion-design-skill) | `f9a8a041b85185ee4881b3471d3415e939aac772` |

### Upstream members

Paths are relative to the corresponding repository at its pinned commit. Copy complete listed directories, including hidden resources and embedded notices. Alternate-client/plugin copies, test fixtures, and tool-served workflows are not additional members.

Lieflat Charts uses the repository root (`.`). Copy all tracked files into the installed `lieflat-charts/` directory, including its templates, catalogs, tokens, scripts, examples, preview assets, and metadata; exclude `.git`.

| Suite | Skill | Directory |
|---|---|---|
| ARS | `academic-research-suite` | `skills/academic-research-suite` |
| Archify | `archify` | `archify` |
| Lieflat Charts | `lieflat-charts` | `.` |
| Answer me with HTML | `answer-me-with-html` | `skills/answer-me-with-html` |
| Impeccable | `impeccable` | `.agents/skills/impeccable` |
| Browser | `agent-browser` | `skills/agent-browser` |
| Emil | `animate` | `skills/animate` |
| Emil | `animate-expo` | `skills/animate-expo` |
| Emil | `animation-vocabulary` | `skills/animation-vocabulary` |
| Emil | `apple-design` | `skills/apple-design` |
| Emil | `ask-sonner` | `skills/ask-sonner` |
| Emil | `emil-design-eng` | `skills/emil-design-eng` |
| Emil | `find-animation-opportunities` | `skills/find-animation-opportunities` |
| Emil | `improve-animations` | `skills/improve-animations` |
| Emil | `mobile-native` | `skills/mobile-native` |
| Emil | `pick-ui-library` | `skills/pick-ui-library` |
| Emil | `prototype` | `skills/prototype` |
| Emil | `review-animations` | `skills/review-animations` |
| Emil | `write-swift` | `skills/write-swift` |
| GSAP | `gsap-core` | `skills/gsap-core` |
| GSAP | `gsap-frameworks` | `skills/gsap-frameworks` |
| GSAP | `gsap-performance` | `skills/gsap-performance` |
| GSAP | `gsap-plugins` | `skills/gsap-plugins` |
| GSAP | `gsap-react` | `skills/gsap-react` |
| GSAP | `gsap-scrolltrigger` | `skills/gsap-scrolltrigger` |
| GSAP | `gsap-timeline` | `skills/gsap-timeline` |
| GSAP | `gsap-utils` | `skills/gsap-utils` |
| Motion | `motion` | `plugins/motion/skills/motion` |
| LottieFiles | `motion-design` | `skills/motion-design` |

### Runtime requirements

Suite selection does not install runtimes, libraries, services, or accounts. Preserve upstream metadata and check its required capabilities on the target host.

| Suite | Runtime or access requirement |
|---|---|
| Dev | Native Git for repository work; no Git Flow extension |
| ARS | The pinned source is the ARS-Codex adapter. Check its host-specific tool and workflow requirements on other hosts; copying its skill does not establish runtime compatibility. |
| Answer me with HTML | Node.js >=20; bundled CLI, no `npm install` or rebuild. Copy the complete four-file skill directory. Design's [runtime integration](skills/design/references/integrations.md#answer-me-with-html) defines task-local invocation defaults and delivery. |
| Archify | Node.js >=18; bundled renderer, no `npm install`. `finalize` needs Chrome/Chromium (`ARCHIFY_CHROME` selects it); repository-evidence verification also needs Git. Copy complete `archify/`, not the upstream maintenance helper `.agents/skills/archify-review`. |
| Lieflat Charts | HTML needs no build. SVG charts can run offline; Chart.js, ECharts, online fonts, and GeoJSON need network access unless inlined. Node.js runs the bundled static checks; the optional browser smoke script additionally expects global Playwright and Chromium. Skill selection does not install them. |
| Browser | Separate `agent-browser` executable and browser prerequisites; see [upstream installation](https://github.com/vercel-labs/agent-browser#installation). |
| GSAP / Motion | The project's actual animation runtime and version; skill installation does not add or migrate libraries. |
| Motion connected tools | Hosted MCP setup; some services require an account or Motion+. The `best-practices/` guidance is self-contained. See [official setup](https://motion.dev/docs/ai-kit-install). |
| LottieFiles | Guidance can be used without a Lottie renderer. |

Archify's `finalize` and `deliver` may read its [stable update manifest](https://tt-a1i.github.io/archify/skill-updates/archify/stable.json) and write reminder state; `ARCHIFY_UPDATE_CHECK_DISABLED=1` disables both. Updates still use the pinned revision above.

Impeccable's `reference/degraded/asset-producer.md` has an incorrect relative link to its component review guide. The target is `reference/component-review.md`; preserve the upstream payload unchanged.
