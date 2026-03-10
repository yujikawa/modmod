## MODIFIED Requirements

### Requirement: YAML Editor with live sync
The sidebar SHALL include a YAML editor that provides bidirectional sync with the visual canvas.

#### Scenario: Update YAML from canvas
- **WHEN** user moves a node or edits an entity visually
- **THEN** YAML in the editor SHALL update automatically
- **AND** the YAML SHALL use standard keys (e.g., `y` without quotes)

### Requirement: Undo/Redo support
The editor SHALL support undo/redo for both textual and visual changes.

#### Scenario: Undo visual move
- **WHEN** user moves a node
- **AND** presses Ctrl+Z
- **THEN** the node SHALL return to its previous position

#### Scenario: Undo history isolation
- **WHEN** user switches from "File A" to "File B"
- **AND** presses Ctrl+Z
- **THEN** the editor SHALL NOT revert to the content of "File A"
- **AND** the undo stack SHALL be cleared or isolated for "File B"
