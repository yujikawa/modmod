## ADDED Requirements

### Requirement: Entity Type Classification
The system SHALL allow each table to be classified into one of the following types: `fact`, `dimension`, `hub`, `link`, or `satellite`.

#### Scenario: Default Classification (Fact)
- **WHEN** a table's `appearance.type` is set to `fact`
- **THEN** the system SHALL assign the default emoji "📊" and theme color "#f87171" (Red-400).

#### Scenario: Default Classification (Hub)
- **WHEN** a table's `appearance.type` is set to `hub`
- **THEN** the system SHALL assign the default emoji "🌐" and theme color "#fbbf24" (Amber-400).

#### Scenario: Default Classification (Link)
- **WHEN** a table's `appearance.type` is set to `link`
- **THEN** the system SHALL assign the default emoji "🔗" and theme color "#34d399" (Emerald-400).

#### Scenario: Default Classification (Satellite)
- **WHEN** a table's `appearance.type` is set to `satellite`
- **THEN** the system SHALL assign the default emoji "🛰️" and theme color "#a78bfa" (Violet-400).

#### Scenario: Default Classification (Dimension)
- **WHEN** a table's `appearance.type` is set to `dimension`
- **THEN** the system SHALL assign the default emoji "🏷️" and theme color "#60a5fa" (Blue-400).

### Requirement: Appearance Customization
The system SHALL allow users to manually override the icon and color for any table, regardless of its assigned type.

#### Scenario: Icon Override
- **WHEN** a table's `appearance.icon` is set to "⚙️"
- **THEN** the system SHALL display "⚙️" as the entity icon, even if `type` is specified.

#### Scenario: Color Override
- **WHEN** a table's `appearance.color` is set to "#ffffff"
- **THEN** the system SHALL use "#ffffff" for the top border and theme elements.

### Requirement: Visual Feedback in Diagram
The table node in the visualizer diagram SHALL reflect the appearance metadata through specific UI elements.

#### Scenario: Header Rendering
- **WHEN** a table has a type assigned
- **THEN** the header SHALL display the icon, the table name, and a badge with the type name (e.g., [HUB]).

#### Scenario: Top Border Coloring
- **WHEN** a table has a theme color assigned
- **THEN** the node SHALL have a 3px thick top border using that color.
