# Design Signals

Use these signals to challenge a candidate's structure. They are reasons to inspect the design, not a required layer diagram or an automatic deletion rule. Check a concrete caller or future change against each relevant concern.

| Signal | What to investigate | A useful direction |
|---|---|---|
| Shallow interface | Must callers learn internal stages or coordinate several operations to complete one meaningful action? | Put cohesive capability and policy behind an interface that absorbs that complexity. A deep module is not a long call chain. |
| Leaked representation | Does a storage, wire, or framework decision force coordinated changes across callers? | Translate at the owning boundary and expose domain meaning. Preserve actual public protocol obligations. |
| Execution-order decomposition | Do load, validate, transform, and save modules repeat the same knowledge or split one invariant? | Group by decisions and state ownership when those stages must change together. Pipeline boundaries remain valid for genuine independent responsibilities. |
| Pass-through layer | Does a wrapper forward the same representation without policy, adaptation, or isolation? | Remove the needless layer or give the real responsibility a clear owner. Keep a boundary that performs actual translation or protection. |
| Split state ownership | Can multiple writers independently enforce different versions of the same rule? | Establish an owner or explicit coordinated protocol; retain atomic constraints where races remain possible. |
| Redundant paths | Are in-scope callers choosing among superseded ways to express one operation? | Migrate callers and retire the obsolete path together, after resolving stored data and out-of-scope consumers. |
| Reachable internals | Can a caller bypass the supported contract by importing implementation details? | Use existing visibility or package boundaries to make the intended interface effective. Tester owns new enforcement checks. |
| Hand-maintained duplicates | Does adding one concept require editing several lists that claim the same truth? | Derive the copies from their owner where practical; a necessary consistency check belongs to Tester. |
| Invalid data states | Do flags, optional fields, or casts hide mutually exclusive states or missing invariants? | Choose data shapes that express actual states and transitions, keeping dynamic enforcement where needed. |
| Excessive caller knowledge | Must callers understand ordering, retries, locks, cleanup, or storage to use a simple operation? | Move responsibility inward where it belongs, while keeping necessary failure and effect guarantees explicit. |

Judge candidates using realistic pressure: change one business rule, add a caller, replay an external message, or interrupt a state transition when those situations apply. Identify which knowledge must change and where the guarantee is enforced. These are design walkthroughs; executable acceptance checks remain Tester-owned.

Prefer a design that a future contributor can modify from its public contract and owning implementation. Do not remove a justified security, isolation, recovery, or external-protocol boundary to make the diagram smaller. When the tradeoff remains uncertain, choose the smallest experiment that could distinguish it and assign formal verification to Tester.
