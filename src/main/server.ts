import { createApp } from './app.js';
import { loadEnvironment } from './config/environment.js';
import { ConsoleEmailVerificationSender } from '../modules/auth/adapters/console-email-verification-sender.js';

const environment = loadEnvironment(process.env);
const app = createApp({
  emailVerificationSender: environment.nodeEnv === 'development'
    ? new ConsoleEmailVerificationSender()
    : undefined,
});

app.listen(environment.port, () => {
  console.log(`Home Hero API listening on port ${environment.port}`);
});
