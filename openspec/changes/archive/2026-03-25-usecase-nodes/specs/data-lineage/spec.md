## MODIFIED Requirements

### Requirement: Lineage Definition
The system SHALL support defining upstream dependencies in the YAML model using the top-level `lineage` section, where both `from` and `to` values may reference either a table ID or a usecase ID.

#### Scenario: Defining upstream tables
- **WHEN** a `lineage` entry references table IDs in both `from` and `to`
- **THEN** the system recognizes these as data flow dependencies between tables

#### Scenario: Lineage to a usecase node
- **WHEN** a `lineage` entry has a `to` value that matches a usecase ID (and not a table ID)
- **THEN** the system resolves the target as a usecase node and renders a lineage arrow to it
