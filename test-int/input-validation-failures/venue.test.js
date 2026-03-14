import assert from 'node:assert/strict';
import { afterEach, beforeEach, describe, it } from 'node:test';

import esmock from 'esmock';
import { restore, stub } from 'sinon';

import { toPlainObject } from '../../test-helpers/index.js';

const STRING_MAX_LENGTH = 1000;
const ABOVE_MAX_LENGTH_STRING = 'a'.repeat(STRING_MAX_LENGTH + 1);

describe('Input validation failures: Venue instance', () => {
	let stubs;
	let Venue;

	const methods = ['create', 'update'];

	beforeEach(async () => {
		stubs = {
			neo4jQueryModule: {
				// Stub with a contrived resolution that ensures various
				// neo4jQuery function calls all pass database validation.
				neo4jQuery: stub().resolves({
					isExistent: true,
					isDuplicateRecord: false,
					isAssignedToSurVenue: false,
					isSurVenue: false,
					isSubjectVenueASubVenue: false
				})
			}
		};

		Venue = await esmock(
			'../../src/models/Venue.js',
			{},
			{
				'../../src/neo4j/query.js': stubs.neo4jQueryModule
			}
		);
	});

	afterEach(() => {
		restore();
	});

	const createInstance = (props) => new Venue(props);

	describe('name value is empty string', () => {
		for (const method of methods) {
			it(`assigns appropriate error (${method} method)`, async () => {
				const instance = createInstance({ name: '' });

				const result = await instance[method]();

				const expectedResponseBody = {
					uuid: undefined,
					name: '',
					differentiator: '',
					hasErrors: true,
					errors: {
						name: ['Value is too short']
					},
					subVenues: []
				};

				assert.deepStrictEqual(toPlainObject(result), expectedResponseBody);
			});
		}
	});

	describe('name value exceeds maximum limit', () => {
		for (const method of methods) {
			it(`assigns appropriate error (${method} method)`, async () => {
				const instance = createInstance({ name: ABOVE_MAX_LENGTH_STRING });

				const result = await instance[method]();

				const expectedResponseBody = {
					uuid: undefined,
					name: ABOVE_MAX_LENGTH_STRING,
					differentiator: '',
					hasErrors: true,
					errors: {
						name: ['Value is too long']
					},
					subVenues: []
				};

				assert.deepStrictEqual(toPlainObject(result), expectedResponseBody);
			});
		}
	});

	describe('differentiator value exceeds maximum limit', () => {
		for (const method of methods) {
			it(`assigns appropriate error (${method} method)`, async () => {
				const instance = createInstance({ name: 'National Theatre', differentiator: ABOVE_MAX_LENGTH_STRING });

				const result = await instance[method]();

				const expectedResponseBody = {
					uuid: undefined,
					name: 'National Theatre',
					differentiator: ABOVE_MAX_LENGTH_STRING,
					hasErrors: true,
					errors: {
						differentiator: ['Value is too long']
					},
					subVenues: []
				};

				assert.deepStrictEqual(toPlainObject(result), expectedResponseBody);
			});
		}
	});

	describe('sub-venue name value exceeds maximum limit', () => {
		for (const method of methods) {
			it(`assigns appropriate error (${method} method)`, async () => {
				const instance = createInstance({
					name: 'National Theatre',
					subVenues: [
						{
							name: ABOVE_MAX_LENGTH_STRING
						}
					]
				});

				const result = await instance[method]();

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
								name: ['Value is too long']
							}
						}
					]
				};

				assert.deepStrictEqual(toPlainObject(result), expectedResponseBody);
			});
		}
	});

	describe('sub-venue differentiator value exceeds maximum limit', () => {
		for (const method of methods) {
			it(`assigns appropriate error (${method} method)`, async () => {
				const instance = createInstance({
					name: 'National Theatre',
					subVenues: [
						{
							name: 'Olivier Theatre',
							differentiator: ABOVE_MAX_LENGTH_STRING
						}
					]
				});

				const result = await instance[method]();

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
								differentiator: ['Value is too long']
							}
						}
					]
				};

				assert.deepStrictEqual(toPlainObject(result), expectedResponseBody);
			});
		}
	});

	describe('venue instance assigns itself as a sub-venue', () => {
		for (const method of methods) {
			it(`assigns appropriate error (${method} method)`, async () => {
				const instance = createInstance({
					name: 'National Theatre',
					subVenues: [
						{
							name: 'National Theatre'
						}
					]
				});

				const result = await instance[method]();

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
								name: ['Instance cannot form association with itself'],
								differentiator: ['Instance cannot form association with itself']
							}
						}
					]
				};

				assert.deepStrictEqual(toPlainObject(result), expectedResponseBody);
			});
		}
	});

	describe('duplicate sub-venues', () => {
		for (const method of methods) {
			it(`assigns appropriate error (${method} method)`, async () => {
				const instance = createInstance({
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
				});

				const result = await instance[method]();

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
								name: ['This item has been duplicated within the group'],
								differentiator: ['This item has been duplicated within the group']
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
								name: ['This item has been duplicated within the group'],
								differentiator: ['This item has been duplicated within the group']
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

				assert.deepStrictEqual(toPlainObject(result), expectedResponseBody);
			});
		}
	});
});
