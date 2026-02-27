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
