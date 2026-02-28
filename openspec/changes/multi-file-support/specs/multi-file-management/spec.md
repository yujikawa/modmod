## ADDED Requirements

### Requirement: YAML File Scanning
The system SHALL scan the specified directory for all files with `.yaml` or `.yml` extensions.

#### Scenario: Scanning a directory with multiple models
- **WHEN** the user starts the dev server with `modmod dev ./models`
- **THEN** the server identifies all YAML files in that directory

### Requirement: Secure Model Mapping
The system SHALL generate a unique, URL-safe slug (safe name) for each identified YAML file to prevent path traversal.

#### Scenario: Generating slugs for models
- **WHEN** the server finds `user_data.yaml` and `billing-info.yml`
- **THEN** it maps them to `user_data` and `billing-info` respectively

### Requirement: List Available Models API
The system SHALL provide a GET endpoint at `/api/files` that returns a list of all identified models and their safe names.

#### Scenario: Requesting the file list
- **WHEN** the visualizer requests `GET /api/files`
- **THEN** it receives a JSON array of model metadata (id, name, path)
