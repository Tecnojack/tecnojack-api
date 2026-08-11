import { appConfig } from './app.config.js';
import { authConfig } from './auth.config.js';
import { corsConfig } from './cors.config.js';
import { databaseConfig } from './database.config.js';
import { ffmpegConfig } from './ffmpeg.config.js';
import { imageConfig } from './image.config.js';
import { loggingConfig } from './logging.config.js';
import { mailConfig } from './mail.config.js';
import { rateLimitConfig } from './rate-limit.config.js';
import { storageConfig } from './storage.config.js';
import { swaggerConfig } from './swagger.config.js';
import { uploadConfig } from './upload.config.js';

export const configurationFactories = [
  appConfig,
  authConfig,
  corsConfig,
  databaseConfig,
  ffmpegConfig,
  imageConfig,
  loggingConfig,
  mailConfig,
  rateLimitConfig,
  storageConfig,
  swaggerConfig,
  uploadConfig,
];
