import type { Pool } from 'pg';
import type { User, UserRole } from '../domain/user.js';
import type { UserRepository } from '../application/ports.js';

type UserRow = {
  id: string;
  email: string;
  passwordHash: string;
  roles: UserRole[];
  emailVerifiedAt: Date | null;
  verificationTokenHash: string | null;
  verificationTokenExpiresAt: Date | null;
  createdAt: Date;
};

// Este adaptador converte a porta de persistência em consultas parametrizadas do PostgreSQL.
export class PostgresUserRepository implements UserRepository {
  constructor(private readonly database: Pick<Pool, 'query'>) {}

  async findByEmail(email: string): Promise<User | null> {
    const result = await this.database.query<UserRow>(userSelect('email = $1'), [email]);
    return result.rows[0] ? mapUser(result.rows[0]) : null;
  }

  async findByVerificationTokenHash(tokenHash: string): Promise<User | null> {
    const result = await this.database.query<UserRow>(userSelect('verification_token_hash = $1'), [tokenHash]);
    return result.rows[0] ? mapUser(result.rows[0]) : null;
  }

  async save(user: User): Promise<void> {
    // Os valores são passados separadamente para evitar interpolação de dados no SQL.
    await this.database.query(
      `INSERT INTO users (
        id, email, password_hash, roles, email_verified_at,
        verification_token_hash, verification_token_expires_at, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [user.id, user.email, user.passwordHash, user.roles, user.emailVerifiedAt, user.verificationTokenHash, user.verificationTokenExpiresAt, user.createdAt],
    );
  }

  async update(user: User): Promise<void> {
    await this.database.query(
      `UPDATE users
          SET email = $2,
              password_hash = $3,
              roles = $4,
              email_verified_at = $5,
              verification_token_hash = $6,
              verification_token_expires_at = $7
        WHERE id = $1`,
      [user.id, user.email, user.passwordHash, user.roles, user.emailVerifiedAt, user.verificationTokenHash, user.verificationTokenExpiresAt],
    );
  }
}

const userSelect = (condition: string): string =>
  // A projeção explicita os aliases usados pelo domínio e evita vazar nomes SQL para a aplicação.
  `SELECT id, email, password_hash AS "passwordHash", roles,
          email_verified_at AS "emailVerifiedAt",
          verification_token_hash AS "verificationTokenHash",
          verification_token_expires_at AS "verificationTokenExpiresAt",
          created_at AS "createdAt"
     FROM users
    WHERE ${condition}`;

const mapUser = (row: UserRow): User => ({
  id: row.id,
  email: row.email,
  passwordHash: row.passwordHash,
  roles: row.roles,
  emailVerifiedAt: row.emailVerifiedAt,
  verificationTokenHash: row.verificationTokenHash,
  verificationTokenExpiresAt: row.verificationTokenExpiresAt,
  createdAt: row.createdAt,
});
