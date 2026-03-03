## Context

Currently, `DomainNode` (container) dragging is restricted to the `.domain-drag-handle` (the label at the top) via the `dragHandle` property in `App.tsx`. Additionally, the background `div` of `DomainNode` is explicitly marked with `nodrag`, preventing it from initiating a drag. This makes it difficult to reposition large or crowded domains.

## Goals / Non-Goals

**Goals:**
- Allow dragging a `DomainNode` by clicking and dragging anywhere on its empty background area.
- Improve the visual indication that the background is interactive.
- Maintain the existing behavior where dragging a table inside a domain only moves that table.

**Non-Goals:**
- Changing the layout persistence logic.
- Adding complex multi-select-and-drag-inside-domain logic.

## Decisions

### 1. Remove Restricted Drag Handle
We will remove `dragHandle: '.domain-drag-handle'` from the `DomainNode` configuration in `App.tsx`.
**Rationale:** By default, React Flow allows the entire node area to be a drag handle unless restricted. Removing this property opens up the entire node for dragging.

### 2. Enable Background Interaction
We will remove the `nodrag` class from the background `div` in `DomainNode.tsx`.
**Rationale:** The `nodrag` class explicitly prevents React Flow from initiating a drag event from that element. Removing it allows the background to capture the drag.

### 3. Visual Cues for Draggability
Change the `cursor` property of the background `div` from `default` to `grab`.
**Rationale:** This standard UI pattern informs the user that the surface can be "grabbed" and moved.

## Risks / Trade-offs

- **[Risk] Confusing drag priority** → React Flow naturally prioritizes the deepest interactive element. If a user clicks a `TableNode`'s drag handle inside a `DomainNode`, the table will move. If they click the `DomainNode` background, the domain will move.
- **[Risk] Accidental domain movement when trying to select tables** → Since `selectNodesOnDrag={false}` is already set in `App.tsx`, the background is already not being used for marquee selection. Making it a drag handle is a logical use for that empty space.
