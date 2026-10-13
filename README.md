# Skills

**English** | [简体中文](docs/README.zh-CN.md)

Skills provides **shared instructions** and the **Dev** and **Design** skill suites for AI agents. This repository also lists optional external skills, MCP servers, and reading resources.

[Components](#included-components) · [Get started](#get-started) · [External catalog](#external-skills-and-mcp-servers) · [References](#reference-material)

<a id="included-components"></a>

## 📦 Included components

| Domain | Component | Description |
|---|---|---|
| General | [Global instructions](instructions/AGENTS.md) | Working principles for engineering decisions, communication, and task completion |
| Software engineering | [Dev suite](skills/dev/SKILL.md) | Develop features, fix bugs, maintain existing work, verify changes independently, manage Git delivery, and draft or submit project issues on request |
| Interface design | [Design suite](skills/design/SKILL.md) | Clarify requirements, plan and build interfaces, and review usability and visual quality |

- **UI implementation:** Select both Design and Dev. The [external catalog](#external-skills-and-mcp-servers) lists additional capabilities.
- **Optional clarification:** Answer me with HTML can help clarify requirements through interactive pages: answer on the page, then copy its Reply into chat.

<a id="get-started"></a>

## 🚀 Get started

### Install

Paste this request into an agent with Git and filesystem access:

```text
Install https://github.com/boman-ng/skills from its latest default-branch content.
Follow INSTALL.md for the agent tool I want to configure.
Help me choose instructions, complete skill suites, and optional MCP servers.
Show what will be replaced or removed. After I confirm the scope,
back up, install, and verify the selected components.
```

Follow the [installation guide](INSTALL.md) to install selected components at user scope through your agent's supported installation mechanisms. Source repositories use their latest default-branch content unless you request a specific version.

### Update

To update, ask your agent to update your selected components. Keep lasting customizations in your checkout or fork so they can be reapplied during updates.

<a id="external-skills-and-mcp-servers"></a>

## 🌐 External skills and MCP servers

These projects are installed separately. Choose by domain and follow each project's current installation instructions. Install complete skill suites with their required resources, licenses, and notices.

| Domain | Repository | Type | Description | License |
|---|---|---|---|---|
| Interface design | [pbakaus/impeccable](https://github.com/pbakaus/impeccable) | Skill suite | Interface design, implementation, accessibility, and refinement | Apache-2.0 |
| Interface design | [emilkowalski/skills](https://github.com/emilkowalski/skills) | Skill suite | Design engineering and animation for web and native interfaces | MIT |
| Animation | [greensock/gsap-skills](https://github.com/greensock/gsap-skills) | Skill suite | GSAP animation, timelines, scroll interactions, framework integration, and performance | MIT for skills; runtime terms are separate |
| Animation | [motiondivision/ai-kit](https://github.com/motiondivision/ai-kit) | Skill + MCP | Motion and CSS animation guidance, with the free Motion MCP; excludes `motion-plus` | MIT (as stated by the project) |
| Animation | [LottieFiles/motion-design-skill](https://github.com/LottieFiles/motion-design-skill) | Skill | Motion direction, timing, easing, and choreography across animation systems | MIT |
| Academic research | [Imbad0202/academic-research-skills](https://github.com/Imbad0202/academic-research-skills) | Skill suite | Academic Research Skills (ARS): literature searches and reviews, research planning, academic writing, and manuscript review | [CC BY-NC 4.0](https://github.com/Imbad0202/academic-research-skills/blob/main/LICENSE) |
| Diagrams and visualization | [tt-a1i/archify](https://github.com/tt-a1i/archify) | Skill | Interactive architecture, workflow, and data-flow diagrams in standalone HTML | MIT |
| Diagrams and visualization | [larashero3-dotcom/lieflat-charts](https://github.com/larashero3-dotcom/lieflat-charts) | Skill | Template-based HTML data visualizations and reports | [PolyForm Noncommercial 1.0.0](https://github.com/larashero3-dotcom/lieflat-charts/blob/main/LICENSE) |
| Diagrams and visualization | [QingYunA/answer-me-with-html](https://github.com/QingYunA/answer-me-with-html) | Skill suite | Interactive explanation and clarification pages with replies copied back to chat | MIT |
| Browser automation | [vercel-labs/agent-browser](https://github.com/vercel-labs/agent-browser) | Skill | Browser interaction, content extraction, testing, and supported Electron app automation | Apache-2.0 |
| Web search | [anysearch-ai/anysearch-mcp-server](https://github.com/anysearch-ai/anysearch-mcp-server) | MCP | Web search through MCP | Apache-2.0 |

<a id="reference-material"></a>

## 📚 Reference material

These resources are for reading and reference; they are not installed as skills.

| Repository | Description | License |
|---|---|---|
| [ByteByteGoHq/system-design-101](https://github.com/ByteByteGoHq/system-design-101) | System Design 101: visual explanations of system architecture, databases, distributed systems, and engineering tradeoffs | [CC BY-NC-ND 4.0](https://github.com/ByteByteGoHq/system-design-101/blob/main/LICENSE.md) |
| [mattpocock/skills](https://github.com/mattpocock/skills/tree/49dd158d1076134a641b33efb035946536778336) | This reference snapshot informed Skills' guidance on module design, domain language, incremental feedback, decision dependencies, and instruction organization | [MIT](https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/LICENSE) |

<a id="feedback"></a>

## 💬 Feedback

- **Skills:** To report a problem or suggest an improvement, follow [ISSUE.md](ISSUE.md). It works without installing Skills.
- **Other projects:** For issues found while developing another project, ask for [dev-issue](skills/dev-issue/SKILL.md) and identify the target project.

<a id="license"></a>

## 📜 License

Original material in this repository is licensed under [MIT](LICENSE). External projects retain their own licenses and notices.
