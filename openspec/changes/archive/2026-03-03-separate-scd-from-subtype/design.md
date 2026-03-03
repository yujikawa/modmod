## Context

Currently, `sub_type` acts as a bucket for both Fact strategies (transaction, etc.) and SCD types (type1, type2, etc.), making them mutually exclusive. This prevents modeling Fact tables that maintain a history.

## Goals / Non-Goals

**Goals:**
- Decouple "Nature/Grain" (`sub_type`) from "History" (`scd`).
- Allow simultaneous assignment of both properties.
- Provide a clear, separate UI for both.

**Non-Goals:**
- Changing the `type` (Fact/Dim) hierarchy.

## Decisions

### 1. Schema Expansion
```typescript
appearance: {
  sub_type?: string; // Grain (Trans., Periodic, etc.)
  scd?: string;      // History (Type 0-7)
}
```

### 2. Migration in Parser
In `normalizeSchema`, if `sub_type` matches the pattern `/^type[0-7]$/`, it will be moved to the `scd` property if `scd` is not already defined.
**Rationale:** Preserves compatibility with v0.9.1 models while cleaning up the structure.

### 3. UI Layout (Detail Panel)
Two separate dropdowns:
- **Sub-type**: Labels change contextually (e.g., "Fact Grain").
- **SCD Type**: Always labeled "SCD Type" or "History Management".

### 4. Visual Badge Layout
If both exist, the label will be formatted as `TYPE (SUB) / SCD T#`.
Example: `FACT (Trans.) / SCD T2`

## Risks / Trade-offs

- **[Risk] Visual Clutter** → Mitigation: Keep the labels abbreviated (Trans., T2) to fit in the table header.
