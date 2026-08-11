import { registerAs } from '@nestjs/config';

export const storageConfig = registerAs('storage', () => ({
  provider: process.env.STORAGE_PROVIDER ?? 'local',
  bucket: process.env.STORAGE_BUCKET ?? 'tecnojack',
  localRoot: process.env.STORAGE_LOCAL_ROOT ?? 'storage/uploads',
  baseUrl: process.env.STORAGE_BASE_URL ?? 'http://localhost:3000/uploads',
  maxFileSizeBytes: Number(process.env.UPLOAD_MAX_FILE_SIZE_BYTES ?? 52_428_800),
  allowedExtensions: (process.env.STORAGE_ALLOWED_EXTENSIONS ?? 'png,jpg,jpeg,webp,gif,svg,pdf,doc,docx,xls,xlsx,csv,zip,mp4,mov').split(','),
}));
