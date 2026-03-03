## Why

Currently, clicking or dragging entities in the visualizer triggers unwanted side effects: detail panels open immediately on drag start (overlapping the node), and background clicks fail to deselect nodes. This change aims to separate "placement" from "activation" and provide better visual feedback during interactions to improve the overall user experience.

## What Changes

- **Drag and Click Separation**: Modify interaction logic to only open the detail panel on a distinct click, not during or after a drag.
- **Auto-Deselection on Drag End**: Automatically deselect nodes after a drag operation is completed to keep the canvas clean.
- **Enhanced Visual Feedback**: Add visual "elevation" (deeper shadows and slight scaling) to nodes while they are being dragged.
- **Native Selection Integration**: Restore reliance on React Flow's native selection events by removing restrictive manual click handlers in custom nodes.

## Capabilities

### New Capabilities
- None

### Modified Capabilities
- `visualizer-core`: Update global interaction logic to handle drag vs click and selection state.
- `entity-appearance`: Add styles for the "elevated" state of nodes during drag.

## Impact

- `visualizer/src/App.tsx`: Main logic for handling React Flow events.
- `visualizer/src/components/TableNode.tsx`: Removal of restrictive click handlers.
- `visualizer/src/components/DomainNode.tsx`: Removal of restrictive click handlers.
- `visualizer/src/index.css`: Addition of drag-state visual styles.
