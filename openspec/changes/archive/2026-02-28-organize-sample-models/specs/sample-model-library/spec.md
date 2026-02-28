## ADDED Requirements

### Requirement: Sample Model Directory
The system SHALL provide a `samples/` directory at the project root containing various data model examples.

#### Scenario: User navigates the project
- **WHEN** the user explores the root directory
- **THEN** they find a `samples/` folder with multiple `.yaml` models

### Requirement: Documented Development Workflow
The system SHALL provide updated development instructions in `DEVELOPMENT.md` that leverage the `samples/` directory.

#### Scenario: User follows DEVELOPMENT.md
- **WHEN** the user follows the instructions to start the dev server
- **THEN** they use the `samples/` directory to see all examples at once

## MODIFIED Requirements

### Requirement: YAML File Watching
The dev server SHALL continue to support file watching for any YAML file in the `samples/` directory.

#### Scenario: Editing a sample model
- **WHEN** the user modifies `samples/ecommerce.yaml`
- **THEN** the dev server updates the visualizer with the new data
