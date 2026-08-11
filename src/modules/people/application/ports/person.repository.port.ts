import type { Person } from '../../domain/entities/person.entity.js';

export const PERSON_REPOSITORY = Symbol('PERSON_REPOSITORY');

export interface ListPersonsFilter {
  search?: string;
  status?: string;
  country?: string;
  includeDeleted?: boolean;
  page?: number;
  limit?: number;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PersonRepositoryPort {
  save(person: Person): Promise<Person>;
  findById(id: string): Promise<Person | null>;
  findByCode(code: string): Promise<Person | null>;
  findByDocument(issuingCountry: string, type: string, number: string): Promise<Person | null>;
  findAll(filter: ListPersonsFilter): Promise<PaginatedResult<Person>>;
  nextCode(): Promise<string>;
}
