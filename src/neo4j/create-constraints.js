import directly from 'directly';

import { neo4jQuery } from './query';
import { MODEL_TO_NODE_LABEL_MAP } from '../utils/constants';

const CONSTRAINABLE_MODELS = new Set([
	MODEL_TO_NODE_LABEL_MAP.AWARD,
	MODEL_TO_NODE_LABEL_MAP.AWARD_CEREMONY,
	MODEL_TO_NODE_LABEL_MAP.CHARACTER,
	MODEL_TO_NODE_LABEL_MAP.COMPANY,
	MODEL_TO_NODE_LABEL_MAP.MATERIAL,
	MODEL_TO_NODE_LABEL_MAP.PERSON,
	MODEL_TO_NODE_LABEL_MAP.PRODUCTION,
	MODEL_TO_NODE_LABEL_MAP.VENUE
]);

const createConstraint = async model => {

	const createConstraintQuery = `CREATE CONSTRAINT ON (node:${model}) ASSERT node.uuid IS UNIQUE`;

	try {

		await neo4jQuery(
			{ query: createConstraintQuery },
			{ isOptionalResult: true }
		);

		console.log(`Neo4j database: Constraint on uuid property created for ${model}`); // eslint-disable-line no-console

	} catch (error) {

		console.error(`Neo4j database: Error attempting query '${createConstraintQuery}': `, error); // eslint-disable-line no-console

	}

};

export default async () => {

	const callDbConstraintsQuery = 'SHOW CONSTRAINTS';

	try {

		const constraints = await neo4jQuery(
			{ query: callDbConstraintsQuery },
			{ isOptionalResult: true, isArrayResult: true }
		);

		const modelsWithConstraint = constraints.map(constraint => constraint.labelsOrTypes[0]);

		const modelsToConstrain = [...CONSTRAINABLE_MODELS].filter(model => !modelsWithConstraint.includes(model));

		console.log('Neo4j database: Creating constraints…'); // eslint-disable-line no-console

		if (!modelsToConstrain.length) {

			console.log('Neo4j database: No constraints required'); // eslint-disable-line no-console

			return;

		}

		const modelConstraintFunctions = modelsToConstrain.map(model => () => createConstraint(model));

		await directly(1, modelConstraintFunctions);

		console.log('Neo4j database: All constraints created'); // eslint-disable-line no-console

	} catch (error) {

		console.error(`Neo4j database: Error attempting query '${callDbConstraintsQuery}': `, error); // eslint-disable-line no-console

	}

};
