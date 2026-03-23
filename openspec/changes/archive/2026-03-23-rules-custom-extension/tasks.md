## 1. Update base rules template

- [x] 1.1 Add "Extension Mechanism" section to `src/templates/rules.md` explaining that agents must read `.modscape/rules.custom.md` if it exists, with custom rules taking priority

## 2. Update agent templates

- [x] 2.1 Update `src/templates/claude/modeling.md` — amend step 1 to also read `rules.custom.md` if present
- [x] 2.2 Update `src/templates/gemini/modscape-modeling/SKILL.md` — amend the `rules.md` read instruction to also mention `rules.custom.md`
- [x] 2.3 Update `src/templates/codex/modscape-modeling/SKILL.md` — amend the `rules.md` read instruction to also mention `rules.custom.md`
