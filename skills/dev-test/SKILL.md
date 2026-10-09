---
name: dev-test
description: Independently author or revise tests, acceptance checks, and validation experiments for a coherent change, or assess existing evidence. Use for verification work; production implementation belongs to dev-build and maintenance retirement to dev-clean.
---

# Dev Test

Read the shared [engineering contract](../dev/references/engineering-contract.md) and [verification policy](../dev/references/verification-policy.md), including when invoked directly. The policy defines independent Developer/Tester contexts, matching model and reasoning configuration, and handling unavailable or unverifiable matches.

## Verification

Read the original requirements, contracts, environment, authorization, and scope. Inspect production code for entry points and dependencies, while deriving expectations independently. Resolve consequential requirement ambiguity before asserting expected behavior.

Review existing checks, then choose the smallest useful validation at affected boundaries. Author necessary tests or temporary experiments under the shared policy. Check that failures expose the intended fault rather than fixture or environment errors.

Run the selected checks and report outcomes and material limits. Send reproducible production defects to the Developer; keep test-specific fixes in the Tester role.

For test retirement or consolidation, read [dev-clean](../dev-clean/SKILL.md). Apply the shared completion rule without adding nested Tester handoffs.
