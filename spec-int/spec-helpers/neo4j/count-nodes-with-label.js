import { neo4jQuery } from '../../../server/neo4j/query';

export default async function (label) {

	const countNodesWithLabelQuery = `
		MATCH (n:${label})
		RETURN COUNT(n) AS count
	`;

	const { count } = await neo4jQuery({ query: countNodesWithLabelQuery, params: {} });

	return count;

}
