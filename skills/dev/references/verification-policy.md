# Verification Policy

## Independent Authorship And Judgment

For nontrivial production changes, the implementer, Tester, and Reviewer are different agent instances under the [collaboration rules](collaboration.md). Independence applies even when existing checks suffice and no new tests are needed. Trivial mechanical work may combine roles. Standalone read-only investigation or explanation does not create a production change or require unused implementation roles. Formal validation authorship remains Tester-owned when a candidate, experiment, or evaluation needs it.

The Tester exclusively authors new or semantically changed formal validation: tests, assertions, snapshots, fixtures, mocks, test helpers, pass conditions, and temporary executable correctness checks. This includes design/implementation candidates, benchmarks, and workflow evaluations. The implementer may run existing checks and collect observation-only diagnostics; an assertion or expected-output script cannot be relabeled a diagnostic. Validation changes stay with the Tester and production fixes with the implementer.

Give the Tester original requirements, authoritative contracts, relevant environment and scope, raw evidence, and allowed operations. The author's preferred answer is not the oracle. The Tester can inspect implementation and wiring while deriving expectations independently. Models and reasoning settings need not match.

The Tester reports expected and actual behavior, check status, reproduction, evidence, and limits. It does not recommend fixes, judge architecture, rank candidates, select winners, or decide merge-readiness. A passing check means its stated condition held; it is not a delivery verdict. The [Reviewer](../../dev-review/SKILL.md) evaluates engineering quality and tradeoffs; the main agent decides acceptance and delivery.

A direct independent `dev-test` agent already fills the testing role. Missing independent roles remain unmet gates: continue existing checks and possible work, report the gap, and do not simulate independence or claim completion.

## Choose Evidence That Can Expose The Fault

Express expectations as state, action, and observable outcome. Use requirements, authoritative contracts, or independent examples; implementation output is not its own oracle. Investigate ambiguous requirements before assigning pass conditions.

User-visible behavior changes default to testing the real user path through the relevant UI, CLI, or API, including required side effects. Production wiring or external integration changes require evidence at that boundary. Algorithms and internal data structures can be checked at the boundary that establishes their guarantees. Stubs, component tests, and source inspection do not establish an unobserved production journey.

Reuse useful project checks. Add tests for meaningful active guarantees, credible faults, and recurring regressions; reject implementation mirrors, private-structure assertions, duplicate coverage, and quota-driven cases. Changed code alone does not require a new test; no universal test-first sequence applies. For a defect, obtain a reproduction or discriminating observation when feasible, then establish repaired behavior. A missing reproduction does not prevent source investigation.

Use isolated authorized environments for fault injection and data mutation. Confirm an experiment changed its intended condition before interpreting the result. Distinguish product failures from broken setup, invalid fixtures, missing dependencies, and inconclusive checks. Keep raw output; never weaken assertions or delete unique protection to obtain green results.

## Build Missing Verification Capability

When missing capability prevents reliable acceptance, the Tester builds the smallest useful verification entrypoint using project tools. Establish how to launch the target, check prerequisites, drive behavior, capture results and side effects, and clean up owned state. Execute it against the real target; an unrun recipe is a proposal.

Keep one-off probes in the task's temporary directory. Put useful repeatable scripts or project verification skills with the project, including required environment, isolated data setup, evidence location, and cleanup. Assign production instrumentation and application fixes to the implementer. An existing command or small project script can suffice; do not create a universal harness by default.

## Evidence Identity And Reporting

Record the command or interaction, expected and actual result, exit/check status, environment and relevant dependencies, raw output location, and limitations. Bind each result to the source it exercised: repository/base/head where applicable plus dirty changes, untracked inputs, configuration, and generated artifacts that affect the result. HEAD alone cannot identify a dirty worktree. An isolated snapshot or captured diff plus relevant inputs can identify that state without committing process records.

Use compact factual reports. Include blocked or not-run checks with the observed reason. Report reproduction steps to the implementer and share objective results with the Reviewer and main agent. Keep process evidence in the [temporary task location](collaboration.md#records-and-task-state), with sensitive data removed where possible.

Reuse evidence only while its code, dependencies, wiring, configuration, and environment assumptions hold. Identical patches on different bases can behave differently. After synthesis, fixes, restacking, or integration, inspect changed assumptions and rerun affected checks. A candidate's result does not automatically cover the synthesized output.

## Maintenance And Completion

Within authorized cleanup, an implementer may delete a test only after establishing its contract was withdrawn or its relevant faults remain covered. Similar names, speed, coverage percentages, and a green suite do not prove redundancy. Semantic replacements, merged assertions, and new equivalence experiments remain Tester-owned.

Run affected and required project checks. Reviewer findings go to the main agent for a reasoned decision, then to the appropriate owner for accepted changes. Completion requires applicable independent roles, relevant evidence, addressed material findings, and the authorized endpoint. Stop once these are satisfied; broaden or repeat checks only for changes, failures, or unresolved uncertainty. Report unverified boundaries instead of treating missing execution as success.
