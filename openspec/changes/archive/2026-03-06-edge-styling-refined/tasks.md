## 1. Helper Logic

- [x] 1.1 Add cardinality parser (e.g., `one-to-many` -> `['1', 'M']`) to `ButtonEdge.tsx`
- [x] 1.2 Implement coordinate calculation for endpoint badges based on source/target positions

## 2. Component Refactor

- [x] 2.1 Update `ButtonEdge.tsx` to render two distinct badges instead of one central label
- [x] 2.2 Implement dynamic opacity switching (30% by default, 100% on selection/hover)
- [x] 2.3 Apply shape-specific styling (`rounded-full` for 1, `rounded-md` for M)
- [x] 2.4 Add `backdrop-blur` and theme-aware colors

## 3. Verification

- [x] 3.1 Verify badges display correctly for `one-to-many`, `many-to-one`, `one-to-one`, and `many-to-many`
- [x] 3.2 Verify badges are semi-transparent when no table/edge is selected
- [x] 3.3 Verify badges become opaque when the edge or connected table is selected
- [x] 3.4 Verify backdrop blur works correctly over the edge line
