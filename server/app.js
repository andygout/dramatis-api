/* eslint
	no-console: 0,
	no-unused-vars: ["error", { "argsIgnorePattern": "next" }]
*/

import 'regenerator-runtime/runtime';

import './dotenv';
import bodyParser from 'body-parser';
import express from 'express';
import http from 'http';
import logger from 'morgan';

import router from './routes';

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(logger('dev'));

app.use((req, res, next) => {

	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'content-type');

	next();

});

app.use('/', router);

// Catch 404 and forward to error handler
app.use((req, res, next) => {

	const err = new Error('Not Found');

	err.status = 404;

	next(err);

});

// Error handlers
// Development error handler - will print stacktrace
if (app.get('env') === 'development') {

	app.use((err, req, res, next) => {

		console.log(err);

		const errStatus = err.status || 500;

		const errMsg = `${errStatus} Error: ${err.message}`;

		res.status(errStatus);

		return res.render('partials/templates/error', {
			page: { title: errMsg },
			message: errMsg,
			error: err
		});

	});

}

// Production error handler - no stacktraces leaked to user
app.use((err, req, res, next) => {

	const errStatus = err.status || 500;

	const errMsg = `${errStatus} Error: ${err.message}`;

	res.status(errStatus);

	return res.render('partials/templates/error', {
		page: { title: errMsg },
		message: errMsg,
		error: {}
	});

});

const normalizePort = val => {

	const port = parseInt(val, 10);

	if (isNaN(port)) return val;

	if (port >= 0) return port;

	return false;

};

const onError = err => {

	if (err.syscall !== 'listen') throw err;

	const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port

	switch (err.code) {
		case 'EACCES':
			console.error(bind + ' requires elevated privileges');
			process.exit(1);
			break;
		case 'EADDRINUSE':
			console.error(bind + ' is already in use');
			process.exit(1);
			break;
		default:
			throw err;
	}

};

const port = normalizePort(process.env.PORT || '3000');

app.set('port', port);

const server = http.createServer(app);

server.listen(port, () => console.log(`Listening on port ${port}`));

server.on('error', onError);

// Export for integration tests.
export default app;
