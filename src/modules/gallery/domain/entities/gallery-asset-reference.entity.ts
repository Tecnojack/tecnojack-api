export interface GalleryAssetReferenceProps {
  id?: string;
  galleryId: string;
  albumId?: string | null;
  mediaAssetId: string;
  title?: string | null;
  caption?: string | null;
  sortOrder?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export class GalleryAssetReference {
  readonly id: string;
  readonly galleryId: string;
  private _albumId: string | null;
  readonly mediaAssetId: string;
  private _title: string | null;
  private _caption: string | null;
  private _sortOrder: number;
  readonly createdAt: Date;
  private _updatedAt: Date;

  constructor(props: GalleryAssetReferenceProps) {
    if (!props.mediaAssetId || props.mediaAssetId.trim().length === 0) {
      throw new Error('GalleryAssetReference mediaAssetId cannot be empty.');
    }

    this.id = props.id ?? crypto.randomUUID();
    this.galleryId = props.galleryId;
    this._albumId = props.albumId ?? null;
    this.mediaAssetId = props.mediaAssetId;
    this._title = props.title?.trim() ?? null;
    this._caption = props.caption?.trim() ?? null;
    this._sortOrder = props.sortOrder ?? 0;
    this.createdAt = props.createdAt ?? new Date();
    this._updatedAt = props.updatedAt ?? new Date();
  }

  get albumId(): string | null { return this._albumId; }
  get title(): string | null { return this._title; }
  get caption(): string | null { return this._caption; }
  get sortOrder(): number { return this._sortOrder; }
  get updatedAt(): Date { return this._updatedAt; }

  updateMetadata(title?: string | null, caption?: string | null, albumId?: string | null): void {
    if (title !== undefined) this._title = title?.trim() ?? null;
    if (caption !== undefined) this._caption = caption?.trim() ?? null;
    if (albumId !== undefined) this._albumId = albumId ?? null;
    this._updatedAt = new Date();
  }

  updateSortOrder(sortOrder: number): void {
    this._sortOrder = sortOrder;
    this._updatedAt = new Date();
  }
}
