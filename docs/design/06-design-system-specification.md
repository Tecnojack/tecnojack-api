# 06 — Design System Specification

## 1. System name and scope

Working name: **TECNOJACK Orbit Design System**. It governs ERP, Client Portal and shared foundations. Invitation themes extend Orbit without overriding security/accessibility primitives.

## 2. Naming conventions

- Components: `Orbit / Component / Variant`.
- Figma properties: `Variant`, `Size`, `State`, `Theme`, `Density`, `Icon`, `Selected`.
- Frames: `NN · Module · Screen · State · Viewport`.
- Layers: semantic nouns (`Header`, `Filters`, `Results`), never `Rectangle 123`.
- Tokens: `category/semantic/state`.

## 3. Component naming

- Foundation primitives: `O/Button`, `O/Input`, `O/Icon`.
- Compositions: `C/EntityHeader`, `C/FilterBar`.
- Patterns: `P/EventWorkspace`, `P/UploadQueue`.
- Domain components: `D/Event/PhaseBadge`, `D/Payment/BalanceSummary`.

Do not promote a domain-specific component into core until at least three valid consumers share semantics.

## 4. Variant naming

- `Variant=Primary|Secondary|Tertiary|Danger`.
- `Size=Compact|Default|Comfortable`.
- `State=Default|Hover|Focus|Active|Disabled|Loading|Error`.
- `Theme=Dark|Light|Client`.
- `Density=Compact|Standard`.

Boolean properties use affirmative names: `Icon=True`, `Selected=True`.

## 5. Auto Layout rules

- All production components use Auto Layout unless free positioning is semantically required.
- Prefer Hug contents for labels/actions and Fill container for responsive fields.
- Use min/max widths matching token containers.
- Avoid fixed height for text-bearing cards.
- Use gap variables only.
- Absolute positioning is restricted to badges, overlays and decorative media.

## 6. Responsive rules

- Design mobile, tablet and desktop behavior for every pattern, not merely scaled frames.
- Preserve primary task and state before secondary metadata.
- Table → priority rows/cards; drawer → full screen; tabs → scroll; sidebar → rail/drawer.
- Never remove an essential action solely because viewport is small.

## 7. Visual hierarchy

1. Current context and blocking state.
2. Primary task/action.
3. Core entity information.
4. Related-module summaries.
5. History/audit/supporting metadata.

Business codes remain secondary to human labels but are searchable and copyable.

## 8. Density

- Comfortable: Client Portal, invitations, onboarding.
- Standard: most ERP screens.
- Compact: tables, ledgers and administration.
- Density changes spacing and control height, never typography below accessibility minimum.

## 9. Iconography

- One outlined SVG family.
- Text label accompanies unfamiliar icons.
- Status icons pair with semantic labels.
- Brand logo never substitutes Home navigation without accessible name.

## 10. Illustration and imagery

- Use authentic audiovisual work, equipment and human moments.
- Avoid generic corporate stock imagery in operational surfaces.
- Empty-state illustrations are restrained, monochrome/duotone and never obscure the CTA.
- Client media respects privacy and authorization.

## 11. Empty states

Composition: title, one-sentence cause, optional guidance, one primary CTA and optional secondary learning link. Distinguish first-use, no-results, no-permission and dependency-empty.

## 12. Error states

State what failed, impact, what remains safe and next action. Never expose stack traces, provider secrets or internal IDs unless in a technical-admin detail.

## 13. Motion principles

- Motion explains relationship, progress or result.
- No decorative continuous motion in ERP.
- Preserve spatial origin for drawers/dialogs.
- Invite/portfolio surfaces may be expressive but respect reduced motion.

## 14. Interaction philosophy

- Explicit transitions over magical automation.
- Visible ownership and provenance.
- Progressive disclosure for complex domains.
- Optimistic UI only for reversible low-risk changes.
- Receipts for high-impact actions.
- Preserve user context after save, retry or authentication.

## 15. Accessibility

- WCAG 2.2 AA target.
- Keyboard parity.
- Focus visible in every theme.
- Touch targets ≥44×44.
- Semantic HTML assumptions documented.
- Charts include data alternative.
- Reduced motion and zoom to 200% supported.

## 16. Governance

- Every component has owner, status and changelog.
- Status: Draft, Review, Ready, Deprecated.
- Breaking changes require migration note.
- Figma and implementation use the same semantic token names.
- Domain/permission changes require validation against Blueprint, not silent design edits.

