import { neo4jQuery } from '../../../src/neo4j/query';

export default async opts => {

	const { label, name, uuid } = opts;

	const params = { name, uuid };

	const query = `
		MATCH (n:${label} { name: $name, uuid: $uuid })

		RETURN
			CASE COUNT(n) WHEN 1
				THEN true
				ELSE false
			END AS exists
	`;

	const { exists } = await neo4jQuery({ query, params });

	return exists;

};
