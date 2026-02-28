## 1. Global Rename

- [x] 1.1 Replace `modmod` with `modscape` in `package.json` (name and bin).
- [x] 1.2 Replace `modmod` with `modscape` in `src/index.js` (commander configuration).
- [x] 1.3 Replace `ModMod` with `Modscape` in `README.md`.
- [x] 1.4 Replace `modmod` with `modscape` in `DEVELOPMENT.md`.
- [x] 1.5 Replace `ModMod` with `Modscape` in `visualizer/src/components/Sidebar/Sidebar.tsx`.

## 2. Directory and Scaffolding Update

- [x] 2.1 Rename `src/init.js` logic to create `.modscape/` instead of `.modmod/`.
- [x] 2.2 Rename the existing `.modmod/` directory in the repository to `.modscape/`.
- [x] 2.3 Update all files in `src/templates/` to reference `.modscape/` and `Modscape`.

## 3. Visual and Internal Consistency

- [x] 3.1 Update internal flags like `MODSCAPE_CLI_MODE` to `MODSCAPE_CLI_MODE` if used across codebase.
- [x] 3.2 Update `visualizer/src/store/useStore.ts` to use the new flag.
- [x] 3.3 Update `src/dev.js` and `src/build.js` to inject the new flag.

## 4. Verification

- [x] 4.1 Run `npm link` again to register the `modscape` command.
- [x] 4.2 Verify `modscape dev samples` works.
- [x] 4.3 Verify `modscape init` creates the correct directory.
