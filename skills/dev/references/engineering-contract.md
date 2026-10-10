# Engineering Contract

Apply this contract to the affected scope. The complete Dev suite consists of sibling `dev`, `dev-build`, `dev-clean`, `dev-test`, and `dev-git` skills and their resources. Confirm the entrypoints and required references once per task; report missing resources rather than substituting another workflow. Already-read resources need not be reloaded.

## Scope And Acceptance

Establish the observable outcome, callers, constraints, and acceptance from the task and existing contracts. Choose the simplest complete solution for current requirements, considering the affected scope's cost to understand, change, verify, and operate. Use actual operating constraints; project size and hypothetical future needs do not justify extra mechanisms. Resolve consequential ambiguity before dependent actions while continuing independent work. Use the task discussion or existing project artifacts; no separate specification is required.

Audits remain read-only. Skill selection does not authorize unrelated maintenance, publication, deployment, destructive data operations, or release metadata changes.

## Business Ownership And Architecture

Use domain-driven design: express use cases, rule owners, invariants, and consistency boundaries in the project's business language. When meanings, ownership, or cross-domain relationships change, establish each model's bounded context, source of truth, and collaboration contracts. Similar terms or structures need not share a domain model. Separate business meaning from presentation, transport, storage, and framework mechanics; functions, modules, and transaction scripts can own domain policy.

Apply Clean Architecture's inward source dependencies and Hexagonal Architecture's boundaries with external actors. Use cases coordinate work, domain owners make business decisions, and adapters translate real external protocols. Ports can be existing functions or modules; wire implementations through project composition mechanisms.

Trace the affected path from entry point through rules and external effects to results. Check that affected boundaries still express their responsibilities: address cycles, access to another domain's internals, and framework types leaking inward when they undermine the change. Reuse effective boundaries; add one for current responsibility, isolation, verification, or independent variation, even with a single external implementation. Do not require speculative extension points, class hierarchies, an interface per class, repository per table, DTO per layer, or a legacy rewrite to fit a diagram. Prefer existing module visibility and build checks to enforce useful boundaries; necessary new validation follows the shared policy.

Decide domain, code-module, and deployment boundaries separately. Split or combine services for actual ownership, security isolation, scaling, failure impact, or operating cost. An abstraction that conflates business meanings should be narrowed, split, or replaced at its owner; aliases, flags, parallel models, and wrappers must not perpetuate that mistake. Small adapters remain appropriate for real external protocol or semantic differences.

For shared state, establish valid transitions and relevant concurrency or partial-failure behavior. Preserve database constraints and atomic enforcement; a precheck alone does not prevent races. Check entry points that can bypass rules. For external effects, define outcomes after timeout, failure, or repeated delivery, including unknown outcomes where needed.

Keep defenses justified by concrete failures, trust boundaries, invariants, or required recovery outcomes; an incident need not have occurred. Reuse existing SDK and platform controls. Remove speculative defenses, same-duty duplicate checks, redundant retry layers, and error handling that conceals failure. Retrying requires a plausible recovery and safe side-effect semantics within a bounded wait; a timeout does not establish that an operation never ran. A fallback must provide an allowed business outcome without disguising failure; check whether it would amplify the fault or overload shared resources. Similar checks at distinct trust boundaries may protect different obligations.

## Evolution And Retirement

Within authorized code scope, retain compatibility only when explicitly required by the user or current project contracts. When in-scope callers can migrate together and no such requirement applies, update them with the owning contract and retire the superseded path in the same change. Use [dev-clean](../../dev-clean/SKILL.md) for retirement decisions and associated artifacts.

Investigate obligations for stored data, in-flight messages, coexisting runtime versions, and out-of-scope consumers separately. Their existence does not require permanent compatibility or authorize breaking them. Choose the necessary migration, narrow translation, or coordinated upgrade; resolve uncertain obligations before the affected removal or cutover while continuing independent work.

For large changes, deliver coherent business capabilities or verifiable migration steps, maintaining each step's invariants. Introduce temporary paths, flags, or tools only for a necessary transition; establish their purpose, exit conditions, and ownership of remaining work. Remove them when those conditions are met within authorized scope. Durable-data deletion and broader maintenance remain subject to their own scope and authority.

When a significant decision constrains later work and its rationale cannot be recovered from code, update existing project guidance, or create a short record if no suitable home exists. Keep the decision, reason, applicability, and relevant replacement or exit conditions. Mark superseded decisions accordingly; historical rationale creates no obligation to retain runtime code. Ordinary implementation details need no decision record or handoff report.

Revisit affected assumptions when requirements or observed incidents, manual compensation, capacity, latency, cost, or change coupling invalidate them. Reuse existing operational signals and task tracking; fix within the current scope and identify remaining obligations without starting unrelated work or continuous monitoring.

## Implementation And Delivery

Complete coherent behavior across callers and integration points; inspect affected failure paths, configuration, packaging, and documentation. Use project build and delivery mechanisms. Persistent-state changes need migration/recovery checks with representative data and a recovery action that works with the changed data and runtime versions; do not assume reverting code restores data. When changing derived-state update or recovery paths, establish the source of truth, allowed staleness, and necessary rebuild behavior. Operational changes need meaningful success/failure signals and a recovery action. Reuse project capabilities rather than prescribing dual writes, zero downtime, reversible migrations, or fixed retry settings.

For Git-backed changes or delivery, read [dev-git](../../dev-git/SKILL.md) before changing repository content. Apply its workflow once per coordinated task; the coordinating agent owns shared Git operations. Prepare a concrete deliverable before seeking any missing publication or deployment authorization.

Use the [verification policy](verification-policy.md) for validation ownership and completion. Report results, remaining obligations, and material limitations without a separate process record. Distinguish ready for delivery, deployed, and observed operation; local checks do not establish deployment or runtime behavior that was not observed.
