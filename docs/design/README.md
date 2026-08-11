# TECNOJACK Design Documentation

## Purpose

This folder is the official UX/UI specification for designing TECNOJACK in Figma. It translates the approved domain architecture into workspaces, journeys, screens, components, tokens and interaction contracts.

It does not replace the Platform Blueprint, ADRs, Domain Designs or API contracts. When documents conflict, architectural ownership and accepted ADRs prevail.

## Folder structure

| Document | Purpose |
| --- | --- |
| `01-information-architecture.md` | Product hierarchy, workspaces and module relationships |
| `02-user-flows.md` | End-to-end, module and role journeys |
| `03-screen-inventory.md` | Screen-by-screen product inventory |
| `04-component-inventory.md` | Reusable design component catalog |
| `05-design-tokens.md` | Variables, scales and theme tokens |
| `06-design-system-specification.md` | Rules governing the visual system |
| `07-navigation-map.md` | Navigation for every product surface and viewport |
| `08-dashboard-specification.md` | Role-specific dashboards and widgets |
| `09-forms-specification.md` | Form fields, validation and behavior |
| `10-data-table-specification.md` | Enterprise tables and responsive representations |
| `11-mobile-experience.md` | Field, client and guest mobile experiences |
| `12-empty-loading-error-states.md` | Complete state coverage by module |
| `13-interaction-patterns.md` | Interaction and feedback conventions |
| `14-accessibility.md` | WCAG and inclusive-design requirements |
| `15-figma-handoff.md` | Exact Figma file and library organization |

## Reading order

1. `DESIGN_CONTEXT.md` at repository root.
2. Information Architecture and Navigation Map.
3. User Flows and Screen Inventory.
4. Component Inventory, Tokens and Design System.
5. Dashboards, Forms and Data Tables.
6. Mobile, States, Interactions and Accessibility.
7. Figma Handoff.

## Relationship with architecture documentation

- Platform Blueprint owns domain boundaries and ADRs.
- Domain Designs own internal business rules.
- API Catalog owns the observable route catalog.
- Business Processes owns the operational lifecycle.
- This folder owns the design translation of those decisions.

## Status vocabulary

- `Available`: supported by an observable backend capability.
- `Partial`: some capability or UI exists, but the complete journey does not.
- `Planned`: architecturally defined without a complete executable surface.
- `Future`: extension point, not part of the initial production design.

