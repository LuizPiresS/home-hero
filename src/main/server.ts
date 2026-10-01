import 'dotenv/config';
import { createApp } from './app.js';
import { loadEnvironment } from './config/environment.js';
import { ConsoleEmailVerificationSender } from '../modules/auth/adapters/console-email-verification-sender.js';
import { Pool } from 'pg';
import { PostgresUserRepository } from '../modules/auth/adapters/postgres-user-repository.js';

const environment = loadEnvironment(process.env);
const database = new Pool({ connectionString: environment.databaseUrl });
await database.query('SELECT 1');

const app = createApp({
  userRepository: new PostgresUserRepository(database),
  emailVerificationSender: environment.nodeEnv === 'development'
    ? new ConsoleEmailVerificationSender()
    : undefined,
});

app.listen(environment.port, () => {
  console.log(`Home Hero API listening on port ${environment.port}`);
});
