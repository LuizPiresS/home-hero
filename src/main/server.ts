import 'dotenv/config';
import { createApp } from './app.js';
import { loadEnvironment } from './config/environment.js';
import { ConsoleEmailVerificationSender } from '../modules/auth/adapters/console-email-verification-sender.js';
import { Pool } from 'pg';
import { PostgresUserRepository } from '../modules/auth/adapters/postgres-user-repository.js';

// O dotenv carrega o arquivo .env antes que a configuração seja validada.
const environment = loadEnvironment(process.env);

// A aplicação não abre a porta HTTP se o banco não estiver acessível.
// Isso evita descobrir uma falha de infraestrutura somente na primeira requisição.
const database = new Pool({ connectionString: environment.databaseUrl });
await database.query('SELECT 1');

// O servidor real usa o adaptador PostgreSQL; os adaptadores em memória ficam restritos ao desenvolvimento/testes.
const app = createApp({
  userRepository: new PostgresUserRepository(database),
  emailVerificationSender: environment.nodeEnv === 'development'
    ? new ConsoleEmailVerificationSender()
    : undefined,
});

// O listener só é criado depois que ambiente e banco foram validados.
app.listen(environment.port, () => {
  console.log(`Home Hero API listening on port ${environment.port}`);
});
