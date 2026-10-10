# Git Flow And Shared History

Read this for branch selection, integration, synchronization, or protection setup. Use [original Git Flow](https://nvie.com/posts/a-successful-git-branching-model/) as the primary model for branch responsibilities and release/hotfix propagation. The deliberate adjustments are rebase for independent task commits and stable delivery without versioning when no release is requested. [Dev Git](../SKILL.md) owns commits, workspaces, and authorization; [Release strategy](release-strategy.md) owns publication and supported version lines.

## Branch Roles

Default to two long-lived branches: `master` for stable delivery and formal releases, and `develop` for next-release integration. Apply this consistently rather than choosing a workflow for each task.

Map established names, such as `main` or `dev`, to their actual roles. Preserve explicit project exceptions; a conflicting existing workflow continues until the user decides whether to migrate. Keep that decision in the existing project instructions or task context and reuse it. Do not rename branches, change the remote default, or migrate a repository merely because this skill is invoked. Below, `master` and `develop` refer to these roles.

| Branch | Start | Responsibility and destination |
|---|---|---|
| `master` | Existing stable history | Receive stable delivery batches, completed releases, and production hotfixes |
| `develop` | `master` when first adopting the workflow | Integrate work for the next delivery or release |
| `feature/<slug>` | `develop` | New behavior, delivered to `develop` |
| `fix/<slug>`, `chore/<slug>`, `docs/<slug>` | `develop` | Fixes or maintenance, delivered to `develop` |
| `release/<release-id>` | An explicit `develop` cut | Stabilize a requested release, integrate into `master`, then synchronize back to `develop` |
| `hotfix/<slug>` | Affected production version | Repair its production line and propagate applicable corrections to development and active releases |

Reuse established task naming conventions. Create a release branch for a formal release task, not merely because development finished. Without a release requirement, promote an explicitly selected stable `develop` cut into `master` with a merge commit and synchronize back; do not invent a version, tag, hosted Release, or publishing pipeline. Before promoting a cut, confirm that all changes it contains belong in that delivery.

## Diagnose Before Synchronizing

Distinguish three questions:

- **Local versus remote:** ahead/behind compares a local branch with its configured upstream, not with the production branch. Inspect fetched remote state and unpublished local work.
- **Content:** tree differences show current files; patch comparison such as `git cherry` can identify changes copied by rebase or cherry-pick. Equivalent patches alone do not prove current behavior or delivery to every destination.
- **Ancestry:** `git merge-base --is-ancestor` determines whether one history contains another. Equal trees or equivalent patches do not join two histories.

Never reset, delete, or rebase a shared long-lived branch merely to remove an ahead/behind indication or make tips equal. If local work has been published elsewhere but is missing from the development remote, complete the authorized synchronization there. Preserve work and state the pending destination when authorization is absent.

For a local-only repository, use its local destinations without inventing a remote or PR requirement. With a shared remote, follow Dev Git's short-lived task branches and fast-forward local refresh rules.

## Task Branches

Rebase a private task branch onto the current destination when no other work depends on its old commits. Preserve classified atomic commits; do not squash the whole task by default. Rewriting a published task branch still requires explicit force-push authorization and coordination with its users.

Do not rebase a branch that others use as a base. Preserve it and, when integration needs preparation, use a task-owned branch based on the destination to merge the shared source. Reserve `cherry-pick -x` for an intentional selective backport whose scope differs from the full source; copying commits is not a replacement for routine shared-branch synchronization.

Submit ordinary task work through the project's PR process, using rebase-and-merge for independent short-lived branches. GitHub assigns new SHAs with that method even when the branch could otherwise fast-forward: fetch the actual destination afterward, and do not treat the old local source as the canonical merged history. Retain it if another task still depends on it.

Where the project uses native local integration, `git merge --ff-only` advances a destination only when ancestry allows it. A refusal calls for inspecting divergence, not an automatic reset or force-push.

## Stable Delivery And Long-Lived Synchronization

Keep the selected delivery cut in task context. For a formal release, follow the stabilization and publication rules in [Release strategy](release-strategy.md).

Promote stable batches, releases, and production hotfixes using merge commits, preserving source commits and both histories. Do not use squash or hosting-provider rebase-and-merge to transfer shared history into `master`.

Every advance of `master` includes synchronization back into `develop` in the same delivery, whether publication is requested, succeeds, or fails. When preparation is needed, create a temporary integration branch from the current destination, merge `master` into it, resolve conflicts, and submit it to the destination with a merge commit. If a hosting rule requires an up-to-date PR head, merge the current destination into this temporary branch without rebasing its shared history; never update `master` with unreleased development work to satisfy that rule.

Inspect both sides when resolving conflicts. Preserve applicable fixes and intentional branch-specific metadata; do not accept one side wholesale without establishing what the other contains. A merge after earlier replays can also restore obsolete files without reporting a conflict, so review the complete resulting diff and relevant behavior.

After synchronization, `master` is normally an ancestor of `develop`; development may contain future work, so identical trees or tip SHAs are not required. Verify applicable corrections separately for selective backports between version lines. Dev Git's completion rules cover every required destination, including any synchronization awaiting authorization.

## Production Hotfixes

Start from the affected production version and keep the correction separate from next-release features. Integrate a current-line fix into `master` with a merge commit, then synchronize it into `develop` and every affected active release. An active release does not remove the obligation to update development. If `master` advances during stabilization, merge its applicable production history into the active release and recheck the affected behavior without importing later `develop` features.

Prepare each destination from its own current tip and preserve its intended behavior and version policy. Older supported versions follow [maintenance and backports](release-strategy.md#maintenance-and-backports); do not merge an old maintenance line wholesale into current production or copy current features into an older release.

## Hosting Protection

Inspect effective hosting rules before remote delivery; use the platform's supported tools without assuming a vendor or installing a wrapper. When protection setup is requested, protect `master` and `develop` from deletion and force-push, require PRs, and require relevant checks that actually exist. Establish the successful check name and provider before making it mandatory; do not use coverage quotas or text-matching tests as substitutes for useful validation.

Allow merge commits on both long-lived branches; do not enable linear-history-only rules that prevent their synchronization. Restrict `master` PRs to merge commits where supported. `develop` accepts rebase-and-merge for independent task branches and merge commits for shared history. If the host cannot distinguish source roles, the coordinating agent selects the correct method for each PR.

Choose reviewer requirements for the actual maintainers; a single-maintainer repository need not require an unavailable second reviewer. Independent Agent testing is not a hosting-account approval. Keep remote human authorization and verification duties even when formal approval count is zero. Do not add routine bypass access or weaken protections to complete delivery.

## Primary References

- [Git rebase](https://git-scm.com/docs/git-rebase): replay and the consequences of rewriting shared history.
- [Git merge](https://git-scm.com/docs/git-merge): fast-forward and merge-commit behavior.
- [Git cherry](https://git-scm.com/docs/git-cherry): patch equivalence after replay.
- [GitHub PR merges](https://docs.github.com/en/pull-requests/reference/pull-request-merges): rebase-and-merge creates new commit identities.
- [GitHub rulesets](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/available-rules-for-rulesets): available protection and merge-method controls; other hosts need their native equivalents.
