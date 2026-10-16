---
name: dev-eval
description: Evaluate skills, prompts, and engineering workflows using isolated realistic tasks, controlled conditions, and anonymous review. Use only for explicit behavior evaluation or comparison requests, not ordinary application testing.
---

# Dev Eval

Read the [engineering contract](../dev/references/engineering-contract.md), [collaboration rules](../dev/references/collaboration.md), and [verification policy](../dev/references/verification-policy.md). Direct invocation inherits their entry gates. Assigned runners, Tester, and Reviewer keep their bounded roles under one main coordinator.

Use observed behavior and actual artifacts to assess a proposed workflow change. Static checks establish packaging or structural facts; they cannot establish that an agent follows the workflow or produces better engineering outcomes.

## Frame The Comparison

State the change under evaluation, expected user benefit, and behavior that could falsify the claim. Choose realistic tasks that exercise that distinction, including a meaningful counterexample or failure boundary. Agree the evaluation scope and time or compute budget from the user request; do not silently expand a small comparison into a broad benchmark program.

Read [experiment guidance](references/experiment.md) before preparing candidate environments or interpreting a comparison. Main and Reviewer set the engineering questions and review criteria. Independent Tester owns formal scenarios, assertions, fixtures, mocks, and executable pass conditions, derives expectations from requirements, and reports objective results. Keep Reviewer and Tester separate from candidate implementers and from each other for nontrivial work.

Change only the factor being studied where practical. When evaluating instruction variants, hold the task, model and reasoning configuration, tools, environment, starting source, and resource budget comparable. Model diversity is not required and can confound that comparison. Record unavoidable differences instead of attributing all outcomes to the skill.

## Run And Inspect

Use isolated task-shaped workspaces with the appropriate instruction variant available through normal discovery. Give runners realistic user requests, relevant source, and constraints. Keep expected answers, hidden checks, scoring rubric, preferred outcome, and other candidate outputs out of their context. Prevent experiment labels or evaluative framing from changing the work itself.

Runners execute actual tasks within the assigned scope. Preserve requested skill routing and delegation where that behavior is being measured; a prompt that forces an unrelated substitute workflow invalidates the inference. Candidate implementers still cannot author formal checks under the new suite's policy. Tester supplies independent checks for those runners.

Collect actual diffs, generated artifacts, command outcomes, relevant observable tool actions, source identity, time or resource observations where available, and failures. Use only task-authorized records exposed by the environment. If action records are unavailable, mark that behavior unobserved; do not invent a host-specific transcript path or substitute self-report.

Tester runs the formal checks and reports expected versus actual behavior, status, reproduction, evidence, and limits without ranking the workflows. An independent Reviewer examines anonymized artifacts against the same engineering criteria without model or variant identities. Main reads the artifacts, reconciles disagreements, and decides what the evidence supports.

## Report And Act Within Scope

Report the evaluated variants and controlled conditions, tasks completed, objective results, Reviewer judgments, missing or invalid runs, and material disagreement. Distinguish an observed event from a broad completion-rate, cost, or quality claim that needs more representative repetitions.

Recommend retention, revision, or rejection only to the extent supported by the comparison. Main owns that recommendation; Tester does not select winners. Evaluation does not itself authorize promoting a variant, publishing results, installing skills, or changing user configuration. Apply a supported change only when existing authorization covers it, through the normal production and verification roles.
