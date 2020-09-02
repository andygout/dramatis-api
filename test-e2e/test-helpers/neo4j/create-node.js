import { neo4jQuery } from '../../../src/neo4j/query';

export default async opts => {

	const { label, name, uuid } = opts;

	const params = { name, uuid };

	const query = `
		CREATE (n:${label} { name: $name, uuid: $uuid })

		RETURN n
	`;

	await neo4jQuery({ query, params });

	return;

};
