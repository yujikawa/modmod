## ADDED Requirements

### Requirement: Sample Data Grid
The system SHALL display a grid view for sample data "stories" within the detail panel's Sample Data tab.

#### Scenario: Viewing Sample Data
- **WHEN** the "Sample Data" tab is active in the detail panel
- **THEN** the panel renders a grid with columns and rows defined in the YAML file

### Requirement: Sample to Model Highlighting
The system SHALL highlight the corresponding model attribute when a sample data column header is hovered.

#### Scenario: Hovering a column header
- **WHEN** the user hovers over a column header in the sample data grid
- **THEN** the corresponding column in the main diagram node is highlighted
