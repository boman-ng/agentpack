---
name: dev-build
description: Implement features, fixes, and migrations across affected production boundaries. Use for production behavior changes; direct invocation keeps Dev exploration, independent testing, and review gates, while delegated workers implement their assigned scope.
---

# Dev Build

Read the [engineering contract](../dev/references/engineering-contract.md), [collaboration rules](../dev/references/collaboration.md), and [verification policy](../dev/references/verification-policy.md). Direct invocation arranges the applicable Dev workflow; a delegated implementer fulfills its assignment without restarting the router.

## Establish The Model

Start from the required outcome, actual production path, data shape, rule owners, callers, invariants, and unfinished migration obligations. Use [dev-how](../dev-how/SKILL.md) for unknown mechanisms and [dev-why](../dev-why/SKILL.md) when changing boundaries or protections with unclear rationale.

Apply the shared design-exploration trigger before implementation. A settled design needs an implementation arena when important alternatives remain, such as competing algorithms, concurrency, or error handling. A worker discovering such a choice returns it to the main agent with evidence rather than silently inventing another architecture or recursively coordinating candidates.

## Implement A Complete Increment

The main agent delegates nontrivial production work with explicit scope and ownership. Implement the chosen model, including necessary callers, wiring, configuration, packaging, and retirement of superseded paths. Keep each increment a coherent capability or verifiable migration step. Correct the owner of a rule instead of scattering special cases through callers.

Use [dev-clean](../dev-clean/SKILL.md) for removal decisions. Preserve migration, data, and out-of-scope consumer obligations; temporary paths need an exit condition and owner. Planned reversible work-in-progress breakage is acceptable, but final atomic commits must be complete and verifiable.

When implementation exposes a systematic mismatch with the design, send the evidence and affected assumptions to the main agent. Reconsider the model before accumulating patches. Routine recoverable details within the agreed design remain autonomous; unresolved consequential user choices hold only their dependent work.

## Return An Inspectable Result

Run relevant existing checks and gather observation-only diagnostics. For nontrivial work, the separate Tester owns formal tests, assertions, fixtures, and pass conditions, including temporary correctness checks. Supply the changed production path and reproducible observations without prescribing the Tester's expected answers.

Keep production fixes in this role; return test problems to the Tester and engineering choices to the main agent and Reviewer. Return actual changes, source/worktree identity, observed checks, remaining obligations, and material limits. The main agent completes independent testing, review, and authorized Git delivery; an implementation result alone does not establish acceptance.
