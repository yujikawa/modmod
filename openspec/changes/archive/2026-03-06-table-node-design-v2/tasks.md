## 1. Component Overhaul

- [x] 1.1 Extract Type Label logic to a reusable helper if needed
- [x] 1.2 Implement the absolute-positioned "Index Tab" in `TableNode.tsx`
- [x] 1.3 Refactor the header `div` to use a vertical layout for tri-layer names
- [x] 1.4 Apply truncation and tooltip (`title`) to the physical name layer

## 2. Styling Fine-tuning

- [x] 2.1 Adjust `z-index` to ensure the tab stays above the node but below selection handles
- [x] 2.2 Ensure theme-aware colors work correctly for both tab and secondary labels

## 3. Verification

- [x] 3.1 Verify tab visibility for all types (Fact, Hub, Table, etc.)
- [x] 3.2 Verify truncation works correctly for extremely long physical names
- [x] 3.3 Verify Dark/Light mode contrast
