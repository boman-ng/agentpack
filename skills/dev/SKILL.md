---
name: dev
description: Coordinate development, maintenance, and verification through the Dev suite. Use for work that spans these concerns or needs routing; dev-build, dev-clean, and dev-test are independently callable for a settled scope.
---

# Dev

Deliver the requested outcome by selecting the relevant Dev suite mode. Keep coordination light: use existing requirements and evidence, and introduce planning or handoff artifacts only when they resolve a real decision.

## Load And Route

Read [engineering contract](references/engineering-contract.md) and [verification policy](references/verification-policy.md) before substantive work.

The complete local suite contains sibling folders `dev`, `dev-build`, `dev-clean`, and `dev-test`. Confirm their `SKILL.md` files and the two common references are available. If a required resource is missing, report an incomplete Dev suite and the missing path; do not silently substitute unrelated guidance or claim the suite workflow is fulfilled.

Choose by the requested outcome, then explicitly read the selected entry point before using its workflow:

| Scope | Entry point |
|---|---|
| Implement or fix production behavior and complete authorized delivery | [dev-build](../dev-build/SKILL.md) |
| Simplify, consolidate, or retire existing work; read-only maintenance audit | [dev-clean](../dev-clean/SKILL.md) |
| Independently author validation, assess acceptance, or investigate test evidence | [dev-test](../dev-test/SKILL.md) |

For mixed work, preserve one acceptance contract and coordinate the relevant modes. Reading a mode does not create an independent agent: apply the verification policy's Developer/Tester ownership rules whenever new or changed validation is needed. Do not make simple work pass through all modes.

Track the requested scope, the owning agent for production and validation, and any unresolved requirement. Finish when the acceptance and affected-boundary evidence satisfy the common completion rules; report verified outcomes and material limits.
