import { AggregateRoot } from '../../../../platform/domain/entities/aggregate-root.js';
import type { ISoftDeletable } from '../../../../platform/domain/interfaces/soft-deletable.interface.js';
import { AuditInfo } from '../../../../platform/domain/value-objects/audit-info.value-object.js';

export interface APIKeyProps {
  id?: string;
  code: string;
  userId: string;
  keyHash: string;
  name: string;
  scopes?: string[];
  expiresAt: Date;
  isActive?: boolean;
  tenantId?: string | null;
  audit?: AuditInfo;
}

export class APIKey extends AggregateRoot<string> implements ISoftDeletable {
  private readonly _code: string;
  private readonly _userId: string;
  private _keyHash: string;
  private readonly _name: string;
  private readonly _scopes: string[];
  private _expiresAt: Date;
  private _isActive: boolean;
  private readonly _tenantId: string | null;
  private _audit: AuditInfo;

  constructor(props: APIKeyProps) {
    if (!props.code || props.code.trim().length === 0) {
      throw new Error('APIKey code cannot be empty.');
    }
    if (!props.userId || props.userId.trim().length === 0) {
      throw new Error('APIKey userId cannot be empty.');
    }

    const id = props.id ?? crypto.randomUUID();
    super(id);

    this._code = props.code.trim();
    this._userId = props.userId;
    this._keyHash = props.keyHash;
    this._name = props.name.trim();
    this._scopes = props.scopes ? [...props.scopes] : [];
    this._expiresAt = props.expiresAt;
    this._isActive = props.isActive ?? true;
    this._tenantId = props.tenantId ?? null;
    this._audit = props.audit ?? AuditInfo.create();
  }

  get code(): string { return this._code; }
  get userId(): string { return this._userId; }
  get keyHash(): string { return this._keyHash; }
  get name(): string { return this._name; }
  get scopes(): readonly string[] { return this._scopes; }
  get expiresAt(): Date { return this._expiresAt; }
  get isActive(): boolean { return this._isActive; }
  get tenantId(): string | null { return this._tenantId; }
  get audit(): AuditInfo { return this._audit; }

  isDeleted(): boolean {
    return this._audit.isDeleted();
  }

  revoke(actorId?: string): void {
    this.ensureNotDeleted();
    this._isActive = false;
    this._audit = this._audit.touch(actorId);
  }

  rotate(newHash: string, actorId?: string): void {
    this.ensureNotDeleted();
    this._keyHash = newHash;
    this._audit = this._audit.touch(actorId);
  }

  isExpired(): boolean {
    return this._expiresAt.getTime() < Date.now();
  }

  softDelete(actorId?: string): void {
    this._audit = this._audit.softDelete(actorId);
  }

  restore(actorId?: string): void {
    this._audit = this._audit.restore(actorId);
  }

  private ensureNotDeleted(): void {
    if (this._audit.isDeleted()) {
      throw new Error('APIKey is deleted.');
    }
  }
}
