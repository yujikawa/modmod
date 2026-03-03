## Context

Modern data modeling requires both static structure (ER) and processing flow (Lineage). To serve data engineers, Modscape must visualize how tables relate *and* how they are built, using the industry-standard layering (Source -> Staging -> Mart).

## Goals / Non-Goals

**Goals:**
- Define table-to-table dependencies in YAML.
- Visualize these as animated blue dashed arrows.
- Support simultaneous viewing of ER and Lineage.
- Use a "Floating Tab" UI for architectural layers.
- Ensure foolproof connection creation through bidirectional swapping.

**Non-Goals:**
- Automated column-level lineage.
- Running dbt or SQL directly.

## Decisions

### 1. Data Dependency Mapping
We add a `lineage` section to the YAML schema.
```yaml
tables:
  - id: mart_sales
    lineage:
      upstream: ["stg_orders", "dim_customers"]
```

### 2. Visualization Style Consistency
- **ER (Structure)**: Solid lines, green when highlighted, static (no animation).
- **Lineage (Flow)**: Dashed arrows, blue, animated to show data movement.
- **Layering**: Left-top "Floating Tab" on `TableNode`. Top-left corner of the table becomes square when a layer is present for seamless visual integration.

### 3. State Management
Replace a single mode string with two independent booleans: `showER` and `showLineage`.
- This allows users to mix and match views depending on their task.

### 4. Smart Connections
To prevent "unreachable" handles or "wrong direction" errors:
- **Bidirectional ER**: If a user connects a `target` handle to a `source` handle, `onConnect` automatically swaps them to ensure the edge points correctly.
- **Ambiguity Guard**: When both ER and Lineage are ON, all handles are disabled (`pointerEvents: none`) to prevent ambiguous edge creation.

### 5. Interaction
Lineage edges are first-class objects. They support selection, highlighting, and deletion via the standard toolbar or `Delete` key.

## Risks / Trade-offs

- **[Trade-off] Multi-handle clutter** → Mitigation: Use side handles for lineage and top/bottom handles for ER. Use the ambiguity guard to prevent accidental connections when multiple handles are visible.
