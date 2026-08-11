import { AggregateRoot } from '../../../../platform/domain/entities/aggregate-root.js';
import type { ISoftDeletable } from '../../../../platform/domain/interfaces/soft-deletable.interface.js';
import { AuditInfo } from '../../../../platform/domain/value-objects/audit-info.value-object.js';

export interface FeatureFlagProps {
  id?: string;
  code: string;
  key: string;
  isEnabled?: boolean;
  description?: string | null;
  audit?: AuditInfo;
}

export class FeatureFlag extends AggregateRoot<string> implements ISoftDeletable {
  private readonly _code: string;
  private readonly _key: string;
  private _isEnabled: boolean;
  private _description: string | null;
  private _audit: AuditInfo;

  constructor(props: FeatureFlagProps) {
    if (!props.code || props.code.trim().length === 0) {
      throw new Error('FeatureFlag code cannot be empty.');
    }
    if (!props.key || props.key.trim().length === 0) {
      throw new Error('FeatureFlag key cannot be empty.');
    }

    const id = props.id ?? crypto.randomUUID();
    super(id);

    this._code = props.code.trim();
    this._key = props.key.trim();
    this._isEnabled = props.isEnabled ?? false;
    this._description = props.description?.trim() ?? null;
    this._audit = props.audit ?? AuditInfo.create();
  }

  get code(): string { return this._code; }
  get key(): string { return this._key; }
  get isEnabled(): boolean { return this._isEnabled; }
  get description(): string | null { return this._description; }
  get audit(): AuditInfo { return this._audit; }

  isDeleted(): boolean {
    return this._audit.isDeleted();
  }

  toggle(enabled: boolean, actorId?: string): void {
    this.ensureNotDeleted();
    this._isEnabled = enabled;
    this._audit = this._audit.touch(actorId);
  }

  updateDetails(description?: string | null, actorId?: string): void {
    this.ensureNotDeleted();
    this._description = description?.trim() ?? null;
    this._audit = this._audit.touch(actorId);
  }

  softDelete(actorId?: string): void {
    this._audit = this._audit.softDelete(actorId);
  }

  restore(actorId?: string): void {
    this._audit = this._audit.restore(actorId);
  }

  private ensureNotDeleted(): void {
    if (this._audit.isDeleted()) {
      throw new Error('FeatureFlag is deleted.');
    }
  }
}
