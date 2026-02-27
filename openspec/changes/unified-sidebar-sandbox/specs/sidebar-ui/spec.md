## ADDED Requirements

### Requirement: Unified sidebar UI
The visualizer SHALL provide a unified sidebar component that is used in both CLI (dev) and static (build) modes.

#### Scenario: Sidebar presence in CLI mode
- **WHEN** visualizer is running in CLI mode
- **THEN** sidebar with "Editor" and "Entities" tabs is visible

#### Scenario: Sidebar presence in Static mode
- **WHEN** visualizer is running in static mode (build)
- **THEN** sidebar with "Editor" and "Entities" tabs is visible (Editor is in sandbox mode)

### Requirement: Tabbed navigation
The sidebar SHALL support switching between an "Editor" view for YAML and an "Entities" view for model navigation.

#### Scenario: Switch to Entities tab
- **WHEN** user clicks on the "Entities" tab
- **THEN** entity list is displayed and Editor is hidden

#### Scenario: Switch to Editor tab
- **WHEN** user clicks on the "Editor" tab
- **THEN** YAML editor is displayed and entity list is hidden

### Requirement: Collapsible sidebar
The sidebar SHALL provide a toggle to collapse and expand itself to maximize the diagram area.

#### Scenario: Collapse sidebar
- **WHEN** user clicks the collapse button
- **THEN** sidebar shrinks to a minimal width (e.g., 40px) showing only tab icons
- **THEN** ReactFlow diagram expands to fill the remaining width

#### Scenario: Expand sidebar
- **WHEN** user clicks the expand button while collapsed
- **THEN** sidebar restores to its original width
