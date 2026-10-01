import { AuthError } from './errors.js';
import type { AccessTokenIssuer, PasswordHasher, UserRepository } from './ports.js';
import { normalizeEmail } from '../domain/user.js';

export const createLoginUser = (dependencies: {
  userRepository: UserRepository;
  passwordHasher: PasswordHasher;
  accessTokenIssuer: AccessTokenIssuer;
}) => async (input: { email: unknown; password: unknown }) => {
  if (typeof input.email !== 'string' || typeof input.password !== 'string') {
    throw new AuthError('INVALID_CREDENTIALS', 'e-mail ou senha inválidos');
  }

  const user = await dependencies.userRepository.findByEmail(normalizeEmail(input.email));
  if (!user || !(await dependencies.passwordHasher.compare(input.password, user.passwordHash))) {
    throw new AuthError('INVALID_CREDENTIALS', 'e-mail ou senha inválidos');
  }
  if (!user.emailVerifiedAt) {
    throw new AuthError('EMAIL_NOT_VERIFIED', 'valide o e-mail antes do primeiro login');
  }

  return {
    accessToken: await dependencies.accessTokenIssuer.issue({ userId: user.id, roles: user.roles }),
    user: { id: user.id, email: user.email, roles: user.roles },
  };
};
