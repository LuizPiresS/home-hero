export type HealthStatus = {
  status: 'ok';
  service: string;
};

export type HealthCheck = () => HealthStatus;

// Um caso de uso simples, sem Express, serve também como exemplo da camada de aplicação.
export const createHealthCheck = (service: string): HealthCheck => () => ({
  status: 'ok',
  service,
});
