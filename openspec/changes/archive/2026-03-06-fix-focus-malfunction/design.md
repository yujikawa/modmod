## Context

React Flow's `fitView` is intended for navigation, not for every state update. We need to distinguish between "I just loaded a file" and "I just updated a property".

## Goals / Non-Goals

**Goals:**
- Prevent global `fitView` during normal editing/dragging.
- Ensure `fitView` still happens once when a model is first opened.
- Keep the 400ms delay for edge snapping (this remains necessary for initial render).

## Decisions

### 1. Ref-based Initial Load tracking
We will add a `useRef` in the `Flow` component to track the `lastModelSlug`.
```javascript
const lastLoadedModel = useRef(null);
```

### 2. Guarded Booster
Inside the `Sync Nodes` effect:
```javascript
useEffect(() => {
  if (!schema) return;
  
  // ... existing node sync logic ...

  if (lastLoadedModel.current !== currentModelSlug) {
    // Only fitView on switch/initial load
    const timer = setTimeout(() => {
      fitView({ duration: 400, padding: 0.2 });
      window.dispatchEvent(new Event('resize'));
      setEdgeSyncTrigger(v => v + 1);
    }, 400);
    lastLoadedModel.current = currentModelSlug;
    return () => clearTimeout(timer);
  } else {
    // For incremental updates, just re-sync edges without fitView
    setEdgeSyncTrigger(v => v + 1);
  }
}, [schema, currentModelSlug, ...]);
```

## Risks / Trade-offs

- **[Risk] Missing fitView**: If `currentModelSlug` is null (single file mode), we need to ensure the logic still works.
  - *Mitigation*: Initialize `lastLoadedModel.current` to something that won't match the first load.
