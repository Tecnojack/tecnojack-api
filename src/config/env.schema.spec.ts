import { validateEnvironment } from './env.schema.js';

describe('validateEnvironment', () => {
  const validEnvironment = {
    DATABASE_URL: 'postgresql://user:password@localhost:5432/tecnojack',
    JWT_SECRET: 'a-secure-secret-with-at-least-32-characters',
  };

  it('applies safe defaults', () => {
    const environment = validateEnvironment(validEnvironment);

    expect(environment.NODE_ENV).toBe('development');
    expect(environment.PORT).toBe(3000);
    expect(environment.SWAGGER_ENABLED).toBe(false);
  });

  it('rejects a missing database URL', () => {
    expect(() => validateEnvironment({ JWT_SECRET: validEnvironment.JWT_SECRET })).toThrow(
      'DATABASE_URL',
    );
  });

  it('rejects weak JWT secrets', () => {
    expect(() => validateEnvironment({ ...validEnvironment, JWT_SECRET: 'too-short' })).toThrow(
      'JWT_SECRET',
    );
  });
});
