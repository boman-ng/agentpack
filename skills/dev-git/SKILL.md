---
name: dev-git
description: Manage task branches, classified atomic commits, PR progression, dependency stacks, and authorized Shipping. Use for repository development or Git delivery; preserve project workflows and meaningful history, and require scoped authorization for remote writes.
---

# Dev Git

Read the [engineering contract](../dev/references/engineering-contract.md), [collaboration rules](../dev/references/collaboration.md), and [verification policy](../dev/references/verification-policy.md). Read [branches and PR delivery](references/delivery.md) for branch selection, integration, stacks, or cleanup; read [release strategy](references/release-strategy.md) only for requested release or supported-version work.

Use native Git and the hosting platform's supported capabilities. Honor existing project governance. Without an established workflow, use trunk, short task branches, and PRs; create dependency stacks only for actual dependencies. Invoking this skill does not migrate an existing repository's governance, require a new tool, or change global settings.

## Ownership And Local Work

Inspect instructions, branch/HEAD, worktrees, staged and unstaged changes, and operations in progress. Establish the task's base, destinations, owned changes, and Git coordinator. Preserve unrelated work without automatically stashing, discarding, or committing it. Resolve blocking ownership conflicts while continuing independent work.

Local task branches, commits, private-history organization, and eligible task cleanup are within implementation or Git scope. Audits, plans, and explanations stay read-only. One coordinator owns shared index, branch switches, rebases, commits, and integration; collaborators own assigned files or isolated candidate workspaces without independently changing shared Git state.

Reuse the task checkout when work can be coordinated safely. Use separate temporary workspaces or worktrees for concurrently executable candidates or independent tasks that would otherwise collide. Inspect `git worktree list`, confirm unused paths/branches, and use task-owned temporary or ignored paths. A worktree lock protects against removal, not simultaneous writers. Do not switch another agent's active checkout.

## Classify Atomic Conventional Commits

1. Classify by intent, inspecting the complete staged and unstaged diff. Separate unrelated outcomes using `feat`, `fix`, `refactor`, `perf`, `docs`, `test`, `build`, `ci`, or `chore`, with a useful optional scope. File extension and author do not define intent.
2. Include implementation, required callers, relevant tests, and necessary documentation for one coherent outcome. Final retained commits must be complete and verifiable. A red-before reproduction can live in temporary evidence; retain fix and necessary regression protection together.
3. After relevant checks, stage owned paths or hunks, inspect the staged diff, and commit locally. Organize private exploratory history before delivery where necessary; preserve meaningful classified atomic commits. Do not squash the task or PR by default.
4. Follow [Conventional Commits 1.0.0](https://www.conventionalcommits.org/en/v1.0.0/): English `type(scope): description`, optional scope and useful body. Mark a breaking contract with `!` and a `BREAKING CHANGE:` footer describing impact and migration. Commit syntax does not authorize a version bump.

For example, a duplicate-capture fix, its regression test, and necessary contract correction belong together; unrelated installation documentation can be a separate commit. Use merge methods that retain atomic history, respecting ancestry and project rules as described in the delivery reference.

## Human Authorization For Remote Writes

Push, force-push, remote ref deletion, PR creation/update/merge/closure, protection changes, release metadata, publication, and deployment need human authorization covering the target and action. Implementation scope and passing checks do not supply it. Ordinary push or merge permission does not cover force-push or deletion.

Carry forward applicable authorization; do not ask again for covered actions. A standing cleanup grant applies only to its named repository, branches, and conditions. Inspect automation before authorized push or merge: authorization must also cover resulting publication, deployment, or deletion. An enabled setting alone is not authorization, while a previous grant covering that consequence remains valid.

Prepare concrete local commits and PR text before requesting missing authority. Pause only the uncovered operation; preserve ready work and finish other authorized actions. Read-only hosting inspection and fetch need no remote-write authority, subject to task and host constraints. Do not weaken protections or bypass required checks to finish delivery.

## Endpoint And Completion

When remote writes are authorized, ordinary development advances to `merge-ready`: current PR contents, target, required checks, independent evidence, and review are reconciled, with no unresolved material in-scope finding. Explicit merge, delivery, or applicable standing authorization enables Shipping. Queue acceptance and auto-merge activation are pending states, not evidence of a completed merge.

Use [delivery progression](references/delivery.md#pr-progression-and-shipping) for dependencies and evidence freshness. Confirm every required destination and the actual remote result after authorized integration. Refresh local branches without discarding independent work. Report actual commits, pending destinations, and limits; local preparation, merge-ready, merged, published, and deployed are distinct.

Apply [branch cleanup](references/delivery.md#branch-lifecycle-and-cleanup) only to eligible owned branches/workspaces or explicitly scoped legacy branches. Cleanup must preserve unique work and active dependencies; remote cleanup requires its own applicable authorization.
