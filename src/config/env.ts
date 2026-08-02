import dotenv from 'dotenv';

import templateConfig from '../../template.config.json';

dotenv.config({ quiet: true });

const parsePort = (value: string | undefined): number => {
  if (value === undefined || value === '') {
    return templateConfig.defaultPort;
  }

  const parsed = Number(value);

  if (Number.isInteger(parsed) && parsed >= 1 && parsed <= 65535) {
    return parsed;
  }

  throw new Error('PORT must be an integer between 1 and 65535.');
};

const parseBoolean = (name: string, value: string | undefined): boolean => {
  if (value === undefined || value === '') {
    return false;
  }

  if (value === 'true') {
    return true;
  }

  if (value === 'false') {
    return false;
  }

  throw new Error(`${name} must be either true or false.`);
};

export type RuntimeConfig = Readonly<{
  port: number;
  nodeEnv: string;
  appEnv: string;
  appVersion: string;
  serviceName: string;
  displayName: string;
  enableDemoRoutes: boolean;
  demoRoutesEnabled: boolean;
}>;

export const loadEnv = (
  source: NodeJS.ProcessEnv = process.env,
): RuntimeConfig => {
  const nodeEnv = source.NODE_ENV ?? 'development';
  const enableDemoRoutes = parseBoolean(
    'ENABLE_DEMO_ROUTES',
    source.ENABLE_DEMO_ROUTES,
  );

  return {
    port: parsePort(source.PORT),
    nodeEnv,
    appEnv: source.APP_ENV ?? 'local',
    appVersion: source.APP_VERSION ?? '1.0.0',
    serviceName: source.SERVICE_NAME ?? templateConfig.serviceName,
    displayName: source.DISPLAY_NAME ?? templateConfig.displayName,
    enableDemoRoutes,
    demoRoutesEnabled: nodeEnv !== 'production' || enableDemoRoutes,
  };
};

export const env = loadEnv();
