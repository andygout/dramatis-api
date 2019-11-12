import createNeo4jConstraints from '../server/neo4j/create-constraints';
import { neo4jQuery } from '../server/neo4j/query';

async function purgeNeo4jDatabase () {

	const purgeDatabaseQuery = `
		MATCH (n)
		DETACH DELETE n
	`;

	await neo4jQuery({ query: purgeDatabaseQuery, params: {} }, { isReqdResult: false });

}

before(async () => {

	await purgeNeo4jDatabase();

	await createNeo4jConstraints();

});
