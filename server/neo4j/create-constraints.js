/* eslint no-console: 0 */

import directly from 'directly';
import path from 'path';

import { neo4jQuery } from '../neo4j/query';

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
			{ isReqdResult: false }
		);

		console.log(`Constraint created for ${model}`);

	} catch (err) {

		console.log(`Error attempting to create constraint for ${model}: `, err);

	}

}

export default async () => {

	try {

		const constraints = await neo4jQuery({ query: 'CALL db.constraints()' }, { isReqdResult: false, returnArray: true });

		const modelsWithConstraints = constraints.map(constraint => constraint.description.match(/:(.*) \)/)[1]);

		const modelsToConstrain = models.filter(model => !modelsWithConstraints.includes(model));

		if (!modelsToConstrain.length) {

			console.log('No constraints required');

			return;

		}

		const modelConstraintFunctions = modelsToConstrain.map(model => () => createConstraint(model));

		await directly(1, modelConstraintFunctions);

		console.log('All constraints created');

	} catch (err) {

		console.log('Error attempting: CALL db.constraints(): ', err);

	}

}
