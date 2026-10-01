import { AuthError } from './errors.js';
import type { AccessTokenIssuer, PasswordHasher, UserRepository } from './ports.js';
import { loginUserSchema } from './schemas.js';

export const createLoginUser = (dependencies: {
  userRepository: UserRepository;
  passwordHasher: PasswordHasher;
  accessTokenIssuer: AccessTokenIssuer;
}) => async (input: { email: unknown; password: unknown }) => {
  const parsed = loginUserSchema.safeParse(input);
  if (!parsed.success) {
    throw new AuthError('INVALID_CREDENTIALS', 'e-mail ou senha inválidos');
  }

  const user = await dependencies.userRepository.findByEmail(parsed.data.email);
  if (!user || !(await dependencies.passwordHasher.compare(parsed.data.password, user.passwordHash))) {
    throw new AuthError('INVALID_CREDENTIALS', 'e-mail ou senha inválidos');
  }
  if (!user.emailVerifiedAt) {
    throw new AuthError('INVALID_CREDENTIALS', 'e-mail ou senha inválidos');
  }

  return {
    accessToken: await dependencies.accessTokenIssuer.issue({ userId: user.id, roles: user.roles }),
    user: { id: user.id, email: user.email, roles: user.roles },
  };
};
