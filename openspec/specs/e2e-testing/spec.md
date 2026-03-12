## ADDED Requirements

### Requirement: E2E Test Suite Setup
The system SHALL have a Playwright-based E2E test suite that can be executed with a single command.

#### Scenario: Running all tests
- **WHEN** the user executes `npm run test:e2e`
- **THEN** Playwright launches, runs all defined scenarios, and reports results

### Requirement: Automated Visualizer Loading
The test suite SHALL verify that the visualizer loads correctly with a provided YAML file.

#### Scenario: Initial Load Verification
- **WHEN** the test starts Modscape with `test-model.yaml`
- **THEN** the browser displays the tables defined in that YAML on the canvas

### Requirement: UI Interaction Verification
The test suite SHALL verify that clicking a node opens the Detail Panel with correct information.

#### Scenario: Node Click Action
- **WHEN** the test clicks on a table node named "USERS"
- **THEN** the Right Panel displays the properties and columns of the "USERS" table

### Requirement: Search Functionality Verification
The test suite SHALL verify that searching for entities highlights the correct nodes.

#### Scenario: Entity Search
- **WHEN** the user types "ORDER" in the sidebar search box
- **THEN** nodes matching "ORDER" are visually distinguished or filtered in the list

### Requirement: Real-time Sync Verification
The test suite SHALL verify that editing the YAML file externally triggers a UI update.

#### Scenario: External File Edit
- **WHEN** the test modifies the underlying `test-model.yaml` file
- **THEN** the browser automatically reflects the changes without a manual reload

### Requirement: Visual Regression Testing
The test suite SHALL support comparing current screenshots against a baseline to detect UI regressions.

#### Scenario: Screenshot Comparison
- **WHEN** visual regression tests are run
- **THEN** Playwright flags any pixel-level differences in the sidebar or menu layout
