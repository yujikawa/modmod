## ADDED Requirements

### Requirement: Agent File Generation
The system SHALL generate the appropriate configuration files for selected AI agents.

#### Scenario: Initializing for Gemini and Claude
- **WHEN** the user selects "Gemini" and "Claude" in the init workflow
- **THEN** the system creates `.gemini/skills/modeler.md` and `.clauderules` in the project root

### Requirement: Rules Reference
All generated agent configuration files SHALL contain a direct instruction to read `.modmod/rules.md` before performing modeling tasks.

#### Scenario: Verifying .clauderules content
- **WHEN** the system generates `.clauderules`
- **THEN** the file includes the text "BEFORE making any suggestions or changes, you MUST read and strictly follow the rules defined in .modmod/rules.md"
