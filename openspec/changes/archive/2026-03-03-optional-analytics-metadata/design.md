## Context

The introduction of analytics metadata (Fact Strategy and SCD Type) initially lacked an "undefined" or "none" state in the UI. This forces users to choose a value even when it's not applicable or decided yet.

## Goals / Non-Goals

**Goals:**
- Add an explicit empty/none option to metadata dropdowns.
- Clean up the visual labels when metadata is not provided.
- Ensure the model (YAML) correctly reflects the absence of these optional fields.

## Decisions

### 1. Placeholder Options in Dropdowns
Add `<option value="">-</option>` to the Strategy and SCD dropdowns in `DetailPanel.tsx`. 
- When selected, the corresponding value in the `appearance` object will be set to `undefined` or removed.

### 2. Guard Clauses in Label Logic
Update the `typeLabel` derivation logic in `TableNode.tsx` and `DetailPanel.tsx` to check for the existence of the metadata value before appending the parenthetical detail (e.g., `(Periodic)`).

### 3. State Update Logic
In `DetailPanel.tsx`, handle the `e.target.value || undefined` pattern to ensure empty strings from dropdowns don't persist into the model as empty strings, but rather as absent keys.

## Risks / Trade-offs

- **[Risk] Retroactive changes** → Existing models that might have accidentally saved a default value (like "transaction") will remain as-is until manually changed to "-", which is intended.
