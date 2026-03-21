## Why

React Flow's DOM-based rendering generates 20–30 DOM elements per node, making canvas-wide interaction sluggish beyond ~200 tables (~780ms initial render, <28fps). Data teams need to place an entire Modern Data Stack on a single canvas — hundreds to thousands of tables — which React Flow fundamentally cannot support. Migrating to Cytoscape.js (Canvas-based) achieves ~58fps at 200 nodes and sustains usable framerates at 5,000+ nodes, unlocking Modscape's ambition as a whole-stack visualizer.

## What Changes

- **BREAKING**: Replace `reactflow` / `@xyflow/react` with `cytoscape` + `cytoscape-dagre` as the rendering engine
- Replace `TableNode`, `DomainNode`, `AnnotationNode`, `ButtonEdge`, `LineageEdge`, `AnnotationEdge` React components with `cytoscape-dom-node`–managed HTML node rendering (DOM elements are owned and positioned by the plugin, not a hand-rolled overlay)
- Add `yamlToElements()` conversion function — the new bridge between parsed YAML schema and Cytoscape `ElementDefinition[]`
- Replace domain compound-node rendering with a background-overlay approach (positioned `<div>`s synchronized to Cytoscape's viewport transform)
- Add zoom-level–aware display switching: collapsed (name-only) view at zoom < 0.35, full column-list view at zoom ≥ 0.35
- Preserve all YAML schema definitions, Zustand store structure, `lib/parser.ts`, `lib/graph.ts`, CodeMirror editor, Sidebar, DetailPanel, RightPanel — no behavioral changes outside the canvas rendering layer

## Capabilities

### New Capabilities

- `cytoscape-renderer`: Canvas-based graph renderer using Cytoscape.js. Includes `yamlToElements()` conversion, HTML overlay for node design (table header, column list, type badges), domain background rendering, ER/lineage edge styling, and viewport-synchronized interaction states (selected, dimmed, highlighted).

### Modified Capabilities

- `rendering-performance`: Performance requirements now target Canvas-based benchmarks (≤110ms initial render at 1,000 nodes, ≥54fps sustained) and drop DOM-specific requirements (scoped store subscriptions, stable React node/edge references, `React.memo` wrapping) that no longer apply after the React Flow removal.
- `domain-containers`: Domain rendering changes from React Flow compound nodes (parent–child node containment) to a background-overlay strategy — positioned `<div>` elements drawn behind the Cytoscape canvas, recalculated on every `render` event from nodes' bounding boxes.

## Impact

- **Removed dependencies**: `reactflow` (or `@xyflow/react`)
- **Added dependencies**: `cytoscape`, `cytoscape-dagre`, `cytoscape-dom-node`
- **Optionally removed**: `@xyflow/react` handle components, `NodeResizer`, `useUpdateNodeInternals`
- **Files replaced**: `App.tsx` (ReactFlow → Cytoscape init), `TableNode.tsx`, `DomainNode.tsx`, `AnnotationNode.tsx`, `ButtonEdge.tsx`, `LineageEdge.tsx`, `AnnotationEdge.tsx`
- **Files unchanged**: `store/useStore.ts`, `lib/parser.ts`, `lib/graph.ts`, `lib/utils.ts`, `types/schema.ts`, all panel/sidebar components
- **E2E tests**: Snapshot updates required after visual layer replacement; behavioral tests for click/drag/keyboard remain valid
