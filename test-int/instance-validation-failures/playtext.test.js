import { expect } from 'chai';
import { createSandbox } from 'sinon';

import Playtext from '../../src/models/Playtext';
import * as neo4jQueryModule from '../../src/neo4j/query';

describe('Playtext instance', () => {

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

		context('name value is empty string', () => {

			it('assigns appropriate error', async () => {

				const instance = new Playtext({ name: EMPTY_STRING });

				const result = await instance.create();

				const expectedResponseBody = {
					model: 'playtext',
					uuid: undefined,
					name: EMPTY_STRING,
					hasErrors: true,
					errors: {
						name: [
							'Name is too short'
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
					hasErrors: true,
					errors: {
						name: [
							'Name is too long'
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
					hasErrors: true,
					errors: {},
					characters: [
						{
							model: 'character',
							uuid: undefined,
							name: ABOVE_MAX_LENGTH_STRING,
							errors: {
								name: [
									'Name is too long'
								]
							}
						}
					]
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		});

		context('duplicate character name values', () => {

			it('assigns appropriate error', async () => {

				const instanceProps = {
					name: 'Rosmersholm',
					characters: [
						{
							name: 'Johannes Rosmer'
						},
						{
							name: 'Rebecca West'
						},
						{
							name: 'Johannes Rosmer'
						}
					]
				};

				const instance = new Playtext(instanceProps);

				const result = await instance.create();

				const expectedResponseBody = {
					model: 'playtext',
					uuid: undefined,
					name: 'Rosmersholm',
					hasErrors: true,
					errors: {},
					characters: [
						{
							model: 'character',
							uuid: undefined,
							name: 'Johannes Rosmer',
							errors: {
								name: [
									'Name has been duplicated in this group'
								]
							}
						},
						{
							model: 'character',
							uuid: undefined,
							name: 'Rebecca West',
							errors: {}
						},
						{
							model: 'character',
							uuid: undefined,
							name: 'Johannes Rosmer',
							errors: {
								name: [
									'Name has been duplicated in this group'
								]
							}
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
					hasErrors: true,
					errors: {
						name: [
							'Name already exists'
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
					hasErrors: true,
					errors: {
						name: [
							'Name already exists'
						]
					},
					characters: [
						{
							model: 'character',
							uuid: undefined,
							name: ABOVE_MAX_LENGTH_STRING,
							errors: {
								name: [
									'Name is too long'
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
