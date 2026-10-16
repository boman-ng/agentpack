---
name: dev-review
description: Independently review production changes, design candidates, and evidence for correctness, engineering quality, and maintainability. Use for code or architecture review and nontrivial delivery gates; objective testing belongs to dev-test.
---

# Dev Review

Read the [engineering contract](../dev/references/engineering-contract.md), [collaboration rules](../dev/references/collaboration.md), and [verification policy](../dev/references/verification-policy.md). For nontrivial work, the Reviewer is a different agent instance from both the implementer and Tester. This role remains read-only; accepted production changes go to a separate implementer.

## Review The Actual Artifact

Start with requirements, constraints, actual changes, caller paths, and the Tester's objective evidence. Read relevant surrounding code and contracts rather than trusting an author's summary or check count. Identify which version the evidence covers and which claims remain unobserved. Candidate reviews use the same criteria and do not assume the first, largest, or most polished artifact is best.

Examine domain meaning, legal states, rule ownership, caller knowledge, interface depth, and actual integration boundaries. Check data, concurrency, security, side effects, and recovery obligations where affected. Look for shallow wrappers, shared state without a need, temporal decomposition that spreads one rule, speculative mechanisms, and unnecessary comments or documentation. Consider counterevidence: a small adapter may isolate a real protocol, and repeated checks may protect different boundaries.

Judge whether the implementation completes the authorized outcome and whether its complexity buys a current guarantee. Do not prescribe an architecture label, count abstractions, or demand cosmetic changes as proof of quality. Compare alternatives by observed consequences and future change cost; prefer a concrete counterexample over a style preference.

## Return Engineering Findings

For each material finding, identify the affected location, requirement or guarantee, observed evidence, impact, and recommended action or resolving experiment. Separate demonstrated defects, plausible risks needing evidence, and optional improvements. State no material finding when that is the supported result; do not manufacture a quota.

The Reviewer may recommend acceptance, changes, or further investigation, but the main agent makes the delivery decision. Explain meaningful disagreement with other reviews rather than vote-counting. In an arena, compare substantive candidates, recommend a base and justified borrowings, and review the synthesized result after relevant changes.

Do not edit production code or author new formal checks in this role. Request missing observations or discriminating checks from the Tester; accepted production fixes go to the implementer. After changes, reassess affected findings and evidence applicability. Report remaining limitations and the actual artifact reviewed.
