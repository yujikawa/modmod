# Changelog

All notable changes to this project will be documented in this file.

## [2.1.0] - 2026-03-25

### Added
- **Consumer nodes** — New top-level `consumers` YAML section for modeling downstream data consumers (dashboards, BI tools, data marts). Consumers appear as distinct node type on the canvas.
- **PathFinder: Single Node mode** — Select a node and highlight its 1-hop neighbors or all transitively reachable nodes/edges without specifying a destination.
- **PathFinder: Edge type filter** — Filter graph traversal by ER, Lineage, or Both across all PathFinder modes.
- **Canvas dimming** — Non-highlighted nodes and edges fade to 15% opacity when PathFinder is active, making the result set visually clear.
- **PathFinder node selector** — Node dropdown now groups entries by domain using `<optgroup>` and shows the node ID alongside its name.

### Fixed
- Lineage "All Transitive" traversal now uses directed BFS (separate downstream/upstream passes), preventing unrelated nodes from being highlighted in topologies like A→B←C.
- ER edge highlight color now matches node-click highlight color (`#84cc16`) consistently across PathFinder and node selection.
- PathFinder highlight clears on Esc key.

---

## [2.0.4] - 2025

### Fixed
- Domain background now shrinks correctly when child tables are in compact mode.
- Domain resize handle position corrected in `renderDomainHandles`.

---

## [2.0.3] - 2025

### Added
- **`modscape extract`** command — Extract specific tables by ID from a YAML model into a new file.
- **Model mutation API** — Atomic CLI subcommands (`table`, `column`, `relationship`, `lineage`, `domain`) for AI-friendly YAML editing. All support `--json` output.

### Fixed
- Column visibility toggle button state now stays in sync with edge visibility toggle behavior.

---

## [2.0.2] - 2025

### Added
- **Persistent view settings** — ER/Lineage/Annotations toggle states are saved and restored across sessions.
- **Custom AI rules extension** — Project-level rules file for AI agent guidance.
- **Node selection dimming** — Clicking a node dims all unconnected nodes and edges to improve focus.

---

## [2.0.1] - 2025

### Added
- **`modscape layout`** command — Auto-calculate and write layout coordinates into a YAML model.

### Changed
- Removed legacy lineage rendering logic in favor of Cytoscape-native edges.

---

## [2.0.0] - 2025

Major rewrite of the canvas renderer.

### Changed
- **Migrated canvas to Cytoscape.js** — Replaced custom SVG/DOM renderer with Cytoscape.js for improved performance and layout flexibility.
- Lineage YAML format updated to a flat `lineage` array (`from`/`to` pairs).

### Added
- **Minimap** — Overview minimap panel for large diagrams.
- **Auto layout** — Automatic node placement via layout algorithm.
- **Compact mode** — Collapse table cards to show only the header row.
- **Multi-selection** — Select and move multiple nodes at once.
- **Edge type styling** — ER and Lineage edges rendered with distinct visual styles (solid vs dashed, color-coded).
