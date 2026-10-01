import { describe, expect, it } from 'vitest';
import { EnvironmentConfigError, loadEnvironment } from './environment.js';

describe('loadEnvironment', () => {
  it('requires DATABASE_URL before startup', () => {
    expect(() => loadEnvironment({})).toThrow(/DATABASE_URL/);
  });

  it('accepts a valid port and supported runtime environment', () => {
    expect(loadEnvironment({ PORT: '8080', NODE_ENV: 'production', DATABASE_URL: 'postgresql://user:pass@localhost:5432/home_hero' })).toEqual({
      port: 8080,
      nodeEnv: 'production',
      databaseUrl: 'postgresql://user:pass@localhost:5432/home_hero',
    });
  });

  it.each(['0', '65536', '3000.5', 'abc', ''])('rejects invalid PORT value "%s"', (PORT) => {
    expect(() => loadEnvironment({ PORT, DATABASE_URL: 'postgresql://user:pass@localhost:5432/home_hero' })).toThrow(EnvironmentConfigError);
  });

  it('rejects an unsupported NODE_ENV', () => {
    expect(() => loadEnvironment({ NODE_ENV: 'staging', DATABASE_URL: 'postgresql://user:pass@localhost:5432/home_hero' })).toThrow(/NODE_ENV/);
  });

  it('rejects a non-PostgreSQL DATABASE_URL', () => {
    expect(() => loadEnvironment({ DATABASE_URL: 'https://example.com' })).toThrow(/DATABASE_URL/);
  });

  it('reports every invalid platform variable before startup', () => {
    try {
      loadEnvironment({ PORT: 'invalid', NODE_ENV: 'staging', DATABASE_URL: 'not-a-url' });
      throw new Error('expected environment validation to fail');
    } catch (error) {
      expect(error).toBeInstanceOf(EnvironmentConfigError);
      expect((error as EnvironmentConfigError).issues).toEqual([
        'PORT deve ser um número inteiro entre 1 e 65535',
        'NODE_ENV deve ser um destes valores: development, test, production',
        'DATABASE_URL deve ser uma URL válida do PostgreSQL',
      ]);
    }
  });
});
