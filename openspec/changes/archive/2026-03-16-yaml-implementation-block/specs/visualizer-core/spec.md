## MODIFIED Requirements

### Requirement: YAML Parsing
The system SHALL parse a YAML definition to extract table metadata and relationships. The parser SHALL passthrough any unrecognized fields within a table (including `implementation`) without error.

#### Scenario: Successful Parsing
- **WHEN** a valid YAML file with tables and relations is provided
- **THEN** the system generates an internal representation of the data model

#### Scenario: Parsing table with implementation block
- **WHEN** a YAML file contains a table with an `implementation` block
- **THEN** the parser SHALL preserve the `implementation` object on the resulting `Table` object without validation or transformation
