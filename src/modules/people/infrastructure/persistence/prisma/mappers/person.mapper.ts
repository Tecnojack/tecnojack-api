import type { PersonModel as PrismaPerson } from '../../../../../../generated/prisma/models/Person.js';
import type { PersonContactInfoModel as PrismaContact } from '../../../../../../generated/prisma/models/PersonContactInfo.js';
import type {
  DocumentType as PrismaDocType,
  PersonStatus as PrismaPersonStatus,
  ContactType as PrismaContactType,
} from '../../../../../../generated/prisma/enums.js';
import { Person } from '../../../../domain/entities/person.entity.js';
import { PersonName } from '../../../../domain/value-objects/person-name.value-object.js';
import { Document } from '../../../../domain/value-objects/document.value-object.js';
import { ContactInformation } from '../../../../domain/value-objects/contact-information.value-object.js';
import { AuditInfo } from '../../../../../../platform/domain/value-objects/audit-info.value-object.js';
import type { DocumentType, PersonStatus, ContactType } from '../../../../domain/enums/people.enums.js';

export type PrismaPersonWithContacts = PrismaPerson & {
  contactInformation?: PrismaContact[];
};

export interface PersistencePersonData {
  id: string;
  code: string;
  givenNames: string;
  familyNames: string | null;
  displayName: string;
  prefix: string | null;
  suffix: string | null;
  documentIssuingCountry: string | null;
  documentType: PrismaDocType | null;
  documentNumber: string | null;
  documentFormatted: string | null;
  status: PrismaPersonStatus;
  createdAt: Date;
  createdBy: string | null;
  updatedAt: Date;
  updatedBy: string | null;
  deletedAt: Date | null;
  deletedBy: string | null;
}

export interface PersistenceContactData {
  id: string;
  personId: string;
  type: PrismaContactType;
  value: string;
  label: string | null;
  isPrimary: boolean;
}

export class PersonMapper {
  static toDomain(raw: PrismaPersonWithContacts): Person {
    const name = new PersonName({
      givenNames: raw.givenNames,
      familyNames: raw.familyNames,
      displayName: raw.displayName,
      prefix: raw.prefix,
      suffix: raw.suffix,
    });

    let document: Document | null = null;
    if (raw.documentIssuingCountry && raw.documentType && raw.documentNumber) {
      document = new Document({
        issuingCountry: raw.documentIssuingCountry,
        type: raw.documentType as unknown as DocumentType,
        number: raw.documentNumber,
        formattedNumber: raw.documentFormatted,
      });
    }

    const contactsList = (raw.contactInformation ?? []) as unknown as {
      id: string;
      type: string;
      value: string;
      label: string | null;
      isPrimary: boolean;
    }[];

    const contactPoints = contactsList.map(
      (c): ContactInformation =>
        new ContactInformation({
          id: c.id,
          type: c.type as unknown as ContactType,
          value: c.value,
          label: c.label,
          isPrimary: c.isPrimary,
        }),
    );

    const audit = new AuditInfo({
      createdAt: raw.createdAt,
      createdBy: raw.createdBy,
      updatedAt: raw.updatedAt,
      updatedBy: raw.updatedBy,
      deletedAt: raw.deletedAt,
      deletedBy: raw.deletedBy,
    });

    return new Person({
      id: raw.id,
      code: raw.code,
      name,
      document,
      status: raw.status as unknown as PersonStatus,
      contactPoints,
      audit,
    });
  }

  static toPersistence(entity: Person): PersistencePersonData {
    return {
      id: entity.id,
      code: entity.code,
      givenNames: entity.name.givenNames,
      familyNames: entity.name.familyNames,
      displayName: entity.name.displayName,
      prefix: entity.name.prefix,
      suffix: entity.name.suffix,
      documentIssuingCountry: entity.document?.issuingCountry ?? null,
      documentType: entity.document?.type ? (entity.document.type as unknown as PrismaDocType) : null,
      documentNumber: entity.document?.number ?? null,
      documentFormatted: entity.document?.formattedNumber ?? null,
      status: entity.status as unknown as PrismaPersonStatus,
      createdAt: entity.audit.createdAt,
      createdBy: entity.audit.createdBy,
      updatedAt: entity.audit.updatedAt,
      updatedBy: entity.audit.updatedBy,
      deletedAt: entity.audit.deletedAt,
      deletedBy: entity.audit.deletedBy,
    };
  }

  static toPersistenceContacts(personId: string, contacts: readonly ContactInformation[]): PersistenceContactData[] {
    return contacts.map((c: ContactInformation): PersistenceContactData => ({
      id: c.id ?? crypto.randomUUID(),
      personId,
      type: c.type as unknown as PrismaContactType,
      value: c.value,
      label: c.label,
      isPrimary: c.isPrimary,
    }));
  }
}
