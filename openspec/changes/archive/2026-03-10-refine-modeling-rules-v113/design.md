## Context

`src/templates/rules.md` is the primary reference for AI agents. To improve their output, we must treat the rules more like a "Specification" and less like a "Guideline".

## Goals / Non-Goals

**Goals:**
- Eliminate schema errors (e.g., coordinates in `tables`).
- Standardize visual layout (grid, flow direction).
- Clarify naming and metadata expectations.

**Non-Goals:**
- Changing the `parser.ts` code (this is a documentation/prompting change).
- Adding new YAML keys (only clarifying existing ones).

## Decisions

### 1. Section: YAML Architecture (NEW)
Define the top-level keys explicitly with a "Golden Example" at the start of the file.
- `domains`: Array of domain objects.
- `tables`: Array of table definitions.
- `relationships`: Array of ER connections.
- `annotations`: Array of notes.
- `layout`: Dictionary of coordinates. **MANDATORY PLACEMENT**.

### 2. Section: The 40px Grid Rule
To ensure "Clean Layout", AI agents MUST use coordinates that are multiples of 40.
- Standard Table Width: 320.
- Standard Table Height: 240 (base).
- X-Gap: 400 (320 + 80 spacing).
- Y-Gap: 320 (240 + 80 spacing).

### 3. Section: Directional Logic
- **Lineage Flow**: Upstream (Left) -> Downstream (Right).
- **Relational Flow**: Masters (Top) -> Facts (Bottom).

### 4. Explicit Prohibitions
Add a "CRITICAL: Schema Violation" list:
- NEVER put `x` or `y` in `tables`.
- NEVER put `x` or `y` in `domains`.
- NEVER use floating point numbers for coordinates.

## Risks / Trade-offs

- **[Risk]** AI might still ignore rules if the context window is crowded.
  - **Mitigation**: Move the "YAML Architecture" and "Prohibitions" to the very top of the rules file.
