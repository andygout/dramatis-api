import crypto from 'crypto';

import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { createSandbox } from 'sinon';

import app from '../../src/app';
import { purgeDatabase } from '../test-helpers/neo4j';

describe('Material with sub-materials and subsequent versions thereof', () => {

	chai.use(chaiHttp);

	const AGAMEMNON_ORIGINAL_VERSION_MATERIAL_UUID = '4';
	const AESCHYLUS_PERSON_UUID = '6';
	const THE_FATHERS_OF_TRAGEDY_COMPANY_UUID = '7';
	const THE_ORESTEIA_ORIGINAL_VERSION_MATERIAL_UUID = '14';
	const AGAMEMNON_SUBSEQUENT_VERSION_MATERIAL_UUID = '25';
	const ROBERT_ICKE_PERSON_UUID = '29';
	const THE_GREAT_HOPE_COMPANY_UUID = '30';
	const THE_ORESTEIA_SUBSEQUENT_VERSION_MATERIAL_UUID = '39';
	const PLUGH_ORIGINAL_VERSION_MATERIAL_UUID = '50';
	const SUB_PLUGH_SUBSEQUENT_VERSION_MATERIAL_UUID = '60';
	const BEATRICE_BAR_PERSON_UUID = '64';
	const STAGECRAFT_LTD_COMPANY_UUID = '65';
	const SUR_PLUGH_SUBSEQUENT_VERSION_MATERIAL_UUID = '74';

	let agamemnonOriginalVersionMaterial;
	let agamemnonSubsequentVersionMaterial;
	let theOresteiaSubsequentVersionMaterial;
	let aeschylusPerson;
	let theFathersOfTragedyCompany;
	let plughOriginalVersionMaterial;

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

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Plugh',
				format: 'play',
				year: '1899',
				writingCredits: [
					{
						entities: [
							{
								name: 'Francis Flob'
							},
							{
								model: 'COMPANY',
								name: 'Curtain Up Ltd'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Sub-Plugh',
				format: 'play',
				year: '2009',
				originalVersionMaterial: {
					name: 'Plugh'
				},
				writingCredits: [
					{
						name: 'after',
						entities: [
							{
								name: 'Francis Flob'
							},
							{
								model: 'COMPANY',
								name: 'Curtain Up Ltd'
							}
						]
					},
					{
						name: 'version by',
						entities: [
							{
								name: 'Beatrice Bar'
							},
							{
								model: 'COMPANY',
								name: 'Stagecraft Ltd'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Sur-Plugh',
				format: 'play',
				year: '2009',
				originalVersionMaterial: {
					name: 'Plugh'
				},
				writingCredits: [
					{
						name: 'after',
						entities: [
							{
								name: 'Francis Flob'
							},
							{
								model: 'COMPANY',
								name: 'Curtain Up Ltd'
							}
						]
					},
					{
						name: 'version by',
						entities: [
							{
								name: 'Beatrice Bar Jr'
							},
							{
								model: 'COMPANY',
								name: 'Sub-Stagecraft Ltd'
							}
						]
					}
				],
				subMaterials: [
					{
						name: 'Sub-Plugh'
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

		plughOriginalVersionMaterial = await chai.request(app)
			.get(`/materials/${PLUGH_ORIGINAL_VERSION_MATERIAL_UUID}`);

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

		it('includes subsequent versions of materials they originally wrote, with corresponding sur-material; will exclude sur-materials when included via sub-material association', () => {

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

		it('includes subsequent versions of materials it originally wrote, with corresponding sur-material; will exclude sur-materials when included via sub-material association', () => {

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

	describe('Plugh (original version, 1899) (material): single original version is attached to multiple tiers of subsequent version', () => {

		it('includes subsequent versions of this material, with corresponding sur-material; will exclude sur-materials when included via sub-material association', () => {

			const expectedSubsequentVersionMaterials = [
				{
					model: 'MATERIAL',
					uuid: SUB_PLUGH_SUBSEQUENT_VERSION_MATERIAL_UUID,
					name: 'Sub-Plugh',
					format: 'play',
					year: 2009,
					surMaterial: {
						model: 'MATERIAL',
						uuid: SUR_PLUGH_SUBSEQUENT_VERSION_MATERIAL_UUID,
						name: 'Sur-Plugh',
						surMaterial: null
					},
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'version by',
							entities: [
								{
									model: 'PERSON',
									uuid: BEATRICE_BAR_PERSON_UUID,
									name: 'Beatrice Bar'
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

			const { subsequentVersionMaterials } = plughOriginalVersionMaterial.body;

			expect(subsequentVersionMaterials).to.deep.equal(expectedSubsequentVersionMaterials);

		});

	});

});
