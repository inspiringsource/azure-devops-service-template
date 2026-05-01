import { app } from './app';
import { env } from './config/env';

app.listen(env.port, () => {
  console.log(
    `Azure DevOps Service Template listening on port ${env.port} in ${env.appEnv}.`,
  );
});
