import { InvitationsController } from './invitations.controller.js';
import type { CreateInvitationUseCase } from '../../../application/create-invitation/create-invitation.use-case.js';
import type { DuplicateInvitationUseCase } from '../../../application/duplicate-invitation/duplicate-invitation.use-case.js';
import type { ManageInvitationGuestsUseCase } from '../../../application/manage-invitation-guests/manage-invitation-guests.use-case.js';
import type { ManageInvitationLayoutUseCase } from '../../../application/manage-invitation-layout/manage-invitation-layout.use-case.js';
import type { ManageInvitationLifecycleUseCase } from '../../../application/manage-invitation-lifecycle/manage-invitation-lifecycle.use-case.js';
import type { ListInvitationsUseCase } from '../../../application/list-invitations/list-invitations.use-case.js';
import { Invitation } from '../../../domain/entities/invitation.entity.js';

describe('InvitationsController', () => {
  let controller: InvitationsController;
  let sampleInv: Invitation;

  beforeEach(() => {
    sampleInv = Invitation.create({
      code: 'INV-000001',
      eventId: 'event-1',
      slug: 'boda-jorge-y-maria',
      title: 'Boda Jorge & Maria',
    });

    const createUseCase = { execute: jest.fn().mockResolvedValue(sampleInv) } as unknown as CreateInvitationUseCase;
    const duplicateUseCase = { execute: jest.fn().mockResolvedValue(sampleInv) } as unknown as DuplicateInvitationUseCase;
    const guestsUseCase = {
      addGuest: jest.fn().mockResolvedValue(sampleInv),
      confirmRSVP: jest.fn().mockResolvedValue(sampleInv),
    } as unknown as ManageInvitationGuestsUseCase;
    const layoutUseCase = {
      setSections: jest.fn().mockResolvedValue(sampleInv),
      setSchedules: jest.fn().mockResolvedValue(sampleInv),
    } as unknown as ManageInvitationLayoutUseCase;
    const lifecycleUseCase = {
      findByIdOrCodeOrSlug: jest.fn().mockResolvedValue(sampleInv),
      updateConfig: jest.fn().mockResolvedValue(sampleInv),
      publish: jest.fn().mockResolvedValue(sampleInv),
      unpublish: jest.fn().mockResolvedValue(sampleInv),
      archive: jest.fn().mockResolvedValue(sampleInv),
      restore: jest.fn().mockResolvedValue(sampleInv),
    } as unknown as ManageInvitationLifecycleUseCase;
    const listUseCase = {
      execute: jest.fn().mockResolvedValue({
        data: [sampleInv],
        total: 1,
        page: 1,
        limit: 20,
        totalPages: 1,
      }),
    } as unknown as ListInvitationsUseCase;

    controller = new InvitationsController(
      createUseCase,
      duplicateUseCase,
      guestsUseCase,
      layoutUseCase,
      lifecycleUseCase,
      listUseCase,
    );
  });

  it('should list invitations', async () => {
    const res = await controller.findAll({});
    expect(res.data.length).toBe(1);
  });
});
