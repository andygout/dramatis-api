import * as chai from 'chai';
import { default as chaiHttp, request } from 'chai-http';

import app from '../../src/app.js';
import { purgeDatabase } from '../test-helpers/neo4j/index.js';
import { stubUuidToCountMapClient } from '../test-helpers/index.js';

const { expect } = chai;

chai.use(chaiHttp);

const XYZZY_MATERIAL_UUID = 'XYZZY_MATERIAL_UUID';
const FERDINAND_FOO_PERSON_UUID = 'FERDINAND_FOO_PERSON_UUID';
const BEATRICE_BAR_PERSON_UUID = 'BEATRICE_BAR_PERSON_UUID';
const BRANDON_BAZ_PERSON_UUID = 'BRANDON_BAZ_PERSON_UUID';

let material;

describe('Nameless writer groups grouping', () => {

	before(async () => {

		stubUuidToCountMapClient.clear();

		await purgeDatabase();

		await request.execute(app)
			.post('/materials')
			.send({
				name: 'Xyzzy',
				format: 'play',
				writingCredits: [
					{
						entities: [
							{
								name: 'Ferdinand Foo'
							}
						]
					},
					{
						name: 'version by',
						entities: [
							{
								name: 'Beatrice Bar'
							}
						]
					},
					{
						entities: [
							{
								name: 'Brandon Baz'
							}
						]
					}
				]
			});

		material = await request.execute(app)
			.get(`/materials/${XYZZY_MATERIAL_UUID}`);

	});

	describe('Material', () => {

		it('combines nameless writer groups into a single combined group (with a name of \'by\')', () => {

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
							model: 'PERSON',
							uuid: BRANDON_BAZ_PERSON_UUID,
							name: 'Brandon Baz'
						}
					]
				},
				{
					model: 'WRITING_CREDIT',
					name: 'version by',
					entities: [
						{
							model: 'PERSON',
							uuid: BEATRICE_BAR_PERSON_UUID,
							name: 'Beatrice Bar'
						}
					]
				}
			];

			const { writingCredits } = material.body;

			expect(writingCredits).to.deep.equal(expectedWritingCredits);

		});

	});

});
