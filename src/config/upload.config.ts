import { registerAs } from '@nestjs/config';

export const uploadConfig = registerAs('upload', () => ({
  maxFileSizeBytes: Number(process.env.UPLOAD_MAX_FILE_SIZE_BYTES ?? 52_428_800),
}));
