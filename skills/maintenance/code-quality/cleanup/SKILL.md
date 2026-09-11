---
name: cleanup
description: Audit or simplify existing code, diffs, and agent instructions. Use for maintenance review, deslop, consolidation, and pruning while preserving verified behavior; not feature development or style-only rewriting.
---

# Cleanup

Reduce accidental complexity and future change cost while preserving user value, contracts, data, and security. Prefer fewer concepts, owners, states, dependencies, and normal paths over fewer lines. Apply the same standard to human- and AI-authored work.

Use engineering judgment to choose the approach. The principles below guide decisions; they do not require a fixed sequence, exhaustive inventory, or report template.

## Scope And Authority

Follow the user's requested scope: a diff, artifact set, boundary, or repository. Audit and review requests are read-only; implementation requests authorize scoped cleanup and relevant verification. Carry forward valid authorization and complete the authorized work without requesting approval for every ordinary step.

Within higher-priority instructions and permission constraints, explicit user instructions override skill guidelines. Preserve unrelated user changes. If a material decision or missing authority blocks an action, explain the issue and continue independent authorized work.

## Maintenance Judgment

- Establish the current outcome and inspect the relevant source of truth, callers, and contracts. Read more only when it can resolve a material question.
- Tie each finding to a concrete artifact, a meaningful cost or violated invariant, and a smaller action with a way to verify it. Report uncertain candidates as leads rather than treating them as proven defects.
- Prefer deletion, consolidation, relocation, or narrowing. Reuse a sound existing owner before adding an abstraction or dependency.
- Correct the owning concept or boundary. Avoid hiding problems with speculative compatibility, configuration, retries, fallbacks, wrappers, or swallowed errors.
- Keep compatibility and operational controls that serve current consumers, contracts, data, threats, or continuity needs. Missing evidence does not justify removing an unresolved high-consequence mechanism.
- Use a simpler baseline or counterfactual comparison when it helps decide a consequential or disputed claim. Ordinary local changes can rely on adequate source and focused verification evidence; experiments are not mandatory.
- Preserve required safety, privacy, authorization, integrity, recovery, audit, and public-contract outcomes. Compare implementations through isolated or representative evidence when live removal could cause harm.

## Verification And Completion

Use existing project tools and the narrowest checks that cover the changed behavior. Complete required checks, then broaden only when a failure, shared impact, or remaining uncertainty warrants it. Do not add permanent testing or experiment infrastructure solely to justify cleanup.

Review the complete task diff, remove obsolete references and task-introduced excess, restore temporary experiments, and preserve unrelated work. Tests should constrain supported behavior, not merely reflect implementation structure.

Lead with the outcome and report material evidence and limits. For an audit, distinguish findings from leads and state that no files changed. For implementation, explain what became simpler and what was verified. Use a ledger only when it helps compare findings; a small task may need only a short paragraph. Stop when the requested outcome and appropriate verification are complete.

## Optional References

Read only the relevant section when the task needs more detail:

- [Diagnostic catalog](references/diagnostic-catalog.md): ambiguous maintenance findings, consequential complexity comparisons, and audits of agent instructions or skills.
- [Verification matrix](references/verification-matrix.md): choosing evidence for shared, persistent, privileged, weakly tested, or instruction-changing work.
