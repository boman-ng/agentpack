# Branches And PR Delivery

[Dev Git](../SKILL.md) owns commit classification, shared Git state, and authorization. This reference defines task branching, PR progression, Shipping, and cleanup. Follow existing project branch and hosting rules; the default below applies only where no workflow is established. Do not rename branches, change the default branch, or migrate governance by invoking a skill.

## Branch Selection And History

Use the project's trunk and short task branches. Give a branch one coherent task; independent work branches from the destination, while a dependent PR may branch from its predecessor. Keep a compact bottom-to-top dependency list in task context only when a stack is needed. Local-only projects use local destinations without inventing remotes or PRs.

Respect existing integration, release, and maintenance branches. Each required destination remains an explicit obligation; merging one does not prove another is synchronized. Use [release strategy](release-strategy.md) for authorized publication and supported version lines.

Rebase private independent task history when it improves ordering or incorporates the current destination. Do not rewrite shared branch history or branches used by active collaborators. Published history changes require explicit force-push authorization and coordination. Prefer merge commits for shared histories; rebase-and-merge can preserve ordered atomic commits for independent branches when the project permits. Do not default to squash. If a project's mandatory strategy conflicts with required history preservation, resolve that conflict before integration rather than silently losing commits.

Equal trees, patch equivalence, and ancestry answer different questions. Inspect fetched state and local-only commits before synchronization. Never reset a long-lived branch merely to remove ahead/behind counts. Use selective `cherry-pick -x` for intentional backports; do not replace routine shared-history synchronization with untracked copies.

## PR Progression And Shipping

For each PR, establish repository, head, base, dependency, current code state, applicable authorization, required checks, objective test evidence, and independent engineering review. Keep these facts in existing task facilities or temporary records. Hosting approvals and green CI do not replace the Dev role gates.

For ordinary authorized development, bring the PR to `merge-ready`: resolve conflicts, address accepted findings, update the description to the final implementation, and wait for required checks within the task's execution limits. Read new feedback and failures before retrying. An unresolved environmental failure remains a limitation; an inaccessible external service is not a passed check. No permanent watcher is needed; use supported status commands and bounded observation.

Shipping begins only when merge/delivery authority covers the target. Determine the contiguous eligible run from the lowest unmerged dependency and stop at the first PR with missing evidence, review, checks, or authority. A verified dependent PR above that gap waits. An independent change can move to trunk only after confirming it does not need the missing code and refreshing affected verification.

Immediately before each merge, re-read head, base, required checks, authorization, and evidence identity. Evidence is bound to the actual tested tree and its dependency/environment assumptions. A SHA change requires assessing applicability; identical patch IDs alone do not prove behavior on a changed base. Changed production code, wiring, test definitions, dependencies, or synthesized results require affected checks and review. When evidence applicability cannot be established, re-verify.

Merge bottom-up using a history-preserving method allowed by the project. Read back the PR and destination: queued or auto-merge-enabled is not merged. Confirm the intended target and actual integrated commit. Freeze concurrent mutations of the PR being landed; an automatic merge must not silently accept a later unreviewed head.

After its predecessor lands, confirm the next PR targets the intended integration branch rather than the predecessor's branch. Retarget and restack only within authorization, preserving each dependent patch and atomic history. A restack requiring force-push waits for explicit applicable authority. Reassess evidence and required checks on the new base before continuing. Stop at the established eligible ceiling; advancing more work requires its own current gates.

When integration creates a different tested state, establish what evidence still covers the result and run affected checks. Confirm all required destination and synchronization outcomes. If a merge succeeds and later checks fail, preserve the observed state and report the failure; carry out an authorized correction rather than pretending the merge never occurred.

## Native Inspection Recipes

Use the actual repository, remote, refs, and PR number. These are read-only examples for existing Git and GitHub CLI; other hosts use their supported equivalents. Capture command output in the task's temporary directory when it is needed as evidence.

```bash
git status --short
git rev-parse HEAD
git diff --stat
git log --oneline <base>..HEAD
git merge-base --is-ancestor <ancestor> <destination>
gh pr view <number> --repo <owner/repo> --json state,headRefOid,baseRefName,mergeable,mergeStateStatus,mergedAt,mergeCommit
gh pr checks <number> --repo <owner/repo>
```

`git status` and HEAD alone do not identify dirty file contents; preserve the relevant diff and untracked inputs or an isolated snapshot for reproducible evidence. Exit status from an ancestry check describes reachability, not behavior. Inspect the host's actual merge result after any write. Use structured arguments or a prepared body file for PR text rather than shell interpolation of multiline content.

## Branch Lifecycle And Cleanup

Keep task branches tied to an owner and active task or PR. Start later tasks from the current destination after the earlier task ends. Retain supported maintenance and integration branches. Age alone does not authorize deleting stalled work.

Before cleanup, inspect current local/remote tips, required destinations, PRs, and worktree occupancy. Check for commits added after merge, unresolved unique work, and dependent tasks. A merged PR, equal tree, or `git branch --merged` alone does not establish preservation after replay. Use actual merged PR history, patch comparison, and final content as relevant; retain uncertain work.

Remove only completed owned worktrees with no pending changes or valuable ignored files, using non-forced removal. Never switch another task's checkout. Prefer `git branch -d`; forced local deletion is permitted only when verified replayed delivery explains the ancestry refusal and all work is preserved with no remaining dependency or occupancy. Remote deletion needs applicable authorization and separate confirmation. Pruning remote-tracking refs does not delete server or local working branches.

## Hosting Protection

Inspect actual rules and automation before delivery. Change them only when requested and authorized. Require meaningful existing checks and reviewer conditions suitable for the maintainers; independent agent review is not a hosting-account approval. Do not add bypasses or weaken checks to land a PR.

When automatic head deletion is authorized, ensure long-lived and still-needed dependency branches are protected or use explicit cleanup after all obligations are met. Project merge policies must support the agreed history semantics; never change them silently to resolve a conflict.

## Primary References

- [Git rebase](https://git-scm.com/docs/git-rebase): rewriting and shared-history consequences.
- [Git merge](https://git-scm.com/docs/git-merge): ancestry and integration semantics.
- [Git cherry](https://git-scm.com/docs/git-cherry): patch comparison after replay.
- [GitHub PR merges](https://docs.github.com/en/pull-requests/reference/pull-request-merges): merge methods and changed commit identities.
