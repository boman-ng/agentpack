# Engineering Contract

Apply this contract to the affected scope. The complete Dev suite consists of sibling `dev`, `dev-build`, `dev-clean`, `dev-test`, and `dev-git` skills and their resources. Confirm the entrypoints and required references once per task; report missing resources rather than substituting another workflow. Already-read resources need not be reloaded.

## Scope And Acceptance

Establish the observable outcome, callers, constraints, and acceptance from the task and existing contracts. Resolve consequential ambiguity before dependent actions while continuing independent work. Use the task discussion or existing project artifacts; no separate specification is required.

Audits remain read-only. Skill selection does not authorize unrelated maintenance, publication, deployment, destructive data operations, or release metadata changes.

## Business Ownership And Architecture

Use domain-driven design: express use cases, rule owners, invariants, and consistency boundaries in the project's business language. Separate business meaning from presentation, transport, storage, and framework mechanics. Functions, modules, and transaction scripts can own domain policy.

Apply Clean Architecture's inward source dependencies and Hexagonal Architecture's boundaries with external actors. Use cases coordinate work, domain owners make business decisions, and adapters translate real external protocols. Ports can be existing functions or modules; wire implementations through project composition mechanisms.

Trace the affected path from entry point through rules and external effects to results. Reuse existing boundaries; add one when actual isolation, verification, or variation warrants it. Do not require class hierarchies, an interface per class, repository per table, DTO per layer, or a legacy rewrite just to fit an architecture diagram.

For shared state, establish valid transitions and relevant concurrency or partial-failure behavior. Preserve database constraints and atomic enforcement; a precheck alone does not prevent races. Check entry points that can bypass rules. For external effects, define outcomes after timeout, failure, or repeated delivery, including unknown outcomes where needed.

## Implementation And Delivery

Complete coherent behavior across callers and integration points. Fix the owning rule when the model is wrong; inspect affected failure paths, configuration, packaging, and documentation. Use project build and delivery mechanisms. Persistent-state changes need migration/recovery checks with representative data; operational changes need success/failure signals and a recovery action.

For Git-backed changes or delivery, read [dev-git](../../dev-git/SKILL.md) before changing repository content. Apply its workflow once per coordinated task; the coordinating agent owns shared Git operations. Prepare a concrete deliverable before seeking any missing publication or deployment authorization.

Use the [verification policy](verification-policy.md) for validation ownership and completion. Report results and material limitations without a separate process record. Local checks do not establish deployment or runtime behavior that was not observed.
