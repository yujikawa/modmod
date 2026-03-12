## ADDED Requirements

### Requirement: YAML File Watching
The dev server SHALL watch the specified YAML file for changes and notify the visualizer via WebSocket.

#### Scenario: YAML file is edited externally
- **WHEN** the user saves changes to the YAML file in an external editor
- **THEN** the dev server broadcasts an update message to all connected WebSocket clients

### Requirement: Layout Update API
The dev server SHALL provide an API endpoint to receive and persist layout changes.

#### Scenario: Visualizer sends new coordinates
- **WHEN** the dev server receives a `POST /api/layout` request with node coordinates
- **THEN** it updates the corresponding `layout` section in the local YAML file
