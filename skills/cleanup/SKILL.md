---
name: cleanup
description: Simplify, consolidate, or retire existing code, tests, configuration, documentation, and agent instructions, including read-only cleanup audits. Use for maintenance, not new feature design, general code review, or formatting alone.
---

# Cleanup

Reduce the cost of understanding and changing existing work by removing unnecessary concepts, owners, states, dependencies, and paths. Select this skill for a maintenance purpose, regardless of project size. Feature design and full development delivery are outside its scope; no other skill is a prerequisite.

Audits and explanations remain read-only. Apply edits only within the requested maintenance scope; skill selection does not expand authorization. No change is a valid outcome.

## Maintenance Decisions

- Trace the authoritative behavior, actual callers, registration, and contracts before changing a mechanism. Establish which current obligation it serves; historical implementation choices alone do not preserve that obligation.
- Tie a finding to a concrete artifact, meaningful maintenance cost or violated invariant, and a smaller action with a way to verify it. An uncertain removal candidate needs a decisive next check.
- Choose deletion, consolidation, relocation, or narrowing according to the cause of complexity. Consolidate repeated knowledge under its owner; preserve independent responsibilities even when their syntax resembles one another.
- When retiring a path, update known callers and remove its registrations, aliases, tests, configuration, and documentation together. Check persisted formats and out-of-scope consumers separately from source removal; preserve unresolved data, security, recovery, and required-contract protections.

## Test Asset Maintenance

Judge an existing test by the active behavior and plausible fault it can detect. Remove or rewrite tests for retired behavior, tests coupled to private structure, and duplicates without independent fault coverage. Preserve unique evidence for active rules, boundary conditions, incidents, protocols, concurrency, security, and recovery; speed or test category alone does not determine value.

Before consolidating tests, compare their setup, assertions, boundaries, and failure modes. Similar assertions can expose different faults. A smaller suite must still detect the required failures; verify any replacement before retiring unique coverage. Repair an invalid test against its authoritative contract, not against the current implementation's output.

## Completion

Verify the maintained behavior and the closure of removed paths with existing project checks suited to the affected consumers. Inspect the full task diff for orphaned artifacts and accidental scope expansion. Report supported findings for an audit, or what became simpler and the evidence for the retained outcomes after edits.

## Optional References

Read only the material needed for the maintenance question:

- [Diagnostic catalog](references/diagnostic-catalog.md): ambiguous candidates, complexity comparisons, and instruction audits.
- [Verification matrix](references/verification-matrix.md): evidence for replacement, removal, and consolidation across affected boundaries.
