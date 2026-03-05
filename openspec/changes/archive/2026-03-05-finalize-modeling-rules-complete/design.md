## Context

The `rules.md` is the primary source of truth for AI agents (Gemini, Claude, Codex) when they interact with `model.yaml`. We must expose every available leverage point in the schema.

## Goals / Non-Goals

**Goals:**
- Enable AI to generate realistic sample data automatically.
- Ensure correct ER notation (Cardinality) is documented in the YAML.
- Allow visual categorization using icons and domain colors.

**Non-Goals:**
- Creating a separate data generation engine (this is a rule for AI to follow).

## Decisions

### 1. Sample Data Formatting
- AI must generate at least 3 rows of realistic data for every new table.
- Use a 2D array format: `sampleData: [ ["Header1", "Header2"], [val1, val2] ]`.

### 2. Relationship Cardinality
- Force AI to choose one of: `one-to-one`, `one-to-many`, `many-to-one`, `many-to-many`.

### 3. Aesthetics
- **Icons**: Use Emoji icons in `appearance.icon` to represent business concepts (e.g., 📦 for Shipping, 👤 for Users).
- **Domain Colors**: Assign a unique `color` (hex or rgba) to each domain to keep the canvas organized.

## Risks / Trade-offs

- **[Risk] YAML Verbosity**: Including sample data makes the YAML file much larger.
  - *Mitigation*: Our CodeMirror editor and parser are optimized for large files (tested up to 10MB).
