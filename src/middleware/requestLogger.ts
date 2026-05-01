import { NextFunction, Request, Response } from 'express';

export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const start = Date.now();

  res.on('finish', () => {
    const durationMs = Date.now() - start;
    console.log(
      JSON.stringify({
        level: 'info',
        method: req.method,
        path: req.originalUrl,
        statusCode: res.statusCode,
        durationMs,
        timestamp: new Date().toISOString(),
      }),
    );
  });

  next();
};
