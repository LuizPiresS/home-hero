import { Router } from 'express';
import type { HealthCheck } from '../../shared/application/health-check.js';
import { createHealthController } from './health-controller.js';

export const createRoutes = (healthCheck: HealthCheck): Router => {
  const router = Router();

  router.get('/health', createHealthController(healthCheck));

  return router;
};
