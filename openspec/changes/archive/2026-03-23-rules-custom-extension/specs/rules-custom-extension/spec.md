## ADDED Requirements

### Requirement: rules.custom.md is read as a project-specific rule extension
When `.modscape/rules.custom.md` exists in the project, AI agents SHALL read it in addition to `.modscape/rules.md`. Rules defined in `rules.custom.md` take priority over the base rules when they conflict.

#### Scenario: Custom file exists
- **WHEN** an AI agent starts a modeling session and `.modscape/rules.custom.md` exists
- **THEN** the agent SHALL read both `rules.md` and `rules.custom.md` before making any changes

#### Scenario: Custom file does not exist
- **WHEN** an AI agent starts a modeling session and `.modscape/rules.custom.md` does not exist
- **THEN** the agent SHALL proceed using only `rules.md` with no error

#### Scenario: Conflict between base and custom rules
- **WHEN** `rules.custom.md` defines a rule that contradicts a rule in `rules.md`
- **THEN** the agent SHALL apply the rule from `rules.custom.md`

### Requirement: Base rules.md documents the extension mechanism
The template file `src/templates/rules.md` (and therefore any `.modscape/rules.md` generated from it) SHALL contain a section explaining the `rules.custom.md` extension point, so agents reading only the base file can self-discover the convention.

#### Scenario: Agent reads rules.md and finds extension section
- **WHEN** an agent reads `.modscape/rules.md`
- **THEN** it SHALL find a section that instructs it to also check for `.modscape/rules.custom.md`

### Requirement: All agent templates instruct reading rules.custom.md
All three agent scaffold templates (Claude, Gemini, Codex) SHALL instruct agents to read `.modscape/rules.custom.md` when it exists, in addition to the existing instruction to read `rules.md`.

#### Scenario: Claude modeling template
- **WHEN** an agent uses the Claude modeling template
- **THEN** the instruction SHALL explicitly mention `rules.custom.md` as a conditional read

#### Scenario: Gemini modeling SKILL template
- **WHEN** an agent uses the Gemini SKILL template
- **THEN** the instruction SHALL explicitly mention `rules.custom.md` as a conditional read

#### Scenario: Codex modeling SKILL template
- **WHEN** an agent uses the Codex SKILL template
- **THEN** the instruction SHALL explicitly mention `rules.custom.md` as a conditional read
