## ADDED Requirements

### Requirement: YAML Parsing
The system SHALL parse a YAML definition to extract table metadata and relationships.

#### Scenario: Successful Parsing
- **WHEN** a valid YAML file with tables and relations is provided
- **THEN** the system generates a internal representation of the data model

### Requirement: Diagram Rendering
The system SHALL render an interactive ER-style diagram on a canvas showing tables and their relationships.

#### Scenario: Initial Load
- **WHEN** the application starts and a model is loaded
- **THEN** the canvas displays all tables as nodes and relationships as lines

### Requirement: Table Selection
The system SHALL allow users to select a table on the canvas to view its details.

#### Scenario: User clicks a table
- **WHEN** the user clicks on a table node in the diagram
- **THEN** the table is highlighted and the detail panel is opened
