---
name: ui-translate
description: Translate rough UI, interaction, and motion ideas or visual references into accurate frontend terms and reusable developer descriptions. Use to name effects, distinguish concepts, or clarify intended behavior. Not ordinary language translation, UI copy localization, full design review, or precise code-only edits.
---

# UI Translate

Turn what the user wants to see or do into a usable frontend description. Respond in the user's language; include useful English terms on first mention. Lead with the closest concept and reusable wording, explaining only the distinctions that matter.

## Preserve the intended behavior

- Identify the object, action or relationship, trigger, resulting state, and constraints that matter. Preserve qualifiers and anti-goals; do not invent navigation, modality, persistence, timing values, libraries, or features. Keep spatial constraints in their stated frame: motion "within a plane" does not mean "no up/down movement" or choose the plane's orientation.
- Translate adjectives into observable differences. "Smooth" might mean continuous motion, stable layout, or responsive input. Keep confirmed requirements, observed features, provisional interpretations, and optional recommendations distinct.
- If one interpretation is adequately supported, proceed. Ask a focused, plain-language question only when the unresolved choice changes the useful result; otherwise leave it open or label a provisional interpretation. If questions are disallowed, offer conditional wording. Expose conflicting requirements without silently dropping either.
- Treat the user's correction as new evidence: withdraw the rejected interpretation and its dependent mechanisms while retaining unaffected constraints. Return the complete revised wording without restarting the whole analysis.

## Choose concepts before mechanisms

- Distinguish an established concept or API from a descriptive name or visual metaphor when it matters. A familiar-looking effect does not prove its original algorithm, library, or implementation.
- For unfamiliar terms or consequential technical claims, research the unresolved claim using primary documentation or original work and cite what it actually supports. A reference link is not evidence of a fresh lookup. Follow applicable research and delegation instructions; if access is unavailable, finish the supported translation and identify the gap.
- When implementation guidance is useful, inspect available project components and their behavior contracts first. Reuse a suitable project or platform capability before proposing a dependency or custom mechanism; recommend the simplest adequate option without overriding explicit choices.
- Concept-only requests need no code. When the user also requests implementation, resolve blocking ambiguity and continue that authorized task using the host's workflow. Do not require a separate concept report or renewed authorization.

## Match the answer to the task

A naming question may need one sentence. Compare materially different interpretations in a compact table when useful. For a developer handoff, include reusable wording, preserved constraints, consequential unknowns, and observable acceptance checks only where they help; omit empty categories. A short plain-language back-translation can help the user check the meaning.

For requested exploration, explain useful neighboring concepts or decompose a complex effect into contributions and their relationships. Do not fill a taxonomy, enumerate every related term, or expand the assignment into a design review. Stop once the wording is usable and important uncertainty is resolved or explicit, completing any other authorized deliverable.

## Read only relevant references

- [UI patterns](references/ui-patterns.md): distinguish layout, component semantics, state, feedback, and responsive behavior.
- [Motion patterns](references/motion-patterns.md): distinguish animation timing and visible effects, including particle motion and compositing.
- [Visual evidence](references/visual-evidence.md): interpret screenshots, ordered frames, recordings, or live references without overstating what was observed.
