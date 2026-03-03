## Why

Domain nodes (containers) are difficult to move when they are large or filled with tables because only the small label acts as a drag handle, and the background explicitly disables dragging with the `nodrag` class. This makes it almost impossible to reposition a domain once it fills the screen or contains many tables.

## What Changes

- **Enhanced Draggability**: Remove the restriction that only the label can drag a domain node. The entire background area (excluding tables and UI elements) will become a drag handle.
- **Improved Visual Cues**: Update the cursor to `grab` when hovering over the draggable background of a domain.
- **Cleanup**: Remove unnecessary `nodrag` classes and explicit `dragHandle` selectors that currently restrict interaction.

## Capabilities

### New Capabilities
<!-- No new capabilities -->

### Modified Capabilities
- `domain-containers`: Update interaction requirements to allow dragging the container by its background area.

## Impact

- `visualizer/src/components/DomainNode.tsx`: UI changes to background and cursor.
- `visualizer/src/App.tsx`: Configuration changes to React Flow node properties.
