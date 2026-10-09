# Runtime Integrations

Discover external skills by name through the host's available catalog, loading mechanism, or local search, then read their actual entrypoints and resources. Do not assume a global location, invocation syntax, or cross-suite sibling directory. Explicitly reading a located skill does not establish automatic host discovery.

## Dev Owns Engineering

Before production source edits, including HTML, CSS, components, and motion, discover the complete Dev suite (`dev`, `dev-build`, `dev-clean`, `dev-test`, `dev-git`) and read `dev-build` with its shared contracts. New or semantically changed validation uses `dev-test` under Dev's independent Tester policy.

If Dev is incomplete, pause production edits and new validation, name the missing resource, and continue intent, planning, or read-only review. Observation and existing checks remain available. Generating a disposable explanation through an existing provider does not require Dev.

## Answer me with HTML

Use [Design Intent's clarification flow](../../design-intent/SKILL.md#clarification-flow) for all interaction decisions. Discover `answer-me-with-html` and read its complete skill; reuse its components and bundled renderer. It is an optional selection, recommended alongside Design.

Invoke `node "<discovered-directory>/scripts/am.mjs"` using the actual skill directory in place of upstream's `${CLAUDE_SKILL_DIR}`. The bundle needs Node.js >=20, without `npm install`, a global CLI, or rebuilding.

For ordinary clarification, use per-invocation `AM_NO_UPDATE_CHECK=1`, task-owned `AM_HOME`, and `render - -o "<task-output>/clarification.html" --no-open` with the draft on standard input. Preserve explicit user settings and host attachment/link formats. Keep output and state in writable task-owned directories.

Do not automatically install dependencies, change the pin or global settings, publish, start `am serve`, or create a server/tunnel. Use an existing service only through a confirmed authorized delivery channel. Provider settings, cleanup, updates, video, and external-service workflows need their own requested scope.

## Reuse Relevant Guidance

| Need | Discover when relevant |
|---|---|
| Interface composition, critique, refinement | `impeccable`, `emil-design-eng`; platform guidance such as `apple-design` or `mobile-native` |
| Motion purpose, continuity, timing, interruption | `animate`, `motion-design`, `motion`; GSAP guidance for the actual stack |
| Name a visible motion effect | `animation-vocabulary`; primary documentation for consequential technical claims |
| Interactive clarification | `answer-me-with-html` |
| Inspect rendered states and interactions | Available browser tools; `agent-browser` when its CLI applies |

Read only relevant guidance; invoking a full upstream workflow also requires its setup and side-effect boundaries. `prototype` and `pick-ui-library` require explicit user invocation. Reuse project capabilities first; skill text, runnable tools, accounts, and publication authority are separate resources, and missing tools do not authorize setup.

Keep reviews read-only even when upstream critique would write project state. A fixed upstream polish cap does not replace the requested quality loop.
