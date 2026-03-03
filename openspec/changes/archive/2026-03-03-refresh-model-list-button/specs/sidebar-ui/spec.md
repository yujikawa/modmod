## ADDED Requirements

### Requirement: Model List Refresh
The system SHALL provide a manual refresh mechanism to sync the list of available YAML models with the filesystem.

#### Scenario: User refreshes the model list
- **WHEN** the user clicks the refresh button in the sidebar
- **THEN** the system re-scans the model directories and updates the model selector dropdown without reloading the page

### Requirement: Dynamic Model Detection
The CLI server SHALL detect new YAML files added to the watched paths when the model list is requested.

#### Scenario: New file added to directory
- **WHEN** a new YAML file is added to a watched directory and the user refreshes the model list
- **THEN** the new file appears in the model selector dropdown
