import { Injectable } from '@nestjs/common';
import {
  FileTooLargeStorageException,
  InvalidFileTypeStorageException,
} from '../errors/storage.errors.js';

@Injectable()
export class StorageValidatorService {
  private readonly defaultMimeMap: Record<string, string> = {
    png: 'image/png',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    webp: 'image/webp',
    gif: 'image/gif',
    svg: 'image/svg+xml',
    pdf: 'application/pdf',
    doc: 'application/msword',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    xls: 'application/vnd.ms-excel',
    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    csv: 'text/csv',
    zip: 'application/zip',
    mp4: 'video/mp4',
    mov: 'video/quicktime',
    mp3: 'audio/mpeg',
  };

  validateSize(sizeBytes: number, maxBytes: number): void {
    if (sizeBytes > maxBytes) {
      throw new FileTooLargeStorageException(sizeBytes, maxBytes);
    }
  }

  validateExtension(filename: string, allowedExtensions: string[]): void {
    const ext = this.extractExtension(filename);
    if (!ext) return;

    const normalizedAllowed = allowedExtensions.map((e) => e.trim().toLowerCase().replace(/^\./, ''));
    if (!normalizedAllowed.includes(ext.toLowerCase())) {
      throw new InvalidFileTypeStorageException(ext, normalizedAllowed);
    }
  }

  extractExtension(filename: string): string {
    const trimmed = filename.trim().toLowerCase();
    const lastDotIndex = trimmed.lastIndexOf('.');
    if (lastDotIndex <= 0) return '';
    return trimmed.slice(lastDotIndex + 1);
  }

  inferMimeType(filename: string, providedMimeType?: string): string {
    if (providedMimeType && providedMimeType.trim() !== 'application/octet-stream') {
      return providedMimeType.trim();
    }
    const ext = this.extractExtension(filename);
    return this.defaultMimeMap[ext] ?? providedMimeType ?? 'application/octet-stream';
  }
}
