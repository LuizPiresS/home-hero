import type { Request, Response } from 'express';
import type { HealthCheck } from '../../shared/application/health-check.js';

export const createHealthController = (healthCheck: HealthCheck) => {
  return (_request: Request, response: Response): void => {
    // O controller não calcula o estado: apenas adapta o resultado para uma resposta HTTP.
    response.status(200).json(healthCheck());
  };
};
