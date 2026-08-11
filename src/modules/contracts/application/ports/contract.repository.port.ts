import type { Contract } from '../../domain/entities/contract.entity.js';
import type { ContractStatus, ContractTemplateType } from '../../domain/enums/contracts.enums.js';
import type { PaginatedResult } from '../../../../platform/domain/types/pagination.types.js';

export const CONTRACT_REPOSITORY = Symbol('CONTRACT_REPOSITORY');

export interface ListContractsFilter {
  page?: number;
  limit?: number;
  eventId?: string;
  deliverableId?: string;
  status?: ContractStatus;
  templateType?: ContractTemplateType;
  search?: string;
  includeDeleted?: boolean;
}

export interface ContractRepositoryPort {
  save(contract: Contract): Promise<Contract>;
  findById(id: string): Promise<Contract | null>;
  findByCode(code: string): Promise<Contract | null>;
  findAll(filter: ListContractsFilter): Promise<PaginatedResult<Contract>>;
  nextCode(): Promise<string>;
}
