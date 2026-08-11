import { Injectable, Inject } from '@nestjs/common';
import { Person } from '../../domain/entities/person.entity.js';
import { PersonNotFoundException } from '../../domain/errors/people.errors.js';
import { PERSON_REPOSITORY, type PersonRepositoryPort } from '../ports/person.repository.port.js';

@Injectable()
export class ArchivePersonUseCase {
  constructor(
    @Inject(PERSON_REPOSITORY)
    private readonly personRepository: PersonRepositoryPort,
  ) {}

  async execute(id: string, actorId?: string): Promise<Person> {
    const person = await this.personRepository.findById(id);
    if (!person) {
      throw new PersonNotFoundException(id);
    }

    person.softDelete(actorId);
    return this.personRepository.save(person);
  }
}
