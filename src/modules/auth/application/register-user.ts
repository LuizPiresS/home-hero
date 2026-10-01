import { createHash, randomUUID } from 'node:crypto';
import { AuthError } from './errors.js';
import type {
  Clock,
  EmailVerificationSender,
  PasswordHasher,
  TokenGenerator,
  UserRepository,
} from './ports.js';
import type { User, UserRole } from '../domain/user.js';
import { registerUserSchema } from './schemas.js';

const VERIFICATION_TOKEN_TTL_MS = 24 * 60 * 60 * 1000;

export type RegisterUserOutput = {
  id: string;
  email: string;
  roles: UserRole[];
  emailVerified: false;
};

export const createRegisterUser = (dependencies: {
  userRepository: UserRepository;
  passwordHasher: PasswordHasher;
  tokenGenerator: TokenGenerator;
  emailVerificationSender: EmailVerificationSender;
  clock: Clock;
}) => async (input: unknown): Promise<RegisterUserOutput> => {
  const parsed = registerUserSchema.safeParse(input);
  if (!parsed.success) {
    throw new AuthError('INVALID_INPUT', 'email, senha e roles válidos são obrigatórios');
  }
  const { email, password, roles } = parsed.data;

  if (await dependencies.userRepository.findByEmail(email)) {
    throw new AuthError('EMAIL_ALREADY_REGISTERED', 'e-mail já cadastrado');
  }

  const token = dependencies.tokenGenerator.generate();
  const now = dependencies.clock.now();
  const user: User = {
    id: randomUUID(),
    email,
    passwordHash: await dependencies.passwordHasher.hash(password),
    roles,
    emailVerifiedAt: null,
    verificationTokenHash: hashVerificationToken(token),
    verificationTokenExpiresAt: new Date(now.getTime() + VERIFICATION_TOKEN_TTL_MS),
    createdAt: now,
  };

  await dependencies.userRepository.save(user);
  await dependencies.emailVerificationSender.sendVerificationEmail({ email, token });

  return { id: user.id, email: user.email, roles: user.roles, emailVerified: false };
};

export const hashVerificationToken = (token: string): string =>
  createHash('sha256').update(token).digest('hex');
