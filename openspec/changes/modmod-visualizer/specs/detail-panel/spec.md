## ADDED Requirements

### Requirement: Tabbed Detail Panel
The system SHALL display a slide-up panel containing tabs for Conceptual, Logical, Physical, and Sample Data.

#### Scenario: Opening the panel
- **WHEN** a table is selected in the main canvas
- **THEN** the detail panel slides up from the bottom of the screen

### Requirement: Layer Specific Views
The system SHALL show the appropriate metadata for the selected tab.

#### Scenario: Switching to Physical tab
- **WHEN** the user clicks the "Physical" tab in the detail panel
- **THEN** the panel displays physical column names, data types, and constraints

### Requirement: Conceptual Metadata
The system SHALL display business definitions and tags in the Conceptual tab.

#### Scenario: Viewing Conceptual tab
- **WHEN** the "Conceptual" tab is active
- **THEN** the business description of the table and BEAM* tags (WHO, WHAT, etc.) are shown
