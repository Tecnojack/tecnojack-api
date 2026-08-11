import { registerAs } from '@nestjs/config';

export const imageConfig = registerAs('image', () => ({
  maxWidth: Number(process.env.IMAGE_MAX_WIDTH ?? 12_000),
}));
