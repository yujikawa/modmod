## ADDED Requirements

### Requirement: Data Refresh
The system SHALL provide a way to re-fetch the model data from the API without reloading the page.

#### Scenario: Refresh current model
- **WHEN** user clicks the "Refresh" button in the Sidebar
- **THEN** the system SHALL fetch the latest model content from the server
- **AND** update the canvas and editor with the new data
