import { neo4jQuery } from '../../../src/neo4j/query';

export default async () => {

	const purgeDatabaseQuery = `
		MATCH (n)
		DETACH DELETE n
	`;

	await neo4jQuery({ query: purgeDatabaseQuery, params: {} }, { isOptionalResult: true });

};
