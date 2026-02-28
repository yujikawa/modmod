## MODIFIED Requirements

### Requirement: Project Branding
The system SHALL use `Modscape` as the primary project name in all UI components and documentation.

#### Scenario: User opens the visualizer
- **WHEN** the user views the sidebar header
- **THEN** they see "Modscape" instead of "ModMod"

### Requirement: CLI Entry Point
The system SHALL provide a `modscape` command to interact with the toolkit.

#### Scenario: Running the CLI
- **WHEN** the user runs `modscape dev`
- **THEN** the development server starts correctly

### Requirement: Configuration Directory
The system SHALL use a `.modscape/` directory for project-specific modeling rules and agent scaffolding.

#### Scenario: Initializing a project
- **WHEN** the user runs `modscape init`
- **THEN** a `.modscape/` directory is created with the necessary templates
