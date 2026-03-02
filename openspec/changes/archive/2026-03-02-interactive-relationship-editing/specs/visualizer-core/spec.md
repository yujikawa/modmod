## MODIFIED Requirements

### Requirement: Diagram Rendering
The system SHALL render an interactive ER-style diagram on a canvas showing tables, their relationships, and optional domain containers, with visual cues for entity types and interactive edge controls, and handles for relationship creation.

#### Scenario: Visualizing Selection
- **WHEN** a user selects a table node
- **THEN** the diagram updates the visual style of connected edges to reflect the current focus

#### Scenario: Edge Interaction
- **WHEN** an edge is rendered
- **THEN** it utilizes a custom edge component that includes an interactive delete button

#### Scenario: Handle Rendering
- **WHEN** a table column is rendered in a node
- **THEN** it includes an invisible handle that becomes visible on hover to initiate a connection
