## ADDED Requirements

### Requirement: Scoped store subscription
Each component SHALL subscribe only to the specific state slices it needs, using Zustand selector functions with shallow comparison. Components MUST NOT subscribe to the entire store object.

#### Scenario: Selecting a table does not re-render unrelated components
- **WHEN** the user selects a table on the canvas
- **THEN** only components that subscribe to `selectedTableId` SHALL re-render; TableNode components for non-selected tables SHALL NOT re-render

#### Scenario: Editing a column name does not trigger canvas-wide re-render
- **WHEN** the user edits a column name in DetailPanel
- **THEN** only the affected TableNode and DetailPanel SHALL re-render; other TableNodes and sidebar components SHALL NOT re-render

### Requirement: Stable node and edge references
The node and edge arrays passed to React Flow SHALL be memoized using `useMemo`. Re-generation MUST only occur when the specific schema data for those nodes/edges changes.

#### Scenario: Path highlight change does not rebuild all nodes
- **WHEN** the path finder result changes (a path is highlighted)
- **THEN** node position and structure data SHALL remain stable; only edge style data SHALL update

#### Scenario: Single table update does not rebuild all nodes
- **WHEN** one table's name or column is updated
- **THEN** the nodes array reference SHALL remain stable for all other tables

### Requirement: Memoized components
`DetailPanel`, `CommandPalette`, `Sidebar`, `RightPanel`, and their direct child tab components SHALL be wrapped with `React.memo`. Event handlers inside these components MUST use `useCallback` to maintain stable references.

#### Scenario: Theme change does not re-render DetailPanel content
- **WHEN** the user toggles the theme
- **THEN** DetailPanel SHALL NOT re-render if `selectedTableId` and the selected table's data are unchanged

#### Scenario: Schema change does not re-render CommandPalette when closed
- **WHEN** a schema update occurs while CommandPalette is not open
- **THEN** CommandPalette SHALL NOT perform a full re-render

### Requirement: O(1) path highlight lookup
The system SHALL use a `Set<string>` for path edge ID lookups instead of an array. Edge style computation MUST use `Set.has()` rather than `Array.includes()`.

#### Scenario: Path highlighting remains responsive in large schemas
- **WHEN** a path is found between two tables in a 200-table schema
- **THEN** edge style computation SHALL complete without perceptible delay

### Requirement: O(1) node position lookup in sync
The node sync loop in App.tsx SHALL build a `Map<id, node>` once before iterating, and use map lookups instead of repeated `.find()` calls.

#### Scenario: Node sync completes in linear time
- **WHEN** the schema contains 200 tables and domains
- **THEN** node sync SHALL iterate each node at most once (O(n) total, not O(n²))
