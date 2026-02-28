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
