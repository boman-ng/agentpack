---
name: dev
description: Coordinate development, maintenance, verification, and Git delivery through the Dev suite. Use for work that spans these concerns or needs routing; modes are independently callable for settled scope, and dev-issue handles explicitly requested issue work.
---

# Dev

Read the [engineering contract](references/engineering-contract.md) and [verification policy](references/verification-policy.md). Select and read only the modes needed for the requested outcome:

| Scope | Entry point |
|---|---|
| Implement or fix production behavior | [dev-build](../dev-build/SKILL.md) |
| Simplify, consolidate, retire, or audit existing work | [dev-clean](../dev-clean/SKILL.md) |
| Independently author validation or assess acceptance | [dev-test](../dev-test/SKILL.md) |
| Manage branches, atomic commits, and Git delivery | [dev-git](../dev-git/SKILL.md) |
| Assess, draft, or submit project issues when the user requests it | [dev-issue](../dev-issue/SKILL.md) |

For mixed work, keep one acceptance scope and coordinate production and validation ownership under the shared policy. Use existing requirements and task context; create handoff artifacts only when they resolve a real coordination need. Simple work need not pass through every mode.

Read `dev-issue` only for a user request to work on issues. Ordinary development does not automatically collect or file findings, and missing `dev-issue` does not block unrelated work. An issue does not replace a required in-scope fix.

Use the shared [engineering dimensions and user alignment](references/engineering-contract.md#engineering-dimensions-and-user-alignment) to recognize affected concerns and tradeoffs across modes. Bring unresolved consequential choices to the user before dependent implementation, and carry agreed decisions across agents and stages.

For work spanning iterations, use current project decisions and unfinished migration obligations to coordinate coherent increments, dependencies, and ownership. Distinguish unresolved decisions from work ready to implement. When session or collaborator handoffs would otherwise lose dependencies, keep a compact view in existing task context or project artifacts: the outcome, unresolved choices, actual blockers, next unblocked work, ownership, and links to settled rationale. Keep decision details in one authoritative place and dependent work provisional until its assumptions are settled. This does not authorize tracker writes or require a new document.

Revisit affected dimensions and dependencies as requirements, implementation findings, or user feedback change the tradeoffs. At handoff, distinguish completed work from remaining obligations and the actual delivery state, including material consequences for later work. The shared contract governs evolution and retirement across modes.
