import assert from 'node:assert/strict';
import { before, describe, it } from 'node:test';

import request from 'supertest';

import app from '../../src/app.js';
import { stubUuidToCountMapClient } from '../test-helpers/index.js';
import { purgeDatabase } from '../test-helpers/neo4j/index.js';

const XYZZY_MATERIAL_UUID = 'XYZZY_MATERIAL_UUID';
const FERDINAND_FOO_PERSON_UUID = 'FERDINAND_FOO_PERSON_UUID';
const STAGECRAFT_LTD_COMPANY_UUID = 'STAGECRAFT_LTD_COMPANY_UUID';

let material;
let person;
let company;

describe('Material with entities credited multiple times', () => {
	before(async () => {
		stubUuidToCountMapClient.clear();

		await purgeDatabase();

		await request(app)
			.post('/materials')
			.send({
				name: 'Xyzzy',
				format: 'play',
				year: '2015',
				writingCredits: [
					{
						entities: [
							{
								name: 'Ferdinand Foo'
							},
							{
								model: 'COMPANY',
								name: 'Stagecraft Ltd'
							}
						]
					},
					{
						name: 'additional material by',
						entities: [
							{
								name: 'Ferdinand Foo'
							},
							{
								model: 'COMPANY',
								name: 'Stagecraft Ltd'
							}
						]
					}
				]
			});

		material = await request(app).get(`/materials/${XYZZY_MATERIAL_UUID}`);

		person = await request(app).get(`/people/${FERDINAND_FOO_PERSON_UUID}`);

		company = await request(app).get(`/companies/${STAGECRAFT_LTD_COMPANY_UUID}`);
	});

	describe('Material', () => {
		it('includes writers of this material grouped by their respective credits', () => {
			const expectedWritingCredits = [
				{
					model: 'WRITING_CREDIT',
					name: 'by',
					entities: [
						{
							model: 'PERSON',
							uuid: FERDINAND_FOO_PERSON_UUID,
							name: 'Ferdinand Foo'
						},
						{
							model: 'COMPANY',
							uuid: STAGECRAFT_LTD_COMPANY_UUID,
							name: 'Stagecraft Ltd'
						}
					]
				},
				{
					model: 'WRITING_CREDIT',
					name: 'additional material by',
					entities: [
						{
							model: 'PERSON',
							uuid: FERDINAND_FOO_PERSON_UUID,
							name: 'Ferdinand Foo'
						},
						{
							model: 'COMPANY',
							uuid: STAGECRAFT_LTD_COMPANY_UUID,
							name: 'Stagecraft Ltd'
						}
					]
				}
			];

			const { writingCredits } = material.body;

			assert.deepEqual(writingCredits, expectedWritingCredits);
		});
	});

	describe('Person', () => {
		it('includes materials they have written, with corresponding writers', () => {
			const expectedMaterials = [
				{
					model: 'MATERIAL',
					uuid: XYZZY_MATERIAL_UUID,
					name: 'Xyzzy',
					format: 'play',
					year: 2015,
					surMaterial: null,
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'by',
							entities: [
								{
									model: 'PERSON',
									uuid: FERDINAND_FOO_PERSON_UUID,
									name: 'Ferdinand Foo'
								},
								{
									model: 'COMPANY',
									uuid: STAGECRAFT_LTD_COMPANY_UUID,
									name: 'Stagecraft Ltd'
								}
							]
						},
						{
							model: 'WRITING_CREDIT',
							name: 'additional material by',
							entities: [
								{
									model: 'PERSON',
									uuid: FERDINAND_FOO_PERSON_UUID,
									name: 'Ferdinand Foo'
								},
								{
									model: 'COMPANY',
									uuid: STAGECRAFT_LTD_COMPANY_UUID,
									name: 'Stagecraft Ltd'
								}
							]
						}
					]
				}
			];

			const { materials } = person.body;

			assert.deepEqual(materials, expectedMaterials);
		});
	});

	describe('Company', () => {
		it('includes materials it has written, with corresponding writers', () => {
			const expectedMaterials = [
				{
					model: 'MATERIAL',
					uuid: XYZZY_MATERIAL_UUID,
					name: 'Xyzzy',
					format: 'play',
					year: 2015,
					surMaterial: null,
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'by',
							entities: [
								{
									model: 'PERSON',
									uuid: FERDINAND_FOO_PERSON_UUID,
									name: 'Ferdinand Foo'
								},
								{
									model: 'COMPANY',
									uuid: STAGECRAFT_LTD_COMPANY_UUID,
									name: 'Stagecraft Ltd'
								}
							]
						},
						{
							model: 'WRITING_CREDIT',
							name: 'additional material by',
							entities: [
								{
									model: 'PERSON',
									uuid: FERDINAND_FOO_PERSON_UUID,
									name: 'Ferdinand Foo'
								},
								{
									model: 'COMPANY',
									uuid: STAGECRAFT_LTD_COMPANY_UUID,
									name: 'Stagecraft Ltd'
								}
							]
						}
					]
				}
			];

			const { materials } = company.body;

			assert.deepEqual(materials, expectedMaterials);
		});
	});
});
