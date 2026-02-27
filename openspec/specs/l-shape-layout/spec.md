## ADDED Requirements

### Requirement: Vertical Split Layout
The system SHALL partition the area to the right of the sidebar into a vertical stack containing the diagram and the detail panel.

#### Scenario: Visualizing Selection
- **WHEN** a table node is selected
- **THEN** the right section displays the diagram in the upper part and the detail panel in the lower part without overlap

### Requirement: Fixed Height Detail Region
The detail panel region SHALL have a fixed height or a maximum height limit to ensure the diagram remains the primary focus.

#### Scenario: Displaying large sample data
- **WHEN** the detail panel contains more data than the allocated height
- **THEN** the panel provides internal scrolling for its content
