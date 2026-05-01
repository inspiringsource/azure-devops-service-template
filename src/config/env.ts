import dotenv from 'dotenv';

dotenv.config();

const parsePort = (value: string | undefined): number => {
  const parsed = Number(value);

  if (Number.isInteger(parsed) && parsed > 0) {
    return parsed;
  }

  return 3000;
};

export const env = {
  port: parsePort(process.env.PORT),
  nodeEnv: process.env.NODE_ENV ?? 'development',
  appEnv: process.env.APP_ENV ?? 'local',
  appVersion: process.env.APP_VERSION ?? '1.0.0',
} as const;
