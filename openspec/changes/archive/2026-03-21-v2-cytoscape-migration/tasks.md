## 1. Dependencies & Project Setup

- [x] 1.1 Install `cytoscape`, `cytoscape-dagre`, `cytoscape-dom-node` and their TypeScript types; remove `reactflow` / `@xyflow/react` from package.json
- [x] 1.2 Add Cytoscape TypeScript ambient declarations if `@types/cytoscape` is insufficient for `cytoscape-dom-node`
- [x] 1.3 Verify `npm run build-ui` succeeds with new deps and no React Flow imports

## 2. YAML-to-Elements Conversion

- [x] 2.1 Create `visualizer/src/lib/cytoscapeElements.ts` with `yamlToElements(schema): ElementDefinition[]`
- [x] 2.2 Implement table → node conversion: `data.id`, `data.table`, `data.typeColor`, `data.typeLabel`, initial `position` from `schema.layout`
- [x] 2.3 Implement `lineage.upstream[]` → lineage edges with `data.kind = 'lineage'`
- [x] 2.4 Implement `relationships[]` → ER edges with `data.kind = 'er'`, `data.relType`, `data.fromColumn`, `data.toColumn`, `data.label`
- [x] 2.5 Write unit tests for `yamlToElements()` covering node count, edge kinds, and layout coordinate passthrough

## 3. Cytoscape Canvas Initialization

- [x] 3.1 Replace `<ReactFlow>` in `App.tsx` with a `<div ref={cyContainerRef}>` and initialize `cy` via `useEffect` using `cytoscape({ container, elements, style })`
- [x] 3.2 Register `cytoscape-dagre` and `cytoscape-dom-node` extensions at module load
- [x] 3.3 Configure base Cytoscape style: node box sizing, ER edge (solid blue), lineage edge (dashed green), cardinality badge labels
- [x] 3.4 Implement `useCytoscapeSync` hook: subscribe to Zustand schema changes and call `cy.add()` / `cy.remove()` / `cy.getElementById().data()` to keep Cytoscape in sync
- [x] 3.5 Implement `cy.on('dragfree', 'node')` → `store.updateLayout(id, pos)` write-back
- [x] 3.6 Validate with the `samples/` YAML files: canvas loads, edges render, drag persists to YAML

## 4. Domain Background Overlay

- [x] 4.1 Create a transparent `position:absolute` overlay `<div>` layered behind the Cytoscape canvas container
- [x] 4.2 Implement `renderDomainBackgrounds(cy, schema.domains)`: compute bounding box from member nodes, convert to screen coordinates using `cy.zoom()` + `cy.pan()`, render background divs with `domain.color`
- [x] 4.3 Bind `renderDomainBackgrounds` to `cy.on('render')` and on schema domain changes
- [x] 4.4 Implement domain background drag: `mousedown` on background div → move all member nodes by delta → on `mouseup` call `store.updateLayout` for each

## 5. TableCard React Component

- [x] 5.1 Extract visual markup from existing `TableNode.tsx` into a standalone `TableCard.tsx` component that accepts `table: Table`, `isSelected: boolean`, `isDimmed: boolean`, `isHighlighted: boolean` as props
- [x] 5.2 Implement zoom-aware display switching: `TableCard` reads a `zoom` prop and renders minimal (name + type badge only) when `zoom < 0.35`, full card otherwise
- [x] 5.3 Wire `cytoscape-dom-node` containers to render `TableCard` via React portals (one `createRoot` per node, stored in a `Map<id, Root>`)
- [x] 5.4 Implement portal lifecycle: create root on `cy.on('add', 'node')`, destroy root on `cy.on('remove', 'node')`
- [x] 5.5 Pass current zoom from `cy.zoom()` to `TableCard` on `cy.on('zoom')` events
- [x] 5.6 Pass interaction states (`isSelected`, `isDimmed`, `isHighlighted`) derived from Zustand store to each `TableCard` on store change

## 6. Interactions

- [x] 6.1 Implement `cy.on('tap', 'node')` → `store.setSelectedTableId(id)` (only when not a drag, verified by checking if position changed)
- [x] 6.2 Implement `cy.on('tap', 'edge')` → `store.setSelectedEdgeId(id)` and open edge detail in DetailPanel
- [x] 6.3 Implement `cy.on('mouseover', 'node')` → highlight connected nodes/edges; `cy.on('mouseout', 'node')` → clear highlight
- [x] 6.4 Implement `cy.on('tap', background)` → `store.clearSelection()`
- [x] 6.5 Restore keyboard shortcuts: T (add table), D (add domain), S (add sticky), Delete (delete selected), using `keydown` on the canvas container
- [x] 6.6 Implement box selection: enable `cy.boxSelectionEnabled(true)`, wire box selection complete → `store.setSelectedTableIds(ids)`

## 7. Automatic Layout

- [x] 7.1 Implement `runAutoLayout()`: call `cy.layout({ name: 'dagre', rankDir: 'LR', nodeSep: 40, rankSep: 120, animate: true, animationDuration: 500 }).run()`
- [x] 7.2 On layout stop, iterate all nodes and call `store.updateLayout(id, pos)` for each to write positions back to YAML
- [x] 7.3 Wire the existing "Auto Layout" toolbar button to `runAutoLayout()`

## 8. Annotation Nodes

- [x] 8.1 Implement annotation rendering as overlay divs (not Cytoscape nodes): position relative to `targetId` node's Cytoscape position + `offset`, or absolute canvas position if no `targetId`
- [x] 8.2 Bind annotation overlay updates to `cy.on('render')` alongside domain backgrounds
- [x] 8.3 Implement annotation drag: `mousedown` on annotation div → update `store.updateAnnotation(id, { offset })` on `mouseup`

## 9. Presentation Mode & Path Highlighting

- [x] 9.1 Implement presentation mode: when `isPresentationMode` is true, apply opacity 0.15 to all nodes not in `selectedTableIds`
- [x] 9.2 Wire PathFinder results (`highlightedNodeIds`, `pathFinderResult.edgeIds`) to Cytoscape element styles and `TableCard` props

## 10. Cleanup & Stabilization

- [x] 10.1 Delete `TableNode.tsx`, `DomainNode.tsx`, `AnnotationNode.tsx`, `ButtonEdge.tsx`, `LineageEdge.tsx`, `AnnotationEdge.tsx`
- [x] 10.2 Remove all `reactflow` imports from remaining files; verify `reactflow` is not referenced anywhere
- [x] 10.3 Run `npm run build-ui` and fix any TypeScript / build errors
- [x] 10.4 Run `npm run test:e2e -- --update-snapshots` to update all visual snapshots
- [x] 10.5 Run `npm run test:all` and confirm all tests pass
- [x] 10.6 Stress test with a 500-node and 1,000-node schema; verify initial render ≤200ms and fps ≥50 during pan/zoom
