export class InvitationsException extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class InvitationNotFoundException extends InvitationsException {
  constructor(identifier: string) {
    super(`Invitation "${identifier}" was not found.`);
  }
}

export class GuestNotFoundException extends InvitationsException {
  constructor(guestId: string) {
    super(`Guest "${guestId}" was not found.`);
  }
}

export class InvalidInvitationOperationException extends InvitationsException {
  constructor(reason: string) {
    super(`Invalid invitation operation: ${reason}`);
  }
}
