export class IdentityException extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class UserNotFoundException extends IdentityException {
  constructor(identifier: string) {
    super(`User with identifier "${identifier}" was not found.`);
  }
}

export class RoleNotFoundException extends IdentityException {
  constructor(identifier: string) {
    super(`Role "${identifier}" was not found.`);
  }
}

export class PermissionNotFoundException extends IdentityException {
  constructor(id: string) {
    super(`Permission "${id}" was not found.`);
  }
}

export class PolicyNotFoundException extends IdentityException {
  constructor(id: string) {
    super(`Policy "${id}" was not found.`);
  }
}

export class SessionNotFoundException extends IdentityException {
  constructor(id: string) {
    super(`Session "${id}" was not found.`);
  }
}

export class APIKeyNotFoundException extends IdentityException {
  constructor(id: string) {
    super(`APIKey "${id}" was not found.`);
  }
}

export class InvalidCredentialsException extends IdentityException {
  constructor() {
    super('Invalid credentials provided.');
  }
}

export class AccountLockedException extends IdentityException {
  constructor() {
    super('Account is locked due to multiple failed login attempts.');
  }
}
