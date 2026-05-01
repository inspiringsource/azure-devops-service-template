import dotenv from 'dotenv';

import templateConfig from '../../template.config.json';

dotenv.config();

const parsePort = (value: string | undefined): number => {
  const parsed = Number(value);

  if (Number.isInteger(parsed) && parsed > 0) {
    return parsed;
  }

  return templateConfig.defaultPort;
};

export const env = {
  port: parsePort(process.env.PORT),
  nodeEnv: process.env.NODE_ENV ?? 'development',
  appEnv: process.env.APP_ENV ?? 'local',
  appVersion: process.env.APP_VERSION ?? '1.0.0',
  serviceName: process.env.SERVICE_NAME ?? templateConfig.serviceName,
  displayName: process.env.DISPLAY_NAME ?? templateConfig.displayName,
} as const;
