import { describe, expect, it } from 'vitest';
import type { Pool } from 'pg';
import { applyMigrations, loadMigrations } from './migrate.js';

describe('loadMigrations', () => {
  it('discovers the versioned SQL migrations in numeric order', async () => {
    const migrations = await loadMigrations();

    expect(migrations.map(({ filename, version }) => ({ filename, version }))).toEqual([
      { filename: '001_create_users.sql', version: '001' },
    ]);
  });

  it('calculates a checksum for each migration', async () => {
    const [migration] = await loadMigrations();

    expect(migration?.checksum).toMatch(/^[a-f0-9]{64}$/);
    expect(migration?.sql).toContain('CREATE TABLE IF NOT EXISTS users');
  });

  it('applies a pending migration inside a transaction', async () => {
    const [migration] = await loadMigrations();
    const queries: string[] = [];
    const database = {
      query: async (query: string) => {
        queries.push(query);
        if (query.includes('SELECT version, checksum')) return { rows: [] };
        return { rows: [] };
      },
    } as unknown as Pool;

    const applied = await applyMigrations(database, [migration!]);

    expect(applied).toEqual(['001_create_users.sql']);
    expect(queries).toContain('BEGIN');
    expect(queries).toContain(migration!.sql);
    expect(queries).toContain('COMMIT');
  });

  it('rolls back when an applied migration has a different checksum', async () => {
    const [migration] = await loadMigrations();
    const queries: string[] = [];
    const database = {
      query: async (query: string) => {
        queries.push(query);
        if (query.includes('SELECT version, checksum')) return { rows: [{ version: migration!.version, checksum: 'checksum-antigo' }] };
        return { rows: [] };
      },
    } as unknown as Pool;

    await expect(applyMigrations(database, [migration!])).rejects.toThrow('checksum alterado');
    expect(queries).toContain('ROLLBACK');
    expect(queries).not.toContain(migration!.sql);
  });
});
