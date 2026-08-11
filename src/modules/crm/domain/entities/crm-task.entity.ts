export interface CRMTaskProps {
  id?: string;
  opportunityId: string;
  title: string;
  description?: string | null;
  dueDate: Date;
  isCompleted?: boolean;
  completedAt?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export class CRMTask {
  readonly id: string;
  readonly opportunityId: string;
  private _title: string;
  private _description: string | null;
  readonly dueDate: Date;
  private _isCompleted: boolean;
  private _completedAt: Date | null;
  readonly createdAt: Date;
  private _updatedAt: Date;

  constructor(props: CRMTaskProps) {
    if (!props.title || props.title.trim().length === 0) {
      throw new Error('CRMTask title cannot be empty.');
    }

    this.id = props.id ?? crypto.randomUUID();
    this.opportunityId = props.opportunityId;
    this._title = props.title.trim();
    this._description = props.description?.trim() ?? null;
    this.dueDate = props.dueDate;
    this._isCompleted = props.isCompleted ?? false;
    this._completedAt = props.completedAt ?? null;
    this.createdAt = props.createdAt ?? new Date();
    this._updatedAt = props.updatedAt ?? new Date();
  }

  get title(): string { return this._title; }
  get description(): string | null { return this._description; }
  get isCompleted(): boolean { return this._isCompleted; }
  get completedAt(): Date | null { return this._completedAt; }
  get updatedAt(): Date { return this._updatedAt; }

  complete(): void {
    this._isCompleted = true;
    this._completedAt = new Date();
    this._updatedAt = new Date();
  }
}
