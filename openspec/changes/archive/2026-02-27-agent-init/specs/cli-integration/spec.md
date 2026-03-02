## ADDED Requirements

### Requirement: Init Subcommand Integration
The `modscape` CLI SHALL register a new `init` subcommand.

#### Scenario: Running modscape help after update
- **WHEN** the user runs `modscape --help`
- **THEN** the list of commands includes `init` with a description like "Initialize project with AI modeling rules"
