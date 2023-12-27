import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { createSandbox } from 'sinon';

import * as getRandomUuidModule from '../../src/lib/get-random-uuid';
import app from '../../src/app';
import { purgeDatabase } from '../test-helpers/neo4j';
import { getStubUuid } from '../test-helpers';

describe('Material with sub-materials and subsequent versions thereof', () => {

	chai.use(chaiHttp);

	const TRAFALGAR_STUDIOS_VENUE_UUID = 'TRAFALGAR_STUDIOS_VENUE_UUID';
	const STUDIO_1_VENUE_UUID = 'STUDIO_1_VENUE_UUID';
	const AGAMEMNON_ORIGINAL_VERSION_MATERIAL_UUID = 'AGAMEMNON_1_MATERIAL_UUID';
	const AESCHYLUS_PERSON_UUID = 'AESCHYLUS_PERSON_UUID';
	const THE_FATHERS_OF_TRAGEDY_COMPANY_UUID = 'THE_FATHERS_OF_TRAGEDY_COMPANY_UUID';
	const THE_ORESTEIA_ORIGINAL_VERSION_MATERIAL_UUID = 'THE_ORESTEIA_1_MATERIAL_UUID';
	const AGAMEMNON_SUBSEQUENT_VERSION_MATERIAL_UUID = 'AGAMEMNON_2_MATERIAL_UUID';
	const ROBERT_ICKE_PERSON_UUID = 'ROBERT_ICKE_PERSON_UUID';
	const THE_GREAT_HOPE_COMPANY_UUID = 'THE_GREAT_HOPE_COMPANY_COMPANY_UUID';
	const THE_ORESTEIA_SUBSEQUENT_VERSION_MATERIAL_UUID = 'THE_ORESTEIA_2_MATERIAL_UUID';
	const AGAMEMNON_ALMEIDA_PRODUCTION_UUID = 'AGAMEMNON_PRODUCTION_UUID';
	const ALMEIDA_THEATRE_VENUE_UUID = 'ALMEIDA_THEATRE_VENUE_UUID';
	const ORESTEIA_ALMEIDA_PRODUCTION_UUID = 'ORESTEIA_PRODUCTION_UUID';
	const AGAMEMNON_TRAFALGAR_STUDIOS_PRODUCTION_UUID = 'AGAMEMNON_2_PRODUCTION_UUID';
	const ORESTEIA_TRAFALGAR_STUDIOS_PRODUCTION_UUID = 'ORESTEIA_2_PRODUCTION_UUID';
	const PLUGH_ORIGINAL_VERSION_MATERIAL_UUID = 'PLUGH_MATERIAL_UUID';
	const FRANCIS_FLOB_PERSON_UUID = 'FRANCIS_FLOB_PERSON_UUID';
	const CURTAIN_UP_LTD_COMPANY_UUID = 'CURTAIN_UP_LTD_COMPANY_UUID';
	const SUB_PLUGH_SUBSEQUENT_VERSION_MATERIAL_UUID = 'SUB_PLUGH_MATERIAL_UUID';
	const BEATRICE_BAR_PERSON_UUID = 'BEATRICE_BAR_PERSON_UUID';
	const STAGECRAFT_LTD_COMPANY_UUID = 'STAGECRAFT_LTD_COMPANY_UUID';
	const SUR_PLUGH_SUBSEQUENT_VERSION_MATERIAL_UUID = 'SUR_PLUGH_MATERIAL_UUID';
	const PLUGH_REDUX_SUBSEQUENT_VERSION_MATERIAL_UUID = 'PLUGH_REDUX_MATERIAL_UUID';
	const JANE_ROE_PERSON_UUID = 'JANE_ROE_PERSON_UUID';
	const FICTIONEERS_LTD_COMPANY_UUID = 'FICTIONEERS_LTD_COMPANY_UUID';
	const SUB_PLUGH_REDUX_GIELGUD_PRODUCTION_UUID = 'SUB_PLUGH_REDUX_PRODUCTION_UUID';
	const GIELGUD_THEATRE_VENUE_UUID = 'GIELGUD_THEATRE_VENUE_UUID';
	const SUR_PLUGH_REDUX_GIELGUD_PRODUCTION_UUID = 'SUR_PLUGH_REDUX_PRODUCTION_UUID';

	let agamemnonOriginalVersionMaterial;
	let agamemnonSubsequentVersionMaterial;
	let theOresteiaSubsequentVersionMaterial;
	let aeschylusPerson;
	let theFathersOfTragedyCompany;
	let plughOriginalVersionMaterial;
	let francisFlobPerson;
	let curtainUpLtdCompany;

	const sandbox = createSandbox();

	before(async () => {

		const stubUuidCounts = {};

		sandbox.stub(getRandomUuidModule, 'getRandomUuid').callsFake(arg => getStubUuid(arg, stubUuidCounts));

		await purgeDatabase();

		await chai.request(app)
			.post('/venues')
			.send({
				name: 'Trafalgar Studios',
				subVenues: [
					{
						name: 'Studio 1'
					}
				]
			});

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
			.post('/productions')
			.send({
				name: 'Agamemnon',
				startDate: '2015-05-29',
				pressDate: '2015-06-05',
				endDate: '2015-07-18',
				material: {
					name: 'Agamemnon',
					differentiator: '2'
				},
				venue: {
					name: 'Almeida Theatre'
				}
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Oresteia',
				startDate: '2015-05-29',
				pressDate: '2015-06-05',
				endDate: '2015-07-18',
				material: {
					name: 'The Oresteia',
					differentiator: '2'
				},
				venue: {
					name: 'Almeida Theatre'
				},
				subProductions: [
					{
						uuid: AGAMEMNON_ALMEIDA_PRODUCTION_UUID
					}
				]
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Agamemnon',
				startDate: '2015-08-22',
				pressDate: '2015-09-07',
				endDate: '2015-11-07',
				material: {
					name: 'Agamemnon',
					differentiator: '2'
				},
				venue: {
					name: 'Studio 1'
				}
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Oresteia',
				startDate: '2015-08-22',
				pressDate: '2015-09-07',
				endDate: '2015-11-07',
				material: {
					name: 'The Oresteia',
					differentiator: '2'
				},
				venue: {
					name: 'Studio 1'
				},
				subProductions: [
					{
						uuid: AGAMEMNON_TRAFALGAR_STUDIOS_PRODUCTION_UUID
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

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Plugh Redux',
				format: 'play',
				year: '2023',
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
								name: 'Jane Roe'
							},
							{
								model: 'COMPANY',
								name: 'Fictioneers Ltd'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Sub-Plugh Redux',
				startDate: '2023-10-17',
				pressDate: '2023-10-26',
				endDate: '2023-12-23',
				material: {
					name: 'Plugh Redux'
				},
				venue: {
					name: 'Gielgud Theatre'
				}
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Sur-Plugh Redux',
				startDate: '2023-10-17',
				pressDate: '2023-10-26',
				endDate: '2023-12-23',
				material: {
					name: 'Plugh Redux'
				},
				venue: {
					name: 'Gielgud Theatre'
				},
				subProductions: [
					{
						uuid: SUB_PLUGH_REDUX_GIELGUD_PRODUCTION_UUID
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

		francisFlobPerson = await chai.request(app)
			.get(`/people/${FRANCIS_FLOB_PERSON_UUID}`);

		curtainUpLtdCompany = await chai.request(app)
			.get(`/companies/${CURTAIN_UP_LTD_COMPANY_UUID}`);

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

		it('includes productions of subsequent versions of materials they originally wrote, with corresponding sur-production; will exclude sur-productions when included via sub-production association', () => {

			const expectedSubsequentVersionMaterialProductions = [
				{
					model: 'PRODUCTION',
					uuid: AGAMEMNON_TRAFALGAR_STUDIOS_PRODUCTION_UUID,
					name: 'Agamemnon',
					startDate: '2015-08-22',
					endDate: '2015-11-07',
					venue: {
						model: 'VENUE',
						uuid: STUDIO_1_VENUE_UUID,
						name: 'Studio 1',
						surVenue: {
							model: 'VENUE',
							uuid: TRAFALGAR_STUDIOS_VENUE_UUID,
							name: 'Trafalgar Studios'
						}
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: ORESTEIA_TRAFALGAR_STUDIOS_PRODUCTION_UUID,
						name: 'Oresteia',
						surProduction: null
					}
				},
				{
					model: 'PRODUCTION',
					uuid: AGAMEMNON_ALMEIDA_PRODUCTION_UUID,
					name: 'Agamemnon',
					startDate: '2015-05-29',
					endDate: '2015-07-18',
					venue: {
						model: 'VENUE',
						uuid: ALMEIDA_THEATRE_VENUE_UUID,
						name: 'Almeida Theatre',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: ORESTEIA_ALMEIDA_PRODUCTION_UUID,
						name: 'Oresteia',
						surProduction: null
					}
				}
			];

			const { subsequentVersionMaterialProductions } = aeschylusPerson.body;

			expect(subsequentVersionMaterialProductions).to.deep.equal(expectedSubsequentVersionMaterialProductions);

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

		it('includes productions of subsequent versions of materials they originally wrote, with corresponding sur-production; will exclude sur-productions when included via sub-production association', () => {

			const expectedSubsequentVersionMaterialProductions = [
				{
					model: 'PRODUCTION',
					uuid: AGAMEMNON_TRAFALGAR_STUDIOS_PRODUCTION_UUID,
					name: 'Agamemnon',
					startDate: '2015-08-22',
					endDate: '2015-11-07',
					venue: {
						model: 'VENUE',
						uuid: STUDIO_1_VENUE_UUID,
						name: 'Studio 1',
						surVenue: {
							model: 'VENUE',
							uuid: TRAFALGAR_STUDIOS_VENUE_UUID,
							name: 'Trafalgar Studios'
						}
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: ORESTEIA_TRAFALGAR_STUDIOS_PRODUCTION_UUID,
						name: 'Oresteia',
						surProduction: null
					}
				},
				{
					model: 'PRODUCTION',
					uuid: AGAMEMNON_ALMEIDA_PRODUCTION_UUID,
					name: 'Agamemnon',
					startDate: '2015-05-29',
					endDate: '2015-07-18',
					venue: {
						model: 'VENUE',
						uuid: ALMEIDA_THEATRE_VENUE_UUID,
						name: 'Almeida Theatre',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: ORESTEIA_ALMEIDA_PRODUCTION_UUID,
						name: 'Oresteia',
						surProduction: null
					}
				}
			];

			const { subsequentVersionMaterialProductions } = theFathersOfTragedyCompany.body;

			expect(subsequentVersionMaterialProductions).to.deep.equal(expectedSubsequentVersionMaterialProductions);

		});

	});

	describe('Plugh (original version, 1899) (material): single original version is attached to multiple tiers of subsequent version', () => {

		it('includes subsequent versions of this material, with corresponding sur-material; will exclude sur-materials when included via sub-material association', () => {

			const expectedSubsequentVersionMaterials = [
				{
					model: 'MATERIAL',
					uuid: PLUGH_REDUX_SUBSEQUENT_VERSION_MATERIAL_UUID,
					name: 'Plugh Redux',
					format: 'play',
					year: 2023,
					surMaterial: null,
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'version by',
							entities: [
								{
									model: 'PERSON',
									uuid: JANE_ROE_PERSON_UUID,
									name: 'Jane Roe'
								},
								{
									model: 'COMPANY',
									uuid: FICTIONEERS_LTD_COMPANY_UUID,
									name: 'Fictioneers Ltd'
								}
							]
						}
					]
				},
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

	describe('Francis Flob (person): single subsequent version of their work is attached to multiple tiers of a production', () => {

		it('includes productions of subsequent versions of materials they originally wrote, with corresponding sur-production; will exclude sur-productions when included via sub-production association', () => {

			const expectedSubsequentVersionMaterialProductions = [
				{
					model: 'PRODUCTION',
					uuid: SUB_PLUGH_REDUX_GIELGUD_PRODUCTION_UUID,
					name: 'Sub-Plugh Redux',
					startDate: '2023-10-17',
					endDate: '2023-12-23',
					venue: {
						model: 'VENUE',
						uuid: GIELGUD_THEATRE_VENUE_UUID,
						name: 'Gielgud Theatre',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: SUR_PLUGH_REDUX_GIELGUD_PRODUCTION_UUID,
						name: 'Sur-Plugh Redux',
						surProduction: null
					}
				}
			];

			const { subsequentVersionMaterialProductions } = francisFlobPerson.body;

			expect(subsequentVersionMaterialProductions).to.deep.equal(expectedSubsequentVersionMaterialProductions);

		});

	});

	describe('Curtain Up Ltd (company): single subsequent version of their work is attached to multiple tiers of a production', () => {

		it('includes productions of subsequent versions of materials they originally wrote, with corresponding sur-production; will exclude sur-productions when included via sub-production association', () => {

			const expectedSubsequentVersionMaterialProductions = [
				{
					model: 'PRODUCTION',
					uuid: SUB_PLUGH_REDUX_GIELGUD_PRODUCTION_UUID,
					name: 'Sub-Plugh Redux',
					startDate: '2023-10-17',
					endDate: '2023-12-23',
					venue: {
						model: 'VENUE',
						uuid: GIELGUD_THEATRE_VENUE_UUID,
						name: 'Gielgud Theatre',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: SUR_PLUGH_REDUX_GIELGUD_PRODUCTION_UUID,
						name: 'Sur-Plugh Redux',
						surProduction: null
					}
				}
			];

			const { subsequentVersionMaterialProductions } = curtainUpLtdCompany.body;

			expect(subsequentVersionMaterialProductions).to.deep.equal(expectedSubsequentVersionMaterialProductions);

		});

	});

});
