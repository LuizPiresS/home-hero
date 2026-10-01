import type { Request, Response } from 'express';
import type { createLoginUser } from '../../application/login-user.js';
import type { createRegisterUser } from '../../application/register-user.js';
import type { createVerifyEmail } from '../../application/verify-email.js';

export const createAuthController = (useCases: {
  registerUser: ReturnType<typeof createRegisterUser>;
  verifyEmail: ReturnType<typeof createVerifyEmail>;
  loginUser: ReturnType<typeof createLoginUser>;
}) => ({
  register: async (request: Request, response: Response): Promise<void> => {
    const result = await useCases.registerUser(request.body);
    response.status(201).json(result);
  },
  verifyEmail: async (request: Request, response: Response): Promise<void> => {
    const result = await useCases.verifyEmail(request.body?.token);
    response.status(200).json(result);
  },
  login: async (request: Request, response: Response): Promise<void> => {
    const result = await useCases.loginUser(request.body);
    response.status(200).json(result);
  },
});
