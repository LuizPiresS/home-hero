import express, { type Express } from 'express';
import { createHealthCheck } from '../shared/application/health-check.js';
import { createRoutes } from '../adapters/http/routes.js';
import { createAuthController } from '../modules/auth/adapters/http/auth-controller.js';
import { createLoginUser } from '../modules/auth/application/login-user.js';
import { createRegisterUser } from '../modules/auth/application/register-user.js';
import { createVerifyEmail } from '../modules/auth/application/verify-email.js';
import { InMemoryAccessTokenIssuer, InMemoryEmailVerificationSender, InMemoryUserRepository, RandomTokenGenerator, ScryptPasswordHasher, SystemClock } from '../modules/auth/adapters/in-memory.js';
import { errorHandler } from '../adapters/http/error-handler.js';
import type { AccessTokenIssuer, EmailVerificationSender, PasswordHasher, TokenGenerator, UserRepository, Clock } from '../modules/auth/application/ports.js';

export type AppDependencies = {
  serviceName?: string;
  userRepository?: UserRepository;
  passwordHasher?: PasswordHasher;
  tokenGenerator?: TokenGenerator;
  emailVerificationSender?: EmailVerificationSender;
  accessTokenIssuer?: AccessTokenIssuer;
  clock?: Clock;
};

export const createApp = (dependencies: AppDependencies = {}): Express => {
  const app = express();
  const healthCheck = createHealthCheck(dependencies.serviceName ?? 'home-hero-api');
  const userRepository = dependencies.userRepository ?? new InMemoryUserRepository();
  const passwordHasher = dependencies.passwordHasher ?? new ScryptPasswordHasher();
  const tokenGenerator = dependencies.tokenGenerator ?? new RandomTokenGenerator();
  const emailVerificationSender = dependencies.emailVerificationSender ?? new InMemoryEmailVerificationSender();
  const accessTokenIssuer = dependencies.accessTokenIssuer ?? new InMemoryAccessTokenIssuer();
  const clock = dependencies.clock ?? new SystemClock();
  const authController = createAuthController({
    registerUser: createRegisterUser({ userRepository, passwordHasher, tokenGenerator, emailVerificationSender, clock }),
    verifyEmail: createVerifyEmail({ userRepository, clock }),
    loginUser: createLoginUser({ userRepository, passwordHasher, accessTokenIssuer }),
  });

  app.disable('x-powered-by');
  app.use(express.json());
  app.use(createRoutes(healthCheck, authController));
  app.use(errorHandler);

  return app;
};
