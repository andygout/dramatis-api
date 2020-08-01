import { expect } from 'chai';
import { createSandbox } from 'sinon';

import Character from '../../src/models/Character';
import * as neo4jQueryModule from '../../src/neo4j/query';

describe('Character instance', () => {

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

				const instance = new Character({ name: '' });

				const result = await instance.create();

				const expectedResponseBody = {
					model: 'character',
					uuid: undefined,
					name: '',
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

		context('name value exceeds maximum limit', () => {

			it('assigns appropriate error', async () => {

				const instance = new Character({ name: ABOVE_MAX_LENGTH_STRING });

				const result = await instance.create();

				const expectedResponseBody = {
					model: 'character',
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

		context('name value already exists in database', () => {

			it('assigns appropriate error', async () => {

				const instance = new Character({ name: 'Hamlet' });

				const result = await instance.create();

				const expectedResponseBody = {
					model: 'character',
					uuid: undefined,
					name: 'Hamlet',
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
