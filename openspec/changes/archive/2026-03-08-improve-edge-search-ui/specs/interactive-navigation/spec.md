## ADDED Requirements

### Requirement: Distinct Relationship Path Visualization
The Path Finder results SHALL visualize relationship steps using type-aware styling to distinguish between ER and Lineage relationships.

#### Scenario: Visual Distinction of ER Relationship
- **WHEN** a path result includes an ER relationship step in light mode
- **THEN** the relationship badge SHALL display with an emerald-themed color scheme (bg-emerald-50, text-emerald-700) and a subtle border.

#### Scenario: Visual Distinction of Lineage Relationship
- **WHEN** a path result includes a Lineage relationship step in light mode
- **THEN** the relationship badge SHALL display with a blue-themed color scheme (bg-blue-50, text-blue-700) and a subtle border.

#### Scenario: High Contrast in Light Mode
- **WHEN** the application is in light mode
- **THEN** relationship badges in the Path Finder results MUST have high contrast against the white panel background, using borders to define their boundaries.
