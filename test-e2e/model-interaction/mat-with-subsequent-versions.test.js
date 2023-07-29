import crypto from 'crypto';

import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { createSandbox } from 'sinon';

import app from '../../src/app';
import { purgeDatabase } from '../test-helpers/neo4j';

describe('Material with subsequent versions', () => {

	chai.use(chaiHttp);

	const PEER_GYNT_ORIGINAL_VERSION_MATERIAL_UUID = '5';
	const HENRIK_IBSEN_PERSON_UUID = '7';
	const IBSEN_THEATRE_COMPANY_UUID = '8';
	const PEER_GYNT_CHARACTER_UUID = '9';
	const PEER_GYNT_SUBSEQUENT_VERSION_1_MATERIAL_UUID = '16';
	const FRANK_MCGUINNESS_PERSON_UUID = '20';
	const PEER_GYNT_SUBSEQUENT_VERSION_2_MATERIAL_UUID = '31';
	const GERRY_BAMMAN_PERSON_UUID = '35';
	const BAMMAN_THEATRE_COMPANY_UUID = '36';
	const IRENE_B_BERMAN_PERSON_UUID = '37';
	const BALTASAR_KORMÁKUR_PERSON_UUID = '38';
	const GHOSTS_ORIGINAL_VERSION_MATERIAL_UUID = '44';
	const GHOSTS_SUBSEQUENT_VERSION_MATERIAL_UUID = '56';
	const PEER_GYNT_BARBICAN_PRODUCTION_UUID = '64';

	let peerGyntOriginalVersionMaterial;
	let peerGyntSubsequentVersion2Material;
	let henrikIbsenPerson;
	let gerryBammanPerson;
	let ibsenTheatreCompany;
	let bammanTheatreCompany;
	let peerGyntCharacter;
	let peerGyntBarbicanProduction;

	const sandbox = createSandbox();

	before(async () => {

		let uuidCallCount = 0;

		sandbox.stub(crypto, 'randomUUID').callsFake(() => (uuidCallCount++).toString());

		await purgeDatabase();

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Peer Gynt',
				differentiator: '1',
				format: 'play',
				year: '1867',
				writingCredits: [
					{
						entities: [
							{
								name: 'Henrik Ibsen'
							},
							{
								model: 'COMPANY',
								name: 'Ibsen Theatre Company'
							}
						]
					}
				],
				characterGroups: [
					{
						characters: [
							{
								name: 'Peer Gynt'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Peer Gynt',
				differentiator: '2',
				format: 'play',
				year: '2000',
				originalVersionMaterial: {
					name: 'Peer Gynt',
					differentiator: '1'
				},
				writingCredits: [
					{
						entities: [
							{
								name: 'Henrik Ibsen'
							},
							{
								model: 'COMPANY',
								name: 'Ibsen Theatre Company'
							}
						]
					},
					{
						name: 'version by',
						entities: [
							{
								name: 'Frank McGuinness'
							}
						]
					}
				],
				characterGroups: [
					{
						characters: [
							{
								name: 'Peer Gynt'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Peer Gynt',
				differentiator: '3',
				format: 'play',
				year: '2007',
				originalVersionMaterial: {
					name: 'Peer Gynt',
					differentiator: '1'
				},
				writingCredits: [
					{
						entities: [
							{
								name: 'Henrik Ibsen'
							},
							{
								model: 'COMPANY',
								name: 'Ibsen Theatre Company'
							}
						]
					},
					{
						name: 'translated by',
						entities: [
							{
								name: 'Gerry Bamman'
							},
							{
								model: 'COMPANY',
								name: 'Bamman Theatre Company'
							},
							{
								name: 'Irene B Berman'
							}
						]
					},
					{
						name: 'adapted by',
						entities: [
							{
								name: 'Baltasar Kormákur'
							}
						]
					}
				],
				characterGroups: [
					{
						characters: [
							{
								name: 'Peer Gynt'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Ghosts',
				differentiator: '1',
				format: 'play',
				year: '1881',
				writingCredits: [
					{
						entities: [
							{
								name: 'Henrik Ibsen'
							},
							{
								model: 'COMPANY',
								name: 'Ibsen Theatre Company'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Ghosts',
				differentiator: '2',
				format: 'play',
				year: '2008',
				originalVersionMaterial: {
					name: 'Ghosts',
					differentiator: '1'
				},
				writingCredits: [
					{
						entities: [
							{
								name: 'Henrik Ibsen'
							},
							{
								model: 'COMPANY',
								name: 'Ibsen Theatre Company'
							}
						]
					},
					{
						name: 'translated by',
						entities: [
							{
								name: 'Gerry Bamman'
							},
							{
								model: 'COMPANY',
								name: 'Bamman Theatre Company'
							},
							{
								name: 'Irene B Berman'
							}
						]
					},
					{
						name: 'adapted by',
						entities: [
							{
								name: 'Baltasar Kormákur'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Peer Gynt',
				material: {
					name: 'Peer Gynt',
					differentiator: '3'
				},
				venue: {
					name: 'Barbican'
				}
			});

		peerGyntOriginalVersionMaterial = await chai.request(app)
			.get(`/materials/${PEER_GYNT_ORIGINAL_VERSION_MATERIAL_UUID}`);

		peerGyntSubsequentVersion2Material = await chai.request(app)
			.get(`/materials/${PEER_GYNT_SUBSEQUENT_VERSION_2_MATERIAL_UUID}`);

		henrikIbsenPerson = await chai.request(app)
			.get(`/people/${HENRIK_IBSEN_PERSON_UUID}`);

		gerryBammanPerson = await chai.request(app)
			.get(`/people/${GERRY_BAMMAN_PERSON_UUID}`);

		ibsenTheatreCompany = await chai.request(app)
			.get(`/companies/${IBSEN_THEATRE_COMPANY_UUID}`);

		bammanTheatreCompany = await chai.request(app)
			.get(`/companies/${BAMMAN_THEATRE_COMPANY_UUID}`);

		peerGyntCharacter = await chai.request(app)
			.get(`/characters/${PEER_GYNT_CHARACTER_UUID}`);

		peerGyntBarbicanProduction = await chai.request(app)
			.get(`/productions/${PEER_GYNT_BARBICAN_PRODUCTION_UUID}`);

	});

	after(() => {

		sandbox.restore();

	});

	describe('Peer Gynt (original version) (material)', () => {

		it('includes subsequent versions of this material, with corresponding writers (version writers only, i.e. excludes original version writers)', () => {

			const expectedSubsequentVersionMaterials = [
				{
					model: 'MATERIAL',
					uuid: PEER_GYNT_SUBSEQUENT_VERSION_2_MATERIAL_UUID,
					name: 'Peer Gynt',
					format: 'play',
					year: 2007,
					surMaterial: null,
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'translated by',
							entities: [
								{
									model: 'PERSON',
									uuid: GERRY_BAMMAN_PERSON_UUID,
									name: 'Gerry Bamman'
								},
								{
									model: 'COMPANY',
									uuid: BAMMAN_THEATRE_COMPANY_UUID,
									name: 'Bamman Theatre Company'
								},
								{
									model: 'PERSON',
									uuid: IRENE_B_BERMAN_PERSON_UUID,
									name: 'Irene B Berman'
								}
							]
						},
						{
							model: 'WRITING_CREDIT',
							name: 'adapted by',
							entities: [
								{
									model: 'PERSON',
									uuid: BALTASAR_KORMÁKUR_PERSON_UUID,
									name: 'Baltasar Kormákur'
								}
							]
						}
					]
				},
				{
					model: 'MATERIAL',
					uuid: PEER_GYNT_SUBSEQUENT_VERSION_1_MATERIAL_UUID,
					name: 'Peer Gynt',
					format: 'play',
					year: 2000,
					surMaterial: null,
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'version by',
							entities: [
								{
									model: 'PERSON',
									uuid: FRANK_MCGUINNESS_PERSON_UUID,
									name: 'Frank McGuinness'
								}
							]
						}
					]
				}
			];

			const { subsequentVersionMaterials } = peerGyntOriginalVersionMaterial.body;

			expect(subsequentVersionMaterials).to.deep.equal(expectedSubsequentVersionMaterials);

		});

		it('includes writers of this material grouped by their respective credits', () => {

			const expectedWritingCredits = [
				{
					model: 'WRITING_CREDIT',
					name: 'by',
					entities: [
						{
							model: 'PERSON',
							uuid: HENRIK_IBSEN_PERSON_UUID,
							name: 'Henrik Ibsen'
						},
						{
							model: 'COMPANY',
							uuid: IBSEN_THEATRE_COMPANY_UUID,
							name: 'Ibsen Theatre Company'
						}
					]
				}
			];

			const { writingCredits } = peerGyntOriginalVersionMaterial.body;

			expect(writingCredits).to.deep.equal(expectedWritingCredits);

		});

	});

	describe('Peer Gynt (subsequent version) (material)', () => {

		it('includes original version of this material, with corresponding writers', () => {

			const expectedOriginalVersionMaterial = {
				model: 'MATERIAL',
				uuid: PEER_GYNT_ORIGINAL_VERSION_MATERIAL_UUID,
				name: 'Peer Gynt',
				format: 'play',
				year: 1867,
				surMaterial: null,
				writingCredits: [
					{
						model: 'WRITING_CREDIT',
						name: 'by',
						entities: [
							{
								model: 'PERSON',
								uuid: HENRIK_IBSEN_PERSON_UUID,
								name: 'Henrik Ibsen'
							},
							{
								model: 'COMPANY',
								uuid: IBSEN_THEATRE_COMPANY_UUID,
								name: 'Ibsen Theatre Company'
							}
						]
					}
				]
			};

			const { originalVersionMaterial } = peerGyntSubsequentVersion2Material.body;

			expect(originalVersionMaterial).to.deep.equal(expectedOriginalVersionMaterial);

		});

		it('includes writers of this material grouped by their respective credits', () => {

			const expectedWritingCredits = [
				{
					model: 'WRITING_CREDIT',
					name: 'by',
					entities: [
						{
							model: 'PERSON',
							uuid: HENRIK_IBSEN_PERSON_UUID,
							name: 'Henrik Ibsen'
						},
						{
							model: 'COMPANY',
							uuid: IBSEN_THEATRE_COMPANY_UUID,
							name: 'Ibsen Theatre Company'
						}
					]
				},
				{
					model: 'WRITING_CREDIT',
					name: 'translated by',
					entities: [
						{
							model: 'PERSON',
							uuid: GERRY_BAMMAN_PERSON_UUID,
							name: 'Gerry Bamman'
						},
						{
							model: 'COMPANY',
							uuid: BAMMAN_THEATRE_COMPANY_UUID,
							name: 'Bamman Theatre Company'
						},
						{
							model: 'PERSON',
							uuid: IRENE_B_BERMAN_PERSON_UUID,
							name: 'Irene B Berman'
						}
					]
				},
				{
					model: 'WRITING_CREDIT',
					name: 'adapted by',
					entities: [
						{
							model: 'PERSON',
							uuid: BALTASAR_KORMÁKUR_PERSON_UUID,
							name: 'Baltasar Kormákur'
						}
					]
				}
			];

			const { writingCredits } = peerGyntSubsequentVersion2Material.body;

			expect(writingCredits).to.deep.equal(expectedWritingCredits);

		});

	});

	describe('Henrik Ibsen (person)', () => {

		it('includes materials they have written', () => {

			const expectedMaterials = [
				{
					model: 'MATERIAL',
					uuid: GHOSTS_ORIGINAL_VERSION_MATERIAL_UUID,
					name: 'Ghosts',
					format: 'play',
					year: 1881,
					surMaterial: null,
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'by',
							entities: [
								{
									model: 'PERSON',
									uuid: HENRIK_IBSEN_PERSON_UUID,
									name: 'Henrik Ibsen'
								},
								{
									model: 'COMPANY',
									uuid: IBSEN_THEATRE_COMPANY_UUID,
									name: 'Ibsen Theatre Company'
								}
							]
						}
					]
				},
				{
					model: 'MATERIAL',
					uuid: PEER_GYNT_ORIGINAL_VERSION_MATERIAL_UUID,
					name: 'Peer Gynt',
					format: 'play',
					year: 1867,
					surMaterial: null,
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'by',
							entities: [
								{
									model: 'PERSON',
									uuid: HENRIK_IBSEN_PERSON_UUID,
									name: 'Henrik Ibsen'
								},
								{
									model: 'COMPANY',
									uuid: IBSEN_THEATRE_COMPANY_UUID,
									name: 'Ibsen Theatre Company'
								}
							]
						}
					]
				}
			];

			const { materials } = henrikIbsenPerson.body;

			expect(materials).to.deep.equal(expectedMaterials);

		});

		it('includes subsequent versions of materials they originally wrote, with corresponding writers', () => {

			const expectedSubsequentVersionMaterials = [
				{
					model: 'MATERIAL',
					uuid: GHOSTS_SUBSEQUENT_VERSION_MATERIAL_UUID,
					name: 'Ghosts',
					format: 'play',
					year: 2008,
					surMaterial: null,
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'by',
							entities: [
								{
									model: 'PERSON',
									uuid: HENRIK_IBSEN_PERSON_UUID,
									name: 'Henrik Ibsen'
								},
								{
									model: 'COMPANY',
									uuid: IBSEN_THEATRE_COMPANY_UUID,
									name: 'Ibsen Theatre Company'
								}
							]
						},
						{
							model: 'WRITING_CREDIT',
							name: 'translated by',
							entities: [
								{
									model: 'PERSON',
									uuid: GERRY_BAMMAN_PERSON_UUID,
									name: 'Gerry Bamman'
								},
								{
									model: 'COMPANY',
									uuid: BAMMAN_THEATRE_COMPANY_UUID,
									name: 'Bamman Theatre Company'
								},
								{
									model: 'PERSON',
									uuid: IRENE_B_BERMAN_PERSON_UUID,
									name: 'Irene B Berman'
								}
							]
						},
						{
							model: 'WRITING_CREDIT',
							name: 'adapted by',
							entities: [
								{
									model: 'PERSON',
									uuid: BALTASAR_KORMÁKUR_PERSON_UUID,
									name: 'Baltasar Kormákur'
								}
							]
						}
					]
				},
				{
					model: 'MATERIAL',
					uuid: PEER_GYNT_SUBSEQUENT_VERSION_2_MATERIAL_UUID,
					name: 'Peer Gynt',
					format: 'play',
					year: 2007,
					surMaterial: null,
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'by',
							entities: [
								{
									model: 'PERSON',
									uuid: HENRIK_IBSEN_PERSON_UUID,
									name: 'Henrik Ibsen'
								},
								{
									model: 'COMPANY',
									uuid: IBSEN_THEATRE_COMPANY_UUID,
									name: 'Ibsen Theatre Company'
								}
							]
						},
						{
							model: 'WRITING_CREDIT',
							name: 'translated by',
							entities: [
								{
									model: 'PERSON',
									uuid: GERRY_BAMMAN_PERSON_UUID,
									name: 'Gerry Bamman'
								},
								{
									model: 'COMPANY',
									uuid: BAMMAN_THEATRE_COMPANY_UUID,
									name: 'Bamman Theatre Company'
								},
								{
									model: 'PERSON',
									uuid: IRENE_B_BERMAN_PERSON_UUID,
									name: 'Irene B Berman'
								}
							]
						},
						{
							model: 'WRITING_CREDIT',
							name: 'adapted by',
							entities: [
								{
									model: 'PERSON',
									uuid: BALTASAR_KORMÁKUR_PERSON_UUID,
									name: 'Baltasar Kormákur'
								}
							]
						}
					]
				},
				{
					model: 'MATERIAL',
					uuid: PEER_GYNT_SUBSEQUENT_VERSION_1_MATERIAL_UUID,
					name: 'Peer Gynt',
					format: 'play',
					year: 2000,
					surMaterial: null,
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'by',
							entities: [
								{
									model: 'PERSON',
									uuid: HENRIK_IBSEN_PERSON_UUID,
									name: 'Henrik Ibsen'
								},
								{
									model: 'COMPANY',
									uuid: IBSEN_THEATRE_COMPANY_UUID,
									name: 'Ibsen Theatre Company'
								}
							]
						},
						{
							model: 'WRITING_CREDIT',
							name: 'version by',
							entities: [
								{
									model: 'PERSON',
									uuid: FRANK_MCGUINNESS_PERSON_UUID,
									name: 'Frank McGuinness'
								}
							]
						}
					]
				}
			];

			const { subsequentVersionMaterials } = henrikIbsenPerson.body;

			expect(subsequentVersionMaterials).to.deep.equal(expectedSubsequentVersionMaterials);

		});

	});

	describe('Gerry Bamman (person)', () => {

		it('includes materials they have written, with corresponding writers', () => {

			const expectedMaterials = [
				{
					model: 'MATERIAL',
					uuid: GHOSTS_SUBSEQUENT_VERSION_MATERIAL_UUID,
					name: 'Ghosts',
					format: 'play',
					year: 2008,
					surMaterial: null,
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'by',
							entities: [
								{
									model: 'PERSON',
									uuid: HENRIK_IBSEN_PERSON_UUID,
									name: 'Henrik Ibsen'
								},
								{
									model: 'COMPANY',
									uuid: IBSEN_THEATRE_COMPANY_UUID,
									name: 'Ibsen Theatre Company'
								}
							]
						},
						{
							model: 'WRITING_CREDIT',
							name: 'translated by',
							entities: [
								{
									model: 'PERSON',
									uuid: GERRY_BAMMAN_PERSON_UUID,
									name: 'Gerry Bamman'
								},
								{
									model: 'COMPANY',
									uuid: BAMMAN_THEATRE_COMPANY_UUID,
									name: 'Bamman Theatre Company'
								},
								{
									model: 'PERSON',
									uuid: IRENE_B_BERMAN_PERSON_UUID,
									name: 'Irene B Berman'
								}
							]
						},
						{
							model: 'WRITING_CREDIT',
							name: 'adapted by',
							entities: [
								{
									model: 'PERSON',
									uuid: BALTASAR_KORMÁKUR_PERSON_UUID,
									name: 'Baltasar Kormákur'
								}
							]
						}
					]
				},
				{
					model: 'MATERIAL',
					uuid: PEER_GYNT_SUBSEQUENT_VERSION_2_MATERIAL_UUID,
					name: 'Peer Gynt',
					format: 'play',
					year: 2007,
					surMaterial: null,
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'by',
							entities: [
								{
									model: 'PERSON',
									uuid: HENRIK_IBSEN_PERSON_UUID,
									name: 'Henrik Ibsen'
								},
								{
									model: 'COMPANY',
									uuid: IBSEN_THEATRE_COMPANY_UUID,
									name: 'Ibsen Theatre Company'
								}
							]
						},
						{
							model: 'WRITING_CREDIT',
							name: 'translated by',
							entities: [
								{
									model: 'PERSON',
									uuid: GERRY_BAMMAN_PERSON_UUID,
									name: 'Gerry Bamman'
								},
								{
									model: 'COMPANY',
									uuid: BAMMAN_THEATRE_COMPANY_UUID,
									name: 'Bamman Theatre Company'
								},
								{
									model: 'PERSON',
									uuid: IRENE_B_BERMAN_PERSON_UUID,
									name: 'Irene B Berman'
								}
							]
						},
						{
							model: 'WRITING_CREDIT',
							name: 'adapted by',
							entities: [
								{
									model: 'PERSON',
									uuid: BALTASAR_KORMÁKUR_PERSON_UUID,
									name: 'Baltasar Kormákur'
								}
							]
						}
					]
				}
			];

			const { materials } = gerryBammanPerson.body;

			expect(materials).to.deep.equal(expectedMaterials);

		});

	});

	describe('Ibsen Theatre Company (company)', () => {

		it('includes materials it has written', () => {

			const expectedMaterials = [
				{
					model: 'MATERIAL',
					uuid: GHOSTS_ORIGINAL_VERSION_MATERIAL_UUID,
					name: 'Ghosts',
					format: 'play',
					year: 1881,
					surMaterial: null,
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'by',
							entities: [
								{
									model: 'PERSON',
									uuid: HENRIK_IBSEN_PERSON_UUID,
									name: 'Henrik Ibsen'
								},
								{
									model: 'COMPANY',
									uuid: IBSEN_THEATRE_COMPANY_UUID,
									name: 'Ibsen Theatre Company'
								}
							]
						}
					]
				},
				{
					model: 'MATERIAL',
					uuid: PEER_GYNT_ORIGINAL_VERSION_MATERIAL_UUID,
					name: 'Peer Gynt',
					format: 'play',
					year: 1867,
					surMaterial: null,
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'by',
							entities: [
								{
									model: 'PERSON',
									uuid: HENRIK_IBSEN_PERSON_UUID,
									name: 'Henrik Ibsen'
								},
								{
									model: 'COMPANY',
									uuid: IBSEN_THEATRE_COMPANY_UUID,
									name: 'Ibsen Theatre Company'
								}
							]
						}
					]
				}
			];

			const { materials } = ibsenTheatreCompany.body;

			expect(materials).to.deep.equal(expectedMaterials);

		});

		it('includes subsequent versions of materials it originally wrote, with corresponding writers', () => {

			const expectedSubsequentVersionMaterials = [
				{
					model: 'MATERIAL',
					uuid: GHOSTS_SUBSEQUENT_VERSION_MATERIAL_UUID,
					name: 'Ghosts',
					format: 'play',
					year: 2008,
					surMaterial: null,
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'by',
							entities: [
								{
									model: 'PERSON',
									uuid: HENRIK_IBSEN_PERSON_UUID,
									name: 'Henrik Ibsen'
								},
								{
									model: 'COMPANY',
									uuid: IBSEN_THEATRE_COMPANY_UUID,
									name: 'Ibsen Theatre Company'
								}
							]
						},
						{
							model: 'WRITING_CREDIT',
							name: 'translated by',
							entities: [
								{
									model: 'PERSON',
									uuid: GERRY_BAMMAN_PERSON_UUID,
									name: 'Gerry Bamman'
								},
								{
									model: 'COMPANY',
									uuid: BAMMAN_THEATRE_COMPANY_UUID,
									name: 'Bamman Theatre Company'
								},
								{
									model: 'PERSON',
									uuid: IRENE_B_BERMAN_PERSON_UUID,
									name: 'Irene B Berman'
								}
							]
						},
						{
							model: 'WRITING_CREDIT',
							name: 'adapted by',
							entities: [
								{
									model: 'PERSON',
									uuid: BALTASAR_KORMÁKUR_PERSON_UUID,
									name: 'Baltasar Kormákur'
								}
							]
						}
					]
				},
				{
					model: 'MATERIAL',
					uuid: PEER_GYNT_SUBSEQUENT_VERSION_2_MATERIAL_UUID,
					name: 'Peer Gynt',
					format: 'play',
					year: 2007,
					surMaterial: null,
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'by',
							entities: [
								{
									model: 'PERSON',
									uuid: HENRIK_IBSEN_PERSON_UUID,
									name: 'Henrik Ibsen'
								},
								{
									model: 'COMPANY',
									uuid: IBSEN_THEATRE_COMPANY_UUID,
									name: 'Ibsen Theatre Company'
								}
							]
						},
						{
							model: 'WRITING_CREDIT',
							name: 'translated by',
							entities: [
								{
									model: 'PERSON',
									uuid: GERRY_BAMMAN_PERSON_UUID,
									name: 'Gerry Bamman'
								},
								{
									model: 'COMPANY',
									uuid: BAMMAN_THEATRE_COMPANY_UUID,
									name: 'Bamman Theatre Company'
								},
								{
									model: 'PERSON',
									uuid: IRENE_B_BERMAN_PERSON_UUID,
									name: 'Irene B Berman'
								}
							]
						},
						{
							model: 'WRITING_CREDIT',
							name: 'adapted by',
							entities: [
								{
									model: 'PERSON',
									uuid: BALTASAR_KORMÁKUR_PERSON_UUID,
									name: 'Baltasar Kormákur'
								}
							]
						}
					]
				},
				{
					model: 'MATERIAL',
					uuid: PEER_GYNT_SUBSEQUENT_VERSION_1_MATERIAL_UUID,
					name: 'Peer Gynt',
					format: 'play',
					year: 2000,
					surMaterial: null,
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'by',
							entities: [
								{
									model: 'PERSON',
									uuid: HENRIK_IBSEN_PERSON_UUID,
									name: 'Henrik Ibsen'
								},
								{
									model: 'COMPANY',
									uuid: IBSEN_THEATRE_COMPANY_UUID,
									name: 'Ibsen Theatre Company'
								}
							]
						},
						{
							model: 'WRITING_CREDIT',
							name: 'version by',
							entities: [
								{
									model: 'PERSON',
									uuid: FRANK_MCGUINNESS_PERSON_UUID,
									name: 'Frank McGuinness'
								}
							]
						}
					]
				}
			];

			const { subsequentVersionMaterials } = ibsenTheatreCompany.body;

			expect(subsequentVersionMaterials).to.deep.equal(expectedSubsequentVersionMaterials);

		});

	});

	describe('Bamman Theatre Company (company)', () => {

		it('includes materials it has written, with corresponding writers', () => {

			const expectedMaterials = [
				{
					model: 'MATERIAL',
					uuid: GHOSTS_SUBSEQUENT_VERSION_MATERIAL_UUID,
					name: 'Ghosts',
					format: 'play',
					year: 2008,
					surMaterial: null,
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'by',
							entities: [
								{
									model: 'PERSON',
									uuid: HENRIK_IBSEN_PERSON_UUID,
									name: 'Henrik Ibsen'
								},
								{
									model: 'COMPANY',
									uuid: IBSEN_THEATRE_COMPANY_UUID,
									name: 'Ibsen Theatre Company'
								}
							]
						},
						{
							model: 'WRITING_CREDIT',
							name: 'translated by',
							entities: [
								{
									model: 'PERSON',
									uuid: GERRY_BAMMAN_PERSON_UUID,
									name: 'Gerry Bamman'
								},
								{
									model: 'COMPANY',
									uuid: BAMMAN_THEATRE_COMPANY_UUID,
									name: 'Bamman Theatre Company'
								},
								{
									model: 'PERSON',
									uuid: IRENE_B_BERMAN_PERSON_UUID,
									name: 'Irene B Berman'
								}
							]
						},
						{
							model: 'WRITING_CREDIT',
							name: 'adapted by',
							entities: [
								{
									model: 'PERSON',
									uuid: BALTASAR_KORMÁKUR_PERSON_UUID,
									name: 'Baltasar Kormákur'
								}
							]
						}
					]
				},
				{
					model: 'MATERIAL',
					uuid: PEER_GYNT_SUBSEQUENT_VERSION_2_MATERIAL_UUID,
					name: 'Peer Gynt',
					format: 'play',
					year: 2007,
					surMaterial: null,
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'by',
							entities: [
								{
									model: 'PERSON',
									uuid: HENRIK_IBSEN_PERSON_UUID,
									name: 'Henrik Ibsen'
								},
								{
									model: 'COMPANY',
									uuid: IBSEN_THEATRE_COMPANY_UUID,
									name: 'Ibsen Theatre Company'
								}
							]
						},
						{
							model: 'WRITING_CREDIT',
							name: 'translated by',
							entities: [
								{
									model: 'PERSON',
									uuid: GERRY_BAMMAN_PERSON_UUID,
									name: 'Gerry Bamman'
								},
								{
									model: 'COMPANY',
									uuid: BAMMAN_THEATRE_COMPANY_UUID,
									name: 'Bamman Theatre Company'
								},
								{
									model: 'PERSON',
									uuid: IRENE_B_BERMAN_PERSON_UUID,
									name: 'Irene B Berman'
								}
							]
						},
						{
							model: 'WRITING_CREDIT',
							name: 'adapted by',
							entities: [
								{
									model: 'PERSON',
									uuid: BALTASAR_KORMÁKUR_PERSON_UUID,
									name: 'Baltasar Kormákur'
								}
							]
						}
					]
				}
			];

			const { materials } = bammanTheatreCompany.body;

			expect(materials).to.deep.equal(expectedMaterials);

		});

	});

	describe('Peer Gynt at Barbican (production)', () => {

		it('includes in its material data the writers of the material', () => {

			const expectedMaterial = {
				model: 'MATERIAL',
				uuid: PEER_GYNT_SUBSEQUENT_VERSION_2_MATERIAL_UUID,
				name: 'Peer Gynt',
				format: 'play',
				year: 2007,
				surMaterial: null,
				writingCredits: [
					{
						model: 'WRITING_CREDIT',
						name: 'by',
						entities: [
							{
								model: 'PERSON',
								uuid: HENRIK_IBSEN_PERSON_UUID,
								name: 'Henrik Ibsen'
							},
							{
								model: 'COMPANY',
								uuid: IBSEN_THEATRE_COMPANY_UUID,
								name: 'Ibsen Theatre Company'
							}
						]
					},
					{
						model: 'WRITING_CREDIT',
						name: 'translated by',
						entities: [
							{
								model: 'PERSON',
								uuid: GERRY_BAMMAN_PERSON_UUID,
								name: 'Gerry Bamman'
							},
							{
								model: 'COMPANY',
								uuid: BAMMAN_THEATRE_COMPANY_UUID,
								name: 'Bamman Theatre Company'
							},
							{
								model: 'PERSON',
								uuid: IRENE_B_BERMAN_PERSON_UUID,
								name: 'Irene B Berman'
							}
						]
					},
					{
						model: 'WRITING_CREDIT',
						name: 'adapted by',
						entities: [
							{
								model: 'PERSON',
								uuid: BALTASAR_KORMÁKUR_PERSON_UUID,
								name: 'Baltasar Kormákur'
							}
						]
					}
				]
			};

			const { material } = peerGyntBarbicanProduction.body;

			expect(material).to.deep.equal(expectedMaterial);

		});

	});

	describe('Peer Gynt (character)', () => {

		it('includes in its material data the writers of the material', () => {

			const expectedMaterials = [
				{
					model: 'MATERIAL',
					uuid: PEER_GYNT_SUBSEQUENT_VERSION_2_MATERIAL_UUID,
					name: 'Peer Gynt',
					format: 'play',
					year: 2007,
					surMaterial: null,
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'by',
							entities: [
								{
									model: 'PERSON',
									uuid: HENRIK_IBSEN_PERSON_UUID,
									name: 'Henrik Ibsen'
								},
								{
									model: 'COMPANY',
									uuid: IBSEN_THEATRE_COMPANY_UUID,
									name: 'Ibsen Theatre Company'
								}
							]
						},
						{
							model: 'WRITING_CREDIT',
							name: 'translated by',
							entities: [
								{
									model: 'PERSON',
									uuid: GERRY_BAMMAN_PERSON_UUID,
									name: 'Gerry Bamman'
								},
								{
									model: 'COMPANY',
									uuid: BAMMAN_THEATRE_COMPANY_UUID,
									name: 'Bamman Theatre Company'
								},
								{
									model: 'PERSON',
									uuid: IRENE_B_BERMAN_PERSON_UUID,
									name: 'Irene B Berman'
								}
							]
						},
						{
							model: 'WRITING_CREDIT',
							name: 'adapted by',
							entities: [
								{
									model: 'PERSON',
									uuid: BALTASAR_KORMÁKUR_PERSON_UUID,
									name: 'Baltasar Kormákur'
								}
							]
						}
					],
					depictions: []
				},
				{
					model: 'MATERIAL',
					uuid: PEER_GYNT_SUBSEQUENT_VERSION_1_MATERIAL_UUID,
					name: 'Peer Gynt',
					format: 'play',
					year: 2000,
					surMaterial: null,
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'by',
							entities: [
								{
									model: 'PERSON',
									uuid: HENRIK_IBSEN_PERSON_UUID,
									name: 'Henrik Ibsen'
								},
								{
									model: 'COMPANY',
									uuid: IBSEN_THEATRE_COMPANY_UUID,
									name: 'Ibsen Theatre Company'
								}
							]
						},
						{
							model: 'WRITING_CREDIT',
							name: 'version by',
							entities: [
								{
									model: 'PERSON',
									uuid: FRANK_MCGUINNESS_PERSON_UUID,
									name: 'Frank McGuinness'
								}
							]
						}
					],
					depictions: []
				},
				{
					model: 'MATERIAL',
					uuid: PEER_GYNT_ORIGINAL_VERSION_MATERIAL_UUID,
					name: 'Peer Gynt',
					format: 'play',
					year: 1867,
					surMaterial: null,
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'by',
							entities: [
								{
									model: 'PERSON',
									uuid: HENRIK_IBSEN_PERSON_UUID,
									name: 'Henrik Ibsen'
								},
								{
									model: 'COMPANY',
									uuid: IBSEN_THEATRE_COMPANY_UUID,
									name: 'Ibsen Theatre Company'
								}
							]
						}
					],
					depictions: []
				}
			];

			const { materials } = peerGyntCharacter.body;

			expect(materials).to.deep.equal(expectedMaterials);

		});

	});

	describe('materials list', () => {

		it('includes writers', async () => {

			const response = await chai.request(app)
				.get('/materials');

			const expectedResponseBody = [
				{
					model: 'MATERIAL',
					uuid: GHOSTS_SUBSEQUENT_VERSION_MATERIAL_UUID,
					name: 'Ghosts',
					format: 'play',
					year: 2008,
					surMaterial: null,
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'by',
							entities: [
								{
									model: 'PERSON',
									uuid: HENRIK_IBSEN_PERSON_UUID,
									name: 'Henrik Ibsen'
								},
								{
									model: 'COMPANY',
									uuid: IBSEN_THEATRE_COMPANY_UUID,
									name: 'Ibsen Theatre Company'
								}
							]
						},
						{
							model: 'WRITING_CREDIT',
							name: 'translated by',
							entities: [
								{
									model: 'PERSON',
									uuid: GERRY_BAMMAN_PERSON_UUID,
									name: 'Gerry Bamman'
								},
								{
									model: 'COMPANY',
									uuid: BAMMAN_THEATRE_COMPANY_UUID,
									name: 'Bamman Theatre Company'
								},
								{
									model: 'PERSON',
									uuid: IRENE_B_BERMAN_PERSON_UUID,
									name: 'Irene B Berman'
								}
							]
						},
						{
							model: 'WRITING_CREDIT',
							name: 'adapted by',
							entities: [
								{
									model: 'PERSON',
									uuid: BALTASAR_KORMÁKUR_PERSON_UUID,
									name: 'Baltasar Kormákur'
								}
							]
						}
					]
				},
				{
					model: 'MATERIAL',
					uuid: PEER_GYNT_SUBSEQUENT_VERSION_2_MATERIAL_UUID,
					name: 'Peer Gynt',
					format: 'play',
					year: 2007,
					surMaterial: null,
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'by',
							entities: [
								{
									model: 'PERSON',
									uuid: HENRIK_IBSEN_PERSON_UUID,
									name: 'Henrik Ibsen'
								},
								{
									model: 'COMPANY',
									uuid: IBSEN_THEATRE_COMPANY_UUID,
									name: 'Ibsen Theatre Company'
								}
							]
						},
						{
							model: 'WRITING_CREDIT',
							name: 'translated by',
							entities: [
								{
									model: 'PERSON',
									uuid: GERRY_BAMMAN_PERSON_UUID,
									name: 'Gerry Bamman'
								},
								{
									model: 'COMPANY',
									uuid: BAMMAN_THEATRE_COMPANY_UUID,
									name: 'Bamman Theatre Company'
								},
								{
									model: 'PERSON',
									uuid: IRENE_B_BERMAN_PERSON_UUID,
									name: 'Irene B Berman'
								}
							]
						},
						{
							model: 'WRITING_CREDIT',
							name: 'adapted by',
							entities: [
								{
									model: 'PERSON',
									uuid: BALTASAR_KORMÁKUR_PERSON_UUID,
									name: 'Baltasar Kormákur'
								}
							]
						}
					]
				},
				{
					model: 'MATERIAL',
					uuid: PEER_GYNT_SUBSEQUENT_VERSION_1_MATERIAL_UUID,
					name: 'Peer Gynt',
					format: 'play',
					year: 2000,
					surMaterial: null,
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'by',
							entities: [
								{
									model: 'PERSON',
									uuid: HENRIK_IBSEN_PERSON_UUID,
									name: 'Henrik Ibsen'
								},
								{
									model: 'COMPANY',
									uuid: IBSEN_THEATRE_COMPANY_UUID,
									name: 'Ibsen Theatre Company'
								}
							]
						},
						{
							model: 'WRITING_CREDIT',
							name: 'version by',
							entities: [
								{
									model: 'PERSON',
									uuid: FRANK_MCGUINNESS_PERSON_UUID,
									name: 'Frank McGuinness'
								}
							]
						}
					]
				},
				{
					model: 'MATERIAL',
					uuid: GHOSTS_ORIGINAL_VERSION_MATERIAL_UUID,
					name: 'Ghosts',
					format: 'play',
					year: 1881,
					surMaterial: null,
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'by',
							entities: [
								{
									model: 'PERSON',
									uuid: HENRIK_IBSEN_PERSON_UUID,
									name: 'Henrik Ibsen'
								},
								{
									model: 'COMPANY',
									uuid: IBSEN_THEATRE_COMPANY_UUID,
									name: 'Ibsen Theatre Company'
								}
							]
						}
					]
				},
				{
					model: 'MATERIAL',
					uuid: PEER_GYNT_ORIGINAL_VERSION_MATERIAL_UUID,
					name: 'Peer Gynt',
					format: 'play',
					year: 1867,
					surMaterial: null,
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'by',
							entities: [
								{
									model: 'PERSON',
									uuid: HENRIK_IBSEN_PERSON_UUID,
									name: 'Henrik Ibsen'
								},
								{
									model: 'COMPANY',
									uuid: IBSEN_THEATRE_COMPANY_UUID,
									name: 'Ibsen Theatre Company'
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
