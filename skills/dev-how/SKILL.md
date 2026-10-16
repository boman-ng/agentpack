---
name: dev-how
description: Explain how a system currently works from source and runtime evidence. Use for code walkthroughs, ownership questions, and grounding before nontrivial changes; historical motivation belongs to dev-why.
---

# Dev How

Read the [engineering contract](../dev/references/engineering-contract.md), [collaboration rules](../dev/references/collaboration.md), and [verification policy](../dev/references/verification-policy.md). Direct invocation inherits their applicable entry gates. A delegated investigator answers its assigned question and returns evidence to the existing main coordinator; it does not restart global orchestration.

Establish a working model of the affected system. This role is read-only: explaining a mechanism does not authorize changing it or deciding that its behavior is correct.

## Trace The Mechanism

Start from the question and a concrete entry point or user action. Inspect the owning source, callers, configuration, and relevant existing tests. Follow the path through rule evaluation, state transitions, persistence or external effects, and observable results. Include failure and recovery paths when they affect the question.

Separate domain terms, data representations, and rules from transport or framework mechanics. Identify where each rule and piece of state is owned, which boundaries translate external protocols, and what callers must know. Describe the actual implementation before interpreting its intended design.

For a narrow question, investigate directly. For independent parts of a larger system, ask the main coordinator to assign focused read-only investigators; give each a distinct question and shared source revision. Reconcile disagreements against source and actual wiring rather than averaging explanations. More agents are useful only when their scopes add evidence.

Run existing observation tools when source leaves consequential uncertainty. Follow the verification policy for any new correctness check; an observation-only probe must not silently become an implementation-authored acceptance test. Record whether a claim comes from inspected code, observed execution, an authoritative contract, or inference.

## Deliver The Model

Explain the mechanism in the user's terms, with source locations supporting the important links:

- The trigger, result, and boundary of the explanation.
- The data flow, state transitions, rule owners, and external effects that determine the result.
- Constraints or surprising behavior needed for safe changes or correct use.
- Unresolved connections and the evidence needed to establish them.

Scale detail to the decision the explanation supports; do not narrate every function or produce a mandatory architecture document. Put disposable maps and investigation output in the task's temporary location under the collaboration rules.

Route motivation questions to [dev-why](../dev-why/SKILL.md), unexplained runtime behavior to [dev-diagnose](../dev-diagnose/SKILL.md), and proposed structural changes to [dev-architect](../dev-architect/SKILL.md). A source map supports those roles; it does not substitute for their investigation or verification.
