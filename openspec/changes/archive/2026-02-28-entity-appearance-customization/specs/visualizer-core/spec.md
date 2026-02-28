## MODIFIED Requirements

### Requirement: Diagram Rendering
The system SHALL render an interactive ER-style diagram on a canvas showing tables, their relationships, and optional domain containers, with visual cues for entity types.

#### Scenario: Initial Load
- **WHEN** the application starts and a model is loaded
- **THEN** the canvas displays all tables as nodes with type-specific icons and colors, relationships as lines, and domains as enclosing containers where defined
