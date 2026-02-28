## 1. Schema and Type Definitions

- [x] 1.1 Update `Table` interface in `visualizer/src/types/schema.ts` to include the `appearance` field with `type`, `icon`, and `color`.
- [x] 1.2 Update the `parseYAML` function in `visualizer/src/lib/parser.ts` to correctly handle and map the `appearance` object for each table during normalization.

## 2. TableNode Rendering Enhancements

- [x] 2.1 Define a `TYPE_CONFIG` mapping that associates each entity type (`fact`, `dimension`, `hub`, `link`, `satellite`) with its default emoji and Tailwind-compatible theme color.
- [x] 2.2 Update the `TableNode` component to render a 3px thick top-border using the resolved theme color (type-based or override).
- [x] 2.3 Enhance the `TableNode` header to display the resolved emoji icon and a subtle type badge (e.g., `[HUB]`) with a low-opacity background.

## 3. Sample Data and Validation

- [x] 3.1 Update `visualizer/sample-model.yaml` to demonstrate the new appearance feature across different table types and manual overrides.
- [x] 3.2 Verify the visual results in the dev environment, ensuring the colors and icons align correctly with the dark theme.
- [x] 3.3 Confirm that tables without `appearance` data fall back gracefully to the current default Slate-800 style.
