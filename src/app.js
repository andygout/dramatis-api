import './dotenv.js';

import express from 'express';
import logger from 'morgan';

import { accessControlSetter, errorHandler } from './middleware/index.js';
import router from './router.js';

const app = express();

app.use(express.json(), logger('dev'), accessControlSetter, router, errorHandler);

export default app;
