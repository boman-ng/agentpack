# Verification Policy

This is the common verification and validation-ownership policy for the Dev suite.

## Evidence And Test Value

Describe behavior through business state, action, and observable outcome. Derive expected results from original requirements, authoritative contracts, or independently reasoned examples; the implementation cannot be the sole oracle. No particular example syntax or framework is required.

Prioritize relevant integration checks and critical business journeys from their production entry points to observable results, using real dependencies where the claim needs them and the environment permits. Choose the smallest boundary that exposes the actual fault: isolated tests are valuable for rules, algorithms, and boundary conditions; integration faults need evidence across the relevant integration. Do not turn every check into an end-to-end test.

Default against redundant unit tests, implementation mirrors, private-structure assertions, and hypothetical defensive cases without a credible failure or contract. Do not require test counts, coverage thresholds, a case for every method or layer, or new tests merely because code changed. Preserve valuable evidence for active rules, algorithms, realistic failures, incidents, security, concurrency, and recovery even when it adds no line coverage.

| Evidence | Establishes | Limit |
|---|---|---|
| Component | A rule or component under controlled inputs | Does not establish production wiring or external compatibility |
| Contract | Agreement with authoritative interface expectations and relevant errors | Does not establish a complete journey |
| System end-to-end | An assembled path from entry point to observable result | Substitutions and test configuration limit the claim |
| Real environment | Actual configuration, permissions, dependencies, and observed outcome | Covers only exercised conditions in that environment |

State what substitutes replace and what remains unverified. A stubbed success does not prove that a real dependency or deployment works. Meaningful before-and-after defect evidence remains useful; first confirm that a failure exposes the defect rather than an invalid fixture or missing environment. There is no mandated test-first sequence or development ceremony.

Decide separately:

- **Evidence needed now:** Which acceptance claim or uncertainty remains, and what existing check or focused experiment resolves it?
- **Evidence worth retaining:** Does a regression test protect stable behavior against a plausible recurring fault at reasonable maintenance cost? A temporary experiment need not become permanent infrastructure.
- **Execution:** Run focused checks for uncertain decisions, then required project checks and checks selected by affected dependencies and risk. Reuse results only while relevant code, configuration, dependencies, and environment assumptions remain valid.

Investigate failures without hiding errors, weakening checks to obtain success, or retrying without a supported cause. Stop when acceptance, affected-boundary evidence, and required checks are satisfied with no unresolved material risk. Do not repeat or broaden checks without new evidence.

## Independent Developer And Tester

The **Developer** owns production changes. The **Tester** owns new or semantically changed validation. These must be distinct agent IDs for the coherent change package, using the same actual model and reasoning effort as the current implementation Developer. Do not hardcode a model name or silently downgrade. A standalone verification task does not require matching an unknown historical or human author's model.

The Developer must not author new or semantically changed tests, assertions, snapshots, fixtures, mocks, helpers, or configuration that affects pass conditions. This also covers temporary executable correctness checks and behavioral validation scripts. Running existing tests, observation-only diagnostics, and semantically neutral path or formatting changes do not trigger a new Tester.

When validation authorship is needed, spawn a distinct Tester with fresh context, or reuse a distinct compatible Tester with a clean task context. Give the original task and requirements, relevant contracts, environment, authorization, and change scope. Include required business outcomes; do not give the full Developer transcript or treat implementation-derived values as authoritative expectations. The Tester may inspect production code for wiring and reachability, but derives the acceptance oracle from the independent contracts; do not claim physical blindness.

Use one Tester per coherent package, not one per test. The Tester owns test-specific code; production fixes go to the Developer. A directly invoked `dev-test` agent may be the Tester if it did not author the production change; it does not need to spawn another Tester merely for ceremony. If the current agent already authored production, reading `dev-test` does not let it switch roles.

If no distinct compatible agent is available, report the unmet independence condition and affected evidence. Continue independent implementation and existing checks within scope; do not switch roles or claim the missing validation was completed.

## Maintenance Exception For Test Deletion

Within authorized `dev-clean` scope, the maintenance agent may itself delete a proven obsolete or redundant test when its contract was withdrawn, or retained checks still detect the same relevant faults. Name, syntax, speed, a green suite, or coverage alone is insufficient. Never delete a test to hide a failure.

Inspect existing contract and fault-coverage evidence first. Preserve unique evidence for active obligations. If a new equivalence experiment is necessary, the independent Tester authors it. New assertions, merged tests, or replacements that change validation remain Tester-owned; the deletion exception does not transfer their authorship. Broad suite cleanup still requires that maintenance scope from the user.
