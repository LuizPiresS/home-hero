import type { Pool } from 'pg';
import { describe, expect, it } from 'vitest';
import { PostgresUserRepository } from './postgres-user-repository.js';
import type { User } from '../domain/user.js';

describe('PostgresUserRepository', () => {
  it('consulta e mapeia um usuário persistido no PostgreSQL', async () => {
    const database = {
      query: async () => ({ rows: [{ id: 'user-id', email: 'pessoa@example.com', passwordHash: 'password-hash', roles: ['contratante', 'profissional'], emailVerifiedAt: null, verificationTokenHash: 'token-hash', verificationTokenExpiresAt: new Date('2026-01-02T00:00:00.000Z'), createdAt: new Date('2026-01-01T00:00:00.000Z') }] }),
    } as unknown as Pool;
    const repository = new PostgresUserRepository(database);

    const user = await repository.findByEmail('pessoa@example.com');

    expect(user).toEqual({ id: 'user-id', email: 'pessoa@example.com', passwordHash: 'password-hash', roles: ['contratante', 'profissional'], emailVerifiedAt: null, verificationTokenHash: 'token-hash', verificationTokenExpiresAt: new Date('2026-01-02T00:00:00.000Z'), createdAt: new Date('2026-01-01T00:00:00.000Z') });
  });

  it('persiste o usuário usando parâmetros SQL', async () => {
    const calls: Array<{ query: string; values?: unknown[] }> = [];
    const database = { query: async (query: string, values?: unknown[]) => { calls.push({ query, values }); return { rows: [] }; } } as unknown as Pool;
    const repository = new PostgresUserRepository(database);
    const user: User = { id: 'user-id', email: 'pessoa@example.com', passwordHash: 'password-hash', roles: ['contratante'], emailVerifiedAt: null, verificationTokenHash: 'token-hash', verificationTokenExpiresAt: new Date('2026-01-02T00:00:00.000Z'), createdAt: new Date('2026-01-01T00:00:00.000Z') };

    await repository.save(user);

    expect(calls[0]?.query).toContain('INSERT INTO users');
    expect(calls[0]?.values).toEqual([user.id, user.email, user.passwordHash, user.roles, user.emailVerifiedAt, user.verificationTokenHash, user.verificationTokenExpiresAt, user.createdAt]);
  });
});
