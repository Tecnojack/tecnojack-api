import type { DocumentType, ContactType } from '../../domain/enums/people.enums.js';

export interface CreateContactCommand {
  type: ContactType;
  value: string;
  label?: string;
  isPrimary?: boolean;
}

export interface CreatePersonCommand {
  givenNames: string;
  familyNames?: string;
  displayName?: string;
  prefix?: string;
  suffix?: string;
  documentIssuingCountry?: string;
  documentType?: DocumentType;
  documentNumber?: string;
  documentFormatted?: string;
  contacts?: CreateContactCommand[];
  actorId?: string;
}
