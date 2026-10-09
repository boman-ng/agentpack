---
name: dev-git
description: Manage Git Flow branches, classify and create atomic Conventional Commits, and integrate changes with rebase and fast-forward. Use for repository development or Git-only delivery; remote writes require human authorization and audits remain read-only.
---

# Dev Git

Read the shared [engineering contract](../dev/references/engineering-contract.md) and [verification policy](../dev/references/verification-policy.md). Before branch selection or integration, read [Git Flow and linear integration](references/git-flow.md). Use native Git; no extra CLI, hooks, wrapper, or global configuration is needed.

## Ownership And Local Work

Inspect project instructions, branch/HEAD, worktrees, staged and unstaged changes, and any operation in progress. Establish the task's base, destination, changes, and main-agent owner in task context. Resolve ownership or project workflow conflicts before the affected operation.

Local branch creation, switching, commits, private-history organization, integration, and cleanup are autonomous within an implementation or Git task. Audits, plans, and explanations remain read-only. Reuse the task's branch; preserve unrelated work without automatically stashing, discarding, or committing it. Resolve blocking conflicts while continuing independent work.

The main-agent coordinates the shared index, commits, branch switches, rebases, and integration. Developer/Tester subagents work on assigned files or in sequence; they do not independently change shared Git state.

## Worktrees Only For Parallel Main-Agents

A single main-agent uses the ordinary checkout. Developer/Tester subagents or a dirty checkout alone do not warrant worktrees.

Use separate branches and worktrees when multiple main-agents develop independent features or fixes concurrently. Locate the main working directory with `git worktree list`, then use its `.worktree/<task-slug>/`, never a nested linked worktree. Confirm the path and branch are unused. If not ignored, add `/.worktree/` to the local exclude file located by `git rev-parse --git-path info/exclude`.

Each task owns its workspace and branch. Assign one main-agent to serialize integration into a shared destination; do not switch branches in another agent's active checkout. Coordinate through task communication. `git worktree lock` protects against removal, not concurrent integration.

## Classify Atomic Conventional Commit

1. **Classify by intent.** Inspect the task diff, including staged changes. Separate unrelated features, fixes, and maintenance; choose the actual type (`feat`, `fix`, `refactor`, `perf`, `docs`, `test`, `build`, `ci`, or `chore`) and an optional useful scope. File extension and author do not determine the type.
2. **Keep commits atomic.** Include implementation, required callers, relevant validation, and necessary docs for one coherent intent. Split unrelated outcomes, not each file or layer. Each commit should be understandable and reversible with its required pieces.
3. **Commit verified increments autonomously.** After relevant checks pass, stage owned paths or hunks, inspect the staged diff, and commit locally. Broad staging is appropriate only after confirming all staged content belongs to the task. No new test or full-suite rerun is required merely to commit.
4. **Use [Conventional Commits 1.0.0](https://www.conventionalcommits.org/en/v1.0.0/).** Default to English `type(scope): description`, with optional scope and a body for useful reasons or consequences. Mark breaking changes with `!` and a `BREAKING CHANGE:` footer explaining impact and migration. Preserve meaningful atomic history; do not squash the whole task by default. Commit syntax does not authorize a version change or release.

For example, `fix(checkout): prevent duplicate payment capture` can include its regression test and contract docs; unrelated setup documentation belongs in a separate commit.

## Human Authorization For Remote Writes

Push, force-push, remote ref deletion, and PR creation/update/merge/closure require human authorization covering the repository, target, and action. Local implementation authority, passing checks, and automatic tool approval do not supply it. Ordinary push permission does not cover force-push or deletion.

Prepare local commits and proposed PR text before asking for missing authorization through a supported human interaction channel. Pause only the unauthorized action. Existing authorization carries forward within scope; a changed target or expanded action needs new authorization. Read-only inspection and fetch do not require remote-write authorization, but remain subject to task and host constraints.

## Finish Locally

Integrate verified work into its established local destination using the linked Git Flow procedure. Remove only owned temporary branches/worktrees whose results are preserved and which have no pending changes, unique commits, downstream dependencies, or valuable files (including ignored files).

Use normal branch deletion and `git worktree remove`, without force. If replay makes ancestry insufficient to establish preservation, retain the source until resolved. Report destination and commit IDs, retained work, and any authorized delivery step still outstanding; local integration is distinct from remote delivery.
