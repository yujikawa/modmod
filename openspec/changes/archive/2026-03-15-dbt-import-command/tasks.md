## 1. Scaffolding and CLI Registration

- [x] 1.1 Create `src/import-dbt.js` with basic module structure.
- [x] 1.2 Update `src/index.js` to register the `import-dbt` command using `commander`.
- [x] 1.3 Verify that `modscape import-dbt --help` correctly displays the new command and options.

## 2. Core Conversion Logic

- [x] 2.1 Implement `manifest.json` file loading and basic JSON validation.
- [x] 2.2 Implement filtering to extract only relevant dbt nodes (models, seeds, snapshots, and sources).
- [x] 2.3 Implement mapping logic for table IDs, names, and physical names.
- [x] 2.4 Implement lineage extraction by parsing `depends_on.nodes` and mapping them to table IDs.

## 3. Domain and Column Support

- [x] 3.1 Implement domain grouping logic based on the directory structure found in `original_file_path`.
- [x] 3.2 Implement optional column metadata extraction (descriptions and types) if present in the manifest.
- [x] 3.3 Ensure the final output is formatted correctly using `js-yaml`.

## 4. CI Pipeline Optimization

- [x] 4.1 Update `.github/workflows/pr-check.yml` to remove top-level `paths` filter.
- [x] 4.2 Add `dorny/paths-filter` to categorize changes (`ui`, `cli`, `docs`).
- [x] 4.3 Restructure CI steps to conditionally execute UI build and E2E tests.
- [x] 4.4 Verify that a PR with *only* `README.md` modification completes successfully within seconds.
- [x] 4.5 Verify that the PR check still reports "Success" when UI jobs are skipped.

## 5. Validation and Error Handling

- [x] 5.1 Add robust error handling for missing manifest files or malformed JSON.
- [x] 5.2 Test the command with a sample dbt manifest and verify the resulting YAML.
- [x] 5.3 Verify the generated model can be successfully loaded and visualized using `modscape dev`.
