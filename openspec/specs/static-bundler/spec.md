## ADDED Requirements

### Requirement: Static Asset Generation
The system SHALL generate a standalone version of the visualizer that requires no backend.

#### Scenario: Running a build
- **WHEN** the user executes `modmod build` for a specific model
- **THEN** the visualizer sources all its data from an embedded constant or an internal JSON file

### Requirement: YAML Embedding
The system SHALL embed the specified YAML model into the production build artifacts.

#### Scenario: Production build data injection
- **WHEN** the user initiates a production build
- **THEN** the visualizer is compiled with the model data as an internal dependency
    
### Requirement: Standalone Deployment
The output SHALL be a standard `dist/` directory with a single `index.html` file.

#### Scenario: Hosting the build result
- **WHEN** the generated `dist/` directory is served by a standard HTTP server
- **THEN** the visualizer loads with the correct model data pre-populated
