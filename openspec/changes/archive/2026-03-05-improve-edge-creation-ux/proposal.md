## Why

Connecting entities is a core part of the data modeling workflow. Currently, users lack visual feedback on where they can connect an edge, leading to a trial-and-error experience. Enhancing the visual cues during the connection process and improving the "snap" logic makes the tool feel more responsive and professional.

## What Changes

- **Connection Highlighting**:
  - Implement visual highlighting for all valid connection handles when a drag operation starts.
  - Dim or hide invalid handles (e.g., handles on the same node) during the connection process.
- **Enhanced Snapping**:
  - Increase the interactive area of handles during a connection drag to make them easier to hit.
- **Smart Feedback**:
  - Show a "Ghost Edge" or a clearer connection line that follows the cursor with smooth interpolation.

## Capabilities

### Modified Capabilities
- `visualizer-core`: Update global connection event handlers and handle styling during active drags.

## Impact

- `visualizer/src/App.tsx`: Implement `onConnectStart` and `onConnectEnd` to manage global highlighting state.
- `visualizer/src/components/TableNode.tsx`: Dynamically apply classes or styles to handles based on connection state.
- `visualizer/src/index.css`: Add CSS animations for pulsing/highlighted handles.
