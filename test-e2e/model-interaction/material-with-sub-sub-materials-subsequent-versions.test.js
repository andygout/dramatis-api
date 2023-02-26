import crypto from 'crypto';

import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { createSandbox } from 'sinon';

import app from '../../src/app';
import purgeDatabase from '../test-helpers/neo4j/purge-database';

describe('Material with sub-sub-materials and subsequent versions thereof', () => {

	chai.use(chaiHttp);

	const RICHARD_II_ORIGINAL_VERSION_MATERIAL_UUID = '4';
	const WILLIAM_SHAKESPEARE_PERSON_UUID = '6';
	const THE_KINGS_MEN_COMPANY_UUID = '7';
	const THE_FIRST_HENRIAD_ORIGINAL_VERSION_MATERIAL_UUID = '13';
	const THE_HENRIAD_ORIGINAL_VERSION_MATERIAL_UUID = '23';
	const RICHARD_II_SUBSEQUENT_VERSION_MATERIAL_UUID = '34';
	const CARL_HEAP_PERSON_UUID = '38';
	const BEGGARS_BELIEF_THEATRE_COMPANY_UUID = '39';
	const THE_FIRST_HENRIAD_SUBSEQUENT_VERSION_MATERIAL_UUID = '47';
	const THE_HENRIAD_SUBSEQUENT_VERSION_MATERIAL_UUID = '61';

	let richardIIOriginalVersionMaterial;
	let richardIISubsequentVersionMaterial;
	let williamShakespearePerson;
	let theKingsMenCompany;

	const sandbox = createSandbox();

	before(async () => {

		let uuidCallCount = 0;

		sandbox.stub(crypto, 'randomUUID').callsFake(() => (uuidCallCount++).toString());

		await purgeDatabase();

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Richard II',
				differentiator: '1',
				format: 'play',
				year: '1595',
				writingCredits: [
					{
						entities: [
							{
								name: 'William Shakespeare'
							},
							{
								model: 'COMPANY',
								name: 'The King\'s Men'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'The First Henriad',
				differentiator: '1',
				format: 'sub-group of plays',
				year: '1599',
				writingCredits: [
					{
						entities: [
							{
								name: 'William Shakespeare'
							},
							{
								model: 'COMPANY',
								name: 'The King\'s Men'
							}
						]
					}
				],
				subMaterials: [
					{
						name: 'Richard II',
						differentiator: '1'
					}
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'The Henriad',
				differentiator: '1',
				format: 'group of plays',
				year: '1599',
				writingCredits: [
					{
						entities: [
							{
								name: 'William Shakespeare'
							},
							{
								model: 'COMPANY',
								name: 'The King\'s Men'
							}
						]
					}
				],
				subMaterials: [
					{
						name: 'The First Henriad',
						differentiator: '1'
					}
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Richard II',
				differentiator: '2',
				format: 'play',
				year: '2009',
				originalVersionMaterial: {
					name: 'Richard II',
					differentiator: '1'
				},
				writingCredits: [
					{
						entities: [
							{
								name: 'William Shakespeare'
							},
							{
								model: 'COMPANY',
								name: 'The King\'s Men'
							}
						]
					},
					{
						name: 'adapted for young people by',
						entities: [
							{
								name: 'Carl Heap'
							},
							{
								model: 'COMPANY',
								name: 'Beggars Belief Theatre Company'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'The First Henriad',
				differentiator: '2',
				format: 'sub-group of plays',
				year: '2009',
				writingCredits: [
					{
						entities: [
							{
								name: 'William Shakespeare'
							},
							{
								model: 'COMPANY',
								name: 'The King\'s Men'
							}
						]
					},
					{
						name: 'adapted for young people by',
						entities: [
							{
								name: 'Carl Heap'
							},
							{
								model: 'COMPANY',
								name: 'Beggars Belief Theatre Company'
							}
						]
					}
				],
				subMaterials: [
					{
						name: 'Richard II',
						differentiator: '2'
					}
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'The Henriad',
				differentiator: '2',
				format: 'group of plays',
				year: '2009',
				writingCredits: [
					{
						entities: [
							{
								name: 'William Shakespeare'
							},
							{
								model: 'COMPANY',
								name: 'The King\'s Men'
							}
						]
					},
					{
						name: 'adapted for young people by',
						entities: [
							{
								name: 'Carl Heap'
							},
							{
								model: 'COMPANY',
								name: 'Beggars Belief Theatre Company'
							}
						]
					}
				],
				subMaterials: [
					{
						name: 'The First Henriad',
						differentiator: '2'
					}
				]
			});

		richardIIOriginalVersionMaterial = await chai.request(app)
			.get(`/materials/${RICHARD_II_ORIGINAL_VERSION_MATERIAL_UUID}`);

		richardIISubsequentVersionMaterial = await chai.request(app)
			.get(`/materials/${RICHARD_II_SUBSEQUENT_VERSION_MATERIAL_UUID}`);

		williamShakespearePerson = await chai.request(app)
			.get(`/people/${WILLIAM_SHAKESPEARE_PERSON_UUID}`);

		theKingsMenCompany = await chai.request(app)
			.get(`/companies/${THE_KINGS_MEN_COMPANY_UUID}`);

	});

	after(() => {

		sandbox.restore();

	});

	describe('Richard II (original version) (material)', () => {

		it('includes subsequent versions of this material, with corresponding sur-material and sur-sur-material', () => {

			const expectedSubsequentVersionMaterials = [
				{
					model: 'MATERIAL',
					uuid: RICHARD_II_SUBSEQUENT_VERSION_MATERIAL_UUID,
					name: 'Richard II',
					format: 'play',
					year: 2009,
					surMaterial: {
						model: 'MATERIAL',
						uuid: THE_FIRST_HENRIAD_SUBSEQUENT_VERSION_MATERIAL_UUID,
						name: 'The First Henriad',
						surMaterial: {
							model: 'MATERIAL',
							uuid: THE_HENRIAD_SUBSEQUENT_VERSION_MATERIAL_UUID,
							name: 'The Henriad'
						}
					},
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'adapted for young people by',
							entities: [
								{
									model: 'PERSON',
									uuid: CARL_HEAP_PERSON_UUID,
									name: 'Carl Heap'
								},
								{
									model: 'COMPANY',
									uuid: BEGGARS_BELIEF_THEATRE_COMPANY_UUID,
									name: 'Beggars Belief Theatre Company'
								}
							]
						}
					]
				}
			];

			const { subsequentVersionMaterials } = richardIIOriginalVersionMaterial.body;

			expect(subsequentVersionMaterials).to.deep.equal(expectedSubsequentVersionMaterials);

		});

	});

	describe('Richard II (subsequent version) (material)', () => {

		it('includes original version of this material, with corresponding sur-material and sur-sur-material', () => {

			const expectedOriginalVersionMaterial = {
				model: 'MATERIAL',
				uuid: RICHARD_II_ORIGINAL_VERSION_MATERIAL_UUID,
				name: 'Richard II',
				format: 'play',
				year: 1595,
				surMaterial: {
					model: 'MATERIAL',
					uuid: THE_FIRST_HENRIAD_ORIGINAL_VERSION_MATERIAL_UUID,
					name: 'The First Henriad',
					surMaterial: {
						model: 'MATERIAL',
						uuid: THE_HENRIAD_ORIGINAL_VERSION_MATERIAL_UUID,
						name: 'The Henriad'
					}
				},
				writingCredits: [
					{
						model: 'WRITING_CREDIT',
						name: 'by',
						entities: [
							{
								model: 'PERSON',
								uuid: WILLIAM_SHAKESPEARE_PERSON_UUID,
								name: 'William Shakespeare'
							},
							{
								model: 'COMPANY',
								uuid: THE_KINGS_MEN_COMPANY_UUID,
								name: 'The King\'s Men'
							}
						]
					}
				]
			};

			const { originalVersionMaterial } = richardIISubsequentVersionMaterial.body;

			expect(originalVersionMaterial).to.deep.equal(expectedOriginalVersionMaterial);

		});

	});

	describe('William Shakespeare (person)', () => {

		it('includes subsequent versions of materials they originally wrote, with corresponding sur-material and  sur-sur-material', () => {

			const expectedSubsequentVersionMaterials = [
				{
					model: 'MATERIAL',
					uuid: RICHARD_II_SUBSEQUENT_VERSION_MATERIAL_UUID,
					name: 'Richard II',
					format: 'play',
					year: 2009,
					surMaterial: {
						model: 'MATERIAL',
						uuid: THE_FIRST_HENRIAD_SUBSEQUENT_VERSION_MATERIAL_UUID,
						name: 'The First Henriad',
						surMaterial: {
							model: 'MATERIAL',
							uuid: THE_HENRIAD_SUBSEQUENT_VERSION_MATERIAL_UUID,
							name: 'The Henriad'
						}
					},
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'by',
							entities: [
								{
									model: 'PERSON',
									uuid: WILLIAM_SHAKESPEARE_PERSON_UUID,
									name: 'William Shakespeare'
								},
								{
									model: 'COMPANY',
									uuid: THE_KINGS_MEN_COMPANY_UUID,
									name: 'The King\'s Men'
								}
							]
						},
						{
							model: 'WRITING_CREDIT',
							name: 'adapted for young people by',
							entities: [
								{
									model: 'PERSON',
									uuid: CARL_HEAP_PERSON_UUID,
									name: 'Carl Heap'
								},
								{
									model: 'COMPANY',
									uuid: BEGGARS_BELIEF_THEATRE_COMPANY_UUID,
									name: 'Beggars Belief Theatre Company'
								}
							]
						}
					]
				}
			];

			const { subsequentVersionMaterials } = williamShakespearePerson.body;

			expect(subsequentVersionMaterials).to.deep.equal(expectedSubsequentVersionMaterials);

		});

	});

	describe('The King\'s Men (company)', () => {

		it('includes subsequent versions of materials it originally wrote, with corresponding sur-material and sur-sur-material', () => {

			const expectedSubsequentVersionMaterials = [
				{
					model: 'MATERIAL',
					uuid: RICHARD_II_SUBSEQUENT_VERSION_MATERIAL_UUID,
					name: 'Richard II',
					format: 'play',
					year: 2009,
					surMaterial: {
						model: 'MATERIAL',
						uuid: THE_FIRST_HENRIAD_SUBSEQUENT_VERSION_MATERIAL_UUID,
						name: 'The First Henriad',
						surMaterial: {
							model: 'MATERIAL',
							uuid: THE_HENRIAD_SUBSEQUENT_VERSION_MATERIAL_UUID,
							name: 'The Henriad'
						}
					},
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'by',
							entities: [
								{
									model: 'PERSON',
									uuid: WILLIAM_SHAKESPEARE_PERSON_UUID,
									name: 'William Shakespeare'
								},
								{
									model: 'COMPANY',
									uuid: THE_KINGS_MEN_COMPANY_UUID,
									name: 'The King\'s Men'
								}
							]
						},
						{
							model: 'WRITING_CREDIT',
							name: 'adapted for young people by',
							entities: [
								{
									model: 'PERSON',
									uuid: CARL_HEAP_PERSON_UUID,
									name: 'Carl Heap'
								},
								{
									model: 'COMPANY',
									uuid: BEGGARS_BELIEF_THEATRE_COMPANY_UUID,
									name: 'Beggars Belief Theatre Company'
								}
							]
						}
					]
				}
			];

			const { subsequentVersionMaterials } = theKingsMenCompany.body;

			expect(subsequentVersionMaterials).to.deep.equal(expectedSubsequentVersionMaterials);

		});

	});

});
