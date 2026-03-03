## MODIFIED Requirements

### Requirement: Diagram Rendering
The system SHALL render an interactive ER-style diagram on a canvas showing tables, their relationships, and optional domain containers, with visual cues for entity types and handles for relationship creation. Direct on-canvas delete buttons SHALL NOT be displayed on nodes or edges to maintain visual clarity.

#### Scenario: Visualizing Selection
- **WHEN** a user selects a table node
- **THEN** the diagram updates the visual style of connected edges to reflect the current focus, and no delete button is shown on the node.

#### Scenario: Edge Interaction
- **WHEN** an edge is rendered
- **THEN** it utilizes a custom edge component that focuses on relationship representation without on-canvas interactive buttons.

### Requirement: Table Selection
The system SHALL allow users to select a table on the canvas to view its details and perform contextual actions. Selection SHALL only be triggered by an explicit click event, not during or after a drag operation. Selection SHALL be cleared when the user clicks on the canvas background or finishes dragging a node.

#### Scenario: Selection for Contextual Actions
- **WHEN** a node or edge is selected
- **THEN** the system SHALL display its identity and available actions (like delete) in a centralized contextual toolbar.

## ADDED Requirements

### Requirement: Keyboard-Based Deletion
The system SHALL support deleting selected elements (nodes or edges) using standard keyboard keys.

#### Scenario: Deleting with Delete/Backspace
- **WHEN** one or more elements are selected on the canvas and the user presses the `Delete` or `Backspace` key
- **THEN** the selected elements are removed from the model.

### Requirement: Contextual Toolbar Actions
The system SHALL provide a centralized toolbar that displays information and actions for the currently selected element.

#### Scenario: Toolbar Visibility
- **WHEN** an element is selected
- **THEN** the toolbar displays the element's name/type and a "Delete" action button.
