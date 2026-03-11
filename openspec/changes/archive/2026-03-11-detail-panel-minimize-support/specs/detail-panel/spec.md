## MODIFIED Requirements

### Requirement: Tabbed Detail Panel
The system SHALL display a panel containing tabs for metadata relevant to the currently selected item (table, domain, or relationship).

#### Scenario: Opening the panel
- **WHEN** a table, domain, or a relationship is selected in the diagram
- **AND** the detail panel is NOT minimized
- **THEN** the panel SHALL be rendered at the bottom of the right section with its full content populated

#### Scenario: Selection while minimized
- **WHEN** the detail panel is minimized (collapsed to a bar)
- **AND** the user selects a DIFFERENT item in the diagram
- **THEN** the panel SHALL remain minimized
- **AND** the label on the minimized bar SHALL update to the new item's name

## ADDED Requirements

### Requirement: Detail Panel Minimization
The system SHALL allow users to minimize the detail panel to a narrow bar at the bottom of the screen to maximize canvas space.

#### Scenario: Minimize the panel
- **WHEN** the user clicks the "Minimize" button on the detail panel header
- **THEN** the panel height SHALL shrink to a fixed small value (e.g., 40px)
- **AND** the main content of the panel SHALL be hidden

#### Scenario: Restore from minimized bar
- **WHEN** the user clicks anywhere on the minimized bar
- **THEN** the panel SHALL restore to its previous or default expanded height

#### Scenario: Force expand on double-click
- **WHEN** the user double-clicks an entity node or relationship edge in the canvas
- **THEN** the system SHALL select the item AND ensure the detail panel is expanded (even if it was previously minimized)
