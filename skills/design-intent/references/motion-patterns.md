# Motion Patterns and Distinctions

Describe what changes, when it changes, and what must remain continuous before suggesting a mechanism. The compositions below are useful descriptions, not standardized effect names or evidence about how a reference was implemented.

## Interface motion

| Everyday description | Useful concepts | Distinction to preserve |
|---|---|---|
| "The small card grows into the details" | Shared-element transition, visual continuity | Perceived object identity differs from crossfading two views; navigation and modality remain separate choices. |
| "Scrolling advances it; scrolling back reverses it" | Scroll-driven animation | Binding progress to scroll differs from entering the viewport and starting an independent clock. |
| "Play once it appears, then keep going" | Viewport-triggered playback | Visibility triggers playback; replay, reversal, and interruption are separate requirements. |
| "It speeds up and settles gently" | Easing, spring response | An easing curve controls progress; a dynamic spring model can carry velocity. A spring is not required just because the motion feels soft. |
| "A magnetic button" | Pointer-following offset, cursor treatment, snapping | Determine which object moves and under what input; no electromagnetic simulation is implied. |
| "Snap nearby, but don't flicker in and out" | Snapping, hysteresis | Capture and release conditions differ from a time-based debounce. |

[MDN's scroll-driven animations](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Scroll-driven_animations) describe progress timelines; [Intersection Observer](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) observes intersection changes. The [View Transition API](https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API) is one mechanism for continuity, not the definition or only implementation of a shared-element effect.

## Particles and visible effects

| Contribution | What it explains | Important boundary |
|---|---|---|
| Mask or activation field | Which regions or particles are affected, and by how much | Activation does not specify a motion direction. |
| Directional or radial threshold | A sweep across space or a wave from a center | Spatial ordering differs from all particles fading simultaneously. |
| Tangential orbiting | Motion around a center or axis | Orbiting does not specify inward/outward travel or an axial component. |
| Radial inflow / outflow | Convergence toward or movement away from a center or axis | Add axial motion only when rise or travel along the axis is intended. |
| Coherent perturbation | Irregular motion that varies continuously | Independent random jumps each frame do not preserve the same continuity. |
| Curl noise | A procedural curling vector field | It is not a complete fluid simulation or proof of realistic smoke. |
| Attraction and damping | Approach toward a target and reduction of oscillation | Damping alone does not define a return target; specify which target is intended. |
| Morphing / correspondence | Elements move toward a different shape | Changing positions differs from merely fading between two images. |
| Threshold dissolve | A field and threshold control local disappearance | An invented label such as "quantum erosion" does not establish physics or a unique algorithm. |
| Bloom / glow | Bright areas appear to spread into neighboring image regions | Glow is an appearance; bloom is a candidate mechanism, not proof from a still image. |
| Trail | A directional streak or visible history of movement | A radial brightness profile alone supplies neither direction nor history. |
| Temporal persistence | Earlier image content fades over subsequent frames | Fading current particles may leave historical image content visible. |

SideFX's [axis-force documentation](https://www.sidefx.com/docs/houdini/nodes/dop/popaxisforce.html) separates orbit, lift, and suction; its [curl-noise definition](https://www.sidefx.com/docs/houdini/vex/functions/curlnoise.html) describes the field construction. These are domain references, not a requirement to use Houdini. [Unreal Engine's bloom documentation](https://dev.epicgames.com/documentation/en-us/unreal-engine/bloom-in-unreal-engine) explains the image effect without establishing any particular reference's implementation.

**Spiral convergence:** "Dots circle inward" becomes "Combine tangential orbiting with radial inflow so the dots turn around the center while approaching it." "Spiral-converging particle motion" is descriptive wording, not a standardized algorithm. Preserve any supplied plane or axis constraint without choosing a new coordinate frame. Add irregularity only if requested.

**Directional dissolution:** "A scan moves left to right; untouched areas stay unchanged" becomes "Advance a directional activation boundary across the object and dissolve only the activated region." A global fade would violate the unaffected-region constraint.

**Return during dissolution:** If pointer-displaced particles should return while the object keeps changing, clarify their current animated target; always restoring initial positions could resurrect already-dissolved content. This is a behavior constraint, not a mandate for a particular simulation architecture.

## Composition and motion preferences

Separate activation, movement, appearance, and timing so that changing one does not silently change another. Forces, velocities, direct position interpolation, and opacity changes are different operations; do not combine them as interchangeable quantities. Specify position or velocity continuity only when the intended effect depends on it.

When reduced motion affects the task, preserve content and actions while adapting unnecessary movement. [MDN's reduced-motion preference](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion) describes how the preference is exposed; it does not prescribe one universal replacement. Identify added recommendations instead of presenting them as the user's original words, while honoring applicable project requirements.
