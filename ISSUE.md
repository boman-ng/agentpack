# Report an issue with Skills

Use this guide to report problems or improvements in this repository's instructions, skills, documentation, installation, and integrations. Anyone can use it without installing Skills or cloning this repository. Read it [on GitHub](https://github.com/boman-ng/skills/blob/master/ISSUE.md) or as [plain text](https://raw.githubusercontent.com/boman-ng/skills/master/ISSUE.md).

## Describe The Issue

Give the issue a specific title and keep it about one independently actionable concern. Explain the task, what happened or needs improvement, and the outcome you want. You can report a documentation problem without having used or installed the affected component.

For unexpected agent behavior, distinguish your request, the agent's actions, and your expectations. Include relevant instruction excerpts and their sources when they explain the difference. Say whether the behavior happened once or was reproduced; the agent's explanation is a clue, not proof of the cause. If ownership between Skills, an external skill, and the host is unclear, describe what you know.

Use this outline in your preferred language; omit optional sections that add nothing:

```markdown
## Context and component
What were you trying to do? Which skill, instruction, document, or integration is involved?

## Problem or suggestion
What happened, or what is difficult? What is the practical impact?

## Expected outcome
What should happen, or what would improve the experience?

## Relevant example (optional)
Brief steps, a request and response excerpt, conflicting instructions, or an error.
Include the host, loading/installation method, known version, or recurrence only where relevant.

## Suggested change (optional)
An idea worth considering, with any known tradeoff or uncertainty.
```

Provide the information you have. A root-cause diagnosis, proposed fix, version hash, complete environment, or repeated experiment is not required. Share only relevant, redacted excerpts; exclude credentials and private project or conversation content that is unnecessary to understand the issue.

## Submit To Skills

Search [existing issues](https://github.com/boman-ng/skills/issues) for the same concern, including closed issues and their resolution. Similar symptoms can have different causes. For an existing unresolved issue, return its link and any useful new information rather than creating a duplicate. Explain what differs when reporting a recurrence or related concern. If search is unavailable, say that duplicates were not checked.

Submit to **`boman-ng/skills`**, regardless of the repository where the problem was discovered. An agent should carry forward the user's authorization to submit; a request for a draft or simply reading this guide does not authorize publication. Supplementing an existing issue requires authorization for that action too.

Use an available GitHub connector, API, or browser, or use GitHub CLI if already available:

```bash
gh issue create --repo boman-ng/skills \
  --title "<specific title>" \
  --body-file "<prepared-body-file>"
```

You can also paste the title and Markdown into [New issue](https://github.com/boman-ng/skills/issues/new). No Skills installation or particular command-line tool is needed. If an agent cannot submit with its available access, it should return the complete draft and this link. After submission, return the issue URL; if the result is uncertain, check whether it was created before trying again.
