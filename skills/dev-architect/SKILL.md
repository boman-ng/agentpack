---
name: dev-architect
description: Design data, contracts, and module ownership through independent alternatives before implementation. Use when work changes function contracts, data shapes, or module organization, or repeated implementation friction calls the design into question.
---

# Dev Architect

Read the [engineering contract](../dev/references/engineering-contract.md), [collaboration rules](../dev/references/collaboration.md), and [verification policy](../dev/references/verification-policy.md). Direct invocation applies their entry gates. A delegated designer returns its assigned candidate; the existing main coordinator owns global routing and decisions.

Design the affected whole around domain meaning, valid states, rule ownership, and caller usage. Architecture names are optional techniques. Prefer a small meaningful interface that hides substantial complexity; neither more layers nor fewer lines establishes a better design.

## Ground And Explore

Use [dev-how](../dev-how/SKILL.md) to establish the actual affected path and integration points. Use [dev-why](../dev-why/SKILL.md) when changing existing ownership, boundaries, compatibility, or defenses whose reasons are unclear. Carry necessary historical constraints into the design without preserving obsolete mechanisms by default.

Changes to function contracts, data shape, or module organization default to structural exploration. Read [design signals](references/design-signals.md) when forming and reviewing those alternatives. Run [dev-arena](../dev-arena/SKILL.md) with at least two structurally distinct design candidates, independent cross-review, main selection, delegated synthesis, and verification. The design question must expose real alternatives in ownership, representation, or interface, rather than different spellings of one proposal.

Write representative caller usage first, then derive the data types, operations, guarantees, and module boundaries it requires. Make invalid states difficult to express without pretending static types remove runtime concurrency, durable-data, or trust-boundary obligations. Include error and side-effect semantics that callers need for correct use.

Keep the artifact as small as the decision permits: a usage sketch and signatures for a narrow change, or a module map with relevant types and migration responsibilities for a larger one. Examples illustrate the contract; formal test expectations and executable assertions belong to Tester. Put exploratory sketches and reasoning in the task's temporary location.

## Carry The Decision Into Implementation

The main coordinator checks the synthesized design against requirements, evidence, and unresolved user choices. A design-only request ends with the supported design and its limits. For authorized implementation, continue without an extra approval gate for routine choices; an unresolved material user decision blocks only its dependent work.

Pass the selected contract, reasons, caller changes, migration obligations, and known uncertainties to [dev-build](../dev-build/SKILL.md). When important implementation choices remain, run a separate implementation arena. Mechanical completion of the selected design needs one implementer.

Keep the design available while implementation proceeds. New parameters, repeated escape hatches, leaked representation, hidden shared writes, or duplicated workaround shapes may reveal a missed requirement or wrong boundary. Investigate the pattern and reformulate the design when warranted; do not preserve a sketch merely because time was spent on it.

If the model changes, update the shared facts and rerun the affected comparison. Delegate production revisions and test changes to their owners. Controlled temporary breakage may exist in exploratory work; final retained atomic commits must contain complete, verifiable increments.

Return the selected usage and structure, why it was selected, applicable constraints, and the evidence or open questions that govern implementation. Keep permanent rationale only where later maintainers need knowledge that the implementation cannot express.
