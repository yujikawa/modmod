## ADDED Requirements

### Requirement: Node Creation Availability
The system SHALL allow adding new tables and domains regardless of which view modes (ER, Lineage, Annotations) are active.

#### Scenario: Add Table while Connections are Locked
- **WHEN** both ER and Lineage view modes are active
- **AND** the user clicks "Add Table" in the Activity Bar
- **THEN** a new table node SHALL be added to the canvas at the center of the viewport

#### Scenario: Add Domain while Connections are Locked
- **WHEN** both ER and Lineage view modes are active
- **AND** the user clicks "Add Domain" in the Activity Bar
- **THEN** a new domain node SHALL be added to the canvas at the center of the viewport

#### Scenario: Visual Indication of Lock
- **WHEN** both ER and Lineage view modes are active
- **THEN** the system SHALL provide a clear visual indication that "Connections" (edges) are locked, but Node creation SHALL not be visually restricted by lock icons.
