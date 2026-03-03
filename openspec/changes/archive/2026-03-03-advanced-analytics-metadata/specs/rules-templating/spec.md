## ADDED Requirements

### Requirement: Advanced Modeling Guidelines
The generated `rules.md` SHALL include comprehensive guidelines for Kimball-style dimensional modeling and Data Vault 2.0.

#### Scenario: Rule generation
- **WHEN** `modscape init` is executed
- **THEN** the created `.modscape/rules.md` contains sections explaining `strategy`, `scd`, and `additivity` attributes
