export interface MediaMetadataProps {
  originalName: string;
  normalizedName: string;
  mimeType: string;
  sizeBytes: number;
  path: string;
  url: string;
}

export class MediaMetadata {
  readonly originalName: string;
  readonly normalizedName: string;
  readonly mimeType: string;
  readonly sizeBytes: number;
  readonly path: string;
  readonly url: string;

  constructor(props: MediaMetadataProps) {
    if (!props.originalName || props.originalName.trim().length === 0) {
      throw new Error('Original name cannot be empty.');
    }
    if (!props.path || props.path.trim().length === 0) {
      throw new Error('Storage path cannot be empty.');
    }
    if (props.sizeBytes < 0) {
      throw new Error('Size in bytes cannot be negative.');
    }

    this.originalName = props.originalName.trim();
    this.normalizedName = props.normalizedName.trim();
    this.mimeType = props.mimeType.trim().toLowerCase();
    this.sizeBytes = props.sizeBytes;
    this.path = props.path.trim();
    this.url = props.url.trim();
  }
}
