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
