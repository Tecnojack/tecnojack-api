import { Injectable, Inject } from '@nestjs/common';
import {
  INVITATION_REPOSITORY,
  type InvitationRepositoryPort,
  type ListInvitationsFilter,
} from '../ports/invitation.repository.port.js';
import type { Invitation } from '../../domain/entities/invitation.entity.js';
import type { PaginatedResult } from '../../../../platform/domain/types/pagination.types.js';

@Injectable()
export class ListInvitationsUseCase {
  constructor(
    @Inject(INVITATION_REPOSITORY)
    private readonly repo: InvitationRepositoryPort,
  ) {}

  async execute(filter: ListInvitationsFilter): Promise<PaginatedResult<Invitation>> {
    return this.repo.findAll(filter);
  }
}
