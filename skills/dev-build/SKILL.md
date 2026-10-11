---
name: dev-build
description: Implement or fix production behavior through verified delivery. Use for development across business, storage, service, or runtime boundaries and settled local changes; use dev-clean for maintenance and dev-test for independent validation authorship.
---

# Dev Build

Read the shared [engineering contract](../dev/references/engineering-contract.md) and [verification policy](../dev/references/verification-policy.md), including when invoked directly.

## Understand The Change

Establish acceptance from the task and project contracts. Trace the affected use cases, rule owners, callers, invariants, and production path. Read relevant current decisions and unfinished migration obligations before choosing the implementation.

Use the shared [engineering dimensions and user alignment](../dev/references/engineering-contract.md#engineering-dimensions-and-user-alignment) to identify affected concerns and important unknowns. Investigate project facts, then align unresolved consequential design choices with the user; reuse settled decisions without turning the dimensions into a questionnaire.

## Implement A Complete Increment

Choose a coherent business capability or migration step with a verifiable result. Implement the simplest complete behavior under the shared architecture and evolution rules: correct the owning model or contract, update affected callers and integration points, and preserve the required invariants.

When implementation reveals facts that change an agreed tradeoff, explain their impact and real alternatives to the user before the dependent change. Apply the response to the affected design and acceptance while continuing independent authorized work.

Include retirement of superseded in-scope paths in the change. Use [dev-clean](../dev-clean/SKILL.md) for removal decisions and associated artifacts, and for other maintenance included in the requested scope. When a transition must continue across increments, establish its exit conditions and remaining ownership under the shared contract.

## Verify And Deliver

Run relevant existing checks and observe the affected path. When new or semantically changed validation is needed, read [dev-test](../dev-test/SKILL.md) and arrange its independent Tester under the shared policy.

Resolve production defects in the Developer role and complete authorized packaging, migration, recovery, and delivery work. Feed back the actual outcome, material tradeoffs, and remaining implications for the affected dimensions. Apply the shared completion rule.
