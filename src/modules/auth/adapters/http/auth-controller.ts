import type { Request, Response } from 'express';
import type { createLoginUser } from '../../application/login-user.js';
import type { createRegisterUser } from '../../application/register-user.js';
import type { createVerifyEmail } from '../../application/verify-email.js';
import type {
  LoginUserInputDto,
  LoginUserOutputDto,
  RegisterUserInputDto,
  RegisterUserOutputDto,
  VerifyEmailInputDto,
  VerifyEmailOutputDto,
} from '../../application/dtos.js';

export const createAuthController = (useCases: {
  registerUser: ReturnType<typeof createRegisterUser>;
  verifyEmail: ReturnType<typeof createVerifyEmail>;
  loginUser: ReturnType<typeof createLoginUser>;
}) => ({
  register: async (
    request: Request<{}, RegisterUserOutputDto, RegisterUserInputDto>,
    response: Response<RegisterUserOutputDto>,
  ): Promise<void> => {
    // O controller extrai o body e devolve o resultado; validação e regras ficam na aplicação.
    const result = await useCases.registerUser(request.body);
    response.status(201).json(result);
  },
  verifyEmail: async (
    request: Request<{}, VerifyEmailOutputDto, VerifyEmailInputDto>,
    response: Response<VerifyEmailOutputDto>,
  ): Promise<void> => {
    // O token é o único dado necessário para confirmar o endereço.
    const result = await useCases.verifyEmail(request.body?.token);
    response.status(200).json(result);
  },
  login: async (
    request: Request<{}, LoginUserOutputDto, LoginUserInputDto>,
    response: Response<LoginUserOutputDto>,
  ): Promise<void> => {
    const result = await useCases.loginUser(request.body);
    response.status(200).json(result);
  },
});
