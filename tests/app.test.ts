import request from 'supertest';

import { app } from '../src/app';

describe('Azure DevOps Service Template API', () => {
  it('returns service metadata from GET /', async () => {
    const response = await request(app).get('/');

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      service: 'Azure DevOps Service Template',
      status: 'ok',
      environment: expect.any(String),
      version: expect.any(String),
    });
  });

  it('returns health status from GET /health', async () => {
    const response = await request(app).get('/health');

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      status: 'healthy',
      timestamp: expect.any(String),
      uptime: expect.any(Number),
    });
  });

  it('returns readiness status from GET /ready', async () => {
    const response = await request(app).get('/ready');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      status: 'ready',
    });
  });

  it('returns the simulated incident payload from GET /api/incidents/demo', async () => {
    const response = await request(app).get('/api/incidents/demo');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      incident: 'simulated_latency_warning',
      severity: 'low',
      message:
        'This endpoint demonstrates how incidents could be surfaced in logs or monitoring.',
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
