import express, { type Express } from 'express';
import { createHealthCheck } from '../shared/application/health-check.js';
import { createRoutes } from '../adapters/http/routes.js';

export type AppDependencies = {
  serviceName?: string;
};

export const createApp = (dependencies: AppDependencies = {}): Express => {
  const app = express();
  const healthCheck = createHealthCheck(dependencies.serviceName ?? 'home-hero-api');

  app.disable('x-powered-by');
  app.use(express.json());
  app.use(createRoutes(healthCheck));

  return app;
};
