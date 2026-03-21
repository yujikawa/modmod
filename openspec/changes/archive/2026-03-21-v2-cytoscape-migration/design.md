## Context

Modscape currently uses React Flow (DOM-based) for its visual canvas. Each table node generates 20–30 DOM elements; at 200 nodes that is 4,000–6,000 elements that layout is recalculated on every zoom/pan. Initial render at 200 nodes is ~780ms / ~28fps; at 500 nodes it degrades to ~12fps; at 1,000 nodes to ~7fps.

Data teams modeling a full Modern Data Stack may need 500–2,000+ tables on a single canvas. The current architecture cannot serve this use case. Cytoscape.js renders to an HTML5 Canvas and sustains ~54fps at 5,000 nodes.

The YAML schema, Zustand store, parser, and all panel/sidebar components are unaffected. Only the rendering layer (App canvas + node/edge components) is replaced.

## Goals / Non-Goals

**Goals:**
- Replace React Flow with Cytoscape.js as the canvas rendering engine
- Preserve the full existing UX surface: node design, edge cardinality badges, domain backgrounds, YAML↔canvas bidirectional sync, drag-to-update, keyboard shortcuts, PathFinder, presentation mode
- Use `cytoscape-dom-node` for HTML node rendering to avoid per-frame DOM reconstruction
- Maintain the existing YAML schema contract exactly (no format changes)
- Pass all existing E2E tests (with snapshot updates) after migration

**Non-Goals:**
- Changes to YAML schema
- Changes to Zustand store shape
- Changes to Sidebar, DetailPanel, RightPanel, CodeMirror editor
- New modeling features beyond what exists today
- Mobile/touch-specific interactions

## Decisions

### D1 — `cytoscape-dom-node` over hand-rolled overlay

**Decision**: Use the `cytoscape-dom-node` plugin for HTML node rendering.

**Rationale**: A hand-rolled overlay (`cy.on('render')` + `innerHTML = ''` per frame) fires on every animation frame during zoom/pan and rebuilds all visible DOM nodes each time, partially negating Canvas performance gains. `cytoscape-dom-node` keeps DOM nodes as first-class Cytoscape elements — the plugin synchronizes position/scale internally via CSS transforms, so React subtrees for each node are stable between renders and only update when data changes.

**Alternative considered**: DOM pooling with a hand-rolled overlay. Viable but requires manual implementation of position tracking, viewport culling, and scale math — essentially rebuilding what `cytoscape-dom-node` already provides.

### D2 — React portals inside `cytoscape-dom-node` containers

**Decision**: Each Cytoscape node's DOM container (provided by `cytoscape-dom-node`) hosts a React portal rendering the existing `TableCard` component (extracted from `TableNode.tsx`).

**Rationale**: This lets us reuse existing JSX + Tailwind styling for the table card design without rewriting it in raw DOM manipulation. Zustand selectors inside `TableCard` continue to work normally. React's reconciler handles incremental DOM updates when table data changes.

**Alternative considered**: Raw DOM manipulation without React inside the node container. Faster to bootstrap but diverges from the existing component model and loses Tailwind/React ecosystem.

### D3 — `cytoscape-dagre` for automatic layout, preserving existing Dagre config

**Decision**: Replace `dagre` direct usage in App.tsx with `cytoscape-dagre` layout extension. Reuse the same `rankDir: 'LR'`, `nodeSep`, `rankSep` settings from the current implementation.

**Rationale**: The existing Dagre configuration produces a layout that users understand. Re-tuning layout is out of scope for this migration.

### D4 — Domain backgrounds as `cy.on('render')` overlay divs (not compound nodes)

**Decision**: Render domain backgrounds as absolutely positioned `<div>` elements in a transparent overlay container, updated on `cy.on('render')`. These are background-only decorations — they do not participate in Cytoscape's element model.

**Rationale**: Cytoscape compound nodes require child nodes to be assigned a `parent` data property, which constrains layout (children are trapped inside parent bounds). The current React Flow implementation uses `DomainNode` as a visual container but does not enforce node containment. Using background overlays maintains the same visual and behavioral semantics without compound-node constraints.

**Performance note**: Domain count in practice is low (2–20 domains). Rebuilding domain background divs on `render` is negligible compared to node rendering and is safe to do with `innerHTML`/div recreation per frame.

### D5 — YAML↔canvas sync adapter pattern

**Decision**: Introduce a `useCytoscapeSync` hook that wraps the Cytoscape instance ref and maps Zustand store mutations to `cy.add()` / `cy.remove()` / `cy.getElementById().data()` calls. Store mutations continue to flow through existing Zustand actions; the hook subscribes and mirrors changes to the cy instance.

**Rationale**: Avoids duplicating sync logic in every component. Keeps the Zustand store as the single source of truth and Cytoscape as a derived rendering view.

### D6 — Zoom-level display switching

**Decision**: At zoom < 0.35, render a minimal `TableCard` variant (name + type badge only, no column list). At zoom ≥ 0.35, render the full card. Threshold controlled by a constant.

**Rationale**: At low zoom levels, column text is unreadable anyway. Skipping column DOM elements at low zoom significantly reduces the DOM count during overview navigation of large schemas.

## Risks / Trade-offs

| Risk | Mitigation |
|---|---|
| `cytoscape-dom-node` plugin maintenance / compatibility | Plugin is MIT-licensed; if abandoned, DOM pooling (D1 alternative) is a clear fallback path |
| React portal lifecycle inside Cytoscape nodes (unmount on node remove) | Manage portal roots in a `Map<id, Root>` keyed by node ID; destroy root in `cy.on('remove')` handler |
| E2E snapshots break completely (visual layer replaced) | Run `npm run test:update` as the final step of Phase 3; treat snapshot updates as expected output |
| Drag + YAML sync correctness (position written back) | Implement `cy.on('dragfree')` → `store.updateLayout()` early in Phase 1 and keep it in all test runs |
| AnnotationNode anchoring (relative offset from target) | Compute screen-space offset from target node's Cytoscape position; update in `cy.on('render')` alongside domain backgrounds |

## Migration Plan

Migration is incremental and feature-flag–free. The existing React Flow canvas is replaced file-by-file across three phases:

**Phase 1 — Engine (1–2 weeks)**
- Install `cytoscape`, `cytoscape-dagre`, `cytoscape-dom-node`
- Replace `App.tsx` canvas section: remove `<ReactFlow>`, initialize `cy` instance via `useRef`
- Implement `yamlToElements()`: tables → nodes (with placeholder box), lineage + ER relationships → edges
- Implement `cy.on('dragfree')` → `store.updateLayout()` write-back
- Implement domain background overlay
- Stress test at 500 / 1,000 nodes; validate fps target

**Phase 2 — Node Design (1–2 weeks)**
- Extract `TableCard` component from existing `TableNode.tsx`
- Wire `cytoscape-dom-node` containers to render `TableCard` portals
- Implement zoom-level display switching (full ↔ minimal)
- Implement selected / dimmed / highlighted visual states
- Remove `reactflow` package once Phase 2 is stable

**Phase 3 — Interactions (1 week)**
- Node click → `selectedTableId` → DetailPanel
- Edge click → edge detail panel
- Hover → related node/edge highlight
- Keyboard shortcuts (T, D, S, Delete)
- Presentation mode (dim non-selected)
- Run `npm run test:update` to update E2E snapshots

**Rollback**: Until the `reactflow` package is removed (end of Phase 2), the old implementation is recoverable via git revert. After removal, rollback requires reverting the full Phase 1–2 commit range.

## Open Questions

- **AnnotationNode positioning**: Current implementation anchors sticky notes to a `targetId` node with a pixel offset. Should annotations be `cytoscape-dom-node` nodes (participates in layout) or overlay divs (free-positioned)? Recommendation: overlay divs, positioned relative to target node's Cytoscape position.
- **Multi-select lasso**: React Flow provides built-in lasso/box selection. Cytoscape supports box selection natively (`boxSelectionEnabled: true`) but requires verifying compatibility with `cytoscape-dom-node`.
- **NodeResizer replacement**: Current `TableNode` uses React Flow's `NodeResizer`. Cytoscape-native resize (drag corner) is possible but requires a custom implementation or the `cytoscape-node-resize` extension. Scope TBD.
