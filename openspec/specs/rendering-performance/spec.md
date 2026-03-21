## ADDED Requirements

### Requirement: Canvas render performance at scale
The system SHALL maintain interactive performance across large schemas using the Cytoscape Canvas renderer.

#### Scenario: 200-node schema initial render
- **WHEN** a schema with 200 tables is loaded
- **THEN** the canvas SHALL complete initial render within 50ms and sustain ≥55fps during pan and zoom

#### Scenario: 1,000-node schema initial render
- **WHEN** a schema with 1,000 tables is loaded
- **THEN** the canvas SHALL complete initial render within 200ms and sustain ≥50fps during pan and zoom

#### Scenario: 5,000-node schema remains interactive
- **WHEN** a schema with 5,000 tables is loaded
- **THEN** pan and zoom input SHALL respond within 100ms at any point after initial render completes

### Requirement: Viewport culling for DOM nodes
The `cytoscape-dom-node` plugin SHALL only maintain active DOM subtrees for nodes currently within the viewport. Nodes scrolled out of view SHALL have their DOM containers detached or hidden.

#### Scenario: Off-screen nodes do not consume layout resources
- **WHEN** the canvas contains 500 nodes and 300 are outside the current viewport
- **THEN** those 300 nodes SHALL NOT have active DOM subtrees contributing to browser layout calculation

## REMOVED Requirements

### Requirement: Scoped store subscription
**Reason**: React Flow's node re-render model required fine-grained Zustand subscriptions to prevent canvas-wide re-renders. Cytoscape.js manages its own rendering loop independently of React's render cycle; `cytoscape-dom-node` portal components use their own selectors. The constraint is no longer meaningful at the canvas-engine level.
**Migration**: Individual `TableCard` portal components continue to use scoped Zustand selectors as a local best practice, but this is no longer a system-level normative requirement.

### Requirement: Stable node and edge references
**Reason**: React Flow required memoized node/edge arrays to avoid unnecessary re-renders. Cytoscape receives elements via `cy.add()` / `cy.remove()` imperative API — there are no node/edge array props to memoize.
**Migration**: The `useCytoscapeSync` hook updates Cytoscape imperatively when the store changes; no array memoization is required.

### Requirement: Memoized components
**Reason**: `React.memo` on canvas-layer components (TableNode, DomainNode, edge components) was necessary under React Flow's prop-driven rendering model. These components no longer exist as React Flow nodes; `TableCard` portals are managed by `cytoscape-dom-node` and update independently.
**Migration**: `Sidebar`, `DetailPanel`, `RightPanel`, `CommandPalette` retain `React.memo` wrapping as a standalone best practice, but this is no longer tied to canvas rendering performance.

### Requirement: O(1) path highlight lookup
**Reason**: This was an optimization for the edge style computation loop in React Flow's edge rendering. Cytoscape applies edge styles via the Cytoscape style API directly on elements, not through a React render pass iterating all edges.
**Migration**: PathFinder results stored in Zustand continue to use `Set<string>` for node/edge ID lookup, but the normative requirement for O(1) lookup in the rendering path no longer applies.

### Requirement: O(1) node position lookup in sync
**Reason**: The node sync loop in App.tsx iterated React Flow nodes to update positions. Cytoscape position updates are O(1) per node via `cy.getElementById(id).position(pos)` — no loop over all nodes is needed.
**Migration**: Position updates go through `cy.getElementById(id).position()` directly.
