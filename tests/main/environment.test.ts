import { describe, expect, it } from 'vitest';
import { EnvironmentConfigError, loadEnvironment } from '../../src/main/config/environment.js';

describe('loadEnvironment', () => {
  it('uses safe defaults when optional environment variables are absent', () => {
    expect(loadEnvironment({})).toEqual({ port: 3000, nodeEnv: 'development' });
  });

  it('accepts a valid port and supported runtime environment', () => {
    expect(loadEnvironment({ PORT: '8080', NODE_ENV: 'production' })).toEqual({
      port: 8080,
      nodeEnv: 'production',
    });
  });

  it.each(['0', '65536', '3000.5', 'abc', ''])('rejects invalid PORT value "%s"', (PORT) => {
    expect(() => loadEnvironment({ PORT })).toThrow(EnvironmentConfigError);
  });

  it('rejects an unsupported NODE_ENV', () => {
    expect(() => loadEnvironment({ NODE_ENV: 'staging' })).toThrow(/NODE_ENV/);
  });

  it('reports every invalid platform variable before startup', () => {
    try {
      loadEnvironment({ PORT: 'invalid', NODE_ENV: 'staging' });
      throw new Error('expected environment validation to fail');
    } catch (error) {
      expect(error).toBeInstanceOf(EnvironmentConfigError);
      expect((error as EnvironmentConfigError).issues).toEqual([
        'PORT deve ser um número inteiro entre 1 e 65535',
        'NODE_ENV deve ser um destes valores: development, test, production',
      ]);
    }
  });
});
