## 1. Templates & Infrastructure

- [x] 1.1 Create `src/templates/default-model.yaml` with comprehensive boilerplate
- [x] 1.2 Create `src/create.js` and implement `createModel` with recursive directory support

## 2. CLI Integration

- [x] 2.1 Register `new` command in `src/index.js`
- [x] 2.2 Wire up the `createModel` function to the command

## 3. Version Bump (v1.0.7)

- [x] 3.1 Update version to `1.0.7` in root `package.json`
- [x] 3.2 Update version to `1.0.7` in `visualizer/package.json`
- [x] 3.3 Update version string in `src/index.js`
- [x] 3.4 Update version string in `visualizer/src/components/Sidebar/Sidebar.tsx`
- [x] 3.5 Run `npm install` to sync `package-lock.json` and build UI

## 4. Verification

- [x] 4.1 Verify `modscape new test` creates `test.yaml` in CWD
- [x] 4.2 Verify `modscape new models/finance/sales` creates directories and the file
- [x] 4.3 Verify the created file is a valid YAML model
