process.env.NODE_ENV = 'test';
process.env.DATABASE_URL ??= 'postgresql://tecnojack:tecnojack@localhost:5432/tecnojack_test';
process.env.JWT_SECRET ??= 'test-secret-with-at-least-thirty-two-characters';
process.env.LOG_LEVEL ??= 'fatal';
process.env.LOG_PRETTY ??= 'false';
process.env.SWAGGER_ENABLED ??= 'false';
