import { createHash, randomUUID } from 'node:crypto';
import { AuthError } from './errors.js';
import type {
  Clock,
  EmailVerificationSender,
  PasswordHasher,
  TokenGenerator,
  UserRepository,
} from './ports.js';
import { isUserRole, normalizeEmail, type User, type UserRole } from '../domain/user.js';

const VERIFICATION_TOKEN_TTL_MS = 24 * 60 * 60 * 1000;

export type RegisterUserInput = {
  email: string;
  password: string;
  roles: unknown;
};

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
}) => async (input: RegisterUserInput): Promise<RegisterUserOutput> => {
  const email = typeof input.email === 'string' ? normalizeEmail(input.email) : '';
  const roles = normalizeRoles(input.roles);

  if (!email || !email.includes('@') || typeof input.password !== 'string' || input.password.length < 8 || !roles) {
    throw new AuthError('INVALID_INPUT', 'email, senha e roles válidos são obrigatórios');
  }

  if (await dependencies.userRepository.findByEmail(email)) {
    throw new AuthError('EMAIL_ALREADY_REGISTERED', 'e-mail já cadastrado');
  }

  const token = dependencies.tokenGenerator.generate();
  const now = dependencies.clock.now();
  const user: User = {
    id: randomUUID(),
    email,
    passwordHash: await dependencies.passwordHasher.hash(input.password),
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

const normalizeRoles = (value: unknown): UserRole[] | null => {
  if (!Array.isArray(value) || value.length === 0 || value.some((role) => !isUserRole(role))) {
    return null;
  }

  return [...new Set(value)] as UserRole[];
};
