import { app } from './app';
import { env } from './config/env';

const server = app.listen(env.port, () => {
  console.log(
    `${env.displayName} (${env.serviceName}) listening on port ${env.port} in ${env.appEnv} with version ${env.appVersion}.`,
  );
});

let shuttingDown = false;

const shutdown = (signal: NodeJS.Signals): void => {
  if (shuttingDown) {
    return;
  }

  shuttingDown = true;
  console.log(`${signal} received; shutting down gracefully.`);

  const forceExitTimer = setTimeout(() => {
    console.error('Graceful shutdown timed out; forcing exit.');
    process.exit(1);
  }, 10_000);
  forceExitTimer.unref();

  server.close((error) => {
    clearTimeout(forceExitTimer);

    if (error) {
      console.error('Server shutdown failed.', error);
      process.exit(1);
    }

    console.log('Server stopped.');
    process.exit(0);
  });
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
