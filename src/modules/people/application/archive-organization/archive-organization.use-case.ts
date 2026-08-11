import { Injectable, Inject } from '@nestjs/common';
import { Organization } from '../../domain/entities/organization.entity.js';
import { OrganizationNotFoundException } from '../../domain/errors/people.errors.js';
import { ORGANIZATION_REPOSITORY, type OrganizationRepositoryPort } from '../ports/organization.repository.port.js';

@Injectable()
export class ArchiveOrganizationUseCase {
  constructor(
    @Inject(ORGANIZATION_REPOSITORY)
    private readonly organizationRepository: OrganizationRepositoryPort,
  ) {}

  async execute(id: string, actorId?: string): Promise<Organization> {
    const org = await this.organizationRepository.findById(id);
    if (!org) {
      throw new OrganizationNotFoundException(id);
    }

    org.softDelete(actorId);
    return this.organizationRepository.save(org);
  }
}
