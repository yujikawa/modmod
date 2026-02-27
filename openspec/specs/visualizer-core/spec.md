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
## ADDED Requirements

### Requirement: Layout Rendering
The system SHALL render table nodes at coordinates specified in the YAML model's `layout` section.

#### Scenario: Rendering with layout
- **WHEN** a YAML model with node coordinates in the `layout` section is loaded
- **THEN** the React Flow nodes are initialized with those coordinates

### Requirement: Data Source Switching
The system SHALL allow the visualizer to load its data from an internal constant or an external JSON file in a CLI environment.

#### Scenario: Running in CLI dev mode
- **WHEN** the visualizer is launched by `modmod dev`
- **THEN** it fetches the initial YAML model from a local API endpoint instead of the manual input
## MODIFIED Requirements

### Requirement: Diagram Rendering
The system SHALL render an interactive ER-style diagram on a canvas showing tables and their relationships.

#### Scenario: Initial Load
- **WHEN** the application starts and a model is loaded
- **THEN** the canvas displays all tables as nodes and relationships as lines, even if tables have no columns or relationships have no column IDs

### Requirement: Table-Level Relationships
The system SHALL support drawing edges between nodes when specific column references are omitted in the relationship definition.

#### Scenario: Relationship without columns
- **WHEN** a relationship is defined only with `from.table` and `to.table`
- **THEN** an edge is rendered between the default Top/Bottom handles of the respective nodes
## MODIFIED Requirements

### Requirement: Diagram Rendering
The system SHALL render an interactive ER-style diagram on a canvas showing tables, their relationships, and optional domain containers.

#### Scenario: Initial Load
- **WHEN** the application starts and a model is loaded
- **THEN** the canvas displays all tables as nodes, relationships as lines, and domains as enclosing containers where defined
