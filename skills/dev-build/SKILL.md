---
name: dev-build
description: Implement or fix production behavior through verified delivery. Use for development across business, storage, service, or runtime boundaries and settled local changes; use dev-clean for maintenance and dev-test for independent validation authorship.
---

# Dev Build

Read the shared [engineering contract](../dev/references/engineering-contract.md) and [verification policy](../dev/references/verification-policy.md), including when invoked directly.

## Development

Establish acceptance from the task and project contracts. Identify affected use cases, rule owners, invariants, and the production path. Implement the simplest complete behavior across callers and integration points under the shared architecture rules.

Use [dev-clean](../dev-clean/SKILL.md) for maintenance included in the requested scope. Run relevant existing checks and observe the affected path. When new or semantically changed validation is needed, read [dev-test](../dev-test/SKILL.md) and arrange its independent Tester under the shared policy.

Resolve production defects in the Developer role and complete authorized packaging, migration, recovery, and delivery work. Apply the shared completion rule.
