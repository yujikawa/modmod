## MODIFIED Requirements

### Requirement: CLI Entry Point
The system SHALL provide a `modscape` command with subcommands for development, building, and importing data.

#### Scenario: Running the help command
- **WHEN** the user runs `modscape --help`
- **THEN** the system displays usage instructions for `dev`, `build`, `init`, `export`, and `import-dbt` subcommands
