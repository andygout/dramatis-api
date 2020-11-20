import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { createSandbox } from 'sinon';
import { v4 as uuid } from 'uuid';

import app from '../../src/app';
import purgeDatabase from '../test-helpers/neo4j/purge-database';

describe('Nameless character groups grouping', () => {

	chai.use(chaiHttp);

	const JULIUS_CAESAR_PLAYTEXT_UUID = '4';
	const JULIUS_CAESAR_CHARACTER_UUID = '5';
	const MARK_ANTONY_CHARACTER_UUID = '6';
	const MESSENGER_CHARACTER_UUID = '7';

	let juliusCaesarPlaytext;

	const sandbox = createSandbox();

	before(async () => {

		let uuidCallCount = 0;

		sandbox.stub(uuid, 'v4').callsFake(() => (uuidCallCount++).toString());

		await purgeDatabase();

		await chai.request(app)
			.post('/playtexts')
			.send({
				name: 'Julius Caesar',
				characterGroups: [
					{
						characters: [
							{
								name: 'Julius Caesar'
							}
						]
					},
					{
						name: 'Triumvirs after Caesar\'s death',
						characters: [
							{
								name: 'Mark Antony'
							}
						]
					},
					{
						characters: [
							{
								name: 'Messenger'
							}
						]
					}
				]
			});

		juliusCaesarPlaytext = await chai.request(app)
			.get(`/playtexts/${JULIUS_CAESAR_PLAYTEXT_UUID}`);

	});

	after(() => {

		sandbox.restore();

	});

	describe('Julius Caesar (playtext)', () => {

		it('keeps nameless character groups as distinct groups', () => {

			const expectedCharacterGroups = [
				{
					model: 'characterGroup',
					name: null,
					position: 0,
					characters: [
						{
							model: 'character',
							uuid: JULIUS_CAESAR_CHARACTER_UUID,
							name: 'Julius Caesar',
							qualifier: null
						}
					]
				},
				{
					model: 'characterGroup',
					name: 'Triumvirs after Caesar\'s death',
					position: 1,
					characters: [
						{
							model: 'character',
							uuid: MARK_ANTONY_CHARACTER_UUID,
							name: 'Mark Antony',
							qualifier: null
						}
					]
				},
				{
					model: 'characterGroup',
					name: null,
					position: 2,
					characters: [
						{
							model: 'character',
							uuid: MESSENGER_CHARACTER_UUID,
							name: 'Messenger',
							qualifier: null
						}
					]
				}
			];

			const { characterGroups } = juliusCaesarPlaytext.body;

			expect(characterGroups).to.deep.equal(expectedCharacterGroups);

		});

	});

});
