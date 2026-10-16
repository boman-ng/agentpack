# Release Strategy

Read for authorized versioning, release preparation, publication, deployment, or maintenance of published versions. [Branches and PR delivery](delivery.md) governs integration; [Dev Git](../SKILL.md#human-authorization-for-remote-writes) governs authorization.

## Release Intent And Source

Integration, candidate builds, publication, and deployment are distinct outcomes. A merge does not itself authorize version changes, tags, releases, or deployment. Use the project's version policy, channels, supported lines, and triggers. Conventional Commits can inform existing version tooling but do not grant release authority.

Identify the selected source, release identifier, channel, artifacts, intended destinations, and required propagation of fixes. Use a release branch only when the established stabilization workflow needs one; do not impose long-lived development or release branches. Keep stabilization corrections separate from unrelated next-release features and branch-specific metadata.

## Publish The Intended Version

Integrate using the project's required destinations and history-preserving rules. Identify the final source commit after integration; put an authorized release tag on the source that actually produces the artifacts. Preserve each branch's version policy and propagate applicable fixes to other supported destinations.

Follow the existing build, validation, signing, tagging, and publication order. Pre-merge checks alone do not prove the final source or delivered artifacts. Reuse evidence while inputs and outputs remain applicable; rerun affected checks when integration, rebuilding, signing, or version changes alter them. A matching version name does not establish identical artifacts.

Confirm version, channel, source, and artifacts at the real destination. Verify deployment separately when requested. A successful upload step does not prove consumer availability or runtime behavior.

## Maintenance And Backports

Retain maintenance branches only for explicitly supported published lines. Start from the affected version and keep production repairs separate from unrelated development. Propagate applicable fixes to every required line, adapting and checking each destination. Use `cherry-pick -x` for selected backports; do not merge an old maintenance line wholesale into current production or import current features into older releases.

For an older-line-only defect, fix that line and determine whether others are affected rather than inventing an unnecessary current-line change. Retire unsupported lines only within cleanup scope and preservation conditions.

## Interrupted Publication

Inspect actual tag, release, registry, artifact, and deployment state after a failure or unknown outcome. Continue missing actions only within applicable authority and supported retry semantics; do not blindly rerun the whole publisher.

Do not move a published tag or overwrite artifacts to conceal failure. Corrections follow the project's authorized new-version or recovery policy. Report destinations that succeeded, missing steps, and unresolved outcomes.
