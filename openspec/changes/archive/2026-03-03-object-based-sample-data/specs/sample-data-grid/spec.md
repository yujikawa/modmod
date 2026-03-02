## MODIFIED Requirements

### Requirement: Sample Data Grid
The system SHALL display a grid view for sample data "stories" within the detail panel's Sample Data tab. The grid SHALL be automatically driven by the table's logical columns by index.

#### Scenario: Viewing Sample Data
- **WHEN** the "Sample Data" tab is active in the detail panel
- **THEN** the panel renders a grid where headers correspond to all logical columns of the table and rows are taken from the `sampleData` 2D array.

### Requirement: Sample to Model Highlighting
The system SHALL highlight the corresponding model attribute when a sample data column header is hovered.

#### Scenario: Hovering a column header
- **WHEN** the user hovers over a column header (logical column name) in the sample data grid
- **THEN** the corresponding column in the main diagram node is highlighted by index.
