import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';
import type { AccessTokenIssuer, Clock, EmailVerificationSender, PasswordHasher, TokenGenerator, UserRepository } from '../application/ports.js';
import type { User, UserRole } from '../domain/user.js';

const scrypt = promisify(scryptCallback);

// Este repositório é útil para testes e exemplos, mas não deve ser usado como persistência de produção.
export class InMemoryUserRepository implements UserRepository {
  private readonly users = new Map<string, User>();

  async findByEmail(email: string): Promise<User | null> {
    return [...this.users.values()].find((user) => user.email === email) ?? null;
  }

  async findByVerificationTokenHash(tokenHash: string): Promise<User | null> {
    return [...this.users.values()].find((user) => user.verificationTokenHash === tokenHash) ?? null;
  }

  async save(user: User): Promise<void> {
    this.users.set(user.id, user);
  }

  async update(user: User): Promise<void> {
    this.users.set(user.id, user);
  }
}

export class ScryptPasswordHasher implements PasswordHasher {
  async hash(password: string): Promise<string> {
    // Cada senha recebe um salt novo; o salt é armazenado junto do hash para permitir a comparação.
    const salt = randomBytes(16).toString('hex');
    const derivedKey = (await scrypt(password, salt, 64)) as Buffer;
    return `${salt}:${derivedKey.toString('hex')}`;
  }

  async compare(password: string, passwordHash: string): Promise<boolean> {
    const [salt, expected] = passwordHash.split(':');
    if (!salt || !expected) return false;
    const actual = (await scrypt(password, salt, 64)) as Buffer;
    const expectedBuffer = Buffer.from(expected, 'hex');
    // timingSafeEqual evita comparações que revelem diferenças pelo tempo de execução.
    return expectedBuffer.length === actual.length && timingSafeEqual(actual, expectedBuffer);
  }
}

export class RandomTokenGenerator implements TokenGenerator {
  generate(): string {
    // randomBytes é um gerador criptograficamente seguro fornecido pelo Node.js.
    return randomBytes(32).toString('hex');
  }
}

export class SystemClock implements Clock {
  now(): Date {
    return new Date();
  }
}

export class InMemoryEmailVerificationSender implements EmailVerificationSender {
  readonly messages: Array<{ email: string; token: string }> = [];

  async sendVerificationEmail(input: { email: string; token: string }): Promise<void> {
    // Em vez de chamar um provedor externo, guardamos a mensagem para asserções nos testes.
    this.messages.push(input);
  }
}

export class InMemoryAccessTokenIssuer implements AccessTokenIssuer {
  readonly sessions = new Map<string, { userId: string; roles: UserRole[] }>();

  async issue(input: { userId: string; roles: UserRole[] }): Promise<string> {
    // A sessão em memória é somente uma implementação provisória para desenvolvimento/testes.
    const token = randomBytes(32).toString('hex');
    this.sessions.set(token, input);
    return token;
  }
}
