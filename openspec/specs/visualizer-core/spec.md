## ADDED Requirements

### Requirement: YAML Parsing
The system SHALL parse a YAML definition to extract table metadata and relationships.

#### Scenario: Successful Parsing
- **WHEN** a valid YAML file with tables and relations is provided
- **THEN** the system generates a internal representation of the data model

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

#### Scenario: User clicks a table
- **WHEN** the user clicks on a table node without moving it
- **THEN** the table is highlighted and the detail panel is opened

#### Scenario: Selection for Contextual Actions
- **WHEN** a node or edge is selected
- **THEN** the system SHALL display its identity and available actions (like delete) in a centralized contextual toolbar.

#### Scenario: User clicks the background
- **WHEN** the user clicks on an empty area of the canvas
- **THEN** all selections are cleared and the detail panel is closed

#### Scenario: User stops dragging a node
- **WHEN** the user releases a node after dragging it
- **THEN** the node selection is cleared to keep the canvas focused on layout

### Requirement: Layout Rendering
The system SHALL render table nodes at coordinates specified in the YAML model's `layout` section.

#### Scenario: Rendering with layout
- **WHEN** a YAML model with node coordinates in the `layout` section is loaded
- **THEN** the React Flow nodes are initialized with those coordinates

### Requirement: Data Source Switching
The system SHALL allow the visualizer to load its data from an internal constant or an external JSON file in a CLI environment.

#### Scenario: Running in CLI dev mode
- **WHEN** the visualizer is launched by `modscape dev`
- **THEN** it fetches the initial YAML model from a local API endpoint instead of the manual input

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

### Requirement: Advanced Table Metadata Rendering
The system SHALL display both the table's nature (sub_type) and its history tracking method (scd) in the table header if defined.

#### Scenario: Fact table with both sub_type and scd
- **WHEN** a table has `type: fact`, `sub_type: transaction`, and `scd: type2`
- **THEN** the visualizer shows a badge or label indicating both (e.g., "FACT (Trans.) / SCD T2")

#### Scenario: Fact table without grain
- **WHEN** a table has `appearance.type: fact` and `appearance.sub_type` is undefined
- **THEN** the visualizer shows a badge labeled "FACT"

#### Scenario: Dimension table with scd only
- **WHEN** a table has `type: dimension` and `scd: type2` (with no sub_type)
- **THEN** the visualizer shows "DIM (SCD T2)"

#### Scenario: Dimension table without SCD type
- **WHEN** a table has `appearance.type: dimension` and `appearance.sub_type` is undefined
- **THEN** the visualizer shows a badge labeled "DIM"

### Requirement: Cross-Table SCD Assignment
The system SHALL allow users to assign an SCD Type to ANY table type (Fact, Dimension, Hub, Link, Satellite).

#### Scenario: Assigning SCD to a Fact table
- **WHEN** the user selects "SCD Type 2" for a Fact table in the Detail Panel
- **THEN** the `scd` property is set to `type2` while preserving the existing `sub_type` (e.g., `transaction`)

### Requirement: Optional Metadata Selection
The system SHALL allow users to explicitly deselect or leave analytics metadata (sub_type, additivity) as undefined via the UI.

#### Scenario: Deselecting Table Type
- **WHEN** the user selects the "-" option in the Table Type dropdown
- **THEN** the `sub_type` property is removed or set to undefined in the model

### Requirement: Column Additivity Indicators
The system SHALL display visual indicators for column additivity rules.

#### Scenario: Fully additive column
- **WHEN** a column has `logical.additivity: fully`
- **THEN** the visualizer displays the `Σ` (Sum) icon next to the column name

#### Scenario: Non-additive column
- **WHEN** a column has `logical.additivity: non`
- **THEN** the visualizer displays the `⊘` (Prohibited) icon next to the column name

### Requirement: Metadata Column Indicators
The system SHALL display a visual indicator for technical/audit metadata columns.

#### Scenario: Metadata column
- **WHEN** a column has `logical.isMetadata: true`
- **THEN** the visualizer displays a `🕒` (Clock) icon next to the column name

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
The system SHALL render an interactive ER-style diagram on a canvas showing tables, their relationships, and optional domain containers, with visual cues for entity types.

#### Scenario: Initial Load
- **WHEN** the application starts and a model is loaded
- **THEN** the canvas displays all tables as nodes with type-specific icons and colors, relationships as lines, and domains as enclosing containers where defined

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

## MODIFIED Requirements

### Requirement: Diagram Container Structure
The system SHALL wrap the diagram canvas in a container that allows for sibling elements in a vertical flow.

#### Scenario: Selection Cleared
- **WHEN** no node is selected
- **THEN** the diagram container expands to occupy the full available height of the right section
