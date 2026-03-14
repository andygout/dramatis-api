import http from 'node:http';

import app from './app.js';
import { getDriver as getNeo4jDriver } from './neo4j/get-driver.js';

const neo4jDriver = getNeo4jDriver();

const port = '3000';
app.set('port', port);

const server = http.createServer(app);

server.listen(port, () => console.log(`Listening on port ${port}`)); // eslint-disable-line no-console

const shutDown = async () => {
	server.closeAllConnections();

	await new Promise((resolve) => server.close(resolve));

	await neo4jDriver.close();
};

process.on('SIGTERM', () => {
	void shutDown();
});

process.on('SIGINT', () => {
	void shutDown();
});

export default server;
