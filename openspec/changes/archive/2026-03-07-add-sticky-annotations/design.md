## Context

Currently, Modscape only supports formal modeling objects (tables, domains). There is no way to add informal metadata or visual cues for humans. This design introduces a separate annotation layer that allows users to place sticky notes and callouts on the canvas, linked to existing modeling objects but stored independently.

## Goals / Non-Goals

**Goals:**
- Provide a decoupled way to add visual notes (annotations) to the model.
- Support "Sticky Notes" (on-object) and "Callouts" (pointing to objects).
- Ensure annotations move with their target objects.
- Maintain YAML-first purity by storing annotations in a separate top-level section.

**Non-Goals:**
- Rich text formatting (HTML) within notes (plain text only for now).
- Drawing arbitrary shapes (circles, arrows) besides the predefined callout/sticky types.
- Multi-user real-time collaboration on notes.

## Decisions

### 1. Decoupled YAML Schema
Annotations will be stored in a top-level `annotations` array in the YAML, rather than nested inside `tables` or `domains`.
- **Rationale**: Keeps the core entity definitions clean and "implementation-ready" for AI agents while allowing the visualizer to layer on communication metadata.
- **Alternatives**: Nesting `notes` inside `tables`. *Rejected* because it pollutes the logical schema and makes it harder to annotate relationships or cross-domain areas.

### 2. Relative Positioning (Offset-based)
Annotations will store their position as an `offset: { x: number, y: number }` relative to the target object's top-left corner.
- **Rationale**: When a user drags a table or performs an auto-layout, the absolute coordinates of the target change. By storing an offset, the annotation "sticks" to the target without needing a YAML update for every move.
- **Implementation**: The visualizer calculates `absolute_pos = target_pos + offset` during render. When dragging the annotation itself, the `offset` is updated.

### 3. React Flow Custom Components
- **`AnnotationNode`**: A specialized node type with no handles (unless it's a callout) and a distinct visual style (paper-like background).
- **`AnnotationEdge`**: A specialized, non-interactive edge that connects an `AnnotationNode` to its `targetId`. It will use a dashed line or a simple thin line to avoid confusion with ER/Lineage edges.

### 4. Store Actions and State
The Zustand store will be updated with:
- `annotations: Annotation[]` in the schema.
- `addAnnotation(targetId, type, pos)`: Creates a new annotation.
- `updateAnnotation(id, updates)`: Updates text, type, or offset.
- `removeAnnotation(id)`: Deletes the annotation.
- `onNodesChange` wrapper: Detects when an annotation node is dragged and calculates the new `offset` relative to its target.

## Risks / Trade-offs

- **[Risk] Broken References** → If a table is renamed or deleted, the annotation loses its target.
  - **Mitigation**: The system SHALL render orphaned annotations as "floating" notes (at their last absolute position or near the center) and mark them as orphaned in the UI.
- **[Risk] Visual Clutter** → Too many notes can obscure the diagram.
  - **Mitigation**: Add a "Show/Hide Annotations" toggle in the `CanvasToolbar` (similar to ER/Lineage toggles).
- **[Risk] YAML Stability** → Dragging a table might trigger many YAML updates if offsets aren't managed carefully.
  - **Mitigation**: Offsets are only updated when the *annotation itself* is moved relative to the target. Moving the target node together with its attached annotations does not change the offset.
