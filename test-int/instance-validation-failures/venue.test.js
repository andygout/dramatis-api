import { expect } from 'chai';
import { createSandbox } from 'sinon';

import Venue from '../../src/models/Venue';
import * as neo4jQueryModule from '../../src/neo4j/query';

describe('Venue instance', () => {

	const STRING_MAX_LENGTH = 1000;
	const ABOVE_MAX_LENGTH_STRING = 'a'.repeat(STRING_MAX_LENGTH + 1);

	const sandbox = createSandbox();

	afterEach(() => {

		sandbox.restore();

	});

	describe('input validation failure', () => {

		beforeEach(() => {

			sandbox.stub(neo4jQueryModule, 'neo4jQuery').resolves({ duplicateRecordCount: 0 });

		});

		context('name value is empty string', () => {

			it('assigns appropriate error', async () => {

				const instance = new Venue({ name: '' });

				const result = await instance.create();

				const expectedResponseBody = {
					uuid: undefined,
					name: '',
					differentiator: '',
					hasErrors: true,
					errors: {
						name: [
							'Value is too short'
						]
					},
					subVenues: []
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		});

		context('name value exceeds maximum limit', () => {

			it('assigns appropriate error', async () => {

				const instance = new Venue({ name: ABOVE_MAX_LENGTH_STRING });

				const result = await instance.create();

				const expectedResponseBody = {
					uuid: undefined,
					name: ABOVE_MAX_LENGTH_STRING,
					differentiator: '',
					hasErrors: true,
					errors: {
						name: [
							'Value is too long'
						]
					},
					subVenues: []
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		});

		context('differentiator value exceeds maximum limit', () => {

			it('assigns appropriate error', async () => {

				const instance = new Venue({ name: 'National Theatre', differentiator: ABOVE_MAX_LENGTH_STRING });

				const result = await instance.create();

				const expectedResponseBody = {
					uuid: undefined,
					name: 'National Theatre',
					differentiator: ABOVE_MAX_LENGTH_STRING,
					hasErrors: true,
					errors: {
						differentiator: [
							'Value is too long'
						]
					},
					subVenues: []
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		});

		context('sub-venue name value exceeds maximum limit', () => {

			it('assigns appropriate error', async () => {

				const instanceProps = {
					name: 'National Theatre',
					subVenues: [
						{
							name: ABOVE_MAX_LENGTH_STRING
						}
					]
				};

				const instance = new Venue(instanceProps);

				const result = await instance.create();

				const expectedResponseBody = {
					uuid: undefined,
					name: 'National Theatre',
					differentiator: '',
					hasErrors: true,
					errors: {},
					subVenues: [
						{
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

		context('sub-venue differentiator value exceeds maximum limit', () => {

			it('assigns appropriate error', async () => {

				const instanceProps = {
					name: 'National Theatre',
					subVenues: [
						{
							name: 'Olivier Theatre',
							differentiator: ABOVE_MAX_LENGTH_STRING
						}
					]
				};

				const instance = new Venue(instanceProps);

				const result = await instance.create();

				const expectedResponseBody = {
					uuid: undefined,
					name: 'National Theatre',
					differentiator: '',
					hasErrors: true,
					errors: {},
					subVenues: [
						{
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

		context('venue instance assigns itself as a sub-venue', () => {

			it('assigns appropriate error', async () => {

				const instanceProps = {
					name: 'National Theatre',
					subVenues: [
						{
							name: 'National Theatre'
						}
					]
				};

				const instance = new Venue(instanceProps);

				const result = await instance.create();

				const expectedResponseBody = {
					uuid: undefined,
					name: 'National Theatre',
					differentiator: '',
					hasErrors: true,
					errors: {},
					subVenues: [
						{
							uuid: undefined,
							name: 'National Theatre',
							differentiator: '',
							errors: {
								name: [
									'Instance cannot form association with itself'
								],
								differentiator: [
									'Instance cannot form association with itself'
								]
							}
						}
					]
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		});

		context('duplicate sub-venues', () => {

			it('assigns appropriate error', async () => {

				const instanceProps = {
					name: 'National Theatre',
					subVenues: [
						{
							name: 'Olivier Theatre'
						},
						{
							name: 'Lyttelton Theatre',
							differentiator: '1'
						},
						{
							name: 'Olivier Theatre'
						},
						{
							name: 'Lyttelton Theatre',
							differentiator: '2'
						}
					]
				};

				const instance = new Venue(instanceProps);

				const result = await instance.create();

				const expectedResponseBody = {
					uuid: undefined,
					name: 'National Theatre',
					differentiator: '',
					hasErrors: true,
					errors: {},
					subVenues: [
						{
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
							uuid: undefined,
							name: 'Lyttelton Theatre',
							differentiator: '1',
							errors: {}
						},
						{
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
							uuid: undefined,
							name: 'Lyttelton Theatre',
							differentiator: '2',
							errors: {}
						}
					]
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		});

	});

	describe('database validation failure', () => {

		beforeEach(() => {

			sandbox.stub(neo4jQueryModule, 'neo4jQuery').resolves({ duplicateRecordCount: 1 });

		});

		context('name value already exists in database', () => {

			it('assigns appropriate error', async () => {

				const instance = new Venue({ name: 'National Theatre' });

				const result = await instance.create();

				const expectedResponseBody = {
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
					subVenues: []
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		});

	});

	describe('combined input and database validation failure', () => {

		beforeEach(() => {

			sandbox.stub(neo4jQueryModule, 'neo4jQuery').resolves({ duplicateRecordCount: 1 });

		});

		context('sub-venue name value exceeds maximum limit and name value already exists in database', () => {

			it('assigns appropriate error', async () => {

				const instanceProps = {
					name: 'National Theatre',
					subVenues: [
						{
							name: ABOVE_MAX_LENGTH_STRING
						}
					]
				};

				const instance = new Venue(instanceProps);

				const result = await instance.create();

				const expectedResponseBody = {
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
					subVenues: [
						{
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
