export class EventException extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class EventNotFoundException extends EventException {
  constructor(identifier: string) {
    super(`Event with identifier "${identifier}" was not found.`);
  }
}

export class EventAlreadyDeletedException extends EventException {
  constructor(id: string) {
    super(`Event "${id}" is already deleted.`);
  }
}

export class InvalidEventStatusTransitionException extends EventException {
  constructor(current: string, target: string, reason?: string) {
    super(`Invalid event status transition from "${current}" to "${target}".${reason ? ` Reason: ${reason}` : ''}`);
  }
}

export class EventTypeNotFoundException extends EventException {
  constructor(identifier: string) {
    super(`Event type "${identifier}" was not found.`);
  }
}

export class LocationNotFoundException extends EventException {
  constructor(identifier: string) {
    super(`Location "${identifier}" was not found.`);
  }
}
