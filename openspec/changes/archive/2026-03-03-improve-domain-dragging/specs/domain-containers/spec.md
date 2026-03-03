## ADDED Requirements

### Requirement: Draggable Container Background
The system SHALL allow users to move domain containers by dragging their background area (any part of the container not occupied by tables or other interactive UI elements).

#### Scenario: Dragging from background
- **WHEN** the user clicks and drags the empty background of a domain container
- **THEN** the entire domain container and its nested tables move together

### Requirement: Interactive Cursor Feedback
The system SHALL provide visual feedback by changing the cursor to a 'grab' icon when hovering over the draggable background of a domain container.

#### Scenario: Hovering over domain background
- **WHEN** the mouse cursor hovers over the background of a domain node
- **THEN** the cursor changes to the 'grab' icon to indicate the area is draggable
