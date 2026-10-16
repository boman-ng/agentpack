# Controlled Workflow Experiments

Read when preparing or judging a behavior comparison. Keep the experiment proportional to the actual decision and distinguish a feasibility probe from evidence of a general improvement.

## Comparable Inputs

Record the exact variants and starting source, original task request, applicable instructions, environment, tools, model and reasoning configuration, and execution limits. Hold these constant except for the variable being investigated. If a capability is unavailable, record the resulting missing observation instead of silently changing one arm's rules.

Use tasks with enough real structure to expose the claimed improvement. For engineering modeling, examine actual domain rules, ownership, caller burden, and changes to the resulting artifact. For execution closure, inspect actual routing, delegated artifacts, independent verification, handled failure, and final delivery state. Merely asking a runner to recite the workflow measures recall.

Tester authors formal workloads and expectations from the requirements before using candidate output as evidence. A discovered gap can justify revising the evaluation, but the revision must apply to all relevant variants and invalidate old results where their conditions no longer match. An implementation must not set the criterion by which it is judged.

## Isolation And Blinding

Use distinct writable workspaces and task-owned temporary artifacts. Shared services, databases, mutable caches, or concurrent load can defeat filesystem isolation; separate those resources or serialize the experiment and describe the remaining dependence. Restore only experiment-owned state.

Give each runner an ordinary task request and naturally available project context. Do not reveal a preferred design, expected solution, comparison label, hidden rubric, or another runner's answer. Keep experiment-controller files outside the runner-visible workspace. Where the task itself concerns tests or evaluation software, preserve its legitimate vocabulary rather than corrupting the task to remove words.

Randomize or counterbalance run order when environmental drift or warmup could affect the result. Use repetitions when needed to distinguish a workflow effect from sampling variation. Record dropped, interrupted, or invalid runs; they do not silently disappear from the denominator or become successful coverage.

Label review artifacts anonymously and consistently. Reviewer may know it is comparing work, but should not know which model, variant, or preferred option produced each artifact. Apply the same engineering criteria to all outputs and keep the identity mapping with the main coordinator. Limitations to blinding must be disclosed.

## Observable Evidence

Use tool or task records to establish actions that matter, such as actual file reads, independent agent work, executed commands, and observed remote state. Use artifact inspection to establish code or document properties. A final message naming a skill or claiming a test ran proves neither action.

Preserve the source state actually examined, including working changes, with the relevant evidence. An output produced under one instruction set or code revision cannot establish another's behavior. Protect secrets and unrelated data in captured records.

Tester reports check results and missing observations. Reviewer supplies qualitative judgments, supporting artifact locations, and uncertainty. Main evaluates whether an apparent difference survives counterexamples, task mismatch, resource differences, or failures of the harness.

Report the practical limits: few tasks, one model, short runs, unavailable actions, unrepresentative services, or incomplete blinding. A single successful task can demonstrate feasibility; it cannot establish a universal improvement in quality or reliability. Finish when the requested comparison and required checks are complete, or report the remaining evidence gap at the agreed resource limit.
