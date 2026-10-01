export const NODE_ENV_VALUES = ['development', 'test', 'production'] as const;

export type NodeEnvironment = (typeof NODE_ENV_VALUES)[number];

export type AppEnvironment = {
  port: number;
  nodeEnv: NodeEnvironment;
};

export class EnvironmentConfigError extends Error {
  constructor(public readonly issues: string[]) {
    super(`configuração de ambiente inválida: ${issues.join('; ')}`);
    this.name = 'EnvironmentConfigError';
  }
}

export const loadEnvironment = (environment: NodeJS.ProcessEnv): AppEnvironment => {
  const issues: string[] = [];
  const port = parsePort(environment.PORT, issues);
  const nodeEnv = parseNodeEnvironment(environment.NODE_ENV, issues);

  if (issues.length > 0 || !nodeEnv) {
    throw new EnvironmentConfigError(issues);
  }

  return { port, nodeEnv };
};

const parsePort = (value: string | undefined, issues: string[]): number => {
  const rawValue = value ?? '3000';
  const port = Number(rawValue);

  if (!/^\d+$/.test(rawValue) || !Number.isInteger(port) || port < 1 || port > 65535) {
    issues.push('PORT deve ser um número inteiro entre 1 e 65535');
  }

  return port;
};

const parseNodeEnvironment = (value: string | undefined, issues: string[]): NodeEnvironment | null => {
  const nodeEnv = value ?? 'development';

  if (!NODE_ENV_VALUES.includes(nodeEnv as NodeEnvironment)) {
    issues.push(`NODE_ENV deve ser um destes valores: ${NODE_ENV_VALUES.join(', ')}`);
    return null;
  }

  return nodeEnv as NodeEnvironment;
};
