## ADDED Requirements

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
