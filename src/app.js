/* eslint no-unused-vars: ["error", { "argsIgnorePattern": "next" }] */

import './dotenv';

import http from 'http';

import express from 'express';
import logger from 'morgan';

import { accessControlSetter, errorHandler } from './middleware';
import router from './router';

const app = express();

app.use(
	express.json(),
	logger('dev'),
	accessControlSetter,
	router,
	errorHandler
);

const port = '3000';

app.set('port', port);

const server = http.createServer(app);

server.listen(port, () => console.log(`Listening on port ${port}`)); // eslint-disable-line no-console

// Export for integration tests.
export default app;
