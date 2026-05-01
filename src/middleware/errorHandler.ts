import { NextFunction, Request, Response } from 'express';

export const notFoundHandler = (
  req: Request,
  res: Response,
): void => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.originalUrl} does not exist.`,
  });
};

export const errorHandler = (
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  void _next;

  console.error(
    JSON.stringify({
      level: 'error',
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
    }),
  );

  res.status(500).json({
    error: 'Internal Server Error',
    message: 'An unexpected error occurred.',
  });
};
