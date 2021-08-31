import { expect } from 'chai';
import { createSandbox } from 'sinon';

import AwardCeremony from '../../src/models/AwardCeremony';
import * as neo4jQueryModule from '../../src/neo4j/query';

describe('AwardCeremony instance', () => {

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

				const instance = new AwardCeremony({ name: '' });

				const result = await instance.create();

				const expectedResponseBody = {
					uuid: undefined,
					name: '',
					hasErrors: true,
					errors: {
						name: [
							'Value is too short'
						]
					},
					award: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					}
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		});

		context('name value exceeds maximum limit', () => {

			it('assigns appropriate error', async () => {

				const instance = new AwardCeremony({ name: ABOVE_MAX_LENGTH_STRING });

				const result = await instance.create();

				const expectedResponseBody = {
					uuid: undefined,
					name: ABOVE_MAX_LENGTH_STRING,
					hasErrors: true,
					errors: {
						name: [
							'Value is too long'
						]
					},
					award: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					}
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		});

		context('award name value exceeds maximum limit', () => {

			it('assigns appropriate error', async () => {

				const instanceProps = {
					name: '2020',
					award: {
						name: ABOVE_MAX_LENGTH_STRING
					}
				};

				const instance = new AwardCeremony(instanceProps);

				const result = await instance.create();

				const expectedResponseBody = {
					uuid: undefined,
					name: '2020',
					hasErrors: true,
					errors: {},
					award: {
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

		});

		context('award differentiator value exceeds maximum limit', () => {

			it('assigns appropriate error', async () => {

				const instanceProps = {
					name: '2020',
					award: {
						name: 'Laurence Olivier Awards',
						differentiator: ABOVE_MAX_LENGTH_STRING
					}
				};

				const instance = new AwardCeremony(instanceProps);

				const result = await instance.create();

				const expectedResponseBody = {
					uuid: undefined,
					name: '2020',
					hasErrors: true,
					errors: {},
					award: {
						uuid: undefined,
						name: 'Laurence Olivier Awards',
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

		});

	});

	describe('database validation failure', () => {

		beforeEach(() => {

			sandbox.stub(neo4jQueryModule, 'neo4jQuery').resolves({ duplicateRecordCount: 1 });

		});

		context('name value with relationship to award already exists in database', () => {

			it('assigns appropriate error', async () => {

				const instanceProps = {
					name: '2020',
					award: {
						name: 'Laurence Olivier Awards'
					}
				};

				const instance = new AwardCeremony(instanceProps);

				const result = await instance.create();

				const expectedResponseBody = {
					uuid: undefined,
					name: '2020',
					hasErrors: true,
					errors: {
						name: [
							'Award ceremony already exists for given award'
						]
					},
					award: {
						uuid: undefined,
						name: 'Laurence Olivier Awards',
						differentiator: '',
						errors: {
							name: [
								'Award ceremony already exists for given award'
							],
							differentiator: [
								'Award ceremony already exists for given award'
							]
						}
					}
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		});

	});

});
