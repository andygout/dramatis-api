import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { createSandbox } from 'sinon';
import { v4 as uuid } from 'uuid';

import app from '../../src/app';
import purgeDatabase from '../test-helpers/neo4j/purge-database';

describe('Materials with multiple versions and multiple writer credits', () => {

	chai.use(chaiHttp);

	const PEER_GYNT_ORIGINAL_VERSION_MATERIAL_UUID = '4';
	const HENRIK_IBSEN_PERSON_UUID = '6';
	const PEER_GYNT_CHARACTER_UUID = '7';
	const PEER_GYNT_SUBSEQUENT_VERSION_1_MATERIAL_UUID = '13';
	const FRANK_MCGUINNESS_PERSON_UUID = '16';
	const PEER_GYNT_SUBSEQUENT_VERSION_2_MATERIAL_UUID = '25';
	const GERRY_BAMMAN_PERSON_UUID = '28';
	const IRENE_B_BERMAN_PERSON_UUID = '29';
	const BALTASAR_KORMÁKUR_PERSON_UUID = '30';
	const GHOSTS_ORIGINAL_VERSION_MATERIAL_UUID = '35';
	const GHOSTS_SUBSEQUENT_VERSION_MATERIAL_UUID = '44';
	const PEER_GYNT_BARBICAN_PRODUCTION_UUID = '50';

	let peerGyntOriginalMaterial;
	let peerGyntSubsequentVersion2Material;
	let henrikIbsenPerson;
	let gerryBammanPerson;
	let peerGyntCharacter;
	let peerGyntBarbicanProduction;

	const sandbox = createSandbox();

	before(async () => {

		let uuidCallCount = 0;

		sandbox.stub(uuid, 'v4').callsFake(() => (uuidCallCount++).toString());

		await purgeDatabase();

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Peer Gynt',
				differentiator: '1',
				format: 'play',
				writingCredits: [
					{
						writingEntities: [
							{
								name: 'Henrik Ibsen'
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
				originalVersionMaterial: {
					name: 'Peer Gynt',
					differentiator: '1'
				},
				writingCredits: [
					{
						creditType: 'ORIGINAL_VERSION',
						writingEntities: [
							{
								name: 'Henrik Ibsen'
							}
						]
					},
					{
						name: 'version by',
						writingEntities: [
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
				originalVersionMaterial: {
					name: 'Peer Gynt',
					differentiator: '1'
				},
				writingCredits: [
					{
						creditType: 'ORIGINAL_VERSION',
						writingEntities: [
							{
								name: 'Henrik Ibsen'
							}
						]
					},
					{
						name: 'translated by',
						writingEntities: [
							{
								name: 'Gerry Bamman'
							},
							{
								name: 'Irene B Berman'
							}
						]
					},
					{
						name: 'adapted by',
						writingEntities: [
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
				writingCredits: [
					{
						writingEntities: [
							{
								name: 'Henrik Ibsen'
							}
						]
					}
				]
			});

		// Contrivance for purposes of test.
		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Ghosts',
				differentiator: '2',
				format: 'play',
				writingCredits: [
					{
						creditType: 'ORIGINAL_VERSION',
						writingEntities: [
							{
								name: 'Henrik Ibsen'
							}
						]
					},
					{
						name: 'translated by',
						writingEntities: [
							{
								name: 'Gerry Bamman'
							},
							{
								name: 'Irene B Berman'
							}
						]
					},
					{
						name: 'adapted by',
						writingEntities: [
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
				theatre: {
					name: 'Barbican'
				}
			});

		peerGyntOriginalMaterial = await chai.request(app)
			.get(`/materials/${PEER_GYNT_ORIGINAL_VERSION_MATERIAL_UUID}`);

		peerGyntSubsequentVersion2Material = await chai.request(app)
			.get(`/materials/${PEER_GYNT_SUBSEQUENT_VERSION_2_MATERIAL_UUID}`);

		henrikIbsenPerson = await chai.request(app)
			.get(`/people/${HENRIK_IBSEN_PERSON_UUID}`);

		gerryBammanPerson = await chai.request(app)
			.get(`/people/${GERRY_BAMMAN_PERSON_UUID}`);

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
					model: 'material',
					uuid: PEER_GYNT_SUBSEQUENT_VERSION_2_MATERIAL_UUID,
					name: 'Peer Gynt',
					format: 'play',
					writingCredits: [
						{
							model: 'writingCredit',
							name: 'translated by',
							writingEntities: [
								{
									model: 'person',
									uuid: GERRY_BAMMAN_PERSON_UUID,
									name: 'Gerry Bamman'
								},
								{
									model: 'person',
									uuid: IRENE_B_BERMAN_PERSON_UUID,
									name: 'Irene B Berman'
								}
							]
						},
						{
							model: 'writingCredit',
							name: 'adapted by',
							writingEntities: [
								{
									model: 'person',
									uuid: BALTASAR_KORMÁKUR_PERSON_UUID,
									name: 'Baltasar Kormákur'
								}
							]
						}
					]
				},
				{
					model: 'material',
					uuid: PEER_GYNT_SUBSEQUENT_VERSION_1_MATERIAL_UUID,
					name: 'Peer Gynt',
					format: 'play',
					writingCredits: [
						{
							model: 'writingCredit',
							name: 'version by',
							writingEntities: [
								{
									model: 'person',
									uuid: FRANK_MCGUINNESS_PERSON_UUID,
									name: 'Frank McGuinness'
								}
							]
						}
					]
				}
			];

			const { subsequentVersionMaterials } = peerGyntOriginalMaterial.body;

			expect(subsequentVersionMaterials).to.deep.equal(expectedSubsequentVersionMaterials);

		});

		it('includes writers of this material grouped by their respective credits', () => {

			const expectedWritingCredits = [
				{
					model: 'writingCredit',
					name: 'by',
					writingEntities: [
						{
							model: 'person',
							uuid: HENRIK_IBSEN_PERSON_UUID,
							name: 'Henrik Ibsen',
							format: null,
							sourceMaterialWritingCredits: []
						}
					]
				}
			];

			const { writingCredits } = peerGyntOriginalMaterial.body;

			expect(writingCredits).to.deep.equal(expectedWritingCredits);

		});

	});

	describe('Peer Gynt (subsequent version) (material)', () => {

		it('includes original version of this material, with corresponding writers', () => {

			const expectedOriginalVersionMaterial = {
				model: 'material',
				uuid: PEER_GYNT_ORIGINAL_VERSION_MATERIAL_UUID,
				name: 'Peer Gynt',
				format: 'play',
				writingCredits: [
					{
						model: 'writingCredit',
						name: 'by',
						writingEntities: [
							{
								model: 'person',
								uuid: HENRIK_IBSEN_PERSON_UUID,
								name: 'Henrik Ibsen'
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
					model: 'writingCredit',
					name: 'by',
					writingEntities: [
						{
							model: 'person',
							uuid: HENRIK_IBSEN_PERSON_UUID,
							name: 'Henrik Ibsen',
							format: null,
							sourceMaterialWritingCredits: []
						}
					]
				},
				{
					model: 'writingCredit',
					name: 'translated by',
					writingEntities: [
						{
							model: 'person',
							uuid: GERRY_BAMMAN_PERSON_UUID,
							name: 'Gerry Bamman',
							format: null,
							sourceMaterialWritingCredits: []
						},
						{
							model: 'person',
							uuid: IRENE_B_BERMAN_PERSON_UUID,
							name: 'Irene B Berman',
							format: null,
							sourceMaterialWritingCredits: []
						}
					]
				},
				{
					model: 'writingCredit',
					name: 'adapted by',
					writingEntities: [
						{
							model: 'person',
							uuid: BALTASAR_KORMÁKUR_PERSON_UUID,
							name: 'Baltasar Kormákur',
							format: null,
							sourceMaterialWritingCredits: []
						}
					]
				}
			];

			const { writingCredits } = peerGyntSubsequentVersion2Material.body;

			expect(writingCredits).to.deep.equal(expectedWritingCredits);

		});

	});

	describe('Henrik Ibsen (person)', () => {

		it('includes materials they have written (in which their uuid is nullified)', () => {

			const expectedMaterials = [
				{
					model: 'material',
					uuid: GHOSTS_ORIGINAL_VERSION_MATERIAL_UUID,
					name: 'Ghosts',
					format: 'play',
					writingCredits: [
						{
							model: 'writingCredit',
							name: 'by',
							writingEntities: [
								{
									model: 'person',
									uuid: null,
									name: 'Henrik Ibsen',
									format: null,
									sourceMaterialWritingCredits: []
								}
							]
						}
					]
				},
				{
					model: 'material',
					uuid: PEER_GYNT_ORIGINAL_VERSION_MATERIAL_UUID,
					name: 'Peer Gynt',
					format: 'play',
					writingCredits: [
						{
							model: 'writingCredit',
							name: 'by',
							writingEntities: [
								{
									model: 'person',
									uuid: null,
									name: 'Henrik Ibsen',
									format: null,
									sourceMaterialWritingCredits: []
								}
							]
						}
					]
				}
			];

			const { materials } = henrikIbsenPerson.body;

			expect(materials).to.deep.equal(expectedMaterials);

		});

		it('includes subsequent versions of materials they originally wrote (in which their uuid is nullified), with corresponding writers', () => {

			const expectedSubsequentVersionMaterials = [
				{
					model: 'material',
					uuid: GHOSTS_SUBSEQUENT_VERSION_MATERIAL_UUID,
					name: 'Ghosts',
					format: 'play',
					writingCredits: [
						{
							model: 'writingCredit',
							name: 'by',
							writingEntities: [
								{
									model: 'person',
									uuid: null,
									name: 'Henrik Ibsen',
									format: null,
									sourceMaterialWritingCredits: []
								}
							]
						},
						{
							model: 'writingCredit',
							name: 'translated by',
							writingEntities: [
								{
									model: 'person',
									uuid: GERRY_BAMMAN_PERSON_UUID,
									name: 'Gerry Bamman',
									format: null,
									sourceMaterialWritingCredits: []
								},
								{
									model: 'person',
									uuid: IRENE_B_BERMAN_PERSON_UUID,
									name: 'Irene B Berman',
									format: null,
									sourceMaterialWritingCredits: []
								}
							]
						},
						{
							model: 'writingCredit',
							name: 'adapted by',
							writingEntities: [
								{
									model: 'person',
									uuid: BALTASAR_KORMÁKUR_PERSON_UUID,
									name: 'Baltasar Kormákur',
									format: null,
									sourceMaterialWritingCredits: []
								}
							]
						}
					]
				},
				{
					model: 'material',
					uuid: PEER_GYNT_SUBSEQUENT_VERSION_2_MATERIAL_UUID,
					name: 'Peer Gynt',
					format: 'play',
					writingCredits: [
						{
							model: 'writingCredit',
							name: 'by',
							writingEntities: [
								{
									model: 'person',
									uuid: null,
									name: 'Henrik Ibsen',
									format: null,
									sourceMaterialWritingCredits: []
								}
							]
						},
						{
							model: 'writingCredit',
							name: 'translated by',
							writingEntities: [
								{
									model: 'person',
									uuid: GERRY_BAMMAN_PERSON_UUID,
									name: 'Gerry Bamman',
									format: null,
									sourceMaterialWritingCredits: []
								},
								{
									model: 'person',
									uuid: IRENE_B_BERMAN_PERSON_UUID,
									name: 'Irene B Berman',
									format: null,
									sourceMaterialWritingCredits: []
								}
							]
						},
						{
							model: 'writingCredit',
							name: 'adapted by',
							writingEntities: [
								{
									model: 'person',
									uuid: BALTASAR_KORMÁKUR_PERSON_UUID,
									name: 'Baltasar Kormákur',
									format: null,
									sourceMaterialWritingCredits: []
								}
							]
						}
					]
				},
				{
					model: 'material',
					uuid: PEER_GYNT_SUBSEQUENT_VERSION_1_MATERIAL_UUID,
					name: 'Peer Gynt',
					format: 'play',
					writingCredits: [
						{
							model: 'writingCredit',
							name: 'by',
							writingEntities: [
								{
									model: 'person',
									uuid: null,
									name: 'Henrik Ibsen',
									format: null,
									sourceMaterialWritingCredits: []
								}
							]
						},
						{
							model: 'writingCredit',
							name: 'version by',
							writingEntities: [
								{
									model: 'person',
									uuid: FRANK_MCGUINNESS_PERSON_UUID,
									name: 'Frank McGuinness',
									format: null,
									sourceMaterialWritingCredits: []
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

		it('includes materials they have written (in which their uuid is nullified), with corresponding writers', () => {

			const expectedMaterials = [
				{
					model: 'material',
					uuid: GHOSTS_SUBSEQUENT_VERSION_MATERIAL_UUID,
					name: 'Ghosts',
					format: 'play',
					writingCredits: [
						{
							model: 'writingCredit',
							name: 'by',
							writingEntities: [
								{
									model: 'person',
									uuid: HENRIK_IBSEN_PERSON_UUID,
									name: 'Henrik Ibsen',
									format: null,
									sourceMaterialWritingCredits: []
								}
							]
						},
						{
							model: 'writingCredit',
							name: 'translated by',
							writingEntities: [
								{
									model: 'person',
									uuid: null,
									name: 'Gerry Bamman',
									format: null,
									sourceMaterialWritingCredits: []
								},
								{
									model: 'person',
									uuid: IRENE_B_BERMAN_PERSON_UUID,
									name: 'Irene B Berman',
									format: null,
									sourceMaterialWritingCredits: []
								}
							]
						},
						{
							model: 'writingCredit',
							name: 'adapted by',
							writingEntities: [
								{
									model: 'person',
									uuid: BALTASAR_KORMÁKUR_PERSON_UUID,
									name: 'Baltasar Kormákur',
									format: null,
									sourceMaterialWritingCredits: []
								}
							]
						}
					]
				},
				{
					model: 'material',
					uuid: PEER_GYNT_SUBSEQUENT_VERSION_2_MATERIAL_UUID,
					name: 'Peer Gynt',
					format: 'play',
					writingCredits: [
						{
							model: 'writingCredit',
							name: 'by',
							writingEntities: [
								{
									model: 'person',
									uuid: HENRIK_IBSEN_PERSON_UUID,
									name: 'Henrik Ibsen',
									format: null,
									sourceMaterialWritingCredits: []
								}
							]
						},
						{
							model: 'writingCredit',
							name: 'translated by',
							writingEntities: [
								{
									model: 'person',
									uuid: null,
									name: 'Gerry Bamman',
									format: null,
									sourceMaterialWritingCredits: []
								},
								{
									model: 'person',
									uuid: IRENE_B_BERMAN_PERSON_UUID,
									name: 'Irene B Berman',
									format: null,
									sourceMaterialWritingCredits: []
								}
							]
						},
						{
							model: 'writingCredit',
							name: 'adapted by',
							writingEntities: [
								{
									model: 'person',
									uuid: BALTASAR_KORMÁKUR_PERSON_UUID,
									name: 'Baltasar Kormákur',
									format: null,
									sourceMaterialWritingCredits: []
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

	describe('Peer Gynt at Barbican (production)', () => {

		it('includes in its material data the writers of the material', () => {

			const expectedMaterial = {
				model: 'material',
				uuid: PEER_GYNT_SUBSEQUENT_VERSION_2_MATERIAL_UUID,
				name: 'Peer Gynt',
				format: 'play',
				writingCredits: [
					{
						model: 'writingCredit',
						name: 'by',
						writingEntities: [
							{
								model: 'person',
								uuid: HENRIK_IBSEN_PERSON_UUID,
								name: 'Henrik Ibsen',
								format: null,
								sourceMaterialWritingCredits: []
							}
						]
					},
					{
						model: 'writingCredit',
						name: 'translated by',
						writingEntities: [
							{
								model: 'person',
								uuid: GERRY_BAMMAN_PERSON_UUID,
								name: 'Gerry Bamman',
								format: null,
								sourceMaterialWritingCredits: []
							},
							{
								model: 'person',
								uuid: IRENE_B_BERMAN_PERSON_UUID,
								name: 'Irene B Berman',
								format: null,
								sourceMaterialWritingCredits: []
							}
						]
					},
					{
						model: 'writingCredit',
						name: 'adapted by',
						writingEntities: [
							{
								model: 'person',
								uuid: BALTASAR_KORMÁKUR_PERSON_UUID,
								name: 'Baltasar Kormákur',
								format: null,
								sourceMaterialWritingCredits: []
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
					model: 'material',
					uuid: PEER_GYNT_SUBSEQUENT_VERSION_2_MATERIAL_UUID,
					name: 'Peer Gynt',
					format: 'play',
					writingCredits: [
						{
							model: 'writingCredit',
							name: 'by',
							writingEntities: [
								{
									model: 'person',
									uuid: HENRIK_IBSEN_PERSON_UUID,
									name: 'Henrik Ibsen',
									format: null,
									sourceMaterialWritingCredits: []
								}
							]
						},
						{
							model: 'writingCredit',
							name: 'translated by',
							writingEntities: [
								{
									model: 'person',
									uuid: GERRY_BAMMAN_PERSON_UUID,
									name: 'Gerry Bamman',
									format: null,
									sourceMaterialWritingCredits: []
								},
								{
									model: 'person',
									uuid: IRENE_B_BERMAN_PERSON_UUID,
									name: 'Irene B Berman',
									format: null,
									sourceMaterialWritingCredits: []
								}
							]
						},
						{
							model: 'writingCredit',
							name: 'adapted by',
							writingEntities: [
								{
									model: 'person',
									uuid: BALTASAR_KORMÁKUR_PERSON_UUID,
									name: 'Baltasar Kormákur',
									format: null,
									sourceMaterialWritingCredits: []
								}
							]
						}
					],
					depictions: []
				},
				{
					model: 'material',
					uuid: PEER_GYNT_SUBSEQUENT_VERSION_1_MATERIAL_UUID,
					name: 'Peer Gynt',
					format: 'play',
					writingCredits: [
						{
							model: 'writingCredit',
							name: 'by',
							writingEntities: [
								{
									model: 'person',
									uuid: HENRIK_IBSEN_PERSON_UUID,
									name: 'Henrik Ibsen',
									format: null,
									sourceMaterialWritingCredits: []
								}
							]
						},
						{
							model: 'writingCredit',
							name: 'version by',
							writingEntities: [
								{
									model: 'person',
									uuid: FRANK_MCGUINNESS_PERSON_UUID,
									name: 'Frank McGuinness',
									format: null,
									sourceMaterialWritingCredits: []
								}
							]
						}
					],
					depictions: []
				},
				{
					model: 'material',
					uuid: PEER_GYNT_ORIGINAL_VERSION_MATERIAL_UUID,
					name: 'Peer Gynt',
					format: 'play',
					writingCredits: [
						{
							model: 'writingCredit',
							name: 'by',
							writingEntities: [
								{
									model: 'person',
									uuid: HENRIK_IBSEN_PERSON_UUID,
									name: 'Henrik Ibsen',
									format: null,
									sourceMaterialWritingCredits: []
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
					model: 'material',
					uuid: GHOSTS_ORIGINAL_VERSION_MATERIAL_UUID,
					name: 'Ghosts',
					format: 'play',
					writingCredits: [
						{
							model: 'writingCredit',
							name: 'by',
							writingEntities: [
								{
									model: 'person',
									uuid: HENRIK_IBSEN_PERSON_UUID,
									name: 'Henrik Ibsen',
									format: null,
									sourceMaterialWritingCredits: []
								}
							]
						}
					]
				},
				{
					model: 'material',
					uuid: GHOSTS_SUBSEQUENT_VERSION_MATERIAL_UUID,
					name: 'Ghosts',
					format: 'play',
					writingCredits: [
						{
							model: 'writingCredit',
							name: 'by',
							writingEntities: [
								{
									model: 'person',
									uuid: HENRIK_IBSEN_PERSON_UUID,
									name: 'Henrik Ibsen',
									format: null,
									sourceMaterialWritingCredits: []
								}
							]
						},
						{
							model: 'writingCredit',
							name: 'translated by',
							writingEntities: [
								{
									model: 'person',
									uuid: GERRY_BAMMAN_PERSON_UUID,
									name: 'Gerry Bamman',
									format: null,
									sourceMaterialWritingCredits: []
								},
								{
									model: 'person',
									uuid: IRENE_B_BERMAN_PERSON_UUID,
									name: 'Irene B Berman',
									format: null,
									sourceMaterialWritingCredits: []
								}
							]
						},
						{
							model: 'writingCredit',
							name: 'adapted by',
							writingEntities: [
								{
									model: 'person',
									uuid: BALTASAR_KORMÁKUR_PERSON_UUID,
									name: 'Baltasar Kormákur',
									format: null,
									sourceMaterialWritingCredits: []
								}
							]
						}
					]
				},
				{
					model: 'material',
					uuid: PEER_GYNT_ORIGINAL_VERSION_MATERIAL_UUID,
					name: 'Peer Gynt',
					format: 'play',
					writingCredits: [
						{
							model: 'writingCredit',
							name: 'by',
							writingEntities: [
								{
									model: 'person',
									uuid: HENRIK_IBSEN_PERSON_UUID,
									name: 'Henrik Ibsen',
									format: null,
									sourceMaterialWritingCredits: []
								}
							]
						}
					]
				},
				{
					model: 'material',
					uuid: PEER_GYNT_SUBSEQUENT_VERSION_1_MATERIAL_UUID,
					name: 'Peer Gynt',
					format: 'play',
					writingCredits: [
						{
							model: 'writingCredit',
							name: 'by',
							writingEntities: [
								{
									model: 'person',
									uuid: HENRIK_IBSEN_PERSON_UUID,
									name: 'Henrik Ibsen',
									format: null,
									sourceMaterialWritingCredits: []
								}
							]
						},
						{
							model: 'writingCredit',
							name: 'version by',
							writingEntities: [
								{
									model: 'person',
									uuid: FRANK_MCGUINNESS_PERSON_UUID,
									name: 'Frank McGuinness',
									format: null,
									sourceMaterialWritingCredits: []
								}
							]
						}
					]
				},
				{
					model: 'material',
					uuid: PEER_GYNT_SUBSEQUENT_VERSION_2_MATERIAL_UUID,
					name: 'Peer Gynt',
					format: 'play',
					writingCredits: [
						{
							model: 'writingCredit',
							name: 'by',
							writingEntities: [
								{
									model: 'person',
									uuid: HENRIK_IBSEN_PERSON_UUID,
									name: 'Henrik Ibsen',
									format: null,
									sourceMaterialWritingCredits: []
								}
							]
						},
						{
							model: 'writingCredit',
							name: 'translated by',
							writingEntities: [
								{
									model: 'person',
									uuid: GERRY_BAMMAN_PERSON_UUID,
									name: 'Gerry Bamman',
									format: null,
									sourceMaterialWritingCredits: []
								},
								{
									model: 'person',
									uuid: IRENE_B_BERMAN_PERSON_UUID,
									name: 'Irene B Berman',
									format: null,
									sourceMaterialWritingCredits: []
								}
							]
						},
						{
							model: 'writingCredit',
							name: 'adapted by',
							writingEntities: [
								{
									model: 'person',
									uuid: BALTASAR_KORMÁKUR_PERSON_UUID,
									name: 'Baltasar Kormákur',
									format: null,
									sourceMaterialWritingCredits: []
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
