import 'dotenv/config';
import { loadEnvironment } from '../config/environment.js';
import { runMigrations } from './migrate.js';

// O comando CLI é separado do runner para que importar funções de migration nunca conecte no banco.
const run = async (): Promise<void> => {
  const environment = loadEnvironment(process.env);
  const applied = await runMigrations(environment.databaseUrl);
  console.log(applied.length === 0 ? 'Nenhuma migration pendente.' : `Migrations aplicadas: ${applied.join(', ')}`);
};

run().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
