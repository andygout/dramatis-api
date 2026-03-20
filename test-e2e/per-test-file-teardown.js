import { after } from 'node:test';

import { getDriver as getNeo4jDriver } from '../src/neo4j/get-driver.js';

after(async () => {
	await getNeo4jDriver().close();
});
