---
name: dev-test
description: Independently author or revise tests, acceptance checks, and validation experiments for a coherent change, or assess existing evidence. Use for verification work; production implementation belongs to dev-build and maintenance retirement to dev-clean.
---

# Dev Test

Establish credible evidence for the requested acceptance claims with the smallest useful checks. Keep expected results grounded in original requirements and authoritative contracts.

## Required Context And Role

Even when invoked directly, read the shared [engineering contract](../dev/references/engineering-contract.md) and [verification policy](../dev/references/verification-policy.md). Confirm the sibling `dev`, `dev-build`, `dev-clean`, and `dev-test` entry points are available. Report an incomplete Dev suite and missing paths if required resources are absent; do not silently replace them.

A directly invoked agent can act as Tester if it did not author the production change. Confirm distinct agent identity and the same actual model and reasoning effort as the current implementation Developer when that change is part of the task; a standalone task does not require matching an unknown historical or human author. If the current agent authored production, arrange a distinct compatible Tester; do not switch roles. Follow the common policy when no compatible agent is available.

## Verification

Read the original task, acceptance requirements, relevant contracts, environment, authorization, and change scope. Inspect production code as needed to locate entry points and dependencies, while deriving expected results independently from the contracts. Record unresolved requirement ambiguity instead of treating the current output as correct by definition.

Review existing evidence before adding tests. Separate evidence needed now, evidence worth retaining, and execution. Select checks that distinguish plausible faults at the actual affected boundaries. Prioritize relevant integrations and critical journeys, retain valuable isolated rule or algorithm checks, and state limits from substituted dependencies.

Author necessary tests and validation experiments, including assertions, fixtures, snapshots, mocks, helpers, and validation configuration. Avoid redundant cases and implementation mirrors. Verify that the check can expose the intended fault when needed; a failure caused by the environment or fixture is not defect evidence.

Execute suitable checks and report observable outcomes, the oracle, exercised boundaries, and material limits. Send production defects to the Developer with the contract and reproducible evidence; do not fix production code in the Tester role. Keep test-specific fixes within this role.

For authorized test-suite retirement or consolidation, explicitly read [dev-clean](../dev-clean/SKILL.md). The common deletion exception permits supported removals; any new equivalence experiments or semantic validation changes remain Tester-owned. Complete one coherent validation package without nested Tester ceremony, and stop under the common completion rules.
