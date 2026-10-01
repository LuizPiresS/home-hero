import { z } from 'zod';

export const NODE_ENV_VALUES = ['development', 'test', 'production'] as const;

const isValidPort = (value: string): boolean => {
  if (!/^\d+$/.test(value)) return false;
  const port = Number(value);
  return Number.isInteger(port) && port >= 1 && port <= 65535;
};

export const environmentSchema = z.object({
  PORT: z.string().default('3000').refine(isValidPort),
  NODE_ENV: z.enum(NODE_ENV_VALUES).default('development'),
  DATABASE_URL: z.string().url().refine(
    (value) => value.startsWith('postgres://') || value.startsWith('postgresql://'),
  ),
}).passthrough().transform(({ PORT, NODE_ENV, DATABASE_URL }) => ({
  port: Number(PORT),
  nodeEnv: NODE_ENV,
  databaseUrl: DATABASE_URL,
}));
