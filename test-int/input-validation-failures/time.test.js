import assert from 'node:assert/strict';
import { afterEach, beforeEach, describe, it } from 'node:test';

import esmock from 'esmock';
import { restore, stub } from 'sinon';

import { toPlainObject } from '../../test-helpers/index.js';

const STRING_MAX_LENGTH = 1000;
const ABOVE_MAX_LENGTH_STRING = 'a'.repeat(STRING_MAX_LENGTH + 1);

describe('Input validation failures: Time instance', () => {
	let stubs;
	let Time;

	const methods = ['create', 'update'];

	beforeEach(async () => {
		stubs = {
			neo4jQueryModule: {
				neo4jQuery: stub().resolves({ isExistent: true, isDuplicateRecord: false })
			}
		};

		Time = await esmock(
			'../../src/models/Time.js',
			{},
			{
				'../../src/neo4j/query.js': stubs.neo4jQueryModule
			}
		);
	});

	afterEach(() => {
		restore();
	});

	const createInstance = (props) => new Time(props);

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
					fromDate: '',
					toDate: '',
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
					fromDate: '',
					toDate: '',
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
					name: '1962',
					differentiator: ABOVE_MAX_LENGTH_STRING
				});

				const result = await instance[method]();

				const expectedResponseBody = {
					uuid: undefined,
					name: '1962',
					fromDate: '',
					toDate: '',
					differentiator: ABOVE_MAX_LENGTH_STRING,
					hasErrors: true,
					errors: {
						differentiator: ['Value is too long']
					}
				};

				assert.deepStrictEqual(toPlainObject(result), expectedResponseBody);
			});
		}
	});

	describe('fromDate and toDate values with invalid date format', () => {
		for (const method of methods) {
			it(`assigns appropriate error (${method} method)`, async () => {
				const instance = createInstance({
					name: '1962',
					fromDate: 'foobar',
					toDate: 'foobar'
				});

				const result = await instance[method]();

				const expectedResponseBody = {
					uuid: undefined,
					name: '1962',
					differentiator: '',
					fromDate: 'foobar',
					toDate: 'foobar',
					hasErrors: true,
					errors: {
						fromDate: ['Value must be in date format'],
						toDate: ['Value must be in date format']
					}
				};

				assert.deepStrictEqual(toPlainObject(result), expectedResponseBody);
			});
		}
	});

	describe('valid toDate without corresponding fromDate', () => {
		for (const method of methods) {
			it(`assigns appropriate error (${method} method)`, async () => {
				const instance = createInstance({
					name: '1962',
					toDate: '1962-12-31'
				});

				const result = await instance[method]();

				const expectedResponseBody = {
					uuid: undefined,
					name: '1962',
					differentiator: '',
					fromDate: '',
					toDate: '1962-12-31',
					hasErrors: true,
					errors: {
						fromDate: ["'To' date requires corresponding 'from' date"]
					}
				};

				assert.deepStrictEqual(toPlainObject(result), expectedResponseBody);
			});
		}
	});

	describe('valid fromDate without corresponding toDate', () => {
		for (const method of methods) {
			it(`assigns appropriate error (${method} method)`, async () => {
				const instance = createInstance({
					name: '1962',
					fromDate: '1962-01-01'
				});

				const result = await instance[method]();

				const expectedResponseBody = {
					uuid: undefined,
					name: '1962',
					differentiator: '',
					fromDate: '1962-01-01',
					toDate: '',
					hasErrors: true,
					errors: {
						toDate: ["'From' date requires corresponding 'to' date"]
					}
				};

				assert.deepStrictEqual(toPlainObject(result), expectedResponseBody);
			});
		}
	});

	describe('fromDate and toDate with valid date format with fromDate after toDate', () => {
		for (const method of methods) {
			it(`assigns appropriate error (${method} method)`, async () => {
				const instance = createInstance({
					name: '1962',
					fromDate: '1962-12-31',
					toDate: '1962-01-01'
				});

				const result = await instance[method]();

				const expectedResponseBody = {
					uuid: undefined,
					name: '1962',
					differentiator: '',
					fromDate: '1962-12-31',
					toDate: '1962-01-01',
					hasErrors: true,
					errors: {
						fromDate: ["'From' date must not be after 'to' date"],
						toDate: ["'To' date must not be before 'from' date"]
					}
				};

				assert.deepStrictEqual(toPlainObject(result), expectedResponseBody);
			});
		}
	});
});
