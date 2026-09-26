# Diagnostic Catalog

Use these patterns to investigate a concrete maintenance question. They are prompts for judgment, not a checklist or proof that something should be deleted.

## Interpreting Evidence

Distinguish direct observations, supported inferences, and unknowns. A finding needs a concrete artifact, a meaningful cost or violated invariant, an owner, and a smaller action with a verification path. When evidence is missing, report the candidate and the next decisive check.

Size, unfamiliarity, authorship, static metrics, and a green suite that mirrors the implementation are not sufficient evidence by themselves. Consider runtime registration, reflection, generated code, and external consumers before concluding that a reference-free path is unused. For high-consequence mechanisms, even meaningful passing tests, no local references, or no past incidents alone cannot establish that removal is safe. Identify an actual obligation, plausible consumer scope, or decisive check; "there may be unknown consumers" is not a permanent exemption from pruning.

## Common Patterns

| Candidate | What to establish | Smallest useful action | Credible counterevidence |
|---|---|---|---|
| Obsolete behavior | The requirement ended or the path cannot serve a current consumer | Remove the behavior and its dependent artifacts together | Rare recovery, migration, or administrative duties |
| Duplicate concepts or authority | The same semantics and change reasons have multiple owners | Consolidate under the existing owner | Separate trust, deployment, or transaction boundaries |
| Misplaced responsibility | A decision violates a real ownership boundary and creates coupling | Move it to the owner and narrow callers | Composition roots and deliberate protocol translation |
| Speculative abstraction | Current variation does not justify the added concepts and indirection | Inline, narrow, or reuse a project primitive | A verified public contract or independent implementations |
| Compatibility residue | No remaining consumer, migration, or continuity obligation needs the old path | Retire the path and its associated tests, configuration, and documentation | Durable data and external consumers absent from local search |
| Inflated state model | States duplicate semantics or allow unsupported transitions | Consolidate states around the actual lifecycle | Persisted historical states and failure-only transitions |
| Dependency or configuration excess | A supported choice or capability no longer needs the extra surface | Remove or replace it at its owner | Deployment variation and platform constraints |
| Weak or redundant tests | Assertions do not detect relevant faults or duplicate the same risk | Remove or rewrite while preserving behavior evidence | Unique incident, protocol, concurrency, or security coverage |
| Stale documentation or operations | Current authoritative behavior contradicts the artifact or its owner is gone | Update or delete at the source | Historical records that intentionally explain past decisions |
| Defensive layering | Layers repeat the same duty or address only hypothetical failures | Consolidate or narrow enforcement | Distinct threats, trust boundaries, and continuity obligations |
| Change amplification | Small changes repeatedly cross unrelated concepts or owners | Correct the boundary that causes the extra touch points | A real cross-cutting requirement |

## Consequential Complexity Comparisons

When a mechanism's cost or necessity is disputed, identify the protected outcome, the condition in which it matters, its owner, the simplest valid baseline, and independent evidence that could distinguish the alternatives. Generic safety or robustness language does not establish a requirement.

Preserve the outcome while comparing implementations. Control factors that could materially confound the result, such as workload, versions, persisted data, failure conditions, and compensating mechanisms. Use existing seams; avoid lasting flags, dual paths, or experiment frameworks solely for the comparison.

A passing baseline may support simplification, but consider interactions, failure-only duties, rare conditions, external consumers, and the observation window. Narrow a mechanism when evidence supports only a specific condition. Label reasoned counterfactuals as hypotheses rather than observed results.

Omit unsupported proposed complexity. Preserve the unresolved affected part of high-consequence existing controls and identify the missing evidence and next decisive check or required authority. Use isolated tests, replay, migration rehearsal, formal or static analysis, or qualified review when live comparison would endanger a mandated outcome. Restore temporary changes before finishing. Agent uncertainty, tool limitations, or approval requirements alone do not justify project-side configuration, fallback, audit, or recovery machinery.

## Agent Instructions And Skills

Inspect the instructions actually used: applicable scopes and overrides, active session content, descriptions, default prompts, bodies, and references. Check managed or generated sources when they can replace a local edit. Files on disk may differ from what a running session loaded.

Look for concrete conflicts in authority, scope, completion, or verification, and unconditional procedures that do not serve the task. Keep descriptions focused on discovery and load supporting details only when needed. Align entrypoints around the same user intent.

For intent and judgment issues, inspect whether instructions or observed actions:

- Treat a user's diagnosis or tactic as established fact, or exempt the agent's preferred interpretation from the same scrutiny.
- Use inferred intent to silently override an explicit goal, constraint, read-only request, or authorization boundary.
- Replace domain concepts, evidence, and practical tradeoffs with expert names, jargon, or unsupported certainty.
- Turn engineering principles into abstraction quotas, erase meaningful user preferences, or demand a change when none is justified.
- Require Rule effects that merely claim compliance, repeat unchanged decisions, or disagree with actual choices, artifacts, and verification records.

Prefer removing redundant prescriptions and allowing the model to choose an appropriate method. Preserve meaningful user preferences, project knowledge, and required protections. A skill that must work independently may need a compact restatement of an essential boundary.

Static review can establish textual conflicts, stale sources, and unnecessary loading requirements. It cannot establish better task quality, lower latency, or reduced token consumption; those claims need representative behavior evidence. Do not copy every model-specific prompting recommendation into permanent instructions.

## Reporting Findings

For multiple findings, compare the evidence, owner, consequence, smallest action, confidence, and verification. Keep uncertain leads distinguishable and mention counterevidence that could change the decision. Use prose when a table adds little; avoid scalar slop scores and repeated analysis.
