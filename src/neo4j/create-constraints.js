import directly from 'directly';

import { neo4jQuery } from './query';

const MODELS = new Set([
	'Award',
	'Character',
	'Company',
	'Material',
	'Person',
	'Production',
	'Venue'
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

		const modelsToConstrain = [...MODELS].filter(model => !modelsWithConstraint.includes(model));

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
