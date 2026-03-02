## ADDED Requirements

### Requirement: Canvas to Sidebar Sync
The system SHALL automatically synchronize all visual canvas changes (moving, resizing, adding) with the YAML Sidebar Editor.

#### Scenario: Visual Drag Updates YAML Text
- **WHEN** the user drags a Table node to a new position
- **THEN** the coordinates in the Sidebar Editor's YAML text are updated in real-time.

### Requirement: Staging Area Pattern
The system SHALL use the Sidebar Editor as a "staging area" where changes are visible as YAML text but not yet persisted to the local file.

#### Scenario: Temporary Changes Before Save
- **WHEN** the user resizes a Domain node
- **THEN** the YAML text in the Sidebar updates, but the local YAML file remains unchanged until the user clicks "Save & Update".

### Requirement: Multi-Model Sync Support
The system SHALL ensure that canvas changes are correctly mapped to the active model when multiple YAML files are being managed.

#### Scenario: Syncing Changes in Multi-file Mode
- **WHEN** the user is viewing a specific model in multi-file mode and makes a visual change
- **THEN** only the YAML text for that active model is updated in the Sidebar Editor.
