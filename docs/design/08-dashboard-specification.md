# 08 — Dashboard Specification

## 1. Shared dashboard contract

- Global period and tenant context.
- Freshness timestamp and source on every derived widget.
- Permission-aware widget visibility.
- Widget sizes follow Administration configuration.
- Loading skeleton preserves layout; partial failures remain local.
- Each KPI supports drilldown to its source.
- Mobile order: alerts → next action → schedule → KPIs → secondary analytics.

## 2. Administrator Dashboard

- **KPIs:** active/locked users, active sessions, API keys nearing expiry, failed notifications, service uptime.
- **Widgets:** system health, security alerts, recent sensitive actions, feature flags, configuration changes.
- **Charts:** authentication failures, notification delivery rate.
- **Tables:** recent audit records, degraded providers.
- **Alerts:** DB/storage/provider degraded, policy change, excessive failed login.
- **Shortcuts:** create user/role, revoke session, settings, audit.
- **Filters:** tenant, period, severity.
- **Quick actions:** health check, open incident context.

## 3. Sales Dashboard

- **KPIs:** pipeline value, weighted forecast, win rate, average sales cycle, overdue tasks.
- **Widgets:** opportunities by stage, next actions, expiring quotations, contracts pending signature.
- **Charts:** funnel, forecast by month, source conversion.
- **Table:** highest-value/stale Opportunities.
- **Alerts:** task overdue, quotation expiring, no next action.
- **Shortcuts:** new Opportunity, Person, activity, quotation.
- **Filters:** owner, source, Event type, period.

## 4. Producer Dashboard

- **KPIs:** Events next 7/30 days, unconfirmed sessions, readiness score, overdue deliverables.
- **Widgets:** today/this week, Event phases, blockers, team capacity.
- **Charts:** Events by phase/type, workload.
- **Table:** Events requiring action.
- **Alerts:** contract/payment/brief/location/team blockers.
- **Shortcuts:** Event, session, assignment, invitation.
- **Filters:** owner, date, phase, Event type.

## 5. Photographer Dashboard

- **KPIs:** sessions today/week, upload completion, pending backup.
- **Widgets:** next session, call sheet, route/location, upload queue, assigned tasks.
- **Table/list:** mobile agenda.
- **Alerts:** changed brief/time/location, failed upload.
- **Shortcuts:** navigate, call authorized contact, upload, report issue.
- **Filters:** today/week; personal scope fixed.

## 6. Videographer Dashboard

- Photographer set plus proxy status, total bytes pending, transcoding/processing failures and storage/network warning.
- Quick actions: resume sync, verify checksum, open codec metadata.

## 7. Editor Dashboard

- **KPIs:** assets awaiting review, galleries in draft, deliverables due, average turnaround.
- **Widgets:** creative queue, recent selections, processing failures, deadlines.
- **Charts:** throughput and queue age.
- **Table:** work items by urgency/Event.
- **Alerts:** missing source, client selection changed, failed processing.
- **Shortcuts:** open Media, Gallery Builder, Deliverable.

## 8. Client Dashboard

- **KPIs:** none presented as business analytics; use progress and obligations.
- **Widgets:** next action, Event summary, next session, contract state, balance, Gallery, Deliverable, timeline.
- **Alerts:** signature/payment/action due, changed schedule.
- **Shortcuts:** sign, pay, RSVP, view gallery, download.
- **Filters:** Event switcher only when client has multiple Events.

## 9. Finance Dashboard

- **KPIs:** receivable, overdue, collected this period, upcoming installments, refunds.
- **Widgets:** aging buckets, recent transactions, overdue queue, expected cash.
- **Charts:** collections trend, payment methods, aging.
- **Table:** payments requiring action.
- **Alerts:** duplicate reference, gateway mismatch, overdue high-value account.
- **Shortcuts:** create Payment, register Transaction, export.
- **Filters:** period, status, payer, Event, owner, currency.

## 10. Operations Dashboard

Cross-role studio control combining schedule, production load, Events at risk, upload health and deliveries. It differs from Producer Dashboard by showing studio-wide capacity rather than personal responsibility.

## 11. Widget registry

Official first-wave widgets: 42 (9 KPI, 8 chart, 10 list/table, 8 alert/status, 7 shortcut/activity). DashboardWidget configuration controls order, size, role visibility and enabled state, not domain truth.

