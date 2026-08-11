import { AggregateRoot } from '../../../../platform/domain/entities/aggregate-root.js';
import type { ISoftDeletable } from '../../../../platform/domain/interfaces/soft-deletable.interface.js';
import { AuditInfo } from '../../../../platform/domain/value-objects/audit-info.value-object.js';
import { UserStatus } from '../enums/identity.enums.js';
import type { PasswordHash } from '../value-objects/password-hash.value-object.js';
import type { Claim } from '../value-objects/claim.value-object.js';
import type { AuthProvider } from '../value-objects/auth-provider.value-object.js';
import { UserCreatedEvent } from '../events/identity.events.js';

export interface UserProps {
  id?: string;
  code: string;
  email: string;
  passwordHash: PasswordHash;
  status?: UserStatus;
  isEmailVerified?: boolean;
  roleIds?: string[];
  claims?: Claim[];
  providers?: AuthProvider[];
  tenantId?: string | null;
  audit?: AuditInfo;
}

export class User extends AggregateRoot<string> implements ISoftDeletable {
  private readonly _code: string;
  private readonly _email: string;
  private _passwordHash: PasswordHash;
  private _status: UserStatus;
  private _isEmailVerified: boolean;
  private _roleIds: string[];
  private _claims: Claim[];
  private _providers: AuthProvider[];
  private readonly _tenantId: string | null;
  private _audit: AuditInfo;

  constructor(props: UserProps) {
    if (!props.code || props.code.trim().length === 0) {
      throw new Error('User code cannot be empty.');
    }
    if (!props.email || props.email.trim().length === 0) {
      throw new Error('User email cannot be empty.');
    }

    const id = props.id ?? crypto.randomUUID();
    super(id);

    this._code = props.code.trim();
    this._email = props.email.trim().toLowerCase();
    this._passwordHash = props.passwordHash;
    this._status = props.status ?? UserStatus.UNVERIFIED;
    this._isEmailVerified = props.isEmailVerified ?? false;
    this._roleIds = props.roleIds ? [...props.roleIds] : [];
    this._claims = props.claims ? [...props.claims] : [];
    this._providers = props.providers ? [...props.providers] : [];
    this._tenantId = props.tenantId ?? null;
    this._audit = props.audit ?? AuditInfo.create();
  }

  static create(props: UserProps, actorId?: string): User {
    const user = new User({ ...props, audit: AuditInfo.create(actorId) });
    user.addDomainEvent(
      new UserCreatedEvent({
        userId: user.id,
        code: user.code,
        email: user.email,
      }),
    );
    return user;
  }

  get code(): string { return this._code; }
  get email(): string { return this._email; }
  get passwordHash(): PasswordHash { return this._passwordHash; }
  get status(): UserStatus { return this._status; }
  get isEmailVerified(): boolean { return this._isEmailVerified; }
  get roleIds(): readonly string[] { return this._roleIds; }
  get claims(): readonly Claim[] { return this._claims; }
  get providers(): readonly AuthProvider[] { return this._providers; }
  get tenantId(): string | null { return this._tenantId; }
  get audit(): AuditInfo { return this._audit; }

  isDeleted(): boolean {
    return this._audit.isDeleted();
  }

  verifyEmail(actorId?: string): void {
    this.ensureNotDeleted();
    this._isEmailVerified = true;
    if (this._status === UserStatus.UNVERIFIED) {
      this._status = UserStatus.ACTIVE;
    }
    this._audit = this._audit.touch(actorId);
  }

  lockAccount(actorId?: string): void {
    this.ensureNotDeleted();
    this._status = UserStatus.LOCKED;
    this._audit = this._audit.touch(actorId);
  }

  resetPassword(newHash: PasswordHash, actorId?: string): void {
    this.ensureNotDeleted();
    this._passwordHash = newHash;
    this._audit = this._audit.touch(actorId);
  }

  assignRole(roleId: string, actorId?: string): void {
    this.ensureNotDeleted();
    if (!this._roleIds.includes(roleId)) {
      this._roleIds.push(roleId);
      this._audit = this._audit.touch(actorId);
    }
  }

  removeRole(roleId: string, actorId?: string): void {
    this.ensureNotDeleted();
    const idx = this._roleIds.indexOf(roleId);
    if (idx !== -1) {
      this._roleIds.splice(idx, 1);
      this._audit = this._audit.touch(actorId);
    }
  }

  setClaims(claims: Claim[], actorId?: string): void {
    this.ensureNotDeleted();
    this._claims = [...claims];
    this._audit = this._audit.touch(actorId);
  }

  addProvider(provider: AuthProvider, actorId?: string): void {
    this.ensureNotDeleted();
    if (!this._providers.some((p) => p.providerType === provider.providerType)) {
      this._providers.push(provider);
      this._audit = this._audit.touch(actorId);
    }
  }

  softDelete(actorId?: string): void {
    this._audit = this._audit.softDelete(actorId);
  }

  restore(actorId?: string): void {
    this._audit = this._audit.restore(actorId);
  }

  private ensureNotDeleted(): void {
    if (this._audit.isDeleted()) {
      throw new Error('User is deleted.');
    }
  }
}
