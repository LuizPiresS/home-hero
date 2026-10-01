import type { User, UserRole } from '../domain/user.js';

// Portas descrevem o que os casos de uso precisam, sem acoplá-los ao PostgreSQL, Express ou provedor de e-mail.
export type UserRepository = {
  findByEmail(email: string): Promise<User | null>;
  findByVerificationTokenHash(tokenHash: string): Promise<User | null>;
  save(user: User): Promise<void>;
  update(user: User): Promise<void>;
};

export type PasswordHasher = {
  // A senha nunca atravessa a fronteira de persistência em texto puro.
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
  // A estratégia do token pode mudar sem alterar o login (sessão, JWT, etc.).
  issue(input: { userId: string; roles: UserRole[] }): Promise<string>;
};

export type Clock = {
  // Um relógio injetável torna expiração de tokens determinística nos testes.
  now(): Date;
};
