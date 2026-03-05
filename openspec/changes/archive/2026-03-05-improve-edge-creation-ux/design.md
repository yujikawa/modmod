## Context

React Flow provides hooks like `onConnectStart`, `onConnectEnd`, and `isValidConnection` which we can leverage to create a highly responsive connection experience.

## Goals / Non-Goals

**Goals:**
- Provide clear visual targets during edge creation.
- Reduce the physical effort required to hit a connection point (handle).
- Prevent visual clutter by dimming non-targets.

**Non-Goals:**
- Implementing "Auto-routing" of edges (this is a layout concern for later).

## Decisions

### 1. Connection Lifecycle Tracking
We will use a local state `activeConnection` in the Store or `App.tsx` to track:
- `sourceNodeId`: The ID of the node where the drag started.
- `handleType`: 'source' or 'target'.

### 2. Handle State Styling
Handles will have three states during a drag:
- **`is-connecting`**: Global class applied to all handles when a drag is active. (Opacity reduced to 0.3).
- **`is-valid-target`**: Applied to handles that are NOT on the source node and have the opposite type (or any if we allow any-to-any). (Opacity 1.0, pulsing shadow).
- **`is-hovered-target`**: Applied when the cursor is within the "magnetic" range. (Scale 1.5, Bright Blue/Emerald).

### 3. CSS Animations
Define a `.pulse-handle` animation in `index.css`:
```css
@keyframes pulse-handle {
  0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7); }
  70% { transform: scale(1.2); box-shadow: 0 0 0 10px rgba(59, 130, 246, 0); }
  100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
}
```

### 4. Connection Radius (Snapping)
Set `connectionRadius={30}` on the `ReactFlow` component. This makes the handles "magnetic" from a 30px distance.

## Risks / Trade-offs

- **[Risk] Multiple Handle Confusion**: In complex tables with many handles, pulsing everything might be too busy. 
  - *Mitigation*: Only pulse handles that match the connection type (e.g., if dragging from an ER source, only highlight ER targets).
