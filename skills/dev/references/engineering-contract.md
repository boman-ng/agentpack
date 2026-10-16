# Engineering Contract

Apply this contract with the [collaboration rules](collaboration.md) and [verification policy](verification-policy.md) to the affected scope. The [Dev router](../SKILL.md) names the public roles. Read relevant specialties only; direct invocation keeps shared gates and delegation keeps its assigned responsibility.

## Scope And Acceptance

Establish observable outcomes, callers, constraints, and acceptance from the request and current contracts. Choose the simplest complete result for present requirements, considering its cost to understand, change, verify, and operate. Diff size is not the objective. Reconsider the affected model when concrete rule duplication, illegal states, caller burden, or change amplification warrants it.

Preserve explicit methods, read-only limits, user data, and unrelated work. Audits remain read-only. Skill selection does not authorize unrelated maintenance, publication, destructive data operations, credential changes, or release metadata changes. Investigate discoverable facts before asking for preferences or authority. Prepare authorized work before requesting a missing decision; pause only dependent actions.

## Engineering Dimensions And User Alignment

Use these dimensions to recognize relevant concerns, not as a questionnaire or a requirement to build a mechanism for every row.

| Dimension | Relevant questions |
|---|---|
| Business and domain design | What outcome, meaning, rules, owner, and invariant must the model express? |
| Architecture and code organization | Which knowledge belongs together, and what should callers need to understand? |
| Data, state, and lifecycle | Who owns valid transitions, persistence, concurrency, retention, and recovery? |
| Interfaces and system integration | What inputs, results, errors, effects, ordering, and external guarantees define correct use? |
| System quality and runtime guarantees | Which reliability, security, privacy, performance, capacity, and cost obligations matter? |
| Testability and correctness verification | Which observation distinguishes success, failure, and competing explanations? |
| Deployment, operations, and observability | How does the change start, operate, fail, recover, and reveal its outcome? |
| Evolution and long-term maintenance | Which increments, consumers, migrations, and knowledge must survive the transition? |

Align unresolved choices that materially change business behavior, public contracts, data obligations, security, privacy, cost, operation, or maintenance with the user. Explain evidence, uncertainty, genuine alternatives, and consequences. Carry settled answers forward; revisit them when facts or instructions change. An agent without a user channel returns the choice to the main agent. Routine recoverable choices within the settled direction remain autonomous. Silence does not confirm intent.

## Model Before Mechanism

Start with domain meaning, data shapes, valid states, invariants, rule owners, and caller usage. Derive the interface from realistic use, including failure and lifecycle obligations. A state machine can make transitions explicit; a discriminated model can exclude impossible combinations; a table can give repeated policy one owner. Use each only when it fits actual rules.

DDD, Clean Architecture, and Hexagonal Architecture are optional techniques. Useful outcomes include clear domain meaning, localized policy, and isolation from external protocols; they do not mandate layers, classes, ports, repositories, or services. Functions and transaction scripts can own coherent business policy.

Prefer modules that hide substantial complexity behind a small meaningful interface. Judge depth by the knowledge callers can forget, not method count or file size. Avoid splitting knowledge by execution phase when one change then spreads across every phase. Distinct business meanings, deployment boundaries, and failure obligations can justify separate owners even when syntax looks alike.

Separate business policy from storage, transport, presentation, and framework mechanics at real boundaries. Use existing composition and visibility mechanisms. A small adapter is appropriate for a real external protocol difference, even with one implementation. Delete transparent wrappers that add no policy or isolation; do not replace useful boundaries with repeated caller knowledge. Add extension points for actual independent variation, not hypothetical futures.

Inspect runtime registration and affected callers before relocating responsibility. Correct the owning model rather than sustaining aliases, flags, and parallel obsolete paths. Use [dev-architect](../../dev-architect/SKILL.md) and independent alternatives when contracts, shapes, or module organization change.

## State, Effects, And Protection

Prefer separate ownership of state when sharing is unnecessary. Where an invariant genuinely spans writes, retain atomic enforcement and justified coordination. Database constraints, transactions, and authorization checks are not redundant merely because a caller prechecks them; inspect bypass paths and races.

Define outcomes for external effects, including timeout, partial failure, repeated delivery, and unknown outcomes where applicable. A timeout does not prove an operation never ran. Reuse platform controls; retries need safe effect semantics, plausible recovery, and bounded effort. A fallback must deliver an allowed result without concealing failure or amplifying load.

Keep controls justified by trust boundaries, invariants, concrete failures, or required recovery. Remove speculative retries, swallowed errors, duplicate enforcement of one duty, and unnecessary configuration. Similar checks can protect different obligations. Preserve unresolved security, privacy, data integrity, recovery, and external-contract protections while investigating their necessity.

## Evolution And Retirement

Within authorized code scope, retain compatibility only when required by the user or project contracts. Migrate in-scope callers with the owner and retire the superseded path. Separately establish obligations for durable data, in-flight messages, coexisting versions, and out-of-scope consumers; use necessary migration or narrow translation without inventing permanent compatibility.

Deliver coherent capabilities or verifiable migration steps. Temporary paths need a purpose, owner, and exit condition; remove them when the transition completes. Planned reversible breakage is allowed in exploration and unfinished work; final retained commits must be complete and verifiable under [dev-git](../../dev-git/SKILL.md). Persistent data needs a recovery action that works with changed data and runtimes; reverting code may not restore it.

Aggressively remove unnecessary code, comments, and documentation. Prefer names, types, structure, tests, and executable tooling for knowledge they can express reliably. Preserve public contracts, external restrictions, licenses and provenance, and important rationale that cannot be recovered from code. Investigate unclear constraints before deleting their only record. Durable decisions belong in existing project guidance; ordinary implementation narration belongs in temporary task records, if needed at all.

Use [dev-clean](../../dev-clean/SKILL.md) for retirement evidence and counterexamples. Leave work unchanged when no supported improvement exists.

## Complete The Authorized Outcome

Complete affected callers, production wiring, packaging, configuration, and necessary documentation. Derived-state changes need an identified source of truth, allowed staleness, and rebuild behavior. Operational changes need observable success/failure and usable recovery. Follow project mechanisms without assuming zero downtime, dual writes, or a particular deployment architecture.

Read [dev-git](../../dev-git/SKILL.md) before repository changes and apply it once per coordinated task. Use the verification policy for evidence and acceptance. Report material decisions, actual results, and remaining obligations. Distinguish locally checked, merge-ready, merged, published, and observed runtime states; one does not establish the next.
