# Third-party content

AgentPack does not vendor the open-source skills listed below. It records their repositories, tracked branches, and expected licenses in `skills/sources.yaml`, resolves selected revisions online at plan time, and stores the resolved commit in installation state. The preserved license texts document the expected licensing boundary; the terms present in the fetched source remain authoritative for that revision.

| Component | Source | License | Preserved text |
|---|---|---|---|
| ARS-Codex adapter payload and its included upstream content | https://github.com/Imbad0202/academic-research-skills-codex | CC BY-NC 4.0; non-commercial restriction applies | `third_party/licenses/academic-research-skills-CC-BY-NC-4.0.txt`; fetched source also carries its notices and embedded licenses |
| Impeccable skill | https://github.com/pbakaus/impeccable | Apache-2.0 | `third_party/licenses/impeccable-Apache-2.0.txt` |
| agent-browser skill | https://github.com/vercel-labs/agent-browser | Apache-2.0 | `third_party/licenses/vercel-labs-agent-browser-Apache-2.0.txt` |
| Skills for Designers and Engineers | https://github.com/emilkowalski/skills | MIT | `third_party/licenses/emilkowalski-skills-MIT.txt` |
| AnySearch MCP documentation/configuration basis | https://github.com/anysearch-ai/anysearch-mcp-server | Apache-2.0 | `third_party/licenses/anysearch-mcp-server-Apache-2.0.txt` and `anysearch-mcp-server-NOTICE.txt` |

Content fetched from the Academic Research Skills source is not covered by AgentPack's MIT grant. Its CC BY-NC 4.0 terms, including attribution and non-commercial use, govern that content. If an upstream source changes its license, installation must be stopped and the source declaration reviewed; AgentPack does not convert or override upstream terms.
