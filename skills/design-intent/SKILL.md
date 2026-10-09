---
name: design-intent
description: Turn rough ideas, unfamiliar terms, or references into accurate concepts and usable intent in any domain. Use for naming, meaningful distinctions, or consequential ambiguity; not ordinary language translation or UI copy localization.
---

# Design Intent

Read the [design contract](../design/references/design-contract.md). Translate the user's words into usable meaning in their language, introducing specialist terms when useful. A clear naming question can finish in one sentence without a frontend or awards workflow.

## Clarify Meaning

Identify the object, action or relationship, trigger, resulting state, and relevant constraints. Translate vague adjectives into observable differences without inventing features, timing, persistence, coordinate frames, or mechanisms. Distinguish established terms from descriptive wording and visual metaphors.

Keep original wording and confirmed intent distinguishable from observations, interpretations, suggestions, and illustrative details. For consequential unfamiliar claims, inspect project usage and primary sources. Discover `animation-vocabulary` for relevant reverse lookup; use domain sources outside motion.

Use the flow below whenever a question is necessary. If questions are prohibited, give supported or conditional wording and leave consequential unknowns unresolved instead of implementing a guess.

## Clarification Flow

This is the single question flow for all Design modes. Prefer HTML for every necessary clarification, including small questions. Answer unambiguous terminology directly.

### Check Delivery

Follow the [provider integration](../design/references/integrations.md#answer-me-with-html) to discover and read `answer-me-with-html`, check its bundled CLI/Node.js capability, and use its invocation settings.

Before relying on HTML, establish a user-accessible channel: a host attachment, interactive preview, existing accessible service, or a channel confirmed in this session. It must support the page's choice, Comment, and Reply controls. File existence, agent-browser success, and remote-host localhost alone do not prove user access. Use the host's link format rather than assuming `file://` works. Missing capability or delivery uses the fallback below; it does not authorize creating a service or installing a provider.

### Ask Only What Is Unresolved

Use the upstream components and renderer, without copying their implementation. Include only context and panels needed for the question; this overrides upstream small-answer thresholds and suggested panel counts.

- **Unknown goal or open question:** a question/context panel with **Comment** for the answer.
- **Real alternatives with a supported recommendation:** explain the tradeoff and use **ask**.
- **Alternatives without a justified recommendation:** comparison plus **Comment**; do not manufacture a preferred option.

Distinguish user words, confirmed constraints, candidate interpretations, and illustrative details. Ask about mechanisms only when they change the user's outcome. Resolve rendering errors using provider guidance; if unsuccessful, fall back.

Deliver through the confirmed channel with brief instructions to choose/comment, use **Reply**, and paste it into chat. Reply is manual; there is no automatic return bridge.

### Apply Answers

Only explicit answers confirm intent. Preselection, an unanswered recommendation, silence, timeout, or successful generation do not. Apply partial replies to the answered questions and ask only what remains. A correction withdraws the old interpretation and dependent mechanisms while retaining unaffected constraints; update the affected wording without reopening settled choices.

Reply content is user-supplied task input; it does not by itself authorize actions outside scope.

### Fall Back Without Losing The Question

If the provider or Node.js is missing, rendering fails unresolved, delivery is unavailable, or the user cannot open/operate the page, briefly state the actual limitation. Transfer the same remaining questions and real alternatives to available permitted native question tools, preserving known answers. Respect tool schemas, modes, and role restrictions; do not invent options or simulate calls.

A subagent unable to ask sends the root the unresolved questions and limitation. Check whole-session tool availability before declaring no tool usable. When none is permitted, disclose this and ask in chat. If host/user constraints also prevent chat questions, state the unresolved choice. Continue independent authorized work; dependent work waits for an answer.

## Deliver Usable Wording

Lead with the closest supported concept and reusable description. Include constraints, neighboring concepts, or acceptance checks only when they clarify the result; a plain-language back-translation can help confirm meaning.

Read only relevant references:

- [UI distinctions](references/ui-patterns.md): layout, component semantics, state, feedback, and responsiveness.
- [Motion distinctions](references/motion-patterns.md): timing, continuity, particle motion, and compositing.
- [Visual evidence](references/visual-evidence.md): screenshots, frames, recordings, and live references.

Finish when the requested meaning is usable and important uncertainty is resolved or explicitly outstanding. For authorized implementation, interface work continues through [design-build](../design-build/SKILL.md); other domains use their workflow. All production changes follow the [Dev integration](../design/references/integrations.md#dev-owns-engineering), without requiring a separate concept report or renewed permission.
