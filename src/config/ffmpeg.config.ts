import { registerAs } from '@nestjs/config';

export const ffmpegConfig = registerAs('ffmpeg', () => ({
  path: process.env.FFMPEG_PATH ?? 'ffmpeg',
}));
