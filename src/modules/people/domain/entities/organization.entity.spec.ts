import { Organization } from './organization.entity.js';
import { OrganizationName } from '../value-objects/organization-name.value-object.js';
import { TaxDocument } from '../value-objects/tax-document.value-object.js';
import { OrganizationStatus } from '../enums/people.enums.js';
import { OrganizationAlreadyDeletedException } from '../errors/people.errors.js';

describe('Organization Aggregate Root Entity', () => {
  const createSampleOrg = (): Organization => {
    const name = new OrganizationName({
      legalName: 'Tecnojack Producciones S.A.S.',
      tradeName: 'TECNOJACK',
    });
    const taxDoc = new TaxDocument({
      issuingCountry: 'CO',
      taxId: '901.234.567',
      verificationDigit: '8',
    });
    return Organization.create({
      code: 'ORG-000001',
      name,
      taxDocument: taxDoc,
    }, 'actor-admin');
  };

  it('should create organization entity and publish OrganizationCreatedEvent', () => {
    const org = createSampleOrg();
    expect(org.id).toBeDefined();
    expect(org.code).toBe('ORG-000001');
    expect(org.name.legalName).toBe('Tecnojack Producciones S.A.S.');
    expect(org.status).toBe(OrganizationStatus.ACTIVE);
    expect(org.domainEvents).toHaveLength(1);
    expect(org.domainEvents[0]!.eventName).toBe('people.organization.created');
  });

  it('should update tax document and emit event', () => {
    const org = createSampleOrg();
    org.clearDomainEvents();

    const newTaxDoc = new TaxDocument({
      issuingCountry: 'CO',
      taxId: '901234567',
      verificationDigit: '9',
    });
    org.updateTaxDocument(newTaxDoc, 'editor-1');

    expect(org.taxDocument?.verificationDigit).toBe('9');
    expect(org.domainEvents[0]!.eventName).toBe('people.organization.updated');
  });

  it('should soft delete and restore organization', () => {
    const org = createSampleOrg();
    org.softDelete('deleter-user');

    expect(org.audit.isDeleted()).toBe(true);
    expect(() => org.softDelete('deleter-user')).toThrow(OrganizationAlreadyDeletedException);

    org.restore('restorer-user');
    expect(org.audit.isDeleted()).toBe(false);
  });
});
