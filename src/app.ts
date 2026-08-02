import express from 'express';

import { env, RuntimeConfig } from './config/env';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { requestLogger } from './middleware/requestLogger';
import { createRouter } from './routes';

export const createApp = (config: RuntimeConfig = env) => {
  const application = express();

  application.disable('x-powered-by');
  application.use(express.json({ limit: '100kb' }));
  application.use(requestLogger);
  application.use(createRouter(config));
  application.use(notFoundHandler);
  application.use(errorHandler);

  return application;
};

export const app = createApp();
