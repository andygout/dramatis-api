import assert from 'node:assert/strict';
import { afterEach, beforeEach, describe, it } from 'node:test';

import esmock from 'esmock';
import { restore, stub } from 'sinon';

import { toPlainObject } from '../../test-helpers/index.js';

const STRING_MAX_LENGTH = 1000;
const ABOVE_MAX_LENGTH_STRING = 'a'.repeat(STRING_MAX_LENGTH + 1);

describe('Input validation failures: Place instance', () => {
	let stubs;
	let Place;

	const methods = ['create', 'update'];

	beforeEach(async () => {
		stubs = {
			neo4jQueryModule: {
				neo4jQuery: stub().resolves({ isExistent: true, isDuplicateRecord: false })
			}
		};

		Place = await esmock(
			'../../src/models/Place.js',
			{},
			{
				'../../src/neo4j/query.js': stubs.neo4jQueryModule
			}
		);
	});

	afterEach(() => {
		restore();
	});

	const createInstance = (props) => new Place(props);

	describe('name value is empty string', () => {
		for (const method of methods) {
			it(`assigns appropriate error (${method} method)`, async () => {
				const instance = createInstance({
					name: ''
				});

				const result = await instance[method]();

				const expectedResponseBody = {
					uuid: undefined,
					name: '',
					differentiator: '',
					minLatitude: null,
					maxLatitude: null,
					minLongitude: null,
					maxLongitude: null,
					hasErrors: true,
					errors: {
						name: ['Value is too short']
					}
				};

				assert.deepStrictEqual(toPlainObject(result), expectedResponseBody);
			});
		}
	});

	describe('name value exceeds maximum limit', () => {
		for (const method of methods) {
			it(`assigns appropriate error (${method} method)`, async () => {
				const instance = createInstance({
					name: ABOVE_MAX_LENGTH_STRING
				});

				const result = await instance[method]();

				const expectedResponseBody = {
					uuid: undefined,
					name: ABOVE_MAX_LENGTH_STRING,
					differentiator: '',
					minLatitude: null,
					maxLatitude: null,
					minLongitude: null,
					maxLongitude: null,
					hasErrors: true,
					errors: {
						name: ['Value is too long']
					}
				};

				assert.deepStrictEqual(toPlainObject(result), expectedResponseBody);
			});
		}
	});

	describe('differentiator value exceeds maximum limit', () => {
		for (const method of methods) {
			it(`assigns appropriate error (${method} method)`, async () => {
				const instance = createInstance({
					name: 'Knightsbridge',
					differentiator: ABOVE_MAX_LENGTH_STRING
				});

				const result = await instance[method]();

				const expectedResponseBody = {
					uuid: undefined,
					name: 'Knightsbridge',
					differentiator: ABOVE_MAX_LENGTH_STRING,
					minLatitude: null,
					maxLatitude: null,
					minLongitude: null,
					maxLongitude: null,
					hasErrors: true,
					errors: {
						differentiator: ['Value is too long']
					}
				};

				assert.deepStrictEqual(toPlainObject(result), expectedResponseBody);
			});
		}
	});

	describe('only some bounding box coordinates are provided', () => {
		for (const method of methods) {
			it(`assigns appropriate error (${method} method)`, async () => {
				const instance = createInstance({
					name: 'Knightsbridge',
					minLatitude: 51.2867601
				});

				const result = await instance[method]();

				const expectedResponseBody = {
					uuid: undefined,
					name: 'Knightsbridge',
					differentiator: '',
					minLatitude: 51.2867601,
					maxLatitude: null,
					minLongitude: null,
					maxLongitude: null,
					hasErrors: true,
					errors: {
						maxLatitude: ['All four bounding box coordinates must be provided'],
						minLongitude: ['All four bounding box coordinates must be provided'],
						maxLongitude: ['All four bounding box coordinates must be provided']
					}
				};

				assert.deepStrictEqual(toPlainObject(result), expectedResponseBody);
			});
		}
	});

	describe('bounding box coordinate that cannot be parsed as a number', () => {
		for (const method of methods) {
			it(`assigns appropriate error (${method} method)`, async () => {
				const instance = createInstance({
					name: 'Knightsbridge',
					minLatitude: 'foobar',
					maxLatitude: 51.6918741,
					minLongitude: -0.5103751,
					maxLongitude: 0.3340155
				});

				const result = await instance[method]();

				const expectedResponseBody = {
					uuid: undefined,
					name: 'Knightsbridge',
					differentiator: '',
					minLatitude: 'foobar',
					maxLatitude: 51.6918741,
					minLongitude: -0.5103751,
					maxLongitude: 0.3340155,
					hasErrors: true,
					errors: {
						minLatitude: ['Value must be a number']
					}
				};

				assert.deepStrictEqual(toPlainObject(result), expectedResponseBody);
			});
		}
	});

	describe('bounding box coordinate that is infinite', () => {
		for (const method of methods) {
			it(`assigns appropriate error (${method} method)`, async () => {
				const instance = createInstance({
					name: 'Knightsbridge',
					minLatitude: Infinity,
					maxLatitude: 51.6918741,
					minLongitude: -0.5103751,
					maxLongitude: 0.3340155
				});

				const result = await instance[method]();

				const expectedResponseBody = {
					uuid: undefined,
					name: 'Knightsbridge',
					differentiator: '',
					minLatitude: Infinity,
					maxLatitude: 51.6918741,
					minLongitude: -0.5103751,
					maxLongitude: 0.3340155,
					hasErrors: true,
					errors: {
						minLatitude: ['Value must be a finite number']
					}
				};

				assert.deepStrictEqual(toPlainObject(result), expectedResponseBody);
			});
		}
	});

	describe('bounding box coordinates that are outside their valid geographic ranges', () => {
		for (const method of methods) {
			it(`assigns appropriate error (${method} method)`, async () => {
				const instance = createInstance({
					name: 'Knightsbridge',
					minLatitude: -91,
					maxLatitude: 91,
					minLongitude: -181,
					maxLongitude: 181
				});

				const result = await instance[method]();

				const expectedResponseBody = {
					uuid: undefined,
					name: 'Knightsbridge',
					differentiator: '',
					minLatitude: -91,
					maxLatitude: 91,
					minLongitude: -181,
					maxLongitude: 181,
					hasErrors: true,
					errors: {
						minLatitude: ['Latitude must be between -90 and 90'],
						maxLatitude: ['Latitude must be between -90 and 90'],
						minLongitude: ['Longitude must be between -180 and 180'],
						maxLongitude: ['Longitude must be between -180 and 180']
					}
				};

				assert.deepStrictEqual(toPlainObject(result), expectedResponseBody);
			});
		}
	});

	describe('minimum bounding box coordinates exceed maximum bounding box coordinates', () => {
		for (const method of methods) {
			it(`assigns appropriate error (${method} method)`, async () => {
				const instance = createInstance({
					name: 'Knightsbridge',
					minLatitude: 52,
					maxLatitude: 51,
					minLongitude: 1,
					maxLongitude: 0
				});

				const result = await instance[method]();

				const expectedResponseBody = {
					uuid: undefined,
					name: 'Knightsbridge',
					differentiator: '',
					minLatitude: 52,
					maxLatitude: 51,
					minLongitude: 1,
					maxLongitude: 0,
					hasErrors: true,
					errors: {
						minLatitude: ['Minimum latitude must not exceed maximum latitude'],
						maxLatitude: ['Maximum latitude must not be below minimum latitude'],
						minLongitude: ['Minimum longitude must not exceed maximum longitude'],
						maxLongitude: ['Maximum longitude must not be below minimum longitude']
					}
				};

				assert.deepStrictEqual(toPlainObject(result), expectedResponseBody);
			});
		}
	});
});
