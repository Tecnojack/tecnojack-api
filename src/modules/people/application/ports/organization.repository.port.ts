import type { Organization } from '../../domain/entities/organization.entity.js';
import { type PaginatedResult } from './person.repository.port.js';

export const ORGANIZATION_REPOSITORY = Symbol('ORGANIZATION_REPOSITORY');

export interface ListOrganizationsFilter {
  search?: string;
  status?: string;
  country?: string;
  includeDeleted?: boolean;
  page?: number;
  limit?: number;
}

export interface OrganizationRepositoryPort {
  save(organization: Organization): Promise<Organization>;
  findById(id: string): Promise<Organization | null>;
  findByCode(code: string): Promise<Organization | null>;
  findByTaxId(issuingCountry: string, taxId: string): Promise<Organization | null>;
  findAll(filter: ListOrganizationsFilter): Promise<PaginatedResult<Organization>>;
  nextCode(): Promise<string>;
}
