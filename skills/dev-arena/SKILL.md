---
name: dev-arena
description: Compare independent design or implementation candidates through cross-review, selection, delegated synthesis, and verification. Use when structural exploration is triggered or important implementation alternatives remain.
---

# Dev Arena

Read the [engineering contract](../dev/references/engineering-contract.md), [collaboration rules](../dev/references/collaboration.md), and [verification policy](../dev/references/verification-policy.md). Direct invocation inherits their entry gates; a delegated candidate or judge performs only its assigned role. Keep one main coordinator responsible for the decision and completion.

Run the complete chain: shared problem and facts, independent candidates, independent cross-review, main selection, delegated synthesis, and verification of the synthesized artifact. Design and implementation exploration use the same chain at different levels. Do not reopen an implementation arena for mechanical filling of a settled design.

## Frame A Fair Comparison

Give every candidate the same outcome, original requirements, grounded system facts, fixed constraints, authorization, deliverable, and evaluation criteria. Explain the actual design freedom; do not prescribe one preferred solution under several labels. The main coordinator and Reviewer define engineering comparison criteria. Tester owns executable correctness checks and their expected results.

Produce at least two substantively different candidates in separate agent instances and independent working contexts. Each produces the requested artifact, caller usage where relevant, assumptions, tradeoffs, and rejected alternatives. Keep candidates unaware of each other's developing solutions until their first artifacts are complete. Models and effort follow actual capability and user configuration; different models are optional.

Give code candidates isolated writable scopes, preferably independent worktrees or temporary copies. Separate output paths alone do not isolate shared repositories, services, caches with mutable state, or datasets. Follow the main coordinator's ownership assignments. Use task-owned temporary locations for sketches and experimental outputs.

Candidate implementers do not author new formal tests, fixtures, mocks, assertions, or acceptance predicates. Assign these to an independent Tester, including for candidate-specific checks. Implementers may run existing checks and collect observations.

## Compare Completed Candidates

An independent Reviewer who authored none of the candidates reads the artifacts against the same criteria and recommends a base with evidence. The main coordinator independently reads every candidate and the review. Resolve disagreements by inspecting assumptions, counterexamples, and artifacts; agreement is not itself proof.

Missing or failed candidates are incomplete exploration. Obtain a replacement, or report the unmet candidate gate while continuing independent work. Limited slots permit serial independent candidates and later review. Do not treat one completed candidate out of two as consensus. If proposed designs differ only cosmetically, seek a real structural alternative; record genuine convergence only after that comparison. If alternatives answer different problems, correct the shared brief before selecting.

Choose a coherent base by correctness obligations, ownership, caller burden, hidden complexity, and future change cost. Do not choose by line count, agent reputation, or a total score that hides a failed requirement.

## Synthesize And Verify

The main coordinator decides the base and which specific ideas merit adoption. Delegate production synthesis to an implementer with the selected artifacts, rationale, and bounded scope. Preserve one coherent model; combining every appealing feature is not a goal. Revisit the design when synthesis repeatedly needs exceptions that the candidates did not explain.

Independent Tester verification and independent Reviewer assessment apply to the final synthesized artifact. Candidate evidence may be reused only where its assumptions and code still apply; candidate success does not prove the combination. For design-only work, use concrete caller and state walkthroughs and review the resulting contract; executable formal checks remain Tester-owned.

Return the chosen artifact and a compact decision: compared alternatives, base and reasons, adopted ideas, rejected material options, dissent or incomplete coverage, and evidence for the final result. Store process records in the existing task's temporary location. The main coordinator alone decides whether the global acceptance and delivery gates are met.
