## Context

We need to implement a vertical "twin-name" layout for columns, similar to how we handled table headers in v1.0.3.

## Goals / Non-Goals

**Goals:**
- Show `physical.name` (or `id` as fallback) below `logical.name`.
- Use distinct typography for each layer (standard for logical, monospace for physical).
- Ensure the table node height remains manageable.

**Non-Goals:**
- Adding a toggle to hide physical names (can be added later as a global setting).

## Decisions

### 1. Column Typography & Layout
- **Logical Name**: `text-[11px] font-medium`. Primary row.
- **Physical Name**: `text-[8px] font-mono opacity-60`. Sub-row, indented slightly.
- **Layout**: `flex flex-col` inside the `td`.

### 2. Logic for Displaying Physical Name
```javascript
const logicalName = col.logical?.name || col.id;
const physicalName = col.physical?.name || col.id;
const showPhysical = logicalName !== physicalName;
```

### 3. Vertical Space Optimization
- Reduce column row padding from `6px 12px` to `4px 12px` when two lines are present.
- Ensure the handle position (the connection dot) remains centered relative to the *entire* column row or specifically the first line. We will center it to the whole row for visual stability.

## Risks / Trade-offs

- **[Risk] Node Length**: Tables with 20+ columns will become significantly taller.
  - *Mitigation*: The `nodrag` container already has `overflowY: auto`, so the node itself won't grow infinitely if a max-height is set (though currently we let it grow). We will keep an eye on readability.
