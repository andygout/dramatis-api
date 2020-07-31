import { neo4jQuery } from '../../../src/neo4j/query';

export default async opts => {

	const {
		sourceLabel,
		sourceUuid,
		destinationLabel,
		destinationUuid,
		relationshipName
	} = opts;

	const params = { sourceUuid, destinationUuid };

	const createRelationshipQuery = `
		MATCH (a:${sourceLabel} { uuid: $sourceUuid })

		MATCH (b:${destinationLabel} { uuid: $destinationUuid })

		CREATE (a)-[relationship:${relationshipName}]->(b)

		RETURN relationship
	`;

	await neo4jQuery({ query: createRelationshipQuery, params });

	return;

};
