## 1. Rules Update

- [x] 1.1 Restructure `src/templates/rules.md`: Add "CRITICAL: YAML Architecture" section at the top.
- [x] 1.2 Update Layout section: Define the 40px Grid Rule and flow directions (Lineage: L->R, ER: T->B).
- [x] 1.3 Add Prohibitions: Explicitly forbid `x`, `y` inside `tables` or `domains`.
- [x] 1.4 Refine Metadata descriptions: Clarify the 3-layer naming convention.
- [x] 1.5 Domain Packing: Add specific arithmetic rules for domain sizing and relative child table positioning.
- [x] 1.6 Modeling Intelligence: Add heuristics for table classification based on data characteristics, grain definition rules, and methodology selection criteria.

## 2. Template Synchronization

- [x] 2.1 Review `src/templates/gemini/`, `claude/`, `codex/` prompts to ensure they point to the updated `rules.md` correctly.

## 3. Verification

- [x] 3.1 Self-audit the new `rules.md`: Ensure no ambiguous language remains.
- [x] 3.2 Verify the YAML example in `rules.md` is 100% schema-compliant.
