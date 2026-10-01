import type { ErrorRequestHandler } from 'express';
import { AuthError } from '../../modules/auth/application/errors.js';

export const errorHandler: ErrorRequestHandler = (error, _request, response, _next): void => {
  if (error instanceof AuthError) {
    // Erros conhecidos viram respostas estáveis para o cliente; detalhes inesperados não são expostos.
    const status = error.code === 'INVALID_INPUT' ? 400 : error.code === 'EMAIL_ALREADY_REGISTERED' ? 409 : error.code === 'EMAIL_NOT_VERIFIED' ? 403 : 401;
    response.status(status).json({ error: error.code, message: error.message });
    return;
  }

  // Falhas de infraestrutura devem ser investigadas nos logs, não retornadas ao usuário.
  response.status(500).json({ error: 'INTERNAL_ERROR', message: 'erro interno' });
};
