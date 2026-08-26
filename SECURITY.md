# Security Policy

Report vulnerabilities privately through the repository owner's GitHub security advisory channel.

AgentPack treats install plans and MCP launch/connect metadata as security-sensitive:

- The package has no `postinstall` script and never mutates a user home during package installation.
- Selected open-source skills are fetched with the system Git executable from credential-free HTTPS repositories and explicit branch refs.
- Git credential prompts, system/global Git configuration, hooks, and LFS smudge execution are disabled for source preparation.
- `agentpack install` previews the full plan, including resolved upstream commit SHAs, before any user-home write.
- Apply rechecks staged source hashes and target preconditions; a moved branch cannot change an already previewed plan.
- Every apply backs up exact targets and rolls them back on failure.
- Apply rejects stale previews, and state ownership checks prevent managed paths from escaping adapter targets.
- Canonical MCP files may name environment variables but must not contain credential values.
- Append mode refuses collisions with unmanaged skills and MCP server names.
- Tests must use an isolated `--home`.

Online source repositories are a supply-chain boundary. AgentPack validates source paths, skill frontmatter, and filesystem hashes, but a current branch head is not equivalent to a maintainer signature or security review. Inspect the displayed repository and commit before approval when installing privileged or unfamiliar skills. Source failures stop explicitly; there is no bundled or cached fallback.

AnySearch is a remote third-party service. Review its endpoint, tools, privacy terms, and authentication behavior before enabling it. AgentPack configures anonymous access, does not register accounts, and does not persist API keys.
