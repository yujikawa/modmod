## ADDED Requirements

### Requirement: Path-based CI Execution
The system SHALL detect whether the PR contains changes in specific directories and execute only relevant jobs.

#### Scenario: UI-only change
- **WHEN** the PR contains changes only in `visualizer/`
- **THEN** the system executes UI build and E2E tests.

#### Scenario: CLI-only change
- **WHEN** the PR contains changes only in `src/`
- **THEN** the system skips UI build and E2E tests, but executes CLI-related validation.

### Requirement: Immediate Success for Non-Code Changes
The system SHALL ensure that PRs containing only non-code changes (e.g., `README.md`, `docs/`, `.gitignore`) report a "Success" status to GitHub Actions almost immediately without running heavy builds.

#### Scenario: README-only change
- **WHEN** the user modifies only `README.md`
- **THEN** the "PR Build Check" workflow starts, detects no relevant code changes, and finishes successfully within seconds.

### Requirement: Mandatory Check Reliability
The workflow SHALL always report a status named "PR Build Check" (or the required check name) to GitHub, ensuring that branch protection rules are satisfied regardless of which files were changed.
