import type { Request, Response } from 'express';
import type { HealthCheck } from '../../shared/application/health-check.js';

export const createHealthController = (healthCheck: HealthCheck) => {
  return (_request: Request, response: Response): void => {
    response.status(200).json(healthCheck());
  };
};
