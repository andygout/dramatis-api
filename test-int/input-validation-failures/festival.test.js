import { expect } from 'chai';
import esmock from 'esmock';
import { restore, stub } from 'sinon';

const STRING_MAX_LENGTH = 1000;
const ABOVE_MAX_LENGTH_STRING = 'a'.repeat(STRING_MAX_LENGTH + 1);

describe('Input validation failures: Festival instance', () => {

	let stubs;

	const methods = [
		'create',
		'update'
	];

	beforeEach(() => {

		stubs = {
			neo4jQueryModule: {
				neo4jQuery: stub().resolves({ isExistent: true, isDuplicateRecord: false })
			}
		};

	});

	afterEach(() => {

		restore();

	});

	const createSubject = () =>
		esmock(
			'../../src/models/Festival.js',
			{},
			{
				'../../src/neo4j/query.js': stubs.neo4jQueryModule
			}
		);

	context('name value is empty string', () => {

		for (const method of methods) {

			it(`assigns appropriate error (${method} method)`, async () => {

				const Festival = await createSubject();

				const instance = new Festival({ name: '' });

				const result = await instance[method]();

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
					festivalSeries: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					}
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		}

	});

	context('name value exceeds maximum limit', () => {

		for (const method of methods) {

			it(`assigns appropriate error (${method} method)`, async () => {

				const Festival = await createSubject();

				const instance = new Festival({ name: ABOVE_MAX_LENGTH_STRING });

				const result = await instance[method]();

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
					festivalSeries: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					}
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		}

	});

	context('differentiator value exceeds maximum limit', () => {

		for (const method of methods) {

			it(`assigns appropriate error (${method} method)`, async () => {

				const Festival = await createSubject();

				const instance = new Festival({
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
						differentiator: [
							'Value is too long'
						]
					},
					festivalSeries: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					}
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		}

	});

	context('festival series name value exceeds maximum limit', () => {

		for (const method of methods) {

			it(`assigns appropriate error (${method} method)`, async () => {

				const Festival = await createSubject();

				const instance = new Festival({
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
							name: [
								'Value is too long'
							]
						}
					}
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		}

	});

	context('festival series differentiator value exceeds maximum limit', () => {

		for (const method of methods) {

			it(`assigns appropriate error (${method} method)`, async () => {

				const Festival = await createSubject();

				const instance = new Festival({
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
							differentiator: [
								'Value is too long'
							]
						}
					}
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		}

	});

});
