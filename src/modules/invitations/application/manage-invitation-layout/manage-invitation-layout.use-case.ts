import { Injectable, Inject } from '@nestjs/common';
import {
  INVITATION_REPOSITORY,
  type InvitationRepositoryPort,
} from '../ports/invitation.repository.port.js';
import type { Invitation } from '../../domain/entities/invitation.entity.js';
import { InvitationSection } from '../../domain/entities/invitation-section.entity.js';
import { InvitationSchedule } from '../../domain/entities/invitation-schedule.entity.js';
import { InvitationNotFoundException } from '../../domain/errors/invitations.errors.js';

export interface SetSectionsCommand {
  invitationId: string;
  sections: {
    type: string;
    title: string;
    content?: Record<string, unknown>;
    orderIndex?: number;
    isEnabled?: boolean;
  }[];
  actorId?: string;
}

export interface SetSchedulesCommand {
  invitationId: string;
  schedules: {
    title: string;
    description?: string;
    timeLabel: string;
    locationLabel?: string;
    orderIndex?: number;
  }[];
  actorId?: string;
}

@Injectable()
export class ManageInvitationLayoutUseCase {
  constructor(
    @Inject(INVITATION_REPOSITORY)
    private readonly repo: InvitationRepositoryPort,
  ) {}

  async setSections(command: SetSectionsCommand): Promise<Invitation> {
    const invitation = await this.repo.findById(command.invitationId);
    if (!invitation) throw new InvitationNotFoundException(command.invitationId);

    const sections = command.sections.map(
      (s) =>
        new InvitationSection({
          type: s.type,
          title: s.title,
          content: s.content,
          orderIndex: s.orderIndex,
          isEnabled: s.isEnabled,
        }),
    );

    invitation.setSections(sections, command.actorId);
    return this.repo.save(invitation);
  }

  async setSchedules(command: SetSchedulesCommand): Promise<Invitation> {
    const invitation = await this.repo.findById(command.invitationId);
    if (!invitation) throw new InvitationNotFoundException(command.invitationId);

    const schedules = command.schedules.map(
      (s) =>
        new InvitationSchedule({
          title: s.title,
          description: s.description,
          timeLabel: s.timeLabel,
          locationLabel: s.locationLabel,
          orderIndex: s.orderIndex,
        }),
    );

    invitation.setSchedules(schedules, command.actorId);
    return this.repo.save(invitation);
  }
}
