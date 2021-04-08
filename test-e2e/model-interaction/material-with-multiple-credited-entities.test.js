import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { createSandbox } from 'sinon';
import { v4 as uuid } from 'uuid';

import app from '../../src/app';
import purgeDatabase from '../test-helpers/neo4j/purge-database';

describe('Materials with entities credited multiple times', () => {

	chai.use(chaiHttp);

	const MATERIAL_UUID = '4';
	const PERSON_UUID = '6';
	const COMPANY_UUID = '7';

	let material;
	let person;
	let company;

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
				writingCredits: [
					{
						entities: [
							{
								name: 'Person #1'
							},
							{
								model: 'company',
								name: 'Company #1'
							}
						]
					},
					{
						name: 'additional material by',
						entities: [
							{
								name: 'Person #1'
							},
							{
								model: 'company',
								name: 'Company #1'
							}
						]
					}
				]
			});

		material = await chai.request(app)
			.get(`/materials/${MATERIAL_UUID}`);

		person = await chai.request(app)
			.get(`/people/${PERSON_UUID}`);

		company = await chai.request(app)
			.get(`/companies/${COMPANY_UUID}`);

	});

	after(() => {

		sandbox.restore();

	});

	describe('Material', () => {

		it('includes writers of this material grouped by their respective credits', () => {

			const expectedWritingCredits = [
				{
					model: 'writingCredit',
					name: 'by',
					entities: [
						{
							model: 'person',
							uuid: PERSON_UUID,
							name: 'Person #1'
						},
						{
							model: 'company',
							uuid: COMPANY_UUID,
							name: 'Company #1'
						}
					]
				},
				{
					model: 'writingCredit',
					name: 'additional material by',
					entities: [
						{
							model: 'person',
							uuid: PERSON_UUID,
							name: 'Person #1'
						},
						{
							model: 'company',
							uuid: COMPANY_UUID,
							name: 'Company #1'
						}
					]
				}
			];

			const { writingCredits } = material.body;

			expect(writingCredits).to.deep.equal(expectedWritingCredits);

		});

	});

	describe('Person', () => {

		it('includes materials they have written (in which their uuid is nullified), with corresponding writers', () => {

			const expectedMaterials = [
				{
					model: 'material',
					uuid: MATERIAL_UUID,
					name: 'Material name',
					format: 'play',
					writingCredits: [
						{
							model: 'writingCredit',
							name: 'by',
							entities: [
								{
									model: 'person',
									uuid: null,
									name: 'Person #1'
								},
								{
									model: 'company',
									uuid: COMPANY_UUID,
									name: 'Company #1'
								}
							]
						},
						{
							model: 'writingCredit',
							name: 'additional material by',
							entities: [
								{
									model: 'person',
									uuid: null,
									name: 'Person #1'
								},
								{
									model: 'company',
									uuid: COMPANY_UUID,
									name: 'Company #1'
								}
							]
						}
					]
				}
			];

			const { materials } = person.body;

			expect(materials).to.deep.equal(expectedMaterials);

		});

	});

	describe('Company', () => {

		it('includes materials they have written (in which their uuid is nullified), with corresponding writers', () => {

			const expectedMaterials = [
				{
					model: 'material',
					uuid: MATERIAL_UUID,
					name: 'Material name',
					format: 'play',
					writingCredits: [
						{
							model: 'writingCredit',
							name: 'by',
							entities: [
								{
									model: 'person',
									uuid: PERSON_UUID,
									name: 'Person #1'
								},
								{
									model: 'company',
									uuid: null,
									name: 'Company #1'
								}
							]
						},
						{
							model: 'writingCredit',
							name: 'additional material by',
							entities: [
								{
									model: 'person',
									uuid: PERSON_UUID,
									name: 'Person #1'
								},
								{
									model: 'company',
									uuid: null,
									name: 'Company #1'
								}
							]
						}
					]
				}
			];

			const { materials } = company.body;

			expect(materials).to.deep.equal(expectedMaterials);

		});

	});

});
