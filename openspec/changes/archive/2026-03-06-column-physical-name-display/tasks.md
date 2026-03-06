## 1. Implementation in TableNode.tsx

- [x] 1.1 Refactor the column mapping logic to calculate `logicalName` and `physicalName`
- [x] 1.2 Update the JSX structure of the column `td` to use a vertical flexbox for the names
- [x] 1.3 Apply typography styles: Bold/Medium for Logical, Small Monospace for Physical
- [x] 1.4 Add conditional rendering to hide Physical name if it's identical to Logical name
- [x] 1.5 Adjust padding and alignment to keep the layout compact

## 2. Verification

- [x] 2.1 Verify that physical names (or IDs) appear below logical names
- [x] 2.2 Verify that rows are NOT doubled when logical and physical names are the same
- [x] 2.3 Verify that connection handles are still correctly aligned with the rows
- [x] 2.4 Verify look and feel in both Dark and Light modes
