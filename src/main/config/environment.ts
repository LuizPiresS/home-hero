import { ZodError } from 'zod';
import { environmentSchema, NODE_ENV_VALUES } from './environment-schema.js';

export { NODE_ENV_VALUES } from './environment-schema.js';

export type NodeEnvironment = (typeof NODE_ENV_VALUES)[number];

export type AppEnvironment = {
  port: number;
  nodeEnv: NodeEnvironment;
  databaseUrl: string;
};

export class EnvironmentConfigError extends Error {
  constructor(public readonly issues: string[]) {
    super(`configuração de ambiente inválida: ${issues.join('; ')}`);
    this.name = 'EnvironmentConfigError';
  }
}

export const loadEnvironment = (environment: NodeJS.ProcessEnv): AppEnvironment => {
  const result = environmentSchema.safeParse(environment);

  if (!result.success) {
    throw new EnvironmentConfigError(toEnvironmentIssues(result.error));
  }

  return result.data;
};

const toEnvironmentIssues = (error: ZodError): string[] => {
  const issues = new Set<string>();

  for (const issue of error.issues) {
    if (issue.path[0] === 'PORT') {
      issues.add('PORT deve ser um número inteiro entre 1 e 65535');
    }
    if (issue.path[0] === 'NODE_ENV') {
      issues.add(`NODE_ENV deve ser um destes valores: ${NODE_ENV_VALUES.join(', ')}`);
    }
    if (issue.path[0] === 'DATABASE_URL') {
      issues.add('DATABASE_URL deve ser uma URL válida do PostgreSQL');
    }
  }

  return [...issues];
};
