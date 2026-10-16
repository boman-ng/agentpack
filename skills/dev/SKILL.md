---
name: dev
description: Coordinate development, fixes, refactoring, independent testing, engineering review, and PR delivery. Use for ordinary engineering requests and work spanning Dev responsibilities; route to focused skills without requiring explicit invocation.
---

# Dev

Own the requested outcome through its authorized delivery endpoint. Read the [engineering contract](references/engineering-contract.md), [collaboration rules](references/collaboration.md), and [verification policy](references/verification-policy.md). These references also govern direct role invocation.

## Route By Responsibility

| Need | Entry point |
|---|---|
| Explain current mechanisms, ownership, and paths | [dev-how](../dev-how/SKILL.md) |
| Investigate historical rationale and constraints | [dev-why](../dev-why/SKILL.md) |
| Shape data, interfaces, and module design | [dev-architect](../dev-architect/SKILL.md) |
| Compare independent designs or implementations | [dev-arena](../dev-arena/SKILL.md) |
| Implement features, fixes, and migrations | [dev-build](../dev-build/SKILL.md) |
| Simplify or retire existing work | [dev-clean](../dev-clean/SKILL.md) |
| Diagnose runtime failures and trace causes | [dev-diagnose](../dev-diagnose/SKILL.md) |
| Measure and improve performance | [dev-perf](../dev-perf/SKILL.md) |
| Author tests and report observed results | [dev-test](../dev-test/SKILL.md) |
| Judge engineering quality and tradeoffs | [dev-review](../dev-review/SKILL.md) |
| Manage atomic history, PRs, and Shipping | [dev-git](../dev-git/SKILL.md) |
| Assess, draft, or submit requested issues | [dev-issue](../dev-issue/SKILL.md) |
| Reflect on a requested task | [dev-reflect](../dev-reflect/SKILL.md) |
| Evaluate skills, prompts, or workflows | [dev-eval](../dev-eval/SKILL.md) |

Load relevant roles and conditional references only. Issue work, task reflection, behavior evaluation, and sustained optimization require explicit requests. Confirm required resources once; a missing unused specialty does not block other work. Report unavailable required capabilities without inventing completion.

## Coordinate The Work

Establish acceptance, scope, authority, affected guarantees, and project workflow. Classify trivial work narrowly under the collaboration rules. For nontrivial work, maintain a current plan, key decisions, evidence locations, and open items; name the owner of each active responsibility.

For feature or structural work, establish the current model with `dev-how`. Investigate unclear reasons for boundaries or protections with `dev-why`. Changes to function contracts, data shape, or module organization default to design exploration through `dev-architect` and `dev-arena`. If important implementation alternatives remain, run an implementation arena too. Delegate production implementation and synthesis; inspect actual artifacts before deciding.

For a defect, establish failing behavior and discriminate plausible causes before fixing it; use `dev-diagnose` for runtime evidence. Apply the design trigger when the fix changes structure. For cleanup, use `dev-clean` to establish what can be retired and preserve remaining obligations. Reuse completed investigation and settled decisions across flows.

Arrange the separate Tester and Reviewer required for nontrivial changes. Give the Tester original requirements and raw evidence, not implementation-derived answers. Send objective results to the Reviewer for engineering assessment. Resolve accepted findings through their owners and verify changed assumptions. Positive review does not replace tests; passing tests do not settle engineering tradeoffs.

Read `dev-git` before repository changes; one coordinator owns shared Git state. With remote-write authorization, advance PRs to `merge-ready`; Shipping requires authorization covering merge or delivery. Finish when applicable gates and the authorized endpoint are satisfied, or report precise unfinished obligations. Issue filing, background monitoring, and session-history mining are not incidental completion work.

Adapted source material and its license are recorded in [third-party notices](THIRD-PARTY-NOTICES.md).
