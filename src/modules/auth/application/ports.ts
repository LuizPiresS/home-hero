import type { User, UserRole } from '../domain/user.js';

export type UserRepository = {
  findByEmail(email: string): Promise<User | null>;
  findByVerificationTokenHash(tokenHash: string): Promise<User | null>;
  save(user: User): Promise<void>;
  update(user: User): Promise<void>;
};

export type PasswordHasher = {
  hash(password: string): Promise<string>;
  compare(password: string, passwordHash: string): Promise<boolean>;
};

export type TokenGenerator = {
  generate(): string;
};

export type EmailVerificationSender = {
  sendVerificationEmail(input: { email: string; token: string }): Promise<void>;
};

export type AccessTokenIssuer = {
  issue(input: { userId: string; roles: UserRole[] }): Promise<string>;
};

export type Clock = {
  now(): Date;
};
