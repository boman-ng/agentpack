# AgentPack

[English](README.md) | [简体中文](docs/README.zh-CN.md)

AgentPack is a reusable collection of instructions, skills, reference material, and optional tool connections for AI agents. It gives your agent consistent workflows for clarifying requirements, developing software, designing interfaces, and reviewing results.

## What you can do

| Component | Use it to |
|---|---|
| [Global instructions](instructions/AGENTS.md) | Guide engineering decisions, communication, and task completion with shared working principles |
| [Dev suite](skills/dev/SKILL.md) | Develop features, fix bugs, simplify existing work, separate development from testing, and manage branches and commits |
| [Design suite](skills/design/SKILL.md) | Turn rough ideas into clear requirements, shape and build interfaces, and review usability and visual quality |
| [Upstream skills](#upstream-skills) | Add specialist skills for interface design, animation, research, diagrams, and browser automation |
| [AnySearch MCP](https://github.com/anysearch-ai/anysearch-mcp-server) | Give your agent an optional connection to web search |

For interface implementation, select both Design and Dev. Add the optional **Answer me with HTML** suite for interactive clarification pages: answer on the page, then copy its Reply into chat.

## Get started

Paste this request into an agent with Git and filesystem access:

```text
Install https://github.com/boman-ng/agentpack from its latest default-branch content.
Follow INSTALL.md for the agent tool I want to configure.
Help me choose instructions, complete skill suites, and optional MCP connections.
Show what will be replaced or removed. After I confirm the scope,
back up, install, and verify the selected components.
```

Installation applies to your user-level setup. Choose components from the [installation matrix](INSTALL.md). Upstream suites use their latest default-branch content unless you request a specific version.

To update, ask your agent to update your selected components. Keep lasting customizations in your checkout or fork so they can be reapplied during updates.

## Referenced repositories

### Upstream skills

Each row is an optional suite. Select the capabilities you need and install the complete suite using its current upstream instructions.

| Repository | Use it for | License |
|---|---|---|
| [ARS — Imbad0202/academic-research-skills-codex](https://github.com/Imbad0202/academic-research-skills-codex) | Research, literature reviews, experiments, academic writing, and manuscript review | CC BY-NC 4.0 |
| [Archify — tt-a1i/archify](https://github.com/tt-a1i/archify) | Interactive architecture, workflow, and data-flow diagrams in standalone HTML | MIT |
| [Lieflat Charts — larashero3-dotcom/lieflat-charts](https://github.com/larashero3-dotcom/lieflat-charts) | Template-based HTML data visualizations and reports | [PolyForm Noncommercial 1.0.0](https://github.com/larashero3-dotcom/lieflat-charts/blob/main/LICENSE) |
| [Answer me with HTML — QingYunA/answer-me-with-html](https://github.com/QingYunA/answer-me-with-html) | Interactive explanation and clarification pages with replies copied back to chat | MIT |
| [Impeccable — pbakaus/impeccable](https://github.com/pbakaus/impeccable) | Interface design, implementation, accessibility, and refinement | Apache-2.0 |
| [Browser — vercel-labs/agent-browser](https://github.com/vercel-labs/agent-browser) | Browser interaction, extraction, testing, and supported Electron app automation | Apache-2.0 |
| [Emil — emilkowalski/skills](https://github.com/emilkowalski/skills) | Design engineering and animation for web and native interfaces | MIT |
| [GSAP — greensock/gsap-skills](https://github.com/greensock/gsap-skills) | Animation, timelines, scroll interactions, framework integration, and performance | MIT for skills; runtime terms are separate |
| [Motion — motiondivision/ai-kit](https://github.com/motiondivision/ai-kit) | Motion and CSS animation guidance, with the free Motion MCP | MIT, declared by upstream |
| [LottieFiles — LottieFiles/motion-design-skill](https://github.com/LottieFiles/motion-design-skill) | Motion direction, timing, easing, and choreography across animation systems | MIT |

### Tool connections

| Repository | Use it for | License |
|---|---|---|
| [AnySearch — anysearch-ai/anysearch-mcp-server](https://github.com/anysearch-ai/anysearch-mcp-server) | Optional web search through MCP; follow upstream setup | Apache-2.0 |

### Reference material

These resources are for reading and reference; they are not installed as skills.

| Repository | Use it for | License |
|---|---|---|
| [System Design 101 — ByteByteGoHq/system-design-101](https://github.com/ByteByteGoHq/system-design-101) | Visual explanations of system architecture, databases, distributed systems, and engineering tradeoffs | [CC BY-NC-ND 4.0](https://github.com/ByteByteGoHq/system-design-101/blob/main/LICENSE.md) |

## License

AgentPack's original material is licensed under [MIT](LICENSE). Referenced repositories retain their own licenses and notices.
