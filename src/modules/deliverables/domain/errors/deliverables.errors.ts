export class DeliverableException extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class DeliverableNotFoundException extends DeliverableException {
  constructor(identifier: string) {
    super(`Deliverable with identifier "${identifier}" was not found.`);
  }
}

export class DeliverableAlreadyDeletedException extends DeliverableException {
  constructor(id: string) {
    super(`Deliverable "${id}" is already deleted.`);
  }
}

export class InvalidDeliverableStatusTransitionException extends DeliverableException {
  constructor(current: string, target: string, reason?: string) {
    super(`Invalid deliverable status transition from "${current}" to "${target}".${reason ? ` Reason: ${reason}` : ''}`);
  }
}
