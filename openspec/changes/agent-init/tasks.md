## 1. CLI Setup

- [x] 1.1 Add `inquirer` dependency to the root `package.json`
- [x] 1.2 Register the `init` command in `src/index.js`
- [x] 1.3 Create `src/init.js` to handle the initialization logic

## 2. Templates & Scaffolding

- [x] 2.1 Create centralized rules template in `src/templates/rules.md.template`
- [x] 2.2 Create agent-specific bridge templates in `src/templates/` (e.g., `gemini-skill.md.template`)
- [x] 2.3 Implement the file writing logic with "safe mode" (don't overwrite unless confirmed)

## 3. Interactive Workflow

- [x] 3.1 Implement the multi-select prompt for AI agents
- [x] 3.2 Add logic to scaffold only the selected agent files
- [x] 3.3 Verify that `.modmod/rules.md` is always created as the SSoT

## 4. Verification

- [x] 4.1 Test the `init` command locally using `node src/index.js init`
- [x] 4.2 Verify all generated files point correctly to the rules file
- [x] 4.3 Update README to include documentation for the `init` command
