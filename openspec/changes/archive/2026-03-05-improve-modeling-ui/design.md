## Context

Modern data models can grow very large, exceeding standard HTTP request limits. Additionally, the "Implicit Parent" pattern (drag-to-contain) is hard to get right in a 2D canvas. Explicit assignment is the preferred path for professional tools.

## Goals / Non-Goals

**Goals:**
- Fix the save failure for large models.
- Implement explicit domain assignment in the Detail Panel.
- Improve table metadata density (counts and numbering).
- Clean up the `rules.md` template.

**Non-Goals:**
- Implementing a full undo/redo system (reserved for a later turn).
- Fully automated layout management.

## Decisions

### 1. Server Limit Expansion
Use `express.json({ limit: '10mb' })` in `src/dev.js`.
**Rationale:** 10MB is more than enough for even the most complex YAML data models while protecting the server from memory issues.

### 2. Explicit Domain Assignment
In `DetailPanel.tsx`, add a dropdown that lists all available domains.
- If a domain is selected, update the `domains` array in the schema to include this table ID, and remove it from any other domain.
- **Auto-Positioning**: When a domain is changed, optionally move the table into the bounds of the new domain (or let the user drag it there). Initially, we will just update the logical membership.

### 3. Visual Indicators in TableNode
- **Column Count**: Displayed next to the table ID in the 1st row of the header.
- **Index Numbering**: Prefix each column name with `idx + 1.` in the table body.

### 4. Drag Behavior Cleanup
In `App.tsx`, remove the logic that attempts to find a parent domain during `onNodeDragStop`. 
**Rationale:** This prevents "accidental adoption" of tables by domains they happen to pass over.

## Risks / Trade-offs

- **[Risk] Large YAML Persistence** → Mitigation: Verify that `fs.writeFileSync` handles the larger string payload correctly without blocking the event loop for too long.
- **[Trade-off] Loss of D&D convenience** → Mitigation: Explicit choice is safer. The user can still move the table visually into the domain box after assigning it.
