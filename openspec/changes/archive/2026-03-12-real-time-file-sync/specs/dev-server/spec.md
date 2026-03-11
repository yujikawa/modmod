## MODIFIED Requirements

### Requirement: YAML File Watching
The dev server SHALL watch the specified YAML file for changes and notify the visualizer via WebSocket.

#### Scenario: YAML file is edited externally
- **WHEN** the user saves changes to the YAML file in an external editor
- **THEN** the dev server broadcasts an update message to all connected WebSocket clients
