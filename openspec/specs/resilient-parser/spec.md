## Purpose
The system SHALL parse and normalize YAML input to ensure a consistent internal schema representation, even with partial or missing data.
## Requirements
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

### Requirement: Domain Parsing
The system SHALL parse an optional `domains` section from the YAML to establish entity grouping metadata.

#### Scenario: YAML with domains
- **WHEN** a YAML file includes a `domains` array
- **THEN** the system extracts the domain IDs, names, and their associated table lists for rendering

### Requirement: Annotation Parsing
The system SHALL parse an optional `annotations` section from the YAML to establish visual notes metadata.

#### Scenario: YAML with annotations
- **WHEN** a YAML file includes an `annotations` array
- **THEN** the system extracts annotation IDs, target references, text, and positioning metadata

### Requirement: Annotation Schema Normalization
The system SHALL normalize `annotations` data by providing default empty structures if missing from the source YAML.

#### Scenario: Missing annotations
- **WHEN** a YAML file has no `annotations` section
- **THEN** the parser SHALL return a schema object with an empty `annotations` array

