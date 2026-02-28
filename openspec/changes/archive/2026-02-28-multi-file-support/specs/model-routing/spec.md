## ADDED Requirements

### Requirement: URL-based Model Selection
The visualizer SHALL extract the `model` parameter from the URL query string on initialization.

#### Scenario: Selecting a model via URL
- **WHEN** the user visits `http://localhost:5173/?model=auth`
- **THEN** the visualizer fetches and displays the model data for `auth`

### Requirement: URL Sync on Selection
The visualizer SHALL update the browser URL query string whenever a different model is selected in the UI.

#### Scenario: Switching models in the sidebar
- **WHEN** the user selects `billing` from the file selector
- **THEN** the URL updates to include `?model=billing` without a full page reload

### Requirement: Refresh Persistence
The visualizer SHALL maintain the current model selection across page refreshes by reading from the URL.

#### Scenario: Reloading the browser
- **WHEN** the user is viewing the `user` model and refreshes the browser
- **THEN** the visualizer reloads with the `user` model selected
