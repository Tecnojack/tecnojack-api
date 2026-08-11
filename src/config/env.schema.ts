import { z } from 'zod';

const booleanFromEnvironment = z.enum(['true', 'false']).transform((value) => value === 'true');

const environmentSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().max(65_535).default(3000),
  API_PREFIX: z.string().trim().min(1).default('api'),
  API_VERSION: z.coerce.number().int().positive().default(1),
  DATABASE_URL: z.url().startsWith('postgresql://'),
  JWT_SECRET: z.string().min(32),
  JWT_ACCESS_TTL: z.string().min(2).default('15m'),
  REFRESH_TOKEN_TTL: z.string().min(2).default('30d'),
  CORS_ORIGINS: z.string().default('http://localhost:4200'),
  CORS_CREDENTIALS: booleanFromEnvironment.default(true),
  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']).default('info'),
  LOG_PRETTY: booleanFromEnvironment.default(false),
  SWAGGER_ENABLED: booleanFromEnvironment.default(false),
  SWAGGER_PATH: z.string().trim().min(1).default('docs'),
  RATE_LIMIT_TTL_MS: z.coerce.number().int().positive().default(60_000),
  RATE_LIMIT_LIMIT: z.coerce.number().int().positive().default(100),
  STORAGE_PROVIDER: z.enum(['local', 's3', 'r2', 'azure', 'minio']).default('local'),
  STORAGE_BUCKET: z.string().trim().min(1).default('tecnojack'),
  STORAGE_LOCAL_ROOT: z.string().trim().min(1).default('storage/uploads'),
  STORAGE_BASE_URL: z.string().trim().default('http://localhost:3000/uploads'),
  MAIL_PROVIDER: z.enum(['log', 'smtp']).default('log'),
  UPLOAD_MAX_FILE_SIZE_BYTES: z.coerce.number().int().positive().default(52_428_800),
  IMAGE_MAX_WIDTH: z.coerce.number().int().positive().default(12_000),
  FFMPEG_PATH: z.string().trim().min(1).default('ffmpeg'),
});

export type Environment = z.infer<typeof environmentSchema>;

export function validateEnvironment(configuration: Record<string, unknown>): Environment {
  const result = environmentSchema.safeParse(configuration);

  if (!result.success) {
    const details = result.error.issues
      .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
      .join('; ');
    throw new Error(`Invalid environment configuration: ${details}`);
  }

  return result.data;
}
