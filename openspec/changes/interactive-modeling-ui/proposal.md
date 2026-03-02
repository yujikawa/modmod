## Why

Currently, Modscape provides an excellent visualization and a manual YAML editor, but lacks a bridge between the two for intuitive modeling. Layout adjustments (resizing) and structural changes (adding entities/domains) require manual coordinate or text manipulation in the Sidebar Editor, which is cumbersome and less productive than direct visual manipulation.

## What Changes

- **Interactive Resizing**: Both Domain and Table nodes will support direct visual resizing on the canvas.
- **Visual Element Addition**: A new canvas-level toolbar to add new Domain and Table elements directly.
- **Real-time Editor Sync**: Visual changes (position, size, new elements) will automatically synchronize with the Sidebar YAML Editor.
- **Unified Save Workflow**: Leveraging the existing "Save & Update" button as the final persistence mechanism for all visual and structural changes.
- **Terminology Alignment**: Consistently use "Domain" instead of "Group" throughout the UI and documentation.

## Capabilities

### New Capabilities
- `interactive-resizing`: Visual resizing of nodes with layout persistence.
- `visual-scaffolding`: Canvas-level tools to add new tables and domains.
- `bidirectional-editor-sync`: Real-time synchronization between visual canvas state and YAML text editor.

### Modified Capabilities
- `visualizer-core`: Update to support new interactive node types and toolbar.
- `sidebar-ui`: Integrate with the new sync logic and rename "Group" to "Domain".

## Impact

- **Frontend (Visualizer)**: Significant updates to `App.tsx`, `useStore.ts`, `DomainNode.tsx`, `TableNode.tsx`, and sidebar components.
- **YAML Schema**: Standardizing on `width` and `height` within the `layout` section for both tables and domains.
- **User Workflow**: Transitions from a "View & Text-Edit" model to an "Interactive Design" model.
