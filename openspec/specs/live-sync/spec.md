## ADDED Requirements

### Requirement: Automatic File Change Detection
The server SHALL detect when a monitored YAML file is saved in an external editor.

#### Scenario: User saves a file
- **WHEN** the user saves changes to `model.yaml`
- **THEN** the server log displays "File system event (change): model.yaml"

### Requirement: Broadcast Update Notifications
The server SHALL broadcast an update notification to all connected WebSocket clients when a file change is detected.

#### Scenario: Server sends notification
- **WHEN** a file change event is triggered
- **THEN** the server sends a message `{"type": "update", "path": "..."}` via WebSocket

### Requirement: Automatic Data Refresh in Browser
The browser SHALL automatically re-fetch model data upon receiving an update notification, provided that the update does not conflict with a recent local save operation.

#### Scenario: Visualizer refreshes from external change
- **WHEN** the visualizer receives an "update" message via WebSocket
- **AND** the browser is not currently saving and has not saved within the last 3000ms
- **THEN** it executes `refreshModelData()` to update the React Flow canvas

#### Scenario: Visualizer ignores self-triggered update
- **WHEN** the visualizer receives an "update" message via WebSocket
- **AND** the update is received within 3000ms of a local save operation
- **THEN** it skips the data refresh to prevent UI flickering or state reversal

### Requirement: Automatic Reconnection
The browser SHALL automatically attempt to reconnect if the WebSocket connection is lost.

#### Scenario: Server restarts
- **WHEN** the connection is closed due to a server restart
- **THEN** the browser attempts to reconnect with exponential backoff

### Requirement: Directory Change Detection
The server SHALL detect when new YAML files are added to or existing files are removed from a monitored directory.

#### Scenario: New file added
- **WHEN** a new YAML file is created in a watched directory
- **THEN** the server broadcasts a `{"type": "files_changed"}` message

### Requirement: Model List Synchronization
The browser SHALL refresh the list of available files when it receives a `files_changed` notification.

#### Scenario: Sidebar updates
- **WHEN** the browser receives a `files_changed` message
- **THEN** it executes `fetchAvailableFiles()` to update the model selector dropdown

### Requirement: Removal of Manual Refresh Controls
The system SHALL remove manual refresh buttons from the UI as synchronization is now handled automatically.

#### Scenario: Clean UI
- **WHEN** the visualizer is loaded in CLI mode
- **THEN** the `RefreshCw` icon is not visible in the Sidebar header
