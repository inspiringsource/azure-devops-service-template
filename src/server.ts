import { app } from './app';
import { env } from './config/env';

app.listen(env.port, () => {
  console.log(
    `${env.displayName} (${env.serviceName}) listening on port ${env.port} in ${env.appEnv} with version ${env.appVersion}.`,
  );
});
