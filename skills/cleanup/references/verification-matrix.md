# Verification Matrix

Choose evidence for the specific maintenance claim and affected consumers.

| Maintenance change | Useful evidence | What may require further investigation |
|---|---|---|
| Local removal or rename | Relevant references, focused behavior or build checks, complete diff | Dynamic registration or external consumers |
| Implementation or wrapper replacement | Caller guarantees, error behavior, and invariants of the retained contract | Protocol, performance, or trust differences despite matching signatures |
| Shared code or dependency consolidation | Affected consumers and manifest/lock consistency | Independent deployment boundaries or consumers absent from the workspace |
| State or schema simplification | Lifecycle invariants, representative persisted data, migration and recovery rehearsal | Historical states and irreversible operations |
| Compatibility or configuration pruning | Migrated callers, retired registrations, retained obligations | Out-of-scope consumers, data formats, or deployment variation |
| Test consolidation or retirement | Which active faults each test detects and where unique evidence remains | Incident, migration, security, concurrency, or performance coverage |
| Security or recovery consolidation | Concrete threat or failure contract exercised at the retained boundary | Distinct trust boundaries or failure-only duties |
| Documentation or instruction cleanup | Authoritative behavior, scope, entrypoints, metadata, and reference consistency | Historical records or consequential changes to instructions |

For a retained contract, verify behavioral substitutability; for an authorized contract change, verify caller migration and the new behavior. Isolated replay or migration rehearsal can resolve persistent-state questions without touching live data.

When test equivalence is uncertain, a temporary fault injection can show whether the proposed retained checks still detect the relevant failure. Restore the implementation afterward; the experiment need not become a permanent facility.

For instruction cleanup, inspect the description, default prompt, body, references, and applicable authority together. Use a few representative tasks to examine changed decisions when needed, distinguishing scenario reasoning from executed behavior. Static consistency does not establish better runtime performance.
