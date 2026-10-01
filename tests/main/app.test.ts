import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { createApp } from '../../src/main/app.js';

describe('Home Hero API', () => {
  it('exposes the health endpoint with the configured service name', async () => {
    const response = await request(createApp({ serviceName: 'test-api' })).get('/health');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'ok', service: 'test-api' });
  });

  it('does not expose Express implementation details', async () => {
    const response = await request(createApp()).get('/health');

    expect(response.headers['x-powered-by']).toBeUndefined();
  });
});
