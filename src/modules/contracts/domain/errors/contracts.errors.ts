export class ContractException extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class ContractNotFoundException extends ContractException {
  constructor(identifier: string) {
    super(`Contract with identifier "${identifier}" was not found.`);
  }
}

export class ContractAlreadyDeletedException extends ContractException {
  constructor(id: string) {
    super(`Contract "${id}" is already deleted.`);
  }
}

export class InvalidContractStatusTransitionException extends ContractException {
  constructor(current: string, target: string, reason?: string) {
    super(`Invalid contract status transition from "${current}" to "${target}".${reason ? ` Reason: ${reason}` : ''}`);
  }
}
