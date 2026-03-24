## ADDED Requirements

### Requirement: Domain background resizes to fit member tables
The domain background SHALL always be sized to exactly contain its member tables plus padding. The stored `width`/`height` values in the layout section SHALL NOT be used to constrain the minimum size when member tables are present.

#### Scenario: Tables moved closer together horizontally
- **WHEN** a user drags a table to a position that reduces the horizontal span of the domain's member tables
- **THEN** the domain background width SHALL shrink to match the new bounding box of the member tables

#### Scenario: Tables moved closer together vertically
- **WHEN** a user drags a table to a position that reduces the vertical span of the domain's member tables
- **THEN** the domain background height SHALL shrink to match the new bounding box of the member tables

#### Scenario: Tables moved further apart
- **WHEN** a user drags a table to a position that increases the span of the domain's member tables
- **THEN** the domain background SHALL grow to contain all member tables

#### Scenario: Empty domain fallback
- **WHEN** a domain has no member tables
- **THEN** the domain background SHALL use the stored `width`/`height` from the layout section as its size
