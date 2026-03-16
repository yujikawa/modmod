## ADDED Requirements

### Requirement: Centralized Rules Template
The system SHALL create a template file at `.modscape/rules.md` containing sections for methodology, conventions, and standard types.

#### Scenario: Creating rules.md
- **WHEN** the `init` command is run
- **THEN** the system creates `.modscape/rules.md` with structured Markdown headers for Strategy, Conventions, and Standard Types

### Requirement: Methodology Customization
The rules template SHALL include placeholder sections for project-specific modeling methodologies (e.g., Data Vault, Star Schema).

#### Scenario: User reviews strategy section
- **WHEN** the user opens the scaffolded `rules.md`
- **THEN** they find a section titled "1. モデリング手法 (Strategy)" with instructions to define their approach

### Requirement: Advanced Modeling Guidelines
The generated `rules.md` SHALL include comprehensive guidelines for Kimball-style dimensional modeling and Data Vault 2.0.

#### Scenario: Rule generation
- **WHEN** `modscape init` is executed
- **THEN** the created `.modscape/rules.md` contains sections explaining `strategy`, `scd`, and `additivity` attributes
## MODIFIED Requirements

### Requirement: Advanced Modeling Guidelines
The generated `rules.md` SHALL include comprehensive guidelines for Kimball-style dimensional modeling, Data Vault 2.0, strict YAML schema compliance, and the `implementation` block for AI code generation.

#### Scenario: Schema Enforcement Guidelines
- **WHEN** `modscape init` is executed
- **THEN** the created `.modscape/rules.md` SHALL contain a section explicitly defining the root-level `layout` key
- **AND** SHALL explicitly prohibit placing coordinates (`x`, `y`) within `tables` or `domains` objects

#### Scenario: AI-Optimized Layout Rules
- **WHEN** the user reviews the generated rules
- **THEN** they SHALL find a "Beautiful Layout" section with numeric heuristics (e.g., 40px grid, standard 320px width)
- **AND** directional flow definitions (Lineage: L->R, ER: Top->Bottom)

#### Scenario: Implementation block documentation
- **WHEN** the user reviews the generated rules
- **THEN** they SHALL find an `implementation` block section documenting all fields (`materialization`, `incremental_strategy`, `unique_key`, `partition_by`, `grain`, `measures`)
- **AND** a table showing AI inference defaults when `implementation` is absent
