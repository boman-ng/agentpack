# Components and sources

Browse skills by the task they serve, then select a local skill or a complete suite. Categories are navigation, not installation selections. Each selectable item has one primary category; broader capabilities are described in its purpose rather than duplicating it across categories.

The two optional local suites, Dev and Design, each contain four skills. The nine optional upstream suites contain 28 skills in total. Selecting any suite includes every member listed below, with its complete resources; suite members are independently callable but are not separate installation choices. Instructions and MCP remain separate components.

The AgentPack commit identifies [the global instructions](instructions/AGENTS.md), the local skills, and [the MCP snippet](mcp/codex.toml). Upstream suites are fetched only when selected, at the full commits below. No bundled snapshots or separate content lock are required.

## Engineering Development and Maintenance

| Selection | Unit | Purpose |
|---|---|---|
| [Dev](skills/dev/SKILL.md) | Local suite | Coordinate development, maintenance, and independent testing around business rules, necessary architecture boundaries, and valuable verification |
| Archify | Suite | Create and validate interactive architecture, workflow, sequence, data-flow, and lifecycle diagrams as standalone HTML |

## Interface Design and Development

| Selection | Unit | Purpose |
|---|---|---|
| [Design](skills/design/SKILL.md) | Local suite | Clarify intent and terminology across domains; coordinate frontend design, implementation, and quality review through available specialist skills |
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
| Agent-Reach | Suite | Search and read web pages, social platforms, videos, repositories, and RSS through platform tools and services |

## Local Dev suite

This is the complete Dev membership at the selected AgentPack commit. Copy the four directories as siblings under the skill discovery root. Each is a real skill entrypoint; the `dev-` prefix does not provide inheritance or automatically load another skill.

| Skill | Directory | Responsibility |
|---|---|---|
| `dev` | [`skills/dev`](skills/dev/SKILL.md) | Route and coordinate work; own the shared engineering and verification references |
| `dev-build` | [`skills/dev-build`](skills/dev-build/SKILL.md) | Implement features and fixes through affected boundaries and delivery |
| `dev-clean` | [`skills/dev-clean`](skills/dev-clean/SKILL.md) | Simplify or retire existing work, including read-only maintenance audits |
| `dev-test` | [`skills/dev-test`](skills/dev-test/SKILL.md) | Author and evaluate behavior tests as a separate Tester agent |

Each entry explicitly loads the shared rules in `dev/references/`; routing loads only the relevant mode. These relative references require the complete suite. A missing member or required resource makes the selection incomplete; do not install a partial suite or duplicate shared rules into each entry. The [installation guide](INSTALL.md) permits these references only within the staged Dev suite.

`dev-clean` replaces the former `cleanup` skill without an alias. An older standalone `cleanup` or `dev` selection is migration context, not authorization to add the suite automatically. Review the expanded selection and retired names before installing.

## Local Design suite

This is the complete Design membership at the selected AgentPack commit. Copy the four directories as siblings under the skill discovery root. Each is an independent entrypoint; the `design-` prefix does not load shared rules or other members automatically. Planning is a mode of `design`, not an additional skill.

| Skill | Directory | Responsibility |
|---|---|---|
| `design` | [`skills/design`](skills/design/SKILL.md) | Coordinate design, planning, capability selection, and the shared quality contract |
| `design-intent` | [`skills/design-intent`](skills/design-intent/SKILL.md) | Clarify consequential ambiguity with the user and produce accurate professional language in any domain |
| `design-build` | [`skills/design-build`](skills/design-build/SKILL.md) | Deliver frontend work through specialist guidance, Dev implementation, and evidence-led quality iteration |
| `design-review` | [`skills/design-review`](skills/design-review/SKILL.md) | Review actual design evidence against the task, applicable principles, and quality references |

Members explicitly load the relevant shared resources in `design/references/`; terminology-only work does not require the frontend quality workflow. The [installation guide](INSTALL.md) permits ordinary relative resource references within the complete staged Design suite. Missing members or required resources make the selection incomplete.

All production source changes through Design, including CSS, components, and interaction code, require the complete Dev suite. Dev owns engineering and independent test authorship; Design does not duplicate those policies. If Dev is unavailable, pause production implementation and new validation while continuing intent, planning, read-only review, and existing evidence investigation. Recommend selecting Dev alongside Design for implementation, but never add it automatically.

Impeccable, Emil, and relevant motion or browser suites remain separate choices. Design discovers available skills by their runtime names and paths, reuses relevant guidance, and preserves explicit-invocation restrictions and side-effect boundaries. A missing provider does not authorize installation or a claim that its workflow ran. Project capabilities can satisfy a task when no specific provider is required. Installing Design does not install libraries, browsers, services, hooks, or accounts.

`design-intent` replaces `ui-translate` without an alias. An older `ui-translate` selection does not authorize the complete Design suite, Dev, or upstream suites. Review the added and removed names before migration; terminology requests may finish in `design-intent`, including requests unrelated to frontend design.

## Upstream revisions

Use these full commits, not current branch heads. Suite membership, paths, and license records were checked on 2026-09-27 for the original seven suites, on 2026-09-30 for Archify, and on 2026-10-09 for Agent-Reach. Archify is pinned to the `v3.0.1` release; existing source pins are unchanged.

| Suite | Repository | Full commit | License |
|---|---|---|---|
| ARS | [Imbad0202/academic-research-skills-codex](https://github.com/Imbad0202/academic-research-skills-codex) | `3c37ef8ab480ba1e9370309c24b99977ad44091f` | CC BY-NC 4.0; non-commercial |
| Archify | [tt-a1i/archify](https://github.com/tt-a1i/archify) | `2ab3cae7ac2c2a55d7386ca789d03c4fcd31816c` | MIT; bundled font and brand marks retain their upstream terms and notices |
| Impeccable | [pbakaus/impeccable](https://github.com/pbakaus/impeccable) | `9d715cc4f5564a990ca8345abfdd5df6dc9b41c8` | Apache-2.0 |
| Browser | [vercel-labs/agent-browser](https://github.com/vercel-labs/agent-browser) | `d01253d9db28d75080e36da3c1c31ef89454731e` | Apache-2.0 |
| Agent-Reach | [Panniantong/Agent-Reach](https://github.com/Panniantong/Agent-Reach) | `94f06c1969dfc1834001269d79d3ad0972d9dee6` | MIT |
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
| Impeccable | `impeccable` | `.agents/skills/impeccable` |
| Browser | `agent-browser` | `skills/agent-browser` |
| Agent-Reach | `agent-reach` | `agent_reach/skill` |
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

- Copy upstream content unchanged and preserve its invocation metadata, licenses, and notices. Keep each selected repository's root `LICENSE`; Impeccable also requires `NOTICE.md`, and Archify requires `THIRD_PARTY_NOTICES.md`. Motion has no standalone license file at its recorded commit: use the linked declaration record instead, retaining its explicit limitation and source evidence. [INSTALL.md](INSTALL.md) places these records under each installed skill's `provenance/` directory.
- ARS includes its own resources and additional license texts under the skill directory. Its non-commercial terms are not replaced by AgentPack's MIT license.
- Copy Archify's complete `archify/` source directory, including its bundled CLI, renderers, schemas, examples, assets, and notices. The upstream `.agents/skills/archify-review` directory is a repository-maintenance helper, not a member of the published diagramming package. Rendering and validation require Node.js >=18; no `npm install` is needed for normal skill use. The normal `finalize` workflow also requires Chrome or Chromium for its browser gate; `ARCHIFY_CHROME` can select the executable. Repository-evidence verification also needs Git. Selecting this suite does not install these tools.
- Archify's `finalize` and `deliver` commands may contact its [stable update manifest](https://tt-a1i.github.io/archify/skill-updates/archify/stable.json) and write local reminder state. The check only reports available releases; it does not install updates. Set `ARCHIFY_UPDATE_CHECK_DISABLED=1` to disable that check and its state writes. Keep updates pinned through this catalog. Preserve the bundled `assets/JetBrainsMono-OFL.txt` and brand-mark provenance under the upstream notices; Archify's MIT grant does not replace those terms.
- At the retained Impeccable revision, `reference/degraded/asset-producer.md` has an incorrect relative link to the component review guide. The target is present at `reference/component-review.md` within the skill. This is an upstream reference defect, not a missing file in the copied suite; the payload remains unchanged.
- The Browser skill loads workflows from the separately installed `agent-browser` executable. Verify that executable and its browser prerequisites if the user wants a working browser workflow. Follow the [upstream installation instructions](https://github.com/vercel-labs/agent-browser#installation); selecting this suite does not install the executable or Chrome.
- Copy Agent-Reach's complete `agent_reach/skill/` directory, including `SKILL_en.md` and all seven `references/` guides; keep the published `SKILL.md` unchanged. Its CLI requires Python >=3.10; workflows also need platform tools such as `mcporter`, `gh`, `yt-dlp`, or OpenCLI, and some need a browser session, cookies, proxy, or API key. Exa search and Jina Reader send queries or requested URLs to external services. Selecting the suite copies guidance only; it does not install these tools, configure services, or import credentials. For separately requested runtime setup, review the [installation guide at the recorded commit](https://github.com/Panniantong/Agent-Reach/blob/94f06c1969dfc1834001269d79d3ad0972d9dee6/docs/install.md).
- Agent-Reach's skill uses broad search and URL triggers and asks for a network update check after substantial research. Preserve that guidance subject to explicit user requirements and applicable instructions. Its setup and skill-registration commands can replace skills in multiple clients' directories; do not run them to obtain this suite. Its live `main` installation/update links do not override AgentPack's recorded pin; review catalog changes before updating the installed skill.
- GSAP and Motion skills do not install animation libraries into a project. Use the project's actual runtime and version; selecting a suite is not a request to migrate the project or add dependencies.
- Motion's `best-practices/` guidance is self-contained. Documentation search and the other connected tools require Motion's hosted MCP services; some require an account or Motion+. Tool availability and access tiers are governed by the service, not by the copied skill. See the [official setup documentation](https://motion.dev/docs/ai-kit-install). AgentPack does not run `motion-ai`, configure these servers, or authenticate an account as part of skill installation.
- LottieFiles supplies opinionated motion-design guidance, including layered motion and timing rules. Selecting it preserves those upstream instructions; it does not override explicit user requirements or applicable project instructions. It does not require installing a Lottie renderer merely to read the guidance.
- Other suites may need the project's toolchain, browser, or platform SDK. Report missing prerequisites separately; installing skills does not authorize unrelated runtime setup.
- To upgrade a source, inspect the proposed revision, reconcile its complete published suite membership, verify paths, metadata, resources, and licensing, then update the pin and member list together. Preserve a reviewable commit so another machine can restore the selection. Do not silently omit members or follow a branch head.

See [third-party attribution](THIRD_PARTY_LICENSES.md) for preserved license texts and the Motion declaration record.

## Optional MCP: AnySearch

[mcp/codex.toml](mcp/codex.toml) configures `https://api.anysearch.com/mcp` with the non-secret `X-Anysearch-Client` header. It uses anonymous access; it does not register an account or store an API key. Queries and requested URLs go to the external service, and availability and anonymous rate limits depend on that service.

The configuration's provenance is [anysearch-ai/anysearch-mcp-server](https://github.com/anysearch-ai/anysearch-mcp-server/tree/f4ca4d4941e4c122be6522c1afc76012f1669654), commit `f4ca4d4941e4c122be6522c1afc76012f1669654`, Apache-2.0. This identifies the configuration reference, not the remotely deployed service version. See [THIRD_PARTY_LICENSES.md](THIRD_PARTY_LICENSES.md) for preserved texts.
