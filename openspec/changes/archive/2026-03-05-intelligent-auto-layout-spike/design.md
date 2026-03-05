## Context

We need to arrange nodes in a way that respects the `Domain > Table` hierarchy while minimizing edge crossings using hierarchical graph layout.

## Goals / Non-Goals

**Goals:**
- Tables must stay inside their domains.
- Domains must expand to fit their tables.
- Tables with relationships should be aligned (Parent -> Child).
- Persistence to YAML must be automatic.

**Non-Goals:**
- Real-time auto-layout (this is a one-time "format" action).

## Decisions

### 1. Choice of Engine
We will use **`dagre`**. It is the industry standard for hierarchical layouts in React Flow and supports both nodes and edges for positioning.

### 2. The Two-Pass Algorithm

#### Pass 1: Local Optimization (Internal)
For each domain:
1. Create a `dagre` graph.
2. Add all tables belonging to the domain as nodes.
3. Add all relationships where both `from` and `to` are in the domain as edges.
4. Run `dagre.layout`.
5. Calculate the bounding box of the resulting positions.
6. Set Domain size = Bounding Box + Padding.
7. Store relative coordinates for each table.

#### Pass 2: Global Optimization (External)
1. Create a `dagre` graph.
2. Add each Domain as a node (using the new sizes from Pass 1).
3. Add each Unassigned Table as a node.
4. Add all "Inter-domain" or "Table-to-Domain" relationships as edges.
5. Run `dagre.layout`.
6. Final coordinate = Pass 2 result (absolute) + Pass 1 result (relative).

### 3. UI Integration
Add a new `MagicLayout` button to `CanvasToolbar.tsx`.
```tsx
<button onClick={applyAutoLayout} title="Intelligent Auto-Layout">
  <Sparkles />
</button>
```

## Risks / Trade-offs

- **[Risk] Layout Destabilization**: Users might lose their carefully manually placed nodes.
  - *Mitigation*: The feature is manual (button trigger) and reversible via Undo.
- **[Risk] Complex Inter-domain Edges**: Dagre might struggle with edges that go deep into nested nodes.
  - *Mitigation*: We will simplify Pass 2 by treating domains as monolithic blocks.
