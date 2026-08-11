# 11 — Mobile Experience

## 1. Principles

- Mobile is a task surface, not a compressed desktop.
- Preserve context, next action, offline status and background activity.
- Touch target ≥44 px; respect safe areas.
- Camera and upload flows tolerate interruption.
- Dense administration remains possible but is not optimized as a primary mobile job.

## 2. Bottom navigation

| Role | Destinations | Center/primary action |
| --- | --- | --- |
| Photographer/Videographer | Today, Schedule, Upload, Tasks, More | Upload |
| Sales | Home, Pipeline, Activity, Tasks, More | Log activity |
| Producer | Home, Calendar, Events, Tasks, More | Create session |
| Client | Home, Event, Gallery, Deliveries, More | Current next action |

## 3. Photographer

- Today agenda with next Session dominant.
- Offline call sheet cached: time, timezone, location, brief, authorized contacts.
- One-tap navigation and issue reporting.
- Camera/gallery picker with batch queue.
- Upload continues in background when platform permits.
- Checksum/backup confirmation before “complete upload”.

## 4. Videographer

- Same field flow plus storage estimate, Wi-Fi preference, proxy/original distinction, large-file resumability and processing status.

## 5. Client

- Next action first: sign, pay, confirm, select or download.
- Plain-language Event progress.
- Sticky due action only when safe.
- Gallery optimized for touch/lightbox.
- Documents support zoom and resume.

## 6. Guest

- No ERP shell.
- Fast invitation cover, section anchors and accessible audio control.
- Maps handoff to installed map app.
- RSVP in one short flow with clear companion count.
- Expiration and confirmation are branded standalone states.

## 7. Sales

- Pipeline summary, tasks and quick activity.
- Call/email actions use authorized contact data.
- Opportunity form uses progressive disclosure.
- Offline notes may draft locally but cannot imply server save.

## 8. Producer

- Today/week agenda, blockers and Event readiness.
- Quick reschedule captures timezone and impact.
- Team/contact details scoped to assigned Event.
- Production board becomes prioritized list.

## 9. Gestures

- Swipe actions only duplicate visible menu actions.
- Swipe-to-archive requires undo and is excluded for critical entities.
- Pinch zoom limited to media/documents.
- Drag/drop has button/keyboard alternative.
- Pull-to-refresh never discards draft content.

## 10. Offline

- Global offline banner and last-sync time.
- Read cache for today/session/client essentials.
- Draft queue labels `Pending sync`, not `Saved`.
- Conflict resolution presents local/server timestamps and fields.
- Financial, signature and lifecycle transitions require online confirmation.

## 11. Camera upload and media sync

`Select/capture → inspect quota → queue → upload chunks → verify checksum → register MediaAsset → process → ready`.

Per-file controls: pause, resume, retry, cancel, remove local item. Show Wi-Fi-only preference, remaining bytes/time estimate and battery/network warning without blocking emergency upload.

## 12. Notifications and quick actions

- Deep link to source entity after authorization.
- Group low-priority updates; never group security alerts.
- Quick actions require authentication freshness for dangerous operations.
- Badge counts represent actionable unread items, not all history.

## 13. Responsive priorities

1. Context and status.
2. Primary task.
3. Time/location/amount.
4. Blocking alerts.
5. Essential relations.
6. History and metadata through disclosure.

