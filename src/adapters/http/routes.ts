import { Router } from 'express';
import type { HealthCheck } from '../../shared/application/health-check.js';
import { createHealthController } from './health-controller.js';
import { createAuthController } from '../../modules/auth/adapters/http/auth-controller.js';

type AuthController = ReturnType<typeof createAuthController>;

export const createRoutes = (healthCheck: HealthCheck, authController: AuthController): Router => {
  const router = Router();

  // Rotas apenas traduzem HTTP para chamadas de aplicação; regras de negócio ficam nos casos de uso.
  router.get('/health', createHealthController(healthCheck));
  router.post('/auth/register', authController.register);
  router.post('/auth/verify-email', authController.verifyEmail);
  router.post('/auth/login', authController.login);

  return router;
};
