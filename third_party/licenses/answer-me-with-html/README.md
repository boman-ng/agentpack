# Answer me with HTML attribution and provenance

This directory preserves the root license and dependency notices for the optional Answer me with HTML suite. Keep the upstream skill payload unchanged and copy **all contents** directly into the installed skill's `provenance/`: `LICENSE`, `README.md`, and the complete `dependencies/` tree. First compare `LICENSE` here with the pinned repository's root `LICENSE`.

## Pinned source and payload

- Repository: [QingYunA/answer-me-with-html](https://github.com/QingYunA/answer-me-with-html).
- Full commit: `0449a8961a6329360babe6a1cb20d0d6d3d04de5`, package version `0.4.15`.
- Root license source: [LICENSE at the pinned commit](https://github.com/QingYunA/answer-me-with-html/blob/0449a8961a6329360babe6a1cb20d0d6d3d04de5/LICENSE), copied without changes.
- Dependency versions, official archive URLs, and integrity values: [package-lock.json at the pinned commit](https://github.com/QingYunA/answer-me-with-html/blob/0449a8961a6329360babe6a1cb20d0d6d3d04de5/package-lock.json), lockfile version 3, `packages["node_modules/<package>"]` records below.
- Published skill directory: [`skills/answer-me-with-html`](https://github.com/QingYunA/answer-me-with-html/tree/0449a8961a6329360babe6a1cb20d0d6d3d04de5/skills/answer-me-with-html). Its complete payload consists of `SKILL.md`, `scripts/am.mjs`, `references/settings.md`, and `references/video.md`.

The four-file payload includes a bundled CLI with marked 18.0.14, dagre 3.1.1, and graphlib 4.0.5. The bundle retains a comment directing readers to `dagre.esm.js.LEGAL.txt`, but that file is absent from the published skill directory at this commit. This directory supplements that missing notice with the exact official dagre package text. It also retains each dependency's complete license and marked's version/copyright source banner.

The marked `LICENSE` includes its contribution statement, the MarkedJS and Christopher Jeffrey MIT grant, and the historical John Gruber Markdown copyright, redistribution conditions, and disclaimer. Preserve the **entire** file; a current MIT excerpt alone omits those terms. The dagre and graphlib MIT texts credit Chris Pettitt. The root MIT grant does not replace these dependency notices or terms.

## Official package archives and integrity

The official archives below match the SHA-512 integrity values in the pinned lockfile. The file map identifies the preserved license and notice members.

| Package and lockfile record | Official archive | Pinned integrity |
|---|---|---|
| `marked` 18.0.14; `node_modules/marked` | [marked-18.0.14.tgz](https://registry.npmjs.org/marked/-/marked-18.0.14.tgz) | `sha512-mBHK6FBHuBAlhgRe88w9F0O1AbwwXJUcQibUbC/QcdTbVGAD7aWza+xt3N6oT/jCZx3/OMeS+8rnuiHZcQ9s7A==` |
| `@dagrejs/dagre` 3.1.1; `node_modules/@dagrejs/dagre` | [dagre-3.1.1.tgz](https://registry.npmjs.org/@dagrejs/dagre/-/dagre-3.1.1.tgz) | `sha512-zroZB1dFOFiGgv4Xcrn1DckB1o4aOikPqD2NDQPV0WM//CXGcS6xiD0rNkqHmw6FEg4tabt4nxPLwgCWT+Vb2A==` |
| `@dagrejs/graphlib` 4.0.5; `node_modules/@dagrejs/graphlib` | [graphlib-4.0.5.tgz](https://registry.npmjs.org/@dagrejs/graphlib/-/graphlib-4.0.5.tgz) | `sha512-7xrBTqIts3o+PMUZX97wSc+7TUbW+/rULzGNCTP6yooNVDXbzw4Wutg/H/xOutTB/c/k0YqOAavgPh4/Zk9PFA==` |

## Preserved file map

Paths below are relative to this directory. Each package member was copied byte-for-byte; `SOURCE-BANNER.txt` is the complete first comment of its mapped source file, including its following newline. This README is AgentPack-authored provenance.

| Preserved file | Exact source | SHA-256 |
|---|---|---|
| `LICENSE` | Pinned repository root `LICENSE` | `752a1a34b40ae8e64e86f546ec699a691aff573179e1f96997e82757b2ee5d3f` |
| `dependencies/marked-18.0.14/LICENSE` | marked archive: `package/LICENSE` | `8e3a3f82f59a60958f56ca08f445647c32a4733dc7ca6c2c46f6eb898471ab9c` |
| `dependencies/marked-18.0.14/SOURCE-BANNER.txt` | marked archive: first comment of `package/lib/marked.esm.js` | `854152b5004339a4b0621cff0968fe9ef5761bce4a4c7f2a67192e35a9c1f924` |
| `dependencies/dagre-3.1.1/LICENSE` | dagre archive: `package/LICENSE` | `6a349742a6cb219d5a2fc8d0844f6d89a6efc62e20c664450d884fc7ff2d6015` |
| `dependencies/dagre-3.1.1/dagre.esm.js.LEGAL.txt` | dagre archive: `package/dist/dagre.esm.js.LEGAL.txt` | `9148bffb1e84382a8b6668eeb2b53c6a554341d714fba129856ea5eb350d35f3` |
| `dependencies/graphlib-4.0.5/LICENSE` | graphlib archive: `package/LICENSE` | `6a349742a6cb219d5a2fc8d0844f6d89a6efc62e20c664450d884fc7ff2d6015` |

When upgrading the provider, review the proposed pin, bundled dependencies, lockfile integrity values, and notice sources together. Update this record for the new build and preserve exact upstream terms.
