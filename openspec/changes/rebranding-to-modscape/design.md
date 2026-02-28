## Context

Renaming a project mid-development requires a careful global search-and-replace to ensure no broken references remain. The new name `modscape` must be consistently applied across the CLI, UI, and documentation.

## Goals / Non-Goals

**Goals:**
- Consistent branding across all user-facing materials.
- Functional CLI command under the new name.
- Updated scaffolding that reflects the new identity.

**Non-Goals:**
- Changing the underlying YAML schema (this remains backward compatible where possible, but internal flags might change).
- Redesigning the logo (initially just rename text).

## Decisions

### 1. Binary Name
- **Decision:** Change `bin` in `package.json` to `"modscape": "./src/index.js"`.
- **Rationale:** Direct mapping to the new project name.

### 2. Hidden Directory
- **Decision:** Rename `.modmod/` to `.modscape/`.
- **Rationale:** Keeps project-specific configurations under the new brand.

### 3. Case Sensitivity
- **Decision:** Use `modscape` for commands/code and `ModScape` or `Modscape` for display titles.
- **Decision Detail:** Let's go with `Modscape` (Sentence case) for titles.

## Risks / Trade-offs

- **[Risk] Broken AI Skills**: If agent skills hardcode `.modmod/rules.md`, they will break.
  - **Mitigation**: Update all template files in `src/templates/` simultaneously.
- **[Risk] Existing user configurations**: Current users might have `.modmod/` folders.
  - **Mitigation**: Add a legacy check or just document the migration (since it's early stage).
