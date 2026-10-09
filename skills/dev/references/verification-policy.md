# Verification Policy

## Test Value And Completion

Express expected behavior through business state, action, and observable outcome. Derive expectations from requirements, authoritative contracts, or independent examples; implementation output is not the sole oracle.

Prioritize integration checks and critical business journeys from production entry points to observable outcomes. Choose the boundary that exposes the fault and use real dependencies when the claim requires them. Isolated tests remain useful for rules, algorithms, and boundary conditions; do not turn every check into an end-to-end test.

Reject redundant unit tests, implementation mirrors, private-structure assertions, and speculative defensive cases without a credible failure or contract. No coverage quota, per-method test requirement, or test-first sequence applies. Changed code alone does not require new tests. Preserve unique checks for active rules, realistic failures, incidents, security, concurrency, and recovery.

Reuse relevant existing checks. Add a temporary experiment to resolve current uncertainty; retain a regression test only when it protects stable behavior against a plausible recurring fault at reasonable cost. A temporary check need not become infrastructure.

Run the affected checks and required project checks. Confirm failures come from the behavior rather than invalid fixtures or missing prerequisites. Do not hide failures, weaken assertions, or retry without a supported cause. Reuse results while their code, dependencies, configuration, and environment assumptions remain valid.

Report material substitutions and unverified boundaries: a component test does not establish production wiring, a contract test does not cover a whole journey, and a stubbed success does not prove real integration. Stop when acceptance and required checks are satisfied with no unresolved material risk in scope. Broaden or repeat verification only for changed assumptions, failures, or remaining uncertainty.

## Independent Developer And Tester

The **Developer** owns production changes; a **Tester** with a distinct agent ID owns new or semantically changed validation for the coherent change. They must use the same actual model and reasoning effort. Do not hardcode a model or silently downgrade. Standalone verification does not require matching an unknown historical or human author.

Tester ownership covers tests, assertions, snapshots, fixtures, mocks, helpers, pass-condition configuration, and temporary executable correctness checks. Running existing tests, observation-only diagnostics, and semantically neutral path/format edits do not require a new Tester.

When validation authorship is needed, spawn one compatible Tester with fresh context or reuse one with a clean task context. Supply the original request, requirements, contracts, environment, authorization, and scope, rather than the Developer's full transcript or implementation-derived expected answers. The Tester may inspect production wiring while deriving expectations independently.

A direct `dev-test` agent can fill this role if it did not author production. A Developer cannot switch roles by reading the Tester skill. Test-specific fixes stay with the Tester; production fixes go to the Developer. No nested Tester is needed merely for ceremony.

If a compatible distinct agent is unavailable, continue implementation and existing checks; report the missing independent validation without claiming it complete.

## Maintenance Exception For Test Deletion

Within authorized `dev-clean` work, the maintenance agent may delete a test whose contract was withdrawn or whose relevant faults remain covered. Names, speed, coverage, or a green suite alone do not establish redundancy. Never remove a test to hide failure or erase unique protection.

New equivalence experiments, assertions, and semantic replacements or merged tests remain Tester-owned. Broad test-suite cleanup still needs the user's maintenance scope.
