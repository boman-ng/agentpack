# Diagnostic Catalog

Use these patterns for a concrete maintenance question, not as a checklist or proof that something should be deleted.

## Interpreting Evidence

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
| Weak or redundant tests | Assertions miss relevant faults or repeat the same risk | Apply the [test asset maintenance rules](../SKILL.md#test-asset-maintenance) | Unique incident, protocol, concurrency, or security coverage |
| Stale documentation | Current authoritative behavior contradicts the artifact | Update or delete at its source | Records intentionally explaining past decisions |
| Defensive layering | Layers repeat one duty or address hypothetical failures | Consolidate enforcement at its actual boundary | Distinct threats, trust boundaries, and recovery obligations |
| Change amplification | Small changes repeatedly cross unrelated owners | Correct the boundary causing extra touch points | A real cross-cutting requirement |

## Consequential Removals

For disputed complexity, identify the protected outcome, when it matters, and a simpler replacement. Compare actual contracts and failure modes; ordinary success cannot settle a failure-only duty. Use an independent reviewer for consequential uncertainty when permitted, giving raw artifacts and the question without a desired verdict.

Choose checks for the affected boundary:

- **Removal or replacement:** trace callers, registrations, error behavior, and external contracts; verify retained guarantees or authorized caller migration.
- **Shared dependencies/configuration:** check affected consumers, manifests, and independent deployment boundaries.
- **Persistent state/security/recovery:** use representative historical data and relevant failure conditions in isolation when live experiments could cause harm. Preserve unresolved protections until the requirement or replacement is established.
- **Tests:** inspect existing fault coverage first. A new equivalence or fault-injection experiment follows the [verification policy](../../dev/references/verification-policy.md); the independent Tester authors it. Restore temporary changes afterward.

Prefer existing declarative configuration over executable configuration when it meets the actual need; do not replace simple code with a custom DSL.

## Agent Instructions And Skills

Inspect loaded scopes, overrides, descriptions, prompts, bodies, references, and generated sources together. On-disk content may differ from active session instructions.

Remove conflicting scope/completion rules, duplicate owners, unconditional ceremonies, and task-specific history from durable instructions. Preserve direct entrypoints and discoverable required resources. Keep optional detail in references.

Check whether the resulting guidance changes useful decisions: respects explicit goals instead of inferred intent, distinguishes observations from claims, and preserves necessary protections without speculative procedures. For consequential instruction changes, use a few representative tasks and distinguish rule reasoning from executed behavior; static consistency alone does not prove runtime improvement.
