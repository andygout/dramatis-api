import createNeo4jConstraints from '../src/neo4j/create-constraints.js';
import createNeo4jFullTextIndexes from '../src/neo4j/create-full-text-indexes.js';
import createNeo4jIndexes from '../src/neo4j/create-indexes.js';
import { getDriver as getNeo4jDriver } from '../src/neo4j/get-driver.js';

export async function globalSetup() {
	await createNeo4jConstraints();

	await createNeo4jIndexes();

	await createNeo4jFullTextIndexes();
}

export async function globalTeardown() {
	const neo4jDriver = getNeo4jDriver();

	await neo4jDriver.close();
}
