import { Injectable, Inject } from '@nestjs/common';
import { Person } from '../../domain/entities/person.entity.js';
import { PersonName } from '../../domain/value-objects/person-name.value-object.js';
import { Document } from '../../domain/value-objects/document.value-object.js';
import { ContactInformation } from '../../domain/value-objects/contact-information.value-object.js';
import { PersonNotFoundException, DuplicateDocumentException } from '../../domain/errors/people.errors.js';
import { PERSON_REPOSITORY, type PersonRepositoryPort } from '../ports/person.repository.port.js';
import type { UpdatePersonCommand } from './update-person.command.js';

@Injectable()
export class UpdatePersonUseCase {
  constructor(
    @Inject(PERSON_REPOSITORY)
    private readonly personRepository: PersonRepositoryPort,
  ) {}

  async execute(command: UpdatePersonCommand): Promise<Person> {
    const person = await this.personRepository.findById(command.id);
    if (!person) {
      throw new PersonNotFoundException(command.id);
    }

    if (command.givenNames) {
      const updatedName = new PersonName({
        givenNames: command.givenNames,
        familyNames: command.familyNames ?? person.name.familyNames ?? undefined,
        displayName: command.displayName ?? person.name.displayName,
        prefix: command.prefix ?? person.name.prefix ?? undefined,
        suffix: command.suffix ?? person.name.suffix ?? undefined,
      });
      person.updateName(updatedName, command.actorId);
    }

    if (command.documentIssuingCountry && command.documentType && command.documentNumber) {
      const existing = await this.personRepository.findByDocument(
        command.documentIssuingCountry,
        command.documentType,
        command.documentNumber,
      );

      if (existing && existing.id !== person.id) {
        throw new DuplicateDocumentException(command.documentNumber, command.documentIssuingCountry);
      }

      const updatedDoc = new Document({
        issuingCountry: command.documentIssuingCountry,
        type: command.documentType,
        number: command.documentNumber,
        formattedNumber: command.documentFormatted,
      });
      person.updateDocument(updatedDoc, command.actorId);
    }

    if (command.status) {
      person.changeStatus(command.status, command.actorId);
    }

    if (command.contacts) {
      for (const c of command.contacts) {
        person.addContactPoint(
          new ContactInformation({
            type: c.type,
            value: c.value,
            label: c.label,
            isPrimary: c.isPrimary,
          }),
          command.actorId,
        );
      }
    }

    return this.personRepository.save(person);
  }
}
