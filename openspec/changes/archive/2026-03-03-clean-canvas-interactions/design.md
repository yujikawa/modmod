## Context

Refining the interaction model to strictly separate layout actions (dragging) from destructive or analytical actions (selecting/deleting/viewing details).

## Goals / Non-Goals

**Goals:**
- **Drag = Pure Movement**: Dragging a node should not select it.
- **Click = Activation**: Only a distinct click selects a node, opens the detail panel, and makes it deletable via keyboard.
- **Clean Canvas**: No on-canvas delete buttons.
- **Contextual Actions**: Centralized delete button in the toolbar when an element is active.

## Decisions

### 1. Disable Selection on Drag
Set `selectNodesOnDrag={false}` in the `ReactFlow` component.
- **Rationale**: Prevents nodes from entering the "selected" state (and thus becoming deletable or opening the panel) when the user only intended to move them.

### 2. Manual Activation on `onNodeClick`
The Store's `selectedTableId` will be set during the `onNodeClick` event.
- **Rationale**: React Flow triggers `onNodeClick` only if the mouse was released without significant movement, perfectly matching the "click to edit" intent.

### 3. Clear Selection on Drag Stop
Explicitly clear selection in `onNodeDragStop`.
- **Rationale**: Ensures that even if a node was briefly selected, it returns to a neutral state after being placed.

### 4. Enable Keyboard Deletion
(Completed) Set `deleteKeyCode={['Backspace', 'Delete']}`.
