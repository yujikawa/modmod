## ADDED Requirements

### Requirement: Centralized Rules Template
The system SHALL create a template file at `.modmod/rules.md` containing sections for methodology, conventions, and standard types.

#### Scenario: Creating rules.md
- **WHEN** the `init` command is run
- **THEN** the system creates `.modmod/rules.md` with structured Markdown headers for Strategy, Conventions, and Standard Types

### Requirement: Methodology Customization
The rules template SHALL include placeholder sections for project-specific modeling methodologies (e.g., Data Vault, Star Schema).

#### Scenario: User reviews strategy section
- **WHEN** the user opens the scaffolded `rules.md`
- **THEN** they find a section titled "1. モデリング手法 (Strategy)" with instructions to define their approach
