## Context

React Flow manages its own viewport state. We will leverage `useReactFlow` to programmatically adjust the `x` and `y` offsets based on keyboard events.

## Goals / Non-Goals

**Goals:**
- Move the visible canvas area using Arrow keys.
- Ensure smooth transitions.
- Avoid accidental panning while editing YAML or metadata.

**Non-Goals:**
- Changing zoom level with keyboard (keep it simple for now).

## Decisions

### 1. Viewport Math
We'll use a step of **100 pixels** per press.
- `x` + 100 = Move Right (panning left)
- `x` - 100 = Move Left (panning right)
- `y` + 100 = Move Down (panning up)
- `y` - 100 = Move Up (panning down)

### 2. Typing Guard
Before processing arrow keys, we will check:
```javascript
const activeEl = document.activeElement;
const isTyping = activeEl?.tagName === 'INPUT' || 
                 activeEl?.tagName === 'TEXTAREA' || 
                 activeEl?.classList.contains('cm-content'); // CodeMirror
```
If `isTyping` is true, we `return` immediately.

### 3. Selection Priority
React Flow uses arrow keys to nudge selected nodes. We will only enable canvas panning if **no table or edge is currently selected**. This preserves the "Micro-alignment" feature for selected tables.

## Risks / Trade-offs

- **[Risk] Focus Hijacking**: If the user clicks on the sidebar and then tries to pan, the focus might be lost.
  - *Mitigation*: Ensure the listener is on `window`.
