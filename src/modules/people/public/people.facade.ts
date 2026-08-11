import { Injectable } from '@nestjs/common';
import { GetPersonUseCase } from '../application/get-person/get-person.use-case.js';
import { GetOrganizationUseCase } from '../application/get-organization/get-organization.use-case.js';
import { Person } from '../domain/entities/person.entity.js';
import { Organization } from '../domain/entities/organization.entity.js';

@Injectable()
export class PeopleFacade {
  constructor(
    private readonly getPersonUseCase: GetPersonUseCase,
    private readonly getOrganizationUseCase: GetOrganizationUseCase,
  ) {}

  async findPersonByIdOrCode(identifier: string): Promise<Person | null> {
    try {
      return await this.getPersonUseCase.execute(identifier);
    } catch {
      return null;
    }
  }

  async findOrganizationByIdOrCode(identifier: string): Promise<Organization | null> {
    try {
      return await this.getOrganizationUseCase.execute(identifier);
    } catch {
      return null;
    }
  }
}
