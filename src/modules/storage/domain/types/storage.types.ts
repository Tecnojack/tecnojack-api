export interface StorageFile {
  buffer: Buffer;
  originalName: string;
  mimeType?: string;
  size?: number;
}

export interface UploadOptions {
  subfolder?: string;
  overrideFilename?: string;
  allowedExtensions?: string[];
  maxSizeBytes?: number;
  preserveOriginalName?: boolean;
}

export interface StoredFileObject {
  path: string;
  filename: string;
  mimeType: string;
  sizeBytes: number;
  url: string;
  createdAt: Date;
}

export interface StorageFileMetadata {
  path: string;
  sizeBytes: number;
  mimeType: string;
  createdAt: Date;
  updatedAt: Date;
}
