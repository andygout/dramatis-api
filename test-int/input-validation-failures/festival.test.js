import assert from 'node:assert/strict';
import { afterEach, beforeEach, describe, it } from 'node:test';

import esmock from 'esmock';
import { restore, stub } from 'sinon';

import { toPlainObject } from '../../test-helpers/index.js';

const STRING_MAX_LENGTH = 1000;
const ABOVE_MAX_LENGTH_STRING = 'a'.repeat(STRING_MAX_LENGTH + 1);

describe('Input validation failures: Festival instance', () => {
	let stubs;
	let Festival;

	const methods = ['create', 'update'];

	beforeEach(async () => {
		stubs = {
			neo4jQueryModule: {
				neo4jQuery: stub().resolves({ isExistent: true, isDuplicateRecord: false })
			}
		};

		Festival = await esmock(
			'../../src/models/Festival.js',
			{},
			{
				'../../src/neo4j/query.js': stubs.neo4jQueryModule
			}
		);
	});

	afterEach(() => {
		restore();
	});

	const createInstance = (props) => new Festival(props);

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
					hasErrors: true,
					errors: {
						name: ['Value is too short']
					},
					festivalSeries: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
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
					hasErrors: true,
					errors: {
						name: ['Value is too long']
					},
					festivalSeries: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
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
					name: 'The Complete Works',
					differentiator: ABOVE_MAX_LENGTH_STRING
				});

				const result = await instance[method]();

				const expectedResponseBody = {
					uuid: undefined,
					name: 'The Complete Works',
					differentiator: ABOVE_MAX_LENGTH_STRING,
					hasErrors: true,
					errors: {
						differentiator: ['Value is too long']
					},
					festivalSeries: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					}
				};

				assert.deepStrictEqual(toPlainObject(result), expectedResponseBody);
			});
		}
	});

	describe('festival series name value exceeds maximum limit', () => {
		for (const method of methods) {
			it(`assigns appropriate error (${method} method)`, async () => {
				const instance = createInstance({
					name: '2008',
					festivalSeries: {
						name: ABOVE_MAX_LENGTH_STRING
					}
				});

				const result = await instance[method]();

				const expectedResponseBody = {
					uuid: undefined,
					name: '2008',
					differentiator: '',
					hasErrors: true,
					errors: {},
					festivalSeries: {
						uuid: undefined,
						name: ABOVE_MAX_LENGTH_STRING,
						differentiator: '',
						errors: {
							name: ['Value is too long']
						}
					}
				};

				assert.deepStrictEqual(toPlainObject(result), expectedResponseBody);
			});
		}
	});

	describe('festival series differentiator value exceeds maximum limit', () => {
		for (const method of methods) {
			it(`assigns appropriate error (${method} method)`, async () => {
				const instance = createInstance({
					name: '2008',
					festivalSeries: {
						name: 'Edinburgh International Festival',
						differentiator: ABOVE_MAX_LENGTH_STRING
					}
				});

				const result = await instance[method]();

				const expectedResponseBody = {
					uuid: undefined,
					name: '2008',
					differentiator: '',
					hasErrors: true,
					errors: {},
					festivalSeries: {
						uuid: undefined,
						name: 'Edinburgh International Festival',
						differentiator: ABOVE_MAX_LENGTH_STRING,
						errors: {
							differentiator: ['Value is too long']
						}
					}
				};

				assert.deepStrictEqual(toPlainObject(result), expectedResponseBody);
			});
		}
	});
});
