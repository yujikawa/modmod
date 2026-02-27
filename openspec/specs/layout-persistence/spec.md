## ADDED Requirements

### Requirement: Node Position Detection
The visualizer SHALL detect when a table node's position has changed through user interaction.

#### Scenario: Dragging a table node
- **WHEN** the user drags a table node to a new position on the canvas
- **THEN** the visualizer updates the current node's coordinates in the state

### Requirement: Auto-Save Coordination
The visualizer SHALL automatically send updated node coordinates to the dev server.

#### Scenario: Debounced position update
- **WHEN** node positions have changed and the user stops dragging
- **THEN** the visualizer sends a `POST /api/layout` request after a short debounce period
