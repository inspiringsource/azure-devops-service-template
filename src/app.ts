import express from 'express';

import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { requestLogger } from './middleware/requestLogger';
import { router } from './routes';

export const app = express();

app.use(express.json());
app.use(requestLogger);
app.use(router);
app.use(notFoundHandler);
app.use(errorHandler);
