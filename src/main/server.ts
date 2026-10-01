import { createApp } from './app.js';
import { loadEnvironment } from './config/environment.js';

const environment = loadEnvironment(process.env);
const app = createApp();

app.listen(environment.port, () => {
  console.log(`Home Hero API listening on port ${environment.port}`);
});
