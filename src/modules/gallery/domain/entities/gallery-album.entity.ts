export interface GalleryAlbumProps {
  id?: string;
  galleryId: string;
  name: string;
  description?: string | null;
  coverMediaAssetId?: string | null;
  sortOrder?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export class GalleryAlbum {
  readonly id: string;
  readonly galleryId: string;
  private _name: string;
  private _description: string | null;
  private _coverMediaAssetId: string | null;
  private _sortOrder: number;
  readonly createdAt: Date;
  private _updatedAt: Date;

  constructor(props: GalleryAlbumProps) {
    if (!props.name || props.name.trim().length === 0) {
      throw new Error('GalleryAlbum name cannot be empty.');
    }

    this.id = props.id ?? crypto.randomUUID();
    this.galleryId = props.galleryId;
    this._name = props.name.trim();
    this._description = props.description?.trim() ?? null;
    this._coverMediaAssetId = props.coverMediaAssetId ?? null;
    this._sortOrder = props.sortOrder ?? 0;
    this.createdAt = props.createdAt ?? new Date();
    this._updatedAt = props.updatedAt ?? new Date();
  }

  get name(): string { return this._name; }
  get description(): string | null { return this._description; }
  get coverMediaAssetId(): string | null { return this._coverMediaAssetId; }
  get sortOrder(): number { return this._sortOrder; }
  get updatedAt(): Date { return this._updatedAt; }

  updateDetails(name?: string, description?: string | null, coverMediaAssetId?: string | null): void {
    if (name) this._name = name.trim();
    if (description !== undefined) this._description = description?.trim() ?? null;
    if (coverMediaAssetId !== undefined) this._coverMediaAssetId = coverMediaAssetId ?? null;
    this._updatedAt = new Date();
  }

  updateSortOrder(sortOrder: number): void {
    this._sortOrder = sortOrder;
    this._updatedAt = new Date();
  }
}
