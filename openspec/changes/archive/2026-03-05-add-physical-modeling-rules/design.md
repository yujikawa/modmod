## Context

Modscape's schema already supports physical metadata, but users and AI agents aren't aware of the conventions for filling these fields.

## Goals / Non-Goals

**Goals:**
- Provide clear conventions for `physical.name` and `physical.schema`.
- Explain how to map logical types to physical DB types.
- Ensure AI agents can generate dbt/PySpark implementations based on this YAML.

**Non-Goals:**
- Providing a full SQL generator (this rules file is for humans/AI to write the YAML correctly).

## Decisions

### 1. Physical Layer Conventions
- **Naming**: Always `snake_case` for physical names.
- **Schema Mapping**:
  - `Raw` -> `raw` / `source`
  - `Integration` -> `staging` / `int`
  - `Analysis` -> `analytics` / `mart`
- **Granularity**: Encourage defining column-level physical types (e.g., `VARCHAR`, `TIMESTAMP`) to reduce ambiguity during implementation.

### 2. YAML Schema Example Update
The example in `rules.md` will be updated to show:
- Table-level `physical` block.
- Column-level `physical` block with `constraints`.

## Risks / Trade-offs

- **[Risk] Complexity Overload**: Adding more sections might make the YAML feel heavy.
  - *Mitigation*: Emphasize that physical mappings are *optional* but required for implementation-ready models.
