## ADDED Requirements

### Requirement: Edge Delete Control
The system SHALL display a delete button on every relationship edge in the visualizer canvas.

#### Scenario: Button Visibility
- **WHEN** an edge is rendered between two nodes
- **THEN** a circular delete button is positioned at the midpoint of the edge path

### Requirement: Edge Deletion Sync
The system SHALL remove the relationship from the underlying YAML model when the edge delete button is clicked.

#### Scenario: User clicks delete button
- **WHEN** the user clicks the delete button on an edge
- **THEN** the edge is removed from the canvas and the corresponding relationship is deleted from the YAML model
