import { expect } from 'chai';
import { createSandbox } from 'sinon';

import Theatre from '../../src/models/Theatre';
import * as neo4jQueryModule from '../../src/neo4j/query';

describe('Theatre instance', () => {

	const STRING_MAX_LENGTH = 1000;
	const ABOVE_MAX_LENGTH_STRING = 'a'.repeat(STRING_MAX_LENGTH + 1);

	const sandbox = createSandbox();

	afterEach(() => {

		sandbox.restore();

	});

	describe('input validation failure', () => {

		beforeEach(() => {

			sandbox.stub(neo4jQueryModule, 'neo4jQuery').resolves({ instanceCount: 0 });

		});

		context('name value is empty string', () => {

			it('assigns appropriate error', async () => {

				const instance = new Theatre({ name: '' });

				const result = await instance.create();

				const expectedResponseBody = {
					model: 'theatre',
					uuid: undefined,
					name: '',
					differentiator: '',
					hasErrors: true,
					errors: {
						name: [
							'Value is too short'
						]
					},
					subTheatres: []
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		});

		context('name value exceeds maximum limit', () => {

			it('assigns appropriate error', async () => {

				const instance = new Theatre({ name: ABOVE_MAX_LENGTH_STRING });

				const result = await instance.create();

				const expectedResponseBody = {
					model: 'theatre',
					uuid: undefined,
					name: ABOVE_MAX_LENGTH_STRING,
					differentiator: '',
					hasErrors: true,
					errors: {
						name: [
							'Value is too long'
						]
					},
					subTheatres: []
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		});

		context('differentiator value exceeds maximum limit', () => {

			it('assigns appropriate error', async () => {

				const instance = new Theatre({ name: 'National Theatre', differentiator: ABOVE_MAX_LENGTH_STRING });

				const result = await instance.create();

				const expectedResponseBody = {
					model: 'theatre',
					uuid: undefined,
					name: 'National Theatre',
					differentiator: ABOVE_MAX_LENGTH_STRING,
					hasErrors: true,
					errors: {
						differentiator: [
							'Value is too long'
						]
					},
					subTheatres: []
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		});

		context('sub-theatre name value exceeds maximum limit', () => {

			it('assigns appropriate error', async () => {

				const instanceProps = {
					name: 'National Theatre',
					subTheatres: [
						{
							name: ABOVE_MAX_LENGTH_STRING
						}
					]
				};

				const instance = new Theatre(instanceProps);

				const result = await instance.create();

				const expectedResponseBody = {
					model: 'theatre',
					uuid: undefined,
					name: 'National Theatre',
					differentiator: '',
					hasErrors: true,
					errors: {},
					subTheatres: [
						{
							model: 'theatre',
							uuid: undefined,
							name: ABOVE_MAX_LENGTH_STRING,
							differentiator: '',
							errors: {
								name: [
									'Value is too long'
								]
							}
						}
					]
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		});

		context('sub-theatre differentiator value exceeds maximum limit', () => {

			it('assigns appropriate error', async () => {

				const instanceProps = {
					name: 'National Theatre',
					subTheatres: [
						{
							name: 'Olivier Theatre',
							differentiator: ABOVE_MAX_LENGTH_STRING
						}
					]
				};

				const instance = new Theatre(instanceProps);

				const result = await instance.create();

				const expectedResponseBody = {
					model: 'theatre',
					uuid: undefined,
					name: 'National Theatre',
					differentiator: '',
					hasErrors: true,
					errors: {},
					subTheatres: [
						{
							model: 'theatre',
							uuid: undefined,
							name: 'Olivier Theatre',
							differentiator: ABOVE_MAX_LENGTH_STRING,
							errors: {
								differentiator: [
									'Value is too long'
								]
							}
						}
					]
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		});

		context('theatre instance includes itself as a sub-theatre', () => {

			it('assigns appropriate error', async () => {

				const instanceProps = {
					name: 'National Theatre',
					subTheatres: [
						{
							name: 'National Theatre'
						}
					]
				};

				const instance = new Theatre(instanceProps);

				const result = await instance.create();

				const expectedResponseBody = {
					model: 'theatre',
					uuid: undefined,
					name: 'National Theatre',
					differentiator: '',
					hasErrors: true,
					errors: {},
					subTheatres: [
						{
							model: 'theatre',
							uuid: undefined,
							name: 'National Theatre',
							differentiator: '',
							errors: {
								name: [
									'Theatre cannot assign iself as one of its sub-theatres'
								],
								differentiator: [
									'Theatre cannot assign iself as one of its sub-theatres'
								]
							}
						}
					]
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		});

		context('duplicate sub-theatres', () => {

			it('assigns appropriate error', async () => {

				const instanceProps = {
					name: 'National Theatre',
					subTheatres: [
						{
							name: 'Olivier Theatre'
						},
						{
							name: 'Lyttelton Theatre'
						},
						{
							name: 'Olivier Theatre'
						}
					]
				};

				const instance = new Theatre(instanceProps);

				const result = await instance.create();

				const expectedResponseBody = {
					model: 'theatre',
					uuid: undefined,
					name: 'National Theatre',
					differentiator: '',
					hasErrors: true,
					errors: {},
					subTheatres: [
						{
							model: 'theatre',
							uuid: undefined,
							name: 'Olivier Theatre',
							differentiator: '',
							errors: {
								name: [
									'This item has been duplicated within the group'
								],
								differentiator: [
									'This item has been duplicated within the group'
								]
							}
						},
						{
							model: 'theatre',
							uuid: undefined,
							name: 'Lyttelton Theatre',
							differentiator: '',
							errors: {}
						},
						{
							model: 'theatre',
							uuid: undefined,
							name: 'Olivier Theatre',
							differentiator: '',
							errors: {
								name: [
									'This item has been duplicated within the group'
								],
								differentiator: [
									'This item has been duplicated within the group'
								]
							}
						}
					]
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		});

	});

	describe('database validation failure', () => {

		beforeEach(() => {

			sandbox.stub(neo4jQueryModule, 'neo4jQuery').resolves({ instanceCount: 1 });

		});

		context('name value already exists in database', () => {

			it('assigns appropriate error', async () => {

				const instance = new Theatre({ name: 'National Theatre' });

				const result = await instance.create();

				const expectedResponseBody = {
					model: 'theatre',
					uuid: undefined,
					name: 'National Theatre',
					differentiator: '',
					hasErrors: true,
					errors: {
						name: [
							'Name and differentiator combination already exists'
						],
						differentiator: [
							'Name and differentiator combination already exists'
						]
					},
					subTheatres: []
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		});

	});

	describe('combined input and database validation failure', () => {

		beforeEach(() => {

			sandbox.stub(neo4jQueryModule, 'neo4jQuery').resolves({ instanceCount: 1 });

		});

		context('sub-theatre name value exceeds maximum limit and name value already exists in database', () => {

			it('assigns appropriate error', async () => {

				const instanceProps = {
					name: 'National Theatre',
					subTheatres: [
						{
							name: ABOVE_MAX_LENGTH_STRING
						}
					]
				};

				const instance = new Theatre(instanceProps);

				const result = await instance.create();

				const expectedResponseBody = {
					model: 'theatre',
					uuid: undefined,
					name: 'National Theatre',
					differentiator: '',
					hasErrors: true,
					errors: {
						name: [
							'Name and differentiator combination already exists'
						],
						differentiator: [
							'Name and differentiator combination already exists'
						]
					},
					subTheatres: [
						{
							model: 'theatre',
							uuid: undefined,
							name: ABOVE_MAX_LENGTH_STRING,
							differentiator: '',
							errors: {
								name: [
									'Value is too long'
								]
							}
						}
					]
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		});

	});

});
