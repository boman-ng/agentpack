---
name: dev-clean
description: Simplify, consolidate, or retire existing code, tests, configuration, documentation, and agent instructions, including read-only cleanup audits. Use for maintenance, not new feature design, general code review, or formatting alone.
---

# Dev Clean

Reduce the cost of understanding and changing existing work by removing unnecessary concepts, owners, states, dependencies, and paths. Select this skill for a maintenance purpose, regardless of project size. No change is a valid outcome.

## Required Context

Even when invoked directly, read the shared [engineering contract](../dev/references/engineering-contract.md) and [verification policy](../dev/references/verification-policy.md). Confirm the sibling `dev`, `dev-build`, `dev-clean`, and `dev-test` entry points are available. Report an incomplete Dev suite and missing paths if required resources are absent; do not silently replace them.

Audits and explanations remain read-only. Apply edits only within the requested maintenance scope; skill selection does not expand authorization. Use [dev-build](../dev-build/SKILL.md) for requested production development, explicitly reading that entry point when the scope includes it.

## Maintenance Decisions

- Trace authoritative behavior, actual callers, registration, and contracts before changing a mechanism. Establish which current obligation it serves; historical implementation choices alone do not preserve that obligation.
- Tie a finding to a concrete artifact, meaningful maintenance cost or violated invariant, and a smaller action with a way to verify it. An uncertain removal candidate needs a decisive next check.
- Choose deletion, consolidation, relocation, or narrowing according to the cause of complexity. Consolidate repeated knowledge under its owner; preserve independent responsibilities even when their syntax resembles one another.
- When retiring a path, update known callers and remove its registrations, aliases, tests, configuration, and documentation together. Check persisted formats and out-of-scope consumers separately from source removal; preserve unresolved data, security, recovery, and required-contract protections.

## Test Asset Maintenance

Judge a test by its active behavior and the plausible faults it detects. Compare setup, assertions, boundaries, and failure modes before consolidation: similar assertions can expose different faults. Repair an invalid test against its authoritative contract rather than the current implementation's output.

Use the shared verification policy's deletion exception for proven obsolete or redundant tests. Verify retained relevant fault coverage before retiring unique evidence. Explicitly read [dev-test](../dev-test/SKILL.md) and arrange independent Tester ownership for new assertions, semantic replacements or merges, or new equivalence experiments. Broad test-suite cleanup must be within the user's maintenance scope.

## Completion

Verify maintained behavior and closure of removed paths with existing project checks suited to affected consumers, and independent new validation when needed. Inspect the full task diff for orphaned artifacts and accidental scope expansion. Report supported findings for an audit, or what became simpler and the evidence for retained outcomes after edits. Apply the shared stopping rules.

## Optional References

Read only the material needed for the maintenance question:

- [Diagnostic catalog](references/diagnostic-catalog.md): ambiguous candidates, complexity comparisons, and instruction audits.
- [Verification matrix](references/verification-matrix.md): evidence for replacement, removal, and consolidation across affected boundaries.
