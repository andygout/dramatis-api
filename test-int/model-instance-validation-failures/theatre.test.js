import { expect } from 'chai';
import { createSandbox } from 'sinon';

import Theatre from '../../src/models/Theatre';
import * as neo4jQueryModule from '../../src/neo4j/query';

describe('Theatre instance', () => {

	const EMPTY_STRING = '';
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

		describe('name value is empty string', () => {

			it('assigns appropriate error', async () => {

				const instance = new Theatre({ name: EMPTY_STRING });

				const result = await instance.create();

				const expectedResponseBody = {
					model: 'theatre',
					uuid: undefined,
					name: EMPTY_STRING,
					hasErrors: true,
					errors: {
						name: [
							'Name is too short'
						]
					}
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		});

		describe('name value exceeds maximum limit', () => {

			it('assigns appropriate error', async () => {

				const instance = new Theatre({ name: ABOVE_MAX_LENGTH_STRING });

				const result = await instance.create();

				const expectedResponseBody = {
					model: 'theatre',
					uuid: undefined,
					name: ABOVE_MAX_LENGTH_STRING,
					hasErrors: true,
					errors: {
						name: [
							'Name is too long'
						]
					}
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		});

	});

	describe('database validation failure', () => {

		beforeEach(() => {

			sandbox.stub(neo4jQueryModule, 'neo4jQuery').resolves({ instanceCount: 1 });

		});

		describe('name value already exists in database', () => {

			it('assigns appropriate error', async () => {

				const instance = new Theatre({ name: 'National Theatre' });

				const result = await instance.create();

				const expectedResponseBody = {
					model: 'theatre',
					uuid: undefined,
					name: 'National Theatre',
					hasErrors: true,
					errors: {
						name: [
							'Name already exists'
						]
					}
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		});

	});

});
