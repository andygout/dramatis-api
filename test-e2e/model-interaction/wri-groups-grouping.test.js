import crypto from 'crypto';

import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { createSandbox } from 'sinon';

import app from '../../src/app';
import { purgeDatabase } from '../test-helpers/neo4j';

describe('Nameless writer groups grouping', () => {

	chai.use(chaiHttp);

	const XYZZY_MATERIAL_UUID = '4';
	const FERDINAND_FOO_PERSON_UUID = '5';
	const BEATRICE_BAR_PERSON_UUID = '6';
	const BRANDON_BAZ_PERSON_UUID = '7';

	let material;

	const sandbox = createSandbox();

	before(async () => {

		let uuidCallCount = 0;

		sandbox.stub(crypto, 'randomUUID').callsFake(() => (uuidCallCount++).toString());

		await purgeDatabase();

		await chai.request(app)
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

		material = await chai.request(app)
			.get(`/materials/${XYZZY_MATERIAL_UUID}`);

	});

	after(() => {

		sandbox.restore();

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
