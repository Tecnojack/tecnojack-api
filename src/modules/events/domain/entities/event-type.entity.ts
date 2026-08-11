import { EventPriority } from '../enums/events.enums.js';

export interface EventTypeProps {
  id?: string;
  code: string;
  name: string;
  description?: string | null;
  color?: string | null;
  icon?: string | null;
  isActive?: boolean;
  sortOrder?: number;
  defaultTimezone?: string | null;
  defaultPriority?: EventPriority;
  templateVersion?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export class EventType {
  readonly id: string;
  readonly code: string;
  private _name: string;
  private _description: string | null;
  private _color: string | null;
  private _icon: string | null;
  private _isActive: boolean;
  private _sortOrder: number;
  private _defaultTimezone: string | null;
  private _defaultPriority: EventPriority;
  private _templateVersion: number;
  readonly createdAt: Date;
  private _updatedAt: Date;

  constructor(props: EventTypeProps) {
    if (!props.code || props.code.trim().length === 0) {
      throw new Error('EventType code cannot be empty.');
    }
    if (!props.name || props.name.trim().length === 0) {
      throw new Error('EventType name cannot be empty.');
    }

    this.id = props.id ?? crypto.randomUUID();
    this.code = props.code.trim().toUpperCase();
    this._name = props.name.trim();
    this._description = props.description?.trim() ?? null;
    this._color = props.color?.trim() ?? null;
    this._icon = props.icon?.trim() ?? null;
    this._isActive = props.isActive ?? true;
    this._sortOrder = props.sortOrder ?? 0;
    this._defaultTimezone = props.defaultTimezone?.trim() ?? null;
    this._defaultPriority = props.defaultPriority ?? EventPriority.MEDIUM;
    this._templateVersion = props.templateVersion ?? 1;
    this.createdAt = props.createdAt ?? new Date();
    this._updatedAt = props.updatedAt ?? new Date();
  }

  get name(): string {
    return this._name;
  }

  get description(): string | null {
    return this._description;
  }

  get color(): string | null {
    return this._color;
  }

  get icon(): string | null {
    return this._icon;
  }

  get isActive(): boolean {
    return this._isActive;
  }

  get sortOrder(): number {
    return this._sortOrder;
  }

  get defaultTimezone(): string | null {
    return this._defaultTimezone;
  }

  get defaultPriority(): EventPriority {
    return this._defaultPriority;
  }

  get templateVersion(): number {
    return this._templateVersion;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  updateDetails(props: Partial<Pick<EventTypeProps, 'name' | 'description' | 'color' | 'icon' | 'sortOrder' | 'defaultTimezone' | 'defaultPriority'>>): void {
    if (props.name) this._name = props.name.trim();
    if (props.description !== undefined) this._description = props.description?.trim() ?? null;
    if (props.color !== undefined) this._color = props.color?.trim() ?? null;
    if (props.icon !== undefined) this._icon = props.icon?.trim() ?? null;
    if (props.sortOrder !== undefined) this._sortOrder = props.sortOrder;
    if (props.defaultTimezone !== undefined) this._defaultTimezone = props.defaultTimezone?.trim() ?? null;
    if (props.defaultPriority !== undefined) this._defaultPriority = props.defaultPriority;
    this._updatedAt = new Date();
  }

  deactivate(): void {
    this._isActive = false;
    this._updatedAt = new Date();
  }

  activate(): void {
    this._isActive = true;
    this._updatedAt = new Date();
  }
}
