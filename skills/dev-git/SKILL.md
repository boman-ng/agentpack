---
name: dev-git
description: Manage Git Flow branches, classify atomic Conventional Commits, and coordinate releases, synchronization, and branch protection. Use for repository development or Git-only delivery; remote writes require human authorization and audits remain read-only.
---

# Dev Git

Read the shared [engineering contract](../dev/references/engineering-contract.md) and [verification policy](../dev/references/verification-policy.md). Use native Git and the hosting platform's supported capabilities; no Git Flow extension or global configuration is needed.

- Before branch selection, integration, or protection setup, read [Git Flow and shared history](references/git-flow.md). The default is `master` for stable delivery and `develop` for ongoing integration.
- For versioning, publication, deployment, or supported release lines, also read [Release strategy](references/release-strategy.md). Integrating code does not by itself request a release.

## Ownership And Local Work

Inspect project instructions, branch/HEAD, worktrees, staged and unstaged changes, and any operation in progress. Establish the task's base, destination, changes, and coordinating agent in task context. Resolve ownership or project workflow conflicts before the affected operation.

Local branch creation, switching, commits, private-history organization, integration, and cleanup are autonomous within an implementation or Git task. Audits, plans, and explanations remain read-only. Reuse the task's branch; preserve unrelated work without automatically stashing, discarding, or committing it. Resolve blocking conflicts while continuing independent work.

With a shared remote, keep ordinary task commits on short-lived branches and integrate through the project's PR process. Refresh local long-lived branches from their matching remote branches by fast-forward. Inspect existing local-only work before synchronization; a clean worktree or an ahead/behind count does not authorize dropping commits.

One coordinating agent owns the task's shared index, commits, branch switches, rebases, and integration. Developer/Tester collaborators, whether subagents or separate sessions, work on assigned files or in sequence; they do not independently change shared Git state. This is a task responsibility, not a required host-specific agent role.

## Worktrees Only For Concurrent Independent Tasks

A single coordinated task uses the ordinary checkout. Developer/Tester collaboration, a separate Tester session, or a dirty checkout alone does not warrant worktrees.

Use separate branches and worktrees when different agents coordinate independent features or fixes concurrently. Locate the main working directory with `git worktree list`, then use its `.worktree/<task-slug>/`, never a nested linked worktree. Confirm the path and branch are unused. If not ignored, add `/.worktree/` to the local exclude file located by `git rev-parse --git-path info/exclude`.

Each task owns its workspace and branch. Assign one coordinating agent to serialize integration into a shared destination; do not switch branches in another agent's active checkout. Coordinate through available task communication. `git worktree lock` protects against removal, not concurrent integration.

## Classify Atomic Conventional Commit

1. **Classify by intent.** Inspect the task diff, including staged changes. Separate unrelated features, fixes, and maintenance; choose the actual type (`feat`, `fix`, `refactor`, `perf`, `docs`, `test`, `build`, `ci`, or `chore`) and an optional useful scope. File extension and author do not determine the type.
2. **Keep commits atomic.** Include implementation, required callers, relevant validation, and necessary docs for one coherent intent. Split unrelated outcomes, not each file or layer. Each commit should be understandable and reversible with its required pieces.
3. **Commit verified increments autonomously.** After relevant checks pass, stage owned paths or hunks, inspect the staged diff, and commit locally. Broad staging is appropriate only after confirming all staged content belongs to the task. No new test or full-suite rerun is required merely to commit.
4. **Use [Conventional Commits 1.0.0](https://www.conventionalcommits.org/en/v1.0.0/).** Default to English `type(scope): description`, with optional scope and a body for useful reasons or consequences. Mark breaking changes with `!` and a `BREAKING CHANGE:` footer explaining impact and migration. Preserve meaningful atomic history; do not squash the whole task by default. Commit syntax does not authorize a version change or release.

For example, `fix(checkout): prevent duplicate payment capture` can include its regression test and contract docs; unrelated setup documentation belongs in a separate commit.

Integration commits use a Conventional Commit title describing the merge's purpose while retaining the underlying atomic commits. Rebase is for organizing independent task history; releases and long-lived synchronization preserve ancestry with merge commits as defined in the Git Flow reference.

## Human Authorization For Remote Writes

Push, force-push, remote ref deletion, PR creation/update/merge/closure, hosting protection changes, release metadata changes, publication, and deployment require human authorization covering the target and action. Local implementation authority, passing checks, and automatic tool approval do not supply it. Ordinary push permission does not cover force-push or deletion.

Inspect relevant automation before an authorized push or merge. If it will publish a release or deploy, the authorization must cover that result; a configured workflow alone does not supply permission. Carry forward authorization that already covers those consequences without asking again.

Prepare local commits and proposed PR text before asking for missing authorization through a supported human interaction channel. Pause only the unauthorized action. Existing authorization carries forward within scope; a changed target or expanded action needs new authorization. Read-only inspection and fetch do not require remote-write authorization, but remain subject to task and host constraints.

Include required development-line synchronization in the delivery scope. If existing authorization does not cover a destination, preserve its pending work and report the outstanding step; do not reset a local branch to make delivery appear complete. Apply protection settings only when requested; never weaken checks or use an administrative bypass to finish a merge.

## Finish And Clean Up

Confirm every required destination independently, including the actual remote result when delivery was authorized. Refresh the matching local branches without discarding independent work. A successful production merge does not establish development-line synchronization.

Remove only owned temporary branches/worktrees whose work is preserved in every required destination and which have no pending changes, downstream dependencies, or valuable files (including ignored files). Use normal branch deletion and `git worktree remove`, without force; remote deletion needs its own authorized scope. If replay makes ancestry insufficient to establish preservation, inspect equivalent patches and final behavior before cleanup. If normal deletion still refuses, retain the branch and report why. Report destination commits and any unfinished synchronization; local completion and remote delivery are distinct.
