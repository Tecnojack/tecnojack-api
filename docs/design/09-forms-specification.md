# 09 — Forms Specification

## 1. Shared behavior

- Persistent labels; placeholder is example, never label.
- Required indicated textually and in semantics.
- Validate on blur and submit; do not show errors before interaction.
- Error messages state correction: “La fecha final debe ser posterior a la inicial.”
- Enter submits only short single-step forms; multiline uses Enter normally.
- Escape closes overlays only after unsaved-change handling.
- Wizard drafts may autosave; high-impact transitions never autosave.
- Attachments show constraints, preview, progress, retry and removal.

## 2. Form catalog

| Form | Sections and fields | Required | Validation / messages | Wizard, autosave, permissions |
| --- | --- | --- | --- | --- |
| Login | email, password, remember device | email/password | valid email; neutral auth failure | no autosave; public |
| Register | email, password, confirm, terms, tenant invite | policy fields | password rules/match/invite | 2 steps; public/invited |
| Verify Email | OTP/token | OTP | expired/invalid | resend timer |
| Reset Password | password/confirm | both | strength/match/token | no autosave |
| Person | name, document, contact points, address, status | name; domain requirements | duplicate document/contact; country-aware | sectioned; People write |
| Organization | legal name, tax document, contacts, address | legal name | duplicate tax ID | sectioned; People write |
| Opportunity | person/org, source, owner, stage, value, probability, expected date, notes | contact/source | probability 0–100; valid money | draft autosave optional; CRM write |
| Quotation | header, services/items, discounts, taxes, validity, terms | Opportunity/items/validity | nonnegative totals, validity future | multi-step; quotation write |
| Activity | type, timestamp, outcome, note, next action | type/time | future/past by type | drawer; CRM write |
| CRM Task | title, assignee, due, priority, relation | title/due | due policy | quick drawer |
| Event | EventType, name, owner, timezone, participants, dates, brief, review | type/name/timezone | code uniqueness, valid dates | 6-step wizard; Events create |
| Event Update | identity, priority, brief, nontransition fields | context | protected lifecycle fields excluded | sectioned; Events update |
| Session | type, status, start/end, timezone, location, instructions | type/range/timezone | end after start; conflict warning | dialog/page; Events sessions |
| Location | name, address, city/country, coordinates, instructions | name/address | coordinate/address validity | map optional |
| Contract | Event, template type, title, dates, parties, clauses, snapshot, review | Event/title/party/version | date order, party uniqueness | wizard; Contract create |
| Contract Version | version label, clauses/content, change note | content/note | immutable after publish | explicit save |
| Contract Party | Person/Organization, role, order | identity/role | no duplicate role-person | modal |
| Contract Signing | acceptances, identity confirmation, signature | required acceptances/signature | token/expiry/signature | no autosave; party scope |
| Payment | Event, Contract, payer, currency, total, plan, dates | Event/payer/currency/total | >0, currency consistent | wizard; Finance create |
| Installment | label/number, due, amount | due/amount | sum against obligation | inline/modal |
| Transaction | type, amount, method, date, reference, evidence | type/amount/method/date | idempotent reference; amount policy | no autosave; Finance record |
| Invitation | Event, slug, visibility, password, expiry, theme/music | Event/slug/visibility | slug unique, expiry future | wizard; Invitation edit |
| Invitation Sections | ordered complete section set and content | type/order | supported types; whole-array save | canvas autosave versioned |
| Invitation Schedule | ordered entries, time, location, description | time/title | chronological/valid | whole-array save |
| Guest | name/contact, max companions, access metadata | name | duplicate/limit | modal/import |
| RSVP | attend/decline, companions, dietary, note | response | published/unexpired, limit | mobile single task |
| Media Registration | files, Event/session context, type, metadata | files | MIME/size/checksum/quota | background upload |
| Asset Metadata | name/type/dimensions/duration/custom metadata | allowed mutable fields | type-specific | explicit save |
| Gallery | Event, title, status-safe settings, visibility, password, capabilities | Event/title/visibility | password if protected | sectioned |
| Gallery Album | title, order, description | title | unique within Gallery | inline/dialog |
| Deliverable | Event, type, title, promised date, method, notes | Event/type/title | date/method | sectioned |
| Deliverable Item | label, type, source reference, quantity/status | label/type | valid Media/Gallery ref | inline/dialog |
| Notification | channel, template/content, recipients, variables, schedule, priority | channel/recipient/content | valid channel address/variables | composer; send permission |
| Notification Template | name, channel, subject/body, variables, active | name/channel/body | variable schema | split preview |
| User | email, Person link, status, roles, claims | email/status | unique/tenant-safe | IAM admin |
| Role | name, description, permission IDs | name | unique/protected role | IAM admin |
| Permission | resource, action, description | resource/action | atomic uniqueness; immutable | Security admin |
| Policy | name, effect, resource/action, conditions, priority | name/effect/rules | valid rule tree/self-lockout test | advanced builder |
| API Key | name, scopes, expiration | name/scopes | allowed scope/future expiry | secret receipt |
| Setting | category, key, typed value | key/value | protected/type schema | Admin |
| Feature Flag | key, description, enabled, targeting future | key | unique/dependency impact | confirm toggle |
| Catalog Entry | type, code, label, metadata, active | type/code/label | unique/in-use | Admin |
| Dashboard Widget | type, title, size, position, config, role visibility | type/size | non-overlap/supported config | drag layout |

## 3. Form count

**39 form families** are specified. Generated variants do not create independent business forms unless validation or permissions differ.

