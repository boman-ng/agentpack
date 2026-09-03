# Verification Matrix

Use this reference to choose proportionate evidence. Do not run every sensor on every cleanup.

## Contents

1. Risk dimensions
2. Consequence tiers
3. Sensor hierarchy
4. Change-to-evidence matrix
5. Test pruning
6. Sensor quality
7. Net complexity delta

## 1. Risk Dimensions

Increase verification depth when any dimension increases:

- **Blast radius:** number and importance of users, callers, services, or workflows affected.
- **Durability:** expected lifetime of the code, contract, or data.
- **Irreversibility:** ability to revert code, data, releases, or external effects.
- **Privilege:** access to secrets, identity, production, network, filesystem, or destructive operations.
- **Contract scope:** public API, persistence, protocol, package, or cross-team boundary.
- **Novelty:** unfamiliar technology, new mechanism, or weak local precedent.
- **Evidence weakness:** poor tests, unavailable owners, dynamic registration, or incomplete telemetry.

AI involvement alone does not determine technical risk. Autonomous external action always raises governance risk.

## 2. Consequence Tiers

| Tier | Typical cleanup | Minimum evidence |
|---|---|---|
| R0: observational | Read, inventory, explain; no state change | Source references and explicit uncertainty |
| R1: local and reversible | Dead local helper, duplicate test setup, contained rename | Focused tests or compile/type/lint evidence; complete diff review |
| R2: shared behavior | Shared module, dependency, user-visible behavior, build/CI | Domain owner evidence, regression/contract test, broader affected checks, rollback description |
| R3: durable or privileged | Public API, schema/data, auth, security boundary, release path | Prior design/contract decision, specialist review, migration and rollback evidence, runtime or representative-data validation |
| R4: irreversible external action | Production mutation, destructive migration, release, credential or public action | Explicit execution-time human authorization, least privilege, auditable execution, rehearsed recovery where feasible |

Move a change upward when its evidence is weak even if its code diff is small.

## 3. Sensor Hierarchy

Select the lowest-cost independent evidence that can falsify the cleanup claim:

1. **Repository integrity:** formatting, parse, manifest validation, generated-file consistency, `git diff --check`.
2. **Static correctness:** compile, typecheck, lint, schema validation, dependency resolution.
3. **Focused behavior:** unit, contract, state-transition, integration, CLI/API/UI/workflow checks.
4. **Structural invariants:** dependency direction, forbidden edges, cycles, public API compatibility, schema constraints.
5. **Adversarial effectiveness:** targeted mutation, property, fuzz, fault injection, concurrency, security analysis.
6. **Runtime and operational evidence:** representative execution, migration rehearsal, observability, canary, SLO, rollback.
7. **Qualified human judgment:** premise, product value, domain semantics, architecture ownership, legal or safety decisions.

Stop at the first level or combination that covers the actual claim. Do not run every lower and higher level as a ritual. A broad suite is warranted only when the repository mandates it, affected-test selection is unavailable for a shared surface, or the cleanup can alter behavior outside the focused boundary.

AI review can add findings and triage attention. It does not satisfy a required accountable approval.

## 4. Change-to-Evidence Matrix

| Cleanup type | Required evidence | Add when risk warrants | Misleading substitute |
|---|---|---|---|
| Dead local code | References plus build/type/test | Runtime registration or coverage trace for dynamic systems | Text search alone |
| Duplicate implementation | Shared contract and caller comparison | Characterization tests, change-history analysis | Similar syntax alone |
| Wrapper/abstraction removal | Caller behavior and ownership | Performance or protocol checks | One implementation alone |
| State-machine pruning | Reachability and business lifecycle contract | Property/model checks, representative persisted states | Enum-reference count |
| Schema/data removal | Consumer inventory and data inspection | Migration rehearsal, backup/restore, rollback | ORM model search alone |
| Compatibility deletion | Verified consumer and deprecation evidence | Usage telemetry, release-window proof | Age of code |
| Dependency removal | Call sites, manifest/lockfile, build/test | License, supply-chain, performance checks | Package unused warning alone |
| Configuration/flag removal | Supported environment and consumer evidence | Deployment config scan, runtime telemetry | Repository default alone |
| Test pruning | Behavior contract and counterfactual test value | Mutation/property/fault checks | Coverage percentage |
| Documentation cleanup | Current executable or structured source of truth | Owner confirmation for policy/product claims | Code recency alone |
| Architecture relocation | Named ownership and dependency direction | Structural test, integration/runtime check | Coupling score alone |
| Security cleanup | Threat model and secure boundary contract | SAST, secret/dependency scan, fuzz, specialist review | General unit tests |
| Defensive or precautionary mechanism | Named invariant, condition, owner, simplest baseline, and independent oracle | Targeted neutralization, fault injection, interaction test, replay, runtime evidence, or qualified threat review | Generic safety claim, imagined possibility, mechanism presence, or green co-authored tests |

## 5. Test Pruning

Delete or rewrite a test only when at least one is established:

- The behavior or contract it protects has been explicitly removed.
- It duplicates another test without covering a distinct risk.
- It asserts implementation trivia rather than a supported contract.
- Its fixture represents an obsolete state, schema, flag, or compatibility path.
- Its assertions cannot fail under plausible incorrect behavior.
- It is permanently skipped, retried into success, or disconnected from the normal test target.

Before deleting, identify whether the test is the only evidence for an incident, migration, protocol, security, recovery, concurrency, or performance invariant. Promote that invariant to a clearer test when still required.

Do not use a global coverage or mutation threshold as the pruning criterion.

## 6. Sensor Quality

Keep or add a sensor only when all are named:

- the invariant it protects;
- the owner responsible for failures;
- the meaning of failure;
- the normal remediation path;
- the enforcement surface: advisory, required merge check, release gate, or runtime alert;
- the exception and removal condition.

Where a mechanism's effectiveness is economically testable, prefer an independent sensor that detects the protected invariant failing when the mechanism is neutralized under the named condition. When empirical ablation is unsafe or infeasible, state the structural, formal, contractual, or qualified evidence and its limits.

Delete or narrow sensors that are redundant, routinely ignored, unactionable, flaky, or more expensive than the risk they expose.

Make diagnostics tell the agent what boundary or invariant failed and what evidence is expected. Avoid prescriptive fixes when several valid designs exist.

## 7. Net Complexity Delta

Report dimensions that are meaningful for the scoped cleanup:

| Dimension | Examples |
|---|---|
| Physical size | source files and lines added/deleted; exclude generated or vendored artifacts when they distort the result |
| Conceptual load | domain concepts, aliases, models, sources of truth, owners |
| Control flow | normal paths, fallback branches, feature flags, error paths |
| State space | states, transitions, stored fields, invalid combinations |
| Coupling | dependency edges, cycles, callers requiring synchronized edits |
| Public surface | APIs, commands, options, environment variables, schemas |
| Supply chain | direct/transitive dependencies, build tools, containers |
| Test burden | tests, mocks, fixtures, snapshots, flakes, execution time |
| Operational burden | jobs, dashboards, alerts, runbooks, migrations, release steps |
| Verification strength | behavior contracts or executable invariants added, removed, or weakened |

Use before/after counts only where definitions are stable. Explain qualitative reductions such as single ownership or removal of a parallel normal path. Never collapse these dimensions into one score.
