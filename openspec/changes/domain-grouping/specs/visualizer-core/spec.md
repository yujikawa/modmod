## MODIFIED Requirements

### Requirement: Diagram Rendering
The system SHALL render an interactive ER-style diagram on a canvas showing tables, their relationships, and optional domain containers.

#### Scenario: Initial Load
- **WHEN** the application starts and a model is loaded
- **THEN** the canvas displays all tables as nodes, relationships as lines, and domains as enclosing containers where defined
