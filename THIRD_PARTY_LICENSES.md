# Third-party content

The [MIT License](LICENSE) covers AgentPack's original code and documentation. Third-party license and notice texts, and third-party content fetched or generated through AgentPack, remain under their upstream terms and are excluded from that grant.

AgentPack does not vendor the upstream skills listed below. [SOURCES.md](SOURCES.md) records their repositories, full Git commits, complete suite membership, and expected licenses. Codex fetches selected suites during guided installation and records their commits and installed members in a readable installation note. The preserved license texts and explicitly identified declaration record document the expected licensing boundary; upstream's actual grant remains authoritative.

| Component | Source | License | Preserved text |
|---|---|---|---|
| ARS-Codex adapter payload and its included upstream content | https://github.com/Imbad0202/academic-research-skills-codex | CC BY-NC 4.0; non-commercial restriction applies | `third_party/licenses/academic-research-skills-CC-BY-NC-4.0.txt`; fetched source also carries its notices and embedded licenses |
| Archify skill and bundled renderer | https://github.com/tt-a1i/archify | MIT; bundled font and brand marks retain their upstream terms | [Preserved MIT text](third_party/licenses/archify-MIT.txt) and [third-party notices](third_party/licenses/archify-THIRD_PARTY_NOTICES.md) |
| Answer me with HTML skill and bundled CLI | https://github.com/QingYunA/answer-me-with-html | MIT; marked, dagre, and graphlib retain their licenses and notices, including marked's historical Markdown terms | [Complete preserved license and provenance directory](third_party/licenses/answer-me-with-html/README.md) |
| Impeccable skill | https://github.com/pbakaus/impeccable | Apache-2.0 | `third_party/licenses/impeccable-Apache-2.0.txt` and `third_party/licenses/impeccable-NOTICE.md` |
| agent-browser skill | https://github.com/vercel-labs/agent-browser | Apache-2.0 | `third_party/licenses/vercel-labs-agent-browser-Apache-2.0.txt` |
| Skills for Designers and Engineers | https://github.com/emilkowalski/skills | MIT | `third_party/licenses/emilkowalski-skills-MIT.txt` |
| GSAP AI Skills | https://github.com/greensock/gsap-skills | MIT for skill content; separate from the GSAP runtime license | [Preserved MIT text](third_party/licenses/gsap-skills-MIT.txt) |
| Motion AI Kit skill | https://github.com/motiondivision/ai-kit | MIT declared by upstream; no standalone license file at the recorded commit | [Official declaration and provenance record](third_party/licenses/motion-ai-kit-LICENSE-DECLARATION.md) |
| LottieFiles Motion Design Skill | https://github.com/LottieFiles/motion-design-skill | MIT | [Preserved MIT text](third_party/licenses/lottiefiles-motion-design-MIT.txt) |
| AnySearch MCP documentation/configuration basis | https://github.com/anysearch-ai/anysearch-mcp-server | Apache-2.0 | `third_party/licenses/anysearch-mcp-server-Apache-2.0.txt` and `anysearch-mcp-server-NOTICE.txt` |

Content fetched from the Academic Research Skills source is not covered by AgentPack's MIT grant. Its CC BY-NC 4.0 terms, including attribution and non-commercial use, govern that content. If an upstream source changes its license, installation must be stopped and the source declaration reviewed; AgentPack does not convert or override upstream terms.

Motion's record preserves the official MIT statement and its package metadata, not an upstream LICENSE file or an AgentPack-authored substitute license. Copy that record with the installed Motion skill. Skill installation does not grant access to hosted services, paid tools, or separately licensed runtimes.

Answer me with HTML is pinned to `0449a8961a6329360babe6a1cb20d0d6d3d04de5` (`v0.4.15`). Its bundled CLI embeds marked 18.0.14, dagre 3.1.1, and graphlib 4.0.5. The [provenance record](third_party/licenses/answer-me-with-html/README.md) maps exact preserved texts to the pinned root license and integrity-checked official npm packages. The marked license includes both current MIT grants and historical John Gruber Markdown terms; retain the full file. The bundle references `dagre.esm.js.LEGAL.txt`, absent from the upstream skill payload; its exact official notice is supplied in the preserved directory. Copy all its contents directly into the installed skill's `provenance/`, after checking the root license against upstream, while keeping the four-file payload unchanged.
