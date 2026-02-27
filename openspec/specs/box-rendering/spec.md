## ADDED Requirements

### Requirement: Header-Only Table Cards
The system SHALL render tables as cards containing only the header if no columns are defined.

#### Scenario: Table with zero columns
- **WHEN** a table node is rendered and its `columns` array is empty or undefined
- **THEN** the card displays the logical name and ID header, and hides the column list table

### Requirement: Protective Column Access
The system SHALL display placeholders when column-level properties (`logical.name`, `logical.type`) are missing.

#### Scenario: Column with only ID
- **WHEN** a column entry exists but lacks `logical` details
- **THEN** the card displays the ID as the name and "Unknown" as the type
    
### Requirement: Relationship Handles
Every table card SHALL provide default Top and Bottom handles regardless of column content.

#### Scenario: Connecting table-level links
- **WHEN** a relationship exists between tables
- **THEN** the system can connect edges to the card's Top or Bottom handles even if no column-specific handles exist
