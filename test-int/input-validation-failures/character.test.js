import { expect } from 'chai';
import esmock from 'esmock';
import { restore, stub } from 'sinon';

const STRING_MAX_LENGTH = 1000;
const ABOVE_MAX_LENGTH_STRING = 'a'.repeat(STRING_MAX_LENGTH + 1);

describe('Input validation failures: Character instance', () => {

	let stubs;
	let Character;

	const methods = [
		'create',
		'update'
	];

	beforeEach(async () => {

		stubs = {
			neo4jQueryModule: {
				neo4jQuery: stub().resolves({ isExistent: true, isDuplicateRecord: false })
			}
		};

		Character = await esmock(
			'../../src/models/Character.js',
			{},
			{
				'../../src/neo4j/query.js': stubs.neo4jQueryModule
			}
		);

	});

	afterEach(() => {

		restore();

	});

	const createInstance = props => new Character(props);

	context('name value is empty string', () => {

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

				const instance = createInstance({
					name: 'Hamlet',
					differentiator: ABOVE_MAX_LENGTH_STRING
				});

				const result = await instance[method]();

				const expectedResponseBody = {
					uuid: undefined,
					name: 'Hamlet',
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
