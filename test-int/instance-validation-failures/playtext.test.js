import { expect } from 'chai';
import { createSandbox } from 'sinon';

import Playtext from '../../src/models/Playtext';
import * as neo4jQueryModule from '../../src/neo4j/query';

describe('Playtext instance', () => {

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

				const instance = new Playtext({ name: '' });

				const result = await instance.create();

				const expectedResponseBody = {
					model: 'playtext',
					uuid: undefined,
					name: '',
					differentiator: '',
					hasErrors: true,
					errors: {
						name: [
							'Value is too short'
						]
					},
					characters: []
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		});

		context('name value exceeds maximum limit', () => {

			it('assigns appropriate error', async () => {

				const instance = new Playtext({ name: ABOVE_MAX_LENGTH_STRING });

				const result = await instance.create();

				const expectedResponseBody = {
					model: 'playtext',
					uuid: undefined,
					name: ABOVE_MAX_LENGTH_STRING,
					differentiator: '',
					hasErrors: true,
					errors: {
						name: [
							'Value is too long'
						]
					},
					characters: []
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		});

		context('differentiator value exceeds maximum limit', () => {

			it('assigns appropriate error', async () => {

				const instance = new Playtext({ name: 'Rosmersholm', differentiator: ABOVE_MAX_LENGTH_STRING });

				const result = await instance.create();

				const expectedResponseBody = {
					model: 'playtext',
					uuid: undefined,
					name: 'Rosmersholm',
					differentiator: ABOVE_MAX_LENGTH_STRING,
					hasErrors: true,
					errors: {
						differentiator: [
							'Value is too long'
						]
					},
					characters: []
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		});

		context('character name value exceeds maximum limit', () => {

			it('assigns appropriate error', async () => {

				const instanceProps = {
					name: 'Rosmersholm',
					characters: [
						{
							name: ABOVE_MAX_LENGTH_STRING
						}
					]
				};

				const instance = new Playtext(instanceProps);

				const result = await instance.create();

				const expectedResponseBody = {
					model: 'playtext',
					uuid: undefined,
					name: 'Rosmersholm',
					differentiator: '',
					hasErrors: true,
					errors: {},
					characters: [
						{
							model: 'character',
							uuid: undefined,
							name: ABOVE_MAX_LENGTH_STRING,
							displayName: '',
							differentiator: '',
							qualifier: '',
							group: '',
							errors: {
								name: [
									'Value is too long'
								]
							}
						}
					]
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		});

		context('character differentiator value exceeds maximum limit', () => {

			it('assigns appropriate error', async () => {

				const instanceProps = {
					name: 'Rosmersholm',
					characters: [
						{
							name: 'Johannes Rosmer',
							differentiator: ABOVE_MAX_LENGTH_STRING
						}
					]
				};

				const instance = new Playtext(instanceProps);

				const result = await instance.create();

				const expectedResponseBody = {
					model: 'playtext',
					uuid: undefined,
					name: 'Rosmersholm',
					differentiator: '',
					hasErrors: true,
					errors: {},
					characters: [
						{
							model: 'character',
							uuid: undefined,
							name: 'Johannes Rosmer',
							displayName: '',
							differentiator: ABOVE_MAX_LENGTH_STRING,
							qualifier: '',
							group: '',
							errors: {
								differentiator: [
									'Value is too long'
								]
							}
						}
					]
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		});

		context('character qualifier value exceeds maximum limit', () => {

			it('assigns appropriate error', async () => {

				const instanceProps = {
					name: 'Rosmersholm',
					characters: [
						{
							name: 'Johannes Rosmer',
							qualifier: ABOVE_MAX_LENGTH_STRING
						}
					]
				};

				const instance = new Playtext(instanceProps);

				const result = await instance.create();

				const expectedResponseBody = {
					model: 'playtext',
					uuid: undefined,
					name: 'Rosmersholm',
					differentiator: '',
					hasErrors: true,
					errors: {},
					characters: [
						{
							model: 'character',
							uuid: undefined,
							name: 'Johannes Rosmer',
							displayName: '',
							differentiator: '',
							qualifier: ABOVE_MAX_LENGTH_STRING,
							group: '',
							errors: {
								qualifier: [
									'Value is too long'
								]
							}
						}
					]
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		});

		context('character group value exceeds maximum limit', () => {

			it('assigns appropriate error', async () => {

				const instanceProps = {
					name: 'Rosmersholm',
					characters: [
						{
							name: 'Johannes Rosmer',
							group: ABOVE_MAX_LENGTH_STRING
						}
					]
				};

				const instance = new Playtext(instanceProps);

				const result = await instance.create();

				const expectedResponseBody = {
					model: 'playtext',
					uuid: undefined,
					name: 'Rosmersholm',
					differentiator: '',
					hasErrors: true,
					errors: {},
					characters: [
						{
							model: 'character',
							uuid: undefined,
							name: 'Johannes Rosmer',
							displayName: '',
							differentiator: '',
							qualifier: '',
							group: ABOVE_MAX_LENGTH_STRING,
							errors: {
								group: [
									'Value is too long'
								]
							}
						}
					]
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		});

		context('duplicate combinations of character name, differentiator, qualifier, and group values', () => {

			it('assigns appropriate error', async () => {

				const instanceProps = {
					name: 'Rosmersholm',
					characters: [
						{
							name: 'Johannes Rosmer',
							differentiator: '',
							qualifier: '',
							group: ''
						},
						{
							name: 'Rebecca West',
							differentiator: '1',
							qualifier: '',
							group: ''
						},
						{
							name: 'Professor Kroll',
							differentiator: '',
							qualifier: '',
							group: ''
						},
						{
							name: 'Ulrik Brendel',
							differentiator: '1',
							qualifier: '',
							group: ''
						},
						{
							name: 'Peder Mortensgaard',
							differentiator: '',
							qualifier: '',
							group: ''
						},
						{
							name: 'Johannes Rosmer',
							differentiator: '',
							qualifier: '',
							group: ''
						},
						{
							name: 'Rebecca West',
							differentiator: '1',
							qualifier: '',
							group: ''
						},
						{
							name: 'Professor Kroll',
							differentiator: '1',
							qualifier: '',
							group: ''
						},
						{
							name: 'Ulrik Brendel',
							differentiator: '2',
							qualifier: '',
							group: ''
						}
					]
				};

				const instance = new Playtext(instanceProps);

				const result = await instance.create();

				const expectedResponseBody = {
					model: 'playtext',
					uuid: undefined,
					name: 'Rosmersholm',
					differentiator: '',
					hasErrors: true,
					errors: {},
					characters: [
						{
							model: 'character',
							uuid: undefined,
							name: 'Johannes Rosmer',
							displayName: '',
							differentiator: '',
							qualifier: '',
							group: '',
							errors: {
								name: [
									'This item has been duplicated within the group'
								],
								differentiator: [
									'This item has been duplicated within the group'
								],
								qualifier: [
									'This item has been duplicated within the group'
								],
								group: [
									'This item has been duplicated within the group'
								]
							}
						},
						{
							model: 'character',
							uuid: undefined,
							name: 'Rebecca West',
							displayName: '',
							differentiator: '1',
							qualifier: '',
							group: '',
							errors: {
								name: [
									'This item has been duplicated within the group'
								],
								differentiator: [
									'This item has been duplicated within the group'
								],
								qualifier: [
									'This item has been duplicated within the group'
								],
								group: [
									'This item has been duplicated within the group'
								]
							}
						},
						{
							model: 'character',
							uuid: undefined,
							name: 'Professor Kroll',
							displayName: '',
							differentiator: '',
							qualifier: '',
							group: '',
							errors: {}
						},
						{
							model: 'character',
							uuid: undefined,
							name: 'Ulrik Brendel',
							displayName: '',
							differentiator: '1',
							qualifier: '',
							group: '',
							errors: {}
						},
						{
							model: 'character',
							uuid: undefined,
							name: 'Peder Mortensgaard',
							displayName: '',
							differentiator: '',
							qualifier: '',
							group: '',
							errors: {}
						},
						{
							model: 'character',
							uuid: undefined,
							name: 'Johannes Rosmer',
							displayName: '',
							differentiator: '',
							qualifier: '',
							group: '',
							errors: {
								name: [
									'This item has been duplicated within the group'
								],
								differentiator: [
									'This item has been duplicated within the group'
								],
								qualifier: [
									'This item has been duplicated within the group'
								],
								group: [
									'This item has been duplicated within the group'
								]
							}
						},
						{
							model: 'character',
							uuid: undefined,
							name: 'Rebecca West',
							displayName: '',
							differentiator: '1',
							qualifier: '',
							group: '',
							errors: {
								name: [
									'This item has been duplicated within the group'
								],
								differentiator: [
									'This item has been duplicated within the group'
								],
								qualifier: [
									'This item has been duplicated within the group'
								],
								group: [
									'This item has been duplicated within the group'
								]
							}
						},
						{
							model: 'character',
							uuid: undefined,
							name: 'Professor Kroll',
							displayName: '',
							differentiator: '1',
							qualifier: '',
							group: '',
							errors: {}
						},
						{
							model: 'character',
							uuid: undefined,
							name: 'Ulrik Brendel',
							displayName: '',
							differentiator: '2',
							qualifier: '',
							group: '',
							errors: {}
						}
					]
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

				const instance = new Playtext({ name: 'Rosmersholm' });

				const result = await instance.create();

				const expectedResponseBody = {
					model: 'playtext',
					uuid: undefined,
					name: 'Rosmersholm',
					differentiator: '',
					hasErrors: true,
					errors: {
						name: [
							'Name and differentiator combination already exists'
						],
						differentiator: [
							'Name and differentiator combination already exists'
						]
					},
					characters: []
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		});

	});

	describe('combined input and database validation failure', () => {

		beforeEach(() => {

			sandbox.stub(neo4jQueryModule, 'neo4jQuery').resolves({ instanceCount: 1 });

		});

		context('character name value exceeds maximum limit and name value already exists in database', () => {

			it('assigns appropriate error', async () => {

				const instanceProps = {
					name: 'Rosmersholm',
					characters: [
						{
							name: ABOVE_MAX_LENGTH_STRING
						}
					]
				};

				const instance = new Playtext(instanceProps);

				const result = await instance.create();

				const expectedResponseBody = {
					model: 'playtext',
					uuid: undefined,
					name: 'Rosmersholm',
					differentiator: '',
					hasErrors: true,
					errors: {
						name: [
							'Name and differentiator combination already exists'
						],
						differentiator: [
							'Name and differentiator combination already exists'
						]
					},
					characters: [
						{
							model: 'character',
							uuid: undefined,
							name: ABOVE_MAX_LENGTH_STRING,
							displayName: '',
							differentiator: '',
							qualifier: '',
							group: '',
							errors: {
								name: [
									'Value is too long'
								]
							}
						}
					]
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		});

	});

});
