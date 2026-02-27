## ADDED Requirements

### Requirement: Interactive Init Command
The system SHALL provide an interactive CLI subcommand `init` to guide the project setup.

#### Scenario: Running modmod init
- **WHEN** the user runs `modmod init`
- **THEN** the system prompts the user to select which AI agents they use (Gemini, Codex, Claude)

### Requirement: Safe Scaffolding
The system SHALL NOT overwrite existing configuration files during the `init` process without user consent.

#### Scenario: Running init where .clauderules already exists
- **WHEN** the user runs `init` and `.clauderules` is already present
- **THEN** the system skips that file or asks the user for permission to overwrite
