## ADDED Requirements

### Requirement: In-memory YAML editing in static mode
The YAML editor SHALL be functional even in static builds (not in CLI mode).

#### Scenario: Edit YAML in static build
- **WHEN** user modifies YAML in the editor while in a static build
- **AND** user clicks "Apply Changes"
- **THEN** diagram is updated based on the new YAML in-memory

### Requirement: Conditional save button
The editor's save button SHALL reflect the persistence capability of the current mode.

#### Scenario: Save button in CLI mode
- **WHEN** visualizer is in CLI mode
- **THEN** button label is "Save to File" (or similar)
- **THEN** clicking it updates the local YAML file

#### Scenario: Save button in static mode
- **WHEN** visualizer is in static build mode
- **THEN** button label is "Apply Changes" (or similar)
- **THEN** clicking it updates the in-memory schema state only
- **THEN** a warning/info message explains that changes are temporary

### Requirement: Automatic reset on reload
All in-memory YAML edits in static mode SHALL be lost upon page reload.

#### Scenario: Reload after sandbox edit
- **WHEN** user makes edits in static mode and reloads the page
- **THEN** the visualizer displays the original model data embedded in the HTML

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
