## ADDED Requirements

### Requirement: Entity search
The entity list SHALL include a search bar to filter tables and domains by name.

#### Scenario: Filter entity list
- **WHEN** user types "User" in the search bar
- **THEN** only entities containing "User" in their name or ID are shown

### Requirement: Click-to-focus navigation
Clicking an entity in the sidebar SHALL automatically center and zoom the diagram onto the corresponding node.

#### Scenario: Focus on table node
- **WHEN** user clicks a table name in the entity list
- **THEN** diagram smoothly pans and zooms to the selected table node

#### Scenario: Focus on domain node
- **WHEN** user clicks a domain name in the entity list
- **THEN** diagram smoothly pans and zooms to the selected domain node

### Requirement: Distinct Relationship Path Visualization
The Path Finder results SHALL visualize relationship steps using type-aware styling to distinguish between ER and Lineage relationships.

#### Scenario: Visual Distinction of ER Relationship
- **WHEN** a path result includes an ER relationship step in light mode
- **THEN** the relationship badge SHALL display with an emerald-themed color scheme (bg-emerald-50, text-emerald-700) and a subtle border.

#### Scenario: Visual Distinction of Lineage Relationship
- **WHEN** a path result includes a Lineage relationship step in light mode
- **THEN** the relationship badge SHALL display with a blue-themed color scheme (bg-blue-50, text-blue-700) and a subtle border.

#### Scenario: High Contrast in Light Mode
- **WHEN** the application is in light mode
- **THEN** relationship badges in the Path Finder results MUST have high contrast against the white panel background, using borders to define their boundaries.

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
