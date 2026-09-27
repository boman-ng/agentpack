# Diagnostic Catalog

Use these patterns for a concrete maintenance question, not as a checklist or proof that something should be deleted.

## Interpreting Evidence

A finding connects an artifact, meaningful cost or violated invariant, responsible owner, and smaller action with a verification path. Separate observations, inferences, and unknowns; an uncertain candidate needs a decisive next check.

Size, unfamiliarity, authorship, static metrics, or passing tests alone do not justify removal. Trace actual callers and runtime registration, reflection, generated code, or external consumers where relevant. Search narrows the investigation; read complete relevant contracts or files when excerpts could conceal behavior, without requiring a full-repository read.

## Common Patterns

| Candidate | What to establish | Smallest useful action | Credible counterevidence |
|---|---|---|---|
| Obsolete behavior | The requirement ended or the path cannot serve a current consumer | Remove the behavior and its dependent artifacts | Rare recovery, migration, or administrative duties |
| Duplicate knowledge | The same semantics and change reasons have multiple owners | Consolidate under the existing owner | Separate trust, deployment, or transaction boundaries |
| Misplaced responsibility | An ownership violation creates coupling or exposes internals | Move the decision to its owner and narrow callers | Composition roots and actual protocol translation |
| Speculative abstraction | Current variation does not justify the indirection | Inline, narrow, or reuse a project primitive | Required contracts or independent implementations |
| Compatibility residue | In-scope callers can migrate and no explicit requirement retains the old contract | Update callers and retire old code, tests, configuration, and documentation | Durable data, out-of-scope consumers, or an explicit compatibility requirement |
| Inflated state model | States duplicate semantics or permit unsupported transitions | Consolidate around the actual lifecycle | Persisted historical states and failure-only transitions |
| Dependency or configuration excess | Supported requirements do not need the extra surface | Remove it or use an existing capability | Deployment variation and platform constraints |
| Weak or redundant tests | Assertions miss relevant faults or repeat the same risk | Remove or rewrite while preserving behavior evidence | Unique incident, protocol, concurrency, or security coverage |
| Stale documentation | Current authoritative behavior contradicts the artifact | Update or delete at its source | Records intentionally explaining past decisions |
| Defensive layering | Layers repeat one duty or address hypothetical failures | Consolidate enforcement at its actual boundary | Distinct threats, trust boundaries, and recovery obligations |
| Change amplification | Small changes repeatedly cross unrelated owners | Correct the boundary causing extra touch points | A real cross-cutting requirement |

## Targeted Judgment Methods

- **Understand before removal (Chesterton's fence):** Identify the outcome or obligation a mechanism served and whether it still exists; remove ended obligations, while resolving evidence or authority for high-consequence protections instead of keeping all legacy behavior indefinitely.
- **Least power:** When selecting a configuration or representation, prefer an existing declarative format that meets the requirement over executable configuration or a custom DSL; do not force computation into a more complex configuration language merely to avoid code.
- **Independent counterevidence:** For a consequential disputed candidate, give a separate reviewer the raw artifacts, scope, and question without the desired verdict; ask for counterexamples or missed contracts, then verify the claims yourself, with zero findings an acceptable result.

These are conditional methods, not mandatory audit stages. Split independent questions into small scopes when useful; never require every slot to be occupied or extra CLI sessions to bypass host limits.

## Consequential Complexity Comparisons

For a disputed mechanism, identify the protected outcome, the condition in which it matters, its owner, and a simpler valid baseline. Choose evidence that distinguishes explanations; generic robustness claims do not establish a requirement. Treat a failed check as evidence to investigate, including whether the check itself is sound.

Use existing seams and isolated comparisons when live removal could harm data, security, recovery, or required contracts. Account for material workload, version, persisted-state, and failure-condition differences. Passing ordinary cases does not establish correctness in failure-only duties; label unobserved counterfactuals as hypotheses.

Preserve only the unresolved affected protection and name the missing evidence or authority and next check. Do not create lasting flags, dual paths, or experiment frameworks for a one-time comparison; restore temporary changes. Agent uncertainty or tool limits do not justify project-side fallback or approval machinery.

## Agent Instructions And Skills

Inspect what is actually loaded: scopes, overrides, descriptions, default prompts, bodies, references, and managed or generated sources. Files on disk may differ from active session content.

Look for conflicts in authority, scope, completion, or verification, and unconditional procedures that do not change useful decisions. Keep discovery descriptions precise and conditional details in references. A standalone skill may need a compact essential boundary even when global instructions also express it.

Check whether the instructions or observed behavior:

- Treat the user's diagnosis, or the agent's preferred interpretation, as established fact.
- Use inferred intent or a proxy metric to override an explicit goal, method, read-only limit, or authorization boundary.
- Invoke engineering principles to create abstractions, preserve retired interfaces, erase preferences, or demand unjustified changes.
- Substitute expert names, confidence, or agreement between agents for evidence.
- Print `Decision` statements that repeat compliance, conceal uncertainty, or disagree with actual actions and verification.

Static review establishes textual conflicts and stale guidance, not better model performance. Preserve meaningful preferences and required protections while removing redundant prescriptions; do not copy every model-specific prompting recommendation into permanent rules.

## Reporting Findings

Rank supported findings by consequence when useful, giving evidence, owner, smallest action, and verification. Separate uncertain leads and meaningful counterevidence. State the scope actually inspected without claiming exhaustive coverage. Use prose when a table adds little; do not assign scalar slop scores or invent findings to fill a report.
