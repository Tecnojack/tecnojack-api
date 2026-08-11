import { Injectable } from '@nestjs/common';

@Injectable()
export class StoragePathGeneratorService {
  normalizeFilename(filename: string): string {
    const trimmed = filename.trim().toLowerCase();
    const lastDotIndex = trimmed.lastIndexOf('.');

    let baseName = trimmed;
    let ext = '';

    if (lastDotIndex > 0) {
      baseName = trimmed.slice(0, lastDotIndex);
      ext = trimmed.slice(lastDotIndex);
    }

    // Slugify base name: replace non-alphanumeric with dashes
    const slugifiedBase = baseName
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // remove diacritical marks / accents
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    const safeBase = slugifiedBase || 'file';
    const safeExt = ext.replace(/[^a-z0-9.]/g, '');

    return `${safeBase}${safeExt}`;
  }

  generatePath(filename: string, subfolder?: string): string {
    const normalized = this.normalizeFilename(filename);
    const date = new Date();
    const year = date.getUTCFullYear().toString();
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
    const day = date.getUTCDate().toString().padStart(2, '0');
    const uuidPrefix = crypto.randomUUID().slice(0, 8);

    const dateFolder = `${year}/${month}/${day}`;
    const uniqueFilename = `${uuidPrefix}-${normalized}`;

    if (subfolder && subfolder.trim().length > 0) {
      const cleanSubfolder = subfolder.trim().replace(/^\/+|\/+$/g, '');
      return `${cleanSubfolder}/${dateFolder}/${uniqueFilename}`;
    }

    return `${dateFolder}/${uniqueFilename}`;
  }
}
