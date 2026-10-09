# Git Flow With Linear Integration

Read this for branch selection, integration, release preparation, or hotfix propagation. [Dev Git](../SKILL.md) owns commit style, workspace ownership, cleanup, and human authorization. This is a deliberate variant of [Git Flow](https://nvie.com/posts/a-successful-git-branching-model/): retain its branch responsibilities and use rebase plus fast-forward instead of new merge commits. Preserve existing history, including old merge commits.

## Branch Roles

Use the project's established production branch name (`master`, `main`, or another explicit name), without renaming it. Below, `production` is a role, not a branch to create. Establish the actual destination from project instructions and the task; do not guess among ambiguous candidates. Preserve explicit user constraints and resolve incompatible project workflows before changing them.

| Branch | Start | Responsibility and destination |
|---|---|---|
| Production branch | Existing production history | Receive completed releases and production hotfixes |
| `develop` | Established production base when first adopting this workflow | Integrate development for the next release |
| `feature/<slug>` | `develop` | New behavior; integrate into `develop` |
| `fix/<slug>`, `chore/<slug>`, `docs/<slug>` | `develop` | Ordinary fixes or maintenance; integrate into `develop` |
| `release/<release-id>` | Explicit cut from `develop` | Stabilize a selected release; promote it to production and return necessary corrections to `develop` |
| `hotfix/<slug>` | Affected production version | Urgent production fix; propagate to production, `develop`, and active releases that need it |

Reuse existing project naming conventions for these roles. Create short-lived branches only for actual work. When adopting Git Flow locally, initialize missing `develop` from the agreed production base; do not change the remote default branch. Do not create release branches merely because ordinary development finished. Release identifiers, version changes, tags, publication, and deployment need their own authorized scope.

## One Destination, Linear Integration

Identify the task's starting base and selected commits before replay. Use the original requirement and diff to establish what belongs; ancestry alone is not sufficient after a previous replay or backport. Exclude changes already present and retain required dependencies. Pause for clarification if the intended range cannot be established.

For a private task branch with no downstream users, rebase its commits onto the current destination. For a branch that has been shared or is a base for other work, retain that branch and construct a task-owned integration branch on the destination, replaying only the selected commits in order. Never rebase a shared long-lived branch to make an integration possible.

Use `git rebase` or an explicit `--onto` range for an appropriate contiguous history. Use `git cherry-pick` to construct a selective integration or backport branch when the required commits are non-contiguous or the source must be preserved. For backports between shared branches, retain source commit IDs with `-x`; verify the provenance survives conflict resolution. These are ways to prepare a linear branch, not permission to copy an entire development line into a release.

Resolve conflicts according to both branches' required behavior; do not accept one side wholesale without that check. Recheck affected behavior after replay, conflict resolution, or changed integration dependencies. The independent Tester still owns any new or semantically changed validation. Existing relevant evidence remains reusable where its assumptions still hold.

At the destination's owning checkout, ensure its owner permits the update and no pending operation or local changes would be disturbed. Recheck its current tip, then use `git merge --ff-only <prepared-branch>` to advance it. This creates no merge commit. If the destination advanced, refresh the prepared branch and relevant evidence; do not fall back to a merge commit or force a shared ref backwards. Coordinate with the owner instead of repeatedly racing another writer.

## Release Stabilization And Promotion

Record the release cut in the task context or existing release record. After that cut, new features continue on `develop`; the release accepts only changes needed for the selected release. Keep stabilization corrections identifiable separately from unrelated future work and from version metadata with different branch requirements.

Prepare production integration from the release's selected content, excluding changes already in production. If production advanced with a hotfix, retain that correction while rebasing the release or constructing its integration branch on the new production tip. Check the selected release behavior before fast-forwarding production. Do not pull the current `develop` into the release to resolve divergence.

Return only release corrections still needed on `develop`, along with necessary dependencies and project-required metadata, through a separate backport branch based on current `develop`. Already-present corrections need no second application. Validate the release and development outcomes separately; a successful production integration does not prove the backport. Keep the source until all required destinations and retained-work checks are complete.

## Production Hotfix

Start from the affected production version. If production has since advanced, establish which production line should receive the fix; do not move a production branch backwards. Keep the correction separate from release-specific version metadata so it can be carried to other lines without a version rollback.

Integrate the verified fix into its production destination through the linear procedure. Independently check `develop` and each active release in scope for the same fault. Replay only the correction and necessary dependencies where absent, preserving next-release features on `develop` and the release cut on each release branch. An active release does not remove the obligation to correct `develop`. Do not copy an entire branch or apply an already-present correction twice.

For both release and hotfix propagation, identify any outstanding destination explicitly. Retain the relevant branch if another task still relies on it or preservation is uncertain. A local branch operation does not establish that a remote branch or deployed system has changed.

## Primary References

- [Original Git Flow roles](https://nvie.com/posts/a-successful-git-branching-model/): source of the role separation, not the merge policy of this variant.
- [Git rebase](https://git-scm.com/docs/git-rebase): explicit commit ranges and consequences of rewriting a base others use.
- [Git merge](https://git-scm.com/docs/git-merge): `--ff-only` refuses a non-fast-forward update.
- [Git cherry-pick](https://git-scm.com/docs/git-cherry-pick): selected commit replay and source attribution.
- [Git worktree](https://git-scm.com/docs/git-worktree): linked checkout lifecycle and branch ownership constraints.
