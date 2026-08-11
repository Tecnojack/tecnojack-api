import { Injectable, Inject } from '@nestjs/common';
import { Organization } from '../../domain/entities/organization.entity.js';
import {
  ORGANIZATION_REPOSITORY,
  type OrganizationRepositoryPort,
  type ListOrganizationsFilter,
} from '../ports/organization.repository.port.js';
import { type PaginatedResult } from '../ports/person.repository.port.js';

@Injectable()
export class ListOrganizationsUseCase {
  constructor(
    @Inject(ORGANIZATION_REPOSITORY)
    private readonly organizationRepository: OrganizationRepositoryPort,
  ) {}

  async execute(filter: ListOrganizationsFilter): Promise<PaginatedResult<Organization>> {
    return this.organizationRepository.findAll(filter);
  }
}
