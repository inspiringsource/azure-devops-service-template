import { Router } from 'express';

import { env } from '../config/env';

export const router = Router();

router.get('/', (_req, res) => {
  res.json({
    service: 'Azure DevOps Service Template',
    status: 'ok',
    environment: env.appEnv,
    version: env.appVersion,
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
