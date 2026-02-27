## ADDED Requirements

### Requirement: Layout Rendering
The system SHALL render table nodes at coordinates specified in the YAML model's `layout` section.

#### Scenario: Rendering with layout
- **WHEN** a YAML model with node coordinates in the `layout` section is loaded
- **THEN** the React Flow nodes are initialized with those coordinates

### Requirement: Data Source Switching
The system SHALL allow the visualizer to load its data from an internal constant or an external JSON file in a CLI environment.

#### Scenario: Running in CLI dev mode
- **WHEN** the visualizer is launched by `modmod dev`
- **THEN** it fetches the initial YAML model from a local API endpoint instead of the manual input
