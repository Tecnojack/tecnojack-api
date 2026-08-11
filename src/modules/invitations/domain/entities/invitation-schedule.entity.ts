export interface InvitationScheduleProps {
  id?: string;
  title: string;
  description?: string | null;
  timeLabel: string;
  locationLabel?: string | null;
  orderIndex?: number;
}

export class InvitationSchedule {
  readonly id: string;
  private _title: string;
  private _description: string | null;
  private _timeLabel: string;
  private _locationLabel: string | null;
  private _orderIndex: number;

  constructor(props: InvitationScheduleProps) {
    if (!props.title || props.title.trim().length === 0) {
      throw new Error('Schedule title cannot be empty.');
    }
    if (!props.timeLabel || props.timeLabel.trim().length === 0) {
      throw new Error('Schedule timeLabel cannot be empty.');
    }

    this.id = props.id ?? crypto.randomUUID();
    this._title = props.title.trim();
    this._description = props.description?.trim() ?? null;
    this._timeLabel = props.timeLabel.trim();
    this._locationLabel = props.locationLabel?.trim() ?? null;
    this._orderIndex = props.orderIndex ?? 0;
  }

  get title(): string { return this._title; }
  get description(): string | null { return this._description; }
  get timeLabel(): string { return this._timeLabel; }
  get locationLabel(): string | null { return this._locationLabel; }
  get orderIndex(): number { return this._orderIndex; }

  update(title: string, description: string | null, timeLabel: string, locationLabel: string | null, orderIndex: number): void {
    this._title = title.trim();
    this._description = description?.trim() ?? null;
    this._timeLabel = timeLabel.trim();
    this._locationLabel = locationLabel?.trim() ?? null;
    this._orderIndex = orderIndex;
  }
}
