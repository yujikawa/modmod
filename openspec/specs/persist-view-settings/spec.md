### Requirement: View settings are persisted to localStorage
The visualizer SHALL persist the following view settings to `localStorage` under the key `modscape-ui-settings`, so they are restored on the next page load or `modscape dev` restart:
- `theme` (`'dark'` | `'light'`)
- `showER` (boolean)
- `showLineage` (boolean)
- `showAnnotations` (boolean)
- `isCompactMode` (boolean)

#### Scenario: Settings restored after server restart
- **WHEN** the user sets theme to light and restarts `modscape dev`
- **THEN** the visualizer SHALL load with the light theme (not the dark default)

#### Scenario: Settings restored after page reload
- **WHEN** the user toggles showER to false and reloads the page
- **THEN** ER edges SHALL remain hidden after reload

#### Scenario: Default used when no stored value exists
- **WHEN** localStorage contains no `modscape-ui-settings` entry (first launch or cleared storage)
- **THEN** the visualizer SHALL initialize with the hardcoded defaults (`theme: dark`, all show flags `true`, `isCompactMode: false`)

#### Scenario: localStorage unavailable
- **WHEN** localStorage is unavailable (e.g., private browsing with storage blocked)
- **THEN** the visualizer SHALL still function normally using in-memory defaults, with no error shown to the user

### Requirement: Only view preferences are persisted
The store SHALL NOT persist session or model state to localStorage. Specifically, the following SHALL remain ephemeral:
- `selectedTableId`, `selectedEdgeId`, `selectedAnnotationId`
- `isPresentationMode`, `isCommandPaletteOpen`
- `schema`, `yamlInput`, `error`
- `pathFinderResult`, `focusNodeId`

#### Scenario: Schema not stored in localStorage
- **WHEN** the user edits a model and reloads the page
- **THEN** the schema SHALL be re-fetched from the YAML file, not from localStorage
