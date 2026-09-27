---
name: cleanup
description: Use for cleanup, deslop, or simplification of existing code and agent instructions, including read-only cleanup audits; not general code review, feature development, or formatting-only changes.
---

# Cleanup

Reduce accidental complexity and future change cost. Prefer fewer concepts, owners, states, dependencies, and normal paths over fewer lines. Apply the same evidence standard to human- and AI-authored work; no change is a valid outcome.

## Scope And Authority

Audit, explanation, and review requests are read-only; implementation requests authorize scoped cleanup and relevant verification. Skill activation does not authorize edits or expand scope. Within higher-priority instructions and permissions, explicit user instructions override skill guidelines. Preserve unrelated work and carry forward settled authorization.

Ordinary recoverable source removal is covered by scoped implementation authorization. Destructive data operations, other irreversible actions, privilege or credential changes, and external publication require authorization for the actual action and target. Resolve destructive targets before acting; continue independent work when only a dependent action is blocked.

## Maintenance Judgment

- Inspect the source of truth and actual callers, registration, and contracts; use search to locate relevant code, then read enough context to establish behavior.
- Identify what a mechanism serves before improving or removing it; retire ended obligations without treating historical implementation choices as requirements.
- Tie findings to a concrete artifact, meaningful cost or violated invariant, and a smaller action with a verification path; separate uncertain leads from supported findings.
- Prefer deletion, reuse, consolidation, relocation, or narrowing; share repeated knowledge rather than merely similar syntax, and investigate established options before a custom solution when local capabilities do not suffice.
- Default to breaking changes within authorized code scope: update known callers and remove old paths and dependent artifacts; retain compatibility only when the user explicitly requires it, resolving durable-data and out-of-scope contract impacts separately.
- Fix the owning boundary instead of hiding legacy behavior with glue; keep adapters only for real protocol differences and defenses only for concrete failures, trust boundaries, or required outcomes.
- Preserve required safety, privacy, authorization, integrity, audit, recovery, and public-contract outcomes while simplifying their implementation.
- Preserve unresolved high-consequence protections while identifying the missing evidence or authority and next decisive check; neither passing tests nor hypothetical unknown consumers settle the issue alone.
- If local inspection leaves a material ambiguity, disagreement, or blind spot affecting architecture, correctness, data, or substantial cost, delegate a focused researcher/scout investigation and verify its evidence; if unavailable, disclose that limit and investigate directly.
- When evidence contradicts the diagnosis or repeated attempts add no information, reconsider the approach before adding patches; use independent review for consequential disputed claims, without a fixed reviewer sequence or concurrency quota.

## Verification And Completion

Use existing tools and the narrowest checks that cover changed behavior, including required project checks. Broaden only for failures, shared impact, or residual uncertainty. Restore temporary experiments; do not create permanent experiment infrastructure just to justify cleanup.

Inspect the complete task diff and remove task-introduced excess and obsolete dependent tests, configuration, and documentation. Judge tests by the active behavior and faults they detect, not their count or coverage score.

Explain material choices with `Decision — <principle or constraint>: <evidence or uncertainty> → <action>; <result or next check, when needed>.` Name the principle or concrete constraint before the colon. Follow an applicable global output convention when present; do not duplicate it. Emit only for choices actually affected, include a decisive next check for unresolved uncertainty, and distinguish plans from observed results.

For audits, rank supported findings by consequence when useful, separate leads, and state that no files changed; zero findings is valid. For implementation, report what became simpler and what was verified. Stop when the requested outcome, dependent cleanup, and necessary checks are complete.

## Optional References

Read only the section needed for the current question:

- [Diagnostic catalog](references/diagnostic-catalog.md): ambiguous findings, complexity comparisons, independent review, and instruction audits.
- [Verification matrix](references/verification-matrix.md): evidence for shared, persistent, privileged, weakly tested, or instruction-changing work.
