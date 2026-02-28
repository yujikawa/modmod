## MODIFIED Requirements

### Requirement: File Selection
The sidebar SHALL include a file selection component to switch between available YAML models.

#### Scenario: Switching files in the UI
- **WHEN** the user selects a model from the dropdown list
- **THEN** the visualizer updates the URL and fetches the selected model data

### Requirement: Editor Model Context
The editor SHALL maintain the context of the currently selected model when saving changes.

#### Scenario: Editing a specific file
- **WHEN** the user clicks "Save & Update" while viewing the `billing` model
- **THEN** the `POST /api/save-yaml?model=billing` request is sent with the updated content
