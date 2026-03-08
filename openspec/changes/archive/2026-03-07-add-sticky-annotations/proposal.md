## Why

Modscape is evolving from a mere visualization tool into a collaborative modeling IDE. While the current tri-layer naming and domain grouping are excellent for structured design, there is a missing layer for informal, "human-in-the-loop" communication. Data engineers and business users need a way to leave context-specific notes, warnings, or "work-in-progress" markers directly on the canvas without polluting the formal table and domain definitions. This change introduces a decoupled annotation layer to bridge the gap between technical design and business conversation.

## What Changes

- **New YAML Section**: Introduction of a top-level `annotations` key in the `model.yaml` to store all visual notes and callouts.
- **Sticky Annotations**: Visual "sticky notes" that can be placed on or near tables and domains. They are linked to their targets via IDs but stored separately to maintain data purity.
- **Callout Bubbles**: Speech-bubble style annotations that can point to specific objects (tables, domains, or relationships) with a connector line.
- **Interactive Editing**: Support for adding, editing (in-place text entry), and dragging annotations directly on the React Flow canvas.
- **Relative Positioning**: Annotations use offsets relative to their targets, ensuring they "stick" to the target even when it is moved or the layout is recalculated.
- **Visual Styling**: Support for different note types (e.g., note, warning, callout) and basic color customization.

## Capabilities

### New Capabilities
- `sticky-annotations`: Manages the lifecycle, rendering, and persistence of visual annotations and their relationships to modeling objects.

### Modified Capabilities
- `visualizer-core`: Updated to support a new interaction layer for annotations, including custom node types and "connector" edges.
- `resilient-parser`: Updated to recognize and preserve the new `annotations` top-level section in YAML files.

## Impact

- **Schema**: `model.yaml` gains a new `annotations` array.
- **Frontend**: New React Flow custom nodes (`AnnotationNode`) and potentially a specialized edge type for callouts.
- **Store**: Zustand store will be updated to handle annotation state and synchronization with the YAML editor.
- **UI**: New tools in the `CanvasToolbar` for adding annotations.
