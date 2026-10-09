---
name: dev-clean
description: Simplify, consolidate, or retire existing code, tests, configuration, documentation, and agent instructions, including read-only cleanup audits. Use for maintenance, not new feature design, general code review, or formatting alone.
---

# Dev Clean

Reduce the cost of understanding and changing existing work. Read the shared [engineering contract](../dev/references/engineering-contract.md) and [verification policy](../dev/references/verification-policy.md), including when invoked directly. Audits remain read-only; use [dev-build](../dev-build/SKILL.md) for production development included in the task.

## Maintenance Decisions

- Trace the current obligation, actual callers, and owning contract. Historical implementation choices alone do not justify retention.
- Identify a concrete maintenance cost or violated rule, then choose deletion, consolidation, relocation, or narrowing. Keep knowledge with its owner and independent responsibilities separate.
- When retiring a path, update callers and remove registrations, aliases, tests, configuration, and documentation together. Resolve durable-data and out-of-scope impacts separately.
- For uncertain removal, identify the check that would settle it. Preserve unresolved data, security, recovery, and required-contract protections until resolved.

## Test Asset Maintenance

Judge tests by active behavior and plausible faults. Before consolidation, compare setup, assertions, boundaries, and failure modes; similar assertions can detect different faults. Repair invalid expectations against the contract, not current output.

Use the shared policy's deletion exception for proven obsolete or redundant tests. Read [dev-test](../dev-test/SKILL.md) for new assertions, semantic replacements, or equivalence experiments requiring Tester authorship.

## Verify The Change

Check retained behavior, removed references, and the full diff using relevant existing checks and independent new validation where needed. Report what became simpler and any material limitation; no change is valid when no improvement is supported.

Read the [diagnostic catalog](references/diagnostic-catalog.md) for ambiguous candidates, consequential removals, or instruction audits.
