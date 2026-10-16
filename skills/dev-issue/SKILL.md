---
name: dev-issue
description: Assess, draft, or submit bugs and improvements with lasting value to a specified project's issue tracker, only when the user requests issue work. Use findings from development; ordinary implementation does not trigger issue filing.
---

# Dev Issue

Read the [engineering contract](../dev/references/engineering-contract.md), [collaboration rules](../dev/references/collaboration.md), and [verification policy](../dev/references/verification-policy.md) for applicable scope, evidence, and role rules. This direct or delegated role keeps its issue assignment; it does not start a production workflow.

Use this skill only when the user asks to assess, draft, or submit issues. Work from development findings and the requested scope; do not start a broader audit or build a backlog merely because an improvement is conceivable. This workflow can run independently of development, testing, or Git delivery.

## Select Useful Findings

Record a concrete bug or an improvement with a credible lasting benefit. Bugs describe behavior that departs from a requirement, contract, or necessary guarantee. Improvements connect a current difficulty to reduced maintenance effort, resource waste, operating risk, or user burden. Naming, documentation, and structure can matter when they cause misunderstanding, misuse, or missed changes.

Explain the practical consequence and desired result. A preference for elegance, a principle's name, or hypothetical future expansion alone does not establish value. If the reason is unclear, explain what is missing or ask about the user's goal rather than inventing impact. Do not impose scores, quotas, numeric returns, or repeated incidents as eligibility rules.

Separate observations, suspected causes, and proposed solutions. Intermittent bugs can be useful reports; state what is known about recurrence. Use available examples and checks, without requiring a completed diagnosis, benchmark, test plan, or patch before reporting. A suggested optimization may change behavior or guarantees; mention known tradeoffs instead of presenting it as a proven fix.

Keep required in-scope repairs in the development task. Filing an issue does not complete a fix or discharge an unfinished delivery obligation.

## Establish The Destination

Use the user's specified project or a destination already established in the task. Inspect repository instructions, contribution guidance, and applicable issue templates to find its actual tracker and reporting channel. A checkout's `origin` may be a fork, and a project may use a central tracker elsewhere. Ask only when the destination remains ambiguous; never default to `boman-ng/skills`.

Search relevant open and closed issues, reading likely matches and their resolution; inspect related pull requests where useful. For the same unresolved concern, return its link and identify any new information. Similar symptoms alone do not establish duplication. A closed issue may be declined or superseded rather than fixed; explain new facts or a recurrence instead of reopening a rejected proposal under different wording. If search is unavailable, disclose that limitation without discarding the draft.

## Write For The Next Maintainer

Make each issue independently understandable and focused on one actionable concern. Prefer the target project's applicable template and language conventions; otherwise use the user's language and this outline, omitting irrelevant optional sections:

```markdown
## Context
The task or workload and affected component.

## Problem and impact
The observed behavior or current difficulty and its practical consequences.

## Expected outcome
The behavior or lasting improvement that would resolve the concern.

## Example or reproduction (optional)
Relevant steps, input/output, code, or existing measurements and their limits.

## Suggested change (optional)
A possible approach, known tradeoffs, or useful alternatives.
```

Use a specific title describing the problem or improvement. Include relevant versions, configuration, workaround, or source locations when they help the reader act; do not collect a complete environment or transcript by default. Describe observable improvement without inventing acceptance thresholds. Proposed implementation and final priority remain decisions for the project and user. Remove credentials and unnecessary private material before publication.

## Submit Within The Request

A request to assess or draft stops at the draft. A request to submit to an established destination authorizes that submission; carry forward applicable authorization without asking again. If publication authority is missing, finish the concrete draft before asking for it. Invoking the skill alone does not authorize remote writes, and permission to create an issue does not grant permission to edit, comment on, close, or reopen another issue.

Use the project's available hosting tools and explicitly name the destination on every write. For GitHub, an existing CLI can submit a prepared Markdown file:

```bash
gh issue create --repo <owner/repo> \
  --title "<specific title>" \
  --body-file "<prepared-body-file>"
```

Use supported structured arguments or a body file to preserve formatting. Apply labels or other metadata only when requested or required by the project; do not invent a taxonomy. No new tool installation, credential change, or service is needed for this skill.

Return the created issue URL. If access or tools prevent submission, return the ready title and body, the correct tracker link, and the actual blocker. If a write's outcome is uncertain, look for the resulting issue before retrying; do not retry blindly. Report drafts, existing issues, and newly submitted issues accurately.
