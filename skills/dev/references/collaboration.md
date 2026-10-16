# Collaboration And Entry Gates

## Direct Invocation And Delegated Work

The main agent owns acceptance, global routing, model and capability selection, decisions, and completion. Direct invocation of any Dev role inherits this contract and the [verification policy](verification-policy.md). Direct `dev-build` cannot bypass exploration, independent testing, or review by omitting `dev`.

Distinguish a direct task from a scoped delegation. A direct production task arranges the applicable workflow before implementation. A delegated worker receives a bounded responsibility, follows its role, and returns its artifact and unresolved findings to the main agent; it does not recursively reopen the global workflow. Standalone investigation, testing, and review stay within their requested scope rather than manufacturing an implementation task. An independent `dev-test` agent needs no nested Tester.

Trivial work has a settled goal, mechanical changes, and a fully inspectable effect without an important behavior or structure decision. Examples include a precise wording correction or a known mechanical replacement. A small diff changing permissions, state transitions, side effects, or contracts is nontrivial. Reclassify when new facts reveal complexity.

## Roles And Independence

Delegate nontrivial production implementation and candidate synthesis. The implementer, Tester, and Reviewer must be different agent instances. The Tester authors formal validation and reports facts; the Reviewer supplies engineering judgments; the main agent decides acceptance and delivery. An author cannot become independent by changing its role label. Trivial work may combine implementation, testing, and acceptance.

The main agent matches capability and effort to the task using actual host capabilities and user configuration. Different models may provide useful perspectives; neither diversity nor identical configuration is mandatory. Do not hardcode host tools, model names, or reasoning settings.

Supply each assignment with the original objective, relevant requirements, raw sources and evidence, write ownership, settled constraints, expected artifact, and allowed operations. Keep independent candidate briefs equivalent and their initial work separate. Give reviewers artifacts and criteria without directing them toward a preferred answer. Use the host's available communication mechanisms.

Use separate write targets for independent work. Serialize shared files, shared state, and operations enforcing common invariants. One Git coordinator owns the shared index, commits, branch switches, history editing, and integration. Isolate competing executable candidates so they cannot overwrite or contaminate one another. Isolation never authorizes discarding another task's work.

Limited concurrency can serialize independent candidates, Tester, and Reviewer instances. A failed or missing candidate does not count toward the required two substantive candidates. If an independent role or candidate cannot be supplied, complete possible authorized work and report the unmet gate. Do not claim full delivery, fabricate independence, install an orchestrator, or change host configuration to disguise the limitation.

## Exploration And Decisions

Changes to function contracts, data shape, or module organization default to at least two structurally distinct design candidates. Important implementation alternatives remaining after design selection trigger a second comparison on implementations. Mechanical completion of a settled design needs one implementer.

Both layers use [dev-arena](../../dev-arena/SKILL.md): equivalent facts and task, independent candidates, independent cross-review, main-agent selection, delegated synthesis, and verification of the synthesized artifact. The main agent reads actual outputs, investigates material disagreement, and records why the selected shape meets the constraints. Agreement and vote counts do not prove correctness. Reopen a decision when implementation supplies evidence against its model.

Routine recoverable decisions proceed within the agreed direction. An unresolved consequential user choice holds only dependent work; carry forward authorization and continue independent work. Silence does not settle a requirement or expand authority.

## Records And Task State

Nontrivial tasks maintain a current plan, key decisions, evidence locations, owners, and open items in existing task facilities. Cross-session, unattended, or complex parallel work also saves enough current state to continue the task: objective, workspace and source identity, dependencies, decisions, authorized operations, artifacts, and next unblocked work. This is task state, not session-history mining or a recovery service.

Default process records, logs, and experimental artifacts to a task-owned directory under `/tmp` or an ignored project `.tmp/`. Check the ignore rule before using a project path; keep process files out of commits. Temporary storage can disappear, so state its location and retention limits when a handoff depends on it. Required durable tests, tools, and project knowledge stay with their owning project.

Give each fact one authoritative home and link to evidence instead of duplicating transcripts. Remove superseded scratch artifacts when safe; retain requested evidence and anything another active task needs. Keep secrets and unnecessary private data out of reports and logs.

Reuse native task facilities, Git, hosting tools, and project commands. Add a maintained helper only for a demonstrated mechanical gap. Command recipes and temporary task records do not require a state engine, background watcher, fixed agent tree, or host adapter.
