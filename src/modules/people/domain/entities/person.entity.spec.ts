import { Person } from './person.entity.js';
import { PersonName } from '../value-objects/person-name.value-object.js';
import { Document } from '../value-objects/document.value-object.js';
import { DocumentType, PersonStatus, ContactType } from '../enums/people.enums.js';
import { ContactInformation } from '../value-objects/contact-information.value-object.js';
import { PersonAlreadyDeletedException } from '../errors/people.errors.js';

describe('Person Aggregate Root Entity', () => {
  const createSamplePerson = (): Person => {
    const name = new PersonName({
      givenNames: 'Gabriel',
      familyNames: 'García Márquez',
    });
    const document = new Document({
      issuingCountry: 'CO',
      type: DocumentType.NATIONAL_ID,
      number: '12.345.678',
    });
    return Person.create({
      code: 'PER-000001',
      name,
      document,
    }, 'actor-admin');
  };

  it('should create person entity and publish PersonCreatedEvent', () => {
    const person = createSamplePerson();
    expect(person.id).toBeDefined();
    expect(person.code).toBe('PER-000001');
    expect(person.name.displayName).toBe('Gabriel García Márquez');
    expect(person.status).toBe(PersonStatus.ACTIVE);
    expect(person.domainEvents).toHaveLength(1);
    expect(person.domainEvents[0]!.eventName).toBe('people.person.created');
  });

  it('should update name and emit PersonUpdatedEvent', () => {
    const person = createSamplePerson();
    person.clearDomainEvents();

    const newName = new PersonName({
      givenNames: 'Gabriel José',
      familyNames: 'García Márquez',
    });
    person.updateName(newName, 'editor-1');

    expect(person.name.givenNames).toBe('Gabriel José');
    expect(person.domainEvents).toHaveLength(1);
    expect(person.domainEvents[0]!.eventName).toBe('people.person.updated');
  });

  it('should manage contact information points', () => {
    const person = createSamplePerson();
    person.clearDomainEvents();

    const emailContact = new ContactInformation({
      type: ContactType.EMAIL,
      value: 'gabo@macondo.com',
      isPrimary: true,
    });
    person.addContactPoint(emailContact);

    expect(person.contactPoints).toHaveLength(1);
    expect(person.contactPoints[0]!.value).toBe('gabo@macondo.com');

    person.removeContactPoint('gabo@macondo.com');
    expect(person.contactPoints).toHaveLength(0);
  });

  it('should soft delete person and reject modifications afterwards', () => {
    const person = createSamplePerson();
    person.softDelete('deleter-user');

    expect(person.audit.isDeleted()).toBe(true);
    expect(person.audit.deletedBy).toBe('deleter-user');

    expect(() => person.softDelete('deleter-user')).toThrow(PersonAlreadyDeletedException);
    expect(() =>
      person.updateName(
        new PersonName({ givenNames: 'Test' }),
        'user',
      ),
    ).toThrow(PersonAlreadyDeletedException);
  });

  it('should restore soft-deleted person', () => {
    const person = createSamplePerson();
    person.softDelete('deleter-user');
    person.clearDomainEvents();

    person.restore('restorer-user');
    expect(person.audit.isDeleted()).toBe(false);
    expect(person.domainEvents).toHaveLength(1);
    expect(person.domainEvents[0]!.eventName).toBe('people.person.restored');
  });
});
