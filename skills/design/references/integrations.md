# Runtime Integrations

Discover external skills by name from the current session catalog and read their actual advertised paths. If an entry is missing or stale, use supported skill discovery or local search; do not assume sibling folders, a global installation path, or that a similarly named skill supplies the same contract. Design's own four sibling paths are package-local references.

## Dev Owns Engineering

Before all production source edits, including markup, CSS, and motion code, discover the complete Dev suite (`dev`, `dev-build`, `dev-clean`, `dev-test`, `dev-git`), confirm its entry points/common references, and explicitly read `dev-build` and its required contracts. New or semantically changed validation uses `dev-test` and its independent same-model/same-effort Tester policy. Do not duplicate that policy in Design or pretend reading the Tester entry changes the Developer's identity.

If the required Dev suite is unavailable or incomplete, pause production implementation and new validation. Continue intent, shaping, or read-only review and name the missing resource and next step. Do not automatically install Dev, invent a replacement policy, or silently substitute another engineering skill. Running suitable existing checks and observation does not require authoring new tests or a new Tester.

Generating a disposable explanation with an existing provider is not a production source change and does not require the complete Dev suite. Production edits and new validation remain Dev-owned; do not turn an explanation artifact into a project change without that workflow.

## Answer me with HTML

Recommend selecting the optional one-member **Answer me with HTML** suite alongside Design for clarification pages; never expand a selection automatically. All interaction decisions belong to [Design Intent's clarification flow](../../design-intent/SKILL.md#clarification-flow), not a second provider-specific question policy here.

At runtime, discover `answer-me-with-html`, read its full skill, and use the actual directory containing that `SKILL.md` for `node "<discovered-directory>/scripts/am.mjs"`. Replace the upstream `${CLAUDE_SKILL_DIR}` placeholder with that discovered path. The pinned bundle requires Node.js >=20 and needs no `npm install`, global `am` command, or upstream rebuild.

For normal Design clarification, default to `--no-open` and `AM_NO_UPDATE_CHECK=1` for the invocation. Put output and state in a writable, task-owned location: set `AM_HOME` to that task's state directory and use `render - -o "<task-output>/clarification.html" --no-open` with the Markdown draft on standard input. Apply these defaults through per-invocation flags and environment values, not global configuration. Preserve explicit user settings and use the actual host attachment/link format. Do not assume upstream browser auto-open, default home storage, `file://` links, or final-message restrictions fit the host.

Do not auto-publish, start `am serve`, create servers or tunnels, install dependencies, update the pin, or configure global always-on rules. Existing services may be used only within the confirmed delivery channel and authorization. The provider's settings, cleanup, update, video, and optional external-service workflows remain separate actions subject to their own requested scope.

## Reuse Relevant Guidance

| Need | Discover when relevant |
|---|---|
| Interface composition, critique methods, refinement | `impeccable`, `emil-design-eng`; platform guidance such as `apple-design` or `mobile-native` |
| Motion purpose, continuity, interruption, timing | `animate`, `motion-design`, `motion`; appropriate GSAP core/framework/plugin/scroll guidance for the actual stack |
| Name an unfamiliar visible motion effect | `animation-vocabulary`; primary documentation for consequential technical claims |
| Deliver a necessary clarification as interactive HTML | `answer-me-with-html`; follow Design Intent's single clarification flow |
| Inspect runtime rendering and interaction | Available browser tools; `agent-browser` when its CLI workflow is applicable |

Read only relevant guidance or references when that is sufficient. Reading selected guidance is different from invoking a full upstream workflow: do not claim the full workflow was fulfilled. A full invocation follows its setup, instructions, and side-effect boundaries. Preserve explicit-only restrictions for `prototype` and `pick-ui-library`; they require explicit user invocation.

Skill text, runnable scripts, installed libraries, browser capabilities, accounts, and publication authority are separate resources. Their availability does not imply each other or grant permission. Use existing project dependencies first; separately resolve any required install or external action within authorization. Do not auto-install, configure hooks, run a doctor, or pin tools to make guidance available.

When an upstream guideline conflicts with explicit user instructions, preserve the user's instructions within host constraints and disclose a material conflict. In particular, a fixed upstream polish cap cannot replace the requested evidence-based quality loop. A review remains read-only even when an upstream critique normally writes project state; use relevant guidance without executing that writing workflow.
