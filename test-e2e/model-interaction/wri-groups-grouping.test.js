import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { createSandbox } from 'sinon';
import { v4 as uuid } from 'uuid';

import app from '../../src/app';
import purgeDatabase from '../test-helpers/neo4j/purge-database';

describe('Nameless writer groups grouping', () => {

	chai.use(chaiHttp);

	const MATERIAL_UUID = '5';
	const PERSON_1_UUID = '7';
	const PERSON_2_UUID = '8';
	const PERSON_3_UUID = '9';

	let material;

	const sandbox = createSandbox();

	before(async () => {

		let uuidCallCount = 0;

		sandbox.stub(uuid, 'v4').callsFake(() => (uuidCallCount++).toString());

		await purgeDatabase();

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Material name',
				format: 'play',
				writerGroups: [
					{
						writers: [
							{
								name: 'Person #1'
							}
						]
					},
					{
						name: 'version by',
						writers: [
							{
								name: 'Person #2'
							}
						]
					},
					{
						writers: [
							{
								name: 'Person #3'
							}
						]
					}
				]
			});

		material = await chai.request(app)
			.get(`/materials/${MATERIAL_UUID}`);

	});

	after(() => {

		sandbox.restore();

	});

	describe('Material', () => {

		it('combines nameless writer groups into a single combined group (with a name of \'by\')', () => {

			const expectedWriterGroups = [
				{
					model: 'writerGroup',
					name: 'by',
					writers: [
						{
							model: 'person',
							uuid: PERSON_1_UUID,
							name: 'Person #1',
							format: null,
							sourceMaterialWriterGroups: []
						},
						{
							model: 'person',
							uuid: PERSON_3_UUID,
							name: 'Person #3',
							format: null,
							sourceMaterialWriterGroups: []
						}
					]
				},
				{
					model: 'writerGroup',
					name: 'version by',
					writers: [
						{
							model: 'person',
							uuid: PERSON_2_UUID,
							name: 'Person #2',
							format: null,
							sourceMaterialWriterGroups: []
						}
					]
				}
			];

			const { writerGroups } = material.body;

			expect(writerGroups).to.deep.equal(expectedWriterGroups);

		});

	});

});
