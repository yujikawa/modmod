## MODIFIED Requirements

### Requirement: Tabbed Detail Panel
The system SHALL display a panel containing tabs for metadata relevant to the currently selected item (table or relationship).

#### Scenario: Opening the panel
- **WHEN** a table or a relationship is selected in the diagram
- **THEN** the panel is rendered at the bottom of the right section, below the diagram, with its content populated from the selected item's properties

#### Scenario: Relationship Selection
- **WHEN** a relationship edge is selected
- **THEN** the panel displays relationship-specific configuration (type, cardinality) and allows direct modification
