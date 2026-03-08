## ADDED Requirements

### Requirement: Annotation Node Rendering
The system SHALL render visual annotations (sticky notes and callouts) as a distinct layer of custom nodes on the React Flow canvas.

#### Scenario: Rendering a sticky note
- **WHEN** the schema contains an annotation of type `sticky`
- **THEN** the visualizer SHALL render a React Flow node using the `AnnotationNode` component at the calculated position

### Requirement: Annotation Connector Rendering
The system SHALL render a visual connector (edge) between an annotation and its target object if a `targetId` is defined.

#### Scenario: Rendering a callout connector
- **WHEN** an annotation has a `targetId` and `style.arrow: true`
- **THEN** the visualizer SHALL render a specialized React Flow edge connecting the annotation node to the target node
