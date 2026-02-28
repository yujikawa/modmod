## MODIFIED Requirements

### Requirement: YAML File Watching
The dev server SHALL watch ALL specified YAML files for changes and notify the visualizer.

#### Scenario: YAML file is edited externally
- **WHEN** the user saves changes to any YAML file in the watched directory
- **THEN** the dev server sends a reload signal or updated data to the connected visualizer for the corresponding model

### Requirement: Layout Update API
The dev server SHALL provide an API endpoint to receive and persist layout changes for a specific model.

#### Scenario: Visualizer sends new coordinates
- **WHEN** the dev server receives a `POST /api/layout?model=user` request with node coordinates
- **THEN** it updates the corresponding `layout` section in the `user.yaml` file
