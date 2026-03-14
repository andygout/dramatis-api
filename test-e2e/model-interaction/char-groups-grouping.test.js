import assert from 'node:assert/strict';
import { before, describe, it } from 'node:test';

import request from 'supertest';

import app from '../../src/app.js';
import { purgeDatabase } from '../test-helpers/neo4j/index.js';
import { stubUuidToCountMapClient } from '../test-helpers/index.js';

const JULIUS_CAESAR_MATERIAL_UUID = 'JULIUS_CAESAR_MATERIAL_UUID';
const JULIUS_CAESAR_CHARACTER_UUID = 'JULIUS_CAESAR_CHARACTER_UUID';
const MARK_ANTONY_CHARACTER_UUID = 'MARK_ANTONY_CHARACTER_UUID';
const MESSENGER_CHARACTER_UUID = 'MESSENGER_CHARACTER_UUID';

let juliusCaesarMaterial;

describe('Nameless character groups grouping', () => {
	before(async () => {
		stubUuidToCountMapClient.clear();

		await purgeDatabase();

		await request(app)
			.post('/materials')
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
						name: "Triumvirs after Caesar's death",
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

		juliusCaesarMaterial = await request(app).get(`/materials/${JULIUS_CAESAR_MATERIAL_UUID}`);
	});

	describe('Julius Caesar (material)', () => {
		it('keeps nameless character groups as distinct groups', () => {
			const expectedCharacterGroups = [
				{
					model: 'CHARACTER_GROUP',
					name: null,
					position: 0,
					characters: [
						{
							model: 'CHARACTER',
							uuid: JULIUS_CAESAR_CHARACTER_UUID,
							name: 'Julius Caesar',
							qualifier: null
						}
					]
				},
				{
					model: 'CHARACTER_GROUP',
					name: "Triumvirs after Caesar's death",
					position: 1,
					characters: [
						{
							model: 'CHARACTER',
							uuid: MARK_ANTONY_CHARACTER_UUID,
							name: 'Mark Antony',
							qualifier: null
						}
					]
				},
				{
					model: 'CHARACTER_GROUP',
					name: null,
					position: 2,
					characters: [
						{
							model: 'CHARACTER',
							uuid: MESSENGER_CHARACTER_UUID,
							name: 'Messenger',
							qualifier: null
						}
					]
				}
			];

			const { characterGroups } = juliusCaesarMaterial.body;

			assert.deepEqual(characterGroups, expectedCharacterGroups);
		});
	});
});
