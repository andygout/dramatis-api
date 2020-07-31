import { neo4jQuery } from '../../../src/neo4j/query';

export default async opts => {

	const { label, name, uuid } = opts;

	const params = { name, uuid };

	const createNodeQuery = `
		CREATE (n:${label} { name: $name, uuid: $uuid })

		RETURN n
	`;

	await neo4jQuery({ query: createNodeQuery, params });

	return;

};
