## ADDED Requirements

### Requirement: CLI Entry Point
The system SHALL provide a `modmod` command with subcommands for development and building.

#### Scenario: Running the help command
- **WHEN** the user runs `modmod --help`
- **THEN** the system displays usage instructions for `dev` and `build` subcommands

### Requirement: CLI Development Mode
The system SHALL support a `dev` command that starts a local modeling session.

#### Scenario: Starting development mode
- **WHEN** the user runs `modmod dev my-model.yaml`
- **THEN** the system starts a local server and opens the visualizer in the default browser

### Requirement: CLI Build Mode
The system SHALL support a `build` command that generates a static site.

#### Scenario: Building a static site
- **WHEN** the user runs `modmod build my-model.yaml`
- **THEN** the system generates a `dist/` directory containing a standalone version of the visualizer with the model data embedded
## ADDED Requirements

### Requirement: Init Subcommand Integration
The `modmod` CLI SHALL register a new `init` subcommand.

#### Scenario: Running modmod help after update
- **WHEN** the user runs `modmod --help`
- **THEN** the list of commands includes `init` with a description like "Initialize project with AI modeling rules"
