---
name: design-intent
description: Turn rough ideas, unfamiliar terms, or references into accurate concepts and usable intent in any domain. Use for naming, meaningful distinctions, or consequential ambiguity; not ordinary language translation or UI copy localization.
---

# Design Intent

Read the shared [design contract](../design/references/design-contract.md). Turn the user's words into usable meaning in the user's language; include useful specialist terms on first mention. A naming question may need one sentence. This mode can finish independently in any domain without loading interface-building or awards guidance.

## Clarify Meaning Before Mechanisms

Identify the object, action or relationship, trigger, resulting state, and constraints where relevant. Translate adjectives into observable differences without inventing features, timing, persistence, coordinate frames, libraries, or mechanisms. Distinguish an established term from descriptive wording or a visual metaphor. A familiar appearance does not prove an original implementation.

Keep original wording and confirmed intent separate from observations, provisional interpretations, and suggestions. For consequential genuine ambiguity, follow the contract's native-tool question procedure and revisit the choice with the user before dependent action. Ask for an unknown goal openly; compare real alternatives when they are known. Clear terminology or a settled local change proceeds directly. If questions are prohibited, provide supported or conditional wording and leave consequential unknowns unresolved rather than implementing a guess.

When corrected, withdraw the rejected interpretation and all mechanisms based on it, retain unaffected constraints, and give the complete revised wording. For example, “within a plane” does not choose the plane's orientation or prohibit vertical movement; a caption moving with its image does not remain viewport-fixed.

For unfamiliar concepts or consequential technical claims, inspect project usage and research primary documentation or original work as needed. Cite what the evidence supports. Do not copy a glossary or let an upstream term override desired behavior. Discover `animation-vocabulary` for useful reverse lookup when available and relevant; authoritative domain sources may be more appropriate outside interface motion. A stored reference link alone is not evidence of a fresh lookup.

## Match The Deliverable

Lead with the closest supported concept and reusable wording. A handoff can include preserved constraints, consequential unknowns, and observable acceptance checks where useful; omit empty categories. A plain-language back-translation can help verify meaning. Explain neighboring concepts only when their distinctions change the result; do not fill a taxonomy or turn naming into an audit.

Read only relevant local references:

- [UI distinctions](references/ui-patterns.md): layout, component semantics, state, feedback, and responsive behavior.
- [Motion distinctions](references/motion-patterns.md): timing, continuity, particle motion, and compositing.
- [Evidence](references/visual-evidence.md): screenshots, ordered frames, recordings, and live references.

Stop when the requested meaning is usable and important uncertainty is resolved or explicitly outstanding. If implementation is also authorized, continue after resolving its blocking ambiguity: interface source uses [design-build](../design-build/SKILL.md); non-design work stays with its domain workflow. All production source changes still require the complete Dev suite through the [engineering integration](../design/references/integrations.md#dev-owns-engineering). Do not require a separate concept report or renewed permission.
