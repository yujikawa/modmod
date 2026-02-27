## MODIFIED Requirements

### Requirement: Layer Specific Views
The system SHALL show the appropriate metadata for the selected tab.

#### Scenario: Switching to Logical tab with no data
- **WHEN** the user clicks the "Logical" tab for a table with no columns
- **THEN** the panel displays a message like "No logical columns defined yet" instead of a blank or crashed view

### Requirement: Conceptual Metadata
The system SHALL display business definitions and tags in the Conceptual tab.

#### Scenario: Viewing Conceptual tab with no description
- **WHEN** the "Conceptual" tab is active and the table has no description or tags
- **THEN** it displays "No description provided." and hides the tags section
    
### Requirement: Resilient Sample Tab
The system SHALL handle missing sample data gracefully within the detail panel.

#### Scenario: Viewing Sample Data tab with no data
- **WHEN** the "Sample Data" tab is active but no data is in the YAML
- **THEN** it displays "No sample data available for this table."
