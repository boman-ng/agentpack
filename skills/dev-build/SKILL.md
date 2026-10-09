---
name: dev-build
description: Implement or fix production behavior through verified delivery. Use for development across business, storage, service, or runtime boundaries and settled local changes; use dev-clean for maintenance and dev-test for independent validation authorship.
---

# Dev Build

Complete the requested production behavior and delivery within authorization. Use the depth warranted by uncertainty and affected boundaries; simple functions or modules can be sufficient.

## Required Context

Even when invoked directly, read the shared [engineering contract](../dev/references/engineering-contract.md) and [verification policy](../dev/references/verification-policy.md). Confirm the sibling `dev`, `dev-build`, `dev-clean`, and `dev-test` entry points are available. Report an incomplete Dev suite and missing paths if required resources are absent; do not silently replace them.

## Development

Establish acceptance from the original task and project contracts. Identify the affected use cases, rule owners, invariants, and production path. Choose purposeful boundaries and the simplest complete implementation under the engineering contract.

Implement production changes, affected callers, and integration points. Keep unrelated maintenance outside the task. If justified cleanup is part of the requested scope, explicitly read [dev-clean](../dev-clean/SKILL.md) for that work.

Run suitable existing checks and observe the affected path. If acceptance needs new or semantically changed validation, explicitly read [dev-test](../dev-test/SKILL.md) and arrange a distinct compatible Tester under the verification policy. The Developer does not author that validation, including temporary correctness scripts. Give the Tester original requirements, contracts, environment, and scope rather than a Developer-authored oracle or full implementation transcript.

Resolve production defects in the Developer role; the Tester owns validation changes. Complete authorized packaging, migration, recovery, and operational work where relevant, then report acceptance evidence, affected-boundary limits, and any remaining delivery step. Do not claim unperformed deployment or runtime observation.
