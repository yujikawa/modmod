## Why

dbt is the industry standard for data transformation, but visualizing complex lineage and project structure across hundreds of models remains a challenge. This change introduces an `import-dbt` command that allows users to instantly convert their dbt project metadata into Modscape YAML.

Additionally, the current CI pipeline runs a full UI build and E2E tests for every PR, even when only CLI logic is modified. This slows down development and wastes resources. Optimizing the CI to skip heavy UI tasks when they aren't needed is critical for developer productivity.

## What Changes

- **New CLI Command**: `modscape import-dbt <path>` to process a dbt `manifest.json` file.
- **Automated Mapping**: dbt Models/Sources to Modscape Tables, lineage, and domains.
- **CI Pipeline Optimization**: Update GitHub Actions (`pr-check.yml`) to conditionally skip UI builds and E2E tests based on changed files.
- **Improved Branch Protection Flow**: Ensure required checks still pass even when specific heavy jobs are skipped.

## Capabilities

### New Capabilities
- `dbt-import`: Logic to parse dbt `manifest.json` and map it to Modscape YAML.
- `ci-optimization`: Intelligent CI workflow that detects changes and runs only necessary validation jobs.

### Modified Capabilities
- `cli-integration`: Register the `import-dbt` command in the CLI.

## Impact

- **CLI**: `src/index.js` and new `src/import-dbt.js`.
- **CI/CD**: `.github/workflows/pr-check.yml` will be restructured.
