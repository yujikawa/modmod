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

## MODIFIED Requirements

### Requirement: Layout preservation
The system SHALL persist the positions and dimensions of nodes in the `layout` section of the YAML model.

#### Scenario: Stable domain movement
- **WHEN** multiple nodes are inside a domain
- **AND** some nodes do NOT have explicit layout entries (using auto-layout)
- **AND** the user moves ONE node
- **THEN** only the moved node's coordinates SHALL change in the YAML
- **AND** other nodes SHALL maintain their relative positions without jumping
