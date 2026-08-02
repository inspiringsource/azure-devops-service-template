import { Router } from 'express';

import { RuntimeConfig } from '../config/env';

export const createRouter = (config: RuntimeConfig): Router => {
  const router = Router();

  router.get('/', (_req, res) => {
    res.json({
      service: config.displayName,
      status: 'ok',
      environment: config.appEnv,
      version: config.appVersion,
    });
  });

  router.get('/health', (_req, res) => {
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    });
  });

  router.get('/ready', (_req, res) => {
    res.json({
      status: 'ready',
    });
  });

  if (config.demoRoutesEnabled) {
    router.get('/api/incidents/demo', (_req, res) => {
      res.json({
        incident: 'simulated_latency_warning',
        severity: 'low',
        message:
          'This endpoint demonstrates how incidents could be surfaced in logs or monitoring.',
      });
    });

    router.get('/error-demo', (_req, _res, next) => {
      next(new Error('Simulated failure for middleware validation.'));
    });
  }

  return router;
};
