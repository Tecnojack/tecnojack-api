import { BaseDomainEvent } from '../../../../platform/domain/events/base-domain-event.js';

export interface InvitationCreatedPayload {
  invitationId: string;
  code: string;
  eventId: string;
  slug: string;
}

export class InvitationCreatedEvent extends BaseDomainEvent<InvitationCreatedPayload> {
  constructor(payload: InvitationCreatedPayload) {
    super('invitations.invitation_created', payload.invitationId, payload);
  }
}

export interface InvitationPublishedPayload {
  invitationId: string;
  code: string;
  publishedAt: Date;
}

export class InvitationPublishedEvent extends BaseDomainEvent<InvitationPublishedPayload> {
  constructor(payload: InvitationPublishedPayload) {
    super('invitations.invitation_published', payload.invitationId, payload);
  }
}

export interface GuestRSVPUpdatedPayload {
  invitationId: string;
  guestId: string;
  displayName: string;
  status: string;
  companionsCount: number;
}

export class GuestRSVPUpdatedEvent extends BaseDomainEvent<GuestRSVPUpdatedPayload> {
  constructor(payload: GuestRSVPUpdatedPayload) {
    super('invitations.guest_rsvp_updated', payload.invitationId, payload);
  }
}
