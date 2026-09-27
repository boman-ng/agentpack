# Verification Matrix

Choose evidence that resolves the actual cleanup claim. These examples do not create mandatory tiers, approval systems, or a sequence of checks.

## Match Evidence To The Change

| Change | Useful evidence | What can require more investigation |
|---|---|---|
| Local removal or rename | Relevant references, focused behavior or compile/type/lint checks, complete diff | Dynamic registration or external consumers |
| Implementation or wrapper replacement | Observable caller guarantees, error behavior, and invariants of the retained contract | Protocol, performance, or trust differences despite matching signatures |
| Shared code, dependency, or build change | Affected regression checks and manifest/lock consistency where present | Broader consumers or unavailable affected-test selection |
| State or schema change | Lifecycle invariants, representative persisted data, migration and recovery checks | Durable data or irreversible operations |
| Compatibility or configuration pruning | Migrated in-scope callers, retired-path removal, explicit retained obligations | Out-of-scope consumers, data formats, or deployment variation |
| Test pruning | The behavior and fault detected, including evidence supplied elsewhere | Unique incident, migration, security, concurrency, or performance coverage |
| Security or recovery mechanism | Concrete threat or failure contract and independent evidence | Distinct trust boundaries, mandated review, or unsafe live comparisons |
| Documentation change | Current authoritative behavior, policy, or owner decision | Historical context or unresolved requirements |
| Agent instruction or skill change | Authority, entrypoint, metadata, and reference consistency | Consequential behavior changes or performance claims |

Complete required checks and broaden only when impact or residual uncertainty warrants it. A full suite, high coverage, or unchanged ordinary output cannot settle every claim.

**End-to-end argument:** Place correctness responsibility at the boundary that can establish the actual outcome; lower-layer success alone cannot prove it. Local checks may serve concrete faults, trust boundaries, or performance needs, but do not replace that responsibility. This does not mandate full end-to-end tests for every change.

## Preserve Outcomes And Authority

Use isolated tests, representative replay, or migration rehearsal when live investigation could endanger required data, safety, privacy, authorization, integrity, audit, recovery, or external-contract outcomes. Evidence of technical feasibility is not permission for an irreversible or external action; reuse valid authorization and resolve the actual target.

Distinguish replacement under a retained contract from an authorized contract change: test behavioral substitutability for the former and caller migration plus the new behavior for the latter. Do not silently turn a breaking refactor into permanent compatibility, or confuse removal of code with permission to delete data.

## Test Value

Remove or rewrite tests that protect retired behavior, repeat the same risk, or cannot detect plausible incorrect behavior. Preserve unique evidence for an active invariant; never weaken assertions to turn failures green or use coverage as an automatic pruning threshold.

Temporary fault injection or neutralization can establish what a check detects when the answer matters. Restore the implementation afterward; a one-time question does not require permanent experiment infrastructure.

## Agent Instruction Changes

Check agreement among the description, default prompt, body, references, and applicable instructions. Confirm what the host loads; use a fresh context when instructions are read at startup.

For substantial changes, use representative isolated tasks that exercise changed decisions. Useful contrasts include routine facts versus material uncertainty requiring research, same-contract substitution versus authorized breaking changes, actual goals versus proxy metrics, read-only audits versus implementation, and similar syntax versus shared knowledge. Check that counterevidence can change an approach, small tasks stay small, zero findings remain valid, and corrections preserve valid work and authorization.

Judge actions and artifacts rather than recited principles. Check `Decision` statements against actual choices and records: uncertain claims need a next check, planned actions are not completed results, and routine compliance needs no label. If independent evaluation is warranted and available, provide the task and raw artifacts without the desired answer.

For comparative performance claims, compare old and candidate instructions with equivalent inputs, models, settings, tools, and permissions in fresh contexts. Evaluate correctness, authority, completion, and tradeoffs before pauses, repeated work, latency, or resource use. Report the model, sample size, and limits; results on one model or scenario do not establish family-wide improvement.

Static checks establish metadata, links, and instruction consistency, not better model behavior. If model execution is unavailable, finish supported edits and static checks and explicitly report that limitation.

## Report What Was Established

Distinguish static inspection, simulated evidence, runtime observations, and achieved outcomes. Explain changes to concepts, owners, paths, states, dependencies, or future touch points; counts alone do not establish improvement. Stop when the claim and required checks are covered.
