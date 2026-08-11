import type { OrganizationStatus } from '../../domain/enums/people.enums.js';
import { type CreateContactCommand } from '../create-person/create-person.command.js';

export interface UpdateOrganizationCommand {
  id: string;
  legalName?: string;
  tradeName?: string;
  taxIdIssuingCountry?: string;
  taxIdNumber?: string;
  taxIdVerificationDigit?: string;
  status?: OrganizationStatus;
  contacts?: CreateContactCommand[];
  actorId?: string;
}
