# Verification Matrix

Choose evidence that can resolve the actual cleanup claim. These examples guide judgment; they do not create mandatory tiers, approval systems, or a sequence of checks.

## Match Evidence To The Change

| Change | Useful evidence | What can require more investigation |
|---|---|---|
| Local code removal or rename | Relevant references, compile/type/lint or focused behavior checks, complete diff review | Dynamic registration or external consumers |
| Duplicate implementation or wrapper removal | Caller contracts and observable behavior | Different error, protocol, performance, or trust semantics |
| Shared code, dependency, or build change | Affected regression checks, manifest and lock consistency | Broader consumers or unavailable affected-test selection |
| State or schema change | Lifecycle invariants, representative persisted data, migration and recovery checks | Durable data, irreversible operations, or unknown consumers |
| Compatibility or configuration pruning | Actual consumer and supported-environment evidence | Deployment variation, public contracts, or continuity obligations |
| Test pruning | The behavior and failure it detects, including coverage supplied elsewhere | Unique incident, migration, security, concurrency, or performance evidence |
| Security or recovery mechanism | The threat or failure contract and independent evidence of effectiveness | Distinct trust boundaries, mandated review, or unsafe live comparisons |
| Documentation change | Current authoritative behavior, policy, or owner decision | Historical context or an unresolved product decision |
| Agent instruction or skill change | Authority and entrypoint consistency, metadata and reference integrity | Consequential behavior changes or claims about quality and resource use |

Use existing project tools and complete required checks. Broaden only when the changed surface or residual uncertainty warrants it. A full suite, high coverage, successful parsing, or unchanged runtime output is not automatically sufficient for every claim.

## Preserve Outcomes And Authority

Keep mandated safety, privacy, integrity, authorization, audit, recovery, and public-contract outcomes intact. Use isolated tests, representative replay, migration rehearsal, static or formal analysis, or qualified review when a live comparison could cause harm.

External actions require authorization covering the actual action and target. Reuse valid authorization already provided, respect changed instructions, and preserve independently required approvals. An evidence gap should not create a project-side approval or recovery system.

## Test Value

Remove or rewrite tests when they protect retired behavior, repeat the same risk, or cannot detect plausible incorrect behavior. Preserve unique evidence for an active invariant, even when the current test is inconvenient. Do not weaken assertions to turn failures green or use coverage and mutation scores as automatic pruning thresholds.

Temporary neutralization or fault injection can help establish whether a check detects the claimed loss. Use it where safe and useful, restore the final implementation, and avoid creating permanent experiment machinery for a one-time question.

## Agent Instruction Changes

Check agreement among the description, default prompt, body, references, and applicable instructions. Confirm what the host actually loads; use a fresh session when instructions are read at startup.

For a substantial workflow change, representative isolated tasks can test the affected decisions: ordinary local cleanup, audit-only work, a consequential contract, existing authorization, a follow-up correction, or a request that should not activate the skill. Judge actions and artifacts rather than recited rules. If independent evaluation is warranted and available, provide the task and raw artifacts without the desired answer.

Claims of improvement need comparable task inputs, models, reasoning settings, tools, and permissions. Observe completion quality, scope, unnecessary pauses, repeated work, and measured resource use as relevant. Report sample size and limits; one successful case does not prove a general performance gain.

## Report What Was Established

Distinguish static inspection, test or simulated evidence, runtime observation, and achieved outcomes. Explain the meaningful change in concepts, owners, paths, states, dependencies, or future touch points; counts are useful only with stable definitions. Stop once the claim and required checks are covered.
