import request from 'supertest';

import { app, createApp } from '../src/app';
import { env, loadEnv, RuntimeConfig } from '../src/config/env';

const productionConfig = (
  enableDemoRoutes: boolean,
): RuntimeConfig => ({
  ...env,
  nodeEnv: 'production',
  enableDemoRoutes,
  demoRoutesEnabled: enableDemoRoutes,
});

describe('Azure Container Apps Service Starter API', () => {
  let logSpy: jest.SpyInstance;
  let errorSpy: jest.SpyInstance;

  beforeEach(() => {
    logSpy = jest.spyOn(console, 'log').mockImplementation(() => undefined);
    errorSpy = jest.spyOn(console, 'error').mockImplementation(() => undefined);
  });

  afterEach(() => {
    logSpy.mockRestore();
    errorSpy.mockRestore();
  });

  it('returns configured service metadata from GET /', async () => {
    const response = await request(app).get('/');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      service: env.displayName,
      status: 'ok',
      environment: env.appEnv,
      version: env.appVersion,
    });
    expect(response.headers['x-powered-by']).toBeUndefined();
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

  it('returns intentionally shallow readiness status from GET /ready', async () => {
    const response = await request(app).get('/ready');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'ready' });
  });

  it('rejects JSON request bodies larger than 100 KB', async () => {
    const response = await request(app)
      .post('/missing-route')
      .send({ payload: 'x'.repeat(100 * 1024) });

    expect(response.status).toBe(413);
    expect(response.body).toEqual({
      error: 'Payload Too Large',
      message: 'Request body exceeds the 100 KB limit.',
    });
  });

  it('adds a generated request ID to the response and structured request log', async () => {
    const response = await request(app).get('/health?token=must-not-be-logged');
    const requestId = response.headers['x-request-id'];

    expect(requestId).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/,
    );

    const logEntry = logSpy.mock.calls
      .map(([message]) => JSON.parse(String(message)))
      .find((entry) => entry.requestId === requestId);

    expect(logEntry).toMatchObject({
      level: 'info',
      requestId,
      method: 'GET',
      path: '/health',
      statusCode: 200,
      durationMs: expect.any(Number),
      timestamp: expect.any(String),
    });
    expect(JSON.stringify(logEntry)).not.toContain('must-not-be-logged');
  });

  it('keeps demo routes available in tests and local development', async () => {
    const incidentResponse = await request(app).get('/api/incidents/demo');
    const errorResponse = await request(app).get('/error-demo');

    expect(incidentResponse.status).toBe(200);
    expect(incidentResponse.body).toMatchObject({
      incident: expect.any(String),
      severity: 'low',
      message: expect.any(String),
    });
    expect(errorResponse.status).toBe(500);
    expect(errorResponse.body).toEqual({
      error: 'Internal Server Error',
      message: 'An unexpected error occurred.',
    });
  });

  it('hides demo routes in production by default', async () => {
    const productionApp = createApp(productionConfig(false));

    await request(productionApp).get('/api/incidents/demo').expect(404);
    await request(productionApp).get('/error-demo').expect(404);
  });

  it('allows demo routes in production only when explicitly enabled', async () => {
    const productionApp = createApp(productionConfig(true));

    await request(productionApp).get('/api/incidents/demo').expect(200);
    await request(productionApp).get('/error-demo').expect(500);
  });

  it('returns a query-redacted 404 response for unknown routes', async () => {
    const response = await request(app).get('/missing-route?secret=value');

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      error: 'Not Found',
      message: 'Route /missing-route does not exist.',
    });
  });
});

describe('runtime configuration', () => {
  it('uses safe defaults when optional values are absent', () => {
    const config = loadEnv({});

    expect(config.port).toBe(3000);
    expect(config.demoRoutesEnabled).toBe(true);
    expect(config.enableDemoRoutes).toBe(false);
  });

  it.each(['0', '65536', 'not-a-port', '1.5'])(
    'rejects invalid PORT=%s',
    (port) => {
      expect(() => loadEnv({ PORT: port })).toThrow(
        'PORT must be an integer between 1 and 65535.',
      );
    },
  );

  it('rejects invalid demo-route flags', () => {
    expect(() => loadEnv({ ENABLE_DEMO_ROUTES: 'yes' })).toThrow(
      'ENABLE_DEMO_ROUTES must be either true or false.',
    );
  });

  it('gates demo routes in production unless explicitly enabled', () => {
    expect(loadEnv({ NODE_ENV: 'production' }).demoRoutesEnabled).toBe(false);
    expect(
      loadEnv({ NODE_ENV: 'production', ENABLE_DEMO_ROUTES: 'true' })
        .demoRoutesEnabled,
    ).toBe(true);
  });
});
