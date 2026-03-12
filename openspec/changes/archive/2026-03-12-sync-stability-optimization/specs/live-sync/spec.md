## MODIFIED Requirements

### Requirement: Automatic Data Refresh in Browser
The browser SHALL automatically re-fetch model data upon receiving an update notification, provided that the update does not conflict with a recent local save operation.

#### Scenario: Visualizer refreshes from external change
- **WHEN** the visualizer receives an "update" message via WebSocket
- **AND** the browser is not currently saving and has not saved within the last 1500ms
- **THEN** it executes `refreshModelData()` to update the React Flow canvas

#### Scenario: Visualizer ignores self-triggered update
- **WHEN** the visualizer receives an "update" message via WebSocket
- **AND** the update is received within 1500ms of a local save operation
- **THEN** it skips the data refresh to prevent UI flickering or state reversal
