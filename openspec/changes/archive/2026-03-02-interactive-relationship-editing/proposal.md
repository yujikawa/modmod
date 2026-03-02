## Why

Adding interactive relationship editing will allow users to define and modify relationships between entities directly through the visualizer UI. This transforms the tool from a static viewer into an interactive modeling environment, enabling rapid prototyping and visual schema design.

## What Changes

- **Drag-and-Drop Relationship Creation**: Users can initiate a new relationship by dragging from a "handle" on a source table column to a target table.
- **Relationship Property Editing**: A new interface (likely within the Detail Panel) for modifying relationship metadata like type (FK, Join Table), cardinality, and description.
- **Visual Feedback during Creation**: Real-time visual indicators while dragging to show valid connection targets.
- **Interactive Deletion**: (Building on `interactive-edge-deletion` or refining it) a clear UI for removing existing relationships.

## Capabilities

### New Capabilities
- `interactive-relationship-editing`: The core orchestration of UI interactions for creating and modifying relationships.

### Modified Capabilities
- `visualizer-core`: Update to handle new event types and state changes related to relationship creation/modification.
- `detail-panel`: Extend to support relationship property editing when an edge is selected.

## Impact

- **React Components**: `TableNode` and `ButtonEdge` will need updates to support interaction handles and selection states.
- **Store**: `useStore.ts` will need new actions for adding/updating relationships.
- **Parser/Generator**: Updates to ensure that changes made in the UI can be persisted back to the YAML model.
