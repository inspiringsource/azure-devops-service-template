import request from 'supertest';

import { app } from '../src/app';
import { env } from '../src/config/env';

describe('Azure DevOps Service Starter API', () => {
  it('returns configured service metadata from GET /', async () => {
    const response = await request(app).get('/');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      service: env.displayName,
      status: 'ok',
      environment: env.appEnv,
      version: env.appVersion,
    });
  });

  it('returns health status with timestamp and uptime from GET /health', async () => {
    const response = await request(app).get('/health');

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      status: 'healthy',
      timestamp: expect.any(String),
      uptime: expect.any(Number),
    });
    expect(Number.isFinite(response.body.uptime)).toBe(true);
    expect(new Date(response.body.timestamp).toString()).not.toBe('Invalid Date');
  });

  it('returns readiness status from GET /ready', async () => {
    const response = await request(app).get('/ready');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      status: 'ready',
    });
  });

  it('returns the expected incident demo shape from GET /api/incidents/demo', async () => {
    const response = await request(app).get('/api/incidents/demo');

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      incident: expect.any(String),
      severity: 'low',
      message: expect.any(String),
    });
  });

  it('returns a 404 response for unknown routes', async () => {
    const response = await request(app).get('/missing-route');

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      error: 'Not Found',
      message: 'Route /missing-route does not exist.',
    });
  });

  it('returns a 500 response when an error is thrown', async () => {
    const response = await request(app).get('/error-demo');

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      error: 'Internal Server Error',
      message: 'An unexpected error occurred.',
    });
  });
});
