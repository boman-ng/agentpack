# Install AgentPack

By default, install or update from each repository's latest default-branch content. Use a specific version when the user requests one.

Install selected components in the target agent's supported user-level locations. Confirm replacements and back up affected files; preserve unselected content and settings. Install complete skill suites with their resources, licenses, and notices. Follow current upstream documentation for skill directories and runtime dependencies.

| Component / suite | Source | Install / entrypoint |
|---|---|---|
| Global instructions | [AgentPack](instructions/AGENTS.md) | The target agent's user instruction entrypoint |
| Dev | [AgentPack](skills/dev/SKILL.md) | `dev`, `dev-build`, `dev-clean`, `dev-test`, `dev-git` as sibling directories |
| Design | [AgentPack](skills/design/SKILL.md) | `design`, `design-intent`, `design-build`, `design-review` as sibling directories; add Dev for implementation |
| ARS | [Imbad0202/academic-research-skills-codex](https://github.com/Imbad0202/academic-research-skills-codex) | `academic-research-suite` |
| Archify | [tt-a1i/archify](https://github.com/tt-a1i/archify) | `archify` |
| Lieflat Charts | [larashero3-dotcom/lieflat-charts](https://github.com/larashero3-dotcom/lieflat-charts) | `lieflat-charts` with its complete repository resources |
| Answer me with HTML | [QingYunA/answer-me-with-html](https://github.com/QingYunA/answer-me-with-html) | `answer-me-with-html`; recommended alongside Design |
| Impeccable | [pbakaus/impeccable](https://github.com/pbakaus/impeccable) | `impeccable` |
| Browser | [vercel-labs/agent-browser](https://github.com/vercel-labs/agent-browser) | `agent-browser` |
| Emil | [emilkowalski/skills](https://github.com/emilkowalski/skills) | All published skills in the suite |
| GSAP | [greensock/gsap-skills](https://github.com/greensock/gsap-skills) | All published GSAP skills |
| Motion | [motiondivision/ai-kit](https://github.com/motiondivision/ai-kit) | `motion` skill and free Motion MCP only; exclude `motion-plus` |
| LottieFiles | [LottieFiles/motion-design-skill](https://github.com/LottieFiles/motion-design-skill) | `motion-design` |
| AnySearch MCP | [anysearch-ai/anysearch-mcp-server](https://github.com/anysearch-ai/anysearch-mcp-server) | Follow upstream setup for the target agent's MCP support |
