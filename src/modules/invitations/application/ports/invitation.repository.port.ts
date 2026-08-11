import type { Invitation } from '../../domain/entities/invitation.entity.js';
import type { PaginatedResult } from '../../../../platform/domain/types/pagination.types.js';

export const INVITATION_REPOSITORY = Symbol('INVITATION_REPOSITORY');

export interface ListInvitationsFilter {
  page?: number;
  limit?: number;
  eventId?: string;
  status?: string;
  search?: string;
  includeDeleted?: boolean;
}

export interface InvitationRepositoryPort {
  save(invitation: Invitation): Promise<Invitation>;
  findById(id: string): Promise<Invitation | null>;
  findByCode(code: string): Promise<Invitation | null>;
  findBySlug(slug: string): Promise<Invitation | null>;
  findAll(filter: ListInvitationsFilter): Promise<PaginatedResult<Invitation>>;
  nextCode(): Promise<string>;
}
