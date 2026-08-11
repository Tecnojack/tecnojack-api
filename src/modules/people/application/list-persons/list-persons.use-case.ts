import { Injectable, Inject } from '@nestjs/common';
import { Person } from '../../domain/entities/person.entity.js';
import {
  PERSON_REPOSITORY,
  type PersonRepositoryPort,
  type ListPersonsFilter,
  type PaginatedResult,
} from '../ports/person.repository.port.js';

@Injectable()
export class ListPersonsUseCase {
  constructor(
    @Inject(PERSON_REPOSITORY)
    private readonly personRepository: PersonRepositoryPort,
  ) {}

  async execute(filter: ListPersonsFilter): Promise<PaginatedResult<Person>> {
    return this.personRepository.findAll(filter);
  }
}
