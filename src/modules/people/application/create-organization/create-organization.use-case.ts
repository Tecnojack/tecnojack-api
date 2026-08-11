import { Injectable, Inject } from '@nestjs/common';
import { Organization } from '../../domain/entities/organization.entity.js';
import { OrganizationName } from '../../domain/value-objects/organization-name.value-object.js';
import { TaxDocument } from '../../domain/value-objects/tax-document.value-object.js';
import { ContactInformation } from '../../domain/value-objects/contact-information.value-object.js';
import { DuplicateTaxIdException } from '../../domain/errors/people.errors.js';
import type { OrganizationRepositoryPort } from '../ports/organization.repository.port.js';
import type { CreateOrganizationCommand } from './create-organization.command.js';

export const ORGANIZATION_REPOSITORY = Symbol('ORGANIZATION_REPOSITORY');

@Injectable()
export class CreateOrganizationUseCase {
  constructor(
    @Inject(ORGANIZATION_REPOSITORY)
    private readonly organizationRepository: OrganizationRepositoryPort,
  ) {}

  async execute(command: CreateOrganizationCommand): Promise<Organization> {
    let taxDocument: TaxDocument | null = null;

    if (command.taxIdIssuingCountry && command.taxIdNumber) {
      const existing = await this.organizationRepository.findByTaxId(
        command.taxIdIssuingCountry,
        command.taxIdNumber,
      );

      if (existing) {
        throw new DuplicateTaxIdException(command.taxIdNumber, command.taxIdIssuingCountry);
      }

      taxDocument = new TaxDocument({
        issuingCountry: command.taxIdIssuingCountry,
        taxId: command.taxIdNumber,
        verificationDigit: command.taxIdVerificationDigit,
      });
    }

    const name = new OrganizationName({
      legalName: command.legalName,
      tradeName: command.tradeName,
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

    const code = await this.organizationRepository.nextCode();

    const organization = Organization.create(
      {
        code,
        name,
        taxDocument,
        contactPoints,
      },
      command.actorId,
    );

    return this.organizationRepository.save(organization);
  }
}
