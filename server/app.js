/* eslint no-unused-vars: ["error", { "argsIgnorePattern": "next" }] */

import './dotenv';
import express from 'express';
import http from 'http';
import logger from 'morgan';

import { accessControlMiddleware, errorHandlingMiddleware } from './middleware';
import router from './routes';

const app = express();

app.use(
	express.json(),
	logger('dev'),
	accessControlMiddleware,
	router,
	errorHandlingMiddleware
);

const normalizePort = val => {

	const port = parseInt(val, 10);

	if (isNaN(port)) return val;

	if (port >= 0) return port;

	return false;

};

const onError = error => {

	if (error.syscall !== 'listen') throw error;

	const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port

	switch (error.code) {
		case 'EACCES':
			console.error(bind + ' requires elevated privileges'); // eslint-disable-line no-console
			process.exit(1);
			break;
		case 'EADDRINUSE':
			console.error(bind + ' is already in use'); // eslint-disable-line no-console
			process.exit(1);
			break;
		default:
			throw error;
	}

};

const port = normalizePort(process.env.PORT || '3000');

app.set('port', port);

const server = http.createServer(app);

server.listen(port, () => console.log(`Listening on port ${port}`)); // eslint-disable-line no-console

server.on('error', onError);

// Export for integration tests.
export default app;
