## 1. Detail Panel Updates

- [x] 1.1 Add "-" option to the Fact Strategy dropdown in `visualizer/src/components/DetailPanel.tsx`
- [x] 1.2 Add "-" option to the SCD Type dropdown in `visualizer/src/components/DetailPanel.tsx`
- [x] 1.3 Ensure selecting "-" sets the corresponding model property to `undefined`

## 2. Display Logic Cleanup

- [x] 2.1 Update `typeLabel` logic in `visualizer/src/components/TableNode.tsx` to handle undefined strategy/SCD
- [x] 2.2 Update `typeLabel` logic in `visualizer/src/components/DetailPanel.tsx` to handle undefined strategy/SCD

## 3. Verification

- [x] 3.1 Verify that selecting "-" in the UI removes the metadata from the YAML and simplifies the visual badge
- [x] 3.2 Verify that Fact and Dimension tables without metadata display only "FACT" and "DIM"
