import { type CreateContactCommand } from '../create-person/create-person.command.js';

export interface CreateOrganizationCommand {
  legalName: string;
  tradeName?: string;
  taxIdIssuingCountry?: string;
  taxIdNumber?: string;
  taxIdVerificationDigit?: string;
  contacts?: CreateContactCommand[];
  actorId?: string;
}
