import crypto from 'crypto';

import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { createSandbox } from 'sinon';

import app from '../../src/app';
import purgeDatabase from '../test-helpers/neo4j/purge-database';

describe('Material with sub-materials', () => {

	chai.use(chaiHttp);

	const VOYAGE_MATERIAL_UUID = '5';
	const TOM_STOPPARD_PERSON_UUID = '7';
	const THE_STRÄUSSLER_GROUP_COMPANY_UUID = '8';
	const ALEXANDER_HERZEN_CHARACTER_UUID = '9';
	const SHIPWRECK_MATERIAL_UUID = '15';
	const SALVAGE_MATERIAL_UUID = '25';
	const THE_COAST_OF_UTOPIA_MATERIAL_UUID = '38';
	const IVAN_TURGENEV_CHARACTER_UUID = '45';
	const VOYAGE_OLIVIER_PRODUCTION_UUID = '46';
	const THE_COAST_OF_UTOPIA_OLIVIER_PRODUCTION_UUID = '49';

	let theCoastOfUtopiaMaterial;
	let voyageMaterial;
	let alexanderHerzenCharacter;
	let ivanTurgunevCharacter;
	let theCoastOfUtopiaOlivierProduction;
	let voyageOlivierProduction;
	let tomStoppardPerson;
	let theSträusslerGroupCompany;

	const sandbox = createSandbox();

	before(async () => {

		let uuidCallCount = 0;

		sandbox.stub(crypto, 'randomUUID').callsFake(() => (uuidCallCount++).toString());

		await purgeDatabase();

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Voyage',
				format: 'play',
				year: '2002',
				writingCredits: [
					{
						entities: [
							{
								name: 'Tom Stoppard'
							},
							{
								model: 'COMPANY',
								name: 'The Sträussler Group'
							}
						]
					}
				],
				characterGroups: [
					{
						characters: [
							{
								name: 'Alexander Herzen'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Shipwreck',
				format: 'play',
				year: '2002',
				writingCredits: [
					{
						entities: [
							{
								name: 'Tom Stoppard'
							},
							{
								model: 'COMPANY',
								name: 'The Sträussler Group'
							}
						]
					}
				],
				characterGroups: [
					{
						characters: [
							{
								name: 'Alexander Herzen'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Salvage',
				format: 'play',
				year: '2002',
				writingCredits: [
					{
						entities: [
							{
								name: 'Tom Stoppard'
							},
							{
								model: 'COMPANY',
								name: 'The Sträussler Group'
							}
						]
					}
				],
				characterGroups: [
					{
						characters: [
							{
								name: 'Alexander Herzen'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'The Coast of Utopia',
				format: 'trilogy of plays',
				year: '2002',
				writingCredits: [
					{
						entities: [
							{
								name: 'Tom Stoppard'
							},
							{
								model: 'COMPANY',
								name: 'The Sträussler Group'
							}
						]
					}
				],
				subMaterials: [
					{
						name: 'Voyage'
					},
					{
						name: 'Shipwreck'
					},
					{
						name: 'Salvage'
					}
				],
				characterGroups: [
					{
						characters: [
							{
								name: 'Ivan Turgenev'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Voyage',
				startDate: '2002-06-27',
				pressDate: '2002-08-03',
				endDate: '2002-11-23',
				material: {
					name: 'Voyage'
				},
				venue: {
					name: 'Olivier Theatre'
				}
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'The Coast of Utopia',
				startDate: '2002-06-27',
				pressDate: '2002-08-03',
				endDate: '2002-11-23',
				material: {
					name: 'The Coast of Utopia'
				},
				venue: {
					name: 'Olivier Theatre'
				},
				subProductions: [
					{
						uuid: VOYAGE_OLIVIER_PRODUCTION_UUID
					}
				]
			});

		theCoastOfUtopiaMaterial = await chai.request(app)
			.get(`/materials/${THE_COAST_OF_UTOPIA_MATERIAL_UUID}`);

		voyageMaterial = await chai.request(app)
			.get(`/materials/${VOYAGE_MATERIAL_UUID}`);

		alexanderHerzenCharacter = await chai.request(app)
			.get(`/characters/${ALEXANDER_HERZEN_CHARACTER_UUID}`);

		ivanTurgunevCharacter = await chai.request(app)
			.get(`/characters/${IVAN_TURGENEV_CHARACTER_UUID}`);

		theCoastOfUtopiaOlivierProduction = await chai.request(app)
			.get(`/productions/${THE_COAST_OF_UTOPIA_OLIVIER_PRODUCTION_UUID}`);

		voyageOlivierProduction = await chai.request(app)
			.get(`/productions/${VOYAGE_OLIVIER_PRODUCTION_UUID}`);

		tomStoppardPerson = await chai.request(app)
			.get(`/people/${TOM_STOPPARD_PERSON_UUID}`);

		theSträusslerGroupCompany = await chai.request(app)
			.get(`/companies/${THE_STRÄUSSLER_GROUP_COMPANY_UUID}`);

	});

	after(() => {

		sandbox.restore();

	});

	describe('The Coast of Utopia (material with sub-materials)', () => {

		it('includes its sub-materials', () => {

			const expectedSubMaterials = [
				{
					model: 'MATERIAL',
					uuid: VOYAGE_MATERIAL_UUID,
					name: 'Voyage',
					format: 'play',
					year: 2002,
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'by',
							entities: [
								{
									model: 'PERSON',
									uuid: TOM_STOPPARD_PERSON_UUID,
									name: 'Tom Stoppard'
								},
								{
									model: 'COMPANY',
									uuid: THE_STRÄUSSLER_GROUP_COMPANY_UUID,
									name: 'The Sträussler Group'
								}
							]
						}
					]
				},
				{
					model: 'MATERIAL',
					uuid: SHIPWRECK_MATERIAL_UUID,
					name: 'Shipwreck',
					format: 'play',
					year: 2002,
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'by',
							entities: [
								{
									model: 'PERSON',
									uuid: TOM_STOPPARD_PERSON_UUID,
									name: 'Tom Stoppard'
								},
								{
									model: 'COMPANY',
									uuid: THE_STRÄUSSLER_GROUP_COMPANY_UUID,
									name: 'The Sträussler Group'
								}
							]
						}
					]
				},
				{
					model: 'MATERIAL',
					uuid: SALVAGE_MATERIAL_UUID,
					name: 'Salvage',
					format: 'play',
					year: 2002,
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'by',
							entities: [
								{
									model: 'PERSON',
									uuid: TOM_STOPPARD_PERSON_UUID,
									name: 'Tom Stoppard'
								},
								{
									model: 'COMPANY',
									uuid: THE_STRÄUSSLER_GROUP_COMPANY_UUID,
									name: 'The Sträussler Group'
								}
							]
						}
					]
				}
			];

			const { subMaterials } = theCoastOfUtopiaMaterial.body;

			expect(subMaterials).to.deep.equal(expectedSubMaterials);

		});

	});

	describe('Voyage (material with sur-material)', () => {

		it('includes The Coast of Utopia as its sur-material', () => {

			const expectedSurMaterial = {
				model: 'MATERIAL',
				uuid: THE_COAST_OF_UTOPIA_MATERIAL_UUID,
				name: 'The Coast of Utopia',
				format: 'trilogy of plays',
				year: 2002,
				writingCredits: [
					{
						model: 'WRITING_CREDIT',
						name: 'by',
						entities: [
							{
								model: 'PERSON',
								uuid: TOM_STOPPARD_PERSON_UUID,
								name: 'Tom Stoppard'
							},
							{
								model: 'COMPANY',
								uuid: THE_STRÄUSSLER_GROUP_COMPANY_UUID,
								name: 'The Sträussler Group'
							}
						]
					}
				]
			};

			const { surMaterial } = voyageMaterial.body;

			expect(surMaterial).to.deep.equal(expectedSurMaterial);

		});

	});

	describe('Alexander Herzen (character)', () => {

		it('includes materials in which character was depicted, including the sur-material', () => {

			const expectedMaterials = [
				{
					model: 'MATERIAL',
					uuid: SALVAGE_MATERIAL_UUID,
					name: 'Salvage',
					format: 'play',
					year: 2002,
					surMaterial: {
						model: 'MATERIAL',
						uuid: THE_COAST_OF_UTOPIA_MATERIAL_UUID,
						name: 'The Coast of Utopia'
					},
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'by',
							entities: [
								{
									model: 'PERSON',
									uuid: TOM_STOPPARD_PERSON_UUID,
									name: 'Tom Stoppard'
								},
								{
									model: 'COMPANY',
									uuid: THE_STRÄUSSLER_GROUP_COMPANY_UUID,
									name: 'The Sträussler Group'
								}
							]
						}
					],
					depictions: []
				},
				{
					model: 'MATERIAL',
					uuid: SHIPWRECK_MATERIAL_UUID,
					name: 'Shipwreck',
					format: 'play',
					year: 2002,
					surMaterial: {
						model: 'MATERIAL',
						uuid: THE_COAST_OF_UTOPIA_MATERIAL_UUID,
						name: 'The Coast of Utopia'
					},
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'by',
							entities: [
								{
									model: 'PERSON',
									uuid: TOM_STOPPARD_PERSON_UUID,
									name: 'Tom Stoppard'
								},
								{
									model: 'COMPANY',
									uuid: THE_STRÄUSSLER_GROUP_COMPANY_UUID,
									name: 'The Sträussler Group'
								}
							]
						}
					],
					depictions: []
				},
				{
					model: 'MATERIAL',
					uuid: VOYAGE_MATERIAL_UUID,
					name: 'Voyage',
					format: 'play',
					year: 2002,
					surMaterial: {
						model: 'MATERIAL',
						uuid: THE_COAST_OF_UTOPIA_MATERIAL_UUID,
						name: 'The Coast of Utopia'
					},
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'by',
							entities: [
								{
									model: 'PERSON',
									uuid: TOM_STOPPARD_PERSON_UUID,
									name: 'Tom Stoppard'
								},
								{
									model: 'COMPANY',
									uuid: THE_STRÄUSSLER_GROUP_COMPANY_UUID,
									name: 'The Sträussler Group'
								}
							]
						}
					],
					depictions: []
				}
			];

			const { materials } = alexanderHerzenCharacter.body;

			expect(materials).to.deep.equal(expectedMaterials);

		});

	});

	describe('Ivan Turgenev (character)', () => {

		it('includes materials in which character was portrayed, but with no sur-material as does not apply', () => {

			const expectedMaterials = [
				{
					model: 'MATERIAL',
					uuid: THE_COAST_OF_UTOPIA_MATERIAL_UUID,
					name: 'The Coast of Utopia',
					format: 'trilogy of plays',
					year: 2002,
					surMaterial: null,
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'by',
							entities: [
								{
									model: 'PERSON',
									uuid: TOM_STOPPARD_PERSON_UUID,
									name: 'Tom Stoppard'
								},
								{
									model: 'COMPANY',
									uuid: THE_STRÄUSSLER_GROUP_COMPANY_UUID,
									name: 'The Sträussler Group'
								}
							]
						}
					],
					depictions: []
				}
			];

			const { materials } = ivanTurgunevCharacter.body;

			expect(materials).to.deep.equal(expectedMaterials);

		});

	});

	describe('Voyage at Olivier Theatre (production)', () => {

		it('includes the material and its sur-material', () => {

			const expectedMaterial = {
				model: 'MATERIAL',
				uuid: VOYAGE_MATERIAL_UUID,
				name: 'Voyage',
				format: 'play',
				year: 2002,
				surMaterial: {
					model: 'MATERIAL',
					uuid: THE_COAST_OF_UTOPIA_MATERIAL_UUID,
					name: 'The Coast of Utopia'
				},
				writingCredits: [
					{
						model: 'WRITING_CREDIT',
						name: 'by',
						entities: [
							{
								model: 'PERSON',
								uuid: TOM_STOPPARD_PERSON_UUID,
								name: 'Tom Stoppard'
							},
							{
								model: 'COMPANY',
								uuid: THE_STRÄUSSLER_GROUP_COMPANY_UUID,
								name: 'The Sträussler Group'
							}
						]
					}
				]
			};

			const { material } = voyageOlivierProduction.body;

			expect(material).to.deep.equal(expectedMaterial);

		});

	});

	describe('The Coast of Utopia at Olivier Theatre (production)', () => {

		it('includes the material (but with no sur-material as does not apply)', () => {

			const expectedMaterial = {
				model: 'MATERIAL',
				uuid: THE_COAST_OF_UTOPIA_MATERIAL_UUID,
				name: 'The Coast of Utopia',
				format: 'trilogy of plays',
				year: 2002,
				surMaterial: null,
				writingCredits: [
					{
						model: 'WRITING_CREDIT',
						name: 'by',
						entities: [
							{
								model: 'PERSON',
								uuid: TOM_STOPPARD_PERSON_UUID,
								name: 'Tom Stoppard'
							},
							{
								model: 'COMPANY',
								uuid: THE_STRÄUSSLER_GROUP_COMPANY_UUID,
								name: 'The Sträussler Group'
							}
						]
					}
				]
			};

			const { material } = theCoastOfUtopiaOlivierProduction.body;

			expect(material).to.deep.equal(expectedMaterial);

		});

	});

	describe('Tom Stoppard (person)', () => {

		it('includes in their material credits, where applicable, its sur-material; will exclude credited sur-materials where any of its sub-materials is also a credit as they will appear by virtue of that association', () => {

			const expectedMaterials = [
				{
					model: 'MATERIAL',
					uuid: SALVAGE_MATERIAL_UUID,
					name: 'Salvage',
					format: 'play',
					year: 2002,
					surMaterial: {
						model: 'MATERIAL',
						uuid: THE_COAST_OF_UTOPIA_MATERIAL_UUID,
						name: 'The Coast of Utopia'
					},
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'by',
							entities: [
								{
									model: 'PERSON',
									uuid: TOM_STOPPARD_PERSON_UUID,
									name: 'Tom Stoppard'
								},
								{
									model: 'COMPANY',
									uuid: THE_STRÄUSSLER_GROUP_COMPANY_UUID,
									name: 'The Sträussler Group'
								}
							]
						}
					]
				},
				{
					model: 'MATERIAL',
					uuid: SHIPWRECK_MATERIAL_UUID,
					name: 'Shipwreck',
					format: 'play',
					year: 2002,
					surMaterial: {
						model: 'MATERIAL',
						uuid: THE_COAST_OF_UTOPIA_MATERIAL_UUID,
						name: 'The Coast of Utopia'
					},
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'by',
							entities: [
								{
									model: 'PERSON',
									uuid: TOM_STOPPARD_PERSON_UUID,
									name: 'Tom Stoppard'
								},
								{
									model: 'COMPANY',
									uuid: THE_STRÄUSSLER_GROUP_COMPANY_UUID,
									name: 'The Sträussler Group'
								}
							]
						}
					]
				},
				{
					model: 'MATERIAL',
					uuid: VOYAGE_MATERIAL_UUID,
					name: 'Voyage',
					format: 'play',
					year: 2002,
					surMaterial: {
						model: 'MATERIAL',
						uuid: THE_COAST_OF_UTOPIA_MATERIAL_UUID,
						name: 'The Coast of Utopia'
					},
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'by',
							entities: [
								{
									model: 'PERSON',
									uuid: TOM_STOPPARD_PERSON_UUID,
									name: 'Tom Stoppard'
								},
								{
									model: 'COMPANY',
									uuid: THE_STRÄUSSLER_GROUP_COMPANY_UUID,
									name: 'The Sträussler Group'
								}
							]
						}
					]
				}
			];

			const { materials } = tomStoppardPerson.body;

			expect(materials).to.deep.equal(expectedMaterials);

		});

	});

	describe('The Sträussler Group (company)', () => {

		it('includes in their material credits, where applicable, its sur-material; will exclude credited sur-materials where any of its sub-materials is also a credit as they will appear by virtue of that association', () => {

			const expectedMaterials = [
				{
					model: 'MATERIAL',
					uuid: SALVAGE_MATERIAL_UUID,
					name: 'Salvage',
					format: 'play',
					year: 2002,
					surMaterial: {
						model: 'MATERIAL',
						uuid: THE_COAST_OF_UTOPIA_MATERIAL_UUID,
						name: 'The Coast of Utopia'
					},
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'by',
							entities: [
								{
									model: 'PERSON',
									uuid: TOM_STOPPARD_PERSON_UUID,
									name: 'Tom Stoppard'
								},
								{
									model: 'COMPANY',
									uuid: THE_STRÄUSSLER_GROUP_COMPANY_UUID,
									name: 'The Sträussler Group'
								}
							]
						}
					]
				},
				{
					model: 'MATERIAL',
					uuid: SHIPWRECK_MATERIAL_UUID,
					name: 'Shipwreck',
					format: 'play',
					year: 2002,
					surMaterial: {
						model: 'MATERIAL',
						uuid: THE_COAST_OF_UTOPIA_MATERIAL_UUID,
						name: 'The Coast of Utopia'
					},
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'by',
							entities: [
								{
									model: 'PERSON',
									uuid: TOM_STOPPARD_PERSON_UUID,
									name: 'Tom Stoppard'
								},
								{
									model: 'COMPANY',
									uuid: THE_STRÄUSSLER_GROUP_COMPANY_UUID,
									name: 'The Sträussler Group'
								}
							]
						}
					]
				},
				{
					model: 'MATERIAL',
					uuid: VOYAGE_MATERIAL_UUID,
					name: 'Voyage',
					format: 'play',
					year: 2002,
					surMaterial: {
						model: 'MATERIAL',
						uuid: THE_COAST_OF_UTOPIA_MATERIAL_UUID,
						name: 'The Coast of Utopia'
					},
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'by',
							entities: [
								{
									model: 'PERSON',
									uuid: TOM_STOPPARD_PERSON_UUID,
									name: 'Tom Stoppard'
								},
								{
									model: 'COMPANY',
									uuid: THE_STRÄUSSLER_GROUP_COMPANY_UUID,
									name: 'The Sträussler Group'
								}
							]
						}
					]
				}
			];

			const { materials } = theSträusslerGroupCompany.body;

			expect(materials).to.deep.equal(expectedMaterials);

		});

	});

	describe('materials list', () => {

		it('includes materials and, where applicable, corresponding sur-materials; will exclude sur-materials as these will be referenced by their sub-materials', async () => {

			const response = await chai.request(app)
				.get('/materials');

			const expectedResponseBody = [
				{
					model: 'MATERIAL',
					uuid: SALVAGE_MATERIAL_UUID,
					name: 'Salvage',
					format: 'play',
					year: 2002,
					surMaterial: {
						model: 'MATERIAL',
						uuid: THE_COAST_OF_UTOPIA_MATERIAL_UUID,
						name: 'The Coast of Utopia'
					},
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'by',
							entities: [
								{
									model: 'PERSON',
									uuid: TOM_STOPPARD_PERSON_UUID,
									name: 'Tom Stoppard'
								},
								{
									model: 'COMPANY',
									uuid: THE_STRÄUSSLER_GROUP_COMPANY_UUID,
									name: 'The Sträussler Group'
								}
							]
						}
					]
				},
				{
					model: 'MATERIAL',
					uuid: SHIPWRECK_MATERIAL_UUID,
					name: 'Shipwreck',
					format: 'play',
					year: 2002,
					surMaterial: {
						model: 'MATERIAL',
						uuid: THE_COAST_OF_UTOPIA_MATERIAL_UUID,
						name: 'The Coast of Utopia'
					},
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'by',
							entities: [
								{
									model: 'PERSON',
									uuid: TOM_STOPPARD_PERSON_UUID,
									name: 'Tom Stoppard'
								},
								{
									model: 'COMPANY',
									uuid: THE_STRÄUSSLER_GROUP_COMPANY_UUID,
									name: 'The Sträussler Group'
								}
							]
						}
					]
				},
				{
					model: 'MATERIAL',
					uuid: VOYAGE_MATERIAL_UUID,
					name: 'Voyage',
					format: 'play',
					year: 2002,
					surMaterial: {
						model: 'MATERIAL',
						uuid: THE_COAST_OF_UTOPIA_MATERIAL_UUID,
						name: 'The Coast of Utopia'
					},
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'by',
							entities: [
								{
									model: 'PERSON',
									uuid: TOM_STOPPARD_PERSON_UUID,
									name: 'Tom Stoppard'
								},
								{
									model: 'COMPANY',
									uuid: THE_STRÄUSSLER_GROUP_COMPANY_UUID,
									name: 'The Sträussler Group'
								}
							]
						}
					]
				}
			];

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);

		});

	});

});
