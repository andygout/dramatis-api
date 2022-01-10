import directly from 'directly';

import { neo4jQuery } from './query';
import { MODEL_TO_NODE_LABEL_MAP } from '../utils/constants';

const INDEXABLE_MODELS = new Set([
	MODEL_TO_NODE_LABEL_MAP.AWARD,
	MODEL_TO_NODE_LABEL_MAP.AWARD_CEREMONY,
	MODEL_TO_NODE_LABEL_MAP.CHARACTER,
	MODEL_TO_NODE_LABEL_MAP.COMPANY,
	MODEL_TO_NODE_LABEL_MAP.MATERIAL,
	MODEL_TO_NODE_LABEL_MAP.PERSON,
	MODEL_TO_NODE_LABEL_MAP.VENUE
]);

const createIndex = async model => {

	const createIndexQuery = `CREATE INDEX ON :${model}(name)`;

	try {

		await neo4jQuery(
			{ query: createIndexQuery },
			{ isOptionalResult: true }
		);

		console.log(`Neo4j database: Index on name property created for ${model}`); // eslint-disable-line no-console

	} catch (error) {

		console.error(`Neo4j database: Error attempting query '${createIndexQuery}': `, error); // eslint-disable-line no-console

	}

};

export default async () => {

	const callDbIndexesQuery = 'SHOW INDEXES';

	try {

		const indexes = await neo4jQuery(
			{ query: callDbIndexesQuery },
			{ isOptionalResult: true, isArrayResult: true }
		);

		const modelsWithIndex =
			indexes
				.filter(index => index.name.startsWith('index') && index.properties?.includes('name'))
				.map(index => index.labelsOrTypes[0]);

		const modelsToIndex = [...INDEXABLE_MODELS].filter(model => !modelsWithIndex.includes(model));

		console.log('Neo4j database: Creating indexes…'); // eslint-disable-line no-console

		if (!modelsToIndex.length) {

			console.log('Neo4j database: No indexes required'); // eslint-disable-line no-console

			return;

		}

		const modelIndexFunctions = modelsToIndex.map(model => () => createIndex(model));

		await directly(1, modelIndexFunctions);

		console.log('Neo4j database: All indexes created'); // eslint-disable-line no-console

	} catch (error) {

		console.error(`Neo4j database: Error attempting query '${callDbIndexesQuery}': `, error); // eslint-disable-line no-console

	}

};
