## MODIFIED Requirements

### Requirement: Advanced Modeling Guidelines
The generated `rules.md` SHALL include comprehensive guidelines for Kimball-style dimensional modeling, Data Vault 2.0, and strict YAML schema compliance.

#### Scenario: Schema Enforcement Guidelines
- **WHEN** `modscape init` is executed
- **THEN** the created `.modscape/rules.md` SHALL contain a section explicitly defining the root-level `layout` key
- **AND** SHALL explicitly prohibit placing coordinates (`x`, `y`) within `tables` or `domains` objects

#### Scenario: AI-Optimized Layout Rules
- **WHEN** the user reviews the generated rules
- **THEN** they SHALL find a "Beautiful Layout" section with numeric heuristics (e.g., 40px grid, standard 320px width)
- **AND** directional flow definitions (Lineage: L->R, ER: Top->Bottom)
