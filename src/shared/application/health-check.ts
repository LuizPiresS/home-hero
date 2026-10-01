export type HealthStatus = {
  status: 'ok';
  service: string;
};

export type HealthCheck = () => HealthStatus;

export const createHealthCheck = (service: string): HealthCheck => () => ({
  status: 'ok',
  service,
});
