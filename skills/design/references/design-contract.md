# Design Contract

The complete installation unit is the four sibling skills `design`, `design-intent`, `design-build`, and `design-review`, including their resources. Confirm their entry points and referenced common files are available; report an incomplete suite and the missing path instead of silently substituting another workflow. Each direct entry reads its relevant common resources explicitly.

## Intent And Scope

Preserve the user's goal, language, brand/style constraints, content, and anti-goals. Keep original words, confirmed intent, tool-observed facts, provisional interpretations, and optional suggestions distinguishable wherever confusion would affect a choice. An observed reference is not automatically a requirement, and an agent proposal is not user confirmation. Reuse project-owned documentation, tokens, components, and assets; no mandatory `PRODUCT` or `DESIGN` state file is needed.

If genuine ambiguity changes the outcome, scope, behavior, or visual direction, explicitly read [Design Intent's clarification flow](../../design-intent/SKILL.md#clarification-flow) and revisit it with the user before the dependent action. That single flow governs every necessary Design clarification, including HTML delivery, explicit and partial answers, corrections, and native-tool/chat fallback. Clear terminology and settled local edits proceed directly. Continue independent authorized work while a consequential choice is unresolved; do not implement guessed intent.

## Authority And Evidence

Skill selection does not authorize publication, accounts, dependencies, configuration changes, or other external side effects. Apply user instructions over conflicting skill guidelines within host constraints, and explain a material conflict. Read relevant external guidance through runtime discovery rather than assuming installed paths. Source excerpts and examples inform judgment; they do not define the user's intent.

Inspect supplied evidence with available capabilities before claiming observations. Distinguish proposed, rendered, checked, deployed, and observed-working states. New validation and production source changes follow the Dev integration; observation and running existing checks do not require new validation authorship. Standalone review remains read-only on source. Use the shared [quality rule](quality.md) for shaping, building, and reviewing design; a standalone naming or wording task does not load the frontend or awards workflow.
