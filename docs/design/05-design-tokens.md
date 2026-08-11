# 05 — Design Tokens

## 1. Token architecture

Three tiers:

1. **Primitive:** raw scales, never used directly in product frames.
2. **Semantic:** intent such as `surface/default` or `text/danger`.
3. **Component:** optional overrides such as `button/primary/bg`.

Figma variable syntax: `category/role/state`. Code export may map `/` to `-`.

## 2. Brand colors

| Token | Value | Use |
| --- | --- | --- |
| `brand/cyan/500` | `#0097B2` | Primary TECNOJACK identity |
| `brand/cyan/300` | `#39BDD1` | Dark-theme interactive highlight |
| `brand/cyan/700` | `#06697A` | Light-theme hover/strong brand |
| `brand/teal/900` | `#063A45` | Deep brand surface |
| `brand/gold/500` | `#FFB800` | Accent and selected emphasis |
| `brand/gold/600` | `#D89512` | Gold hover on light |

Invitation theme primitives additionally preserve olive `#6E7F67`, dark olive `#3F4F44`, cream `#F3EFE6` and classic gold `#C6A75E`.

## 3. Neutral palette

| Step | Dark family | Light family role |
| --- | --- | --- |
| 0 | `#FFFFFF` | highest contrast surface |
| 50 | `#F7FAFB` | app background light |
| 100 | `#EAF0F2` | subtle surface/border |
| 200 | `#D4DEE2` | border strong |
| 400 | `#83949B` | muted text |
| 600 | `#45575E` | secondary text light |
| 800 | `#17272D` | raised dark surface |
| 900 | `#0B191E` | dark surface |
| 950 | `#041217` | dark app background |

## 4. Semantic colors

| Family | Base | Background dark | Background light |
| --- | --- | --- | --- |
| Success | `#2EAD6B` | `#0D3323` | `#E7F7EF` |
| Warning | `#E7A522` | `#3A2908` | `#FFF4D7` |
| Danger | `#E25555` | `#3A1618` | `#FDEBEC` |
| Info | `#3D9BE9` | `#102D45` | `#E8F3FD` |

Semantic text/background pairs must pass WCAG AA.

## 5. Theme modes

### Operations Dark

- `surface/app`: neutral 950.
- `surface/default`: neutral 900.
- `surface/raised`: neutral 800.
- `text/primary`: neutral 50.
- `text/secondary`: neutral 200 at approved contrast.
- `border/default`: neutral 0 at 12% equivalent.
- `action/primary`: brand cyan 300/500 based on contrast.

### Operations Light

- `surface/app`: neutral 50.
- `surface/default`: white.
- `surface/raised`: white.
- `text/primary`: neutral 950.
- `text/secondary`: neutral 600.
- `border/default`: neutral 200.
- `action/primary`: brand cyan 700.

### Client Brand

Light-forward, generous spacing and studio brand override slots. Legal and payment states retain platform semantic colors.

### Invitation Theme

Variables: primary, secondary, accent, background, surface, text, display font, body font, radius, cover treatment. Theme values cannot override focus, danger or accessibility semantics.

## 6. Typography

### Families

- `font/display`: Montserrat, Segoe UI, system sans-serif.
- `font/body`: Inter, Segoe UI, system sans-serif.
- `font/editorial`: Playfair Display, Georgia, serif; invitation only.
- `font/mono`: ui-monospace for codes, keys and technical metadata.

### Scale

| Token | Size/line | Weight | Use |
| --- | --- | --- | --- |
| `type/display/lg` | 48/52 | 700 | Public hero only |
| `type/display/md` | 40/44 | 700 | Major public heading |
| `type/heading/xl` | 32/38 | 700 | Page title |
| `type/heading/lg` | 24/30 | 700 | Section title |
| `type/heading/md` | 20/26 | 650 | Card/dialog title |
| `type/heading/sm` | 16/22 | 650 | Subsection |
| `type/body/lg` | 16/26 | 400 | Comfortable body |
| `type/body/md` | 14/22 | 400 | Default ERP body |
| `type/body/sm` | 13/18 | 400 | Dense support text |
| `type/label/md` | 14/18 | 600 | Controls |
| `type/label/sm` | 12/16 | 600 | Metadata/badges |
| `type/code` | 13/20 | 500 | Business codes/keys |

Minimum user-facing body size: 14 px desktop and 16 px for long mobile forms.

## 7. Spacing

Base unit 4 px.

`space/0=0`, `1=4`, `2=8`, `3=12`, `4=16`, `5=20`, `6=24`, `8=32`, `10=40`, `12=48`, `16=64`, `20=80`, `24=96`.

Use 8 px as standard internal rhythm; 24–32 px between page regions.

## 8. Sizing

- Control compact: 32 px.
- Control default: 40 px.
- Control comfortable/mobile: 44–48 px.
- Icon: 16, 20, 24, 32.
- Avatar: 24, 32, 40, 48, 64.
- Sidebar: 272 expanded, 72 collapsed.
- Topbar: 64 desktop, 56 mobile.
- Bottom navigation: 64 plus safe area.

## 9. Radius

`radius/none=0`, `xs=4`, `sm=8`, `md=12`, `lg=16`, `xl=20`, `2xl=24`, `full=999`.

ERP controls use sm/md; cards md/lg; marketing/invitation may use xl/2xl.

## 10. Borders and opacity

- Border widths: 1 default, 2 focus/strong, 4 selected accent only.
- `opacity/disabled=0.40`, `muted=0.64`, `scrim=0.68`, `hover=0.08`, `selected=0.12`.
- Disabled text must remain legible; opacity does not replace semantic tokens when contrast fails.

## 11. Elevation and shadows

| Token | Use |
| --- | --- |
| `elevation/0` | flat surfaces |
| `elevation/1` | cards and sticky bars |
| `elevation/2` | dropdowns/drawers |
| `elevation/3` | dialogs/lightbox |
| `elevation/focus` | 0 0 0 3 px semantic focus ring |

Dark mode combines shadow with border; shadow alone is insufficient.

## 12. Grid and containers

- Desktop: 12 columns, 24 px gutter, 32 px margins, max 1440 content.
- Tablet: 8 columns, 20 px gutter, 24 px margins.
- Mobile: 4 columns, 16 px gutter/margins.
- Reading container: 720 px.
- Form container: 840 px.
- Dense table content may use full available width.

## 13. Breakpoints

- `bp/sm`: 480 px.
- `bp/md`: 768 px.
- `bp/lg`: 1024 px.
- `bp/xl`: 1280 px.
- `bp/2xl`: 1536 px.

Design responds to content; breakpoints are coordination tokens, not device labels.

## 14. Motion

- `duration/instant=0`, `fast=120ms`, `normal=200ms`, `slow=320ms`, `expressive=480ms`.
- `ease/standard`: cubic-bezier(0.2, 0, 0, 1).
- `ease/enter`: cubic-bezier(0, 0, 0, 1).
- `ease/exit`: cubic-bezier(0.3, 0, 1, 1).
- Reduced mode removes parallax, continuous animation and nonessential transforms.

## 15. Z-index

`base=0`, `sticky=100`, `header=200`, `dropdown=400`, `drawer=600`, `scrim=700`, `dialog=800`, `toast=900`, `critical=1000`.

## 16. Icons

- Grid: 24 px; optical stroke 1.75–2 px.
- Sizes: 16/20/24.
- Filled icons only for selected state or severity.
- No emojis for navigation/actions.
- Domain icons require one canonical mapping.

## 17. Token count

This specification defines **100+ named primitive and semantic token slots** across color, typography, spacing, sizing, radius, border, opacity, elevation, grid, breakpoint, motion, z-index and icon categories.

