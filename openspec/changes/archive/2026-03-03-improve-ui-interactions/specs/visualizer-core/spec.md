## MODIFIED Requirements

### Requirement: Table Selection
The system SHALL allow users to select a table on the canvas to view its details. Selection SHALL only be triggered by an explicit click event, not during or after a drag operation. Selection SHALL be cleared when the user clicks on the canvas background or finishes dragging a node.

#### Scenario: User clicks a table
- **WHEN** the user clicks on a table node without moving it
- **THEN** the table is highlighted and the detail panel is opened

#### Scenario: User clicks the background
- **WHEN** the user clicks on an empty area of the canvas
- **THEN** all selections are cleared and the detail panel is closed

#### Scenario: User stops dragging a node
- **WHEN** the user releases a node after dragging it
- **THEN** the node selection is cleared to keep the canvas focused on layout
