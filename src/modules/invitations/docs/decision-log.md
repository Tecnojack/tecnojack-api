# Decision Log - Invitations Domain

## Strategy & Layout Architecture

### Overwrite sections layout instead of single upsert mutations
- **Decision**: Overwrite dynamic list arrays in a transaction block inside the `setSections` / `setSchedules` methods.
- **Alternatives**: Supporting standalone `POST/PATCH/DELETE` endpoints per individual dynamic section or itinerary timeline entry.
- **Rationale**: Dynamic templates and layouts are usually configured in a single draft view inside the client dashboard. Sending/updating the complete layout model array avoids inconsistent database states, simplifies concurrency issues, and eliminates database connection roundtrips.

### RSVP state mutation controls
- **Decision**: Confirming and declining RSVPs is restricted to `PUBLISHED` invitations that are not yet expired.
- **Alternative**: Allowing RSVP transitions on `DRAFT` status invitations.
- **Rationale**: Preventing confirmation actions on drafts ensures hosts do not receive responses for templates under design edit, avoiding data loss during visual modifications.
