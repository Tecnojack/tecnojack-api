import { Injectable, Inject } from '@nestjs/common';
import { Person } from '../../domain/entities/person.entity.js';
import { PersonName } from '../../domain/value-objects/person-name.value-object.js';
import { Document } from '../../domain/value-objects/document.value-object.js';
import { ContactInformation } from '../../domain/value-objects/contact-information.value-object.js';
import { DuplicateDocumentException } from '../../domain/errors/people.errors.js';
import type { PersonRepositoryPort } from '../ports/person.repository.port.js';
import type { CreatePersonCommand } from './create-person.command.js';

export const PERSON_REPOSITORY = Symbol('PERSON_REPOSITORY');

@Injectable()
export class CreatePersonUseCase {
  constructor(
    @Inject(PERSON_REPOSITORY)
    private readonly personRepository: PersonRepositoryPort,
  ) {}

  async execute(command: CreatePersonCommand): Promise<Person> {
    let document: Document | null = null;

    if (command.documentIssuingCountry && command.documentType && command.documentNumber) {
      const existing = await this.personRepository.findByDocument(
        command.documentIssuingCountry,
        command.documentType,
        command.documentNumber,
      );

      if (existing) {
        throw new DuplicateDocumentException(command.documentNumber, command.documentIssuingCountry);
      }

      document = new Document({
        issuingCountry: command.documentIssuingCountry,
        type: command.documentType,
        number: command.documentNumber,
        formattedNumber: command.documentFormatted,
      });
    }

    const name = new PersonName({
      givenNames: command.givenNames,
      familyNames: command.familyNames,
      displayName: command.displayName,
      prefix: command.prefix,
      suffix: command.suffix,
    });

    const contactPoints = (command.contacts ?? []).map(
      (c) =>
        new ContactInformation({
          type: c.type,
          value: c.value,
          label: c.label,
          isPrimary: c.isPrimary,
        }),
    );

    const code = await this.personRepository.nextCode();

    const person = Person.create(
      {
        code,
        name,
        document,
        contactPoints,
      },
      command.actorId,
    );

    return this.personRepository.save(person);
  }
}
