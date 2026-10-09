# Components and sources

Browse skills by the task they serve, then select a local skill or a complete suite. Categories are navigation, not installation selections. Each selectable item has one primary category; broader capabilities are described in its purpose rather than duplicating it across categories.

The two optional local suites contain five Dev skills and four Design skills. The nine optional upstream suites contain 28 skills in total. Selecting any suite includes every member listed below, with its complete resources; suite members are independently callable but are not separate installation choices. Instructions and MCP remain separate components.

The AgentPack commit identifies [the global instructions](instructions/AGENTS.md), the local skills, and [the MCP snippet](mcp/codex.toml). Upstream suites are fetched only when selected, at the full commits below. No bundled snapshots or separate content lock are required.

## Engineering Development and Maintenance

| Selection | Unit | Purpose |
|---|---|---|
| [Dev](skills/dev/SKILL.md) | Local suite | Coordinate development, maintenance, independent testing, and Git delivery around business rules, necessary architecture boundaries, and valuable verification |
| Archify | Suite | Create and validate interactive architecture, workflow, sequence, data-flow, and lifecycle diagrams as standalone HTML |

## Interface Design and Development

| Selection | Unit | Purpose |
|---|---|---|
| [Design](skills/design/SKILL.md) | Local suite | Clarify intent and terminology across domains; coordinate frontend design, implementation, and quality review through available specialist skills |
| Answer me with HTML | Suite | Render interactive explanation and clarification pages from Markdown with a bundled CLI |
| Impeccable | Suite | Interface design, implementation, accessibility, motion, and refinement |
| Emil | Suite | Design engineering and animation across web and native/mobile interfaces, including Expo and Swift |
| GSAP | Suite | GSAP animation, timelines, scroll interactions, plugins, framework integration, and performance |
| Motion | Suite | Motion and CSS animation guidance, with optional connected documentation and authoring tools |
| LottieFiles | Suite | Motion direction, emotional intent, timing, easing, and multi-element choreography across animation systems |

## Research and Academic Writing

| Selection | Unit | Purpose |
|---|---|---|
| ARS | Suite | Research, literature reviews, experiment planning, academic writing, and manuscript review |

## Browser and App Automation

| Selection | Unit | Purpose |
|---|---|---|
| Browser | Suite | Browser interaction, extraction, testing, and supported Electron app automation |

## Local Dev suite

This is the complete Dev membership at the selected AgentPack commit. Copy the five directories as siblings under the skill discovery root. Each is a real skill entrypoint; the `dev-` prefix does not provide inheritance or automatically load another skill.

| Skill | Directory | Responsibility |
|---|---|---|
| `dev` | [`skills/dev`](skills/dev/SKILL.md) | Route and coordinate work; own the shared engineering and verification references |
| `dev-build` | [`skills/dev-build`](skills/dev-build/SKILL.md) | Implement features and fixes through affected boundaries and delivery |
| `dev-clean` | [`skills/dev-clean`](skills/dev-clean/SKILL.md) | Simplify or retire existing work, including read-only maintenance audits |
| `dev-test` | [`skills/dev-test`](skills/dev-test/SKILL.md) | Author and evaluate behavior tests as a separate Tester agent |
| `dev-git` | [`skills/dev-git`](skills/dev-git/SKILL.md) | Manage Git Flow, rebase integration, classified atomic Conventional Commits, and remote-write authorization |

Entries load shared rules explicitly; Git delivery uses native Git through `dev-git`. Keep the suite complete so sibling references resolve. See [installation and migration](INSTALL.md) for selection changes.

## Local Design suite

This is the complete Design membership at the selected AgentPack commit. Copy the four directories as siblings under the skill discovery root. Each is an independent entrypoint; the `design-` prefix does not load shared rules or other members automatically. Planning is a mode of `design`, not an additional skill.

| Skill | Directory | Responsibility |
|---|---|---|
| `design` | [`skills/design`](skills/design/SKILL.md) | Coordinate design, planning, capability selection, and the shared quality contract |
| `design-intent` | [`skills/design-intent`](skills/design-intent/SKILL.md) | Clarify consequential ambiguity with the user and produce accurate professional language in any domain |
| `design-build` | [`skills/design-build`](skills/design-build/SKILL.md) | Deliver frontend work through specialist guidance, Dev implementation, and evidence-led quality iteration |
| `design-review` | [`skills/design-review`](skills/design-review/SKILL.md) | Review actual design evidence against the task, applicable principles, and quality references |

Keep members as siblings so shared resources resolve. Production source changes and new validation require the separately selected complete Dev suite. Without Dev, Design supports intent, planning, and read-only review.

Recommend the optional Answer me with HTML suite for clarification pages. Design discovers external skills by runtime name and path; its [integration guide](skills/design/references/integrations.md) owns provider use and [Design Intent](skills/design-intent/SKILL.md) owns questioning and fallback. Other specialist suites remain separate choices.

## Upstream revisions

Use these full commits, not branch heads. Archify is pinned to `v3.0.1` and Answer me with HTML to `v0.4.15`.

| Suite | Repository | Full commit | License |
|---|---|---|---|
| ARS | [Imbad0202/academic-research-skills-codex](https://github.com/Imbad0202/academic-research-skills-codex) | `3c37ef8ab480ba1e9370309c24b99977ad44091f` | CC BY-NC 4.0; non-commercial |
| Archify | [tt-a1i/archify](https://github.com/tt-a1i/archify) | `2ab3cae7ac2c2a55d7386ca789d03c4fcd31816c` | MIT; bundled font and brand marks retain their upstream terms and notices |
| Answer me with HTML | [QingYunA/answer-me-with-html](https://github.com/QingYunA/answer-me-with-html) | `0449a8961a6329360babe6a1cb20d0d6d3d04de5` | MIT; bundled dependencies retain their licenses and notices, including marked's historical Markdown terms |
| Impeccable | [pbakaus/impeccable](https://github.com/pbakaus/impeccable) | `9d715cc4f5564a990ca8345abfdd5df6dc9b41c8` | Apache-2.0 |
| Browser | [vercel-labs/agent-browser](https://github.com/vercel-labs/agent-browser) | `d01253d9db28d75080e36da3c1c31ef89454731e` | Apache-2.0 |
| Emil | [emilkowalski/skills](https://github.com/emilkowalski/skills) | `d16ebe60d09a5ba2afcb7054ede9d0a10c9f6128` | MIT |
| GSAP | [greensock/gsap-skills](https://github.com/greensock/gsap-skills) | `aed9cfd3277740755f6bfc1155c7aa645403b760` | MIT for the skills; the GSAP runtime has its own terms |
| Motion | [motiondivision/ai-kit](https://github.com/motiondivision/ai-kit) | `d1c5c26f424adfd47c112d894e9d424b57338c7e` | MIT declared by upstream; see the [declaration record](third_party/licenses/motion-ai-kit-LICENSE-DECLARATION.md) |
| LottieFiles | [LottieFiles/motion-design-skill](https://github.com/LottieFiles/motion-design-skill) | `f9a8a041b85185ee4881b3471d3415e939aac772` | MIT |

## Upstream suite contents

Paths are relative to each suite's repository at its recorded commit. Copy every listed member of a selected suite, including its references, scripts, metadata, hidden resources, and embedded notices. These are the published skill directories, not every file named SKILL.md in a repository: alternate-client/plugin copies, test fixtures, and tool-served workflows are not extra installable members.

| Suite | Skill | Directory |
|---|---|---|
| ARS | `academic-research-suite` | `skills/academic-research-suite` |
| Archify | `archify` | `archify` |
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

## Prerequisites and attribution

Install skill payloads unchanged with the attribution listed in [THIRD_PARTY_LICENSES.md](THIRD_PARTY_LICENSES.md). [INSTALL.md](INSTALL.md) owns preparation and copying rules. Selecting skills does not install runtimes, project libraries, services, or accounts.

| Suite | Runtime or access requirement |
|---|---|
| Dev | Native Git for repository work; no Git Flow extension |
| Answer me with HTML | Node.js >=20; bundled CLI, no `npm install` or rebuild. Copy the complete four-file skill directory. Design's [runtime integration](skills/design/references/integrations.md#answer-me-with-html) defines task-local invocation defaults and delivery. |
| Archify | Node.js >=18; bundled renderer, no `npm install`. `finalize` needs Chrome/Chromium (`ARCHIFY_CHROME` selects it); repository-evidence verification also needs Git. Copy complete `archify/`, not the upstream maintenance helper `.agents/skills/archify-review`. |
| Browser | Separate `agent-browser` executable and browser prerequisites; see [upstream installation](https://github.com/vercel-labs/agent-browser#installation). |
| GSAP / Motion | The project's actual animation runtime and version; skill installation does not add or migrate libraries. |
| Motion connected tools | Hosted MCP setup; some services require an account or Motion+. The `best-practices/` guidance is self-contained. See [official setup](https://motion.dev/docs/ai-kit-install). |
| LottieFiles | Guidance can be used without a Lottie renderer. |

Other suites may require a project toolchain or platform SDK. Report missing prerequisites separately.

Known behavior at the recorded revisions:

- Archify's `finalize` and `deliver` may read the [stable update manifest](https://tt-a1i.github.io/archify/skill-updates/archify/stable.json) and write reminder state. `ARCHIFY_UPDATE_CHECK_DISABLED=1` disables both. Updates still use this catalog's pin.
- Impeccable's `reference/degraded/asset-producer.md` contains an incorrect relative link to the component review guide. The target exists at `reference/component-review.md`; keep the upstream payload unchanged.

For source upgrades, review the new revision's complete published membership, paths, metadata, resources, and licensing, then update the pin and member list together.

## Optional MCP: AnySearch

[mcp/codex.toml](mcp/codex.toml) configures `https://api.anysearch.com/mcp` with the non-secret `X-Anysearch-Client` header. It uses anonymous access; it does not register an account or store an API key. Queries and requested URLs go to the external service, and availability and anonymous rate limits depend on that service.

The configuration's provenance is [anysearch-ai/anysearch-mcp-server](https://github.com/anysearch-ai/anysearch-mcp-server/tree/f4ca4d4941e4c122be6522c1afc76012f1669654), commit `f4ca4d4941e4c122be6522c1afc76012f1669654`, Apache-2.0. This identifies the configuration reference, not the remotely deployed service version. See [THIRD_PARTY_LICENSES.md](THIRD_PARTY_LICENSES.md) for preserved texts.
