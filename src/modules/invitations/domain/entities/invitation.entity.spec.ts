import { Invitation } from './invitation.entity.js';
import { InvitationGuest } from './invitation-guest.entity.js';
import { InvitationStatus, InvitationVisibility, RSVPStatus } from '../enums/invitations.enums.js';

describe('Invitation Aggregate Root', () => {
  it('should create an invitation correctly with default props', () => {
    const invitation = Invitation.create({
      code: 'INV-000001',
      eventId: 'event-1',
      slug: 'boda-jorge-y-maria',
      title: 'Boda Jorge & Maria',
    });

    expect(invitation.id).toBeDefined();
    expect(invitation.status).toBe(InvitationStatus.DRAFT);
    expect(invitation.visibility).toBe(InvitationVisibility.PUBLIC);
    expect(invitation.domainEvents.length).toBe(1);
    expect(invitation.domainEvents[0]!.eventName).toBe('invitations.invitation_created');
  });

  it('should manage guest additions and rsvp confirmation', () => {
    const invitation = Invitation.create({
      code: 'INV-000002',
      eventId: 'event-1',
      slug: 'cumple-diego',
      title: 'Cumple Diego 30',
    });

    const guest = new InvitationGuest({
      displayName: 'Jackson Palacios',
      maxCompanions: 2,
    });

    invitation.addGuest(guest);
    expect(invitation.guests.length).toBe(1);

    invitation.publish();
    invitation.confirmRSVP(guest.id, ['Companion 1'], 'Vegetarian', 'Looking forward to it!');

    expect(guest.rsvpStatus).toBe(RSVPStatus.CONFIRMED);
    expect(guest.confirmedCompanions).toBe(1);
  });
});
