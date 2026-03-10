## MODIFIED Requirements

### Requirement: Layout preservation
The system SHALL persist the positions and dimensions of nodes in the `layout` section of the YAML model.

#### Scenario: Stable domain movement
- **WHEN** multiple nodes are inside a domain
- **AND** some nodes do NOT have explicit layout entries (using auto-layout)
- **AND** the user moves ONE node
- **THEN** only the moved node's coordinates SHALL change in the YAML
- **AND** other nodes SHALL maintain their relative positions without jumping
