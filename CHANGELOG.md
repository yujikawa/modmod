# Changelog

All notable changes to this project will be documented in this file.

## [2.2.1] - 2026-03-26

### Fixed
- **YAML parse errors shown on canvas**
- **Docs updated for lineage `description` field** — `src/templates/rules.md`, `README.md`, and `README.ja.md` now document the optional `description` field on lineage entries and the `lineage update` command. — When a YAML file fails to parse (syntax error, bad indent, etc.), the canvas now displays a "YAML Parse Error" overlay with the error message instead of going blank. Covers all load paths: initial load, model switch, and hot-reload. Fixing the file and saving automatically clears the error and restores the canvas.
- **Information Search groups results by table** — Results are now grouped per table instead of one card per column. A `table` badge appears when the table name/description matched; matched columns are listed inline with a `col` badge. Searching by table name no longer floods the panel with one card per column.
- **ER edge cardinality shown in Detail Panel** — Selecting a relationship edge now shows `1` / `N` badges next to each table name in the Source/Target Details section. The separator was changed from `→` to `—` to reflect that ER relationships are not directional.
- **CLI mutation commands respect `imports:`** — `relationship add`, `lineage add`, and `domain member add` now resolve imported tables before validating table IDs. Previously, a YAML file containing only an `imports:` section (no local `tables:`) would incorrectly report referenced tables as "not found".
- **ER edge cardinality labels now anchor to their respective endpoints** — Labels are no longer rendered as a single `1..N` string at the edge midpoint (which could appear reversed when an edge was drawn right-to-left). Each end now shows its own label (`1` or `N`) adjacent to the connected table, using `source-label` / `target-label` edge properties.

### Changed
- **Single-file build** — `modscape build` now outputs a single self-contained `index.html` with all JavaScript, CSS, and assets fully inlined. The output works in environments without a web server (e.g. Google Apps Script, local file open).

---

## [2.2.0] - 2026-03-26

### Added
- **Information Search** — New tab at the top of the Right Panel activity bar. Search across all tables and columns by conceptual name, logical name, physical name, description, and BEAM tags. Results are displayed per-column with a three-tier table name hierarchy (conceptual → logical → physical). Clicking a result focuses the corresponding table on the canvas.
- **Export as Image** — New Download button in the Right Panel activity bar. Export the full canvas (nodes, edges, domains) as PNG or JPG. PNG supports a Transparent background toggle; JPG uses the current theme background color.
- **Lineage description** — Lineage edges now support an optional `description` field for documenting transformations and filter conditions. Edges with a description show a `ⓘ` indicator on the canvas; clicking the edge opens the Detail Panel where the description can be viewed and edited. CLI: `modscape lineage add --description` and new `modscape lineage update` command.

### Fixed
- **Sticky note text color** — Note text color is now derived from the note's background color (luminance-based) rather than the app theme. Light backgrounds get dark text; dark backgrounds get light text, regardless of dark/light mode.

### Removed
- **Presentation Mode** — Removed the Play button and `PresentationOverlay` component. The feature became non-functional after the Cytoscape.js migration and is superseded by Export as Image.

---

## [2.1.1] - 2026-03-26

### Added
- **Cross-file YAML imports** — New top-level `imports:` section lets a model reference table definitions from another YAML file without copying them. Ideal for conformed dimensions shared across multiple models.
- **Imported node read-only indicator** — Imported tables appear on the canvas as normal nodes but show an "Imported — read only" badge in the Detail Panel; edits are blocked to prevent accidental write-back.
- **Import hot-reload** — `modscape dev` watches import source files and reloads the canvas automatically when they change.

### Fixed
- ER edge highlight color in PathFinder now matches the node-click highlight color (`#84cc16`) for visual consistency.
- Saving a model with imported tables no longer writes imported table definitions into the main YAML file.

### Changed
- Rebuilt sample files: `retail-analytics.yaml` shows a full pipeline from Raw Vault → Star Schema → Data Mart → Consumers; `conformed-dims.yaml` serves as a shared conformed dimension source.

---

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
