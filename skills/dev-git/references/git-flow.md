# Git Flow And Shared History

Read this for branch selection, integration, releases, hotfixes, or protection setup. [Dev Git](../SKILL.md) owns commit style, workspace ownership, and human authorization. Retain Git Flow's branch responsibilities: organize independent task commits with rebase, and preserve shared history when publishing releases or synchronizing long-lived branches.

## Branch Roles

Use the project's established production branch name, such as `master` or `main`. Below, `production` names a role, not a new branch. Establish destinations from the request and project rules; resolve incompatible workflows before the affected operation.

| Branch | Start | Responsibility and destination |
|---|---|---|
| Production | Existing production history | Receive completed releases and production hotfixes |
| `develop` | Production when first adopting the workflow | Integrate work for the next release |
| `feature/<slug>` | Current development line | New behavior, delivered to `develop` |
| `fix/<slug>`, `chore/<slug>`, `docs/<slug>` | Current development line | Fixes or maintenance, delivered to `develop` |
| `release/<release-id>` | An explicit development cut | Stabilize that release, publish to production, and return applicable corrections to development |
| `hotfix/<slug>` | Affected production version | Repair production and propagate the correction to development and affected active releases |

Reuse established naming conventions. Create short-lived branches for actual tasks, not merely because development finished. Release versions, tags, publication, and deployment require their own authorized scope; a release branch alone does not request them. Do not rename the production branch or change the remote default branch as part of adopting this workflow.

## Diagnose Before Synchronizing

Distinguish three questions:

- **Local versus remote:** ahead/behind compares a local branch with its configured upstream, not with the production branch. Inspect fetched remote state and unpublished local work.
- **Content:** tree differences show current files; patch comparison such as `git cherry` can identify changes copied by rebase or cherry-pick. Equivalent patches alone do not prove current behavior or delivery to every destination.
- **Ancestry:** `git merge-base --is-ancestor` determines whether one history contains another. Equal trees or equivalent patches do not join two histories.

Never reset, delete, or rebase a shared long-lived branch merely to remove an ahead/behind indication or make tips equal. If local work has been published elsewhere but is missing from the development remote, complete the authorized synchronization there. Preserve work and state the pending destination when authorization is absent.

With a shared remote, treat its long-lived branches as the integration record. Keep pending task commits on short-lived branches, then refresh matching local branches by fast-forward after remote integration. If local-only commits already exist, inspect their ownership and destinations before proposing how to retain or integrate them. For a local-only repository, use its established local destinations without inventing a remote or PR requirement.

## Task Branches

Rebase a private task branch onto the current destination when no other work depends on its old commits. Preserve classified atomic commits; do not squash the whole task by default. Rewriting a published task branch still requires explicit force-push authorization and coordination with its users.

Do not rebase a branch that others use as a base. Preserve it and, when integration needs preparation, use a task-owned branch based on the destination to merge the shared source. Reserve `cherry-pick -x` for an intentional selective backport whose scope differs from the full source; copying commits is not a replacement for routine shared-branch synchronization.

Submit ordinary task work through the project's PR process. Rebase-and-merge is suitable for an independent short-lived branch. GitHub always assigns new SHAs with that method, even when the branch could otherwise fast-forward: fetch the actual destination afterward, and do not treat the old local source as the canonical merged history. Retain it if another task still depends on it.

Where the project uses native local integration, `git merge --ff-only` advances a destination only when ancestry allows it. A refusal calls for inspecting divergence, not an automatic reset or force-push.

## Releases And Long-Lived Synchronization

Record the release cut in task context. New features can continue on `develop`; the release accepts only corrections needed for its selected scope. Keep release-specific metadata separate from changes that must return to development.

Promote releases using merge commits, preserving source commits and both histories. Do not use squash or hosting-provider rebase-and-merge to transfer the development line repeatedly into production. If production advances with a hotfix during stabilization, merge the applicable production history into the release and recheck the affected behavior; do not pull newer, unreleased development features into it.

After publication, synchronize production back into development. When preparation is needed, create a temporary integration branch from the current destination, merge the production source into it, resolve conflicts, and submit it to the destination with a merge commit. This retains concurrent development work and lets checks run against the intended combined result. If a hosting rule requires an up-to-date PR head, merge the current destination into this temporary branch without rebasing its shared history; never update the production source with unreleased development work to satisfy that rule.

Inspect both sides when resolving conflicts. Preserve applicable fixes and intentional branch-specific metadata; do not accept one side wholesale without establishing what the other contains. A merge after earlier replays can also restore obsolete files without reporting a conflict, so review the complete resulting diff and relevant behavior.

Release completion includes production integration and the required development synchronization. Normally production is then an ancestor of development; development may still contain future work, so identical trees or tip SHAs are not universal requirements. Verify the applicable corrections separately when the project intentionally backports selected changes between version lines. Keep a source until all required destinations and downstream dependencies are accounted for.

## Production Hotfixes

Start from the affected production version and keep the correction separate from next-release features. Integrate the verified fix into the intended production line with a merge commit, then synchronize it into `develop` and every affected active release. An active release does not remove the obligation to update development.

Prepare each destination from its own current tip and check its retained behavior. Preserve newer features and its version policy; copying the whole development line into an older release is not a hotfix. Use a selective backport only when that version line needs a different scope, retaining source attribution with `-x`.

## Hosting Protection

Inspect effective hosting rules before publishing; use the platform's supported tools without assuming a vendor or installing a wrapper. When protection setup is requested, protect production and development from deletion and force-push, require PRs, and require relevant checks that actually exist. Establish the successful check name and provider before making it mandatory; do not use coverage quotas or text-matching tests as substitutes for useful validation.

Allow merge commits for releases and synchronization; do not enable a linear-history-only rule on branches that need them. Restrict production PRs to merge commits where supported. Development can accept rebase-and-merge for independent task branches and merge commits for shared history. If the host cannot distinguish source roles, the coordinating agent must select the correct method for each PR.

Choose reviewer requirements for the actual maintainers; a single-maintainer repository need not require an unavailable second reviewer. Independent Agent testing is not a hosting-account approval. Keep remote human authorization and verification duties even when formal approval count is zero. Do not add routine bypass access or weaken protections to complete delivery.

## Primary References

- [Original Git Flow](https://nvie.com/posts/a-successful-git-branching-model/): branch roles and release/hotfix propagation.
- [Git rebase](https://git-scm.com/docs/git-rebase): replay and the consequences of rewriting shared history.
- [Git merge](https://git-scm.com/docs/git-merge): fast-forward and merge-commit behavior.
- [Git cherry](https://git-scm.com/docs/git-cherry): patch equivalence after replay.
- [GitHub PR merges](https://docs.github.com/en/pull-requests/reference/pull-request-merges): rebase-and-merge creates new commit identities.
- [GitHub rulesets](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/available-rules-for-rulesets): available protection and merge-method controls; other hosts need their native equivalents.
