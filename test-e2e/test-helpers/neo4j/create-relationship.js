import { neo4jQuery } from '../../../src/neo4j/query.js';
import { flushModelInteractionSeedQueue } from '../model-interaction-seed-queue.js';

export default async (opts) => {
	await flushModelInteractionSeedQueue();

	const { sourceLabel, sourceUuid, destinationLabel, destinationUuid, relationshipName } = opts;

	const params = { sourceUuid, destinationUuid };

	const query = `
		MATCH (a:${sourceLabel} { uuid: $sourceUuid })

		MATCH (b:${destinationLabel} { uuid: $destinationUuid })

		CREATE (a)-[relationship:${relationshipName}]->(b)

		RETURN relationship
	`;

	await neo4jQuery({ query, params });

	return;
};
