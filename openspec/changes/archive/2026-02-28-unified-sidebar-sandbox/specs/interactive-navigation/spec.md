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
