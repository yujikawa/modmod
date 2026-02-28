## 1. Directory Setup

- [x] 1.1 Create the `samples/` directory at the project root.
- [x] 1.2 Move `visualizer/sample-model.yaml` to `samples/ecommerce.yaml`.
- [x] 1.3 Create `samples/blog-model.yaml` with a simple relational structure.
- [x] 1.4 Create `samples/analytics-vault.yaml` with a Data Vault example.

## 2. Documentation and Cleanup

- [x] 2.1 Update `DEVELOPMENT.md` with instructions on how to use `modmod dev samples`.
- [x] 2.2 Remove the old `visualizer/sample-model.yaml` file.
- [x] 2.3 Search for any remaining references to `visualizer/sample-model.yaml` and update them.

## 3. Verification

- [x] 3.1 Verify `node src/index.js dev samples` correctly identifies all files.
- [x] 3.2 Ensure the visualizer works as expected with the new file paths.
