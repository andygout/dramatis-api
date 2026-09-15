import { neo4jQuery } from './query.js';
import { MODEL_TO_NODE_LABEL_MAP } from '../utils/constants.js';

const NAME_PROPERTY_NAME = 'name';
const FROM_DATE_PROPERTY_NAME = 'fromDate';
const TO_DATE_PROPERTY_NAME = 'toDate';

const PROPERTIES_TO_INDEX = new Set([NAME_PROPERTY_NAME, FROM_DATE_PROPERTY_NAME, TO_DATE_PROPERTY_NAME]);

const LABELS_REQUIRING_NAME_PROPERTY_RANGE_INDEX = new Set([
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

const LABELS_REQUIRING_FROM_DATE_PROPERTY_RANGE_INDEX = new Set([MODEL_TO_NODE_LABEL_MAP.TIME]);

const LABELS_REQUIRING_TO_DATE_PROPERTY_RANGE_INDEX = new Set([MODEL_TO_NODE_LABEL_MAP.TIME]);

const propertyNameToLabelSetMap = {
	[NAME_PROPERTY_NAME]: LABELS_REQUIRING_NAME_PROPERTY_RANGE_INDEX,
	[FROM_DATE_PROPERTY_NAME]: LABELS_REQUIRING_FROM_DATE_PROPERTY_RANGE_INDEX,
	[TO_DATE_PROPERTY_NAME]: LABELS_REQUIRING_TO_DATE_PROPERTY_RANGE_INDEX
};

const createRangeIndexOnProperty = async (label, property) => {
	const createRangeIndexQuery = `CREATE INDEX FOR (n:${label}) ON (n.${property})`;

	try {
		await neo4jQuery({ query: createRangeIndexQuery }, { isOptionalResult: true });

		console.log(`✅ Neo4j database: Range index on ${property} property created for ${label}`); // eslint-disable-line no-console
	} catch (error) {
		console.error(`❌ Neo4j database: Error attempting query '${createRangeIndexQuery}': `, error); // eslint-disable-line no-console
	}
};

const createRangeIndexesOnProperty = async (existingRangeIndexes, property) => {
	const labelsWithPropertyRangeIndex = existingRangeIndexes
		.filter((rangeIndex) => rangeIndex.properties?.includes(property))
		.map((rangeIndex) => rangeIndex.labelsOrTypes[0]);

	const labelsMissingPropertyRangeIndex = [...propertyNameToLabelSetMap[property]].filter(
		(label) => !labelsWithPropertyRangeIndex.includes(label)
	);

	console.log(`🟢 Neo4j database: Creating ${property} property range indexes…`); // eslint-disable-line no-console

	if (!labelsMissingPropertyRangeIndex.length) {
		console.log(`⚪ Neo4j database: No ${property} property range indexes required`); // eslint-disable-line no-console
	} else {
		for (const label of labelsMissingPropertyRangeIndex) {
			await createRangeIndexOnProperty(label, property);
		}

		console.log(`✔️  Neo4j database: All ${property} property range indexes created`); // eslint-disable-line no-console
	}
};

const createRangeIndexes = async () => {
	const callDbRangeIndexesQuery = 'SHOW RANGE INDEXES WHERE owningConstraint IS NULL';

	try {
		const existingRangeIndexes = await neo4jQuery(
			{ query: callDbRangeIndexesQuery },
			{ isOptionalResult: true, isArrayResult: true }
		);

		for (const property of [...PROPERTIES_TO_INDEX]) {
			await createRangeIndexesOnProperty(existingRangeIndexes, property);
		}

		console.log('🆗 Neo4j database: All range index checks complete'); // eslint-disable-line no-console
	} catch (error) {
		console.error(`❌ Neo4j database: Error attempting query '${callDbRangeIndexesQuery}': `, error); // eslint-disable-line no-console
	}
};

export default createRangeIndexes;
