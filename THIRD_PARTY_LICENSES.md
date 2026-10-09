# Third-party content

The [MIT License](LICENSE) covers AgentPack's original code and documentation. Third-party license and notice texts, and third-party content fetched or generated through AgentPack, remain under their upstream terms and are excluded from that grant.

Upstream skills are fetched only when selected. [SOURCES.md](SOURCES.md) records their commits and members; this index identifies attribution to preserve under each installed skill's `provenance/`. Upstream terms remain authoritative.

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
| [AnySearch MCP connection settings](mcp/anysearch.md) and their documentation basis | https://github.com/anysearch-ai/anysearch-mcp-server | Apache-2.0 | `third_party/licenses/anysearch-mcp-server-Apache-2.0.txt` and `anysearch-mcp-server-NOTICE.txt` |

Preserve each selected source's root license and embedded notices, plus the supplementary records linked above. Impeccable requires `NOTICE.md`; Archify requires `THIRD_PARTY_NOTICES.md`, its bundled font license, and brand-mark notices. ARS retains its non-commercial terms and included license texts. Skill licenses do not grant access to separately licensed runtimes or hosted services.

Motion has no standalone license file at its pin. Check its MIT package declaration and copy the linked declaration record; do not fabricate an upstream license.

For Answer me with HTML, compare the preserved root license with the pinned source, then copy **all contents** of its linked attribution directory into the installed skill's `provenance/`, including `README.md` and `dependencies/`. Its source record maps the dependency notices and supplies the `dagre.esm.js.LEGAL.txt` referenced but absent from the upstream payload. Keep the payload unchanged and retain marked's full historical Markdown terms.

Resolve any source/license mismatch before installation. Review attribution with each upstream upgrade.
