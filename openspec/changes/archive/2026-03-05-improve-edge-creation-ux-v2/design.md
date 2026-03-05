## Context

React Flow needs explicit handle IDs when a node has multiple handles of the same type (`source` or `target`). We have this for Lineage but were missing it for ER.

## Goals / Non-Goals

**Goals:**
- Stop ER lines from connecting to side handles by default.
- ER lines between tables should use Bottom -> Top.
- Support Left -> Right ER connections optionally.

**Non-Goals:**
- Storing per-edge handle positions in YAML (keep schema simple for now, use heuristic-based mapping).

## Decisions

### 1. Unique Handle IDs
In `TableNode.tsx`, we will ensure every handle has a distinct ID that reflects its role:
- `[id]-er-target-top`
- `[id]-er-source-bottom`
- `[id]-lin-target-left`
- `[id]-lin-source-right`

### 2. Heuristic Edge Mapping
In `App.tsx`, when syncing `schema.relationships`, we will:
1.  Check if it's a table-to-table relationship (no column specified).
2.  Assign `sourceHandle = [src]-er-source-bottom`.
3.  Assign `targetHandle = [dst]-er-target-top`.

If we want to support horizontal connections, we will look at the `onConnect` event:
- If `sourceHandle` was a side handle, we can potentially swap it, but since we don't store this in YAML yet, we will stick to **Vertical ER** and **Horizontal Lineage** as the primary clear visual distinction, but *force* the vertical handles for ER to avoid the current "jumping to sides" bug.

### 3. Bidirectional Swap Correction
Update the `onConnect` swap logic to use the new explicit IDs.

## Risks / Trade-offs

- **[Trade-off] Schema Simplicity**: By not storing handle positions in YAML, we might still have cases where a horizontal ER line looks better but defaults to vertical. However, fixing the "jump to side" bug is the priority.
