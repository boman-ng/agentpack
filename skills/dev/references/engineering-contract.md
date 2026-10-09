# Engineering Contract

This is the common engineering contract for the Dev suite. Apply its obligations to the affected scope; the size of the project does not determine the amount of structure required.

## Scope And Acceptance

Establish the requested observable outcome, users or callers, constraints, authorization, and evidence that distinguishes acceptance from plausible failure. Reuse existing requirements and contracts. Resolve ambiguity that changes behavior or scope before the dependent action; continue independent work.

Keep the contract in the task discussion, existing specification, or other project-owned artifact as appropriate. A separate specification is optional. Audit requests remain read-only. Skill selection does not authorize unrelated maintenance, deployment, publication, destructive data operations, or changes to release metadata.

## Business Ownership

Use the project's business language. Identify the use cases, the owner of each affected rule, its invariants, and the consistency boundary. Separate the rule's meaning from presentation, transport, storage, and framework mechanics. Functions, modules, and transaction scripts are legitimate implementations of business policy; domain-driven design does not require a class hierarchy.

For shared state or lifecycles, establish valid transitions and the concurrency or partial-failure conditions that can break an invariant. Keep database constraints and atomic transactional enforcement where they protect the rule. An application precheck alone does not establish a concurrency guarantee. Check relevant entry points for ways to bypass the invariant.

For external effects, establish what a caller can conclude after a timeout, failure, or repeated delivery, including an unknown outcome when relevant. Model distinctions required by the current behavior.

## Dependencies And Boundaries

Apply Clean Architecture's inward source dependencies and Hexagonal Architecture's purposeful boundaries with external actors. Business policy must not acquire unnecessary dependencies on transport, persistence, or framework representations. Runtime calls can reach an external adapter while source dependencies point toward an application-owned contract.

Use cases coordinate behavior; rule owners define business decisions; adapters translate actual external protocols and data. An inbound port exposes an application operation, and an outbound port expresses a real need from an external collaborator. An existing function or module can provide either contract without a separate interface declaration. Wire concrete implementations with the project's composition mechanisms.

Trace the affected production path from entry point through rules, storage and external effects to the observable result. Reuse existing seams first. Add a boundary when current isolation, verification, or actual variation justifies its cost, even with one implementation. Hypothetical replacement alone does not justify it. Do not require an interface per class, repository per table, DTO per layer, or directory template.

For existing ORM or framework coupling, avoid a whole legacy rewrite solely to obtain an ideal diagram. Keep the scoped change coherent, avoid adding unnecessary coupling, and record relevant isolation or verification limits. Preserve atomic storage enforcement when separating responsibilities.

## Implementation And Delivery

Complete coherent portions of the accepted behavior across actual callers and integration points. Revisit an owning rule or contract when evidence contradicts the design; do not mask an obsolete path with a parallel implementation. Inspect the full change for missed callers, required failure behavior, configuration, packaging, and documentation within scope.

Use project build, integration, release, and observation mechanisms where affected. For persistent-state changes, establish migration and recovery behavior with representative data. For operational changes, identify success and failure signals and the recovery action. Prepare the concrete deliverable before any required approval; deployment still requires authorization for its action and target.

## Repository Work

For Git-backed work, explicitly read [dev-git](../../dev-git/SKILL.md) before changing repository content or performing version-control delivery. It owns branch selection, commit organization, integration, workspace ownership, and remote-write authorization. Apply that workflow once per coordinated task, including directly invoked build, clean, or test work; do not make each subagent independently manage shared Git state. Audits remain read-only.

## Completion

Use the [verification policy](verification-policy.md) for evidence selection and agent ownership. Stop when acceptance and evidence at the actual affected boundaries are satisfied, required project checks are complete, and no material risk remains unresolved within scope. Repeat or broaden checks only for new changes, failures, shared impact, or unresolved uncertainty.

Distinguish locally checked, built, deployed, and observed working states. Report what changed, the evidence and its boundary, and material limits. Missing access or authorization leaves a named delivery step outstanding; local or simulated evidence does not prove an unperformed deployment.
