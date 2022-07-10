import crypto from 'crypto';

import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { createSandbox } from 'sinon';

import app from '../../src/app';
import purgeDatabase from '../test-helpers/neo4j/purge-database';

describe('Materials with source sub-material', () => {

	chai.use(chaiHttp);

	const BRING_UP_THE_BODIES_NOVEL_MATERIAL_UUID = '4';
	const HILARY_MANTEL_PERSON_UUID = '6';
	const THE_MANTEL_GROUP_COMPANY_UUID = '7';
	const THE_WOLF_HALL_TRILOGY_NOVELS_MATERIAL_UUID = '13';
	const BRING_UP_THE_BODIES_PLAY_MATERIAL_UUID = '24';
	const MIKE_POULTON_PERSON_UUID = '26';
	const ROYAL_SHAKESPEARE_COMPANY_UUID = '27';
	const THOMAS_CROMWELL_CHARACTER_UUID = '29';
	const THE_WOLF_HALL_TRILOGY_PLAYS_MATERIAL_UUID = '36';
	const BRING_UP_THE_BODIES_SWAN_THEATRE_PRODUCTION_UUID = '42';

	let bringUpTheBodiesNovelMaterial;
	let bringUpTheBodiesPlayMaterial;
	let hilaryMantelPerson;
	let mikePoultonPerson;
	let theMantelGroupCompany;
	let royalShakespeareCompany;
	let bringUpTheBodiesSwanTheatreProduction;
	let thomasCromwellCharacter;

	const sandbox = createSandbox();

	before(async () => {

		let uuidCallCount = 0;

		sandbox.stub(crypto, 'randomUUID').callsFake(() => (uuidCallCount++).toString());

		await purgeDatabase();

		// Contrivance for purposes of test.
		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Bring Up the Bodies',
				differentiator: '1',
				format: 'novel',
				year: '2012',
				writingCredits: [
					{
						entities: [
							{
								name: 'Hilary Mantel'
							},
							{
								model: 'COMPANY',
								name: 'The Mantel Group'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'The Wolf Hall Trilogy',
				differentiator: '1',
				format: 'trilogy of novels',
				year: '2020',
				writingCredits: [
					{
						entities: [
							{
								name: 'Hilary Mantel'
							},
							{
								model: 'COMPANY',
								name: 'The Mantel Group'
							}
						]
					}
				],
				subMaterials: [
					{
						name: 'Bring Up the Bodies',
						differentiator: '1'
					}
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Bring Up the Bodies',
				differentiator: '2',
				format: 'play',
				year: '2013',
				writingCredits: [
					{
						entities: [
							{
								name: 'Mike Poulton'
							},
							{
								model: 'COMPANY',
								name: 'Royal Shakespeare Company'
							}
						]
					},
					{
						name: 'adapted from',
						entities: [
							{
								model: 'MATERIAL',
								name: 'Bring Up the Bodies',
								differentiator: '1'
							}
						]
					}
				],
				characterGroups: [
					{
						characters: [
							{
								name: 'Thomas Cromwell'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'The Wolf Hall Trilogy',
				differentiator: '2',
				format: 'trilogy of plays',
				year: '2021',
				writingCredits: [
					{
						entities: [
							{
								name: 'Mike Poulton'
							},
							{
								model: 'COMPANY',
								name: 'Royal Shakespeare Company'
							}
						]
					},
					{
						name: 'adapted from',
						entities: [
							{
								model: 'MATERIAL',
								name: 'The Wolf Hall Trilogy',
								differentiator: '1'
							}
						]
					}
				],
				subMaterials: [
					{
						name: 'Bring Up the Bodies',
						differentiator: '2'
					}
				]
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Bring Up the Bodies',
				startDate: '2013-12-19',
				pressDate: '2014-01-08',
				endDate: '2014-03-29',
				material: {
					name: 'Bring Up the Bodies',
					differentiator: '2'
				},
				venue: {
					name: 'Swan Theatre'
				}
			});

		bringUpTheBodiesNovelMaterial = await chai.request(app)
			.get(`/materials/${BRING_UP_THE_BODIES_NOVEL_MATERIAL_UUID}`);

		bringUpTheBodiesPlayMaterial = await chai.request(app)
			.get(`/materials/${BRING_UP_THE_BODIES_PLAY_MATERIAL_UUID}`);

		hilaryMantelPerson = await chai.request(app)
			.get(`/people/${HILARY_MANTEL_PERSON_UUID}`);

		mikePoultonPerson = await chai.request(app)
			.get(`/people/${MIKE_POULTON_PERSON_UUID}`);

		theMantelGroupCompany = await chai.request(app)
			.get(`/companies/${THE_MANTEL_GROUP_COMPANY_UUID}`);

		royalShakespeareCompany = await chai.request(app)
			.get(`/companies/${ROYAL_SHAKESPEARE_COMPANY_UUID}`);

		bringUpTheBodiesSwanTheatreProduction = await chai.request(app)
			.get(`/productions/${BRING_UP_THE_BODIES_SWAN_THEATRE_PRODUCTION_UUID}`);

		thomasCromwellCharacter = await chai.request(app)
			.get(`/characters/${THOMAS_CROMWELL_CHARACTER_UUID}`);

	});

	after(() => {

		sandbox.restore();

	});

	describe('Bring Up the Bodies (novel) (material)', () => {

		it('includes materials that used it as source material (in which its uuid is nullified), with corresponding sur-material', () => {

			const expectedSourcingMaterials = [
				{
					model: 'MATERIAL',
					uuid: BRING_UP_THE_BODIES_PLAY_MATERIAL_UUID,
					name: 'Bring Up the Bodies',
					format: 'play',
					year: 2013,
					surMaterial: {
						model: 'MATERIAL',
						uuid: THE_WOLF_HALL_TRILOGY_PLAYS_MATERIAL_UUID,
						name: 'The Wolf Hall Trilogy'
					},
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'by',
							entities: [
								{
									model: 'PERSON',
									uuid: MIKE_POULTON_PERSON_UUID,
									name: 'Mike Poulton'
								},
								{
									model: 'COMPANY',
									uuid: ROYAL_SHAKESPEARE_COMPANY_UUID,
									name: 'Royal Shakespeare Company'
								}
							]
						},
						{
							model: 'WRITING_CREDIT',
							name: 'adapted from',
							entities: [
								{
									model: 'MATERIAL',
									uuid: null,
									name: 'Bring Up the Bodies',
									format: 'novel',
									year: 2012,
									surMaterial: {
										model: 'MATERIAL',
										uuid: THE_WOLF_HALL_TRILOGY_NOVELS_MATERIAL_UUID,
										name: 'The Wolf Hall Trilogy'
									},
									writingCredits: [
										{
											model: 'WRITING_CREDIT',
											name: 'by',
											entities: [
												{
													model: 'PERSON',
													uuid: HILARY_MANTEL_PERSON_UUID,
													name: 'Hilary Mantel'
												},
												{
													model: 'COMPANY',
													uuid: THE_MANTEL_GROUP_COMPANY_UUID,
													name: 'The Mantel Group'
												}
											]
										}
									]
								}
							]
						}
					]
				}
			];

			const { sourcingMaterials } = bringUpTheBodiesNovelMaterial.body;

			expect(sourcingMaterials).to.deep.equal(expectedSourcingMaterials);

		});

	});

	describe('Bring Up the Bodies (play) (material)', () => {

		it('includes writers of this material and its source material (with corresponding sur-material) grouped by their respective credits', () => {

			const expectedWritingCredits = [
				{
					model: 'WRITING_CREDIT',
					name: 'by',
					entities: [
						{
							model: 'PERSON',
							uuid: MIKE_POULTON_PERSON_UUID,
							name: 'Mike Poulton'
						},
						{
							model: 'COMPANY',
							uuid: ROYAL_SHAKESPEARE_COMPANY_UUID,
							name: 'Royal Shakespeare Company'
						}
					]
				},
				{
					model: 'WRITING_CREDIT',
					name: 'adapted from',
					entities: [
						{
							model: 'MATERIAL',
							uuid: BRING_UP_THE_BODIES_NOVEL_MATERIAL_UUID,
							name: 'Bring Up the Bodies',
							format: 'novel',
							year: 2012,
							surMaterial: {
								model: 'MATERIAL',
								uuid: THE_WOLF_HALL_TRILOGY_NOVELS_MATERIAL_UUID,
								name: 'The Wolf Hall Trilogy'
							},
							writingCredits: [
								{
									model: 'WRITING_CREDIT',
									name: 'by',
									entities: [
										{
											model: 'PERSON',
											uuid: HILARY_MANTEL_PERSON_UUID,
											name: 'Hilary Mantel'
										},
										{
											model: 'COMPANY',
											uuid: THE_MANTEL_GROUP_COMPANY_UUID,
											name: 'The Mantel Group'
										}
									]
								}
							]
						}
					]
				}
			];

			const { writingCredits } = bringUpTheBodiesPlayMaterial.body;

			expect(writingCredits).to.deep.equal(expectedWritingCredits);

		});

	});

	describe('Hilary Mantel (person)', () => {

		it('includes materials that used their work as source material, with corresponding sur-material', () => {

			const expectedSourcingMaterials = [
				{
					model: 'MATERIAL',
					uuid: BRING_UP_THE_BODIES_PLAY_MATERIAL_UUID,
					name: 'Bring Up the Bodies',
					format: 'play',
					year: 2013,
					surMaterial: {
						model: 'MATERIAL',
						uuid: THE_WOLF_HALL_TRILOGY_PLAYS_MATERIAL_UUID,
						name: 'The Wolf Hall Trilogy'
					},
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'by',
							entities: [
								{
									model: 'PERSON',
									uuid: MIKE_POULTON_PERSON_UUID,
									name: 'Mike Poulton'
								},
								{
									model: 'COMPANY',
									uuid: ROYAL_SHAKESPEARE_COMPANY_UUID,
									name: 'Royal Shakespeare Company'
								}
							]
						},
						{
							model: 'WRITING_CREDIT',
							name: 'adapted from',
							entities: [
								{
									model: 'MATERIAL',
									uuid: BRING_UP_THE_BODIES_NOVEL_MATERIAL_UUID,
									name: 'Bring Up the Bodies',
									format: 'novel',
									year: 2012,
									surMaterial: {
										model: 'MATERIAL',
										uuid: THE_WOLF_HALL_TRILOGY_NOVELS_MATERIAL_UUID,
										name: 'The Wolf Hall Trilogy'
									},
									writingCredits: [
										{
											model: 'WRITING_CREDIT',
											name: 'by',
											entities: [
												{
													model: 'PERSON',
													uuid: null,
													name: 'Hilary Mantel'
												},
												{
													model: 'COMPANY',
													uuid: THE_MANTEL_GROUP_COMPANY_UUID,
													name: 'The Mantel Group'
												}
											]
										}
									]
								}
							]
						}
					]
				}
			];

			const { sourcingMaterials } = hilaryMantelPerson.body;

			expect(sourcingMaterials).to.deep.equal(expectedSourcingMaterials);

		});

	});

	describe('Mike Poulton (person)', () => {

		it('includes materials they have written (in which their uuid is nullified), with corresponding sur-materials', () => {

			const expectedMaterials = [
				{
					model: 'MATERIAL',
					uuid: BRING_UP_THE_BODIES_PLAY_MATERIAL_UUID,
					name: 'Bring Up the Bodies',
					format: 'play',
					year: 2013,
					surMaterial: {
						model: 'MATERIAL',
						uuid: THE_WOLF_HALL_TRILOGY_PLAYS_MATERIAL_UUID,
						name: 'The Wolf Hall Trilogy'
					},
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'by',
							entities: [
								{
									model: 'PERSON',
									uuid: null,
									name: 'Mike Poulton'
								},
								{
									model: 'COMPANY',
									uuid: ROYAL_SHAKESPEARE_COMPANY_UUID,
									name: 'Royal Shakespeare Company'
								}
							]
						},
						{
							model: 'WRITING_CREDIT',
							name: 'adapted from',
							entities: [
								{
									model: 'MATERIAL',
									uuid: BRING_UP_THE_BODIES_NOVEL_MATERIAL_UUID,
									name: 'Bring Up the Bodies',
									format: 'novel',
									year: 2012,
									surMaterial: {
										model: 'MATERIAL',
										uuid: THE_WOLF_HALL_TRILOGY_NOVELS_MATERIAL_UUID,
										name: 'The Wolf Hall Trilogy'
									},
									writingCredits: [
										{
											model: 'WRITING_CREDIT',
											name: 'by',
											entities: [
												{
													model: 'PERSON',
													uuid: HILARY_MANTEL_PERSON_UUID,
													name: 'Hilary Mantel'
												},
												{
													model: 'COMPANY',
													uuid: THE_MANTEL_GROUP_COMPANY_UUID,
													name: 'The Mantel Group'
												}
											]
										}
									]
								}
							]
						}
					]
				}
			];

			const { materials } = mikePoultonPerson.body;

			expect(materials).to.deep.equal(expectedMaterials);

		});

	});

	describe('The Mantel Group (company)', () => {

		it('includes materials that used their work as source material, with corresponding sur-material', () => {

			const expectedSourcingMaterials = [
				{
					model: 'MATERIAL',
					uuid: BRING_UP_THE_BODIES_PLAY_MATERIAL_UUID,
					name: 'Bring Up the Bodies',
					format: 'play',
					year: 2013,
					surMaterial: {
						model: 'MATERIAL',
						uuid: THE_WOLF_HALL_TRILOGY_PLAYS_MATERIAL_UUID,
						name: 'The Wolf Hall Trilogy'
					},
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'by',
							entities: [
								{
									model: 'PERSON',
									uuid: MIKE_POULTON_PERSON_UUID,
									name: 'Mike Poulton'
								},
								{
									model: 'COMPANY',
									uuid: ROYAL_SHAKESPEARE_COMPANY_UUID,
									name: 'Royal Shakespeare Company'
								}
							]
						},
						{
							model: 'WRITING_CREDIT',
							name: 'adapted from',
							entities: [
								{
									model: 'MATERIAL',
									uuid: BRING_UP_THE_BODIES_NOVEL_MATERIAL_UUID,
									name: 'Bring Up the Bodies',
									format: 'novel',
									year: 2012,
									surMaterial: {
										model: 'MATERIAL',
										uuid: THE_WOLF_HALL_TRILOGY_NOVELS_MATERIAL_UUID,
										name: 'The Wolf Hall Trilogy'
									},
									writingCredits: [
										{
											model: 'WRITING_CREDIT',
											name: 'by',
											entities: [
												{
													model: 'PERSON',
													uuid: HILARY_MANTEL_PERSON_UUID,
													name: 'Hilary Mantel'
												},
												{
													model: 'COMPANY',
													uuid: null,
													name: 'The Mantel Group'
												}
											]
										}
									]
								}
							]
						}
					]
				}
			];

			const { sourcingMaterials } = theMantelGroupCompany.body;

			expect(sourcingMaterials).to.deep.equal(expectedSourcingMaterials);

		});

	});

	describe('Royal Shakespeare Company (company)', () => {

		it('includes materials they have written (in which their uuid is nullified), with corresponding sur-material', () => {

			const expectedMaterials = [
				{
					model: 'MATERIAL',
					uuid: BRING_UP_THE_BODIES_PLAY_MATERIAL_UUID,
					name: 'Bring Up the Bodies',
					format: 'play',
					year: 2013,
					surMaterial: {
						model: 'MATERIAL',
						uuid: THE_WOLF_HALL_TRILOGY_PLAYS_MATERIAL_UUID,
						name: 'The Wolf Hall Trilogy'
					},
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'by',
							entities: [
								{
									model: 'PERSON',
									uuid: MIKE_POULTON_PERSON_UUID,
									name: 'Mike Poulton'
								},
								{
									model: 'COMPANY',
									uuid: null,
									name: 'Royal Shakespeare Company'
								}
							]
						},
						{
							model: 'WRITING_CREDIT',
							name: 'adapted from',
							entities: [
								{
									model: 'MATERIAL',
									uuid: BRING_UP_THE_BODIES_NOVEL_MATERIAL_UUID,
									name: 'Bring Up the Bodies',
									format: 'novel',
									year: 2012,
									surMaterial: {
										model: 'MATERIAL',
										uuid: THE_WOLF_HALL_TRILOGY_NOVELS_MATERIAL_UUID,
										name: 'The Wolf Hall Trilogy'
									},
									writingCredits: [
										{
											model: 'WRITING_CREDIT',
											name: 'by',
											entities: [
												{
													model: 'PERSON',
													uuid: HILARY_MANTEL_PERSON_UUID,
													name: 'Hilary Mantel'
												},
												{
													model: 'COMPANY',
													uuid: THE_MANTEL_GROUP_COMPANY_UUID,
													name: 'The Mantel Group'
												}
											]
										}
									]
								}
							]
						}
					]
				}
			];

			const { materials } = royalShakespeareCompany.body;

			expect(materials).to.deep.equal(expectedMaterials);

		});

	});

	describe('Bring Up the Bodies at Swan Theatre (production)', () => {

		it('includes in its material data the writers of the material and its source material (with corresponding sur-material)', () => {

			const expectedMaterial = {
				model: 'MATERIAL',
				uuid: BRING_UP_THE_BODIES_PLAY_MATERIAL_UUID,
				name: 'Bring Up the Bodies',
				format: 'play',
				year: 2013,
				surMaterial: {
					model: 'MATERIAL',
					uuid: THE_WOLF_HALL_TRILOGY_PLAYS_MATERIAL_UUID,
					name: 'The Wolf Hall Trilogy'
				},
				writingCredits: [
					{
						model: 'WRITING_CREDIT',
						name: 'by',
						entities: [
							{
								model: 'PERSON',
								uuid: MIKE_POULTON_PERSON_UUID,
								name: 'Mike Poulton'
							},
							{
								model: 'COMPANY',
								uuid: ROYAL_SHAKESPEARE_COMPANY_UUID,
								name: 'Royal Shakespeare Company'
							}
						]
					},
					{
						model: 'WRITING_CREDIT',
						name: 'adapted from',
						entities: [
							{
								model: 'MATERIAL',
								uuid: BRING_UP_THE_BODIES_NOVEL_MATERIAL_UUID,
								name: 'Bring Up the Bodies',
								format: 'novel',
								year: 2012,
								surMaterial: {
									model: 'MATERIAL',
									uuid: THE_WOLF_HALL_TRILOGY_NOVELS_MATERIAL_UUID,
									name: 'The Wolf Hall Trilogy'
								},
								writingCredits: [
									{
										model: 'WRITING_CREDIT',
										name: 'by',
										entities: [
											{
												model: 'PERSON',
												uuid: HILARY_MANTEL_PERSON_UUID,
												name: 'Hilary Mantel'
											},
											{
												model: 'COMPANY',
												uuid: THE_MANTEL_GROUP_COMPANY_UUID,
												name: 'The Mantel Group'
											}
										]
									}
								]
							}
						]
					}
				]
			};

			const { material } = bringUpTheBodiesSwanTheatreProduction.body;

			expect(material).to.deep.equal(expectedMaterial);

		});

	});

	describe('Thomas Cromwell (character)', () => {

		it('includes in its material data the writers of the material and its source material (with corresponding sur-material)', () => {

			const expectedMaterials = [
				{
					model: 'MATERIAL',
					uuid: BRING_UP_THE_BODIES_PLAY_MATERIAL_UUID,
					name: 'Bring Up the Bodies',
					format: 'play',
					year: 2013,
					surMaterial: {
						model: 'MATERIAL',
						uuid: THE_WOLF_HALL_TRILOGY_PLAYS_MATERIAL_UUID,
						name: 'The Wolf Hall Trilogy'
					},
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'by',
							entities: [
								{
									model: 'PERSON',
									uuid: MIKE_POULTON_PERSON_UUID,
									name: 'Mike Poulton'
								},
								{
									model: 'COMPANY',
									uuid: ROYAL_SHAKESPEARE_COMPANY_UUID,
									name: 'Royal Shakespeare Company'
								}
							]
						},
						{
							model: 'WRITING_CREDIT',
							name: 'adapted from',
							entities: [
								{
									model: 'MATERIAL',
									uuid: BRING_UP_THE_BODIES_NOVEL_MATERIAL_UUID,
									name: 'Bring Up the Bodies',
									format: 'novel',
									year: 2012,
									surMaterial: {
										model: 'MATERIAL',
										uuid: THE_WOLF_HALL_TRILOGY_NOVELS_MATERIAL_UUID,
										name: 'The Wolf Hall Trilogy'
									},
									writingCredits: [
										{
											model: 'WRITING_CREDIT',
											name: 'by',
											entities: [
												{
													model: 'PERSON',
													uuid: HILARY_MANTEL_PERSON_UUID,
													name: 'Hilary Mantel'
												},
												{
													model: 'COMPANY',
													uuid: THE_MANTEL_GROUP_COMPANY_UUID,
													name: 'The Mantel Group'
												}
											]
										}
									]
								}
							]
						}
					],
					depictions: []
				}
			];

			const { materials } = thomasCromwellCharacter.body;

			expect(materials).to.deep.equal(expectedMaterials);

		});

	});

	describe('materials list', () => {

		it('includes writers of the materials and their corresponding source material (with corresponding sur-material)', async () => {

			const response = await chai.request(app)
				.get('/materials');

			const expectedResponseBody = [
				{
					model: 'MATERIAL',
					uuid: BRING_UP_THE_BODIES_PLAY_MATERIAL_UUID,
					name: 'Bring Up the Bodies',
					format: 'play',
					year: 2013,
					surMaterial: {
						model: 'MATERIAL',
						uuid: THE_WOLF_HALL_TRILOGY_PLAYS_MATERIAL_UUID,
						name: 'The Wolf Hall Trilogy'
					},
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'by',
							entities: [
								{
									model: 'PERSON',
									uuid: MIKE_POULTON_PERSON_UUID,
									name: 'Mike Poulton'
								},
								{
									model: 'COMPANY',
									uuid: ROYAL_SHAKESPEARE_COMPANY_UUID,
									name: 'Royal Shakespeare Company'
								}
							]
						},
						{
							model: 'WRITING_CREDIT',
							name: 'adapted from',
							entities: [
								{
									model: 'MATERIAL',
									uuid: BRING_UP_THE_BODIES_NOVEL_MATERIAL_UUID,
									name: 'Bring Up the Bodies',
									format: 'novel',
									year: 2012,
									surMaterial: {
										model: 'MATERIAL',
										uuid: THE_WOLF_HALL_TRILOGY_NOVELS_MATERIAL_UUID,
										name: 'The Wolf Hall Trilogy'
									},
									writingCredits: [
										{
											model: 'WRITING_CREDIT',
											name: 'by',
											entities: [
												{
													model: 'PERSON',
													uuid: HILARY_MANTEL_PERSON_UUID,
													name: 'Hilary Mantel'
												},
												{
													model: 'COMPANY',
													uuid: THE_MANTEL_GROUP_COMPANY_UUID,
													name: 'The Mantel Group'
												}
											]
										}
									]
								}
							]
						}
					]
				},
				{
					model: 'MATERIAL',
					uuid: BRING_UP_THE_BODIES_NOVEL_MATERIAL_UUID,
					name: 'Bring Up the Bodies',
					format: 'novel',
					year: 2012,
					surMaterial: {
						model: 'MATERIAL',
						uuid: THE_WOLF_HALL_TRILOGY_NOVELS_MATERIAL_UUID,
						name: 'The Wolf Hall Trilogy'
					},
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'by',
							entities: [
								{
									model: 'PERSON',
									uuid: HILARY_MANTEL_PERSON_UUID,
									name: 'Hilary Mantel'
								},
								{
									model: 'COMPANY',
									uuid: THE_MANTEL_GROUP_COMPANY_UUID,
									name: 'The Mantel Group'
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
