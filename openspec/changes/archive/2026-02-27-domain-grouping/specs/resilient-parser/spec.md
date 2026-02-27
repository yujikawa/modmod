## ADDED Requirements

### Requirement: Domain Parsing
The system SHALL parse an optional `domains` section from the YAML to establish entity grouping metadata.

#### Scenario: YAML with domains
- **WHEN** a YAML file includes a `domains` array
- **THEN** the system extracts the domain IDs, names, and their associated table lists for rendering
