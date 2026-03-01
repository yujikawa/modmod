## 1. Implement Improved Layout Logic in `App.tsx`
- [x] 1.1 Group tables by their assigned domain ID before generating nodes.
- [x] 1.2 Update Domain Node generation to calculate dynamic size based on its child table count.
- [x] 1.3 Update Domain Node generation to apply horizontal offset for initial placement.
- [x] 1.4 Update Table Node generation to use a grid-based (3 columns) local coordinate if it's within a domain.
- [x] 1.5 Ensure top-level tables (not in any domain) are still placed correctly.

## 2. Verification
- [x] 2.1 Test with a YAML containing a domain with 1 table.
- [x] 2.2 Test with a YAML containing a domain with 10 tables (should form a 3x4 grid).
- [x] 2.3 Test with a YAML containing multiple domains (should not overlap).
- [x] 2.4 Test with `samples/enterprise-platform.yaml` to verify complex grid layout.
- [x] 2.5 Test with `samples/mega-enterprise.yaml` (120+ tables) to verify performance and scaling of the auto-layout logic.
- [x] 2.6 Verify that manually resizing a domain (dragging handles) saves `width`/`height` to YAML.
- [x] 2.7 Verify that after manual resizing, refreshing the page keeps the custom size and doesn't reset to auto-calculated size.
- [x] 2.8 Verify that existing `layout` coordinates (x, y) are still respected and not overwritten.
