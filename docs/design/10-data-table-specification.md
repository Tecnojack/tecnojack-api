# 10 — Data Table Specification

## 1. Shared table behavior

- Server-side pagination and filtering for operational datasets.
- Sort indicator includes direction and accessible label.
- Search is debounced and reflected in URL when the view is shareable.
- Saved views store columns, filters, sort and density.
- Selection persists only across pages when explicitly stated.
- Bulk actions display selected count and permission eligibility.
- Export respects filters, tenant, permissions and redaction.
- Row context menu repeats all icon-only actions accessibly.
- Loading uses row skeletons; error preserves filters; empty distinguishes first use/no results.
- Mobile uses priority fields, summary cards or expandable rows.

## 2. Table catalog

| Table | Columns | Sort/filter/group | Bulk actions / export | Mobile/context |
| --- | --- | --- | --- | --- |
| Opportunities | code, contact, source, stage, value, probability, owner, next action | stage/owner/source/date; group stage/owner | assign, stage where valid, archive, CSV | card; open/log activity |
| CRM Tasks | task, Opportunity, assignee, due, priority, status | due/assignee/status; group date | assign/complete | agenda row |
| Persons | code, name, document, email, phone, status | name/status/document | archive/export | name + contact card |
| Organizations | code, legal name, tax ID, contact, status | name/status | archive/export | organization card |
| Events | code, name, type, next session, lifecycle, phase, date status, owner | date/type/status/owner; group month/phase | assign/archive/export | Event card |
| Sessions | date/time, Event, type, location, status, crew | date/status/type; group day | confirm/export | agenda card |
| Contracts | code, Event, parties, version, status, expiry | status/date/type | archive/export | contract card |
| Contract Parties | party, role, signature status, signed at | role/status | remind future | stacked row |
| Payments | code, payer, Event, total, paid, balance, next due, status | due/status/payer | mark overdue/export | balance card |
| Installments | number, due, amount, paid, balance, status | due/status | reminder/export | installment row |
| Transactions | date, type, amount, method, reference, actor | date/type/method | export only; no destructive bulk | ledger row |
| Invitations | code, Event, slug, visibility, guests, RSVP rate, status | status/Event/date | publish where valid/archive | invitation card |
| Guests | name, contact, companions, RSVP, dietary, delivery status | RSVP/name | send/export/archive | guest card |
| Media Assets | preview, filename, type, Event, size, status, captured/uploaded | status/type/Event/date | tag/archive/add to Gallery | grid default/mobile |
| Processing Queue | asset, operation, progress, attempts, status, updated | status/age | retry/cancel | queue card |
| Galleries | code, Event, title, assets, visibility, selections, status | status/Event/date | publish/archive | gallery card |
| Gallery Assets | preview, filename, album, order, selection/comment | album/order | move/remove/download | visual grid |
| Deliverables | code, Event, type, promised, status, method | due/status/type | assign/archive/export | deliverable card |
| Notifications | code, channel, recipient, template, scheduled, status, attempts | status/channel/date | cancel/retry/archive | message row |
| Users | code, email, Person, status, roles, last access | status/role/date | assign role/suspend | user card |
| Roles | name, users, permissions, updated | name/date | clone | role row |
| Permissions | resource, action, description | resource/action; group resource | no destructive bulk | matrix alternative |
| Sessions | user, device, IP, created, expires, status | user/date/status | revoke | session card |
| API Keys | name, owner, scopes, last used, expiry, status | owner/status/expiry | revoke | key card |
| Settings | category, key, effective value, updated | category/key | export | section list |
| Feature Flags | key, enabled, scope, updated, actor | status/key | no bulk toggle | flag card |
| Catalogs | type, code, label, active, usage | type/status | activate/deactivate/export | catalog row |
| Audit | timestamp, actor, action, resource, result, tenant, request ID | all except payload; group actor/resource | export controlled | audit card |

## 3. Count

**28 enterprise table specifications** are defined.

