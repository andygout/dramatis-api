import crypto from 'crypto';

import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { createSandbox } from 'sinon';

import app from '../../src/app';
import purgeDatabase from '../test-helpers/neo4j/purge-database';

describe('Material with sub-materials and subsequent versions thereof', () => {

	chai.use(chaiHttp);

	const AGAMEMNON_ORIGINAL_VERSION_MATERIAL_UUID = '4';
	const AESCHYLUS_PERSON_UUID = '6';
	const THE_FATHERS_OF_TRAGEDY_COMPANY_UUID = '7';
	const THE_ORESTEIA_ORIGINAL_VERSION_MATERIAL_UUID = '13';
	const AGAMEMNON_SUBSEQUENT_VERSION_MATERIAL_UUID = '24';
	const ROBERT_ICKE_PERSON_UUID = '28';
	const THE_GREAT_HOPE_COMPANY_UUID = '29';
	const THE_ORESTEIA_SUBSEQUENT_VERSION_MATERIAL_UUID = '37';

	let agamemnonOriginalVersionMaterial;
	let agamemnonSubsequentVersionMaterial;
	let theOresteiaSubsequentVersionMaterial;
	let aeschylusPerson;
	let theFathersOfTragedyCompany;

	const sandbox = createSandbox();

	before(async () => {

		let uuidCallCount = 0;

		sandbox.stub(crypto, 'randomUUID').callsFake(() => (uuidCallCount++).toString());

		await purgeDatabase();

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Agamemnon',
				differentiator: '1',
				format: 'play',
				year: '500',
				writingCredits: [
					{
						entities: [
							{
								name: 'Aeschylus'
							},
							{
								model: 'COMPANY',
								name: 'The Fathers of Tragedy'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'The Oresteia',
				differentiator: '1',
				format: 'trilogy of plays',
				year: '500',
				writingCredits: [
					{
						entities: [
							{
								name: 'Aeschylus'
							},
							{
								model: 'COMPANY',
								name: 'The Fathers of Tragedy'
							}
						]
					}
				],
				subMaterials: [
					{
						name: 'Agamemnon',
						differentiator: '1'
					}
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Agamemnon',
				differentiator: '2',
				format: 'play',
				year: '2015',
				originalVersionMaterial: {
					name: 'Agamemnon',
					differentiator: '1'
				},
				writingCredits: [
					{
						entities: [
							{
								name: 'Aeschylus'
							},
							{
								model: 'COMPANY',
								name: 'The Fathers of Tragedy'
							}
						]
					},
					{
						name: 'adapted by',
						entities: [
							{
								name: 'Robert Icke'
							},
							{
								model: 'COMPANY',
								name: 'The Great Hope Company'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'The Oresteia',
				differentiator: '2',
				format: 'trilogy of plays',
				year: '2015',
				originalVersionMaterial: {
					name: 'The Oresteia',
					differentiator: '1'
				},
				writingCredits: [
					{
						entities: [
							{
								name: 'Aeschylus'
							},
							{
								model: 'COMPANY',
								name: 'The Fathers of Tragedy'
							}
						]
					},
					{
						name: 'adapted by',
						entities: [
							{
								name: 'Robert Icke'
							},
							{
								model: 'COMPANY',
								name: 'The Great Hope Company'
							}
						]
					}
				],
				subMaterials: [
					{
						name: 'Agamemnon',
						differentiator: '2'
					}
				]
			});

		agamemnonOriginalVersionMaterial = await chai.request(app)
			.get(`/materials/${AGAMEMNON_ORIGINAL_VERSION_MATERIAL_UUID}`);

		agamemnonSubsequentVersionMaterial = await chai.request(app)
			.get(`/materials/${AGAMEMNON_SUBSEQUENT_VERSION_MATERIAL_UUID}`);

		theOresteiaSubsequentVersionMaterial = await chai.request(app)
			.get(`/materials/${THE_ORESTEIA_SUBSEQUENT_VERSION_MATERIAL_UUID}`);

		aeschylusPerson = await chai.request(app)
			.get(`/people/${AESCHYLUS_PERSON_UUID}`);

		theFathersOfTragedyCompany = await chai.request(app)
			.get(`/companies/${THE_FATHERS_OF_TRAGEDY_COMPANY_UUID}`);

	});

	after(() => {

		sandbox.restore();

	});

	describe('Agamemnon (original version) (material)', () => {

		it('includes subsequent versions of this material, with corresponding sur-material', () => {

			const expectedSubsequentVersionMaterials = [
				{
					model: 'MATERIAL',
					uuid: AGAMEMNON_SUBSEQUENT_VERSION_MATERIAL_UUID,
					name: 'Agamemnon',
					format: 'play',
					year: 2015,
					surMaterial: {
						model: 'MATERIAL',
						uuid: THE_ORESTEIA_SUBSEQUENT_VERSION_MATERIAL_UUID,
						name: 'The Oresteia',
						surMaterial: null
					},
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'adapted by',
							entities: [
								{
									model: 'PERSON',
									uuid: ROBERT_ICKE_PERSON_UUID,
									name: 'Robert Icke'
								},
								{
									model: 'COMPANY',
									uuid: THE_GREAT_HOPE_COMPANY_UUID,
									name: 'The Great Hope Company'
								}
							]
						}
					]
				}
			];

			const { subsequentVersionMaterials } = agamemnonOriginalVersionMaterial.body;

			expect(subsequentVersionMaterials).to.deep.equal(expectedSubsequentVersionMaterials);

		});

	});

	describe('Agamemnon (subsequent version) (material)', () => {

		it('includes original version of this material, with corresponding sur-material', () => {

			const expectedOriginalVersionMaterial = {
				model: 'MATERIAL',
				uuid: AGAMEMNON_ORIGINAL_VERSION_MATERIAL_UUID,
				name: 'Agamemnon',
				format: 'play',
				year: 500,
				surMaterial: {
					model: 'MATERIAL',
					uuid: THE_ORESTEIA_ORIGINAL_VERSION_MATERIAL_UUID,
					name: 'The Oresteia',
					surMaterial: null
				},
				writingCredits: [
					{
						model: 'WRITING_CREDIT',
						name: 'by',
						entities: [
							{
								model: 'PERSON',
								uuid: AESCHYLUS_PERSON_UUID,
								name: 'Aeschylus'
							},
							{
								model: 'COMPANY',
								uuid: THE_FATHERS_OF_TRAGEDY_COMPANY_UUID,
								name: 'The Fathers of Tragedy'
							}
						]
					}
				]
			};

			const { originalVersionMaterial } = agamemnonSubsequentVersionMaterial.body;

			expect(originalVersionMaterial).to.deep.equal(expectedOriginalVersionMaterial);

		});

		it('includes its sur-material with its corresponding original version', () => {

			const expectedSurMaterial = {
				model: 'MATERIAL',
				uuid: THE_ORESTEIA_SUBSEQUENT_VERSION_MATERIAL_UUID,
				name: 'The Oresteia',
				format: 'trilogy of plays',
				year: 2015,
				writingCredits: [
					{
						model: 'WRITING_CREDIT',
						name: 'by',
						entities: [
							{
								model: 'PERSON',
								uuid: AESCHYLUS_PERSON_UUID,
								name: 'Aeschylus'
							},
							{
								model: 'COMPANY',
								uuid: THE_FATHERS_OF_TRAGEDY_COMPANY_UUID,
								name: 'The Fathers of Tragedy'
							}
						]
					},
					{
						model: 'WRITING_CREDIT',
						name: 'adapted by',
						entities: [
							{
								model: 'PERSON',
								uuid: ROBERT_ICKE_PERSON_UUID,
								name: 'Robert Icke'
							},
							{
								model: 'COMPANY',
								uuid: THE_GREAT_HOPE_COMPANY_UUID,
								name: 'The Great Hope Company'
							}
						]
					}
				],
				originalVersionMaterial: {
					model: 'MATERIAL',
					uuid: THE_ORESTEIA_ORIGINAL_VERSION_MATERIAL_UUID,
					name: 'The Oresteia',
					format: 'trilogy of plays',
					year: 500,
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'by',
							entities: [
								{
									model: 'PERSON',
									uuid: AESCHYLUS_PERSON_UUID,
									name: 'Aeschylus'
								},
								{
									model: 'COMPANY',
									uuid: THE_FATHERS_OF_TRAGEDY_COMPANY_UUID,
									name: 'The Fathers of Tragedy'
								}
							]
						}
					],
					surMaterial: null
				},
				surMaterial: null,
				characterGroups: []

			};

			const { surMaterial } = agamemnonSubsequentVersionMaterial.body;

			expect(surMaterial).to.deep.equal(expectedSurMaterial);

		});

	});

	describe('The Oresteia (subsequent version) (material)', () => {

		it('includes its sub-materials with their corresponding original versions', () => {

			const expectedSubMaterials = [
				{
					model: 'MATERIAL',
					uuid: AGAMEMNON_SUBSEQUENT_VERSION_MATERIAL_UUID,
					name: 'Agamemnon',
					format: 'play',
					year: 2015,
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'by',
							entities: [
								{
									model: 'PERSON',
									uuid: AESCHYLUS_PERSON_UUID,
									name: 'Aeschylus'
								},
								{
									model: 'COMPANY',
									uuid: THE_FATHERS_OF_TRAGEDY_COMPANY_UUID,
									name: 'The Fathers of Tragedy'
								}
							]
						},
						{
							model: 'WRITING_CREDIT',
							name: 'adapted by',
							entities: [
								{
									model: 'PERSON',
									uuid: ROBERT_ICKE_PERSON_UUID,
									name: 'Robert Icke'
								},
								{
									model: 'COMPANY',
									uuid: THE_GREAT_HOPE_COMPANY_UUID,
									name: 'The Great Hope Company'
								}
							]
						}
					],
					originalVersionMaterial: {
						model: 'MATERIAL',
						uuid: AGAMEMNON_ORIGINAL_VERSION_MATERIAL_UUID,
						name: 'Agamemnon',
						format: 'play',
						year: 500,
						writingCredits: [
							{
								model: 'WRITING_CREDIT',
								name: 'by',
								entities: [
									{
										model: 'PERSON',
										uuid: AESCHYLUS_PERSON_UUID,
										name: 'Aeschylus'
									},
									{
										model: 'COMPANY',
										uuid: THE_FATHERS_OF_TRAGEDY_COMPANY_UUID,
										name: 'The Fathers of Tragedy'
									}
								]
							}
						],
						surMaterial: {
							model: 'MATERIAL',
							uuid: THE_ORESTEIA_ORIGINAL_VERSION_MATERIAL_UUID,
							name: 'The Oresteia',
							surMaterial: null
						}
					},
					subMaterials: [],
					characterGroups: []

				}
			];

			const { subMaterials } = theOresteiaSubsequentVersionMaterial.body;

			expect(subMaterials).to.deep.equal(expectedSubMaterials);

		});

	});

	describe('Aeschylus (person)', () => {

		it('includes subsequent versions of materials they originally wrote, with corresponding sur-material', () => {

			const expectedSubsequentVersionMaterials = [
				{
					model: 'MATERIAL',
					uuid: AGAMEMNON_SUBSEQUENT_VERSION_MATERIAL_UUID,
					name: 'Agamemnon',
					format: 'play',
					year: 2015,
					surMaterial: {
						model: 'MATERIAL',
						uuid: THE_ORESTEIA_SUBSEQUENT_VERSION_MATERIAL_UUID,
						name: 'The Oresteia',
						surMaterial: null
					},
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'by',
							entities: [
								{
									model: 'PERSON',
									uuid: AESCHYLUS_PERSON_UUID,
									name: 'Aeschylus'
								},
								{
									model: 'COMPANY',
									uuid: THE_FATHERS_OF_TRAGEDY_COMPANY_UUID,
									name: 'The Fathers of Tragedy'
								}
							]
						},
						{
							model: 'WRITING_CREDIT',
							name: 'adapted by',
							entities: [
								{
									model: 'PERSON',
									uuid: ROBERT_ICKE_PERSON_UUID,
									name: 'Robert Icke'
								},
								{
									model: 'COMPANY',
									uuid: THE_GREAT_HOPE_COMPANY_UUID,
									name: 'The Great Hope Company'
								}
							]
						}
					]
				}
			];

			const { subsequentVersionMaterials } = aeschylusPerson.body;

			expect(subsequentVersionMaterials).to.deep.equal(expectedSubsequentVersionMaterials);

		});

	});

	describe('The Fathers of Tragedy (company)', () => {

		it('includes subsequent versions of materials it originally wrote, with corresponding sur-material', () => {

			const expectedSubsequentVersionMaterials = [
				{
					model: 'MATERIAL',
					uuid: AGAMEMNON_SUBSEQUENT_VERSION_MATERIAL_UUID,
					name: 'Agamemnon',
					format: 'play',
					year: 2015,
					surMaterial: {
						model: 'MATERIAL',
						uuid: THE_ORESTEIA_SUBSEQUENT_VERSION_MATERIAL_UUID,
						name: 'The Oresteia',
						surMaterial: null
					},
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'by',
							entities: [
								{
									model: 'PERSON',
									uuid: AESCHYLUS_PERSON_UUID,
									name: 'Aeschylus'
								},
								{
									model: 'COMPANY',
									uuid: THE_FATHERS_OF_TRAGEDY_COMPANY_UUID,
									name: 'The Fathers of Tragedy'
								}
							]
						},
						{
							model: 'WRITING_CREDIT',
							name: 'adapted by',
							entities: [
								{
									model: 'PERSON',
									uuid: ROBERT_ICKE_PERSON_UUID,
									name: 'Robert Icke'
								},
								{
									model: 'COMPANY',
									uuid: THE_GREAT_HOPE_COMPANY_UUID,
									name: 'The Great Hope Company'
								}
							]
						}
					]
				}
			];

			const { subsequentVersionMaterials } = theFathersOfTragedyCompany.body;

			expect(subsequentVersionMaterials).to.deep.equal(expectedSubsequentVersionMaterials);

		});

	});

});
