## ADDED Requirements

### Requirement: Init Subcommand Integration
The `modmod` CLI SHALL register a new `init` subcommand.

#### Scenario: Running modmod help after update
- **WHEN** the user runs `modmod --help`
- **THEN** the list of commands includes `init` with a description like "Initialize project with AI modeling rules"
