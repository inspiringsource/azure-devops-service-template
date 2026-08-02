import { NextFunction, Request, Response } from 'express';

export const notFoundHandler = (
  req: Request,
  res: Response,
): void => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.path} does not exist.`,
  });
};

export const errorHandler = (
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  void _next;

  const statusCode =
    (error as Error & { status?: number }).status === 413 ? 413 : 500;

  console.error(
    JSON.stringify({
      level: 'error',
      requestId: res.locals.requestId,
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
    }),
  );

  if (statusCode === 413) {
    res.status(statusCode).json({
      error: 'Payload Too Large',
      message: 'Request body exceeds the 100 KB limit.',
    });
    return;
  }

  res.status(statusCode).json({
    error: 'Internal Server Error',
    message: 'An unexpected error occurred.',
  });
};
