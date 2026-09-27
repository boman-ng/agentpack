# UI Patterns and Distinctions

Use these examples to distinguish observable behavior, not as a one-to-one dictionary or a required checklist. Existing project terminology is useful context, but a component's name or appearance does not establish its behavior. The formulations below are interpretations; linked sources support particular concepts, not a universal taxonomy.

## Layout and adaptation

| Everyday description | Useful concepts | Distinction to preserve |
|---|---|---|
| "Less cramped, with all the information" | Grouping, spacing rhythm, hierarchy, information density | Reorganizing content differs from hiding, truncating, or deleting it. |
| "Like a magazine" | Typography hierarchy, columns, editorial composition | Aesthetic intent does not select CSS Grid or any particular layout mechanism. |
| "Cards line up despite different text lengths" | Intrinsic sizing, wrapping, grid/flex constraints | Equal-height rows, variable-height cards, masonry, and truncation are different outcomes. |
| "Keep this at the top once I reach it" | Sticky positioning | Container-bounded sticking differs from being fixed to the viewport from the start. |
| "Make it work in a narrow sidebar and on a phone" | Responsive reflow, available space, overflow | A component's available container width can differ from the viewport width; shrinking a desktop layout does not define the desired reflow. |
| "Premium, but practical and not flashy" | Alignment, typography, hierarchy, density | Preserve the product's task and visual identity; glow, parallax, or a marketing hero is not implied. |

[MDN Grid layout](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Grid_layout) describes layout mechanisms. [Container queries](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Containment/Container_queries) distinguish conditions on a container from viewport or device conditions; neither dictates the intended design.

**Example:** "Make the settings less cramped, but keep every setting" can become "Retain every setting while improving grouping, label alignment, and spacing between related groups." Collapsing advanced controls is a separate proposal, not a translation of the original constraint.

## Components and interaction

| Everyday description | Useful concepts | Distinction to preserve |
|---|---|---|
| "A button that takes me to the invoice" | Navigation link, action button | Navigate to a destination versus perform an action such as submitting, deleting, or expanding; visual button styling does not determine semantics. |
| "A small explanation when I point at this" | Tooltip, contextual help | Brief non-interactive information differs from a panel containing links or buttons. Check focus/touch access when relevant instead of assuming hover works for everyone. |
| "The little help bubble contains a link I need to click" | Interactive disclosure, popover; toggletip in some design systems | Content must remain reachable and usable. Do not specify tooltip semantics for an interactive panel; determine modality separately. |
| "Show more here without leaving" | Inline expansion, disclosure | Expanding in place differs from a floating panel, drawer, or navigation. One disclosure need not be a multi-section accordion. |
| "Deal with this before continuing" | Modal dialog | Modality concerns whether the rest of the interface remains interactive; an overlay's appearance alone does not establish it. |
| "Go back to the list without losing my place" | Navigation-state restoration | Preserve the requested scroll position, filters, or selection; this does not imply accounts, cross-device sync, or indefinite persistence. |

[Carbon's link guidance](https://carbondesignsystem.com/components/link/usage/) distinguishes navigation from actions. [MDN's tooltip role](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/tooltip_role) explains why a tooltip does not contain interactive elements; [Carbon's tooltip guidance](https://carbondesignsystem.com/components/tooltip/usage/) contrasts it with that design system's toggletip. Do not prescribe Carbon or treat its component names as universal standards.

The generic word "popover" does not identify an API or interaction contract. Specifically, the browser [Popover API](https://developer.mozilla.org/en-US/docs/Web/API/Popover_API) provides non-modal presentation. A modal interaction needs its own appropriate semantics and focus behavior; naming a visual effect does not supply those requirements.

## State and feedback

| Everyday description | Useful concepts | Distinction to preserve |
|---|---|---|
| "React immediately, but show if saving fails" | Optimistic feedback, pending state, reconciliation | Temporary UI feedback is not confirmed persistence; success and failure must remain distinguishable. |
| "Show something while loading" | Loading indicator, skeleton, empty state, error state | These represent different conditions; a placeholder does not make the underlying request faster. |
| "Tell me what's wrong as I fill this in" | Validation timing, field feedback, recovery | Input, blur, and submit are different triggers; error color alone does not describe how to correct the problem. |
| "Don't make me enter everything again" | Retained input, recovery | Keeping current input differs from adding autosave or long-term draft storage. |
| "Typing works, but results sometimes jump back" | Stale-response handling, latest-intent consistency | Debouncing changes request timing; it does not by itself prevent an older response from replacing newer results. |
| "A huge list should stay usable" | Virtualization, pagination, incremental loading | Rendering fewer items, splitting pages, and fetching more data change different things; preserve required search, focus, and navigation behavior. |
| "The page should not jump when results arrive" | Layout stability, reserved space | Geometry shifts differ from slow input or animation stutter. |

[React's optimistic-state documentation](https://react.dev/reference/react/useOptimistic) illustrates temporary state and reconciliation; the concept does not require React or this hook.

**Example:** "The like button responds immediately without pretending a failed request succeeded" becomes "Show the intended change provisionally, reconcile it with the server result, and visibly recover on failure." A decorative animation alone would not express that behavior.

## Quality without expanding the brief

Use keyboard, focus, dismissal, and touch behavior to distinguish interaction patterns when they affect the translation. Separate user-stated requirements from recommendations while respecting applicable project accessibility and quality requirements. Do not turn a naming question into a full audit or promise conformance, performance, or browser support from a component name alone.
