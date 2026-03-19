## Context

Modscape helps visualize data models, but many users already have these models defined in dbt. Manually recreating them in Modscape YAML is tedious. dbt generates a `target/manifest.json` file that contains all the structural information (nodes, columns, lineage) needed to bootstrap a Modscape model.

Additionally, the current GitHub Actions workflow (`pr-check.yml`) is inefficient. It runs a full UI build and E2E tests for non-UI changes, and conversely, it may fail to run and block merges for non-code changes (like `README.md`) because of `on.pull_request.paths` filtering combined with required status checks.

## Goals / Non-Goals

**Goals:**
- Provide a CLI command to convert dbt `manifest.json` to Modscape YAML.
- Map dbt models and sources to Modscape tables with accurate lineage.
- **CI Optimization**: Move path-based filtering *inside* the workflow to ensure the check always runs and reports status to GitHub.
- **CI Performance**: Skip heavy UI tasks (build/E2E) when only CLI or Docs are modified.

## Decisions

- **CLI Integration**: Add `import-dbt` subcommand to `src/index.js` and implement in `src/import-dbt.js`.
- **CI Implementation Strategy**:
    - Remove the top-level `on.pull_request.paths` filter from `pr-check.yml`.
    - Use `dorny/paths-filter` at the beginning of the job to categorize changes: `ui`, `cli`, `docs`.
    - Use `if` conditions on individual steps (or separate jobs) to run only what's necessary.
    - If only `docs` (README, etc.) changed, the job will essentially do nothing and finish successfully in seconds, satisfying branch protection.
- **Job Structure**: Keep a single top-level Job name (e.g., `build-check`) that is "Required" in GitHub settings, so it always reports a result.
- **Node Filtering**: Only process `resource_type` of `model`, `seed`, `snapshot`, and `source`.
- **Domain Generation**: Derive domain IDs and names from the `original_file_path`.
- **Appearance Defaults**: Set `appearance.type` to `table` by default for all imported nodes.

## Risks / Trade-offs

- **[Risk] Large Manifests** → [Mitigation] Use standard `fs.readFileSync`.
- **[Risk] GitHub "Required Check" Failures** → [Mitigation] Ensure the workflow *always* has a successful exit code, even if all steps are skipped.
- **[Risk] Path Filtering Blind Spots** → [Mitigation] Always run all tests if `package.json` or `.github/workflows/**` change.
