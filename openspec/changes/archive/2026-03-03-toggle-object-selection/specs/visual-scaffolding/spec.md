## ADDED Requirements

### Requirement: Toggle Node Selection
The system SHALL toggle the selection state of a table or domain node when clicked.

#### Scenario: Toggling node off
- **WHEN** the user clicks a node that is already selected
- **THEN** the node is deselected and the detail panel is closed

#### Scenario: Toggling node on
- **WHEN** the user clicks a node that is not selected
- **THEN** the node is selected and the detail panel opens

### Requirement: Toggle Edge Selection
The system SHALL toggle the selection state of a relationship (edge) when clicked.

#### Scenario: Toggling edge off
- **WHEN** the user clicks an edge that is already selected
- **THEN** the edge is deselected

#### Scenario: Toggling edge on
- **WHEN** the user clicks an edge that is not selected
- **THEN** the edge is selected
