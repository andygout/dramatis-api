import { neo4jQuery } from './query.js';
import { MODEL_TO_NODE_LABEL_MAP } from '../utils/constants.js';

const NAME_PROPERTY_NAME = 'name';
const FROM_DATE_PROPERTY_NAME = 'fromDate';
const TO_DATE_PROPERTY_NAME = 'toDate';

const PROPERTIES_TO_INDEX = new Set([NAME_PROPERTY_NAME, FROM_DATE_PROPERTY_NAME, TO_DATE_PROPERTY_NAME]);

const LABELS_REQUIRING_NAME_PROPERTY_INDEX = new Set([
	MODEL_TO_NODE_LABEL_MAP.AWARD,
	MODEL_TO_NODE_LABEL_MAP.AWARD_CEREMONY,
	MODEL_TO_NODE_LABEL_MAP.CHARACTER,
	MODEL_TO_NODE_LABEL_MAP.COMPANY,
	MODEL_TO_NODE_LABEL_MAP.FESTIVAL,
	MODEL_TO_NODE_LABEL_MAP.FESTIVAL_SERIES,
	MODEL_TO_NODE_LABEL_MAP.LOCALE,
	MODEL_TO_NODE_LABEL_MAP.MATERIAL,
	MODEL_TO_NODE_LABEL_MAP.PERSON,
	MODEL_TO_NODE_LABEL_MAP.PLACE,
	MODEL_TO_NODE_LABEL_MAP.SEASON,
	MODEL_TO_NODE_LABEL_MAP.TIME,
	MODEL_TO_NODE_LABEL_MAP.VENUE
]);

const LABELS_REQUIRING_FROM_DATE_PROPERTY_INDEX = new Set([MODEL_TO_NODE_LABEL_MAP.TIME]);

const LABELS_REQUIRING_TO_DATE_PROPERTY_INDEX = new Set([MODEL_TO_NODE_LABEL_MAP.TIME]);

const propertyNameToLabelSetMap = {
	[NAME_PROPERTY_NAME]: LABELS_REQUIRING_NAME_PROPERTY_INDEX,
	[FROM_DATE_PROPERTY_NAME]: LABELS_REQUIRING_FROM_DATE_PROPERTY_INDEX,
	[TO_DATE_PROPERTY_NAME]: LABELS_REQUIRING_TO_DATE_PROPERTY_INDEX
};

const createIndexOnProperty = async (label, property) => {
	const createIndexQuery = `CREATE INDEX FOR (n:${label}) ON (n.${property})`;

	try {
		await neo4jQuery({ query: createIndexQuery }, { isOptionalResult: true });

		console.log(`Neo4j database: Index on ${property} property created for ${label}`); // eslint-disable-line no-console
	} catch (error) {
		console.error(`Neo4j database: Error attempting query '${createIndexQuery}': `, error); // eslint-disable-line no-console
	}
};

const createIndexesOnProperty = async (existingIndexes, property) => {
	const labelsWithPropertyIndex = existingIndexes
		.filter((index) => index.properties?.includes(property))
		.map((index) => index.labelsOrTypes[0]);

	const labelsMissingPropertyIndex = [...propertyNameToLabelSetMap[property]].filter(
		(label) => !labelsWithPropertyIndex.includes(label)
	);

	console.log(`Neo4j database: Creating ${property} property indexes…`); // eslint-disable-line no-console

	if (!labelsMissingPropertyIndex.length) {
		console.log(`Neo4j database: No ${property} property indexes required`); // eslint-disable-line no-console
	} else {
		for (const label of labelsMissingPropertyIndex) {
			await createIndexOnProperty(label, property);
		}

		console.log(`Neo4j database: All ${property} property indexes created`); // eslint-disable-line no-console
	}
};

const createIndexes = async () => {
	const callDbIndexesQuery = 'SHOW RANGE INDEXES WHERE owningConstraint IS NULL';

	try {
		const existingIndexes = await neo4jQuery(
			{ query: callDbIndexesQuery },
			{ isOptionalResult: true, isArrayResult: true }
		);

		for (const property of [...PROPERTIES_TO_INDEX]) {
			await createIndexesOnProperty(existingIndexes, property);
		}

		console.log('Neo4j database: All indexing checks complete'); // eslint-disable-line no-console
	} catch (error) {
		console.error(`Neo4j database: Error attempting query '${callDbIndexesQuery}': `, error); // eslint-disable-line no-console
	}
};

export default createIndexes;
