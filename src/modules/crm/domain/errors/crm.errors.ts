export class CRMException extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class OpportunityNotFoundException extends CRMException {
  constructor(identifier: string) {
    super(`Opportunity with identifier "${identifier}" was not found.`);
  }
}

export class OpportunityAlreadyDeletedException extends CRMException {
  constructor(id: string) {
    super(`Opportunity "${id}" is already deleted.`);
  }
}

export class InvalidPipelineStageTransitionException extends CRMException {
  constructor(from: string, to: string, reason?: string) {
    super(`Invalid pipeline stage transition from "${from}" to "${to}".${reason ? ` Reason: ${reason}` : ''}`);
  }
}

export class QuotationNotFoundException extends CRMException {
  constructor(id: string) {
    super(`Quotation "${id}" was not found.`);
  }
}

export class InvalidQuotationOperationException extends CRMException {
  constructor(reason: string) {
    super(`Invalid quotation operation: ${reason}`);
  }
}
