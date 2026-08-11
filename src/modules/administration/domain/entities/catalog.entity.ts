import { AggregateRoot } from '../../../../platform/domain/entities/aggregate-root.js';
import type { ISoftDeletable } from '../../../../platform/domain/interfaces/soft-deletable.interface.js';
import { AuditInfo } from '../../../../platform/domain/value-objects/audit-info.value-object.js';
import type { CatalogType } from '../enums/administration.enums.js';

export interface CatalogProps {
  id?: string;
  code: string;
  name: string;
  type: CatalogType;
  value: string;
  label: string;
  description?: string | null;
  audit?: AuditInfo;
}

export class Catalog extends AggregateRoot<string> implements ISoftDeletable {
  private readonly _code: string;
  private readonly _name: string;
  private readonly _type: CatalogType;
  private _value: string;
  private _label: string;
  private _description: string | null;
  private _audit: AuditInfo;

  constructor(props: CatalogProps) {
    if (!props.code || props.code.trim().length === 0) {
      throw new Error('Catalog code cannot be empty.');
    }
    if (!props.value || props.value.trim().length === 0) {
      throw new Error('Catalog value cannot be empty.');
    }
    if (!props.label || props.label.trim().length === 0) {
      throw new Error('Catalog label cannot be empty.');
    }

    const id = props.id ?? crypto.randomUUID();
    super(id);

    this._code = props.code.trim();
    this._name = props.name.trim();
    this._type = props.type;
    this._value = props.value.trim();
    this._label = props.label.trim();
    this._description = props.description?.trim() ?? null;
    this._audit = props.audit ?? AuditInfo.create();
  }

  get code(): string { return this._code; }
  get name(): string { return this._name; }
  get type(): CatalogType { return this._type; }
  get value(): string { return this._value; }
  get label(): string { return this._label; }
  get description(): string | null { return this._description; }
  get audit(): AuditInfo { return this._audit; }

  isDeleted(): boolean {
    return this._audit.isDeleted();
  }

  updateDetails(value: string, label: string, description?: string | null, actorId?: string): void {
    this.ensureNotDeleted();
    this._value = value.trim();
    this._label = label.trim();
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
      throw new Error('Catalog entry is deleted.');
    }
  }
}
