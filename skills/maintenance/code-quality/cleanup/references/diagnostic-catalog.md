# Diagnostic Catalog

Use this catalog to classify evidence-backed maintenance slop. Do not treat it as a checklist that every cleanup must exhaust.

## Contents

1. Evidence levels
2. Premise and behavior residue
3. Duplicate concepts and authority
4. Ownership and boundary violations
5. Speculative abstractions and indirection
6. Compatibility, fallback, glue, and incomplete migration
7. State and data-model inflation
8. Dependency, configuration, and public-surface inflation
9. Test slop
10. Documentation and operational residue
11. Cognitive and change-amplification signals
12. Root-cause questions
13. Defensive and precautionary inflation

## 1. Evidence Levels

Classify each candidate before acting:

- **Observed:** directly supported by source structure, a structured query, a reproducible runtime result, a failing test, a contract, consumer evidence, or version history.
- **Supported inference:** several observations point to the conclusion, but a dynamic consumer, product decision, or operational fact remains unverified.
- **Unknown:** based mainly on naming, appearance, a heuristic metric, missing context, or an unavailable owner. Record it only as an investigation lead with the missing evidence and next decisive check; never place it in the actionable cleanup ledger.

Evidence level alone does not make a candidate actionable. Apply the four-element threshold in `SKILL.md` before changing code.

Delete low-impact, reversible candidates only when evidence is adequate for their context. Require direct consumer, contract, runtime, or migration evidence before changing high-impact behavior, data, security, or public interfaces.

Do not infer authorship from style. Do not infer quality from authorship.

## 2. Premise and Behavior Residue

### Signals

- A feature, option, endpoint, background job, flag, or workflow has no verified user or system outcome.
- A mechanism solves a past requirement that no longer exists.
- A complex implementation was added before its premise was tested.
- A temporary experiment became a permanent normal path.

### Strong evidence

- The authoritative contract or product decision removed the behavior.
- Usage evidence and known consumers show no use within an appropriate observation window.
- Version history identifies a completed replacement or abandoned experiment.
- Runtime routing proves the path cannot be selected.

### Cleanup actions

- Delete the behavior and its states, configuration, tests, fixtures, documentation, and dependencies as one bounded slice.
- Collapse callers onto the one supported path.
- Remove the premise itself from plans and docs so it is not regenerated later.

### False positives

- Rare incident, recovery, compliance, migration, or administrative paths.
- Seasonally or externally invoked behavior absent from local telemetry.

## 3. Duplicate Concepts and Authority

### Signals

- Multiple types, services, tables, caches, helpers, hooks, or schemas represent the same domain concept.
- Similar workflows differ only in error handling, naming, or transport details.
- A new implementation missed an established reuse point.
- The same rule is validated or calculated in several layers.

### Strong evidence

- Call sites satisfy the same contract and change for the same reasons.
- Duplicate implementations have already drifted or require coordinated edits.
- History shows repeated synchronized changes.
- One implementation is already the documented owner.

### Cleanup actions

- Consolidate semantics under the existing owner.
- Delete shadow models and translations that add no boundary meaning.
- Keep adapters only at real external protocol boundaries.
- Add a narrow executable dependency or ownership rule only when recurrence is demonstrated.

### False positives

- Similar syntax representing different domain policies or failure semantics.
- Intentional isolation across trust, deployment, or transactional boundaries.

## 4. Ownership and Boundary Violations

### Signals

- Business decisions live in delivery, bootstrap, UI, storage, or generic utility code.
- Validation, mutation, retries, recovery, or auditing occur away from the boundary that owns them.
- A module reaches through another module's public contract to mutate internals.
- A change crosses many files because one value is threaded through unrelated layers.

### Strong evidence

- Architecture rules or stable module responsibilities identify the owner.
- The misplaced code creates cycles, cross-boundary mutation, or duplicated policy.
- A single domain change repeatedly requires unrelated layers to change.

### Cleanup actions

- Move the decision to the owning boundary and narrow callers to its contract.
- Replace cross-boundary knowledge with an existing typed value or public operation.
- Delete forwarding layers after callers reach the owner directly.

### False positives

- Composition roots, protocol translation, and deliberately thin delivery adapters.
- Stable anti-corruption boundaries around genuinely external models.

## 5. Speculative Abstractions and Indirection

### Signals

- An interface has one implementation and no verified substitution boundary.
- A manager, provider, registry, factory, strategy, generic framework, or plug-in point exists for hypothetical future use.
- Wrappers forward arguments and return values without owning policy, lifecycle, or protocol translation.
- Configuration exposes choices that the product never supports.

### Strong evidence

- No caller relies on polymorphism, test substitution, process isolation, or an external protocol.
- The abstraction increases files, navigation, or change points without reducing duplication.
- Version history shows the extension point has never hosted another valid variant.

### Cleanup actions

- Inline or collapse the abstraction into its owner.
- Remove speculative options and generic type parameters.
- Retain a boundary only when it has distinct semantics, ownership, or volatility.

### False positives

- Required dependency inversion across a durable policy/mechanism boundary.
- Test seams around nondeterministic or privileged effects when no sound alternative exists.

## 6. Compatibility, Fallback, Glue, and Incomplete Migration

### Signals

- Old and new names, schemas, APIs, state transitions, or execution paths coexist indefinitely.
- A fallback returns success-shaped data or silently selects legacy behavior.
- Shims and adapters translate between two internal models with no external consumer.
- Migration code has no owner, telemetry, deadline, or removal condition.

### Strong evidence

- Consumer inventory shows the old contract has no remaining user.
- Migration or release evidence proves all durable data has moved.
- The compatibility path is unreachable under supported configuration.
- The replacement is stable and the deprecation condition has elapsed.

### Cleanup actions

- Remove the obsolete path and all aliases, tests, metrics, docs, and configuration tied to it.
- Make unsupported input fail explicitly at the owning boundary.
- Keep necessary compatibility narrow, visible, tested, owned, and tied to a removal condition.

### False positives

- Public protocols, stored data, rolling deployments, external consumers, or disaster recovery with a verified continuity requirement.

## 7. State and Data-Model Inflation

### Signals

- States differ only in labels, UI presentation, or transient implementation detail.
- Derived values are stored and can drift from their source.
- Invalid combinations are representable and require defensive branches everywhere.
- Tables, columns, events, or transitions no longer participate in supported behavior.
- A state machine models technical steps instead of business lifecycle facts.

### Strong evidence

- Transition analysis finds equivalent or unreachable states.
- Data constraints and runtime paths show a field is derivable or unused.
- Incidents or repeated guards result from representable invalid combinations.
- A business invariant can replace several procedural states.

### Cleanup actions

- Merge equivalent states and delete unreachable transitions.
- Compute derived values from the source of truth.
- Encode valid combinations in types, constraints, or owner-local constructors.
- Delete obsolete persistence only with appropriate data and migration evidence.

### False positives

- Operational states needed for idempotency, recovery, audit, concurrency, or externally observable lifecycle guarantees.

## 8. Dependency, Configuration, and Public-Surface Inflation

### Signals

- A dependency duplicates a platform or project primitive.
- A library is used for a trivial operation but brings material transitive or supply-chain cost.
- Public APIs, flags, environment variables, feature switches, or callbacks have no verified consumer.
- Configuration moves a product decision into every deployment without a real choice.

### Strong evidence

- Lockfile and call-site inspection identify a narrow replaceable use.
- Consumer search and release evidence show no external use.
- The option has one supported value across real environments.
- Ownership and upgrade history show an abandoned dependency.

### Cleanup actions

- Remove the dependency or option and simplify the owning path.
- Narrow public surface to the supported contract.
- Prefer existing project primitives, then platform standards, then mature dependencies before bespoke general-purpose code.

### False positives

- Security, interoperability, performance, legal, or operational requirements not visible in local call sites.

## 9. Test Slop

### Signals

- Tests assert mocks, call counts, private methods, snapshots, or implementation order instead of behavior.
- Assertions only check non-null, success status, or object shape while ignoring the result.
- Production behavior and its tests were changed together without an independent contract.
- Duplicate tests cover the same path without distinct risk.
- Fixtures preserve removed schemas, states, flags, or fallback behavior.
- Retries or skips convert flaky failures into apparent success.

### Strong evidence

- The test survives a plausible behavior-breaking mutation.
- The test still passes after removing the behavior it claims to protect.
- The asserted detail is not part of a public or owner-local contract.
- The protected behavior has been explicitly removed.

### Cleanup actions

- Replace implementation assertions with public behavior or state-transition assertions.
- Delete duplicate and obsolete tests or fixtures.
- Consolidate setup under an existing owner without hiding relevant variation.
- Add targeted mutation, property, or fault injection only when ordinary assertions cannot demonstrate effectiveness economically.

### False positives

- Interaction assertions that protect a genuine protocol, side-effect, security, or performance contract.

## 10. Documentation and Operational Residue

### Signals

- Documentation describes paths, names, options, or behavior no longer present.
- Comments narrate syntax, repeat types, or preserve obsolete implementation history.
- Dashboards, alerts, jobs, scripts, or runbooks monitor retired behavior.
- Generated documentation and source declarations disagree.

### Strong evidence

- Executable behavior, schemas, or current owner decisions contradict the artifact.
- The operational object has no producer, consumer, or response owner.

### Cleanup actions

- Delete obsolete prose and operational artifacts in the same slice as the behavior.
- Replace repeated prose with a link to the authoritative contract when useful.
- Generate derived documentation from structured sources only when generation removes real drift.

### False positives

- Historical decision records that intentionally remain discoverable and link to their replacement.

## 11. Cognitive and Change-Amplification Signals

### Signals

- A small behavior change repeatedly touches many files or layers.
- Reviewers cannot identify the owner or explain why an abstraction exists.
- Similar fixes recur because the governing invariant is implicit.
- The code is locally readable but the system requires many hidden facts to change safely.

Use these as investigation triggers, not deletion proof. Trace the touch points to duplicate authority, a missing owner, an invalid state model, or a leaky boundary.

Useful trend measures include:

- files and semantic units changed for comparable work;
- architecture-edge and public-surface deltas;
- 7/30/90-day defect rework;
- time for a non-author to explain and safely modify the area;
- number of owners, states, paths, dependencies, options, and fixtures removed or added.

## 12. Root-Cause Questions

Ask these before choosing an action:

1. Is this a symptom, invalid premise, ownership error, boundary violation, contract conflict, state-model defect, or obsolete path?
2. What changes for the same reason?
3. Which boundary can enforce the invariant once?
4. Which source of truth is authoritative?
5. What consumer proves the old path must remain?
6. What is the failure mode if this is deleted?
7. What evidence would falsify the cleanup hypothesis?
8. Will the proposed fix reduce future touch points, or merely move them?

## 13. Defensive and Precautionary Inflation

### Signals

- Retries, fallbacks, validation layers, backups, rollback paths, feature flags, compatibility paths, telemetry, or audit mechanisms are justified only by generic safety, robustness, production-readiness, or possible future failure.
- The same invariant is enforced in multiple internal layers without distinct trust boundaries or failure responsibilities.
- Development-time uncertainty, tool limitations, review caution, or temporary migration safeguards became permanent runtime behavior.
- A guard has no independent oracle capable of detecting its removal.
- A fallback converts failure into success-shaped output without preserving the domain contract.
- Precautionary infrastructure introduces more states and failure paths than the named risk.

### Strong evidence

- No current contract, consumer, threat model, continuity duty, or reproducible failure supports the mechanism.
- The simplest valid baseline preserves the required outcome.
- Targeted neutralization shows no benefit or exposes negative effects such as retry amplification or stale fallback data.
- Multiple layers have the same owner, assumptions, inputs, and common-mode failure.

### Cleanup actions

- Omit an unsupported proposed mechanism; preserve and escalate an unresolved existing high-consequence control.
- Consolidate enforcement at the owning boundary.
- Replace a success-shaped fallback with explicit contract-valid failure.
- Scope a conditional mechanism to the condition in which it has demonstrated value.
- Keep unresolved uncertainty in the report rather than encoding it as configuration or a parallel path.

### False positives

- Distinct trust boundaries or privilege domains.
- Explicit threat-model controls.
- Incident-backed recovery or continuity mechanisms.
- Legally or contractually mandated controls.
- Rare but high-consequence duties supported by appropriate non-production evidence.
