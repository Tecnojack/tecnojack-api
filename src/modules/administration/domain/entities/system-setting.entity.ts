import { AggregateRoot } from '../../../../platform/domain/entities/aggregate-root.js';
import type { ISoftDeletable } from '../../../../platform/domain/interfaces/soft-deletable.interface.js';
import { AuditInfo } from '../../../../platform/domain/value-objects/audit-info.value-object.js';
import type { SettingCategory } from '../enums/administration.enums.js';

export interface SystemSettingProps {
  id?: string;
  code: string;
  key: string;
  value: string;
  description?: string | null;
  category: SettingCategory;
  audit?: AuditInfo;
}

export class SystemSetting extends AggregateRoot<string> implements ISoftDeletable {
  private readonly _code: string;
  private readonly _key: string;
  private _value: string;
  private _description: string | null;
  private readonly _category: SettingCategory;
  private _audit: AuditInfo;

  constructor(props: SystemSettingProps) {
    if (!props.code || props.code.trim().length === 0) {
      throw new Error('SystemSetting code cannot be empty.');
    }
    if (!props.key || props.key.trim().length === 0) {
      throw new Error('SystemSetting key cannot be empty.');
    }

    const id = props.id ?? crypto.randomUUID();
    super(id);

    this._code = props.code.trim();
    this._key = props.key.trim();
    this._value = props.value;
    this._description = props.description?.trim() ?? null;
    this._category = props.category;
    this._audit = props.audit ?? AuditInfo.create();
  }

  get code(): string { return this._code; }
  get key(): string { return this._key; }
  get value(): string { return this._value; }
  get description(): string | null { return this._description; }
  get category(): SettingCategory { return this._category; }
  get audit(): AuditInfo { return this._audit; }

  isDeleted(): boolean {
    return this._audit.isDeleted();
  }

  updateValue(value: string, description?: string | null, actorId?: string): void {
    this.ensureNotDeleted();
    this._value = value;
    if (description !== undefined) {
      this._description = description?.trim() ?? null;
    }
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
      throw new Error('SystemSetting is deleted.');
    }
  }
}
