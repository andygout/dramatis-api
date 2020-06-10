import { neo4jQuery } from '../../../server/neo4j/query';

export default async () => {

	const purgeDatabaseQuery = `
		MATCH (n)
		DETACH DELETE n
	`;

	await neo4jQuery({ query: purgeDatabaseQuery, params: {} }, { isRequiredResult: false });

}
