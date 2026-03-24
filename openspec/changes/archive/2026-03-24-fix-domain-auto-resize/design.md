## Context

Domain backgrounds in `CytoscapeCanvas.tsx` are rendered as custom DOM overlays (not Cytoscape compound nodes). Their size is computed each render frame by `renderDomainBackgrounds`, which calls `getDomainBB` to calculate the bounding box of all member table nodes.

Current logic:
```javascript
const finalW = Math.max(bb.w, lw)  // lw = stored layout width
const finalH = Math.max(bb.h, lh)  // lh = stored layout height
```

This was introduced to maintain a "minimum domain size" using the stored `width`/`height` from the YAML layout section. However:
- There is no manual resize feature — `width`/`height` are only set by CLI auto-layout or new-domain defaults
- The stored values are never updated when tables are moved visually
- Result: domains can only grow, never shrink — causing the reported bug

## Goals / Non-Goals

**Goals:**
- Domain background always snaps to the actual bounding box of its member tables
- Moving tables closer together causes the domain to shrink accordingly
- Behavior is symmetric: domain grows when tables spread out, shrinks when they compact

**Non-Goals:**
- Manual domain resize (not a feature, not planned)
- Changing the YAML schema (stored `width`/`height` remain for empty domain fallback)
- Modifying CLI auto-layout behavior

## Decisions

### Remove `Math.max` guard for member-table domains

**Decision:** When a domain has member tables, compute `finalW = bb.w` and `finalH = bb.h` directly, ignoring stored `width`/`height`.

**Rationale:** The stored dimensions have no semantic value at render time — there is no way to set them through the UI, and they are never kept in sync with table moves. Using them as a minimum only creates the shrink-prevention bug. The stored values remain useful only for empty domains (no member tables), where there is no bounding box to derive from.

**Alternative considered:** Update stored `width`/`height` on every table drag end — rejected as more complex and unnecessary, since the values serve no user-facing purpose.

## Risks / Trade-offs

- **Existing YAMLs with hand-set `width`/`height`**: These will now be ignored when rendering domains with members. Visual appearance may change slightly on first load. This is acceptable since the new appearance is more correct.
  → Mitigation: None needed; behavior is strictly more correct.

- **Empty domain size**: Unaffected — stored `width`/`height` are still used when `memberNodes.length === 0`.
