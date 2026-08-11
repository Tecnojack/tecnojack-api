import {
  EventSessionType,
  EventSessionStatus,
  EventDateStatus,
} from '../enums/events.enums.js';

export interface EventSessionProps {
  id?: string;
  eventId: string;
  locationId?: string | null;
  type?: EventSessionType;
  name: string;
  description?: string | null;
  status?: EventSessionStatus;
  dateStatus?: EventDateStatus;
  startAt?: Date | null;
  endAt?: Date | null;
  timezone?: string | null;
  allDay?: boolean;
  sortOrder?: number;
  notes?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export class EventSession {
  readonly id: string;
  readonly eventId: string;
  private _locationId: string | null;
  private _type: EventSessionType;
  private _name: string;
  private _description: string | null;
  private _status: EventSessionStatus;
  private _dateStatus: EventDateStatus;
  private _startAt: Date | null;
  private _endAt: Date | null;
  private _timezone: string | null;
  private _allDay: boolean;
  private _sortOrder: number;
  private _notes: string | null;
  readonly createdAt: Date;
  private _updatedAt: Date;

  constructor(props: EventSessionProps) {
    if (!props.name || props.name.trim().length === 0) {
      throw new Error('EventSession name cannot be empty.');
    }
    if (props.startAt && props.endAt && props.startAt > props.endAt) {
      throw new Error('EventSession startAt cannot be after endAt.');
    }

    this.id = props.id ?? crypto.randomUUID();
    this.eventId = props.eventId;
    this._locationId = props.locationId ?? null;
    this._type = props.type ?? EventSessionType.OTHER;
    this._name = props.name.trim();
    this._description = props.description?.trim() ?? null;
    this._status = props.status ?? EventSessionStatus.TENTATIVE;
    this._dateStatus = props.dateStatus ?? EventSessionStatus.TENTATIVE as unknown as EventDateStatus;
    this._startAt = props.startAt ?? null;
    this._endAt = props.endAt ?? null;
    this._timezone = props.timezone?.trim() ?? null;
    this._allDay = props.allDay ?? false;
    this._sortOrder = props.sortOrder ?? 0;
    this._notes = props.notes?.trim() ?? null;
    this.createdAt = props.createdAt ?? new Date();
    this._updatedAt = props.updatedAt ?? new Date();
  }

  get locationId(): string | null { return this._locationId; }
  get type(): EventSessionType { return this._type; }
  get name(): string { return this._name; }
  get description(): string | null { return this._description; }
  get status(): EventSessionStatus { return this._status; }
  get dateStatus(): EventDateStatus { return this._dateStatus; }
  get startAt(): Date | null { return this._startAt; }
  get endAt(): Date | null { return this._endAt; }
  get timezone(): string | null { return this._timezone; }
  get allDay(): boolean { return this._allDay; }
  get sortOrder(): number { return this._sortOrder; }
  get notes(): string | null { return this._notes; }
  get updatedAt(): Date { return this._updatedAt; }

  updateSchedule(startAt: Date | null, endAt: Date | null, timezone?: string | null): void {
    if (startAt && endAt && startAt > endAt) {
      throw new Error('EventSession startAt cannot be after endAt.');
    }
    this._startAt = startAt;
    this._endAt = endAt;
    if (timezone !== undefined) this._timezone = timezone;
    this._dateStatus = startAt && endAt ? EventDateStatus.CONFIRMED : EventDateStatus.TENTATIVE;
    this._updatedAt = new Date();
  }

  changeStatus(status: EventSessionStatus): void {
    this._status = status;
    this._updatedAt = new Date();
  }

  assignLocation(locationId: string | null): void {
    this._locationId = locationId;
    this._updatedAt = new Date();
  }
}
