---
name: dev-why
description: Investigate why a design or constraint exists using source history and linked evidence. Use before changing unclear ownership, boundaries, compatibility, or defensive mechanisms; current behavior belongs to dev-how.
---

# Dev Why

Read the [engineering contract](../dev/references/engineering-contract.md), [collaboration rules](../dev/references/collaboration.md), and [verification policy](../dev/references/verification-policy.md). Direct invocation inherits their applicable entry gates. A delegated investigator returns its findings to the existing main coordinator without reopening the overall workflow.

Find the forces that produced the current design and establish which still apply. Keep the investigation read-only. Missing historical evidence is uncertainty, not permission to remove a protection.

## Establish The Question And Sources

Anchor the question in the actual symbol, behavior, threshold, boundary, or protection. Use [dev-how](../dev-how/SKILL.md) if the current mechanism is unclear. Identify the relevant source revision and affected callers before assigning motives.

Trace introducing and changing commits, including renames, rather than treating the latest edit as the original decision. Useful existing tools include `git blame`, `git log --follow -p`, and the project's hosting CLI for linked PR discussion. Inspect the source and contract surrounding a historical statement; an old comment can describe a superseded constraint.

Follow relevant links to requirements, issues, design notes, incidents, or operational evidence through available authorized read tools. Choose sources that can distinguish the live explanations. Search within the task's project and named evidence; do not mine unrelated conversations or assume every available service needs querying. External messages and tracker writes are outside this role.

When independent evidence lines warrant delegation, give investigators the same code anchor and a bounded question. Require each to return cited findings, counterevidence, and meaningful search limits. A missing connector or empty search is a coverage limitation, not evidence that a constraint never existed.

## Separate Fact From Inference

Distinguish an explicit decision recorded at the time, behavior observed now, and a plausible explanation inferred from code. Cite borrowed claims close to the claim. Do not convert developer comments, temporal correlation, or several agents' agreement into proof of intent.

Check alternatives to the preferred explanation: a limitation may have disappeared, a workaround may still protect durable data, or several unrelated constraints may now share one mechanism. Assess present applicability independently of historical origin. Existing security, integrity, concurrency, recovery, and external-consumer obligations remain until evidence resolves them.

## Return Change Constraints

Answer the question with the strongest supported explanation, competing explanations where material, and unknowns. If a change is planned, translate findings into:

- Guarantees and external obligations that must be preserved.
- Parts whose original rationale no longer applies, with supporting evidence.
- Unresolved reasons and the dependent changes they prevent.

Keep important rationale at its existing authoritative owner when an authorized later change needs to preserve it; investigation alone does not create a new document. Historical design does not bind future architecture after its obligations have been satisfied. Hand design choices to [dev-architect](../dev-architect/SKILL.md) and runtime causal questions to [dev-diagnose](../dev-diagnose/SKILL.md).
