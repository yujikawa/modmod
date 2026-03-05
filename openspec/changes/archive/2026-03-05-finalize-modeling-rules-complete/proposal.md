## Why

A modeling rulebook is only effective if it covers the entire breadth of the supported schema. Currently, Modscape's `rules.md` template is missing critical sections for Sample Data Stories, Relationship Cardinality, Partition Keys, and Visual Aesthetics (Icons/Colors). Without these, AI agents produce dry, technical-only models instead of "Living Documents" that explain the data's story.

## What Changes

- **Sample Data Stories**: Add a section explaining how to use `sampleData: any[][]` to provide real-world examples.
- **Relationship Mastery**: Define explicit choices for `relationships[].type` (`one-to-one`, `one-to-many`, etc.).
- **Technical Precision**: Add `isPartitionKey` to the Logical Modeling rules.
- **Visual Semantics**: Add guidelines for using `appearance.icon` and `appearance.color` to categorize entities visually.
- **Domain Organization**: Define rules for grouping tables into `domains` with consistent colors.

## Capabilities

### Modified Capabilities
- `rules-templating`: Ensure the default template is an exhaustive guide for both human architects and AI agents.

## Impact

- `src/templates/rules.md`: Comprehensive rewrite of sections 2, 5, and 6 to include all missing schema attributes.
