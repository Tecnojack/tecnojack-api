import { Injectable, Inject } from '@nestjs/common';
import { Organization } from '../../domain/entities/organization.entity.js';
import { OrganizationName } from '../../domain/value-objects/organization-name.value-object.js';
import { TaxDocument } from '../../domain/value-objects/tax-document.value-object.js';
import { ContactInformation } from '../../domain/value-objects/contact-information.value-object.js';
import { OrganizationNotFoundException, DuplicateTaxIdException } from '../../domain/errors/people.errors.js';
import { ORGANIZATION_REPOSITORY, type OrganizationRepositoryPort } from '../ports/organization.repository.port.js';
import type { UpdateOrganizationCommand } from './update-organization.command.js';

@Injectable()
export class UpdateOrganizationUseCase {
  constructor(
    @Inject(ORGANIZATION_REPOSITORY)
    private readonly organizationRepository: OrganizationRepositoryPort,
  ) {}

  async execute(command: UpdateOrganizationCommand): Promise<Organization> {
    const org = await this.organizationRepository.findById(command.id);
    if (!org) {
      throw new OrganizationNotFoundException(command.id);
    }

    if (command.legalName) {
      const updatedName = new OrganizationName({
        legalName: command.legalName,
        tradeName: command.tradeName ?? org.name.tradeName ?? undefined,
      });
      org.updateName(updatedName, command.actorId);
    }

    if (command.taxIdIssuingCountry && command.taxIdNumber) {
      const existing = await this.organizationRepository.findByTaxId(
        command.taxIdIssuingCountry,
        command.taxIdNumber,
      );

      if (existing && existing.id !== org.id) {
        throw new DuplicateTaxIdException(command.taxIdNumber, command.taxIdIssuingCountry);
      }

      const updatedTaxDoc = new TaxDocument({
        issuingCountry: command.taxIdIssuingCountry,
        taxId: command.taxIdNumber,
        verificationDigit: command.taxIdVerificationDigit,
      });
      org.updateTaxDocument(updatedTaxDoc, command.actorId);
    }

    if (command.status) {
      org.changeStatus(command.status, command.actorId);
    }

    if (command.contacts) {
      for (const c of command.contacts) {
        org.addContactPoint(
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

    return this.organizationRepository.save(org);
  }
}
