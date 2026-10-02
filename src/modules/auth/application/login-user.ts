import { AuthError } from './errors.js';
import type { AccessTokenIssuer, PasswordHasher, UserRepository } from './ports.js';
import { loginUserSchema } from './schemas.js';
import type { LoginUserInputDto, LoginUserOutputDto } from './dtos.js';

export const createLoginUser = (dependencies: {
  userRepository: UserRepository;
  passwordHasher: PasswordHasher;
  accessTokenIssuer: AccessTokenIssuer;
}) => async (input: LoginUserInputDto): Promise<LoginUserOutputDto> => {
  // O schema também é aplicado fora do controller para manter o caso de uso seguro e reutilizável.
  const parsed = loginUserSchema.safeParse(input);
  if (!parsed.success) {
    throw new AuthError('INVALID_CREDENTIALS', 'e-mail ou senha inválidos');
  }

  const user = await dependencies.userRepository.findByEmail(parsed.data.email);
  // O mesmo erro é usado para usuário inexistente, senha errada e e-mail não confirmado.
  // Isso evita que a API revele quais contas existem.
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
