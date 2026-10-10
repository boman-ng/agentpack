# Release Strategy

Read this when a task includes versioning, release preparation, publication, deployment, or maintenance of published versions. [Git Flow](git-flow.md) owns branch roles and integration; [Dev Git](../SKILL.md#human-authorization-for-remote-writes) owns authorization.

## Release Intent

Code integration, candidate builds, publication, and deployment are distinct outcomes. A merge into `develop` integrates work; it does not request a formal release. A merge into `master` delivers stable code and publishes only when the authorized task or established, authorized automation calls for it.

Use the project's versioning policy, channels, and release triggers. Conventional Commits can inform an authorized versioning tool but do not themselves authorize a version bump. Do not require SemVer, release candidates, or a publishing tool when the project has no such requirement. Without a release request, follow Git Flow's stable-delivery path without release metadata or a release branch.

## Stabilize And Integrate

For a planned release from the development line, create `release/<release-id>` from the selected `develop` commit. Production hotfixes and older supported versions use their respective correction paths instead. Determine the release identifier from the authorized task and project versioning policy; ask only if those leave a consequential choice unresolved. New features continue on `develop`; the release branch accepts only corrections needed for its selected scope. Keep release-specific metadata separate from corrections that must return to development.

Integrate the stabilized release using [Git Flow's delivery and synchronization rules](git-flow.md#stable-delivery-and-long-lived-synchronization), preserving applicable fixes and each branch's version policy. Its hotfix rules handle production fixes arriving during stabilization.

## Publish The Intended Version

Identify the final source commit, release identifier, channel, and intended artifacts in the existing release workflow or task context. The current production line releases from the final integration commit on `master`; an explicitly supported older line releases from its own final maintenance commit. Place the release tag on that source, not on the pre-merge task or release head.

Follow the project's build, validation, tagging, and publication trigger order. Checks on a pre-merge commit alone do not establish that the final source and delivered artifacts were verified. Reuse applicable validation and promote verified artifacts where the workflow supports it. If integration, rebuilding, signing, or version changes alter the verified inputs or output, establish which checks still apply and run those needed for the actual release. Do not claim identical artifacts merely because their version names match.

After publication, confirm the intended version, channel, source, and artifacts at the actual destination. Verify deployment separately when it is in scope. An uploaded artifact or successful workflow step alone does not establish that the release is available to its consumers.

## Maintenance And Backports

Create or retain a maintenance branch only for an explicitly supported published version line. Reuse an existing suitable release branch or create the project's maintenance branch from the affected release tag; ongoing development does not require a permanent branch for every version. Retire a line when its support ends and Dev Git's cleanup conditions are satisfied.

For a defect shared across versions, fix the current applicable development or production line first, then selectively backport to affected supported lines. An urgent production repair follows the hotfix path rather than waiting for unrelated development. Use `cherry-pick -x` for selected commits, adapting and validating the correction on each destination.

For a defect unique to an older line, fix that line and assess whether any others are affected; do not add an unnecessary current-line change. Keep release metadata and unrelated features out of backports. Do not merge entire maintenance histories merely to propagate selected fixes, and do not move current features into older versions.

## Interrupted Publication

When a step fails or its outcome is unknown, inspect the actual state of the tag, hosted release, package registry, artifact destination, or deployment affected by that step. Continue only the missing actions within the existing authorization and supported retry behavior; do not blindly rerun the whole publisher.

Do not move a published version's tag or overwrite its artifacts to conceal a failed release. A correction follows the project's new-version or recovery policy and authorization. State which destinations succeeded and what remains.

## Primary References

- [uv release workflow](https://github.com/astral-sh/uv/blob/main/.github/workflows/release.yml): explicit release invocation and artifact-based publication.
- [Node.js backports](https://github.com/nodejs/node/blob/main/doc/contributing/backporting-to-release-lines.md): selective fixes for supported version lines.
- [semantic-release](https://semantic-release.org/intro/): commit-driven versioning and publication when that automation is deliberately adopted.
