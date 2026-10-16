# Performance Measurement

Read this before reporting a speedup, regression, or measured choice. Scale the experiment to the consequence of the decision; a requested single-run estimate is allowed if labeled as such and the work and errors are checked. A comparison used to choose an implementation needs evidence about repeatability.

## Workload And Mechanism

Inspect what the harness includes, awaits, consumes, and omits. Confirm the timed region actually executes the intended requests, iteration, writes, reads, or rendering. Track completed work and failures so fast rejections, skipped output, deferred promises, and optimized-away work cannot masquerade as improvement. Tester owns new output-correctness checks and expected values.

Use realistic data sizes, state, concurrency, and cache conditions for the claim. Include the path the user waits on when a microbenchmark changes a user-visible outcome. Report the optimized component's share of the end-to-end path; a large local speedup can have little total effect.

Identify the limiter with existing profile, resource, and trace tools. Profile in a separate run when instrumentation changes cost. Check the driver as well as the service: a saturated load generator establishes its own limit. A plausible source explanation without a measured run does not establish a baseline or a ceiling.

## Fair Conditions

Compare actual source versions with equivalent workloads, dependency versions, build modes, relevant tuning, and production-representative settings. Make warmup and cache policy explicit. If the intended decision compares tuned options, do not compare one tuned implementation with an accidental default configuration and infer a general winner.

Record machine and competing-load conditions that could affect the result. Use repeated, interleaved or randomized comparison runs so drift, startup cost, and caches do not consistently favor one side. Choose repetitions sufficient to describe variation for the required claim rather than imposing a fixed count on every workload.

Retain raw samples, errors, units, and completed-work counts. Report a suitable summary and spread, with the aggregation defined. A difference comparable to observed noise does not support a definite performance ordering. Distinguish unsupported comparisons from measurements that establish no meaningful change within the tested range.

## Sanity And Applicability

Check the arithmetic against work volume and physical or algorithmic limits. For example, removing a component that costs 10% of elapsed time can reduce that elapsed time by at most 10% if the rest is unchanged. An implausible result calls for investigation of measurement scope, omitted work, caching, and correctness.

Preserve relevant quality constraints: memory, resource consumption, error rate, correctness, security, and recovery can change even when the primary metric improves. Tester reports those observed outcomes and gaps objectively. Reviewer judges engineering acceptability; main decides whether the result satisfies the goal.

Every result must identify the measured source and environment, command or repeatable procedure, raw artifact locations, and limitations. Dirty-worktree measurements need the actual change identity in addition to a base commit. Reuse results only while these assumptions remain applicable; combining candidates or changing dependencies may invalidate them.
