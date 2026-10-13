# Install Skills

By default, install or update from each repository's latest default-branch content. Use a specific version when the user requests one.

Install selected components at user scope through the target agent's supported plugin, skill, or MCP installation mechanism. Confirm replacements and back up affected files; preserve unselected content and settings. Install complete skill suites with their required resources, licenses, and notices. Follow each project's current documentation for supported installation methods and runtime dependencies.

## Included components

| Domain | Component | Files | Installation |
|---|---|---|---|
| General | Global instructions | [AGENTS.md](instructions/AGENTS.md) | The user-level instruction file supported by the target agent |
| Software engineering | Dev | [Dev suite](skills/dev/SKILL.md) | `dev`, `dev-build`, `dev-clean`, `dev-test`, `dev-git`, `dev-issue` as sibling directories; issue work is user-requested |
| Interface design | Design | [Design suite](skills/design/SKILL.md) | `design`, `design-intent`, `design-build`, `design-review` as sibling directories; add Dev for implementation |

## External skills and MCP servers

| Domain | Repository | Installation |
|---|---|---|
| Interface design | [pbakaus/impeccable](https://github.com/pbakaus/impeccable) | Complete Impeccable skill suite, following the project's installation instructions for the target agent |
| Interface design | [emilkowalski/skills](https://github.com/emilkowalski/skills) | All published skills in the suite |
| Animation | [greensock/gsap-skills](https://github.com/greensock/gsap-skills) | All published GSAP skills |
| Animation | [motiondivision/ai-kit](https://github.com/motiondivision/ai-kit) | `motion` skill and free Motion MCP only; exclude `motion-plus` |
| Animation | [LottieFiles/motion-design-skill](https://github.com/LottieFiles/motion-design-skill) | `motion-design` |
| Academic research | [Imbad0202/academic-research-skills](https://github.com/Imbad0202/academic-research-skills) | Academic Research Skills (ARS); use the installation method for the target agent described below |
| Diagrams and visualization | [tt-a1i/archify](https://github.com/tt-a1i/archify) | `archify` |
| Diagrams and visualization | [larashero3-dotcom/lieflat-charts](https://github.com/larashero3-dotcom/lieflat-charts) | `lieflat-charts` with its complete repository resources |
| Diagrams and visualization | [QingYunA/answer-me-with-html](https://github.com/QingYunA/answer-me-with-html) | Complete Answer me with HTML suite; recommended alongside Design |
| Browser automation | [vercel-labs/agent-browser](https://github.com/vercel-labs/agent-browser) | `agent-browser` and the runtime resources required by the project's setup instructions |
| Web search | [anysearch-ai/anysearch-mcp-server](https://github.com/anysearch-ai/anysearch-mcp-server) | Follow the project's setup instructions for the target agent's MCP support |

### Academic Research Skills

For Claude Code, use the main repository's recommended plugin installation. The plugin includes the declared skills and their shared resources, scripts, agents, and hooks. Copying the skill directories alone does not install all plugin features.

Follow the project's [setup guide](https://github.com/Imbad0202/academic-research-skills/blob/main/docs/SETUP.md) and [control availability by installation method](https://github.com/Imbad0202/academic-research-skills/blob/main/docs/CONTROL_AVAILABILITY.md) for other agents and installation methods. Codex has a separate distribution documented by that project; do not substitute it for the selected source without confirming the target agent and installation choice.
