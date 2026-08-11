export class PersonNotFoundException extends Error {
  constructor(identifier: string) {
    super(`Person with identifier '${identifier}' was not found.`);
    this.name = 'PersonNotFoundException';
  }
}

export class OrganizationNotFoundException extends Error {
  constructor(identifier: string) {
    super(`Organization with identifier '${identifier}' was not found.`);
    this.name = 'OrganizationNotFoundException';
  }
}

export class DuplicateDocumentException extends Error {
  constructor(documentNumber: string, country?: string) {
    super(`A person with document '${documentNumber}' (${country ?? 'N/A'}) already exists.`);
    this.name = 'DuplicateDocumentException';
  }
}

export class DuplicateTaxIdException extends Error {
  constructor(taxId: string, country?: string) {
    super(`An organization with tax ID '${taxId}' (${country ?? 'N/A'}) already exists.`);
    this.name = 'DuplicateTaxIdException';
  }
}

export class PersonAlreadyDeletedException extends Error {
  constructor(personId: string) {
    super(`Person '${personId}' is already soft-deleted.`);
    this.name = 'PersonAlreadyDeletedException';
  }
}

export class OrganizationAlreadyDeletedException extends Error {
  constructor(organizationId: string) {
    super(`Organization '${organizationId}' is already soft-deleted.`);
    this.name = 'OrganizationAlreadyDeletedException';
  }
}
