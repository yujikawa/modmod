## Context

Adding a generic type is a low-risk, high-utility change that expands the tool's usage to broader architecture diagrams.

## Goals / Non-Goals

**Goals:**
- Provide a "None of the above" type for tables.
- Use a visually neutral style (Slate/Grey) to avoid distracting from Fact/Dim/Hub nodes.
- Ensure full end-to-end support (Schema -> Node -> Panel).

**Non-Goals:**
- Adding specific subtypes for the `table` type (keep it generic).

## Decisions

### 1. Style Definition
- **Type Key**: `table`
- **Color**: Slate-500 (`#64748b`). This provides good contrast in both Light and Dark modes.
- **Icon**: `📋` (Clipboard) or `📄` (Page). We'll use `📋`.
- **Label**: `TABLE`

### 2. Implementation Points
- **`schema.ts`**: Update the Union Type for `type`.
- **`TableNode.tsx`**: Add `table` entry to the `TYPE_CONFIG` object.
- **`DetailPanel.tsx`**: Insert `<option value="table">Table</option>` at the top of the Quick Access Metadata Selectors.

## Risks / Trade-offs

- **[Risk] Type Ambiguity**: Users might use `table` for everything instead of the more descriptive types.
  - *Mitigation*: Our `rules.md` will still emphasize using `fact`, `dimension`, etc., for analytical projects.
