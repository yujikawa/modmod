## Context

Sample data in Modscape is currently stored as an object with `columns` and `rows`.
The user wants to simplify this into a direct list-of-lists (2D array) format to maximize "handiness".
```yaml
sampleData:
  - [val1, val2]
  - [val3, val4]
```

## Goals / Non-Goals

**Goals:**
- Transition `sampleData` to a direct 2D array format.
- Automatically derive headers for the sample data grid from logical columns.
- Support "lenient" indexing:
  - If a row has fewer values than columns, leave missing cells empty.
  - If a row has more values, ignore the extras.

**Non-Goals:**
- Strict validation of data types or column counts (favor flexibility).

## Decisions

### 1. Direct 2D Array format
**Rationale**: It is the simplest possible YAML representation. It feels like "raw data" which is appropriate for quick mocking.
**Alternative**: Object-based `rows`: Rejected by user preference for "list remains as list" and simplicity.

### 2. Driver UI from Logical Columns by Index
**Rationale**: Mapping `table.columns[i]` to `row[i]` is intuitive and requires zero configuration.
**Risk**: Renaming or reordering columns might shift data.
**Mitigation**: User explicitly accepts this risk in favor of "handiness".

### 3. Parser Logic for Normalization
**Rationale**: `visualizer/src/lib/parser.ts` will support:
- `sampleData: { columns: [...], rows: [[...]] }` (Old format) → Migrated to `[[...]]` based on the old column list to preserve existing data.
- `sampleData: [[...]]` (New format) → Used directly.

## Risks / Trade-offs

- **[Risk]**: Columns being reordered in the logical model will shift values in the sample data.
- **[Mitigation]**: If the old format is detected, the parser should attempt to re-align data to the current logical column order once during migration to the new format.
