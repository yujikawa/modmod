## Why

With the introduction of multi-file support, it's beneficial to have a dedicated directory for sample data models. This allows users to easily explore different use cases and serves as a better starting point for new projects. Additionally, `DEVELOPMENT.md` needs to be updated to reflect these changes.

## What Changes

- **Project Structure**: Create a `samples/` directory at the project root.
- **Models**: Move `visualizer/sample-model.yaml` to `samples/ecommerce.yaml` and add new samples:
  - `samples/blog-model.yaml` (Simple relational structure)
  - `samples/analytics-vault.yaml` (Advanced Data Vault/Star Schema example)
- **Documentation**: Update `DEVELOPMENT.md` with instructions on how to use the dev server with multiple samples.
- **Cleanup**: Remove the sample model from the `visualizer/` directory.

## Capabilities

### New Capabilities
- `sample-model-library`: A collection of YAML-driven data models illustrating different architectural patterns.

### Modified Capabilities
- `dev-server`: Update development instructions to point to the new sample directory.

## Impact

- `samples/`: New directory containing YAML models.
- `visualizer/sample-model.yaml`: Removed.
- `DEVELOPMENT.md`: Updated instructions.
