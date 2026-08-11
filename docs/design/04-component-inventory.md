# 04 — Component Inventory

## 1. Universal component contract

Every reusable component documents: purpose, variants, states, responsive behavior, accessibility, tokens, composition and usage. Unless overridden below, interactive components support `default`, `hover`, `focus-visible`, `active`, `disabled`, `loading`, `error` and high-contrast behavior.

## 2. Actions

### Button

- **Purpose:** trigger an immediate action.
- **Variants:** primary, secondary, tertiary, ghost, danger, link, icon; sizes compact/default/large.
- **Responsive:** label may shorten only when meaning remains; icon-only requires tooltip and accessible name.
- **Accessibility:** native button, visible focus, disabled semantics, 44 px mobile target.
- **Tokens:** action colors, height, radius, spacing, motion-fast.
- **Rules:** one primary action per region; danger never uses primary brand color.

### Split Button

- **Purpose:** primary action plus closely related alternatives.
- **Variants:** primary/secondary, compact/default.
- **Rules:** default action must be safe and frequent; do not hide unrelated actions.

### Icon Button

- **Purpose:** compact well-known action.
- **Variants:** neutral, brand, danger; square/circular.
- **Accessibility:** mandatory label and tooltip; never use emoji as operational icon.

### Floating/Quick Action

- **Purpose:** role-specific frequent mobile action such as Upload or Log Activity.
- **Responsive:** mobile only unless inside empty state.
- **Rules:** one per screen; does not cover content or bottom navigation.

## 3. Inputs and forms

### Text Field

- Variants: text, email, password, phone, URL, code, search.
- States: empty, filled, focus, error, success, read-only, disabled, loading validation.
- Composition: persistent label, optional marker, input, helper/error, character count.
- Accessibility: label association, `aria-describedby`, error announcement.

### Textarea

- Variants: fixed, auto-grow, character-limited, rich-content future.
- Rules: minimum three visible lines; do not auto-grow beyond viewport without internal limit.

### Number / Currency Input

- Variants: integer, decimal, percentage, currency.
- Rules: store/display unit explicitly; locale formatting occurs after input without moving cursor unpredictably.

### Date, Time and Date Range

- Variants: date, time, datetime, range, month.
- Composition: text entry + picker; timezone label for Events/Sessions.
- Accessibility: keyboard entry always available.

### Select / Dropdown

- Variants: single, multi, grouped, searchable.
- Rules: native select for small static mobile lists; custom listbox for searchable catalogs.

### Autocomplete / Entity Picker

- Purpose: link Person, Organization, Event, Media or other authorized entity.
- States: searching, no result, create-new permission, selected entity.
- Rules: displays code + human label; never asks users to paste UUIDs.

### Checkbox / Radio / Switch

- Checkbox for multiple independent choices; radio for one required choice; switch for immediate reversible setting.
- Feature flags require confirmation when impact is broad.

### Chips / Tags

- Variants: input chip, filter chip, entity chip, removable tag.
- Rules: structured fields never become arbitrary tags; entity chips open source details when allowed.

### File Field

- Variants: image, document, media batch, evidence.
- States: selected, validating, uploading, processing, failed, complete.
- Rules: show file constraints before selection and per-file error after.

### Form Section

- Purpose: group semantically related fields.
- Variants: expanded, collapsible advanced, read-only summary.
- Rules: required fields stay outside collapsed advanced areas.

### Error Summary

- Purpose: list submission errors and focus their fields.
- Accessibility: focus on failed submit and announce count.

## 4. Navigation

### App Shell

- Variants: ERP, Client Portal, Public Experience.
- Composition: sidebar/topbar/content/background activity layer.
- Responsive: sidebar → rail → drawer; Client may use top nav → bottom nav.

### Sidebar

- States: expanded, collapsed, overlay; item default/active/disabled/badge.
- Rules: permission-aware, grouped by workspace, no more than two visible hierarchy levels.

### Topbar

- Components: tenant/context switcher, search, create, notifications, profile.
- Mobile: condensed context title and essential actions only.

### Breadcrumbs

- Purpose: hierarchy and parent navigation.
- Mobile: collapse middle items into menu.
- Accessibility: `nav` with ordered list and current page.

### Tabs

- Variants: primary page tabs, compact sub-tabs.
- Responsive: horizontal scroll, never wrap into multiple ambiguous rows.

### Bottom Navigation

- Five destinations maximum; active indicator and text labels always visible.

### Command Palette

- Groups: navigation, search results, create actions, recent entities.
- Keyboard: `Ctrl/Cmd+K`, arrows, Enter, Escape.
- Security: returns only authorized results/actions.

## 5. Data display

### Card

- Variants: entity, summary, KPI, action, media, warning, client-friendly.
- States: interactive/selected/loading/error.
- Rules: cards are not a replacement for dense comparison tables.

### Badge / Status Badge

- Variants: neutral, info, success, warning, danger, archived.
- Rules: icon/label accompany color; domain state names remain exact internally.

### Avatar / Avatar Group

- Variants: person, organization, system; sizes 24–64.
- Fallback: initials or organization glyph; privacy-safe.

### Statistic / KPI

- Composition: label, current value, unit, trend, comparison period, source freshness.
- Rules: avoid unqualified red/green trends where direction may be contextual.

### Widget

- Variants: KPI, chart, table, alert, shortcut, activity.
- Sizes: 1×1, 2×1, 2×2, full width.
- Rules: configurable widgets retain minimum viable responsive representation.

### Table

- Variants: standard, compact, selectable, hierarchical, ledger.
- Features: sort, filter, pagination, bulk selection, row action, expandable details.
- Responsive: priority columns + disclosure rows/cards; no unreadably compressed columns.

### Timeline / Activity Feed

- Timeline shows derived chronological milestones with source module.
- Activity Feed supports business interactions and author metadata.
- Neither edits historical facts inline.

### Calendar

- Variants: month, week, day, agenda, resource.
- States: conflicts, tentative, confirmed, cancelled.
- Accessibility: equivalent agenda list is mandatory.

### Kanban

- Variants: CRM stages, production queue.
- Drag/drop has keyboard alternative and confirmation when transition has business impact.

### Chart

- Types: line, bar, stacked bar, donut only for few categories, funnel, aging.
- Composition: title, value context, legend, period, freshness, accessible data table.
- Rules: no 3D, no color-only encoding, zero baseline for magnitude bars.

## 6. Overlays and feedback

### Dialog

- Variants: confirmation, destructive, form, receipt.
- Rules: short, blocking, one decision. Long editing belongs in page/drawer.

### Drawer

- Variants: quick create, detail preview, filters, activity.
- Responsive: full-screen sheet on mobile.

### Bottom Sheet

- Mobile actions, filters and short decisions. Supports swipe-close only when no unsaved input.

### Toast / Snackbar

- Variants: success, info, warning, error with optional retry/undo.
- Timing: errors and actionable notifications persist.

### Alert / Banner

- Inline for local context; page banner for system/blocking context.

### Tooltip

- Supplemental only; never the sole source of required information.

### Context Menu

- Contains secondary row/item actions; destructive action separated and labeled.

## 7. Process components

### Stepper / Wizard

- Variants: linear required, non-linear draft.
- Shows completed/current/error steps and review summary.
- Mobile uses current step + progress instead of crowded labels.

### Progress

- Variants: spinner, linear indeterminate, percentage, multi-file aggregate.
- Long processes include background option and safe navigation.

### Checklist

- Purpose: readiness and explicit prerequisites.
- Items link to source screen; computed checks are not manually toggled.

### Filter Bar

- Components: search, quick chips, advanced filter drawer, saved view, clear.
- Active filter count remains visible on mobile.

### Paginator

- Variants: page-based and “load more” for media; cursor semantics hidden from user.

## 8. Media and collaboration

### Uploader

- Variants: dropzone, file picker, camera capture, background sync.
- Per-file states and retry/cancel; checksum/duplicate feedback.

### Media Viewer

- Supports image, video, audio, PDF/document and unavailable fallback.
- Controls respect access/download policy.

### Gallery

- Variants: masonry, justified grid, album grid, selection mode.
- Keyboard navigation, lazy loading, focus-safe lightbox.

### Folder Tree

- Used only for technical/storage or intentional taxonomy views; Event/Gallery users should not need storage paths.

### Comments

- Planned for proofing. Includes author, timestamp, resolved state and asset anchor.

### Activity Feed

- Business activity, not chat. Entries have type, actor, time, content and related entity.

### Notification Item

- Unread/read, severity, source, timestamp, primary action.

## 9. Component count

The official catalog defines **43 reusable component families**. Component sets may contain multiple implementation components but must preserve these semantic contracts.

