## Why

Currently, users have to manually create YAML files and remember the schema to start a new model. A dedicated `modscape new` command lowers the barrier to entry by providing a professional boilerplate. Furthermore, supporting recursive directory creation allows users to organize their models into folders seamlessly from the CLI.

## What Changes

- **New CLI Command**:
  - Implement `modscape new <filename>`.
  - Automatically add `.yaml` extension if missing.
  - Automatically create parent directories if they don't exist (recursive).
  - Use `src/templates/default-model.yaml` as the starter content.
- **Boilerplate Template**:
  - Create a high-quality `default-model.yaml` showcasing domains, tri-layer naming, and sample data.
- **Version Bump**:
  - Update all package files and UI footers to `1.0.7`.

## Capabilities

### Modified Capabilities
- `init-command`: Add new model creation functionality.
- `visualizer-core`: Update version metadata.

## Impact

- `src/index.js`: Register the `new` command.
- `src/create.js`: New file for the model creation logic.
- `src/templates/default-model.yaml`: New starter template.
- `package.json` & `visualizer/package.json`: Version bump.
