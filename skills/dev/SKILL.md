---
name: dev
description: Coordinate development, maintenance, verification, and Git delivery through the Dev suite. Use for work that spans these concerns or needs routing; dev-build, dev-clean, dev-test, and dev-git are independently callable for a settled scope.
---

# Dev

Read the [engineering contract](references/engineering-contract.md) and [verification policy](references/verification-policy.md). Select and read only the modes needed for the requested outcome:

| Scope | Entry point |
|---|---|
| Implement or fix production behavior | [dev-build](../dev-build/SKILL.md) |
| Simplify, consolidate, retire, or audit existing work | [dev-clean](../dev-clean/SKILL.md) |
| Independently author validation or assess acceptance | [dev-test](../dev-test/SKILL.md) |
| Manage branches, atomic commits, and Git delivery | [dev-git](../dev-git/SKILL.md) |

For mixed work, keep one acceptance scope and coordinate production and validation ownership under the shared policy. Use existing requirements and task context; create handoff artifacts only when they resolve a real coordination need. Simple work need not pass through every mode.

Use the shared [engineering dimensions and user alignment](references/engineering-contract.md#engineering-dimensions-and-user-alignment) to recognize affected concerns and tradeoffs across modes. Bring unresolved consequential choices to the user before dependent implementation, and carry agreed decisions across agents and stages.

For work spanning iterations, use current project decisions and unfinished migration obligations to coordinate coherent increments, dependencies, and ownership. Revisit affected dimensions as requirements, implementation findings, or user feedback change the tradeoffs. At handoff, distinguish completed work from remaining obligations and the actual delivery state, including material consequences for later work. The shared contract governs evolution and retirement across modes.
