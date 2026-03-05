## Context

The `schema.domains` array contains lists of table IDs. We need to invert this relationship visually in the sidebar while handling the "Search" functionality gracefully.

## Goals / Non-Goals

**Goals:**
- Display a hierarchical list: Domain -> Tables.
- Allow focusing on a whole domain.
- Keep the search functional (filtering tables within their domain groups).

**Non-Goals:**
- Allowing drag-and-drop reordering in the sidebar (reserved for future).

## Decisions

### 1. Data Mapping Logic
In `EntitiesTab.tsx`, we will calculate:
- `domainMap`: A map of `domainId -> Table[]`.
- `unassignedTables`: Tables that do not appear in any `domain.tables` list.

### 2. UI Structure
Each group will be a section with:
- **Header**: Domain Name + Table Count + Color Indicator.
- **Body**: List of tables belonging to that domain.

### 3. Search Behavior
When a search term is entered:
- Hide empty domains (domains where no tables match the search).
- If a domain name matches the search, show all its tables (or keep filtering them). *Decision: We will filter tables globally and show the matching ones under their respective parent domains.*

### 4. Expansion State
Initially, all domains will be expanded. We will use a simple local state `collapsedDomains: Set<string>` to track toggles.

## Risks / Trade-offs

- **[Risk] Search Performance**: Calculating groups on every keystroke.
  - *Mitigation*: The current dataset size (dozens of tables) is small enough for standard React rendering. For hundreds of tables, we can memoize the grouping logic.
