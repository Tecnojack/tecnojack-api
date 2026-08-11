import { Injectable, Inject } from '@nestjs/common';
import { Person } from '../../domain/entities/person.entity.js';
import { PersonNotFoundException } from '../../domain/errors/people.errors.js';
import { PERSON_REPOSITORY, type PersonRepositoryPort } from '../ports/person.repository.port.js';

@Injectable()
export class GetPersonUseCase {
  constructor(
    @Inject(PERSON_REPOSITORY)
    private readonly personRepository: PersonRepositoryPort,
  ) {}

  async execute(identifier: string): Promise<Person> {
    let person = await this.personRepository.findById(identifier);
    person ??= await this.personRepository.findByCode(identifier);

    if (!person) {
      throw new PersonNotFoundException(identifier);
    }

    return person;
  }
}
