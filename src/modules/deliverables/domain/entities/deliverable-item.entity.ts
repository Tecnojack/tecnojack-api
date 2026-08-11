export interface DeliverableItemProps {
  id?: string;
  deliverableId: string;
  mediaAssetId?: string | null;
  title: string;
  description?: string | null;
  quantity?: number;
  isCompleted?: boolean;
  sortOrder?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export class DeliverableItem {
  readonly id: string;
  readonly deliverableId: string;
  private _mediaAssetId: string | null;
  private _title: string;
  private _description: string | null;
  private _quantity: number;
  private _isCompleted: boolean;
  private _sortOrder: number;
  readonly createdAt: Date;
  private _updatedAt: Date;

  constructor(props: DeliverableItemProps) {
    if (!props.title || props.title.trim().length === 0) {
      throw new Error('DeliverableItem title cannot be empty.');
    }

    this.id = props.id ?? crypto.randomUUID();
    this.deliverableId = props.deliverableId;
    this._mediaAssetId = props.mediaAssetId ?? null;
    this._title = props.title.trim();
    this._description = props.description?.trim() ?? null;
    this._quantity = Math.max(1, props.quantity ?? 1);
    this._isCompleted = props.isCompleted ?? false;
    this._sortOrder = props.sortOrder ?? 0;
    this.createdAt = props.createdAt ?? new Date();
    this._updatedAt = props.updatedAt ?? new Date();
  }

  get mediaAssetId(): string | null { return this._mediaAssetId; }
  get title(): string { return this._title; }
  get description(): string | null { return this._description; }
  get quantity(): number { return this._quantity; }
  get isCompleted(): boolean { return this._isCompleted; }
  get sortOrder(): number { return this._sortOrder; }
  get updatedAt(): Date { return this._updatedAt; }

  updateDetails(title?: string, description?: string | null, quantity?: number, mediaAssetId?: string | null): void {
    if (title) this._title = title.trim();
    if (description !== undefined) this._description = description?.trim() ?? null;
    if (quantity !== undefined) this._quantity = Math.max(1, quantity);
    if (mediaAssetId !== undefined) this._mediaAssetId = mediaAssetId ?? null;
    this._updatedAt = new Date();
  }

  toggleCompleted(completed?: boolean): void {
    this._isCompleted = completed ?? !this._isCompleted;
    this._updatedAt = new Date();
  }
}
