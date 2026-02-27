## Context

The initial implementation of ModMod assumed that users would provide a complete YAML definition including logical and physical layers. In practice, data modeling often begins with a rough "box and line" conceptual sketch. The current codebase crashes when encountering incomplete tables, which hinders this creative process.

## Goals / Non-Goals

**Goals:**
- Enable the visualizer to render tables even if they only have an `id` and `name`.
- Support relationships that only specify `table` IDs, omitting `column` references.
- Prevent application-wide crashes by adding defensive checks at the component level.
- Provide sensible defaults (e.g., "Unknown" type) for missing metadata.

**Non-Goals:**
- Automatic inference of missing columns (this is a visualization task, not an AI generation task).
- Complex auto-layout for conceptual-only nodes (we will continue to use the current manual layout or simple default spacing).

## Decisions

- **TypeScript Interface Update**: Modify `Table`, `Column`, and `Relationship` interfaces to make implementation-heavy fields optional.
- **Defensive Rendering**: Update `TableNode.tsx` to use conditional rendering for the column list section. If `columns` is undefined or empty, the node will render as a header-only card.
- **Loose Edge Handling**: In `App.tsx`, if a relationship lacks `column` info, the edge will be connected to the node's main handles (Top/Bottom) instead of trying to find specific column-level handles.
- **Normalization in Parser**: Enhance `parser.ts` to ensure that even if the input is sparse, the resulting object has the minimum structure required by the components.

## Risks / Trade-offs

- **Visual Ambiguity**: [Risk] Without column handles, relationships might look cluttered or overlap. → [Mitigation] Use the node's center or default Top/Bottom handles for table-level links.
- **Schema Validation**: [Risk] Making fields optional might lead to users forgetting to fill in details later. → [Mitigation] Rely on the AI agent's "Modeling Rules" (`rules.md`) to guide the user towards completeness over time.
