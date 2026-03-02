## ADDED Requirements

### Requirement: Interactive Resizing of Domain Nodes
The system SHALL allow users to visually resize Domain nodes on the canvas using resize handles.

#### Scenario: Resize Domain Node
- **WHEN** the user selects a Domain node and drags a resize handle
- **THEN** the Domain node size updates visually and the new width and height are updated in the Sidebar Editor.

### Requirement: Interactive Resizing of Table Nodes
The system SHALL allow users to visually resize Table nodes on the canvas.

#### Scenario: Resize Table Node
- **WHEN** the user selects a Table node and drags a resize handle
- **THEN** the Table node size updates visually, overriding the default automatic size, and the new width and height are updated in the Sidebar Editor.

### Requirement: Layout Metadata Persistence
The system SHALL persist `width` and `height` properties in the `layout` section of the YAML for both Table and Domain nodes.

#### Scenario: Save Resized Layout
- **WHEN** the user clicks "Save & Update" after resizing a node
- **THEN** the generated YAML file includes the `width` and `height` properties in the `layout` section.
