---
name: dev-perf
description: Measure and improve performance using realistic workloads, profiles, controlled comparisons, and independent verification. Use for performance regressions or optimization; sustained metric optimization requires an explicit request and bounded goal.
---

# Dev Perf

Read the [engineering contract](../dev/references/engineering-contract.md), [collaboration rules](../dev/references/collaboration.md), and [verification policy](../dev/references/verification-policy.md). Direct invocation inherits their entry gates. Scoped measurement or implementation delegates report to the existing main coordinator without starting another global workflow.

Connect each proposed improvement to observed work and a user-relevant outcome. Main owns the objective, budget, decisions, and completion. Implementers change production behavior; Tester authors formal measurement and regression assets and reports observations; Reviewer assesses the design and tradeoffs. All three are separate agent instances for nontrivial work.

## Measure Before Choosing

Establish the affected path with [dev-how](../dev-how/SKILL.md). Use [dev-diagnose](../dev-diagnose/SKILL.md) for unresolved runtime causes. Read [measurement guidance](references/measurement.md) before using a number to compare options or claim a change.

Identify the workload, metric and unit, target when supplied, correctness obligations, and resource or latency constraints. Reuse the project harness if it measures the needed work. Tester adds or changes formal workloads, fixtures, expected outputs, assertions, and pass conditions; implementers may run existing measurements or collect observation-only profiles.

Record a baseline from the actual environment and source state. Use profiling to locate a plausible limiter, then perform unprofiled comparison runs so instrumentation does not become the claimed speedup. Check whether the workload generator, configuration, cache state, or missing work explains the result before proposing code changes.

## Improve The Owning Mechanism

Consider eliminating unused work and unnecessary repetition before making it cheaper. Also consider reducing frequency, deferring work when the contract permits it, and changing concurrency where ownership and resource limits support it. Choose from measured constraints; deferred work, stale data, or background cost still counts when it affects the user or another operation.

Route structural changes through [dev-architect](../dev-architect/SKILL.md); unresolved implementation alternatives use [dev-arena](../dev-arena/SKILL.md). Delegate production changes to an implementer. Measure the resulting source state with the same valid setup, run relevant correctness checks, and obtain independent engineering review. Main accepts or rejects the change from those observations and obligations.

One-off work ends when its requested result and verification are complete. It does not implicitly authorize an open-ended optimization campaign.

## Explicit Sustained Optimization

For an explicit iterative optimization request, settle the metric and direction, baseline workload, target, available time or compute budget, and stop conditions before looping. Use user-provided values; resolve a missing consequential target or budget instead of inventing one. Include stopping on exhausted budget, invalid measurement, or an unresolved protection. Do not require a minimum attempt count unrelated to the requested outcome.

Tester establishes a repeatable measurement command and regression checks, proves the harness can observe the relevant work, and holds the setup stable across comparable attempts. If a legitimate workload or harness change becomes necessary, record it and reestablish the baseline; never alter a pass condition to make an attempt win.

For each attempt:

1. Main chooses a causal hypothesis grounded in source and measurement, with a bounded production change delegated to an implementer.
2. Tester runs or oversees the controlled measurement and regression checks, reporting raw outcomes, variation, errors, completed work, and limitations.
3. Reviewer assesses structural cost and effects on other guarantees; main decides whether to retain the change. The implementer removes rejected experiment-owned changes without disturbing unrelated work.
4. Record the hypothesis, source state, result, evidence path, decision, and reason in the existing temporary task record before the next attempt.

Independent attempts may use isolated environments; they still require separate measured decisions before integration. Reconsider the mechanism after repeated failures instead of stacking unmeasured changes. Stop at the agreed condition and report unmet targets honestly. Route retained complete increments through [dev-git](../dev-git/SKILL.md) under existing authorization.

Return the workload and metric, baseline and final observations, variation and run count, completed-work and error evidence, accepted changes, cost or behavior tradeoffs, and remaining limits. Tester supplies the measurements; Reviewer and main make engineering recommendations and the delivery decision.
