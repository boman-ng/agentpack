---
name: design-review
description: Review interface usability, visual craft, interaction, and design direction from evidence. Use for standalone read-only critiques or quality assessment; production fixes use design-build.
---

# Design Review

Read the shared [design contract](../design/references/design-contract.md), [design principles](../design/references/design-principles.md), [quality](../design/references/quality.md), and relevant [integrations](../design/references/integrations.md). This mode is independently callable and read-only on source; it needs no implementation Developer or mandatory upstream critique workflow.

## Inspect The Relevant Experience

Establish the user's task, audience, scope, constraints, and intended outcome from existing evidence. For consequential ambiguity, explicitly read [design-intent](../design-intent/SKILL.md) and follow its question procedure. Inspect the actual artifact before claiming observations. For a live interface, capture relevant rendered states and exercise available interactions; for a static direction, limit claims to what the artifact supports. Read [evidence](../design-intent/references/visual-evidence.md) when screenshots, recordings, or incomplete access affect interpretation.

Select relevant product/platform benchmarks and apply the two-book principles to identifiable choices and consequences. Examine the affected scope rather than forcing a whole-product audit. Use existing checks and observation where sufficient. A new validation experiment requires the complete discovered Dev suite and `dev-test`; if unavailable, continue read-only inspection and identify the missing evidence. Do not edit production source or invoke an upstream critique that writes state merely because its guidance is useful.

## Report And Conclude

Lead with material findings: locate the observed gap, explain its task or quality consequence, distinguish observation from inferred cause, and name a scoped recommendation with the decisive next check. Prioritize blockers and important craft gaps; omit speculative lists and unsupported exact measurements. A source inspection does not prove runtime usability, and agent interaction does not equal observing a real user.

The agent assesses quality against the shared completion rule without asking the user to grade it or requiring a reviewer to approve it. A review can be complete while the design remains below standard: report that verdict and the unresolved gaps explicitly. Repeat inspection when it resolves a material uncertainty, not to fill rounds. Missing critical evidence prevents a quality-achieved claim. If the user also authorizes fixes, leave the read-only mode and explicitly load [design-build](../design-build/SKILL.md) with its Dev requirements before editing.
