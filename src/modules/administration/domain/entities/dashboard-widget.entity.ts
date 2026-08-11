import { AggregateRoot } from '../../../../platform/domain/entities/aggregate-root.js';
import type { ISoftDeletable } from '../../../../platform/domain/interfaces/soft-deletable.interface.js';
import { AuditInfo } from '../../../../platform/domain/value-objects/audit-info.value-object.js';
import type { WidgetType, WidgetSize } from '../enums/administration.enums.js';

export interface DashboardWidgetProps {
  id?: string;
  code: string;
  title: string;
  type: WidgetType;
  dataSourceUrl: string;
  position?: number;
  size: WidgetSize;
  permissions?: string[];
  audit?: AuditInfo;
}

export class DashboardWidget extends AggregateRoot<string> implements ISoftDeletable {
  private readonly _code: string;
  private _title: string;
  private _type: WidgetType;
  private _dataSourceUrl: string;
  private _position: number;
  private _size: WidgetSize;
  private _permissions: string[];
  private _audit: AuditInfo;

  constructor(props: DashboardWidgetProps) {
    if (!props.code || props.code.trim().length === 0) {
      throw new Error('DashboardWidget code cannot be empty.');
    }
    if (!props.title || props.title.trim().length === 0) {
      throw new Error('DashboardWidget title cannot be empty.');
    }

    const id = props.id ?? crypto.randomUUID();
    super(id);

    this._code = props.code.trim();
    this._title = props.title.trim();
    this._type = props.type;
    this._dataSourceUrl = props.dataSourceUrl;
    this._position = props.position ?? 0;
    this._size = props.size;
    this._permissions = props.permissions ? [...props.permissions] : [];
    this._audit = props.audit ?? AuditInfo.create();
  }

  get code(): string { return this._code; }
  get title(): string { return this._title; }
  get type(): WidgetType { return this._type; }
  get dataSourceUrl(): string { return this._dataSourceUrl; }
  get position(): number { return this._position; }
  get size(): WidgetSize { return this._size; }
  get permissions(): readonly string[] { return this._permissions; }
  get audit(): AuditInfo { return this._audit; }

  isDeleted(): boolean {
    return this._audit.isDeleted();
  }

  updateDetails(
    title: string,
    type: WidgetType,
    dataSourceUrl: string,
    position: number,
    size: WidgetSize,
    permissions: string[],
    actorId?: string,
  ): void {
    this.ensureNotDeleted();
    this._title = title.trim();
    this._type = type;
    this._dataSourceUrl = dataSourceUrl;
    this._position = position;
    this._size = size;
    this._permissions = [...permissions];
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
      throw new Error('DashboardWidget is deleted.');
    }
  }
}
