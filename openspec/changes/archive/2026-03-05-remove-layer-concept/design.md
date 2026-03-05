## Context

Simplifying the modeling metadata reduces cognitive load and enforces a cleaner separation of concerns: `type` for the entity's role, and `domain` for its organizational context.

## Goals / Non-Goals

**Goals:**
- Completely remove the `layer` property from the application.
- Restore the standard rounded corners to `TableNode` (previously squared for layers).
- Clean up the detail panel to focus on core metadata.

**Non-Goals:**
- Migrating existing `layer` data to tags (we will simply let it be ignored or discarded to encourage the new pattern).

## Decisions

### 1. Schema Removal
In `visualizer/src/types/schema.ts`, the `layer` property will be removed from the `Table` interface.

### 2. TableNode Simplification
- Remove the `layer` variable extraction.
- Delete the JSX block rendering the floating tab.
- Revert `borderRadius` logic to always use `8px` (or the theme default), removing the `layer ? '0 8px 8px 8px' : '8px'` conditional.

### 3. Detail Panel Cleanup
- Remove any references to `layer` in type badge calculations or specific UI fields.

### 4. Template Cleanup
Remove the "Architectural Layers" section from `src/templates/rules.md`.

## Risks / Trade-offs

- **[Trade-off] Loss of technical context**: Users who relied on the `layer` tag might miss it. 
  - *Mitigation*: They can now use `type: mart` for the most important layer, or generic `tags` for technical stages.
