## ADDED Requirements

### Requirement: Canvas-level Toolbar
The system SHALL provide a toolbar on the canvas for adding new elements.

#### Scenario: Toolbar Display
- **WHEN** the visualizer is launched
- **THEN** a floating toolbar with "Add Domain" and "Add Table" buttons is visible on the canvas.

### Requirement: Adding New Domain Elements
The system SHALL allow users to add new Domain elements to the canvas via the toolbar.

#### Scenario: Add New Domain
- **WHEN** the user clicks "Add Domain" on the toolbar
- **THEN** a new Domain node with a default name and size is added to the canvas and its YAML definition is added to the Sidebar Editor.

### Requirement: Adding New Table Elements
The system SHALL allow users to add new Table elements to the canvas via the toolbar.

#### Scenario: Add New Table
- **WHEN** the user clicks "Add Table" on the toolbar
- **THEN** a new Table node with a default name and basic schema is added to the canvas and its YAML definition is added to the Sidebar Editor.

### Requirement: Toggle Node Selection
The system SHALL toggle the selection state of a table or domain node when clicked.

#### Scenario: Toggling node off
- **WHEN** the user clicks a node that is already selected
- **THEN** the node is deselected and the detail panel is closed

#### Scenario: Toggling node on
- **WHEN** the user clicks a node that is not selected
- **THEN** the node is selected and the detail panel opens

### Requirement: Toggle Edge Selection
The system SHALL toggle the selection state of a relationship (edge) when clicked.

#### Scenario: Toggling edge off
- **WHEN** the user clicks an edge that is already selected
- **THEN** the edge is deselected

#### Scenario: Toggling edge on
- **WHEN** the user clicks an edge that is not selected
- **THEN** the edge is selected
