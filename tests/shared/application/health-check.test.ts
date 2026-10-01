import { describe, expect, it } from 'vitest';
import { createHealthCheck } from '../../../src/shared/application/health-check.js';

describe('createHealthCheck', () => {
  it('returns a healthy status for the configured service', () => {
    const healthCheck = createHealthCheck('home-hero-api');

    expect(healthCheck()).toEqual({
      status: 'ok',
      service: 'home-hero-api',
    });
  });
});
