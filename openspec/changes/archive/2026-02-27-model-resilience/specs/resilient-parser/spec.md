## ADDED Requirements

### Requirement: Loose Schema Normalization
The system SHALL normalize YAML data by providing default empty structures for missing optional sections (`columns`, `relationships`, `conceptual`).

#### Scenario: Table with only ID and Name
- **WHEN** the YAML contains a table with only `id` and `name`
- **THEN** the parser generates a table object where `columns` is an empty array and `conceptual` is an empty object

### Requirement: Missing Metadata Recovery
The system SHALL treat missing logical types as "Unknown" during the parsing/normalization phase.

#### Scenario: Column with no type
- **WHEN** a column is defined without a `logical.type`
- **THEN** the system defaults the type to "Unknown"
