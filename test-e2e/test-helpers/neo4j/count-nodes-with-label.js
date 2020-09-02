import { neo4jQuery } from '../../../src/neo4j/query';

export default async label => {

	const query = `
		MATCH (n:${label})
		RETURN COUNT(n) AS count
	`;

	const { count } = await neo4jQuery({ query, params: {} });

	return count;

};
