import './dotenv.js';

import express from 'express';
import logger from 'morgan';

import { accessControlSetter, errorHandler } from './middleware/index.js';
import router from './router.js';

const app = express();

// Disable logger for end-to-end tests to prevent it
// from contributing to their duration.
const requestLogger = process.env.NODE_ENV === 'e2e-test' ? [] : [logger('dev')];

app.use(express.json(), ...requestLogger, accessControlSetter, router, errorHandler);

export default app;
