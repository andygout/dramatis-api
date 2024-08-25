import { expect } from 'chai';
import esmock from 'esmock';
import { stub } from 'sinon';

const STRING_MAX_LENGTH = 1000;
const ABOVE_MAX_LENGTH_STRING = 'a'.repeat(STRING_MAX_LENGTH + 1);

describe('Input validation failures: Company instance', () => {

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

	const createSubject = () =>
		esmock(
			'../../src/models/Company.js',
			{},
			{
				'../../src/neo4j/query.js': stubs.neo4jQueryModule
			}
		);

	context('name value is empty string', () => {

		for (const method of methods) {

			it(`assigns appropriate error (${method} method)`, async () => {

				const Company = await createSubject();

				const instance = new Company({ name: '' });

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
					}
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		}

	});

	context('name value exceeds maximum limit', () => {

		for (const method of methods) {

			it(`assigns appropriate error (${method} method)`, async () => {

				const Company = await createSubject();

				const instance = new Company({ name: ABOVE_MAX_LENGTH_STRING });

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
					}
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		}

	});

	context('differentiator value exceeds maximum limit', () => {

		for (const method of methods) {

			it(`assigns appropriate error (${method} method)`, async () => {

				const Company = await createSubject();

				const instance = new Company({ name: 'Playful Productions', differentiator: ABOVE_MAX_LENGTH_STRING });

				const result = await instance[method]();

				const expectedResponseBody = {
					uuid: undefined,
					name: 'Playful Productions',
					differentiator: ABOVE_MAX_LENGTH_STRING,
					hasErrors: true,
					errors: {
						differentiator: [
							'Value is too long'
						]
					}
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		}

	});

});
