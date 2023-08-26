import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { createSandbox } from 'sinon';

import * as getRandomUuidModule from '../../src/lib/get-random-uuid';
import app from '../../src/app';
import { purgeDatabase } from '../test-helpers/neo4j';
import { getStubUuid } from '../test-helpers';

describe('Material with sub-sub-materials and subsequent versions thereof', () => {

	chai.use(chaiHttp);

	const RICHARD_II_ORIGINAL_VERSION_MATERIAL_UUID = 'RICHARD_II_1_MATERIAL_UUID';
	const WILLIAM_SHAKESPEARE_PERSON_UUID = 'WILLIAM_SHAKESPEARE_PERSON_UUID';
	const THE_KINGS_MEN_COMPANY_UUID = 'THE_KINGS_MEN_COMPANY_UUID';
	const THE_FIRST_HENRIAD_ORIGINAL_VERSION_MATERIAL_UUID = 'THE_FIRST_HENRIAD_1_MATERIAL_UUID';
	const THE_HENRIAD_ORIGINAL_VERSION_MATERIAL_UUID = 'THE_HENRIAD_1_MATERIAL_UUID';
	const RICHARD_II_SUBSEQUENT_VERSION_MATERIAL_UUID = 'RICHARD_II_2_MATERIAL_UUID';
	const CARL_HEAP_PERSON_UUID = 'CARL_HEAP_PERSON_UUID';
	const BEGGARS_BELIEF_THEATRE_COMPANY_UUID = 'BEGGARS_BELIEF_THEATRE_COMPANY_COMPANY_UUID';
	const THE_FIRST_HENRIAD_SUBSEQUENT_VERSION_MATERIAL_UUID = 'THE_FIRST_HENRIAD_2_MATERIAL_UUID';
	const THE_HENRIAD_SUBSEQUENT_VERSION_MATERIAL_UUID = 'THE_HENRIAD_2_MATERIAL_UUID';

	let richardIIOriginalVersionMaterial;
	let richardIISubsequentVersionMaterial;
	let theFirstHenriadSubsequentVersionMaterial;
	let theHenriadSubsequentVersionMaterial;
	let williamShakespearePerson;
	let theKingsMenCompany;

	const sandbox = createSandbox();

	before(async () => {

		const stubUuidCounts = {};

		sandbox.stub(getRandomUuidModule, 'getRandomUuid').callsFake(arg => getStubUuid(arg, stubUuidCounts));

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
				originalVersionMaterial: {
					name: 'The First Henriad',
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
				originalVersionMaterial: {
					name: 'The Henriad',
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

		theFirstHenriadSubsequentVersionMaterial = await chai.request(app)
			.get(`/materials/${THE_FIRST_HENRIAD_SUBSEQUENT_VERSION_MATERIAL_UUID}`);

		theHenriadSubsequentVersionMaterial = await chai.request(app)
			.get(`/materials/${THE_HENRIAD_SUBSEQUENT_VERSION_MATERIAL_UUID}`);

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

		it('includes its sur-material and sur-sur-material with their corresponding original versions', () => {

			const expectedSurMaterial = {
				model: 'MATERIAL',
				uuid: THE_FIRST_HENRIAD_SUBSEQUENT_VERSION_MATERIAL_UUID,
				name: 'The First Henriad',
				format: 'sub-group of plays',
				year: 2009,
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
				],
				originalVersionMaterial: {
					model: 'MATERIAL',
					uuid: THE_FIRST_HENRIAD_ORIGINAL_VERSION_MATERIAL_UUID,
					name: 'The First Henriad',
					format: 'sub-group of plays',
					year: 1599,
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
					],
					surMaterial: {
						model: 'MATERIAL',
						uuid: THE_HENRIAD_ORIGINAL_VERSION_MATERIAL_UUID,
						name: 'The Henriad',
						surMaterial: null
					}
				},
				surMaterial: {
					model: 'MATERIAL',
					uuid: THE_HENRIAD_SUBSEQUENT_VERSION_MATERIAL_UUID,
					name: 'The Henriad',
					format: 'group of plays',
					year: 2009,
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
					],
					originalVersionMaterial: {
						model: 'MATERIAL',
						uuid: THE_HENRIAD_ORIGINAL_VERSION_MATERIAL_UUID,
						name: 'The Henriad',
						format: 'group of plays',
						year: 1599,
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
						],
						surMaterial: null
					},
					characterGroups: []
				},
				characterGroups: []

			};

			const { surMaterial } = richardIISubsequentVersionMaterial.body;

			expect(surMaterial).to.deep.equal(expectedSurMaterial);

		});

	});

	describe('The First Henriad (subsequent version) (material)', () => {

		it('includes its sur-material with its corresponding original version', () => {

			const expectedSurMaterial = {
				model: 'MATERIAL',
				uuid: THE_HENRIAD_SUBSEQUENT_VERSION_MATERIAL_UUID,
				name: 'The Henriad',
				format: 'group of plays',
				year: 2009,
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
				],
				originalVersionMaterial: {
					model: 'MATERIAL',
					uuid: THE_HENRIAD_ORIGINAL_VERSION_MATERIAL_UUID,
					name: 'The Henriad',
					format: 'group of plays',
					year: 1599,
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
					],
					surMaterial: null
				},
				surMaterial: null,
				characterGroups: []

			};

			const { surMaterial } = theFirstHenriadSubsequentVersionMaterial.body;

			expect(surMaterial).to.deep.equal(expectedSurMaterial);

		});

		it('includes its sub-materials with their corresponding original versions', () => {

			const expectedSubMaterials = [
				{
					model: 'MATERIAL',
					uuid: RICHARD_II_SUBSEQUENT_VERSION_MATERIAL_UUID,
					name: 'Richard II',
					format: 'play',
					year: 2009,
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
					],
					originalVersionMaterial: {
						model: 'MATERIAL',
						uuid: RICHARD_II_ORIGINAL_VERSION_MATERIAL_UUID,
						name: 'Richard II',
						format: 'play',
						year: 1595,
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
						],
						surMaterial: {
							model: 'MATERIAL',
							uuid: THE_FIRST_HENRIAD_ORIGINAL_VERSION_MATERIAL_UUID,
							name: 'The First Henriad',
							surMaterial: {
								model: 'MATERIAL',
								uuid: THE_HENRIAD_ORIGINAL_VERSION_MATERIAL_UUID,
								name: 'The Henriad'
							}
						}
					},
					subMaterials: [],
					characterGroups: []

				}
			];

			const { subMaterials } = theFirstHenriadSubsequentVersionMaterial.body;

			expect(subMaterials).to.deep.equal(expectedSubMaterials);

		});

	});

	describe('The Henriad (subsequent version) (material)', () => {

		it('includes its sub-materials and sub-sub-materials with their corresponding original versions', () => {

			const expectedSubMaterials = [
				{
					model: 'MATERIAL',
					uuid: THE_FIRST_HENRIAD_SUBSEQUENT_VERSION_MATERIAL_UUID,
					name: 'The First Henriad',
					format: 'sub-group of plays',
					year: 2009,
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
					],
					originalVersionMaterial: {
						model: 'MATERIAL',
						uuid: THE_FIRST_HENRIAD_ORIGINAL_VERSION_MATERIAL_UUID,
						name: 'The First Henriad',
						format: 'sub-group of plays',
						year: 1599,
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
						],
						surMaterial: {
							model: 'MATERIAL',
							uuid: THE_HENRIAD_ORIGINAL_VERSION_MATERIAL_UUID,
							name: 'The Henriad',
							surMaterial: null
						}
					},
					subMaterials: [
						{
							model: 'MATERIAL',
							uuid: RICHARD_II_SUBSEQUENT_VERSION_MATERIAL_UUID,
							name: 'Richard II',
							format: 'play',
							year: 2009,
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
							],
							originalVersionMaterial: {
								model: 'MATERIAL',
								uuid: RICHARD_II_ORIGINAL_VERSION_MATERIAL_UUID,
								name: 'Richard II',
								format: 'play',
								year: 1595,
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
								],
								surMaterial: {
									model: 'MATERIAL',
									uuid: THE_FIRST_HENRIAD_ORIGINAL_VERSION_MATERIAL_UUID,
									name: 'The First Henriad',
									surMaterial: {
										model: 'MATERIAL',
										uuid: THE_HENRIAD_ORIGINAL_VERSION_MATERIAL_UUID,
										name: 'The Henriad'
									}
								}
							},
							characterGroups: []
						}
					],
					characterGroups: []

				}
			];

			const { subMaterials } = theHenriadSubsequentVersionMaterial.body;

			expect(subMaterials).to.deep.equal(expectedSubMaterials);

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
