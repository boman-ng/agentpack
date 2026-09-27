# Components and sources

Select skills by name. `cleanup` and `ui-translate` are local; the other fifteen skills are fetched only when selected. Use the full commits below, not the current branch heads. These pins were resolved and their listed paths and license files checked on 2026-09-26.

The AgentPack commit identifies [the global instructions](instructions/AGENTS.md), the local skills [cleanup](skills/cleanup/SKILL.md) and [ui-translate](skills/ui-translate/SKILL.md), and [the MCP snippet](mcp/codex.toml). No separate content lock or bundled upstream snapshot is required.

## Upstream revisions

| Source | Repository | Full commit | License |
|---|---|---|---|
| ARS | [Imbad0202/academic-research-skills-codex](https://github.com/Imbad0202/academic-research-skills-codex) | `3c37ef8ab480ba1e9370309c24b99977ad44091f` | CC BY-NC 4.0; non-commercial |
| Impeccable | [pbakaus/impeccable](https://github.com/pbakaus/impeccable) | `9d715cc4f5564a990ca8345abfdd5df6dc9b41c8` | Apache-2.0 |
| Browser | [vercel-labs/agent-browser](https://github.com/vercel-labs/agent-browser) | `d01253d9db28d75080e36da3c1c31ef89454731e` | Apache-2.0 |
| Emil | [emilkowalski/skills](https://github.com/emilkowalski/skills) | `d16ebe60d09a5ba2afcb7054ede9d0a10c9f6128` | MIT |

## Skill selection

Paths below are relative to the corresponding repository at its recorded commit. Copy each complete skill directory, not just SKILL.md.

| Skill | Source | Path | Use |
|---|---|---|---|
| `cleanup` | This AgentPack commit | `skills/cleanup` | Code and instruction maintenance |
| `ui-translate` | This AgentPack commit | `skills/ui-translate` | UI and motion intent, terminology, and developer descriptions |
| `academic-research-suite` | ARS | `skills/academic-research-suite` | Research and academic writing |
| `impeccable` | Impeccable | `.agents/skills/impeccable` | Frontend design and improvement |
| `agent-browser` | Browser | `skills/agent-browser` | Browser automation |
| `animate` | Emil | `skills/animate` | Interface animation |
| `animate-expo` | Emil | `skills/animate-expo` | Expo animation |
| `animation-vocabulary` | Emil | `skills/animation-vocabulary` | Quick lookup of motion-effect names |
| `apple-design` | Emil | `skills/apple-design` | Apple platform design |
| `ask-sonner` | Emil | `skills/ask-sonner` | Sonner guidance |
| `emil-design-eng` | Emil | `skills/emil-design-eng` | Design engineering |
| `find-animation-opportunities` | Emil | `skills/find-animation-opportunities` | Identify useful motion |
| `improve-animations` | Emil | `skills/improve-animations` | Refine existing motion |
| `pick-ui-library` | Emil | `skills/pick-ui-library` | UI library selection |
| `prototype` | Emil | `skills/prototype` | Interface prototyping |
| `review-animations` | Emil | `skills/review-animations` | Animation review |
| `write-swift` | Emil | `skills/write-swift` | Swift implementation |

## Prerequisites and attribution

- Keep upstream content unchanged and retain embedded licenses and notices. Also retain each selected repository's root `LICENSE`; Impeccable additionally has `NOTICE.md`. [INSTALL.md](INSTALL.md) describes how to keep these with the installed skill.
- ARS includes its own resources and additional license texts under the skill directory. Its non-commercial terms are not replaced by AgentPack's MIT license.
- The browser skill loads workflows from the separately installed `agent-browser` executable. Verify that executable and its browser prerequisites if the user wants a working browser workflow. Follow the [upstream installation instructions](https://github.com/vercel-labs/agent-browser#installation); this collection does not install the executable or Chrome implicitly.
- Other skills may need the project's own toolchain, a browser, or a platform SDK. Read the selected skill's prerequisites and report missing tools; do not install unrelated runtimes automatically.
- To upgrade a source, inspect the proposed upstream revision, verify every listed path and its metadata and licenses, then replace the pin in this file. Commit the change so another machine can restore it.

## Optional MCP: AnySearch

[mcp/codex.toml](mcp/codex.toml) configures `https://api.anysearch.com/mcp` with the non-secret `X-Anysearch-Client` header. It uses anonymous access; it does not register an account or store an API key. Queries and requested URLs go to the external service, and availability and anonymous rate limits depend on that service.

The configuration's provenance is [anysearch-ai/anysearch-mcp-server](https://github.com/anysearch-ai/anysearch-mcp-server/tree/f4ca4d4941e4c122be6522c1afc76012f1669654), commit `f4ca4d4941e4c122be6522c1afc76012f1669654`, Apache-2.0. This identifies the configuration reference, not the remotely deployed service version. See [THIRD_PARTY_LICENSES.md](THIRD_PARTY_LICENSES.md) for preserved texts.
