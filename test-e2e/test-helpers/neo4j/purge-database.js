import { neo4jQuery } from '../../../src/neo4j/query.js';
import { clearModelInteractionSeedQueue } from '../model-interaction-seed-queue.js';

export default async () => {
	clearModelInteractionSeedQueue();

	const query = `
		MATCH (n)

		DETACH DELETE n
	`;

	await neo4jQuery({ query, params: {} }, { isOptionalResult: true });
};
