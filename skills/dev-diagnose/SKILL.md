---
name: dev-diagnose
description: Investigate runtime failures, hangs, unexpected state, and trace or profile evidence to establish causes. Use for diagnosis before a fix; performance optimization belongs to dev-perf and production changes to dev-build.
---

# Dev Diagnose

Read the [engineering contract](../dev/references/engineering-contract.md), [collaboration rules](../dev/references/collaboration.md), and [verification policy](../dev/references/verification-policy.md). Direct invocation inherits their applicable entry gates. A delegated investigator returns causal evidence to the existing main coordinator; it does not start the complete development workflow.

This role is read-only on production source. Capture observations and use existing diagnostic facilities. A fix or necessary source instrumentation must be separately assigned within authorized scope; formal correctness assertions belong to Tester. Diagnosis alone does not authorize live fault injection or data mutation.

## Establish The Symptom

Identify the expected behavior from the user or authoritative contract, the observed symptom, affected runtime and source state, trigger, and available reproduction. Preserve raw errors, timestamps, operation identifiers, and environmental conditions needed to relate events. Exclude secrets and unrelated user data from captured evidence.

Use [dev-how](../dev-how/SKILL.md) to trace the relevant entry point, state owner, external boundary, and observable result. Use [dev-why](../dev-why/SKILL.md) when an unclear defense or constraint affects the explanation. Inspect existing tests, deployment configuration, dependency changes, and recent source changes that could distinguish causes.

A missing reproduction limits causal confidence but does not prevent source investigation or observation-only diagnostics. State what has actually been observed before forming a hypothesis.

## Distinguish Causes

Form the smallest useful set of competing explanations and identify evidence that would contradict each. Prefer existing logs, traces, profiles, process state, or a narrow reproduction over broad new instrumentation. Delegate independent evidence questions when it adds coverage without sharing mutable experimental state.

Read traces as incomplete observations. Correlation, span ordering, sampling gaps, clock skew, and instrumentation overhead can alter the apparent story. Follow the affected operation across boundaries using reliable identifiers; a nearby error need not have caused the symptom.

When a discriminating check needs new assertions, fixtures, mocks, or pass conditions, assign it to an independent [dev-test](../dev-test/SKILL.md) agent. If temporary source instrumentation is needed, have an implementer add observation-only instrumentation in an isolated scope, then remove experiment-owned changes. Verify that a controlled perturbation took effect before using its outcome as evidence.

Use authorized isolated environments for experiments that change state. Preserve required recovery controls and stop an unsafe or invalid experiment; continue unaffected investigation. Keep observations, experiment setup, and actual source identity in the task's temporary evidence location.

## Return A Causal Account

Report the reproduced or reported symptom, supported cause, relevant counterevidence, alternatives not yet excluded, and material limitations. Connect the explanation to source and raw observations. Distinguish the initiating fault from symptoms and from mechanisms that amplify or conceal it.

A diagnosis may identify the owning component and obligations a fix must address. Engineering recommendations are assessed through [dev-review](../dev-review/SKILL.md), implementation through [dev-build](../dev-build/SKILL.md), and measurement-led optimization through [dev-perf](../dev-perf/SKILL.md). The diagnostic agent does not repair production code or author formal regression checks as a shortcut.

After an authorized fix, independent Tester verification must exercise the relevant symptom and real integration boundary where applicable. A plausible cause or disappearance in an invalid reproduction does not establish that the fix works.
