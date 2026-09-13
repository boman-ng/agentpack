---
name: cleanup
description: Use for cleanup, deslop, or simplification of existing code and agent instructions, including read-only cleanup audits; not general code review, feature development, or formatting-only changes.
---

# Cleanup

Reduce accidental complexity and future change cost while preserving user value, contracts, data, and security. Prefer fewer concepts, owners, states, dependencies, and normal paths over fewer lines. Apply the same standard to human- and AI-authored work.

Use engineering judgment to choose the approach. The principles below guide decisions; they do not require a fixed sequence, exhaustive inventory, or report template.

## Scope And Authority

Follow the user's requested scope: a diff, artifact set, boundary, or repository. Audit, explanation, and review requests are read-only; implementation requests authorize scoped cleanup and relevant verification. Carry forward valid authorization and complete the authorized work without requesting approval for every ordinary step. Skill activation does not itself authorize edits or expand the task.

Within higher-priority instructions and permission constraints, explicit user instructions override skill guidelines. Preserve unrelated user changes. If a material decision or missing authority blocks an action, explain the issue and continue independent authorized work.

Ordinary recoverable source removal is covered by a cleanup implementation request. Destructive data operations and external actions need authorization covering the actual action and target; reuse valid authorization already given.

## Maintenance Judgment

- Establish the current outcome and inspect the relevant source of truth, callers, and contracts. Read more only when it can resolve a material question.
- Decide whether the behavior or mechanism is still needed before improving its implementation. Preserve supported user outcomes and active obligations, not every historical implementation choice.
- Tie each finding to a concrete artifact, a meaningful cost or violated invariant, and a smaller action with a way to verify it. Report uncertain candidates as leads rather than treating them as proven defects.
- Prefer deletion, reuse, consolidation, relocation of responsibility, or narrowing. Consolidate shared knowledge and change reasons, not merely similar code; reuse a sound existing owner before adding an abstraction or dependency.
- Correct the owning concept or boundary. Avoid hiding problems with speculative compatibility, configuration, retries, fallbacks, wrappers, or swallowed errors.
- Omit unsupported new complexity and remove or narrow local, recoverable mechanisms when adequate evidence shows they are unnecessary. Keep compatibility and operational controls that serve current consumers, contracts, data, threats, or continuity needs. For an unresolved high-consequence mechanism, preserve the affected part and identify the missing evidence and next decisive check. Speculative unknown consumers do not justify indefinite retention.
- Use a simpler baseline or counterfactual comparison when it helps decide a consequential or disputed claim. Ordinary local changes can rely on adequate source and focused verification evidence; experiments are not mandatory.
- Preserve required safety, privacy, authorization, integrity, recovery, audit, and public-contract outcomes. Compare implementations through isolated or representative evidence when live removal could cause harm.

## Verification And Completion

Use existing project tools and the narrowest checks that cover the changed behavior. Complete required checks, then broaden only when a failure, shared impact, or remaining uncertainty warrants it. Do not add permanent testing or experiment infrastructure solely to justify cleanup.

Review the complete task diff, remove obsolete references and task-introduced excess, restore temporary experiments, and preserve unrelated work. When an obligation has ended, remove the retired path and its dependent tests, configuration, and documentation together rather than adding another compatibility layer. Tests should constrain supported behavior, not merely reflect implementation structure.

Lead with the outcome and report material evidence and limits. For an audit, distinguish findings from leads and state that no files changed. For implementation, explain what became simpler and what was verified. Use a ledger only when it helps compare findings; a small task may need only a short paragraph. No change is a valid outcome when no evidence-backed simplification is justified. Stop when the requested outcome, dependent cleanup, and relevant verification are complete; do not manufacture changes or continue speculative refactoring.

## Optional References

Read only the relevant section when the task needs more detail:

- [Diagnostic catalog](references/diagnostic-catalog.md): ambiguous maintenance findings, consequential complexity comparisons, and audits of agent instructions or skills.
- [Verification matrix](references/verification-matrix.md): choosing evidence for shared, persistent, privileged, weakly tested, or instruction-changing work.
