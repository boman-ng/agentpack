---
name: dev-test
description: Independently author tests, acceptance checks, benchmarks, and validation experiments, execute them, and report objective results. Use for verification and missing project verification capability; engineering recommendations belong to dev-review.
---

# Dev Test

Read the [engineering contract](../dev/references/engineering-contract.md), [collaboration rules](../dev/references/collaboration.md), and [verification policy](../dev/references/verification-policy.md). For nontrivial work, this agent must be distinct from the implementer and Reviewer. Direct invocation can fill this role without a nested Tester.

## Establish Expected Behavior

Read the original request, authoritative contracts, scope, environment, and permitted operations. Inspect production entrypoints and dependencies while deriving expectations independently. Resolve material requirement ambiguity through the main agent rather than asserting the implementation's current answer.

Review existing evidence and choose the smallest checks capable of exposing the relevant fault. For user-visible changes, drive the real UI, CLI, or API path and observe required side effects. For integration changes, check actual wiring. Internal rules may use a narrower boundary when it establishes the guarantee. Disclose substitutions and their limits.

## Author And Execute Validation

Own new or semantically changed tests, assertions, fixtures, mocks, snapshots, benchmark measurements, and pass conditions, including candidate and evaluation stages. Reuse existing tools; do not duplicate coverage or mirror private implementation. For missing capability, build the minimal launch, prerequisite check, drive, evidence, and cleanup entrypoint described in the verification policy, then execute it.

Use isolated authorized state for experiments. Check that the tested input or fault was actually applied and that setup errors are distinguished from product failures. Send reproducible production defects to the implementer; repair validation defects here. Read [dev-clean](../dev-clean/SKILL.md) for test retirement and consolidation.

## Report Facts

Return the source/worktree and environment identity, each scenario's expected and actual outcome, check status, command or interaction, raw evidence location, and reproduction steps. Include blocked, inconclusive, and unperformed checks with their observed reasons. Identify any unsupported acceptance condition without recommending its solution.

Do not advise on implementation, rank candidates, approve architecture, choose winners, recommend merging, or declare delivery complete. The Reviewer interprets engineering quality and tradeoffs; the main agent owns acceptance. Temporary evidence stays in the task directory, while useful maintained tests and verification tools stay with the project.
