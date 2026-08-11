# 03 — Screen Inventory

## 1. Reading convention

Every row is an individual screen specification.

- **Viewport:** `D/T/M` means fully specified for desktop, tablet and mobile. `M-first` means mobile is primary.
- **States:** every screen includes loading, empty/no-results where applicable, permission denial, recoverable error and success feedback. The row highlights its distinctive state.
- **DTO:** names refer to backend public DTO families; composition screens use view models/BFF responses.
- **Priority:** P0 foundation, P1 first operational release, P2 next vertical, P3 advanced/future.

## 2. Global and identity screens

| Screen | Purpose and description | Roles / permission | Viewport | Components | API / DTO | States and actions | Entry / priority |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Login | Authenticate staff/client account and preserve deep link | Public | D/T/M | Auth card, email, password, alert | `POST /auth/login`; Login request/response | invalid, locked, unverified, loading; login/reset | Direct/deep link · P0 |
| Register | Create a user where tenant policy permits | Public/invited | D/T/M | Step form, password rules | `POST /auth/register`; auth request | duplicate email, policy closed; submit | Invite/public · P1 |
| Verify Email | Confirm OTP/email token | Unverified user | D/T/M | OTP input, resend timer | `POST /auth/:id/verify-email` | expired/invalid/success; verify/resend | Email link · P1 |
| Forgot Password | Request reset without revealing account existence | Public | D/T/M | Email form, neutral receipt | auth future/request | always-neutral success | Login · P1 |
| Reset Password | Set new credential | Token holder | D/T/M | Password/confirm, rules | `POST /auth/:id/reset-password` | expired token, mismatch; reset | Email link · P1 |
| Session Expired | Explain expiration and preserve work destination | Authenticated expired | D/T/M | Status panel | `POST /auth/refresh` | refresh/relogin | Guard · P0 |
| Forbidden | Explain missing permission/scope | Authenticated | D/T/M | 403 state, safe back link | none | request access/back | Guard · P0 |
| Not Found | Safe 404 without cross-tenant leakage | Any | D/T/M | 404 state | none | search/back | Router · P0 |
| Profile | View account/person link and preferences | Own user | D/T/M | Avatar, form, tabs | Identity/People facade | save/error | User menu · P1 |
| Security Center | Password, sessions and API security summary | Own user | D/T/M | Security cards, session list | `/access/users/:id/sessions` | revoke/relogin | Profile · P1 |
| Global Search | Search entities user may access | Staff | D/T/M | Command palette, grouped results | future projection | no results/error; open/create | Topbar/shortcut · P1 |
| Notification Center | Read actionable notifications | All authenticated | D/T/M | Feed, filters, badges | notifications/client view | empty/offline; open/mark read | Topbar · P1 |

## 3. Dashboard screens

| Screen | Purpose and description | Roles / permission | Viewport | Components | API / DTO | States and actions | Entry / priority |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Executive Dashboard | Business health across sales, cash and operations | Owner/Admin; analytics read | D/T/M | KPI, charts, risks, activity | widget/projection DTOs | no data/stale data; drilldown | Home · P1 |
| Sales Dashboard | Pipeline, forecast and next actions | Sales | D/T/M | Pipeline chart, task list, KPIs | CRM queries | empty pipeline; create lead | Home · P1 |
| Operations Dashboard | Events, sessions and readiness blockers | Producer | D/T/M | Calendar, status matrix, alerts | Events projections | no assignments; open Event | Home · P1 |
| Photographer Dashboard | Today's assignments and upload status | Photographer | M-first | Today card, route, upload queue | Event/Media views | offline/no work; open/upload | Home · P1 |
| Videographer Dashboard | Assignments, large-file sync and processing | Videographer | M-first | Session cards, sync queue | Event/Media views | storage/network warning | Home · P2 |
| Editor Dashboard | Creative queue, review and delivery deadlines | Editor | D/T/M | Work queue, progress, deadlines | Media/Gallery/Deliverable views | empty queue; claim/open | Home · P2 |
| Finance Dashboard | Receivables, overdue and recent transactions | Finance | D/T/M | KPI, aging chart, table | Payment queries | no overdue/provider delay | Home/Finance · P2 |
| Client Dashboard | Next action and Event progress | Client; own Event | D/T/M | Next-action hero, timeline, cards | client dashboard response | no published content | Portal home · P1 |
| Admin Dashboard | Security/configuration/health | Admin | D/T/M | Configurable widgets, alerts | admin widgets/health | degraded service; configure | Admin home · P2 |

## 4. CRM and People screens

| Screen | Purpose and description | Roles / permission | Viewport | Components | API / DTO | States and actions | Entry / priority |
| --- | --- | --- | --- | --- | --- | --- | --- |
| CRM Pipeline | Kanban opportunities by stage | Sales/Admin; opportunities read | D/T/M | Kanban, filters, totals | `GET /crm/opportunities`; query/response DTO | empty stage, stale move; drag/change | Commercial · P1 |
| Opportunity List | Dense searchable alternative to pipeline | Sales/Admin | D/T/M | Data table, saved views | same | no results; create/export | CRM · P1 |
| Opportunity Detail | Commercial source of truth, activity and quote context | Sales/owner | D/T/M | Header, tabs, activity feed, task rail | `GET /crm/opportunities/:identifier` | archived/read-only; edit/stage/convert | List/search · P1 |
| Opportunity Form | Create/update lead or opportunity | Sales; write | D/T/M | Sectioned form, person picker | POST/PATCH; CreateOpportunity DTO | duplicate person, validation; save | Create/detail · P1 |
| Stage Change Dialog | Explicit transition with reason/next action | Sales; transition | D/T/M | Dialog, stage select | `POST /:id/stage`; PipelineStage DTO | invalid transition; confirm | Detail/kanban · P1 |
| Conversion Dialog | Win/loss outcome and downstream handoff | Sales manager | D/T/M | Decision dialog | `POST /:id/convert` | missing accepted quote/reason | Detail · P1 |
| Quotation Editor | Build commercial offer and validity | Sales; quotations write | D/T/M | Line editor, totals, preview | `POST /:id/quotations`; CreateQuotation DTO | calculation/expired; save/send | Opportunity · P1 |
| Quotation Preview | Read/approve/reject immutable proposal | Sales/client scoped | D/T/M | Document preview, status | approve/reject endpoints | expired/rejected; approve/reject | Opportunity/link · P1 |
| CRM Activity Drawer | Log call, message, meeting or note | Sales | D/T/M | Drawer, type/date/outcome | activities; LogActivity DTO | offline/save error | Detail/quick create · P1 |
| CRM Task Drawer | Create/complete next action | Sales | D/T/M | Drawer, assignee/due | tasks endpoints | overdue/complete error | Detail/dashboard · P1 |
| Person List | Search canonical individuals | Authorized staff | D/T/M | Data table, filters | `GET /persons`; QueryPersons DTO | empty/duplicate candidate | People · P1 |
| Person Detail | Identity, contact, relationships and audit | Authorized staff | D/T/M | Summary, tabs, entity links | `GET /persons/:identifier`; PersonResponse | archived/PII restricted | List/search · P1 |
| Person Form | Create/update international identity | People write | D/T/M | Name/document/contact/address groups | POST/PUT; Create/UpdatePerson DTO | duplicate document/contact | Create/detail · P1 |
| Organization List | Search canonical organizations | Authorized staff | D/T/M | Data table | `GET /organizations`; QueryOrganizations DTO | empty/no results | People · P1 |
| Organization Detail | Legal/contact identity and relations | Authorized staff | D/T/M | Summary/tabs | GET identifier; OrganizationResponse | archived/restricted | List/search · P1 |
| Organization Form | Create/update organization | People write | D/T/M | Legal/tax/contact/address groups | POST/PUT DTO | duplicate tax ID | Create/detail · P1 |
| Archive Browser | Review/restore archived People records | Admin/People restore | D/T/M | Table, archive badge | list include archived, restore | empty archive | People filters · P2 |

## 5. Events and production screens

| Screen | Purpose and description | Roles / permission | Viewport | Components | API / DTO | States and actions | Entry / priority |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Event List | Search and prioritize all Events | Operations/Sales scoped | D/T/M | Data table, status filters | `GET /events`; QueryEvents DTO | no Events/no results | Operations · P1 |
| Event Calendar | Sessions/Events by day/week/month | Operations/crew | D/T/M | Calendar, filters | Events list projection | conflicts/no schedule | Operations · P1 |
| Event Creation Wizard | Create valid Event without giant form | Events create | D/T/M | Stepper, review | `POST /events`; CreateEvent DTO | invalid type/timezone/duplicate | Global create · P1 |
| Event Overview | Central composed workspace and blockers | Event members | D/T/M | Summary, readiness, related cards | `GET /events/:identifier`; EventResponse | archived/cancelled | List/calendar/search · P1 |
| Event Brief | Read/edit creative and logistical brief | Producer; Event update | D/T/M | Structured editor | `PATCH /events/:id`; UpdateEvent DTO | incomplete/read-only | Event tab · P1 |
| Event Sessions | List and timeline of temporal stages | Event members | D/T/M | Timeline/table | Event response | no sessions | Event tab · P1 |
| Session Form | Add/reschedule session with timezone/location | Producer | D/T/M | Date range, timezone, location picker | `POST /events/:id/sessions`; AddEventSession DTO | invalid range/conflict | Sessions · P1 |
| Session Detail | Field-ready brief, contacts and location | Crew scoped | M-first | Call sheet, map, checklist | Event response/projection | offline/missing location | Calendar/Today · P1 |
| Event Participants | Contextual roles linked to People | Producer | D/T/M | Participant table/picker | future facade/capability | duplicate role/missing person | Event tab · P2 |
| Locations Catalog | Reusable locations | Operations | D/T/M | Table/map | planned Events capability | empty/map unavailable | Operations/settings · P2 |
| Location Form | Address, coordinates and instructions | Operations write | D/T/M | Address/map form | conceptual Location DTO | geocode failure | Catalog/session · P2 |
| Event Status History | Immutable lifecycle/phase history | Event readers | D/T/M | Timeline, actor metadata | Event history projection | empty legacy record | Event tab · P1 |
| Cancel Event Dialog | Explain impact and capture reason | Event transition | D/T/M | Danger dialog | `POST /events/:id/cancel` | policy conflict; cancel | Event actions · P1 |
| Complete Event Dialog | Validate readiness and complete | Event transition | D/T/M | Checklist dialog | `POST /events/:id/complete` | blockers; open source | Event actions · P1 |
| Production Board | Plan work across Events | Producer/editor | D/T/M | Kanban, workload | planned Production | no plan/unassigned | Operations · P2 |
| Team Assignment | Assign crew and roles | Producer | D/T/M | Schedule, people picker | planned Production | availability conflict | Production/Event · P2 |
| Call Sheet | Printable/mobile daily execution view | Crew | M-first | Timeline, contacts, map | Production/Event projection | stale/offline | Today/session · P2 |

## 6. Contracts and payments screens

| Screen | Purpose and description | Roles / permission | Viewport | Components | API / DTO | States and actions | Entry / priority |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Contract List | Find agreements by Event/status/party | Sales/Admin/Finance | D/T/M | Data table | `GET /contracts`; QueryContracts DTO | no contracts | Commercial/Finance · P1 |
| Contract Editor | Create agreement and current draft | Sales/Legal | D/T/M | Wizard/editor | POST/PATCH; Create/UpdateContract DTO | missing Event/party | Create/detail · P1 |
| Contract Detail | Status, parties, versions, signatures and audit | Authorized parties/staff | D/T/M | Document header/tabs | GET identifier; ContractResponse | archived/expired | List/Event · P1 |
| Contract Versions | Review immutable snapshots | Legal/Sales | D/T/M | Version list | `POST /:id/versions`; AddVersion DTO | no comparison | Contract tab · P1 |
| Version Comparison | Compare clauses/content | Legal/Sales | D/T/M | Diff viewer | Contract response | incompatible/missing PDF | Versions · P2 |
| Contract Parties | Add/view roles and signature status | Legal/Sales | D/T/M | Party table | `POST /:id/parties`; AddParty DTO | duplicate/missing People | Contract tab · P1 |
| Publish Contract Dialog | Freeze/publish with impact summary | Contracts publish | D/T/M | Confirmation/checklist | `POST /:id/publish` | incomplete draft | Contract action · P1 |
| Public Signing | Token-scoped review, acceptance and signature | Contract party | D/T/M | Document, policy modal, signature pad | execute/signing capability | expired token, invalid signature | Link/Portal · P1 |
| Contract PDF Viewer | Read/download document rendition | Authorized | D/T/M | PDF viewer | rendering/download | unavailable/generating | Contract · P1 |
| Payment Portfolio | Finance-level obligations and aging | Finance | D/T/M | KPI/table/chart | `GET /payments`; QueryPayments DTO | no balances | Finance · P2 |
| Payment Detail | Statement, installments and transactions | Finance/client scoped | D/T/M | Balance hero, tabs, ledger | GET identifier; PaymentResponse | archived/refunded | List/Event/Portal · P2 |
| Payment Form | Create obligation and plan | Finance | D/T/M | Sectioned form/plan builder | `POST /payments`; CreatePayment DTO | amount/currency invalid | Create/Contract · P2 |
| Installment Plan | Add and inspect schedule | Finance/client read | D/T/M | Schedule table | `POST /:id/installments`; AddInstallment DTO | totals mismatch | Payment tab · P2 |
| Transaction Dialog | Record neutral financial movement | Finance | D/T/M | Amount/method/reference/evidence | `POST /:id/transactions`; RegisterTransaction DTO | duplicate/exceeds policy | Payment · P2 |
| Overdue Queue | Prioritize overdue payments | Finance/Sales limited | D/T/M | Aging table | payments query/overdue | empty success state | Finance · P2 |
| Client Payment View | Explain due amount and payment options | Client own scope | D/T/M | Balance/card/CTA | future Portal Payment facade | gateway unavailable | Portal · P2 |

## 7. Invitations screens

| Screen | Purpose and description | Roles / permission | Viewport | Components | API / DTO | States and actions | Entry / priority |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Invitation List | Manage Event invitations | Producer/client host | D/T/M | Table/cards | `GET /invitations`; QueryInvitations DTO | empty; create/duplicate | Operations/Portal · P2 |
| Invitation Setup | Create base invitation | Host/editor | D/T/M | Wizard | POST; CreateInvitation DTO | slug/Event invalid | Create/Event · P2 |
| Invitation Builder | Configure theme and complete section arrays | Host/editor | D/T/M | Canvas, property panel, layers | PATCH/sections; Layout DTO | unsaved/conflict | Invitation · P2 |
| Invitation Preview | Exact desktop/mobile preview | Host/editor | D/T/M | Device frames | GET invitation response | unpublished banner | Builder · P2 |
| Schedule Editor | Order itinerary entries | Host/editor | D/T/M | Timeline drag/drop | schedules endpoint | invalid order/time | Builder · P2 |
| Guest List | Manage recipients and companion limits | Host | D/T/M | Data table/import | guests endpoint; Guest DTO | duplicate/import errors | Invitation · P2 |
| RSVP Dashboard | Attendance totals and responses | Host/producer | D/T/M | KPI, charts, guest table | invitation response | no responses | Invitation · P2 |
| Publish Dialog | Validate visibility, expiry and content | Host publish | D/T/M | Checklist dialog | publish/unpublish | missing sections/expired | Builder · P2 |
| Invitation Access Gate | Password or guest identity | Guest | M-first | Gate form | invitation lookup | invalid/locked/expired | Invitation URL · P1 |
| Guest Invitation | Branded story, details, gallery and schedule | Guest | M-first | Themed sections, audio | GET invitation | content loading/offline | Gate · P1 |
| RSVP Form | Confirm/decline, companions and preferences | Guest scoped | M-first | Choice form | RSVP endpoint | draft/expired/limit | Guest invitation · P1 |
| RSVP Confirmation | Receipt and editable-until policy | Guest | M-first | Success state | invitation response | notification pending | RSVP · P1 |

## 8. Media, gallery and deliverables screens

| Screen | Purpose and description | Roles / permission | Viewport | Components | API / DTO | States and actions | Entry / priority |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Media Library | Search assets across authorized context | Creative | D/T/M | Grid/table, filters, preview | `GET /media-assets`; QueryMedia DTO | no assets/no results | Creative/Event · P2 |
| Upload Manager | Batch upload with background progress | Creative | M-first | Dropzone, queue, progress | Storage + POST media; RegisterMedia DTO | offline/retry/quota/checksum | Creative/quick action · P2 |
| Asset Detail | Metadata, status, provenance and uses | Creative | D/T/M | Viewer, metadata, entity links | GET identifier; MediaResponse | processing/failed/archived | Library · P2 |
| Asset Metadata Form | Update non-destructive metadata | Creative | D/T/M | Form | PUT; UpdateMedia DTO | invalid/read-only | Asset · P2 |
| Processing Queue | Monitor processing/failures | Creative/admin | D/T/M | Queue table | media query | provider degraded | Creative · P2 |
| Storage Explorer | Technical folder/object view | Media admin | D/T/M | Folder tree, breadcrumbs, file grid | Storage capability | empty/path unavailable | Admin/Creative · P3 |
| Gallery List | Find galleries by Event/status | Creative/producer | D/T/M | Table/cards | `GET /galleries`; QueryGalleries DTO | empty | Creative/Event · P2 |
| Gallery Builder | Curate albums and Media references | Creative | D/T/M | Asset tray, canvas, inspector | POST/PATCH/assets; Gallery DTOs | missing asset/unsaved | Gallery · P2 |
| Album Organizer | Create/order thematic albums | Creative | D/T/M | Tree/drag/drop | albums endpoint | duplicate title | Builder · P2 |
| Gallery Access Settings | Visibility, password and capabilities | Creative/producer | D/T/M | Settings form | PATCH; UpdateGallery DTO | weak password/policy | Gallery · P2 |
| Gallery Preview | Validate client presentation | Creative | D/T/M | Lightbox/device preview | Gallery response | unpublished watermark | Builder · P2 |
| Client Gallery | Immersive view of published assets | Client/guest scoped | M-first | Gallery, lightbox, selection | Portal galleries | expired/no assets | Portal/link · P1 |
| Selection Review | Review favorites/selections/comments | Creative/client | D/T/M | Selection grid | future GallerySelection | conflicting submission | Gallery · P3 |
| Deliverable List | Track commitments and due dates | Producer/editor | D/T/M | Table/board | `GET /deliverables`; Query DTO | empty/overdue | Creative/Event · P2 |
| Deliverable Detail | Items, source, status and delivery | Authorized staff/client limited | D/T/M | Header, item list, history | GET identifier; DeliverableResponse | blocked/archived | List/Event/Portal · P2 |
| Deliverable Form | Define commitment and method | Producer | D/T/M | Form | POST/PATCH DTOs | missing Event/date | Create/detail · P2 |
| Deliverable Items | Add/remove Media/Gallery references | Editor/producer | D/T/M | Item editor | items endpoints; AddItem DTO | invalid/missing source | Detail · P2 |
| Ready Review | Validate completeness before Ready | Producer/editor | D/T/M | Checklist dialog | `POST /:id/ready` | blockers | Detail · P2 |
| Delivery Dialog | Record method, date and tracking/access | Producer | D/T/M | Delivery form | `POST /:id/deliver` | missing tracking/payment block | Detail · P2 |
| Client Deliverables | View status and downloads | Client | M-first | Delivery cards/downloads | Portal deliverables | preparing/expired link | Portal · P1 |

## 9. Notifications and administration screens

| Screen | Purpose and description | Roles / permission | Viewport | Components | API / DTO | States and actions | Entry / priority |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Notification Outbox | Trace scheduled/sent/failed messages | Admin/operations | D/T/M | Data table, filters | `GET /notifications`; Query DTO | empty/provider down | Notifications · P2 |
| Notification Detail | Recipients, rendered content and history | Authorized staff | D/T/M | Detail/timeline | GET identifier; Response DTO | redacted PII | Outbox · P2 |
| Notification Composer | Send/schedule allowed communication | Authorized staff | D/T/M | Composer, recipient picker | POST; CreateNotification DTO | unresolved recipient/template error | Create/context · P2 |
| Template List | Manage channel templates | Admin/marketing | D/T/M | Table | templates capability | empty | Notifications · P2 |
| Template Editor | Variables, preview and channel content | Admin/marketing | D/T/M | Split editor/preview | POST template; CreateTemplate DTO | unknown variable | Template list · P2 |
| Users List | Manage accounts and status | IAM admin | D/T/M | Data table | Identity facade | empty/tenant boundary | Administration · P2 |
| User Detail | Roles, claims, person link and lifecycle | IAM admin | D/T/M | Tabs, security summary | Identity capabilities | locked/self protection | Users · P2 |
| Roles List | Manage reusable access profiles | IAM admin | D/T/M | Table | `/access/roles` | empty/system role | Access · P2 |
| Role Editor | Name and permission grants | IAM admin | D/T/M | Form, permission matrix | roles/grant endpoints | duplicate/protected | Roles · P2 |
| Permission Catalog | Atomic resource/action definitions | IAM admin | D/T/M | Matrix/table | GET/POST permissions | duplicate immutable | Access · P2 |
| Policy Editor | Build ABAC conditions | Security admin | D/T/M | Rule builder, test panel | POST policies | invalid rule/self-lockout | Access · P3 |
| Sessions List | Review and revoke devices | Own user/admin | D/T/M | Session cards/table | session endpoints | current session marker | Security/User · P1 |
| API Keys | Issue/revoke scoped keys | Admin/integration owner | D/T/M | Table, issue dialog | API key endpoints | secret one-time/revoked | Access · P2 |
| API Key Secret Receipt | Show secret exactly once | Key creator | D/T/M | Secure code block/copy | create response | copy confirmation | Issue flow · P2 |
| Settings | Edit categorized key/value configuration | Admin | D/T/M | Category nav, forms | GET/PUT settings; Admin DTO | protected/sensitive | Administration · P2 |
| Feature Flags | Toggle capabilities with impact | Admin | D/T/M | Flag table, confirm | flag endpoints | dependency/error | Administration · P2 |
| Catalogs | Manage currencies/languages/global catalogs | Admin | D/T/M | Table/editor | catalog endpoints | duplicate/in use | Administration · P2 |
| Dashboard Builder | Add/order/resize permission-aware widgets | Admin | D/T/M | Grid builder | widgets endpoints | invalid layout | Administration · P3 |
| Audit Log | Search immutable security/business evidence | Auditor/Admin | D/T/M | Data table/detail drawer | future Audit | retention/no results | Administration · P2 |
| System Health | Database/storage/provider status | Technical admin | D/T/M | Status cards/history | `/admin/health`, health endpoints | degraded/unknown | Administration · P2 |
| CMS Dashboard | Manage editorial content | CMS editor | D/T/M | Existing admin patterns | current Firebase/future CMS | disconnected backend | Administration · P3 |

## 10. Client Portal supporting screens

| Screen | Purpose and description | Roles / permission | Viewport | Components | API / DTO | States and actions | Entry / priority |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Client Event Summary | Human-readable status, brief and dates | Client own Event | D/T/M | Summary cards, schedule | Portal summary DTO | tentative date/no session | Portal · P1 |
| Client Timeline | Derived chronological milestones | Client own Event | D/T/M | Timeline | Portal timeline DTO | no public milestones | Portal · P1 |
| Client Contracts | Agreements visible to client | Client/party | D/T/M | Document cards | planned Contract facade | unsigned/expired | Portal · P2 |
| Client Support | Contact producer/help without exposing internal People | Client | D/T/M | Contact card/form | future messaging/notification | unavailable/offline | Portal · P2 |
| Portal Access Expired | Explain expired magic link/session | Client | D/T/M | Expired state | auth client future | request new link | Auth guard · P1 |

## 11. Coverage totals

- Individual screens specified: **109**.
- P0: 5 foundation screens.
- P1: core identity, CRM, People, Events, contracts and client essentials.
- P2: finance, audiovisual chain, administration and complete portal.
- P3: advanced selection, policy builder, configurable dashboard, technical storage and CMS convergence.

