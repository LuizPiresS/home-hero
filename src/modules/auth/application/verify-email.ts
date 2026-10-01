import { AuthError } from './errors.js';
import { hashVerificationToken } from './register-user.js';
import type { Clock, UserRepository } from './ports.js';

export const createVerifyEmail = (dependencies: {
  userRepository: UserRepository;
  clock: Clock;
}) => async (token: unknown): Promise<{ email: string; emailVerified: true }> => {
  if (typeof token !== 'string' || token.length === 0) {
    throw new AuthError('INVALID_VERIFICATION_TOKEN', 'token de validação inválido ou expirado');
  }

  const user = await dependencies.userRepository.findByVerificationTokenHash(hashVerificationToken(token));
  if (user?.verificationTokenExpiresAt && user.verificationTokenExpiresAt.getTime() > dependencies.clock.now().getTime()) {

    user.emailVerifiedAt = dependencies.clock.now();
    user.verificationTokenHash = null;
    user.verificationTokenExpiresAt = null;
    await dependencies.userRepository.update(user);
    return { email: user.email, emailVerified: true };
  }

  throw new AuthError('INVALID_VERIFICATION_TOKEN', 'token de validação inválido ou expirado');
};
