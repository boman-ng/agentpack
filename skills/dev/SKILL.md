---
name: dev
description: Guide engineering decisions from requirements through verified delivery for complex feature development and changes across domain, storage, service, or runtime boundaries. Use when behavior, ownership, integration, or delivery needs coordinated design; not for ordinary local edits, cleanup alone, or project size alone.
---

# Dev

Deliver the requested behavior with maintainable ownership and credible evidence that it works. Use the depth warranted by the task's uncertainty, affected boundaries, and consequences. Reuse existing specifications, architecture, and tools; a local change with a settled contract can proceed directly to implementation and focused verification. No other skill is a prerequisite.

`SDD · DDD · Clean/Hexagonal · BDD/TDD · Implementation · DevOps`

These are connected concerns with feedback, not gated phases. Acceptance shapes the domain model; domain constraints can expose gaps in the specification; integration and operational evidence can require revisiting both. Use only the methods that resolve a real decision. Create documents, interfaces, domain objects, directory layers, or workflow artifacts only when the work needs them.

## SDD: Acceptance Contract

Use specification-driven development to establish the intended observable outcome, affected users or callers, constraints, and what would prove acceptance. Start with the project's existing requirements and contracts. Resolve ambiguity that changes behavior or scope before implementing the dependent choice; keep independent work moving.

Acceptance should distinguish a correct result from plausible failures, including failure behavior or operational limits when relevant. Keep it in the existing specification, tests, or task discussion as appropriate; a separate specification file is optional.

## DDD: Business Ownership And Invariants

Use domain-driven design to identify the business meaning, the authority for each rule, and the code or service responsible for it. Reuse the project's language. Separate a rule's meaning from transport, persistence, and presentation mechanisms; rule ownership does not require all enforcement to reside in application code.

For changes to a lifecycle or shared state, establish valid transitions and the consistency boundary. Consider concurrency, partial failure, and repeated delivery where they can violate an invariant. Use storage constraints or transactional operations where needed to enforce the invariant atomically; an application precheck alone does not establish a concurrency guarantee.

For external effects, define what callers can conclude after a timeout or retry, including an unknown outcome. Model only distinctions needed by current behavior; a function or existing module can be the right domain representation.

## Clean/Hexagonal: Necessary Dependency Boundaries

Clean emphasizes policy levels and inward source dependencies; Hexagonal emphasizes the application boundary and its interactions with external actors. Both separate business behavior from external technology without prescribing a directory layout or fixed number of layers.

Trace the production path through use-case coordination, business rules, storage, external effects, and observable results. Distinguish runtime calls from source dependencies: an application may call an external adapter while depending only on an application-owned contract. Keep framework-specific representations out of the contracts used by business policy.

Use cases coordinate application behavior; domain code defines business rules; adapters translate technical protocols and data. Inbound ports expose application operations; outbound ports express the application's needs from external collaborators. A port is a purposeful contract that an existing function or module may provide, without a separate interface declaration. Wire concrete implementations through the project's existing startup or composition mechanisms.

Use existing seams first. Add a boundary only when current isolation, verification, or actual variation needs justify its cost, even with one production implementation; hypothetical replacement alone does not. Retain direct implementations where sufficient. Do not add an interface for each class, a repository for every data type, DTOs at every layer, or layers solely to match a diagram. Check that callers cannot bypass an invariant through another entrypoint.

## BDD/TDD: Behavior Evidence

Use behavior-driven examples to connect acceptance to observable results, without requiring a particular syntax or framework. Use test-driven development when an executable example can clarify a rule, reproduce a defect, or guide an uncertain implementation: establish a meaningful failing check, implement the behavior, then improve the design while retaining that evidence. A failure must expose the intended defect rather than a broken fixture or missing environment.

Tests should target stable behavior, business contracts, and realistic failure modes. Derive expected results from requirements, independently reasoned examples, or an authoritative external contract. The implementation under test cannot be the sole oracle. Default against new tests coupled to private structure, mirroring implementation, or adding no independent fault coverage.

For a critical business path, prioritize effective verification from its production entrypoint to its observable outcome. Retain fast tests for algorithms, rules, invariants, and boundary conditions. Choose the smallest boundary that can actually expose the target fault; an integration fault needs evidence across the relevant integration. Test category alone does not establish value.

| Evidence | What it establishes | Scope limit |
|---|---|---|
| Component | Behavior of a rule or component under controlled inputs | Does not establish production wiring or external compatibility |
| Contract | Agreement at an interface against authoritative expectations, including relevant errors | Does not establish a complete business journey |
| System end-to-end | An assembled system's path from production entrypoint to observable result | Substituted external services and test configuration limit the claim |
| Real environment | Actual configuration, permissions, dependencies, and observed runtime outcome | Covers only the exercised conditions and environment |

Use substitutes at explicit external boundaries when needed; state what they replace. A successful stubbed call is not evidence that the real dependency or deployment works.

Decide separately:

- **Evidence needed now:** What uncertainty or acceptance claim remains, and which existing check or temporary experiment can resolve it?
- **Evidence worth retaining:** Does a new regression test protect stable behavior against a plausible recurring fault at reasonable maintenance cost? New code does not automatically require a new test, and a temporary experiment need not become permanent infrastructure.
- **When to execute:** Run focused checks while a decision is uncertain, then required project checks and checks selected by actual dependencies and risk before delivery. Reuse results only while the relevant code, configuration, dependencies, and environment assumptions remain valid.

Broaden verification for shared impact, failures, or unresolved risk; avoid both blind spots and repetition without new information. Test count, coverage, and a green suite do not establish acceptance. Investigate failures without weakening assertions, concealing errors, or retrying without a supported cause. Update existing tests when the accepted behavior changes; a broader test-suite consolidation or retirement effort is a separate maintenance task.

## Implementation: Complete The Behavior

Implement coherent portions of the accepted behavior through the relevant boundaries. Update affected callers and integration points with the owning rule, using the project's conventions. Revisit the contract or boundary when implementation evidence contradicts it.

Inspect the complete change for missing error paths, caller updates, and task-required configuration or documentation. Avoid broadening a feature into unrelated maintenance.

## DevOps: Delivery And Operation

Use the project's build, integration, release, and observation mechanisms to establish that the change can reach its intended environment. Check packaging and configuration where affected. For persistent-state changes, establish migration and recovery behavior with representative data; for operational changes, identify the observable success and failure signals and the recovery action.

Distinguish locally verified, built, deployed, and observed working states. Confirm the operational action and target fall within settled authorization. Prepare and verify the concrete deliverable before any required approval; do not imply that a local or simulated result proves an unperformed deployment.

Completion means the requested behavior and affected integrations satisfy acceptance, required checks are complete, and delivery or operational outcomes within the authorized scope have been verified. Report the evidence, its boundary, and any unresolved requirement. If required environment access or authority is missing, state the remaining delivery step instead of claiming completion.
