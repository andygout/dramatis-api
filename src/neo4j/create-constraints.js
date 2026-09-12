import { neo4jQuery } from './query.js';
import { MODEL_TO_NODE_LABEL_MAP } from '../utils/constants.js';

const LABELS_REQUIRING_UUID_PROPERTY_CONSTRAINT = new Set([
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
	MODEL_TO_NODE_LABEL_MAP.PRODUCTION,
	MODEL_TO_NODE_LABEL_MAP.SEASON,
	MODEL_TO_NODE_LABEL_MAP.TIME,
	MODEL_TO_NODE_LABEL_MAP.VENUE
]);

const createConstraintOnProperty = async (label, property) => {
	const createConstraintQuery = `CREATE CONSTRAINT FOR (n:${label}) REQUIRE n.${property} IS UNIQUE`;

	try {
		await neo4jQuery({ query: createConstraintQuery }, { isOptionalResult: true });

		console.log(`Neo4j database: Constraint on ${property} property created for ${label}`); // eslint-disable-line no-console
	} catch (error) {
		console.error(`Neo4j database: Error attempting query '${createConstraintQuery}': `, error); // eslint-disable-line no-console
	}
};

const createConstraintsOnProperty = async (existingConstraints, property) => {
	const labelsWithPropertyConstraint = existingConstraints
		.filter((constraint) => constraint.properties?.includes(property))
		.map((constraint) => constraint.labelsOrTypes[0]);

	const labelsMissingPropertyConstraint = [...LABELS_REQUIRING_UUID_PROPERTY_CONSTRAINT].filter(
		(label) => !labelsWithPropertyConstraint.includes(label)
	);

	console.log('Neo4j database: Creating constraints…'); // eslint-disable-line no-console

	if (!labelsMissingPropertyConstraint.length) {
		console.log(`Neo4j database: No ${property} property constraints required`); // eslint-disable-line no-console
	} else {		
		for (const label of labelsMissingPropertyConstraint) {
			await createConstraintOnProperty(label, property);
		}

		console.log(`Neo4j database: All ${property} property constraints created`); // eslint-disable-line no-console
	}
};

const createConstraints = async () => {
	const callDbConstraintsQuery = 'SHOW CONSTRAINTS';

	try {
		const existingConstraints = await neo4jQuery(
			{ query: callDbConstraintsQuery },
			{ isOptionalResult: true, isArrayResult: true }
		);

		await createConstraintsOnProperty(existingConstraints, 'uuid');

		console.log('Neo4j database: All constraint checks complete'); // eslint-disable-line no-console
	} catch (error) {
		console.error(`Neo4j database: Error attempting query '${callDbConstraintsQuery}': `, error); // eslint-disable-line no-console
	}
};

export default createConstraints;
