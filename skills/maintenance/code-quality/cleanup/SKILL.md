---
name: cleanup
description: Evidence-driven maintenance audit and pruning for existing codebases and diffs. Use when Codex needs to clean up AI-assisted or human-authored development slop; deslop, simplify, or unbloat code; reduce accidental complexity or technical debt; remove dead, duplicate, obsolete, speculative, compatibility, fallback, wrapper, glue, state, dependency, configuration, documentation, or test paths; consolidate ownership and sources of truth; counterfactually test whether safeguards, abstractions, compatibility, fallback, recovery, or operational machinery earn their lifecycle cost; or review uncommitted changes for unnecessary implementation while preserving verified behavior. Support both diagnosis-only reviews and explicitly authorized cleanup implementation; do not use for AI-authorship detection or style-only rewriting.
---

# Cleanup

## Objective

Reduce accidental complexity and future change cost while preserving verified user value, external contracts, data, and security. Treat slop as an accepted or proposed change whose local plausibility is not matched by sufficient lifecycle value, evidence, ownership, or evolvability.

Optimize for fewer concepts, owners, sources of truth, normal paths, states, dependencies, and future touch points—not for minimum lines of code. Accept a local code increase when it removes greater system complexity or adds an executable invariant that materially reduces risk.

Apply one quality standard to human- and AI-authored work. Treat AI provenance only as optional governance metadata, never as a quality classifier.

## Core Contract

- Preserve verified behavior unless the user explicitly authorizes changing or removing it.
- Give each important concept one name, one owner, one source of truth, and one normal path.
- Prefer deletion, consolidation, relocation, and narrowing before adding an abstraction.
- Require new complexity to remove greater complexity or enforce an important verified invariant.
- Preserve compatibility only for a verified consumer, public contract, migration, or continuity need; otherwise treat it as a costly parallel path.
- Keep mutation, validation, idempotency, recovery, and audit evidence with the boundary that owns them.
- Separate observed facts, supported inferences, assumptions, and unknowns.
- Preserve user changes and unrelated work. Never discard, overwrite, or rewrite them to make cleanup easier.
- Respect request authority: diagnose when asked to review; edit only when implementation or cleanup is authorized.
- Stop when the requested scope and verification boundary are satisfied.

## Counterfactual Complexity Gate

Treat each non-trivial mechanism as a claim that its lifecycle cost buys a current project outcome. When its necessity, scope, or effectiveness is material or disputed, record:

- **Protected outcome:** the current user value, contract, or invariant to preserve.
- **Relevant condition:** the load, trust boundary, failure, threat, migration, or continuity event in which it matters.
- **Owner:** the boundary responsible for that outcome.
- **Baseline:** omission or the simplest valid owner-local replacement.
- **Oracle:** an independent observable expected to differ when the mechanism is neutralized.
- **Lifecycle cost:** concepts, owners, paths, states, dependencies, configuration, operational objects, and future touch points introduced.

Generic robustness, safety, production-readiness, best-practice, future-proofing, graceful-degradation, or defense-in-depth language is not evidence. Preserve the outcome while ablating the implementation mechanism.

A reasoned counterfactual is a hypothesis, not an observed result. Label whether the evidence is static, test-based, simulated, replayed, canaried, runtime-observed, or based on qualified accountable judgment.

Use asymmetric defaults:

- For proposed complexity, an unresolved claim means do not add it.
- For existing local and reversible complexity, use the smallest bounded comparison and simplify when the baseline preserves the outcome.
- For existing high-consequence controls, contracts, or durable data paths, unresolved evidence means preserve and escalate rather than delete.

An unchanged result does not settle the claim. Check credible redundancy, interaction, rare or failure-only duties, external consumers, compensating mechanisms, and observation-window limits before classification.

Use existing seams and project-native tools. Do not add lasting flags, wrappers, dual paths, telemetry, or experiment frameworks solely to satisfy this gate. Apply the full gate only to non-trivial, costly, disputed, layered, public, persistent, privileged, or precautionary mechanisms; use a minimal counterfactual check for obvious local reversible changes.

## Route the Request

Determine the narrowest scope that satisfies the request:

- **Change-set cleanup:** inspect staged, unstaged, branch, patch, or equivalent supplied changes and remove task-unnecessary material within the authorized scope.
- **Boundary cleanup:** inspect a named feature, module, service, workflow, state machine, schema, or test area.
- **Repository audit:** produce a prioritized evidence ledger across the repository; implement only the bounded slices the user authorizes.

Determine whether the request authorizes mutation. Keep all inspection read-only when the user asks for an audit, explanation, diagnosis, or review.

Use the common diagnostic workflow through Step 4 for every request. For diagnosis-only work, stop there and report evidence, counterevidence, proposed actions, missing evidence, and a proportionate verification plan. Continue through Steps 5–8 only when mutation is explicitly authorized.

Find and follow repository instructions before analysis. Use project-native architecture, build, test, lint, type, dependency, and runtime tools. Do not install a generic cleanup toolchain by default.

## Require Evidence Before Calling Something Slop

Promote a candidate to an actionable cleanup finding only when all four are available:

1. A concrete artifact or behavior.
2. A violated invariant or credible lifecycle cost.
3. The owning concept or boundary.
4. A smaller justified action and a way to verify it.

Record uncertain investigation leads separately when one or more elements are missing. State the missing evidence and next decisive check; do not modify code based on an investigation lead.

Do not treat any of these as sufficient evidence by itself:

- AI-like prose, comments, naming, or formatting.
- High line count or a large file.
- An unfamiliar pattern.
- A code-smell, coupling, complexity, coverage, or mutation score.
- An unused-reference result when reflection, generated code, plugins, configuration, or external consumers may exist.
- A green test suite generated or modified by the same implementation without an independent behavior oracle.

Read [references/diagnostic-catalog.md](references/diagnostic-catalog.md) when the scope is broad, the classification is uncertain, or multiple forms of slop interact.

## Workflow

### 1. Frame the Outcome and Challenge the Premise

State the intended user or system outcome, current behavior, inputs, outputs, constraints, invariants, risks, non-goals, and completion evidence.

Ask in order:

1. Should this behavior or mechanism exist?
2. Can the goal be met by deleting or not changing anything?
3. Does the project or platform already own this capability?
4. Can one existing path absorb the requirement?
5. What is the smallest complete change?

Reject implementation polish on an invalid or unverified premise. Do not invent product value or silently remove a real contract.

For each material mechanism, formulate the complexity claim before judging the implementation:

> Under &lt;relevant condition&gt;, &lt;mechanism&gt; preserves &lt;current outcome or invariant&gt;, owned by &lt;boundary&gt;; without it, &lt;independent oracle&gt; should show &lt;observable loss&gt;.

Do not accept safer, more robust, production-ready, future-proof, or best practice as the protected outcome.

### 2. Inspect Sources of Truth and Establish a Baseline

Inspect before designing:

- Repository instructions and relevant standards.
- Project-native version-control status, change-set relationships, and the complete relevant diff or review surface when available; otherwise use the supplied patch, artifact set, or filesystem snapshot.
- Architecture maps, manifests, dependency declarations, schemas, state definitions, and public contracts.
- Owners, callers, consumers, runtime registration, configuration, and generated-code boundaries.
- Relevant tests, fixtures, documentation, incidents, deprecation evidence, and runtime behavior.

Use `rg` or project-native structured tools before ad hoc scanning. Run the narrowest meaningful existing check first when behavior is at risk. Do not use static presence as a substitute for runtime evidence when the claim is dynamic.

Do not run a full build or test matrix merely to establish a clean baseline for a diagnosis-only audit. Form a concrete falsifiable claim first, then run only the check needed to evaluate that claim.

For a material complexity claim, compare the mechanism with omission and with the simplest valid owner-local alternative. Keep interfaces, workload, capacity, timeout budget, input data, versions, upstream and downstream state, fixtures, observation windows, and compensating mechanisms equivalent where they could confound the result.

### 3. Build a Slop Ledger

Record only actionable findings:

| ID | Evidence | Root cause | Owner/boundary | Lifecycle consequence | Smallest action | Confidence | Verification |
|---|---|---|---|---|---|---|---|

Classify the root cause as one of:

- invalid or obsolete premise;
- duplicate concept or authority;
- ownership error;
- boundary violation;
- contract conflict;
- state-model defect;
- obsolete path or incomplete migration;
- test, dependency, configuration, documentation, or operational residue.

Avoid a scalar slop score. Prioritize by evidence confidence, lifecycle benefit, reversibility, affected boundary, and blast radius.

For investigation leads, record the observed signal, missing evidence, consequence if confirmed, and next decisive check outside the actionable ledger.

Do not expand the ledger into an experiment-management system. When a retry, fallback, compatibility or security layer, recovery mechanism, flag, abstraction, configuration, cache, queue, state machine, audit control, or other material mechanism needs counterfactual analysis, append only:

**Complexity claim — &lt;finding ID&gt;**

- Protected outcome:
- Relevant condition:
- Simplest baseline:
- Independent oracle:
- Expected or observed ablation delta:
- Confounders and interactions:

### 4. Select the Smallest Complete Slice

Prefer actions in this order:

1. Delete an unnecessary behavior, path, state, dependency, option, file, test, fixture, or document.
2. Consolidate duplicate semantics under the existing owner.
3. Relocate misplaced responsibility to its owning boundary.
4. Rename or narrow a confused contract.
5. Add an abstraction only when proven repetition or a durable boundary makes it remove more complexity than it adds.

Keep feature changes, behavior changes, mechanical movement, and unrelated cleanup separate. Do not broaden a local cleanup into a platform rewrite.

Classify counterfactual evidence before selecting the action:

- If the baseline violates the invariant and the mechanism restores it, retain the smallest effective mechanism.
- If a simpler alternative produces the same result, replace the complex mechanism.
- If removing one mechanism has no effect because another compensates, perform only the necessary safe joint comparison and consolidate redundant ownership.
- If the mechanism matters only under a named condition, narrow it to that condition.
- If removal improves correctness, performance, or operability, delete or redesign the mechanism.
- If no credible oracle exists or the condition cannot be reproduced, omit proposed complexity; preserve and escalate high-consequence existing controls.

When a consequential architecture or build-versus-adopt decision remains uncertain after repository inspection, inspect current primary sources and mature implementations. If independent subagents are available, use one bounded evidence pass without leaking the expected conclusion. Do not delay straightforward, well-evidenced deletion for ceremonial research.

For diagnosis-only work, stop implementation here. Report inspected scope, actionable findings, investigation leads, strongest counterevidence, proposed smallest actions, verification plans, and evidence limits. Do not claim that anything was cleaned or report a realized net complexity delta.

## Implementation Path — Mutation Authorized

### 5. Establish the Safety Boundary

For behavior changes, bug fixes, migrations, and regression-prone cleanup, demonstrate the existing behavior or failure and add or identify a focused test before implementation where practical.

Never ablate a mandated safety, privacy, authorization, integrity, audit, recovery, compliance, durable-data, or public-contract outcome. Hold the invariant constant and compare owner-local implementations through isolated tests, representative replay, fault injection, static or formal analysis, migration rehearsal, or qualified review when live removal could cause unacceptable harm.

Use independent oracles:

- public behavior and contract assertions;
- state-transition and persistence invariants;
- externally observable CLI, API, UI, or workflow behavior;
- migration round trips or representative data;
- property, mutation, fuzz, concurrency, or security checks only where the identified risk warrants them.

Do not preserve tests merely because they exist. Remove or rewrite tests that protect deleted behavior, implementation trivia, obsolete compatibility, invalid mocks, or assertions that do not constrain outcomes.

### 6. Execute in Small Reversible Steps

Apply one coherent change at a time. Run the narrow check after each risk-bearing step, then broaden when shared behavior or contracts are affected.

During implementation:

- Reuse the existing project or platform primitive when it is sound.
- Change one material factor at a time when performing a bounded comparison, and remove temporary mutations or substitutions before completion.
- Remove the old path in the same bounded change when no verified migration need exists.
- Do not add aliases, shims, adapters, fallback branches, glue layers, broad casts, or swallowed errors to make the cleanup appear safe.
- Do not add speculative configuration, extension points, generic managers, providers, factories, or dependencies.
- Do not defend against failures outside the observed threat or failure model.
- Keep errors explicit and owner-local.

### 7. Verify Proportionally

Run project-native sensors from narrowest to broadest. Read [references/verification-matrix.md](references/verification-matrix.md) when choosing checks for shared, persistent, privileged, destructive, release, or weakly tested changes.

For local reversible cleanup, stop after focused relevant checks and complete diff review when they fully cover the claim. Broaden verification only when repository policy requires it, the change affects a shared contract or build surface, or narrower checks cannot isolate the risk. Do not spend more verification effort than the residual risk and evidence gap justify.

Distinguish:

- implementation presence;
- static verification;
- simulated or test evidence;
- runtime evidence;
- achieved user outcome.

Treat coverage and static metrics as gap-finding and triage signals, not acceptance verdicts. Keep a sensor only when it protects a named invariant, has an owner and response, and saves more work than its false positives create.

Where safe and economical, neutralize the mechanism and confirm that an independent oracle fails for the claimed reason under the relevant condition. Restore the mechanism or substitute the simpler baseline and confirm that the invariant recovers. Prefer focused manual mutation, dependency substitution, an existing test seam, replay, or fault injection; do not install a general mutation-testing, chaos, telemetry, or experiment framework by default.

### 8. Deslop the Final Change Set

Read the complete task change set using the project-native review surface when available, and explain every non-trivial change. Then:

- Remove only modifications introduced by the current cleanup or explicitly placed in scope that are not required by the stated outcome.
- Preserve pre-existing unrelated changes exactly; report them rather than cleaning, splitting, reverting, or rewriting them without separate authorization.
- Split unrelated changes introduced by the current cleanup.
- Search for references to deleted paths, names, states, flags, dependencies, and tests.
- Check for newly introduced duplicate authority, parallel paths, compatibility, glue, fallback, or speculative abstraction.
- Confirm that tests assert behavior and were not weakened merely to turn green.
- Confirm that user changes and unrelated files remain intact.
- Run formatting and diff-integrity checks when available.

Perform a final self-ablation of the task change set. For each newly introduced non-trivial concept, state, branch, option, dependency, compatibility path, fallback, wrapper, test fixture, or operational object, ask:

1. Which current outcome requires it?
2. Which independent check would detect its removal?
3. Can an existing owner or simpler baseline satisfy the same outcome?
4. Does removing it reduce future touch points without weakening a verified invariant?

Remove task-introduced complexity that cannot answer these questions.

If the result is harder to explain or requires more future touch points, continue simplifying or report why the complexity is essential.

## Report the Result

For diagnosis-only work, lead with the audit conclusion and include inspected scope, actionable findings, investigation leads, counterevidence, proposed actions, verification plans, and evidence limits. State explicitly that no files were changed.

For authorized implementation, lead with the achieved maintenance outcome. Include:

1. **Scope and preserved contract:** what was cleaned and what behavior remained authoritative.
2. **Root causes and decisions:** what was deleted, consolidated, relocated, renamed, narrowed, or deliberately retained after its complexity claim was supported, with evidence.
3. **Verification:** exact static, test, runtime, migration, or review evidence and its limits.
4. **Net complexity delta:** report applicable changes in files and source lines, concepts, owners, normal paths, states/transitions, public interfaces, dependencies/options, tests/fixtures, and architecture violations.
5. **Residual risk:** unresolved unknowns, external contracts, weak evidence, or follow-up work that remains genuinely necessary.

Do not claim a complexity reduction from LOC alone. A useful net delta may include added tests alongside fewer behaviors, states, dependencies, and paths.

## Stop and Escalate

Stop implementation and request direction when deleting or changing a high-impact contract requires a product choice, external authority, unavailable consumer evidence, or destructive migration authorization.

Report an uncertain candidate instead of deleting it when evidence remains weak and the blast radius is material. Continue through ordinary implementation uncertainty when a narrow reversible path and adequate verification exist.

Stop cleanup when:

- **Diagnosis-only:** the requested scope was inspected, evidence was calibrated, actionable findings and investigation leads were separated, missing evidence and next checks were stated, and no mutation occurred.
- **Authorized implementation:** the requested outcome and verification boundary are met, scoped root causes are removed rather than wrapped, no task-unnecessary cleanup changes remain in the change set, and additional work would be speculative optimization.

## Example Invocations

- “Use `$cleanup` to review the current uncommitted diff, remove task-unnecessary abstractions and tests, verify it, and report the net complexity change.”
- “Use `$cleanup` to audit this state machine for duplicate states and obsolete transitions. Diagnose only; do not edit.”
- “Use `$cleanup` to prune dead compatibility paths and outdated tests from this module while preserving its public behavior.”
