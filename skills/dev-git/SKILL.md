---
name: dev-git
description: Manage Git Flow branches, classify and create atomic Conventional Commits, and integrate changes with rebase and fast-forward. Use for repository development or Git-only delivery; remote writes require human authorization and audits remain read-only.
---

# Dev Git

Keep local work coherent and deliver a reviewable history. Use Git Flow branch responsibilities with linear integration, autonomous local operations within the task, and explicit human authorization for remote writes.

## Required Context

Even when invoked directly, read the shared [engineering contract](../dev/references/engineering-contract.md) and [verification policy](../dev/references/verification-policy.md). Confirm the sibling `dev`, `dev-build`, `dev-clean`, `dev-test`, and `dev-git` entry points and required resources are available. Report an incomplete suite rather than substituting another workflow. Shared resources already read in this task need not be read again.

Before branch selection or integration, read [Git Flow and linear integration](references/git-flow.md). It owns branch roles, release/hotfix propagation, and handling of shared history. Use native Git; this workflow needs no Git Flow extension, hooks, wrapper, or global configuration.

## Establish Ownership

Inspect project instructions, current branch and HEAD, worktrees, staged and unstaged changes, and any operation already in progress. Identify the task's base, destination, affected changes, and responsible main-agent. Keep these facts in the task context or an existing project artifact; do not create a tracking database. Resolve ambiguous ownership or conflicting project requirements before the affected operation.

Local branch creation, switching, commits, private-history organization, integration, and cleanup are autonomous within an implementation or Git-management task. A request to explain, plan, or audit stays read-only. Reuse a branch already owned by the same task. Preserve pre-existing changes and work owned by others; do not automatically stash, discard, or include them in commits. If they prevent safe progress, resolve that specific conflict with the user while continuing independent work.

The main-agent coordinates the shared index, commits, branch switches, rebases, and integration. Developer and Tester subagents retain their authorship responsibilities and work on assigned files or in sequence; they do not independently change shared Git state. Reading this skill does not request extra agents or let a Developer author validation.

## Worktrees Only For Parallel Main-Agents

A single main-agent uses the ordinary checkout. Do not create worktrees merely for its Developer/Tester subagents, a small edit, a read-only investigation, or a dirty checkout.

Use independent branches and worktrees only when multiple main-agents must develop separate features or fixes concurrently. Locate the repository's main working directory from `git worktree list`; put linked worktrees under that project's `.worktree/<task-slug>/`, never under another linked worktree. Confirm the chosen path and branch are unused. If the directory is not ignored, add `/.worktree/` to this repository's local exclude file, found through `git rev-parse --git-path info/exclude`; do not change global settings or commit the worktree directory.

Each parallel task owns its branch and workspace. Name one main-agent to serialize updates to a common destination; finishing a task does not permit switching branches in another agent's active checkout. Git's `worktree lock` protects against removal, not concurrent integration. Coordinate ownership through available task communication; no custom locking service is needed.

## Classify Atomic Conventional Commit

1. **Classify by intent.** Inspect the complete task diff, including staged content. Separate unrelated features, fixes, and maintenance. Choose a type for the actual change, such as `feat`, `fix`, `refactor`, `perf`, `docs`, `test`, `build`, `ci`, or `chore`; use a scope when it identifies the affected area. File extension and agent identity do not determine the type.
2. **Keep each commit atomic.** Include the implementation, required callers, relevant validation, and necessary documentation for one coherent intent. Supporting tests do not require a separate `test` commit. Split unrelated outcomes, not every file or layer. Each commit should be understandable and reversible without knowingly leaving its required pieces behind. Do not optimize commit count or diff size.
3. **Commit completed increments autonomously.** After the relevant checks for a coherent increment pass, inspect its staged diff and create the local commit. Stage explicit owned paths or hunks; broad staging is appropriate only after confirming everything staged belongs to the authorized scope. Do not wait for the entire task or repeatedly ask for local commit permission. Evidence selection and new validation authorship remain governed by the shared verification policy; a commit does not require a new test or a full-suite rerun.
4. **Use Conventional Commits 1.0.0.** Default to English and `type(scope): description`, with scope optional. Describe the change concretely. Add a body when reasons, implications, or limits matter. Mark breaking changes with `!` and a `BREAKING CHANGE:` footer explaining the impact and migration. Preserve meaningful atomic commits; do not squash a whole task by default. Commit syntax does not authorize version changes or a release.

Examples: `fix(checkout): prevent duplicate payment capture` can include its regression test and affected contract documentation; an unrelated `docs(setup): explain local credentials` belongs in another commit. The [Conventional Commits specification](https://www.conventionalcommits.org/en/v1.0.0/) defines the message format; the classification and atomicity rules above define this suite's use of it.

## Human Authorization For Remote Writes

Before a push, force-push, remote branch/tag deletion, or PR creation, update, merge, or closure, identify the exact repository/remote, target branch or PR, and action covered by human authorization. Implementation requests, local commit authority, passing checks, tool availability, and automatic approval are not human authorization for remote writes. Stronger actions such as force-push or deletion must be explicitly covered; ordinary push permission does not imply them.

Prepare the local commits, evidence, and any proposed PR text before asking for missing authorization through the host's supported human interaction channel. Pause only the unauthorized remote action. Existing human authorization remains valid within its stated scope; do not ask again for each command in an already authorized operation. A changed target or expanded action needs new authorization. Read-only remote inspection and fetch do not require remote-write authorization, but still obey task and host constraints.

## Finish Locally

By default, integrate verified work into its established local destination under the linked Git Flow procedure, then clean up task-owned temporary branches and worktrees whose results are preserved. First confirm there are no pending changes, unique unintegrated commits, downstream dependencies, or files that must be retained, including valuable ignored files. Use native `git worktree remove` and normal branch deletion; do not force removal to obtain a tidy status. If replay makes ancestry insufficient to prove safe deletion, retain the source branch until preservation and dependencies are resolved.

Report the resulting local branch and commit IDs, relevant evidence, retained work or cleanup limits, and any remote step awaiting human authorization. Distinguish a local integration from a push, PR, release, or deployment.
