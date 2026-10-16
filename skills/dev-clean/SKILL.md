---
name: dev-clean
description: Simplify, consolidate, or retire existing code, tests, configuration, comments, documentation, and agent instructions, including read-only cleanup audits. Use for maintenance; general quality judgment belongs to dev-review and new behavior to dev-build.
---

# Dev Clean

Reduce the cost of understanding and changing existing work. Read the [engineering contract](../dev/references/engineering-contract.md), [collaboration rules](../dev/references/collaboration.md), and [verification policy](../dev/references/verification-policy.md). Direct invocation keeps shared gates; delegated maintenance fulfills its assigned scope. Audits remain read-only.

## Maintenance Decisions

Trace the current obligation, actual callers, and owning contract. Identify a concrete cost, then choose deletion, consolidation, relocation, or narrowing. Reconsider the affected model when scattered policy or repeated exceptions cause that cost; structural changes use independent design exploration. Historical implementation choices alone do not justify retention.

Retire superseded code, registrations, aliases, configuration, comments, and documentation with their in-scope callers. Resolve durable data, recovery duties, and external consumers separately. Aggressively remove narration, duplicate instructions, stale explanations, and wrappers without a purpose. Prefer structure, types, names, and executable checks for rules they can reliably express.

Preserve required contracts, external restrictions, license and provenance notices, and important rationale unrecoverable from code. Investigate an unclear constraint before deleting its only record. For uncertain removal, identify evidence that would settle it and retain unresolved data, security, recovery, and contract protections meanwhile.

## Test Asset Maintenance

Judge tests by active behavior and plausible faults. Compare setup, assertions, boundaries, and failure modes before calling tests redundant; similar assertions can protect different guarantees. Current implementation output does not settle an invalid expectation.

Use the verification policy's exception for proven obsolete or redundant test deletion. [dev-test](../dev-test/SKILL.md) owns new assertions, semantic replacements, merged tests, and equivalence experiments. Deleting a failing test to hide a defect is never cleanup.

## Verify The Change

Use relevant existing checks to inspect retained behavior, removed references, and the complete diff. Nontrivial changes still require a separate Tester and Reviewer; the cleanup author does not judge its own acceptance. Return what became simpler, evidence, and remaining obligations. Leave work unchanged when no supported improvement exists.

Read the [diagnostic catalog](references/diagnostic-catalog.md) for ambiguous candidates, consequential removals, or instruction audits.
