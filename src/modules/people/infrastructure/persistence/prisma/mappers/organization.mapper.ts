import type { OrganizationModel as PrismaOrg } from '../../../../../../generated/prisma/models/Organization.js';
import type { OrganizationContactInfoModel as PrismaOrgContact } from '../../../../../../generated/prisma/models/OrganizationContactInfo.js';
import type {
  OrganizationStatus as PrismaOrgStatus,
  ContactType as PrismaContactType,
} from '../../../../../../generated/prisma/enums.js';
import { Organization } from '../../../../domain/entities/organization.entity.js';
import { OrganizationName } from '../../../../domain/value-objects/organization-name.value-object.js';
import { TaxDocument } from '../../../../domain/value-objects/tax-document.value-object.js';
import { ContactInformation } from '../../../../domain/value-objects/contact-information.value-object.js';
import { AuditInfo } from '../../../../../../platform/domain/value-objects/audit-info.value-object.js';
import type { OrganizationStatus, ContactType } from '../../../../domain/enums/people.enums.js';

export type PrismaOrgWithContacts = PrismaOrg & {
  contactInformation?: PrismaOrgContact[];
};

export interface PersistenceOrgData {
  id: string;
  code: string;
  legalName: string;
  tradeName: string | null;
  taxIdIssuingCountry: string | null;
  taxIdNumber: string | null;
  taxIdVerificationDigit: string | null;
  status: PrismaOrgStatus;
  createdAt: Date;
  createdBy: string | null;
  updatedAt: Date;
  updatedBy: string | null;
  deletedAt: Date | null;
  deletedBy: string | null;
}

export interface PersistenceOrgContactData {
  id: string;
  organizationId: string;
  type: PrismaContactType;
  value: string;
  label: string | null;
  isPrimary: boolean;
}

export class OrganizationMapper {
  static toDomain(raw: PrismaOrgWithContacts): Organization {
    const name = new OrganizationName({
      legalName: raw.legalName,
      tradeName: raw.tradeName,
    });

    let taxDocument: TaxDocument | null = null;
    if (raw.taxIdIssuingCountry && raw.taxIdNumber) {
      taxDocument = new TaxDocument({
        issuingCountry: raw.taxIdIssuingCountry,
        taxId: raw.taxIdNumber,
        verificationDigit: raw.taxIdVerificationDigit,
      });
    }

    const contactPoints = (raw.contactInformation ?? []).map(
      (c: PrismaOrgContact): ContactInformation =>
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

    return new Organization({
      id: raw.id,
      code: raw.code,
      name,
      taxDocument,
      status: raw.status as unknown as OrganizationStatus,
      contactPoints,
      audit,
    });
  }

  static toPersistence(entity: Organization): PersistenceOrgData {
    return {
      id: entity.id,
      code: entity.code,
      legalName: entity.name.legalName,
      tradeName: entity.name.tradeName,
      taxIdIssuingCountry: entity.taxDocument?.issuingCountry ?? null,
      taxIdNumber: entity.taxDocument?.taxId ?? null,
      taxIdVerificationDigit: entity.taxDocument?.verificationDigit ?? null,
      status: entity.status as unknown as PrismaOrgStatus,
      createdAt: entity.audit.createdAt,
      createdBy: entity.audit.createdBy,
      updatedAt: entity.audit.updatedAt,
      updatedBy: entity.audit.updatedBy,
      deletedAt: entity.audit.deletedAt,
      deletedBy: entity.audit.deletedBy,
    };
  }

  static toPersistenceContacts(organizationId: string, contacts: readonly ContactInformation[]): PersistenceOrgContactData[] {
    return contacts.map((c: ContactInformation): PersistenceOrgContactData => ({
      id: c.id ?? crypto.randomUUID(),
      organizationId,
      type: c.type as unknown as PrismaContactType,
      value: c.value,
      label: c.label,
      isPrimary: c.isPrimary,
    }));
  }
}
