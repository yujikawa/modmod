## Context

The recent `multi-file-support` change allows `modmod dev` to point at directories. We want to leverage this by providing a set of sample models in a single `samples/` folder. This makes it easier for users to see the tool's capabilities.

## Goals / Non-Goals

**Goals:**
- Provide clear, well-documented YAML examples for common architectural patterns.
- Ensure the dev server is easy to start with these examples.
- Update development documentation for accuracy.

**Non-Goals:**
- Creating a separate CLI command for samples (existing `modmod dev samples` is sufficient).
- Advanced documentation for each model (the YAML content should be self-explanatory).

## Decisions

### 1. Directory Structure
- **Decision:** Place the `samples/` directory at the project root.
- **Rationale:** High visibility for new contributors and users.
- **Alternatives:** Keeping them in `visualizer/` (too coupled) or `docs/` (less intuitive for CLI use).

### 2. Sample Data Variety
- **Decision:** Include three distinct examples: eCommerce, Blog, and Analytics.
- **Rationale:** Covers simple (Blog), complex relational (eCommerce), and specialized (Analytics) models.

### 3. Updated Development Workflow
- **Decision:** Use the `samples/` directory as the default example in `DEVELOPMENT.md`.
- **Rationale:** Shows off the new multi-file support immediately.

## Risks / Trade-offs

- **[Risk] Path changes breaking existing scripts:** If any internal tests rely on the old path, they will break.
  - **Mitigation:** Search for occurrences of `sample-model.yaml` and update them.
