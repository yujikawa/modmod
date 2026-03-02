## Context

The current Modscape visualizer is primarily read-only for layout (except for position dragging) and structural changes. Users must manually edit YAML text to resize elements or add new ones. This design introduces an interactive editing layer that bridges the visual canvas and the YAML text editor.

## Goals / Non-Goals

**Goals:**
- Enable interactive resizing for both Table and Domain nodes.
- Implement a visual toolbar on the canvas for adding new Tables and Domains.
- Establish a real-time sync mechanism from canvas visual state to the Sidebar YAML Editor.
- Maintain the "Save & Update" button as the final source of persistence to disk.
- Standardize on "Domain" terminology.

**Non-Goals:**
- Automated edge routing or complex layout algorithms.
- Full "undo/redo" history management in this initial phase (beyond browser refresh).
- Deleting elements via the canvas (will remain a YAML text operation for now to prevent accidental loss).

## Decisions

### 1. Interactive Resizing with NodeResizer
- **Decision:** Integrate `NodeResizer` from `reactflow` into both `TableNode.tsx` and `DomainNode.tsx`.
- **Rationale:** Standard React Flow way to handle resizing.
- **Alternatives:** Custom handles (more work, less standard).

### 2. Canvas-to-Sidebar Sync Strategy
- **Decision:** On any visual change (`onNodeDragStop`, `onResizeEnd`, `onAddElement`), the store will generate a new YAML string using `js-yaml.dump` and update the `yamlInput` state in `EditorTab.tsx`.
- **Rationale:** This treats the Sidebar Editor as a "staging area." Users see exactly what will be saved.
- **Alternatives:** Direct background save (too risky, users want to see the YAML diff).

### 3. Canvas Toolbar Implementation
- **Decision:** Add a floating toolbar (using Radix or simple Tailwind) over the ReactFlow canvas in `App.tsx`.
- **Rationale:** Keeps modeling tools close to the action.

### 4. Terminology Change
- **Decision:** Rename all internal and external references to "Group" to "Domain".
- **Rationale:** Consistent with the Modscape domain-driven modeling concept.

## Risks / Trade-offs

- **[Risk] YAML Formatting Loss** → [Mitigation] Using `js-yaml.dump` might reformat user's hand-written comments or custom spacing. We will accept this trade-off for the benefit of bidirectional sync, but try to use sensible default dump options.
- **[Risk] Performance on Large Models** → [Mitigation] Debounce the YAML generation if real-time updates become sluggish on very large schemas.
- **[Risk] Sync Loop** → [Mitigation] Ensure that the sync is unidirectional from Canvas to Editor during visual operations to avoid infinite update loops.
