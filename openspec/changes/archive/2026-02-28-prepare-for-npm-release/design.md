## Context

Preparing for a public release on npm. The project should not contain boilerplate files that aren't used in the final application.

## Goals / Non-Goals

**Goals:**
- Zero unused boilerplate files.
- Professional `README.md` with proper credits.
- Correct versioning for a new project.

**Non-Goals:**
- New features.
- Major UI redesign.

## Decisions

### 1. Initial Version
- **Decision:** Use `0.1.0`.
- **Rationale:** Standard starting point for a public beta/MVP release.

### 2. Boilerplate Assets
- **Decision:** Delete `vite.svg` and `react.svg`.
- **Rationale:** These are only for the initial scaffold and aren't used by Modscape.

## Risks / Trade-offs

- **[Risk] Broken image links**: If the UI still references `react.svg`, it will break.
  - **Mitigation**: Grep for any references before deleting.
