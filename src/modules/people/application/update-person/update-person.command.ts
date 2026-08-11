import type { DocumentType, PersonStatus } from '../../domain/enums/people.enums.js';
import { type CreateContactCommand } from '../create-person/create-person.command.js';

export interface UpdatePersonCommand {
  id: string;
  givenNames?: string;
  familyNames?: string;
  displayName?: string;
  prefix?: string;
  suffix?: string;
  documentIssuingCountry?: string;
  documentType?: DocumentType;
  documentNumber?: string;
  documentFormatted?: string;
  status?: PersonStatus;
  contacts?: CreateContactCommand[];
  actorId?: string;
}
