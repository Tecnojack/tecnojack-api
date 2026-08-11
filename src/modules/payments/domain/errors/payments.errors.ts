export class PaymentException extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class PaymentNotFoundException extends PaymentException {
  constructor(identifier: string) {
    super(`Payment with identifier "${identifier}" was not found.`);
  }
}

export class PaymentAlreadyDeletedException extends PaymentException {
  constructor(id: string) {
    super(`Payment "${id}" is already deleted.`);
  }
}

export class InvalidPaymentStatusTransitionException extends PaymentException {
  constructor(current: string, target: string, reason?: string) {
    super(`Invalid payment status transition from "${current}" to "${target}".${reason ? ` Reason: ${reason}` : ''}`);
  }
}

export class InvalidTransactionAmountException extends PaymentException {
  constructor(amount: number, reason?: string) {
    super(`Invalid transaction amount "${amount}".${reason ? ` Reason: ${reason}` : ''}`);
  }
}
