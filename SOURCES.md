# Components and sources

Browse skills by the task they serve, then select a local skill or a complete third-party suite. Categories are navigation, not installation selections. Each selectable item has one primary category; broader capabilities are described in its purpose rather than duplicating it across categories.

`cleanup` and `ui-translate` are independent local selections. The seven optional upstream suites contain 26 skills in total. Selecting a suite includes every member listed below, with its complete resources; individual upstream skills are not separate installation choices. Instructions and MCP remain separate components.

The AgentPack commit identifies [the global instructions](instructions/AGENTS.md), the local skills, and [the MCP snippet](mcp/codex.toml). Upstream suites are fetched only when selected, at the full commits below. No bundled snapshots or separate content lock are required.

## Engineering Maintenance

| Selection | Unit | Purpose |
|---|---|---|
| [`cleanup`](skills/cleanup/SKILL.md) | Local skill | Simplify existing code and agent instructions; inspect and remove unnecessary complexity |

## Interface Design and Development

| Selection | Unit | Purpose |
|---|---|---|
| [`ui-translate`](skills/ui-translate/SKILL.md) | Local skill | Translate rough UI and motion ideas into frontend concepts and usable developer descriptions |
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

## Upstream revisions

Use these full commits, not current branch heads. The suite membership, paths, and license records were checked on 2026-09-27. Existing source pins are unchanged; GSAP, Motion, and LottieFiles are newly recorded.

| Suite | Repository | Full commit | License |
|---|---|---|---|
| ARS | [Imbad0202/academic-research-skills-codex](https://github.com/Imbad0202/academic-research-skills-codex) | `3c37ef8ab480ba1e9370309c24b99977ad44091f` | CC BY-NC 4.0; non-commercial |
| Impeccable | [pbakaus/impeccable](https://github.com/pbakaus/impeccable) | `9d715cc4f5564a990ca8345abfdd5df6dc9b41c8` | Apache-2.0 |
| Browser | [vercel-labs/agent-browser](https://github.com/vercel-labs/agent-browser) | `d01253d9db28d75080e36da3c1c31ef89454731e` | Apache-2.0 |
| Emil | [emilkowalski/skills](https://github.com/emilkowalski/skills) | `d16ebe60d09a5ba2afcb7054ede9d0a10c9f6128` | MIT |
| GSAP | [greensock/gsap-skills](https://github.com/greensock/gsap-skills) | `aed9cfd3277740755f6bfc1155c7aa645403b760` | MIT for the skills; the GSAP runtime has its own terms |
| Motion | [motiondivision/ai-kit](https://github.com/motiondivision/ai-kit) | `d1c5c26f424adfd47c112d894e9d424b57338c7e` | MIT declared by upstream; see the [declaration record](third_party/licenses/motion-ai-kit-LICENSE-DECLARATION.md) |
| LottieFiles | [LottieFiles/motion-design-skill](https://github.com/LottieFiles/motion-design-skill) | `f9a8a041b85185ee4881b3471d3415e939aac772` | MIT |

## Suite contents

Paths are relative to each suite's repository at its recorded commit. Copy every listed member of a selected suite, including its references, scripts, metadata, hidden resources, and embedded notices. These are the published skill directories, not every file named SKILL.md in a repository: alternate-client/plugin copies, test fixtures, and tool-served workflows are not extra installable members.

| Suite | Skill | Directory |
|---|---|---|
| ARS | `academic-research-suite` | `skills/academic-research-suite` |
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

- Copy upstream content unchanged and preserve its invocation metadata, licenses, and notices. Keep each selected repository's root `LICENSE`; Impeccable also requires `NOTICE.md`. Motion has no standalone license file at its recorded commit: use the linked declaration record instead, retaining its explicit limitation and source evidence. [INSTALL.md](INSTALL.md) places these records under each installed skill's `provenance/` directory.
- ARS includes its own resources and additional license texts under the skill directory. Its non-commercial terms are not replaced by AgentPack's MIT license.
- At the retained Impeccable revision, `reference/degraded/asset-producer.md` has an incorrect relative link to the component review guide. The target is present at `reference/component-review.md` within the skill. This is an upstream reference defect, not a missing file in the copied suite; the payload remains unchanged.
- The Browser skill loads workflows from the separately installed `agent-browser` executable. Verify that executable and its browser prerequisites if the user wants a working browser workflow. Follow the [upstream installation instructions](https://github.com/vercel-labs/agent-browser#installation); selecting this suite does not install the executable or Chrome.
- GSAP and Motion skills do not install animation libraries into a project. Use the project's actual runtime and version; selecting a suite is not a request to migrate the project or add dependencies.
- Motion's `best-practices/` guidance is self-contained. Documentation search and the other connected tools require Motion's hosted MCP services; some require an account or Motion+. Tool availability and access tiers are governed by the service, not by the copied skill. See the [official setup documentation](https://motion.dev/docs/ai-kit-install). AgentPack does not run `motion-ai`, configure these servers, or authenticate an account as part of skill installation.
- LottieFiles supplies opinionated motion-design guidance, including layered motion and timing rules. Selecting it preserves those upstream instructions; it does not override explicit user requirements or applicable project instructions. It does not require installing a Lottie renderer merely to read the guidance.
- Other suites may need the project's toolchain, browser, or platform SDK. Report missing prerequisites separately; installing skills does not authorize unrelated runtime setup.
- To upgrade a source, inspect the proposed revision, reconcile its complete published suite membership, verify paths, metadata, resources, and licensing, then update the pin and member list together. Preserve a reviewable commit so another machine can restore the selection. Do not silently omit members or follow a branch head.

See [third-party attribution](THIRD_PARTY_LICENSES.md) for preserved license texts and the Motion declaration record.

## Optional MCP: AnySearch

[mcp/codex.toml](mcp/codex.toml) configures `https://api.anysearch.com/mcp` with the non-secret `X-Anysearch-Client` header. It uses anonymous access; it does not register an account or store an API key. Queries and requested URLs go to the external service, and availability and anonymous rate limits depend on that service.

The configuration's provenance is [anysearch-ai/anysearch-mcp-server](https://github.com/anysearch-ai/anysearch-mcp-server/tree/f4ca4d4941e4c122be6522c1afc76012f1669654), commit `f4ca4d4941e4c122be6522c1afc76012f1669654`, Apache-2.0. This identifies the configuration reference, not the remotely deployed service version. See [THIRD_PARTY_LICENSES.md](THIRD_PARTY_LICENSES.md) for preserved texts.
