## Context

The current visualizer renders all table nodes using a uniform Slate-800 style. To better support data modeling methodologies (Data Vault, Star Schema), the UI needs to visually distinguish between different entity types (Hub, Link, Sat, Fact, Dim). This will help users quickly identify core business keys, relationships, and history tables.

## Goals / Non-Goals

**Goals:**
- Extend the `Table` schema to include `appearance` metadata.
- Implement a color-coded and icon-based header for table nodes.
- Ensure the design remains readable and cohesive in the existing dark theme.
- Support both automatic (type-based) and manual (icon/color-based) styling.

**Non-Goals:**
- Dynamic theme switching (light/dark) beyond the existing dark mode.
- Automatic inference of table types from naming conventions (e.g., `_H` for Hub) - types must be explicit in YAML for now.
- Changes to the relationship (edge) styling based on table types.

## Decisions

- **Metadata Placement**: The `appearance` block will be at the root of the `Table` object in `schema.ts`. This reflects its role as visual metadata rather than conceptual or physical schema data.
- **Color Selection**: Use Tailwind's `400` series colors for the dark theme (Red-400, Blue-400, Amber-400, Emerald-400, Violet-400). These provide excellent contrast against Slate-900/800 without causing visual fatigue.
- **Icon Implementation**: Standard Unicode emojis will be used as default icons. This avoids adding new icon library dependencies and allows users to easily override them with any emoji string in the YAML.
- **Visual Structure**: 
  - Add a 3px top border using the theme color.
  - Display the emoji icon to the left of the table name.
  - Display a type badge (e.g., `[HUB]`) in the top-right of the header with a low-opacity background of the theme color.

## Risks / Trade-offs

- **[Risk] Emoji Fragmenting** → Different operating systems render emojis differently.
  - **Mitigation**: Use widely supported standard emojis from the Unicode set.
- **[Risk] Visual Noise** → Adding too many colors and icons might clutter the diagram.
  - **Mitigation**: Keep the colors limited to a specific palette and only apply them to small UI accents (lines, icons, badges). The bulk of the node remains neutral Slate.
