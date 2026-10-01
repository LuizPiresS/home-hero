import { createHash } from 'node:crypto';
import { readdir, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { Pool } from 'pg';

const MIGRATIONS_TABLE = 'schema_migrations';
const MIGRATION_LOCK_KEY = 'home-hero:migrations';

export type Migration = {
  version: string;
  name: string;
  filename: string;
  sql: string;
  checksum: string;
};

type AppliedMigration = Pick<Migration, 'version' | 'checksum'>;

// Lê apenas arquivos no formato NOME_NUMERICO_descricao.sql para manter a ordem explícita.
export const loadMigrations = async (directory = resolve(process.cwd(), 'migrations')): Promise<Migration[]> => {
  const filenames = (await readdir(directory, { withFileTypes: true }))
    .filter((entry) => entry.isFile() && /^\d+_.+\.sql$/.test(entry.name))
    .map((entry) => entry.name)
    .sort(compareMigrationNames);

  const migrations = await Promise.all(filenames.map(async (filename) => {
    const match = /^(\d+)_(.+)\.sql$/.exec(filename);
    const version = match?.[1];
    const name = match?.[2];
    if (!version || !name) throw new Error(`nome de migration inválido: ${filename}`);

    const sql = await readFile(resolve(directory, filename), 'utf8');
    return {
      version,
      name,
      filename,
      sql,
      checksum: createHash('sha256').update(sql).digest('hex'),
    };
  }));

  const versions = new Set<string>();
  for (const migration of migrations) {
    if (versions.has(migration.version)) {
      throw new Error(`versão de migration duplicada: ${migration.version}`);
    }
    versions.add(migration.version);
  }

  return migrations;
};

export const applyMigrations = async (database: Pick<Pool, 'query'>, migrations: Migration[]): Promise<string[]> => {
  const applied: string[] = [];

  await database.query('SELECT pg_advisory_lock(hashtext($1))', [MIGRATION_LOCK_KEY]);
  try {
    await database.query('BEGIN');
    await database.query(`
      CREATE TABLE IF NOT EXISTS ${MIGRATIONS_TABLE} (
        version TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        checksum TEXT NOT NULL,
        applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);

    const result = await database.query<AppliedMigration>(
      `SELECT version, checksum FROM ${MIGRATIONS_TABLE} ORDER BY version`,
    );
    const appliedByVersion = new Map(result.rows.map((migration) => [migration.version, migration]));

    for (const migration of migrations) {
      const previous = appliedByVersion.get(migration.version);
      if (previous) {
        if (previous.checksum !== migration.checksum) {
          throw new Error(`checksum alterado na migration ${migration.filename}`);
        }
        continue;
      }

      await database.query(migration.sql);
      await database.query(
        `INSERT INTO ${MIGRATIONS_TABLE} (version, name, checksum) VALUES ($1, $2, $3)`,
        [migration.version, migration.name, migration.checksum],
      );
      applied.push(migration.filename);
    }

    await database.query('COMMIT');
    return applied;
  } catch (error) {
    await database.query('ROLLBACK');
    throw error;
  } finally {
    await database.query('SELECT pg_advisory_unlock(hashtext($1))', [MIGRATION_LOCK_KEY]);
  }
};

const compareMigrationNames = (left: string, right: string): number => {
  const leftVersion = Number(/^\d+/.exec(left)?.[0]);
  const rightVersion = Number(/^\d+/.exec(right)?.[0]);
  return leftVersion - rightVersion;
};

export const runMigrations = async (databaseUrl: string): Promise<string[]> => {
  const database = new Pool({ connectionString: databaseUrl });
  try {
    const migrations = await loadMigrations();
    return await applyMigrations(database, migrations);
  } finally {
    await database.end();
  }
};
