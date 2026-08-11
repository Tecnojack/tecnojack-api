import { Injectable, Inject } from '@nestjs/common';
import { Organization } from '../../domain/entities/organization.entity.js';
import { OrganizationNotFoundException } from '../../domain/errors/people.errors.js';
import { ORGANIZATION_REPOSITORY, type OrganizationRepositoryPort } from '../ports/organization.repository.port.js';

@Injectable()
export class GetOrganizationUseCase {
  constructor(
    @Inject(ORGANIZATION_REPOSITORY)
    private readonly organizationRepository: OrganizationRepositoryPort,
  ) {}

  async execute(identifier: string): Promise<Organization> {
    let org = await this.organizationRepository.findById(identifier);
    org ??= await this.organizationRepository.findByCode(identifier);

    if (!org) {
      throw new OrganizationNotFoundException(identifier);
    }

    return org;
  }
}
