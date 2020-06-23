import directly from 'directly';
import path from 'path';

import { neo4jQuery } from './query';

const EXCLUDED_MODELS = [
	'Base',
	'BasicModel',
	'index',
	'PersonCastMember'
];

const models = require('fs')
	.readdirSync(path.join(__dirname, '..', 'models'))
	.map(filename => filename.replace('.js', ''))
	.filter(filename => !EXCLUDED_MODELS.includes(filename));

const createConstraint = async model => {

	try {

		await neo4jQuery(
			{ query: `CREATE CONSTRAINT ON (node:${model}) ASSERT node.uuid IS UNIQUE` },
			{ isOptionalResult: true }
		);

		console.log(`Neo4j database: Constraint created for ${model}`); // eslint-disable-line no-console

	} catch (error) {

		console.log(`Neo4j database: Error attempting to create constraint for ${model}: `, error); // eslint-disable-line no-console

	}

}

export default async () => {

	try {

		const constraints = await neo4jQuery(
			{ query: 'CALL db.constraints()' },
			{ isOptionalResult: true, isArrayResult: true }
		);

		const modelsWithConstraints = constraints.map(constraint => constraint.description.match(/:(.*) \)/)[1]);

		const modelsToConstrain = models.filter(model => !modelsWithConstraints.includes(model));

		console.log('Neo4j database: Creating constraints…'); // eslint-disable-line no-console

		if (!modelsToConstrain.length) {

			console.log('Neo4j database: No constraints required'); // eslint-disable-line no-console

			return;

		}

		const modelConstraintFunctions = modelsToConstrain.map(model => () => createConstraint(model));

		await directly(1, modelConstraintFunctions);

		console.log('Neo4j database: All constraints created'); // eslint-disable-line no-console

	} catch (error) {

		console.log('Neo4j database: Error attempting: CALL db.constraints(): ', error); // eslint-disable-line no-console

	}

}
