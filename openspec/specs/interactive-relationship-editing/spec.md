## ADDED Requirements

### Requirement: Drag-to-Create Relationship
The system SHALL allow users to create a new relationship by dragging from a source column to a target table.

#### Scenario: Initiating drag from a handle
- **WHEN** the user mouses over a table column
- **THEN** a circular handle appears on the right/left side of the column for relationship creation

#### Scenario: Dropping on a target table
- **WHEN** the user drags from a column handle and drops onto another table
- **THEN** a new relationship is created between the source column and the target table

### Requirement: Relationship Selection
The system SHALL allow users to select an edge representing a relationship to view and edit its properties.

#### Scenario: Clicking an edge
- **WHEN** the user clicks on a relationship edge in the diagram
- **THEN** the edge is visually highlighted and its properties are loaded into the Detail Panel

### Requirement: Live Relationship Validation
The system SHALL provide visual feedback to indicate if a relationship can be created between the dragged source and the current target.

#### Scenario: Highlighting valid targets
- **WHEN** a relationship is being dragged
- **THEN** potential target tables are highlighted to indicate they can receive the connection
