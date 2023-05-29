import crypto from 'crypto';

import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { createSandbox } from 'sinon';

import app from '../../src/app';
import purgeDatabase from '../test-helpers/neo4j/purge-database';

describe('Production with sub-sub-productions', () => {

	chai.use(chaiHttp);

	const BERKELEY_REPERTORY_THEATRE_VENUE_UUID = '2';
	const RODA_THEATRE_VENUE_UUID = '3';
	const BUGLES_AT_THE_GATES_OF_JALALABAD_MATERIAL_UUID = '9';
	const FERDINAND_FOO_JR_PERSON_UUID = '11';
	const SUB_INKISTS_LTD_COMPANY_UUID = '12';
	const BAR_JR_CHARACTER_UUID = '13';
	const DURANDS_LINE_MATERIAL_UUID = '19';
	const CAMPAIGN_MATERIAL_UUID = '29';
	const PART_ONE_INVASIONS_AND_INDEPENDENCE_MATERIAL_UUID = '45';
	const FERDINAND_FOO_PERSON_UUID = '47';
	const MID_INKISTS_LTD_COMPANY_UUID = '48';
	const BAR_CHARACTER_UUID = '52';
	const BLACK_TULIPS_MATERIAL_UUID = '58';
	const BLOOD_AND_GIFTS_MATERIAL_UUID = '68';
	const MINISKIRTS_OF_KABUL_MATERIAL_UUID = '78';
	const PART_TWO_COMMUNISM_THE_MUJAHIDEEN_AND_THE_TALIBAN_MATERIAL_UUID = '94';
	const HONEY_MATERIAL_UUID = '107';
	const THE_NIGHT_IS_DARKEST_BEFORE_THE_DAWN_MATERIAL_UUID = '117';
	const ON_THE_SIDE_OF_THE_ANGELS_MATERIAL_UUID = '127';
	const PART_THREE_ENDURING_FREEDOM_MATERIAL_UUID = '143';
	const THE_GREAT_GAME_AFGHANISTAN_MATERIAL_UUID = '162';
	const FERDINAND_FOO_SR_PERSON_UUID = '164';
	const SUR_INKISTS_LTD_COMPANY_UUID = '165';
	const BAR_SR_CHARACTER_UUID = '169';
	const BUGLES_AT_THE_GATES_OF_JALALABAD_RODA_PRODUCTION_UUID = '170';
	const NICOLAS_KENT_JR_PERSON_UUID = '173';
	const SUB_TRICYCLE_THEATRE_COMPANY_UUID = '174';
	const ZOË_INGENHAAG_JR_PERSON_UUID = '175';
	const RICK_WARDEN_JR_PERSON_UUID = '176';
	const HOWARD_HARRISON_JR_PERSON_UUID = '177';
	const SUB_LIGHTING_DESIGN_LTD_COMPANY_UUID = '178';
	const JACK_KNOWLES_JR_PERSON_UUID = '179';
	const LIZZIE_CHAPMAN_JR_PERSON_UUID = '180';
	const SUB_STAGE_MANAGEMENT_LTD_COMPANY_UUID = '181';
	const CHARLOTTE_PADGHAM_JR_PERSON_UUID = '182';
	const DURANDS_LINE_RODA_PRODUCTION_UUID = '183';
	const CAMPAIGN_RODA_PRODUCTION_UUID = '196';
	const PART_ONE_INVASIONS_AND_INDEPENDENCE_RODA_PRODUCTION_UUID = '209';
	const NICOLAS_KENT_PERSON_UUID = '212';
	const MID_TRICYCLE_THEATRE_COMPANY_UUID = '213';
	const ZOË_INGENHAAG_PERSON_UUID = '214';
	const RICK_WARDEN_PERSON_UUID = '215';
	const HOWARD_HARRISON_PERSON_UUID = '216';
	const MID_LIGHTING_DESIGN_LTD_COMPANY_UUID = '217';
	const JACK_KNOWLES_PERSON_UUID = '218';
	const LIZZIE_CHAPMAN_PERSON_UUID = '219';
	const MID_STAGE_MANAGEMENT_LTD_COMPANY_UUID = '220';
	const CHARLOTTE_PADGHAM_PERSON_UUID = '221';
	const BLACK_TULIPS_RODA_PRODUCTION_UUID = '222';
	const BLOOD_AND_GIFTS_RODA_PRODUCTION_UUID = '235';
	const MINISKIRTS_OF_KABUL_RODA_PRODUCTION_UUID = '248';
	const PART_TWO_COMMUNISM_THE_MUJAHIDEEN_AND_THE_TALIBAN_RODA_PRODUCTION_UUID = '261';
	const HONEY_RODA_PRODUCTION_UUID = '274';
	const THE_NIGHT_IS_DARKEST_BEFORE_THE_DAWN_RODA_PRODUCTION_UUID = '287';
	const ON_THE_SIDE_OF_THE_ANGELS_RODA_PRODUCTION_UUID = '300';
	const PART_THREE_ENDURING_FREEDOM_RODA_PRODUCTION_UUID = '313';
	const THE_GREAT_GAME_AFGHANISTAN_RODA_PRODUCTION_UUID = '326';
	const NICOLAS_KENT_SR_PERSON_UUID = '329';
	const SUR_TRICYCLE_THEATRE_COMPANY_UUID = '330';
	const ZOË_INGENHAAG_SR_PERSON_UUID = '331';
	const RICK_WARDEN_SR_PERSON_UUID = '332';
	const HOWARD_HARRISON_SR_PERSON_UUID = '333';
	const SUR_LIGHTING_DESIGN_LTD_COMPANY_UUID = '334';
	const JACK_KNOWLES_SR_PERSON_UUID = '335';
	const LIZZIE_CHAPMAN_SR_PERSON_UUID = '336';
	const SUR_STAGE_MANAGEMENT_LTD_COMPANY_UUID = '337';
	const CHARLOTTE_PADGHAM_SR_PERSON_UUID = '338';
	const BUGLES_AT_THE_GATES_OF_JALALABAD_TRICYCLE_PRODUCTION_UUID = '339';
	const TRICYCLE_THEATRE_VENUE_UUID = '341';
	const DURANDS_LINE_TRICYCLE_PRODUCTION_UUID = '342';
	const CAMPAIGN_TRICYCLE_PRODUCTION_UUID = '345';
	const PART_ONE_INVASIONS_AND_INDEPENDENCE_TRICYCLE_PRODUCTION_UUID = '348';
	const BLACK_TULIPS_TRICYCLE_PRODUCTION_UUID = '351';
	const BLOOD_AND_GIFTS_TRICYCLE_PRODUCTION_UUID = '354';
	const MINISKIRTS_OF_KABUL_TRICYCLE_PRODUCTION_UUID = '357';
	const PART_TWO_COMMUNISM_THE_MUJAHIDEEN_AND_THE_TALIBAN_TRICYCLE_PRODUCTION_UUID = '360';
	const HONEY_TRICYCLE_PRODUCTION_UUID = '363';
	const THE_NIGHT_IS_DARKEST_BEFORE_THE_DAWN_TRICYCLE_PRODUCTION_UUID = '366';
	const ON_THE_SIDE_OF_THE_ANGELS_TRICYCLE_PRODUCTION_UUID = '369';
	const PART_THREE_ENDURING_FREEDOM_TRICYCLE_PRODUCTION_UUID = '372';
	const THE_GREAT_GAME_AFGHANISTAN_TRICYCLE_PRODUCTION_UUID = '375';

	let theGreatGameAfghanistanRodaProduction;
	let partOneInvasionsAndIndependenceRodaProduction;
	let buglesAtTheGatesOfJalalabadRodaProduction;
	let theGreatGameAfghanistanTricycleProduction;
	let partOneInvasionsAndIndependenceTricycleProduction;
	let buglesAtTheGatesOfJalalabadTricycleProduction;
	let theGreatGameAfghanistanMaterial;
	let partOneInvasionsAndIndependenceMaterial;
	let buglesAtTheGatesOfJalalabadMaterial;
	let berkeleyRepertoryTheatreVenue;
	let rodaTheatreVenue;
	let nicolasKentJrPerson;
	let subTricycleTheatreCompany;
	let zoëIngenhaagJrPerson;
	let rickWardenJrPerson;
	let howardHarrisonJrPerson;
	let subLightingDesignLtdCompany;
	let jackKnowlesJrPerson;
	let lizzieChapmanJrPerson;
	let subStageManagementLtdCompany;
	let charlottePadghamJrPerson;
	let barJrCharacter;

	const sandbox = createSandbox();

	before(async () => {

		let uuidCallCount = 0;

		sandbox.stub(crypto, 'randomUUID').callsFake(() => (uuidCallCount++).toString());

		await purgeDatabase();

		await chai.request(app)
			.post('/venues')
			.send({
				name: 'Berkeley Repertory Theatre',
				subVenues: [
					{
						name: 'Roda Theatre'
					}
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Bugles at the Gates of Jalalabad',
				format: 'play',
				year: '2009',
				writingCredits: [
					{
						entities: [
							{
								name: 'Ferdinand Foo Jr'
							},
							{
								model: 'COMPANY',
								name: 'Sub-Inkists Ltd'
							}
						]
					}
				],
				characterGroups: [
					{
						characters: [
							{
								name: 'Bar Jr'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Durand\'s Line',
				format: 'play',
				year: '2009',
				writingCredits: [
					{
						entities: [
							{
								name: 'Ferdinand Foo Jr'
							},
							{
								model: 'COMPANY',
								name: 'Sub-Inkists Ltd'
							}
						]
					}
				],
				characterGroups: [
					{
						characters: [
							{
								name: 'Bar Jr'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Campaign',
				format: 'play',
				year: '2009',
				writingCredits: [
					{
						entities: [
							{
								name: 'Ferdinand Foo Jr'
							},
							{
								model: 'COMPANY',
								name: 'Sub-Inkists Ltd'
							}
						]
					}
				],
				characterGroups: [
					{
						characters: [
							{
								name: 'Bar Jr'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Part One - Invasions and Independence 1842-1930',
				format: 'sub-collection of plays',
				year: '2009',
				writingCredits: [
					{
						entities: [
							{
								name: 'Ferdinand Foo'
							},
							{
								model: 'COMPANY',
								name: 'Mid-Inkists Ltd'
							}
						]
					}
				],
				subMaterials: [
					{
						name: 'Bugles at the Gates of Jalalabad'
					},
					{
						name: 'Durand\'s Line'
					},
					{
						name: 'Campaign'
					}
				],
				characterGroups: [
					{
						characters: [
							{
								name: 'Bar'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Black Tulips',
				format: 'play',
				year: '2009',
				writingCredits: [
					{
						entities: [
							{
								name: 'Ferdinand Foo Jr'
							},
							{
								model: 'COMPANY',
								name: 'Sub-Inkists Ltd'
							}
						]
					}
				],
				characterGroups: [
					{
						characters: [
							{
								name: 'Bar Jr'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Blood and Gifts',
				format: 'play',
				year: '2009',
				writingCredits: [
					{
						entities: [
							{
								name: 'Ferdinand Foo Jr'
							},
							{
								model: 'COMPANY',
								name: 'Sub-Inkists Ltd'
							}
						]
					}
				],
				characterGroups: [
					{
						characters: [
							{
								name: 'Bar Jr'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Miniskirts of Kabul',
				format: 'play',
				year: '2009',
				writingCredits: [
					{
						entities: [
							{
								name: 'Ferdinand Foo Jr'
							},
							{
								model: 'COMPANY',
								name: 'Sub-Inkists Ltd'
							}
						]
					}
				],
				characterGroups: [
					{
						characters: [
							{
								name: 'Bar Jr'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Part Two - Communism, the Mujahideen and the Taliban 1979-1996',
				format: 'sub-collection of plays',
				year: '2009',
				writingCredits: [
					{
						entities: [
							{
								name: 'Ferdinand Foo'
							},
							{
								model: 'COMPANY',
								name: 'Mid-Inkists Ltd'
							}
						]
					}
				],
				subMaterials: [
					{
						name: 'Black Tulips'
					},
					{
						name: 'Blood and Gifts'
					},
					{
						name: 'Miniskirts of Kabul'
					}
				],
				characterGroups: [
					{
						characters: [
							{
								name: 'Bar'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Honey',
				format: 'play',
				year: '2009',
				writingCredits: [
					{
						entities: [
							{
								name: 'Ferdinand Foo Jr'
							},
							{
								model: 'COMPANY',
								name: 'Sub-Inkists Ltd'
							}
						]
					}
				],
				characterGroups: [
					{
						characters: [
							{
								name: 'Bar Jr'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'The Night Is Darkest Before the Dawn',
				format: 'play',
				year: '2009',
				writingCredits: [
					{
						entities: [
							{
								name: 'Ferdinand Foo Jr'
							},
							{
								model: 'COMPANY',
								name: 'Sub-Inkists Ltd'
							}
						]
					}
				],
				characterGroups: [
					{
						characters: [
							{
								name: 'Bar Jr'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'On the Side of the Angels',
				format: 'play',
				year: '2009',
				writingCredits: [
					{
						entities: [
							{
								name: 'Ferdinand Foo Jr'
							},
							{
								model: 'COMPANY',
								name: 'Sub-Inkists Ltd'
							}
						]
					}
				],
				characterGroups: [
					{
						characters: [
							{
								name: 'Bar Jr'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Part Three - Enduring Freedom 1996-2009',
				format: 'sub-collection of plays',
				year: '2009',
				writingCredits: [
					{
						entities: [
							{
								name: 'Ferdinand Foo'
							},
							{
								model: 'COMPANY',
								name: 'Mid-Inkists Ltd'
							}
						]
					}
				],
				subMaterials: [
					{
						name: 'Honey'
					},
					{
						name: 'The Night Is Darkest Before the Dawn'
					},
					{
						name: 'On the Side of the Angels'
					}
				],
				characterGroups: [
					{
						characters: [
							{
								name: 'Bar'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'The Great Game: Afghanistan',
				format: 'collection of plays',
				year: '2009',
				writingCredits: [
					{
						entities: [
							{
								name: 'Ferdinand Foo Sr'
							},
							{
								model: 'COMPANY',
								name: 'Sur-Inkists Ltd'
							}
						]
					}
				],
				subMaterials: [
					{
						name: 'Part One - Invasions and Independence 1842-1930'
					},
					{
						name: 'Part Two - Communism, the Mujahideen and the Taliban 1979-1996'
					},
					{
						name: 'Part Three - Enduring Freedom 1996-2009'
					}
				],
				characterGroups: [
					{
						characters: [
							{
								name: 'Bar Sr'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Bugles at the Gates of Jalalabad',
				startDate: '2010-10-22',
				pressDate: '2010-10-25',
				endDate: '2010-11-07',
				material: {
					name: 'Bugles at the Gates of Jalalabad'
				},
				venue: {
					name: 'Roda Theatre'
				},
				producerCredits: [
					{
						entities: [
							{
								name: 'Nicolas Kent Jr'
							},
							{
								model: 'COMPANY',
								name: 'Sub-Tricycle Theatre Company',
								members: [
									{
										name: 'Zoë Ingenhaag Jr'
									}
								]
							}
						]
					}
				],
				cast: [
					{
						name: 'Rick Warden Jr',
						roles: [
							{
								name: 'Bar Jr'
							}
						]
					}
				],
				creativeCredits: [
					{
						name: 'Junior Lighting Designers',
						entities: [
							{
								name: 'Howard Harrison Jr'
							},
							{
								model: 'COMPANY',
								name: 'Sub-Lighting Design Ltd',
								members: [
									{
										name: 'Jack Knowles Jr'
									}
								]
							}
						]
					}
				],
				crewCredits: [
					{
						name: 'Junior Stage Managers',
						entities: [
							{
								name: 'Lizzie Chapman Jr'
							},
							{
								model: 'COMPANY',
								name: 'Sub-Stage Management Ltd',
								members: [
									{
										name: 'Charlotte Padgham Jr'
									}
								]
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Durand\'s Line',
				startDate: '2010-10-22',
				pressDate: '2010-10-25',
				endDate: '2010-11-07',
				material: {
					name: 'Durand\'s Line'
				},
				venue: {
					name: 'Roda Theatre'
				},
				producerCredits: [
					{
						entities: [
							{
								name: 'Nicolas Kent Jr'
							},
							{
								model: 'COMPANY',
								name: 'Sub-Tricycle Theatre Company',
								members: [
									{
										name: 'Zoë Ingenhaag Jr'
									}
								]
							}
						]
					}
				],
				cast: [
					{
						name: 'Rick Warden Jr',
						roles: [
							{
								name: 'Bar Jr'
							}
						]
					}
				],
				creativeCredits: [
					{
						name: 'Junior Lighting Designers',
						entities: [
							{
								name: 'Howard Harrison Jr'
							},
							{
								model: 'COMPANY',
								name: 'Sub-Lighting Design Ltd',
								members: [
									{
										name: 'Jack Knowles Jr'
									}
								]
							}
						]
					}
				],
				crewCredits: [
					{
						name: 'Junior Stage Managers',
						entities: [
							{
								name: 'Lizzie Chapman Jr'
							},
							{
								model: 'COMPANY',
								name: 'Sub-Stage Management Ltd',
								members: [
									{
										name: 'Charlotte Padgham Jr'
									}
								]
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Campaign',
				startDate: '2010-10-22',
				pressDate: '2010-10-25',
				endDate: '2010-11-07',
				material: {
					name: 'Campaign'
				},
				venue: {
					name: 'Roda Theatre'
				},
				producerCredits: [
					{
						entities: [
							{
								name: 'Nicolas Kent Jr'
							},
							{
								model: 'COMPANY',
								name: 'Sub-Tricycle Theatre Company',
								members: [
									{
										name: 'Zoë Ingenhaag Jr'
									}
								]
							}
						]
					}
				],
				cast: [
					{
						name: 'Rick Warden Jr',
						roles: [
							{
								name: 'Bar Jr'
							}
						]
					}
				],
				creativeCredits: [
					{
						name: 'Junior Lighting Designers',
						entities: [
							{
								name: 'Howard Harrison Jr'
							},
							{
								model: 'COMPANY',
								name: 'Sub-Lighting Design Ltd',
								members: [
									{
										name: 'Jack Knowles Jr'
									}
								]
							}
						]
					}
				],
				crewCredits: [
					{
						name: 'Junior Stage Managers',
						entities: [
							{
								name: 'Lizzie Chapman Jr'
							},
							{
								model: 'COMPANY',
								name: 'Sub-Stage Management Ltd',
								members: [
									{
										name: 'Charlotte Padgham Jr'
									}
								]
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Part One - Invasions and Independence 1842-1930',
				startDate: '2010-10-22',
				pressDate: '2010-10-25',
				endDate: '2010-11-07',
				material: {
					name: 'Part One - Invasions and Independence 1842-1930'
				},
				venue: {
					name: 'Roda Theatre'
				},
				subProductions: [
					{
						uuid: BUGLES_AT_THE_GATES_OF_JALALABAD_RODA_PRODUCTION_UUID
					},
					{
						uuid: DURANDS_LINE_RODA_PRODUCTION_UUID
					},
					{
						uuid: CAMPAIGN_RODA_PRODUCTION_UUID
					}
				],
				producerCredits: [
					{
						entities: [
							{
								name: 'Nicolas Kent'
							},
							{
								model: 'COMPANY',
								name: 'Mid-Tricycle Theatre Company',
								members: [
									{
										name: 'Zoë Ingenhaag'
									}
								]
							}
						]
					}
				],
				cast: [
					{
						name: 'Rick Warden',
						roles: [
							{
								name: 'Bar'
							}
						]
					}
				],
				creativeCredits: [
					{
						name: 'Mid-level Lighting Designers',
						entities: [
							{
								name: 'Howard Harrison'
							},
							{
								model: 'COMPANY',
								name: 'Mid-Lighting Design Ltd',
								members: [
									{
										name: 'Jack Knowles'
									}
								]
							}
						]
					}
				],
				crewCredits: [
					{
						name: 'Mid-level Stage Managers',
						entities: [
							{
								name: 'Lizzie Chapman'
							},
							{
								model: 'COMPANY',
								name: 'Mid-Stage Management Ltd',
								members: [
									{
										name: 'Charlotte Padgham'
									}
								]
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Black Tulips',
				startDate: '2010-10-22',
				pressDate: '2010-10-25',
				endDate: '2010-11-07',
				material: {
					name: 'Black Tulips'
				},
				venue: {
					name: 'Roda Theatre'
				},
				producerCredits: [
					{
						entities: [
							{
								name: 'Nicolas Kent Jr'
							},
							{
								model: 'COMPANY',
								name: 'Sub-Tricycle Theatre Company',
								members: [
									{
										name: 'Zoë Ingenhaag Jr'
									}
								]
							}
						]
					}
				],
				cast: [
					{
						name: 'Rick Warden Jr',
						roles: [
							{
								name: 'Bar Jr'
							}
						]
					}
				],
				creativeCredits: [
					{
						name: 'Junior Lighting Designers',
						entities: [
							{
								name: 'Howard Harrison Jr'
							},
							{
								model: 'COMPANY',
								name: 'Sub-Lighting Design Ltd',
								members: [
									{
										name: 'Jack Knowles Jr'
									}
								]
							}
						]
					}
				],
				crewCredits: [
					{
						name: 'Junior Stage Managers',
						entities: [
							{
								name: 'Lizzie Chapman Jr'
							},
							{
								model: 'COMPANY',
								name: 'Sub-Stage Management Ltd',
								members: [
									{
										name: 'Charlotte Padgham Jr'
									}
								]
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Blood and Gifts',
				startDate: '2010-10-22',
				pressDate: '2010-10-25',
				endDate: '2010-11-07',
				material: {
					name: 'Blood and Gifts'
				},
				venue: {
					name: 'Roda Theatre'
				},
				producerCredits: [
					{
						entities: [
							{
								name: 'Nicolas Kent Jr'
							},
							{
								model: 'COMPANY',
								name: 'Sub-Tricycle Theatre Company',
								members: [
									{
										name: 'Zoë Ingenhaag Jr'
									}
								]
							}
						]
					}
				],
				cast: [
					{
						name: 'Rick Warden Jr',
						roles: [
							{
								name: 'Bar Jr'
							}
						]
					}
				],
				creativeCredits: [
					{
						name: 'Junior Lighting Designers',
						entities: [
							{
								name: 'Howard Harrison Jr'
							},
							{
								model: 'COMPANY',
								name: 'Sub-Lighting Design Ltd',
								members: [
									{
										name: 'Jack Knowles Jr'
									}
								]
							}
						]
					}
				],
				crewCredits: [
					{
						name: 'Junior Stage Managers',
						entities: [
							{
								name: 'Lizzie Chapman Jr'
							},
							{
								model: 'COMPANY',
								name: 'Sub-Stage Management Ltd',
								members: [
									{
										name: 'Charlotte Padgham Jr'
									}
								]
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Miniskirts of Kabul',
				startDate: '2010-10-22',
				pressDate: '2010-10-25',
				endDate: '2010-11-07',
				material: {
					name: 'Miniskirts of Kabul'
				},
				venue: {
					name: 'Roda Theatre'
				},
				producerCredits: [
					{
						entities: [
							{
								name: 'Nicolas Kent Jr'
							},
							{
								model: 'COMPANY',
								name: 'Sub-Tricycle Theatre Company',
								members: [
									{
										name: 'Zoë Ingenhaag Jr'
									}
								]
							}
						]
					}
				],
				cast: [
					{
						name: 'Rick Warden Jr',
						roles: [
							{
								name: 'Bar Jr'
							}
						]
					}
				],
				creativeCredits: [
					{
						name: 'Junior Lighting Designers',
						entities: [
							{
								name: 'Howard Harrison Jr'
							},
							{
								model: 'COMPANY',
								name: 'Sub-Lighting Design Ltd',
								members: [
									{
										name: 'Jack Knowles Jr'
									}
								]
							}
						]
					}
				],
				crewCredits: [
					{
						name: 'Junior Stage Managers',
						entities: [
							{
								name: 'Lizzie Chapman Jr'
							},
							{
								model: 'COMPANY',
								name: 'Sub-Stage Management Ltd',
								members: [
									{
										name: 'Charlotte Padgham Jr'
									}
								]
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Part Two - Communism, the Mujahideen and the Taliban 1979-1996',
				startDate: '2010-10-22',
				pressDate: '2010-10-25',
				endDate: '2010-11-07',
				material: {
					name: 'Part Two - Communism, the Mujahideen and the Taliban 1979-1996'
				},
				venue: {
					name: 'Roda Theatre'
				},
				subProductions: [
					{
						uuid: BLACK_TULIPS_RODA_PRODUCTION_UUID
					},
					{
						uuid: BLOOD_AND_GIFTS_RODA_PRODUCTION_UUID
					},
					{
						uuid: MINISKIRTS_OF_KABUL_RODA_PRODUCTION_UUID
					}
				],
				producerCredits: [
					{
						entities: [
							{
								name: 'Nicolas Kent'
							},
							{
								model: 'COMPANY',
								name: 'Mid-Tricycle Theatre Company',
								members: [
									{
										name: 'Zoë Ingenhaag'
									}
								]
							}
						]
					}
				],
				cast: [
					{
						name: 'Rick Warden',
						roles: [
							{
								name: 'Bar'
							}
						]
					}
				],
				creativeCredits: [
					{
						name: 'Mid-level Lighting Designers',
						entities: [
							{
								name: 'Howard Harrison'
							},
							{
								model: 'COMPANY',
								name: 'Mid-Lighting Design Ltd',
								members: [
									{
										name: 'Jack Knowles'
									}
								]
							}
						]
					}
				],
				crewCredits: [
					{
						name: 'Mid-level Stage Managers',
						entities: [
							{
								name: 'Lizzie Chapman'
							},
							{
								model: 'COMPANY',
								name: 'Mid-Stage Management Ltd',
								members: [
									{
										name: 'Charlotte Padgham'
									}
								]
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Honey',
				startDate: '2010-10-22',
				pressDate: '2010-10-25',
				endDate: '2010-11-07',
				material: {
					name: 'Honey'
				},
				venue: {
					name: 'Roda Theatre'
				},
				producerCredits: [
					{
						entities: [
							{
								name: 'Nicolas Kent Jr'
							},
							{
								model: 'COMPANY',
								name: 'Sub-Tricycle Theatre Company',
								members: [
									{
										name: 'Zoë Ingenhaag Jr'
									}
								]
							}
						]
					}
				],
				cast: [
					{
						name: 'Rick Warden Jr',
						roles: [
							{
								name: 'Bar Jr'
							}
						]
					}
				],
				creativeCredits: [
					{
						name: 'Junior Lighting Designers',
						entities: [
							{
								name: 'Howard Harrison Jr'
							},
							{
								model: 'COMPANY',
								name: 'Sub-Lighting Design Ltd',
								members: [
									{
										name: 'Jack Knowles Jr'
									}
								]
							}
						]
					}
				],
				crewCredits: [
					{
						name: 'Junior Stage Managers',
						entities: [
							{
								name: 'Lizzie Chapman Jr'
							},
							{
								model: 'COMPANY',
								name: 'Sub-Stage Management Ltd',
								members: [
									{
										name: 'Charlotte Padgham Jr'
									}
								]
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'The Night Is Darkest Before the Dawn',
				startDate: '2010-10-22',
				pressDate: '2010-10-25',
				endDate: '2010-11-07',
				material: {
					name: 'The Night Is Darkest Before the Dawn'
				},
				venue: {
					name: 'Roda Theatre'
				},
				producerCredits: [
					{
						entities: [
							{
								name: 'Nicolas Kent Jr'
							},
							{
								model: 'COMPANY',
								name: 'Sub-Tricycle Theatre Company',
								members: [
									{
										name: 'Zoë Ingenhaag Jr'
									}
								]
							}
						]
					}
				],
				cast: [
					{
						name: 'Rick Warden Jr',
						roles: [
							{
								name: 'Bar Jr'
							}
						]
					}
				],
				creativeCredits: [
					{
						name: 'Junior Lighting Designers',
						entities: [
							{
								name: 'Howard Harrison Jr'
							},
							{
								model: 'COMPANY',
								name: 'Sub-Lighting Design Ltd',
								members: [
									{
										name: 'Jack Knowles Jr'
									}
								]
							}
						]
					}
				],
				crewCredits: [
					{
						name: 'Junior Stage Managers',
						entities: [
							{
								name: 'Lizzie Chapman Jr'
							},
							{
								model: 'COMPANY',
								name: 'Sub-Stage Management Ltd',
								members: [
									{
										name: 'Charlotte Padgham Jr'
									}
								]
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'On the Side of the Angels',
				startDate: '2010-10-22',
				pressDate: '2010-10-25',
				endDate: '2010-11-07',
				material: {
					name: 'On the Side of the Angels'
				},
				venue: {
					name: 'Roda Theatre'
				},
				producerCredits: [
					{
						entities: [
							{
								name: 'Nicolas Kent Jr'
							},
							{
								model: 'COMPANY',
								name: 'Sub-Tricycle Theatre Company',
								members: [
									{
										name: 'Zoë Ingenhaag Jr'
									}
								]
							}
						]
					}
				],
				cast: [
					{
						name: 'Rick Warden Jr',
						roles: [
							{
								name: 'Bar Jr'
							}
						]
					}
				],
				creativeCredits: [
					{
						name: 'Junior Lighting Designers',
						entities: [
							{
								name: 'Howard Harrison Jr'
							},
							{
								model: 'COMPANY',
								name: 'Sub-Lighting Design Ltd',
								members: [
									{
										name: 'Jack Knowles Jr'
									}
								]
							}
						]
					}
				],
				crewCredits: [
					{
						name: 'Junior Stage Managers',
						entities: [
							{
								name: 'Lizzie Chapman Jr'
							},
							{
								model: 'COMPANY',
								name: 'Sub-Stage Management Ltd',
								members: [
									{
										name: 'Charlotte Padgham Jr'
									}
								]
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Part Three - Enduring Freedom 1996-2009',
				startDate: '2010-10-22',
				pressDate: '2010-10-25',
				endDate: '2010-11-07',
				material: {
					name: 'Part Three - Enduring Freedom 1996-2009'
				},
				venue: {
					name: 'Roda Theatre'
				},
				subProductions: [
					{
						uuid: HONEY_RODA_PRODUCTION_UUID
					},
					{
						uuid: THE_NIGHT_IS_DARKEST_BEFORE_THE_DAWN_RODA_PRODUCTION_UUID
					},
					{
						uuid: ON_THE_SIDE_OF_THE_ANGELS_RODA_PRODUCTION_UUID
					}
				],
				producerCredits: [
					{
						entities: [
							{
								name: 'Nicolas Kent'
							},
							{
								model: 'COMPANY',
								name: 'Mid-Tricycle Theatre Company',
								members: [
									{
										name: 'Zoë Ingenhaag'
									}
								]
							}
						]
					}
				],
				cast: [
					{
						name: 'Rick Warden',
						roles: [
							{
								name: 'Bar'
							}
						]
					}
				],
				creativeCredits: [
					{
						name: 'Mid-level Lighting Designers',
						entities: [
							{
								name: 'Howard Harrison'
							},
							{
								model: 'COMPANY',
								name: 'Mid-Lighting Design Ltd',
								members: [
									{
										name: 'Jack Knowles'
									}
								]
							}
						]
					}
				],
				crewCredits: [
					{
						name: 'Mid-level Stage Managers',
						entities: [
							{
								name: 'Lizzie Chapman'
							},
							{
								model: 'COMPANY',
								name: 'Mid-Stage Management Ltd',
								members: [
									{
										name: 'Charlotte Padgham'
									}
								]
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'The Great Game: Afghanistan',
				startDate: '2010-10-22',
				pressDate: '2010-10-25',
				endDate: '2010-11-07',
				material: {
					name: 'The Great Game: Afghanistan'
				},
				venue: {
					name: 'Roda Theatre'
				},
				subProductions: [
					{
						uuid: PART_ONE_INVASIONS_AND_INDEPENDENCE_RODA_PRODUCTION_UUID
					},
					{
						uuid: PART_TWO_COMMUNISM_THE_MUJAHIDEEN_AND_THE_TALIBAN_RODA_PRODUCTION_UUID
					},
					{
						uuid: PART_THREE_ENDURING_FREEDOM_RODA_PRODUCTION_UUID
					}
				],
				producerCredits: [
					{
						entities: [
							{
								name: 'Nicolas Kent Sr'
							},
							{
								model: 'COMPANY',
								name: 'Sur-Tricycle Theatre Company',
								members: [
									{
										name: 'Zoë Ingenhaag Sr'
									}
								]
							}
						]
					}
				],
				cast: [
					{
						name: 'Rick Warden Sr',
						roles: [
							{
								name: 'Bar Sr'
							}
						]
					}
				],
				creativeCredits: [
					{
						name: 'Senior Lighting Designers',
						entities: [
							{
								name: 'Howard Harrison Sr'
							},
							{
								model: 'COMPANY',
								name: 'Sur-Lighting Design Ltd',
								members: [
									{
										name: 'Jack Knowles Sr'
									}
								]
							}
						]
					}
				],
				crewCredits: [
					{
						name: 'Senior Stage Managers',
						entities: [
							{
								name: 'Lizzie Chapman Sr'
							},
							{
								model: 'COMPANY',
								name: 'Sur-Stage Management Ltd',
								members: [
									{
										name: 'Charlotte Padgham Sr'
									}
								]
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Bugles at the Gates of Jalalabad',
				startDate: '2009-04-17',
				pressDate: '2009-04-24',
				endDate: '2009-06-14',
				material: {
					name: 'Bugles at the Gates of Jalalabad'
				},
				venue: {
					name: 'Tricycle Theatre'
				}
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Durand\'s Line',
				startDate: '2009-04-17',
				pressDate: '2009-04-24',
				endDate: '2009-06-14',
				material: {
					name: 'Durand\'s Line'
				},
				venue: {
					name: 'Tricycle Theatre'
				}
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Campaign',
				startDate: '2009-04-17',
				pressDate: '2009-04-24',
				endDate: '2009-06-14',
				material: {
					name: 'Campaign'
				},
				venue: {
					name: 'Tricycle Theatre'
				}
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Part One - Invasions and Independence 1842-1930',
				startDate: '2009-04-17',
				pressDate: '2009-04-24',
				endDate: '2009-06-14',
				material: {
					name: 'Part One - Invasions and Independence 1842-1930'
				},
				venue: {
					name: 'Tricycle Theatre'
				},
				subProductions: [
					{
						uuid: BUGLES_AT_THE_GATES_OF_JALALABAD_TRICYCLE_PRODUCTION_UUID
					},
					{
						uuid: DURANDS_LINE_TRICYCLE_PRODUCTION_UUID
					},
					{
						uuid: CAMPAIGN_TRICYCLE_PRODUCTION_UUID
					}
				]
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Black Tulips',
				startDate: '2009-04-17',
				pressDate: '2009-04-24',
				endDate: '2009-06-14',
				material: {
					name: 'Black Tulips'
				},
				venue: {
					name: 'Tricycle Theatre'
				}
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Blood and Gifts',
				startDate: '2009-04-17',
				pressDate: '2009-04-24',
				endDate: '2009-06-14',
				material: {
					name: 'Blood and Gifts'
				},
				venue: {
					name: 'Tricycle Theatre'
				}
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Miniskirts of Kabul',
				startDate: '2009-04-17',
				pressDate: '2009-04-24',
				endDate: '2009-06-14',
				material: {
					name: 'Miniskirts of Kabul'
				},
				venue: {
					name: 'Tricycle Theatre'
				}
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Part Two - Communism, the Mujahideen and the Taliban 1979-1996',
				startDate: '2009-04-17',
				pressDate: '2009-04-24',
				endDate: '2009-06-14',
				material: {
					name: 'Part Two - Communism, the Mujahideen and the Taliban 1979-1996'
				},
				venue: {
					name: 'Tricycle Theatre'
				},
				subProductions: [
					{
						uuid: BLACK_TULIPS_TRICYCLE_PRODUCTION_UUID
					},
					{
						uuid: BLOOD_AND_GIFTS_TRICYCLE_PRODUCTION_UUID
					},
					{
						uuid: MINISKIRTS_OF_KABUL_TRICYCLE_PRODUCTION_UUID
					}
				]
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Honey',
				startDate: '2009-04-17',
				pressDate: '2009-04-24',
				endDate: '2009-06-14',
				material: {
					name: 'Honey'
				},
				venue: {
					name: 'Tricycle Theatre'
				}
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'The Night Is Darkest Before the Dawn',
				startDate: '2009-04-17',
				pressDate: '2009-04-24',
				endDate: '2009-06-14',
				material: {
					name: 'The Night Is Darkest Before the Dawn'
				},
				venue: {
					name: 'Tricycle Theatre'
				}
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'On the Side of the Angels',
				startDate: '2009-04-17',
				pressDate: '2009-04-24',
				endDate: '2009-06-14',
				material: {
					name: 'On the Side of the Angels'
				},
				venue: {
					name: 'Tricycle Theatre'
				}
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Part Three - Enduring Freedom 1996-2009',
				startDate: '2009-04-17',
				pressDate: '2009-04-24',
				endDate: '2009-06-14',
				material: {
					name: 'Part Three - Enduring Freedom 1996-2009'
				},
				venue: {
					name: 'Tricycle Theatre'
				},
				subProductions: [
					{
						uuid: HONEY_TRICYCLE_PRODUCTION_UUID
					},
					{
						uuid: THE_NIGHT_IS_DARKEST_BEFORE_THE_DAWN_TRICYCLE_PRODUCTION_UUID
					},
					{
						uuid: ON_THE_SIDE_OF_THE_ANGELS_TRICYCLE_PRODUCTION_UUID
					}
				]
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'The Great Game: Afghanistan',
				startDate: '2009-04-17',
				pressDate: '2009-04-24',
				endDate: '2009-06-14',
				material: {
					name: 'The Great Game: Afghanistan'
				},
				venue: {
					name: 'Tricycle Theatre'
				},
				subProductions: [
					{
						uuid: PART_ONE_INVASIONS_AND_INDEPENDENCE_TRICYCLE_PRODUCTION_UUID
					},
					{
						uuid: PART_TWO_COMMUNISM_THE_MUJAHIDEEN_AND_THE_TALIBAN_TRICYCLE_PRODUCTION_UUID
					},
					{
						uuid: PART_THREE_ENDURING_FREEDOM_TRICYCLE_PRODUCTION_UUID
					}
				]
			});

		theGreatGameAfghanistanRodaProduction = await chai.request(app)
			.get(`/productions/${THE_GREAT_GAME_AFGHANISTAN_RODA_PRODUCTION_UUID}`);

		partOneInvasionsAndIndependenceRodaProduction = await chai.request(app)
			.get(`/productions/${PART_ONE_INVASIONS_AND_INDEPENDENCE_RODA_PRODUCTION_UUID}`);

		buglesAtTheGatesOfJalalabadRodaProduction = await chai.request(app)
			.get(`/productions/${BUGLES_AT_THE_GATES_OF_JALALABAD_RODA_PRODUCTION_UUID}`);

		theGreatGameAfghanistanTricycleProduction = await chai.request(app)
			.get(`/productions/${THE_GREAT_GAME_AFGHANISTAN_TRICYCLE_PRODUCTION_UUID}`);

		partOneInvasionsAndIndependenceTricycleProduction = await chai.request(app)
			.get(`/productions/${PART_ONE_INVASIONS_AND_INDEPENDENCE_TRICYCLE_PRODUCTION_UUID}`);

		buglesAtTheGatesOfJalalabadTricycleProduction = await chai.request(app)
			.get(`/productions/${BUGLES_AT_THE_GATES_OF_JALALABAD_TRICYCLE_PRODUCTION_UUID}`);

		theGreatGameAfghanistanMaterial = await chai.request(app)
			.get(`/materials/${THE_GREAT_GAME_AFGHANISTAN_MATERIAL_UUID}`);

		partOneInvasionsAndIndependenceMaterial = await chai.request(app)
			.get(`/materials/${PART_ONE_INVASIONS_AND_INDEPENDENCE_MATERIAL_UUID}`);

		buglesAtTheGatesOfJalalabadMaterial = await chai.request(app)
			.get(`/materials/${BUGLES_AT_THE_GATES_OF_JALALABAD_MATERIAL_UUID}`);

		berkeleyRepertoryTheatreVenue = await chai.request(app)
			.get(`/venues/${BERKELEY_REPERTORY_THEATRE_VENUE_UUID}`);

		rodaTheatreVenue = await chai.request(app)
			.get(`/venues/${RODA_THEATRE_VENUE_UUID}`);

		nicolasKentJrPerson = await chai.request(app)
			.get(`/people/${NICOLAS_KENT_JR_PERSON_UUID}`);

		subTricycleTheatreCompany = await chai.request(app)
			.get(`/companies/${SUB_TRICYCLE_THEATRE_COMPANY_UUID}`);

		zoëIngenhaagJrPerson = await chai.request(app)
			.get(`/people/${ZOË_INGENHAAG_JR_PERSON_UUID}`);

		rickWardenJrPerson = await chai.request(app)
			.get(`/people/${RICK_WARDEN_JR_PERSON_UUID}`);

		howardHarrisonJrPerson = await chai.request(app)
			.get(`/people/${HOWARD_HARRISON_JR_PERSON_UUID}`);

		subLightingDesignLtdCompany = await chai.request(app)
			.get(`/companies/${SUB_LIGHTING_DESIGN_LTD_COMPANY_UUID}`);

		jackKnowlesJrPerson = await chai.request(app)
			.get(`/people/${JACK_KNOWLES_JR_PERSON_UUID}`);

		lizzieChapmanJrPerson = await chai.request(app)
			.get(`/people/${LIZZIE_CHAPMAN_JR_PERSON_UUID}`);

		subStageManagementLtdCompany = await chai.request(app)
			.get(`/companies/${SUB_STAGE_MANAGEMENT_LTD_COMPANY_UUID}`);

		charlottePadghamJrPerson = await chai.request(app)
			.get(`/people/${CHARLOTTE_PADGHAM_JR_PERSON_UUID}`);

		barJrCharacter = await chai.request(app)
			.get(`/characters/${BAR_JR_CHARACTER_UUID}`);

	});

	after(() => {

		sandbox.restore();

	});

	describe('The Great Game: Afghanistan at Roda Theatre (production with sub-sub-productions that have a sur-venue)', () => {

		it('includes its sub-productions and sub-sub-productions', () => {

			const expectedSubProductions = [
				{
					model: 'PRODUCTION',
					uuid: PART_ONE_INVASIONS_AND_INDEPENDENCE_RODA_PRODUCTION_UUID,
					name: 'Part One - Invasions and Independence 1842-1930',
					startDate: '2010-10-22',
					pressDate: '2010-10-25',
					endDate: '2010-11-07',
					material: {
						model: 'MATERIAL',
						uuid: PART_ONE_INVASIONS_AND_INDEPENDENCE_MATERIAL_UUID,
						name: 'Part One - Invasions and Independence 1842-1930',
						format: 'sub-collection of plays',
						year: 2009,
						surMaterial: {
							model: 'MATERIAL',
							uuid: THE_GREAT_GAME_AFGHANISTAN_MATERIAL_UUID,
							name: 'The Great Game: Afghanistan',
							surMaterial: null
						},
						writingCredits: [
							{
								model: 'WRITING_CREDIT',
								name: 'by',
								entities: [
									{
										model: 'PERSON',
										uuid: FERDINAND_FOO_PERSON_UUID,
										name: 'Ferdinand Foo'
									},
									{
										model: 'COMPANY',
										uuid: MID_INKISTS_LTD_COMPANY_UUID,
										name: 'Mid-Inkists Ltd'
									}
								]
							}
						]
					},
					venue: {
						model: 'VENUE',
						uuid: RODA_THEATRE_VENUE_UUID,
						name: 'Roda Theatre',
						surVenue: {
							model: 'VENUE',
							uuid: BERKELEY_REPERTORY_THEATRE_VENUE_UUID,
							name: 'Berkeley Repertory Theatre'
						}
					},
					subProductions: [
						{
							model: 'PRODUCTION',
							uuid: BUGLES_AT_THE_GATES_OF_JALALABAD_RODA_PRODUCTION_UUID,
							name: 'Bugles at the Gates of Jalalabad',
							startDate: '2010-10-22',
							pressDate: '2010-10-25',
							endDate: '2010-11-07',
							material: {
								model: 'MATERIAL',
								uuid: BUGLES_AT_THE_GATES_OF_JALALABAD_MATERIAL_UUID,
								name: 'Bugles at the Gates of Jalalabad',
								format: 'play',
								year: 2009,
								surMaterial: {
									model: 'MATERIAL',
									uuid: PART_ONE_INVASIONS_AND_INDEPENDENCE_MATERIAL_UUID,
									name: 'Part One - Invasions and Independence 1842-1930',
									surMaterial: {
										model: 'MATERIAL',
										uuid: THE_GREAT_GAME_AFGHANISTAN_MATERIAL_UUID,
										name: 'The Great Game: Afghanistan'
									}
								},
								writingCredits: [
									{
										model: 'WRITING_CREDIT',
										name: 'by',
										entities: [
											{
												model: 'PERSON',
												uuid: FERDINAND_FOO_JR_PERSON_UUID,
												name: 'Ferdinand Foo Jr'
											},
											{
												model: 'COMPANY',
												uuid: SUB_INKISTS_LTD_COMPANY_UUID,
												name: 'Sub-Inkists Ltd'
											}
										]
									}
								]
							},
							venue: {
								model: 'VENUE',
								uuid: RODA_THEATRE_VENUE_UUID,
								name: 'Roda Theatre',
								surVenue: {
									model: 'VENUE',
									uuid: BERKELEY_REPERTORY_THEATRE_VENUE_UUID,
									name: 'Berkeley Repertory Theatre'
								}
							},
							producerCredits: [
								{
									model: 'PRODUCER_CREDIT',
									name: 'produced by',
									entities: [
										{
											model: 'PERSON',
											uuid: NICOLAS_KENT_JR_PERSON_UUID,
											name: 'Nicolas Kent Jr'
										},
										{
											model: 'COMPANY',
											uuid: SUB_TRICYCLE_THEATRE_COMPANY_UUID,
											name: 'Sub-Tricycle Theatre Company',
											members: [
												{
													model: 'PERSON',
													uuid: ZOË_INGENHAAG_JR_PERSON_UUID,
													name: 'Zoë Ingenhaag Jr'
												}
											]
										}
									]
								}
							],
							cast: [
								{
									model: 'PERSON',
									uuid: RICK_WARDEN_JR_PERSON_UUID,
									name: 'Rick Warden Jr',
									roles: [
										{
											model: 'CHARACTER',
											uuid: BAR_JR_CHARACTER_UUID,
											name: 'Bar Jr',
											qualifier: null,
											isAlternate: false
										}
									]
								}
							],
							creativeCredits: [
								{
									model: 'CREATIVE_CREDIT',
									name: 'Junior Lighting Designers',
									entities: [
										{
											model: 'PERSON',
											uuid: HOWARD_HARRISON_JR_PERSON_UUID,
											name: 'Howard Harrison Jr'
										},
										{
											model: 'COMPANY',
											uuid: SUB_LIGHTING_DESIGN_LTD_COMPANY_UUID,
											name: 'Sub-Lighting Design Ltd',
											members: [
												{
													model: 'PERSON',
													uuid: JACK_KNOWLES_JR_PERSON_UUID,
													name: 'Jack Knowles Jr'
												}
											]
										}
									]
								}
							],
							crewCredits: [
								{
									model: 'CREW_CREDIT',
									name: 'Junior Stage Managers',
									entities: [
										{
											model: 'PERSON',
											uuid: LIZZIE_CHAPMAN_JR_PERSON_UUID,
											name: 'Lizzie Chapman Jr'
										},
										{
											model: 'COMPANY',
											uuid: SUB_STAGE_MANAGEMENT_LTD_COMPANY_UUID,
											name: 'Sub-Stage Management Ltd',
											members: [
												{
													model: 'PERSON',
													uuid: CHARLOTTE_PADGHAM_JR_PERSON_UUID,
													name: 'Charlotte Padgham Jr'
												}
											]
										}
									]
								}
							]
						},
						{
							model: 'PRODUCTION',
							uuid: DURANDS_LINE_RODA_PRODUCTION_UUID,
							name: 'Durand\'s Line',
							startDate: '2010-10-22',
							pressDate: '2010-10-25',
							endDate: '2010-11-07',
							material: {
								model: 'MATERIAL',
								uuid: DURANDS_LINE_MATERIAL_UUID,
								name: 'Durand\'s Line',
								format: 'play',
								year: 2009,
								surMaterial: {
									model: 'MATERIAL',
									uuid: PART_ONE_INVASIONS_AND_INDEPENDENCE_MATERIAL_UUID,
									name: 'Part One - Invasions and Independence 1842-1930',
									surMaterial: {
										model: 'MATERIAL',
										uuid: THE_GREAT_GAME_AFGHANISTAN_MATERIAL_UUID,
										name: 'The Great Game: Afghanistan'
									}
								},
								writingCredits: [
									{
										model: 'WRITING_CREDIT',
										name: 'by',
										entities: [
											{
												model: 'PERSON',
												uuid: FERDINAND_FOO_JR_PERSON_UUID,
												name: 'Ferdinand Foo Jr'
											},
											{
												model: 'COMPANY',
												uuid: SUB_INKISTS_LTD_COMPANY_UUID,
												name: 'Sub-Inkists Ltd'
											}
										]
									}
								]
							},
							venue: {
								model: 'VENUE',
								uuid: RODA_THEATRE_VENUE_UUID,
								name: 'Roda Theatre',
								surVenue: {
									model: 'VENUE',
									uuid: BERKELEY_REPERTORY_THEATRE_VENUE_UUID,
									name: 'Berkeley Repertory Theatre'
								}
							},
							producerCredits: [
								{
									model: 'PRODUCER_CREDIT',
									name: 'produced by',
									entities: [
										{
											model: 'PERSON',
											uuid: NICOLAS_KENT_JR_PERSON_UUID,
											name: 'Nicolas Kent Jr'
										},
										{
											model: 'COMPANY',
											uuid: SUB_TRICYCLE_THEATRE_COMPANY_UUID,
											name: 'Sub-Tricycle Theatre Company',
											members: [
												{
													model: 'PERSON',
													uuid: ZOË_INGENHAAG_JR_PERSON_UUID,
													name: 'Zoë Ingenhaag Jr'
												}
											]
										}
									]
								}
							],
							cast: [
								{
									model: 'PERSON',
									uuid: RICK_WARDEN_JR_PERSON_UUID,
									name: 'Rick Warden Jr',
									roles: [
										{
											model: 'CHARACTER',
											uuid: BAR_JR_CHARACTER_UUID,
											name: 'Bar Jr',
											qualifier: null,
											isAlternate: false
										}
									]
								}
							],
							creativeCredits: [
								{
									model: 'CREATIVE_CREDIT',
									name: 'Junior Lighting Designers',
									entities: [
										{
											model: 'PERSON',
											uuid: HOWARD_HARRISON_JR_PERSON_UUID,
											name: 'Howard Harrison Jr'
										},
										{
											model: 'COMPANY',
											uuid: SUB_LIGHTING_DESIGN_LTD_COMPANY_UUID,
											name: 'Sub-Lighting Design Ltd',
											members: [
												{
													model: 'PERSON',
													uuid: JACK_KNOWLES_JR_PERSON_UUID,
													name: 'Jack Knowles Jr'
												}
											]
										}
									]
								}
							],
							crewCredits: [
								{
									model: 'CREW_CREDIT',
									name: 'Junior Stage Managers',
									entities: [
										{
											model: 'PERSON',
											uuid: LIZZIE_CHAPMAN_JR_PERSON_UUID,
											name: 'Lizzie Chapman Jr'
										},
										{
											model: 'COMPANY',
											uuid: SUB_STAGE_MANAGEMENT_LTD_COMPANY_UUID,
											name: 'Sub-Stage Management Ltd',
											members: [
												{
													model: 'PERSON',
													uuid: CHARLOTTE_PADGHAM_JR_PERSON_UUID,
													name: 'Charlotte Padgham Jr'
												}
											]
										}
									]
								}
							]
						},
						{
							model: 'PRODUCTION',
							uuid: CAMPAIGN_RODA_PRODUCTION_UUID,
							name: 'Campaign',
							startDate: '2010-10-22',
							pressDate: '2010-10-25',
							endDate: '2010-11-07',
							material: {
								model: 'MATERIAL',
								uuid: CAMPAIGN_MATERIAL_UUID,
								name: 'Campaign',
								format: 'play',
								year: 2009,
								surMaterial: {
									model: 'MATERIAL',
									uuid: PART_ONE_INVASIONS_AND_INDEPENDENCE_MATERIAL_UUID,
									name: 'Part One - Invasions and Independence 1842-1930',
									surMaterial: {
										model: 'MATERIAL',
										uuid: THE_GREAT_GAME_AFGHANISTAN_MATERIAL_UUID,
										name: 'The Great Game: Afghanistan'
									}
								},
								writingCredits: [
									{
										model: 'WRITING_CREDIT',
										name: 'by',
										entities: [
											{
												model: 'PERSON',
												uuid: FERDINAND_FOO_JR_PERSON_UUID,
												name: 'Ferdinand Foo Jr'
											},
											{
												model: 'COMPANY',
												uuid: SUB_INKISTS_LTD_COMPANY_UUID,
												name: 'Sub-Inkists Ltd'
											}
										]
									}
								]
							},
							venue: {
								model: 'VENUE',
								uuid: RODA_THEATRE_VENUE_UUID,
								name: 'Roda Theatre',
								surVenue: {
									model: 'VENUE',
									uuid: BERKELEY_REPERTORY_THEATRE_VENUE_UUID,
									name: 'Berkeley Repertory Theatre'
								}
							},
							producerCredits: [
								{
									model: 'PRODUCER_CREDIT',
									name: 'produced by',
									entities: [
										{
											model: 'PERSON',
											uuid: NICOLAS_KENT_JR_PERSON_UUID,
											name: 'Nicolas Kent Jr'
										},
										{
											model: 'COMPANY',
											uuid: SUB_TRICYCLE_THEATRE_COMPANY_UUID,
											name: 'Sub-Tricycle Theatre Company',
											members: [
												{
													model: 'PERSON',
													uuid: ZOË_INGENHAAG_JR_PERSON_UUID,
													name: 'Zoë Ingenhaag Jr'
												}
											]
										}
									]
								}
							],
							cast: [
								{
									model: 'PERSON',
									uuid: RICK_WARDEN_JR_PERSON_UUID,
									name: 'Rick Warden Jr',
									roles: [
										{
											model: 'CHARACTER',
											uuid: BAR_JR_CHARACTER_UUID,
											name: 'Bar Jr',
											qualifier: null,
											isAlternate: false
										}
									]
								}
							],
							creativeCredits: [
								{
									model: 'CREATIVE_CREDIT',
									name: 'Junior Lighting Designers',
									entities: [
										{
											model: 'PERSON',
											uuid: HOWARD_HARRISON_JR_PERSON_UUID,
											name: 'Howard Harrison Jr'
										},
										{
											model: 'COMPANY',
											uuid: SUB_LIGHTING_DESIGN_LTD_COMPANY_UUID,
											name: 'Sub-Lighting Design Ltd',
											members: [
												{
													model: 'PERSON',
													uuid: JACK_KNOWLES_JR_PERSON_UUID,
													name: 'Jack Knowles Jr'
												}
											]
										}
									]
								}
							],
							crewCredits: [
								{
									model: 'CREW_CREDIT',
									name: 'Junior Stage Managers',
									entities: [
										{
											model: 'PERSON',
											uuid: LIZZIE_CHAPMAN_JR_PERSON_UUID,
											name: 'Lizzie Chapman Jr'
										},
										{
											model: 'COMPANY',
											uuid: SUB_STAGE_MANAGEMENT_LTD_COMPANY_UUID,
											name: 'Sub-Stage Management Ltd',
											members: [
												{
													model: 'PERSON',
													uuid: CHARLOTTE_PADGHAM_JR_PERSON_UUID,
													name: 'Charlotte Padgham Jr'
												}
											]
										}
									]
								}
							]
						}
					],
					producerCredits: [
						{
							model: 'PRODUCER_CREDIT',
							name: 'produced by',
							entities: [
								{
									model: 'PERSON',
									uuid: NICOLAS_KENT_PERSON_UUID,
									name: 'Nicolas Kent'
								},
								{
									model: 'COMPANY',
									uuid: MID_TRICYCLE_THEATRE_COMPANY_UUID,
									name: 'Mid-Tricycle Theatre Company',
									members: [
										{
											model: 'PERSON',
											uuid: ZOË_INGENHAAG_PERSON_UUID,
											name: 'Zoë Ingenhaag'
										}
									]
								}
							]
						}
					],
					cast: [
						{
							model: 'PERSON',
							uuid: RICK_WARDEN_PERSON_UUID,
							name: 'Rick Warden',
							roles: [
								{
									model: 'CHARACTER',
									uuid: BAR_CHARACTER_UUID,
									name: 'Bar',
									qualifier: null,
									isAlternate: false
								}
							]
						}
					],
					creativeCredits: [
						{
							model: 'CREATIVE_CREDIT',
							name: 'Mid-level Lighting Designers',
							entities: [
								{
									model: 'PERSON',
									uuid: HOWARD_HARRISON_PERSON_UUID,
									name: 'Howard Harrison'
								},
								{
									model: 'COMPANY',
									uuid: MID_LIGHTING_DESIGN_LTD_COMPANY_UUID,
									name: 'Mid-Lighting Design Ltd',
									members: [
										{
											model: 'PERSON',
											uuid: JACK_KNOWLES_PERSON_UUID,
											name: 'Jack Knowles'
										}
									]
								}
							]
						}
					],
					crewCredits: [
						{
							model: 'CREW_CREDIT',
							name: 'Mid-level Stage Managers',
							entities: [
								{
									model: 'PERSON',
									uuid: LIZZIE_CHAPMAN_PERSON_UUID,
									name: 'Lizzie Chapman'
								},
								{
									model: 'COMPANY',
									uuid: MID_STAGE_MANAGEMENT_LTD_COMPANY_UUID,
									name: 'Mid-Stage Management Ltd',
									members: [
										{
											model: 'PERSON',
											uuid: CHARLOTTE_PADGHAM_PERSON_UUID,
											name: 'Charlotte Padgham'
										}
									]
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: PART_TWO_COMMUNISM_THE_MUJAHIDEEN_AND_THE_TALIBAN_RODA_PRODUCTION_UUID,
					name: 'Part Two - Communism, the Mujahideen and the Taliban 1979-1996',
					startDate: '2010-10-22',
					pressDate: '2010-10-25',
					endDate: '2010-11-07',
					material: {
						model: 'MATERIAL',
						uuid: PART_TWO_COMMUNISM_THE_MUJAHIDEEN_AND_THE_TALIBAN_MATERIAL_UUID,
						name: 'Part Two - Communism, the Mujahideen and the Taliban 1979-1996',
						format: 'sub-collection of plays',
						year: 2009,
						surMaterial: {
							model: 'MATERIAL',
							uuid: THE_GREAT_GAME_AFGHANISTAN_MATERIAL_UUID,
							name: 'The Great Game: Afghanistan',
							surMaterial: null
						},
						writingCredits: [
							{
								model: 'WRITING_CREDIT',
								name: 'by',
								entities: [
									{
										model: 'PERSON',
										uuid: FERDINAND_FOO_PERSON_UUID,
										name: 'Ferdinand Foo'
									},
									{
										model: 'COMPANY',
										uuid: MID_INKISTS_LTD_COMPANY_UUID,
										name: 'Mid-Inkists Ltd'
									}
								]
							}
						]
					},
					venue: {
						model: 'VENUE',
						uuid: RODA_THEATRE_VENUE_UUID,
						name: 'Roda Theatre',
						surVenue: {
							model: 'VENUE',
							uuid: BERKELEY_REPERTORY_THEATRE_VENUE_UUID,
							name: 'Berkeley Repertory Theatre'
						}
					},
					subProductions: [
						{
							model: 'PRODUCTION',
							uuid: BLACK_TULIPS_RODA_PRODUCTION_UUID,
							name: 'Black Tulips',
							startDate: '2010-10-22',
							pressDate: '2010-10-25',
							endDate: '2010-11-07',
							material: {
								model: 'MATERIAL',
								uuid: BLACK_TULIPS_MATERIAL_UUID,
								name: 'Black Tulips',
								format: 'play',
								year: 2009,
								surMaterial: {
									model: 'MATERIAL',
									uuid: PART_TWO_COMMUNISM_THE_MUJAHIDEEN_AND_THE_TALIBAN_MATERIAL_UUID,
									name: 'Part Two - Communism, the Mujahideen and the Taliban 1979-1996',
									surMaterial: {
										model: 'MATERIAL',
										uuid: THE_GREAT_GAME_AFGHANISTAN_MATERIAL_UUID,
										name: 'The Great Game: Afghanistan'
									}
								},
								writingCredits: [
									{
										model: 'WRITING_CREDIT',
										name: 'by',
										entities: [
											{
												model: 'PERSON',
												uuid: FERDINAND_FOO_JR_PERSON_UUID,
												name: 'Ferdinand Foo Jr'
											},
											{
												model: 'COMPANY',
												uuid: SUB_INKISTS_LTD_COMPANY_UUID,
												name: 'Sub-Inkists Ltd'
											}
										]
									}
								]
							},
							venue: {
								model: 'VENUE',
								uuid: RODA_THEATRE_VENUE_UUID,
								name: 'Roda Theatre',
								surVenue: {
									model: 'VENUE',
									uuid: BERKELEY_REPERTORY_THEATRE_VENUE_UUID,
									name: 'Berkeley Repertory Theatre'
								}
							},
							producerCredits: [
								{
									model: 'PRODUCER_CREDIT',
									name: 'produced by',
									entities: [
										{
											model: 'PERSON',
											uuid: NICOLAS_KENT_JR_PERSON_UUID,
											name: 'Nicolas Kent Jr'
										},
										{
											model: 'COMPANY',
											uuid: SUB_TRICYCLE_THEATRE_COMPANY_UUID,
											name: 'Sub-Tricycle Theatre Company',
											members: [
												{
													model: 'PERSON',
													uuid: ZOË_INGENHAAG_JR_PERSON_UUID,
													name: 'Zoë Ingenhaag Jr'
												}
											]
										}
									]
								}
							],
							cast: [
								{
									model: 'PERSON',
									uuid: RICK_WARDEN_JR_PERSON_UUID,
									name: 'Rick Warden Jr',
									roles: [
										{
											model: 'CHARACTER',
											uuid: BAR_JR_CHARACTER_UUID,
											name: 'Bar Jr',
											qualifier: null,
											isAlternate: false
										}
									]
								}
							],
							creativeCredits: [
								{
									model: 'CREATIVE_CREDIT',
									name: 'Junior Lighting Designers',
									entities: [
										{
											model: 'PERSON',
											uuid: HOWARD_HARRISON_JR_PERSON_UUID,
											name: 'Howard Harrison Jr'
										},
										{
											model: 'COMPANY',
											uuid: SUB_LIGHTING_DESIGN_LTD_COMPANY_UUID,
											name: 'Sub-Lighting Design Ltd',
											members: [
												{
													model: 'PERSON',
													uuid: JACK_KNOWLES_JR_PERSON_UUID,
													name: 'Jack Knowles Jr'
												}
											]
										}
									]
								}
							],
							crewCredits: [
								{
									model: 'CREW_CREDIT',
									name: 'Junior Stage Managers',
									entities: [
										{
											model: 'PERSON',
											uuid: LIZZIE_CHAPMAN_JR_PERSON_UUID,
											name: 'Lizzie Chapman Jr'
										},
										{
											model: 'COMPANY',
											uuid: SUB_STAGE_MANAGEMENT_LTD_COMPANY_UUID,
											name: 'Sub-Stage Management Ltd',
											members: [
												{
													model: 'PERSON',
													uuid: CHARLOTTE_PADGHAM_JR_PERSON_UUID,
													name: 'Charlotte Padgham Jr'
												}
											]
										}
									]
								}
							]
						},
						{
							model: 'PRODUCTION',
							uuid: BLOOD_AND_GIFTS_RODA_PRODUCTION_UUID,
							name: 'Blood and Gifts',
							startDate: '2010-10-22',
							pressDate: '2010-10-25',
							endDate: '2010-11-07',
							material: {
								model: 'MATERIAL',
								uuid: BLOOD_AND_GIFTS_MATERIAL_UUID,
								name: 'Blood and Gifts',
								format: 'play',
								year: 2009,
								surMaterial: {
									model: 'MATERIAL',
									uuid: PART_TWO_COMMUNISM_THE_MUJAHIDEEN_AND_THE_TALIBAN_MATERIAL_UUID,
									name: 'Part Two - Communism, the Mujahideen and the Taliban 1979-1996',
									surMaterial: {
										model: 'MATERIAL',
										uuid: THE_GREAT_GAME_AFGHANISTAN_MATERIAL_UUID,
										name: 'The Great Game: Afghanistan'
									}
								},
								writingCredits: [
									{
										model: 'WRITING_CREDIT',
										name: 'by',
										entities: [
											{
												model: 'PERSON',
												uuid: FERDINAND_FOO_JR_PERSON_UUID,
												name: 'Ferdinand Foo Jr'
											},
											{
												model: 'COMPANY',
												uuid: SUB_INKISTS_LTD_COMPANY_UUID,
												name: 'Sub-Inkists Ltd'
											}
										]
									}
								]
							},
							venue: {
								model: 'VENUE',
								uuid: RODA_THEATRE_VENUE_UUID,
								name: 'Roda Theatre',
								surVenue: {
									model: 'VENUE',
									uuid: BERKELEY_REPERTORY_THEATRE_VENUE_UUID,
									name: 'Berkeley Repertory Theatre'
								}
							},
							producerCredits: [
								{
									model: 'PRODUCER_CREDIT',
									name: 'produced by',
									entities: [
										{
											model: 'PERSON',
											uuid: NICOLAS_KENT_JR_PERSON_UUID,
											name: 'Nicolas Kent Jr'
										},
										{
											model: 'COMPANY',
											uuid: SUB_TRICYCLE_THEATRE_COMPANY_UUID,
											name: 'Sub-Tricycle Theatre Company',
											members: [
												{
													model: 'PERSON',
													uuid: ZOË_INGENHAAG_JR_PERSON_UUID,
													name: 'Zoë Ingenhaag Jr'
												}
											]
										}
									]
								}
							],
							cast: [
								{
									model: 'PERSON',
									uuid: RICK_WARDEN_JR_PERSON_UUID,
									name: 'Rick Warden Jr',
									roles: [
										{
											model: 'CHARACTER',
											uuid: BAR_JR_CHARACTER_UUID,
											name: 'Bar Jr',
											qualifier: null,
											isAlternate: false
										}
									]
								}
							],
							creativeCredits: [
								{
									model: 'CREATIVE_CREDIT',
									name: 'Junior Lighting Designers',
									entities: [
										{
											model: 'PERSON',
											uuid: HOWARD_HARRISON_JR_PERSON_UUID,
											name: 'Howard Harrison Jr'
										},
										{
											model: 'COMPANY',
											uuid: SUB_LIGHTING_DESIGN_LTD_COMPANY_UUID,
											name: 'Sub-Lighting Design Ltd',
											members: [
												{
													model: 'PERSON',
													uuid: JACK_KNOWLES_JR_PERSON_UUID,
													name: 'Jack Knowles Jr'
												}
											]
										}
									]
								}
							],
							crewCredits: [
								{
									model: 'CREW_CREDIT',
									name: 'Junior Stage Managers',
									entities: [
										{
											model: 'PERSON',
											uuid: LIZZIE_CHAPMAN_JR_PERSON_UUID,
											name: 'Lizzie Chapman Jr'
										},
										{
											model: 'COMPANY',
											uuid: SUB_STAGE_MANAGEMENT_LTD_COMPANY_UUID,
											name: 'Sub-Stage Management Ltd',
											members: [
												{
													model: 'PERSON',
													uuid: CHARLOTTE_PADGHAM_JR_PERSON_UUID,
													name: 'Charlotte Padgham Jr'
												}
											]
										}
									]
								}
							]
						},
						{
							model: 'PRODUCTION',
							uuid: MINISKIRTS_OF_KABUL_RODA_PRODUCTION_UUID,
							name: 'Miniskirts of Kabul',
							startDate: '2010-10-22',
							pressDate: '2010-10-25',
							endDate: '2010-11-07',
							material: {
								model: 'MATERIAL',
								uuid: MINISKIRTS_OF_KABUL_MATERIAL_UUID,
								name: 'Miniskirts of Kabul',
								format: 'play',
								year: 2009,
								surMaterial: {
									model: 'MATERIAL',
									uuid: PART_TWO_COMMUNISM_THE_MUJAHIDEEN_AND_THE_TALIBAN_MATERIAL_UUID,
									name: 'Part Two - Communism, the Mujahideen and the Taliban 1979-1996',
									surMaterial: {
										model: 'MATERIAL',
										uuid: THE_GREAT_GAME_AFGHANISTAN_MATERIAL_UUID,
										name: 'The Great Game: Afghanistan'
									}
								},
								writingCredits: [
									{
										model: 'WRITING_CREDIT',
										name: 'by',
										entities: [
											{
												model: 'PERSON',
												uuid: FERDINAND_FOO_JR_PERSON_UUID,
												name: 'Ferdinand Foo Jr'
											},
											{
												model: 'COMPANY',
												uuid: SUB_INKISTS_LTD_COMPANY_UUID,
												name: 'Sub-Inkists Ltd'
											}
										]
									}
								]
							},
							venue: {
								model: 'VENUE',
								uuid: RODA_THEATRE_VENUE_UUID,
								name: 'Roda Theatre',
								surVenue: {
									model: 'VENUE',
									uuid: BERKELEY_REPERTORY_THEATRE_VENUE_UUID,
									name: 'Berkeley Repertory Theatre'
								}
							},
							producerCredits: [
								{
									model: 'PRODUCER_CREDIT',
									name: 'produced by',
									entities: [
										{
											model: 'PERSON',
											uuid: NICOLAS_KENT_JR_PERSON_UUID,
											name: 'Nicolas Kent Jr'
										},
										{
											model: 'COMPANY',
											uuid: SUB_TRICYCLE_THEATRE_COMPANY_UUID,
											name: 'Sub-Tricycle Theatre Company',
											members: [
												{
													model: 'PERSON',
													uuid: ZOË_INGENHAAG_JR_PERSON_UUID,
													name: 'Zoë Ingenhaag Jr'
												}
											]
										}
									]
								}
							],
							cast: [
								{
									model: 'PERSON',
									uuid: RICK_WARDEN_JR_PERSON_UUID,
									name: 'Rick Warden Jr',
									roles: [
										{
											model: 'CHARACTER',
											uuid: BAR_JR_CHARACTER_UUID,
											name: 'Bar Jr',
											qualifier: null,
											isAlternate: false
										}
									]
								}
							],
							creativeCredits: [
								{
									model: 'CREATIVE_CREDIT',
									name: 'Junior Lighting Designers',
									entities: [
										{
											model: 'PERSON',
											uuid: HOWARD_HARRISON_JR_PERSON_UUID,
											name: 'Howard Harrison Jr'
										},
										{
											model: 'COMPANY',
											uuid: SUB_LIGHTING_DESIGN_LTD_COMPANY_UUID,
											name: 'Sub-Lighting Design Ltd',
											members: [
												{
													model: 'PERSON',
													uuid: JACK_KNOWLES_JR_PERSON_UUID,
													name: 'Jack Knowles Jr'
												}
											]
										}
									]
								}
							],
							crewCredits: [
								{
									model: 'CREW_CREDIT',
									name: 'Junior Stage Managers',
									entities: [
										{
											model: 'PERSON',
											uuid: LIZZIE_CHAPMAN_JR_PERSON_UUID,
											name: 'Lizzie Chapman Jr'
										},
										{
											model: 'COMPANY',
											uuid: SUB_STAGE_MANAGEMENT_LTD_COMPANY_UUID,
											name: 'Sub-Stage Management Ltd',
											members: [
												{
													model: 'PERSON',
													uuid: CHARLOTTE_PADGHAM_JR_PERSON_UUID,
													name: 'Charlotte Padgham Jr'
												}
											]
										}
									]
								}
							]
						}
					],
					producerCredits: [
						{
							model: 'PRODUCER_CREDIT',
							name: 'produced by',
							entities: [
								{
									model: 'PERSON',
									uuid: NICOLAS_KENT_PERSON_UUID,
									name: 'Nicolas Kent'
								},
								{
									model: 'COMPANY',
									uuid: MID_TRICYCLE_THEATRE_COMPANY_UUID,
									name: 'Mid-Tricycle Theatre Company',
									members: [
										{
											model: 'PERSON',
											uuid: ZOË_INGENHAAG_PERSON_UUID,
											name: 'Zoë Ingenhaag'
										}
									]
								}
							]
						}
					],
					cast: [
						{
							model: 'PERSON',
							uuid: RICK_WARDEN_PERSON_UUID,
							name: 'Rick Warden',
							roles: [
								{
									model: 'CHARACTER',
									uuid: BAR_CHARACTER_UUID,
									name: 'Bar',
									qualifier: null,
									isAlternate: false
								}
							]
						}
					],
					creativeCredits: [
						{
							model: 'CREATIVE_CREDIT',
							name: 'Mid-level Lighting Designers',
							entities: [
								{
									model: 'PERSON',
									uuid: HOWARD_HARRISON_PERSON_UUID,
									name: 'Howard Harrison'
								},
								{
									model: 'COMPANY',
									uuid: MID_LIGHTING_DESIGN_LTD_COMPANY_UUID,
									name: 'Mid-Lighting Design Ltd',
									members: [
										{
											model: 'PERSON',
											uuid: JACK_KNOWLES_PERSON_UUID,
											name: 'Jack Knowles'
										}
									]
								}
							]
						}
					],
					crewCredits: [
						{
							model: 'CREW_CREDIT',
							name: 'Mid-level Stage Managers',
							entities: [
								{
									model: 'PERSON',
									uuid: LIZZIE_CHAPMAN_PERSON_UUID,
									name: 'Lizzie Chapman'
								},
								{
									model: 'COMPANY',
									uuid: MID_STAGE_MANAGEMENT_LTD_COMPANY_UUID,
									name: 'Mid-Stage Management Ltd',
									members: [
										{
											model: 'PERSON',
											uuid: CHARLOTTE_PADGHAM_PERSON_UUID,
											name: 'Charlotte Padgham'
										}
									]
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: PART_THREE_ENDURING_FREEDOM_RODA_PRODUCTION_UUID,
					name: 'Part Three - Enduring Freedom 1996-2009',
					startDate: '2010-10-22',
					pressDate: '2010-10-25',
					endDate: '2010-11-07',
					material: {
						model: 'MATERIAL',
						uuid: PART_THREE_ENDURING_FREEDOM_MATERIAL_UUID,
						name: 'Part Three - Enduring Freedom 1996-2009',
						format: 'sub-collection of plays',
						year: 2009,
						surMaterial: {
							model: 'MATERIAL',
							uuid: THE_GREAT_GAME_AFGHANISTAN_MATERIAL_UUID,
							name: 'The Great Game: Afghanistan',
							surMaterial: null
						},
						writingCredits: [
							{
								model: 'WRITING_CREDIT',
								name: 'by',
								entities: [
									{
										model: 'PERSON',
										uuid: FERDINAND_FOO_PERSON_UUID,
										name: 'Ferdinand Foo'
									},
									{
										model: 'COMPANY',
										uuid: MID_INKISTS_LTD_COMPANY_UUID,
										name: 'Mid-Inkists Ltd'
									}
								]
							}
						]
					},
					venue: {
						model: 'VENUE',
						uuid: RODA_THEATRE_VENUE_UUID,
						name: 'Roda Theatre',
						surVenue: {
							model: 'VENUE',
							uuid: BERKELEY_REPERTORY_THEATRE_VENUE_UUID,
							name: 'Berkeley Repertory Theatre'
						}
					},
					subProductions: [
						{
							model: 'PRODUCTION',
							uuid: HONEY_RODA_PRODUCTION_UUID,
							name: 'Honey',
							startDate: '2010-10-22',
							pressDate: '2010-10-25',
							endDate: '2010-11-07',
							material: {
								model: 'MATERIAL',
								uuid: HONEY_MATERIAL_UUID,
								name: 'Honey',
								format: 'play',
								year: 2009,
								surMaterial: {
									model: 'MATERIAL',
									uuid: PART_THREE_ENDURING_FREEDOM_MATERIAL_UUID,
									name: 'Part Three - Enduring Freedom 1996-2009',
									surMaterial: {
										model: 'MATERIAL',
										uuid: THE_GREAT_GAME_AFGHANISTAN_MATERIAL_UUID,
										name: 'The Great Game: Afghanistan'
									}
								},
								writingCredits: [
									{
										model: 'WRITING_CREDIT',
										name: 'by',
										entities: [
											{
												model: 'PERSON',
												uuid: FERDINAND_FOO_JR_PERSON_UUID,
												name: 'Ferdinand Foo Jr'
											},
											{
												model: 'COMPANY',
												uuid: SUB_INKISTS_LTD_COMPANY_UUID,
												name: 'Sub-Inkists Ltd'
											}
										]
									}
								]
							},
							venue: {
								model: 'VENUE',
								uuid: RODA_THEATRE_VENUE_UUID,
								name: 'Roda Theatre',
								surVenue: {
									model: 'VENUE',
									uuid: BERKELEY_REPERTORY_THEATRE_VENUE_UUID,
									name: 'Berkeley Repertory Theatre'
								}
							},
							producerCredits: [
								{
									model: 'PRODUCER_CREDIT',
									name: 'produced by',
									entities: [
										{
											model: 'PERSON',
											uuid: NICOLAS_KENT_JR_PERSON_UUID,
											name: 'Nicolas Kent Jr'
										},
										{
											model: 'COMPANY',
											uuid: SUB_TRICYCLE_THEATRE_COMPANY_UUID,
											name: 'Sub-Tricycle Theatre Company',
											members: [
												{
													model: 'PERSON',
													uuid: ZOË_INGENHAAG_JR_PERSON_UUID,
													name: 'Zoë Ingenhaag Jr'
												}
											]
										}
									]
								}
							],
							cast: [
								{
									model: 'PERSON',
									uuid: RICK_WARDEN_JR_PERSON_UUID,
									name: 'Rick Warden Jr',
									roles: [
										{
											model: 'CHARACTER',
											uuid: BAR_JR_CHARACTER_UUID,
											name: 'Bar Jr',
											qualifier: null,
											isAlternate: false
										}
									]
								}
							],
							creativeCredits: [
								{
									model: 'CREATIVE_CREDIT',
									name: 'Junior Lighting Designers',
									entities: [
										{
											model: 'PERSON',
											uuid: HOWARD_HARRISON_JR_PERSON_UUID,
											name: 'Howard Harrison Jr'
										},
										{
											model: 'COMPANY',
											uuid: SUB_LIGHTING_DESIGN_LTD_COMPANY_UUID,
											name: 'Sub-Lighting Design Ltd',
											members: [
												{
													model: 'PERSON',
													uuid: JACK_KNOWLES_JR_PERSON_UUID,
													name: 'Jack Knowles Jr'
												}
											]
										}
									]
								}
							],
							crewCredits: [
								{
									model: 'CREW_CREDIT',
									name: 'Junior Stage Managers',
									entities: [
										{
											model: 'PERSON',
											uuid: LIZZIE_CHAPMAN_JR_PERSON_UUID,
											name: 'Lizzie Chapman Jr'
										},
										{
											model: 'COMPANY',
											uuid: SUB_STAGE_MANAGEMENT_LTD_COMPANY_UUID,
											name: 'Sub-Stage Management Ltd',
											members: [
												{
													model: 'PERSON',
													uuid: CHARLOTTE_PADGHAM_JR_PERSON_UUID,
													name: 'Charlotte Padgham Jr'
												}
											]
										}
									]
								}
							]
						},
						{
							model: 'PRODUCTION',
							uuid: THE_NIGHT_IS_DARKEST_BEFORE_THE_DAWN_RODA_PRODUCTION_UUID,
							name: 'The Night Is Darkest Before the Dawn',
							startDate: '2010-10-22',
							pressDate: '2010-10-25',
							endDate: '2010-11-07',
							material: {
								model: 'MATERIAL',
								uuid: THE_NIGHT_IS_DARKEST_BEFORE_THE_DAWN_MATERIAL_UUID,
								name: 'The Night Is Darkest Before the Dawn',
								format: 'play',
								year: 2009,
								surMaterial: {
									model: 'MATERIAL',
									uuid: PART_THREE_ENDURING_FREEDOM_MATERIAL_UUID,
									name: 'Part Three - Enduring Freedom 1996-2009',
									surMaterial: {
										model: 'MATERIAL',
										uuid: THE_GREAT_GAME_AFGHANISTAN_MATERIAL_UUID,
										name: 'The Great Game: Afghanistan'
									}
								},
								writingCredits: [
									{
										model: 'WRITING_CREDIT',
										name: 'by',
										entities: [
											{
												model: 'PERSON',
												uuid: FERDINAND_FOO_JR_PERSON_UUID,
												name: 'Ferdinand Foo Jr'
											},
											{
												model: 'COMPANY',
												uuid: SUB_INKISTS_LTD_COMPANY_UUID,
												name: 'Sub-Inkists Ltd'
											}
										]
									}
								]
							},
							venue: {
								model: 'VENUE',
								uuid: RODA_THEATRE_VENUE_UUID,
								name: 'Roda Theatre',
								surVenue: {
									model: 'VENUE',
									uuid: BERKELEY_REPERTORY_THEATRE_VENUE_UUID,
									name: 'Berkeley Repertory Theatre'
								}
							},
							producerCredits: [
								{
									model: 'PRODUCER_CREDIT',
									name: 'produced by',
									entities: [
										{
											model: 'PERSON',
											uuid: NICOLAS_KENT_JR_PERSON_UUID,
											name: 'Nicolas Kent Jr'
										},
										{
											model: 'COMPANY',
											uuid: SUB_TRICYCLE_THEATRE_COMPANY_UUID,
											name: 'Sub-Tricycle Theatre Company',
											members: [
												{
													model: 'PERSON',
													uuid: ZOË_INGENHAAG_JR_PERSON_UUID,
													name: 'Zoë Ingenhaag Jr'
												}
											]
										}
									]
								}
							],
							cast: [
								{
									model: 'PERSON',
									uuid: RICK_WARDEN_JR_PERSON_UUID,
									name: 'Rick Warden Jr',
									roles: [
										{
											model: 'CHARACTER',
											uuid: BAR_JR_CHARACTER_UUID,
											name: 'Bar Jr',
											qualifier: null,
											isAlternate: false
										}
									]
								}
							],
							creativeCredits: [
								{
									model: 'CREATIVE_CREDIT',
									name: 'Junior Lighting Designers',
									entities: [
										{
											model: 'PERSON',
											uuid: HOWARD_HARRISON_JR_PERSON_UUID,
											name: 'Howard Harrison Jr'
										},
										{
											model: 'COMPANY',
											uuid: SUB_LIGHTING_DESIGN_LTD_COMPANY_UUID,
											name: 'Sub-Lighting Design Ltd',
											members: [
												{
													model: 'PERSON',
													uuid: JACK_KNOWLES_JR_PERSON_UUID,
													name: 'Jack Knowles Jr'
												}
											]
										}
									]
								}
							],
							crewCredits: [
								{
									model: 'CREW_CREDIT',
									name: 'Junior Stage Managers',
									entities: [
										{
											model: 'PERSON',
											uuid: LIZZIE_CHAPMAN_JR_PERSON_UUID,
											name: 'Lizzie Chapman Jr'
										},
										{
											model: 'COMPANY',
											uuid: SUB_STAGE_MANAGEMENT_LTD_COMPANY_UUID,
											name: 'Sub-Stage Management Ltd',
											members: [
												{
													model: 'PERSON',
													uuid: CHARLOTTE_PADGHAM_JR_PERSON_UUID,
													name: 'Charlotte Padgham Jr'
												}
											]
										}
									]
								}
							]
						},
						{
							model: 'PRODUCTION',
							uuid: ON_THE_SIDE_OF_THE_ANGELS_RODA_PRODUCTION_UUID,
							name: 'On the Side of the Angels',
							startDate: '2010-10-22',
							pressDate: '2010-10-25',
							endDate: '2010-11-07',
							material: {
								model: 'MATERIAL',
								uuid: ON_THE_SIDE_OF_THE_ANGELS_MATERIAL_UUID,
								name: 'On the Side of the Angels',
								format: 'play',
								year: 2009,
								surMaterial: {
									model: 'MATERIAL',
									uuid: PART_THREE_ENDURING_FREEDOM_MATERIAL_UUID,
									name: 'Part Three - Enduring Freedom 1996-2009',
									surMaterial: {
										model: 'MATERIAL',
										uuid: THE_GREAT_GAME_AFGHANISTAN_MATERIAL_UUID,
										name: 'The Great Game: Afghanistan'
									}
								},
								writingCredits: [
									{
										model: 'WRITING_CREDIT',
										name: 'by',
										entities: [
											{
												model: 'PERSON',
												uuid: FERDINAND_FOO_JR_PERSON_UUID,
												name: 'Ferdinand Foo Jr'
											},
											{
												model: 'COMPANY',
												uuid: SUB_INKISTS_LTD_COMPANY_UUID,
												name: 'Sub-Inkists Ltd'
											}
										]
									}
								]
							},
							venue: {
								model: 'VENUE',
								uuid: RODA_THEATRE_VENUE_UUID,
								name: 'Roda Theatre',
								surVenue: {
									model: 'VENUE',
									uuid: BERKELEY_REPERTORY_THEATRE_VENUE_UUID,
									name: 'Berkeley Repertory Theatre'
								}
							},
							producerCredits: [
								{
									model: 'PRODUCER_CREDIT',
									name: 'produced by',
									entities: [
										{
											model: 'PERSON',
											uuid: NICOLAS_KENT_JR_PERSON_UUID,
											name: 'Nicolas Kent Jr'
										},
										{
											model: 'COMPANY',
											uuid: SUB_TRICYCLE_THEATRE_COMPANY_UUID,
											name: 'Sub-Tricycle Theatre Company',
											members: [
												{
													model: 'PERSON',
													uuid: ZOË_INGENHAAG_JR_PERSON_UUID,
													name: 'Zoë Ingenhaag Jr'
												}
											]
										}
									]
								}
							],
							cast: [
								{
									model: 'PERSON',
									uuid: RICK_WARDEN_JR_PERSON_UUID,
									name: 'Rick Warden Jr',
									roles: [
										{
											model: 'CHARACTER',
											uuid: BAR_JR_CHARACTER_UUID,
											name: 'Bar Jr',
											qualifier: null,
											isAlternate: false
										}
									]
								}
							],
							creativeCredits: [
								{
									model: 'CREATIVE_CREDIT',
									name: 'Junior Lighting Designers',
									entities: [
										{
											model: 'PERSON',
											uuid: HOWARD_HARRISON_JR_PERSON_UUID,
											name: 'Howard Harrison Jr'
										},
										{
											model: 'COMPANY',
											uuid: SUB_LIGHTING_DESIGN_LTD_COMPANY_UUID,
											name: 'Sub-Lighting Design Ltd',
											members: [
												{
													model: 'PERSON',
													uuid: JACK_KNOWLES_JR_PERSON_UUID,
													name: 'Jack Knowles Jr'
												}
											]
										}
									]
								}
							],
							crewCredits: [
								{
									model: 'CREW_CREDIT',
									name: 'Junior Stage Managers',
									entities: [
										{
											model: 'PERSON',
											uuid: LIZZIE_CHAPMAN_JR_PERSON_UUID,
											name: 'Lizzie Chapman Jr'
										},
										{
											model: 'COMPANY',
											uuid: SUB_STAGE_MANAGEMENT_LTD_COMPANY_UUID,
											name: 'Sub-Stage Management Ltd',
											members: [
												{
													model: 'PERSON',
													uuid: CHARLOTTE_PADGHAM_JR_PERSON_UUID,
													name: 'Charlotte Padgham Jr'
												}
											]
										}
									]
								}
							]
						}
					],
					producerCredits: [
						{
							model: 'PRODUCER_CREDIT',
							name: 'produced by',
							entities: [
								{
									model: 'PERSON',
									uuid: NICOLAS_KENT_PERSON_UUID,
									name: 'Nicolas Kent'
								},
								{
									model: 'COMPANY',
									uuid: MID_TRICYCLE_THEATRE_COMPANY_UUID,
									name: 'Mid-Tricycle Theatre Company',
									members: [
										{
											model: 'PERSON',
											uuid: ZOË_INGENHAAG_PERSON_UUID,
											name: 'Zoë Ingenhaag'
										}
									]
								}
							]
						}
					],
					cast: [
						{
							model: 'PERSON',
							uuid: RICK_WARDEN_PERSON_UUID,
							name: 'Rick Warden',
							roles: [
								{
									model: 'CHARACTER',
									uuid: BAR_CHARACTER_UUID,
									name: 'Bar',
									qualifier: null,
									isAlternate: false
								}
							]
						}
					],
					creativeCredits: [
						{
							model: 'CREATIVE_CREDIT',
							name: 'Mid-level Lighting Designers',
							entities: [
								{
									model: 'PERSON',
									uuid: HOWARD_HARRISON_PERSON_UUID,
									name: 'Howard Harrison'
								},
								{
									model: 'COMPANY',
									uuid: MID_LIGHTING_DESIGN_LTD_COMPANY_UUID,
									name: 'Mid-Lighting Design Ltd',
									members: [
										{
											model: 'PERSON',
											uuid: JACK_KNOWLES_PERSON_UUID,
											name: 'Jack Knowles'
										}
									]
								}
							]
						}
					],
					crewCredits: [
						{
							model: 'CREW_CREDIT',
							name: 'Mid-level Stage Managers',
							entities: [
								{
									model: 'PERSON',
									uuid: LIZZIE_CHAPMAN_PERSON_UUID,
									name: 'Lizzie Chapman'
								},
								{
									model: 'COMPANY',
									uuid: MID_STAGE_MANAGEMENT_LTD_COMPANY_UUID,
									name: 'Mid-Stage Management Ltd',
									members: [
										{
											model: 'PERSON',
											uuid: CHARLOTTE_PADGHAM_PERSON_UUID,
											name: 'Charlotte Padgham'
										}
									]
								}
							]
						}
					]
				}
			];

			const { subProductions } = theGreatGameAfghanistanRodaProduction.body;

			expect(subProductions).to.deep.equal(expectedSubProductions);

		});

	});

	describe('Part One - Invasions and Independence 1842-1930 at Roda Theatre (production with sur-production and sub-productions that have a sur-venue)', () => {

		it('includes The Great Game at Roda Theatre as its sur-production', () => {

			const expectedSurProduction = {
				model: 'PRODUCTION',
				uuid: THE_GREAT_GAME_AFGHANISTAN_RODA_PRODUCTION_UUID,
				name: 'The Great Game: Afghanistan',
				startDate: '2010-10-22',
				pressDate: '2010-10-25',
				endDate: '2010-11-07',
				material: {
					model: 'MATERIAL',
					uuid: THE_GREAT_GAME_AFGHANISTAN_MATERIAL_UUID,
					name: 'The Great Game: Afghanistan',
					format: 'collection of plays',
					year: 2009,
					surMaterial: null,
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'by',
							entities: [
								{
									model: 'PERSON',
									uuid: FERDINAND_FOO_SR_PERSON_UUID,
									name: 'Ferdinand Foo Sr'
								},
								{
									model: 'COMPANY',
									uuid: SUR_INKISTS_LTD_COMPANY_UUID,
									name: 'Sur-Inkists Ltd'
								}
							]
						}
					]
				},
				venue: {
					model: 'VENUE',
					uuid: RODA_THEATRE_VENUE_UUID,
					name: 'Roda Theatre',
					surVenue: {
						model: 'VENUE',
						uuid: BERKELEY_REPERTORY_THEATRE_VENUE_UUID,
						name: 'Berkeley Repertory Theatre'
					}
				},
				surProduction: null,
				producerCredits: [
					{
						model: 'PRODUCER_CREDIT',
						name: 'produced by',
						entities: [
							{
								model: 'PERSON',
								uuid: NICOLAS_KENT_SR_PERSON_UUID,
								name: 'Nicolas Kent Sr'
							},
							{
								model: 'COMPANY',
								uuid: SUR_TRICYCLE_THEATRE_COMPANY_UUID,
								name: 'Sur-Tricycle Theatre Company',
								members: [
									{
										model: 'PERSON',
										uuid: ZOË_INGENHAAG_SR_PERSON_UUID,
										name: 'Zoë Ingenhaag Sr'
									}
								]
							}
						]
					}
				],
				cast: [
					{
						model: 'PERSON',
						uuid: RICK_WARDEN_SR_PERSON_UUID,
						name: 'Rick Warden Sr',
						roles: [
							{
								model: 'CHARACTER',
								uuid: BAR_SR_CHARACTER_UUID,
								name: 'Bar Sr',
								qualifier: null,
								isAlternate: false
							}
						]
					}
				],
				creativeCredits: [
					{
						model: 'CREATIVE_CREDIT',
						name: 'Senior Lighting Designers',
						entities: [
							{
								model: 'PERSON',
								uuid: HOWARD_HARRISON_SR_PERSON_UUID,
								name: 'Howard Harrison Sr'
							},
							{
								model: 'COMPANY',
								uuid: SUR_LIGHTING_DESIGN_LTD_COMPANY_UUID,
								name: 'Sur-Lighting Design Ltd',
								members: [
									{
										model: 'PERSON',
										uuid: JACK_KNOWLES_SR_PERSON_UUID,
										name: 'Jack Knowles Sr'
									}
								]
							}
						]
					}
				],
				crewCredits: [
					{
						model: 'CREW_CREDIT',
						name: 'Senior Stage Managers',
						entities: [
							{
								model: 'PERSON',
								uuid: LIZZIE_CHAPMAN_SR_PERSON_UUID,
								name: 'Lizzie Chapman Sr'
							},
							{
								model: 'COMPANY',
								uuid: SUR_STAGE_MANAGEMENT_LTD_COMPANY_UUID,
								name: 'Sur-Stage Management Ltd',
								members: [
									{
										model: 'PERSON',
										uuid: CHARLOTTE_PADGHAM_SR_PERSON_UUID,
										name: 'Charlotte Padgham Sr'
									}
								]
							}
						]
					}
				]
			};

			const { surProduction } = partOneInvasionsAndIndependenceRodaProduction.body;

			expect(surProduction).to.deep.equal(expectedSurProduction);

		});

		it('includes its sub-productions', () => {

			const expectedSubProductions = [
				{
					model: 'PRODUCTION',
					uuid: BUGLES_AT_THE_GATES_OF_JALALABAD_RODA_PRODUCTION_UUID,
					name: 'Bugles at the Gates of Jalalabad',
					startDate: '2010-10-22',
					pressDate: '2010-10-25',
					endDate: '2010-11-07',
					material: {
						model: 'MATERIAL',
						uuid: BUGLES_AT_THE_GATES_OF_JALALABAD_MATERIAL_UUID,
						name: 'Bugles at the Gates of Jalalabad',
						format: 'play',
						year: 2009,
						surMaterial: {
							model: 'MATERIAL',
							uuid: PART_ONE_INVASIONS_AND_INDEPENDENCE_MATERIAL_UUID,
							name: 'Part One - Invasions and Independence 1842-1930',
							surMaterial: {
								model: 'MATERIAL',
								uuid: THE_GREAT_GAME_AFGHANISTAN_MATERIAL_UUID,
								name: 'The Great Game: Afghanistan'
							}
						},
						writingCredits: [
							{
								model: 'WRITING_CREDIT',
								name: 'by',
								entities: [
									{
										model: 'PERSON',
										uuid: FERDINAND_FOO_JR_PERSON_UUID,
										name: 'Ferdinand Foo Jr'
									},
									{
										model: 'COMPANY',
										uuid: SUB_INKISTS_LTD_COMPANY_UUID,
										name: 'Sub-Inkists Ltd'
									}
								]
							}
						]
					},
					venue: {
						model: 'VENUE',
						uuid: RODA_THEATRE_VENUE_UUID,
						name: 'Roda Theatre',
						surVenue: {
							model: 'VENUE',
							uuid: BERKELEY_REPERTORY_THEATRE_VENUE_UUID,
							name: 'Berkeley Repertory Theatre'
						}
					},
					subProductions: [],
					producerCredits: [
						{
							model: 'PRODUCER_CREDIT',
							name: 'produced by',
							entities: [
								{
									model: 'PERSON',
									uuid: NICOLAS_KENT_JR_PERSON_UUID,
									name: 'Nicolas Kent Jr'
								},
								{
									model: 'COMPANY',
									uuid: SUB_TRICYCLE_THEATRE_COMPANY_UUID,
									name: 'Sub-Tricycle Theatre Company',
									members: [
										{
											model: 'PERSON',
											uuid: ZOË_INGENHAAG_JR_PERSON_UUID,
											name: 'Zoë Ingenhaag Jr'
										}
									]
								}
							]
						}
					],
					cast: [
						{
							model: 'PERSON',
							uuid: RICK_WARDEN_JR_PERSON_UUID,
							name: 'Rick Warden Jr',
							roles: [
								{
									model: 'CHARACTER',
									uuid: BAR_JR_CHARACTER_UUID,
									name: 'Bar Jr',
									qualifier: null,
									isAlternate: false
								}
							]
						}
					],
					creativeCredits: [
						{
							model: 'CREATIVE_CREDIT',
							name: 'Junior Lighting Designers',
							entities: [
								{
									model: 'PERSON',
									uuid: HOWARD_HARRISON_JR_PERSON_UUID,
									name: 'Howard Harrison Jr'
								},
								{
									model: 'COMPANY',
									uuid: SUB_LIGHTING_DESIGN_LTD_COMPANY_UUID,
									name: 'Sub-Lighting Design Ltd',
									members: [
										{
											model: 'PERSON',
											uuid: JACK_KNOWLES_JR_PERSON_UUID,
											name: 'Jack Knowles Jr'
										}
									]
								}
							]
						}
					],
					crewCredits: [
						{
							model: 'CREW_CREDIT',
							name: 'Junior Stage Managers',
							entities: [
								{
									model: 'PERSON',
									uuid: LIZZIE_CHAPMAN_JR_PERSON_UUID,
									name: 'Lizzie Chapman Jr'
								},
								{
									model: 'COMPANY',
									uuid: SUB_STAGE_MANAGEMENT_LTD_COMPANY_UUID,
									name: 'Sub-Stage Management Ltd',
									members: [
										{
											model: 'PERSON',
											uuid: CHARLOTTE_PADGHAM_JR_PERSON_UUID,
											name: 'Charlotte Padgham Jr'
										}
									]
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: DURANDS_LINE_RODA_PRODUCTION_UUID,
					name: 'Durand\'s Line',
					startDate: '2010-10-22',
					pressDate: '2010-10-25',
					endDate: '2010-11-07',
					material: {
						model: 'MATERIAL',
						uuid: DURANDS_LINE_MATERIAL_UUID,
						name: 'Durand\'s Line',
						format: 'play',
						year: 2009,
						surMaterial: {
							model: 'MATERIAL',
							uuid: PART_ONE_INVASIONS_AND_INDEPENDENCE_MATERIAL_UUID,
							name: 'Part One - Invasions and Independence 1842-1930',
							surMaterial: {
								model: 'MATERIAL',
								uuid: THE_GREAT_GAME_AFGHANISTAN_MATERIAL_UUID,
								name: 'The Great Game: Afghanistan'
							}
						},
						writingCredits: [
							{
								model: 'WRITING_CREDIT',
								name: 'by',
								entities: [
									{
										model: 'PERSON',
										uuid: FERDINAND_FOO_JR_PERSON_UUID,
										name: 'Ferdinand Foo Jr'
									},
									{
										model: 'COMPANY',
										uuid: SUB_INKISTS_LTD_COMPANY_UUID,
										name: 'Sub-Inkists Ltd'
									}
								]
							}
						]
					},
					venue: {
						model: 'VENUE',
						uuid: RODA_THEATRE_VENUE_UUID,
						name: 'Roda Theatre',
						surVenue: {
							model: 'VENUE',
							uuid: BERKELEY_REPERTORY_THEATRE_VENUE_UUID,
							name: 'Berkeley Repertory Theatre'
						}
					},
					subProductions: [],
					producerCredits: [
						{
							model: 'PRODUCER_CREDIT',
							name: 'produced by',
							entities: [
								{
									model: 'PERSON',
									uuid: NICOLAS_KENT_JR_PERSON_UUID,
									name: 'Nicolas Kent Jr'
								},
								{
									model: 'COMPANY',
									uuid: SUB_TRICYCLE_THEATRE_COMPANY_UUID,
									name: 'Sub-Tricycle Theatre Company',
									members: [
										{
											model: 'PERSON',
											uuid: ZOË_INGENHAAG_JR_PERSON_UUID,
											name: 'Zoë Ingenhaag Jr'
										}
									]
								}
							]
						}
					],
					cast: [
						{
							model: 'PERSON',
							uuid: RICK_WARDEN_JR_PERSON_UUID,
							name: 'Rick Warden Jr',
							roles: [
								{
									model: 'CHARACTER',
									uuid: BAR_JR_CHARACTER_UUID,
									name: 'Bar Jr',
									qualifier: null,
									isAlternate: false
								}
							]
						}
					],
					creativeCredits: [
						{
							model: 'CREATIVE_CREDIT',
							name: 'Junior Lighting Designers',
							entities: [
								{
									model: 'PERSON',
									uuid: HOWARD_HARRISON_JR_PERSON_UUID,
									name: 'Howard Harrison Jr'
								},
								{
									model: 'COMPANY',
									uuid: SUB_LIGHTING_DESIGN_LTD_COMPANY_UUID,
									name: 'Sub-Lighting Design Ltd',
									members: [
										{
											model: 'PERSON',
											uuid: JACK_KNOWLES_JR_PERSON_UUID,
											name: 'Jack Knowles Jr'
										}
									]
								}
							]
						}
					],
					crewCredits: [
						{
							model: 'CREW_CREDIT',
							name: 'Junior Stage Managers',
							entities: [
								{
									model: 'PERSON',
									uuid: LIZZIE_CHAPMAN_JR_PERSON_UUID,
									name: 'Lizzie Chapman Jr'
								},
								{
									model: 'COMPANY',
									uuid: SUB_STAGE_MANAGEMENT_LTD_COMPANY_UUID,
									name: 'Sub-Stage Management Ltd',
									members: [
										{
											model: 'PERSON',
											uuid: CHARLOTTE_PADGHAM_JR_PERSON_UUID,
											name: 'Charlotte Padgham Jr'
										}
									]
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: CAMPAIGN_RODA_PRODUCTION_UUID,
					name: 'Campaign',
					startDate: '2010-10-22',
					pressDate: '2010-10-25',
					endDate: '2010-11-07',
					material: {
						model: 'MATERIAL',
						uuid: CAMPAIGN_MATERIAL_UUID,
						name: 'Campaign',
						format: 'play',
						year: 2009,
						surMaterial: {
							model: 'MATERIAL',
							uuid: PART_ONE_INVASIONS_AND_INDEPENDENCE_MATERIAL_UUID,
							name: 'Part One - Invasions and Independence 1842-1930',
							surMaterial: {
								model: 'MATERIAL',
								uuid: THE_GREAT_GAME_AFGHANISTAN_MATERIAL_UUID,
								name: 'The Great Game: Afghanistan'
							}
						},
						writingCredits: [
							{
								model: 'WRITING_CREDIT',
								name: 'by',
								entities: [
									{
										model: 'PERSON',
										uuid: FERDINAND_FOO_JR_PERSON_UUID,
										name: 'Ferdinand Foo Jr'
									},
									{
										model: 'COMPANY',
										uuid: SUB_INKISTS_LTD_COMPANY_UUID,
										name: 'Sub-Inkists Ltd'
									}
								]
							}
						]
					},
					venue: {
						model: 'VENUE',
						uuid: RODA_THEATRE_VENUE_UUID,
						name: 'Roda Theatre',
						surVenue: {
							model: 'VENUE',
							uuid: BERKELEY_REPERTORY_THEATRE_VENUE_UUID,
							name: 'Berkeley Repertory Theatre'
						}
					},
					subProductions: [],
					producerCredits: [
						{
							model: 'PRODUCER_CREDIT',
							name: 'produced by',
							entities: [
								{
									model: 'PERSON',
									uuid: NICOLAS_KENT_JR_PERSON_UUID,
									name: 'Nicolas Kent Jr'
								},
								{
									model: 'COMPANY',
									uuid: SUB_TRICYCLE_THEATRE_COMPANY_UUID,
									name: 'Sub-Tricycle Theatre Company',
									members: [
										{
											model: 'PERSON',
											uuid: ZOË_INGENHAAG_JR_PERSON_UUID,
											name: 'Zoë Ingenhaag Jr'
										}
									]
								}
							]
						}
					],
					cast: [
						{
							model: 'PERSON',
							uuid: RICK_WARDEN_JR_PERSON_UUID,
							name: 'Rick Warden Jr',
							roles: [
								{
									model: 'CHARACTER',
									uuid: BAR_JR_CHARACTER_UUID,
									name: 'Bar Jr',
									qualifier: null,
									isAlternate: false
								}
							]
						}
					],
					creativeCredits: [
						{
							model: 'CREATIVE_CREDIT',
							name: 'Junior Lighting Designers',
							entities: [
								{
									model: 'PERSON',
									uuid: HOWARD_HARRISON_JR_PERSON_UUID,
									name: 'Howard Harrison Jr'
								},
								{
									model: 'COMPANY',
									uuid: SUB_LIGHTING_DESIGN_LTD_COMPANY_UUID,
									name: 'Sub-Lighting Design Ltd',
									members: [
										{
											model: 'PERSON',
											uuid: JACK_KNOWLES_JR_PERSON_UUID,
											name: 'Jack Knowles Jr'
										}
									]
								}
							]
						}
					],
					crewCredits: [
						{
							model: 'CREW_CREDIT',
							name: 'Junior Stage Managers',
							entities: [
								{
									model: 'PERSON',
									uuid: LIZZIE_CHAPMAN_JR_PERSON_UUID,
									name: 'Lizzie Chapman Jr'
								},
								{
									model: 'COMPANY',
									uuid: SUB_STAGE_MANAGEMENT_LTD_COMPANY_UUID,
									name: 'Sub-Stage Management Ltd',
									members: [
										{
											model: 'PERSON',
											uuid: CHARLOTTE_PADGHAM_JR_PERSON_UUID,
											name: 'Charlotte Padgham Jr'
										}
									]
								}
							]
						}
					]
				}
			];

			const { subProductions } = partOneInvasionsAndIndependenceRodaProduction.body;

			expect(subProductions).to.deep.equal(expectedSubProductions);

		});

	});

	describe('Bugles at the Gates of Jalalabad at Roda Theatre', () => {

		it('includes Part One - Invasions and Independence 1842-1930 at Roda Theatre as its sur-production and The Great Game: Afghanistan at Roda Theatre as its sur-sur-production', () => {

			const expectedSurProduction = {
				model: 'PRODUCTION',
				uuid: PART_ONE_INVASIONS_AND_INDEPENDENCE_RODA_PRODUCTION_UUID,
				name: 'Part One - Invasions and Independence 1842-1930',
				startDate: '2010-10-22',
				pressDate: '2010-10-25',
				endDate: '2010-11-07',
				material: {
					model: 'MATERIAL',
					uuid: PART_ONE_INVASIONS_AND_INDEPENDENCE_MATERIAL_UUID,
					name: 'Part One - Invasions and Independence 1842-1930',
					format: 'sub-collection of plays',
					year: 2009,
					surMaterial: {
						model: 'MATERIAL',
						uuid: THE_GREAT_GAME_AFGHANISTAN_MATERIAL_UUID,
						name: 'The Great Game: Afghanistan',
						surMaterial: null
					},
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'by',
							entities: [
								{
									model: 'PERSON',
									uuid: FERDINAND_FOO_PERSON_UUID,
									name: 'Ferdinand Foo'
								},
								{
									model: 'COMPANY',
									uuid: MID_INKISTS_LTD_COMPANY_UUID,
									name: 'Mid-Inkists Ltd'
								}
							]
						}
					]
				},
				venue: {
					model: 'VENUE',
					uuid: RODA_THEATRE_VENUE_UUID,
					name: 'Roda Theatre',
					surVenue: {
						model: 'VENUE',
						uuid: BERKELEY_REPERTORY_THEATRE_VENUE_UUID,
						name: 'Berkeley Repertory Theatre'
					}
				},
				surProduction: {
					model: 'PRODUCTION',
					uuid: THE_GREAT_GAME_AFGHANISTAN_RODA_PRODUCTION_UUID,
					name: 'The Great Game: Afghanistan',
					startDate: '2010-10-22',
					pressDate: '2010-10-25',
					endDate: '2010-11-07',
					material: {
						model: 'MATERIAL',
						uuid: THE_GREAT_GAME_AFGHANISTAN_MATERIAL_UUID,
						name: 'The Great Game: Afghanistan',
						format: 'collection of plays',
						year: 2009,
						surMaterial: null,
						writingCredits: [
							{
								model: 'WRITING_CREDIT',
								name: 'by',
								entities: [
									{
										model: 'PERSON',
										uuid: FERDINAND_FOO_SR_PERSON_UUID,
										name: 'Ferdinand Foo Sr'
									},
									{
										model: 'COMPANY',
										uuid: SUR_INKISTS_LTD_COMPANY_UUID,
										name: 'Sur-Inkists Ltd'
									}
								]
							}
						]
					},
					venue: {
						model: 'VENUE',
						uuid: RODA_THEATRE_VENUE_UUID,
						name: 'Roda Theatre',
						surVenue: {
							model: 'VENUE',
							uuid: BERKELEY_REPERTORY_THEATRE_VENUE_UUID,
							name: 'Berkeley Repertory Theatre'
						}
					},
					producerCredits: [
						{
							model: 'PRODUCER_CREDIT',
							name: 'produced by',
							entities: [
								{
									model: 'PERSON',
									uuid: NICOLAS_KENT_SR_PERSON_UUID,
									name: 'Nicolas Kent Sr'
								},
								{
									model: 'COMPANY',
									uuid: SUR_TRICYCLE_THEATRE_COMPANY_UUID,
									name: 'Sur-Tricycle Theatre Company',
									members: [
										{
											model: 'PERSON',
											uuid: ZOË_INGENHAAG_SR_PERSON_UUID,
											name: 'Zoë Ingenhaag Sr'
										}
									]
								}
							]
						}
					],
					cast: [
						{
							model: 'PERSON',
							uuid: RICK_WARDEN_SR_PERSON_UUID,
							name: 'Rick Warden Sr',
							roles: [
								{
									model: 'CHARACTER',
									uuid: BAR_SR_CHARACTER_UUID,
									name: 'Bar Sr',
									qualifier: null,
									isAlternate: false
								}
							]
						}
					],
					creativeCredits: [
						{
							model: 'CREATIVE_CREDIT',
							name: 'Senior Lighting Designers',
							entities: [
								{
									model: 'PERSON',
									uuid: HOWARD_HARRISON_SR_PERSON_UUID,
									name: 'Howard Harrison Sr'
								},
								{
									model: 'COMPANY',
									uuid: SUR_LIGHTING_DESIGN_LTD_COMPANY_UUID,
									name: 'Sur-Lighting Design Ltd',
									members: [
										{
											model: 'PERSON',
											uuid: JACK_KNOWLES_SR_PERSON_UUID,
											name: 'Jack Knowles Sr'
										}
									]
								}
							]
						}
					],
					crewCredits: [
						{
							model: 'CREW_CREDIT',
							name: 'Senior Stage Managers',
							entities: [
								{
									model: 'PERSON',
									uuid: LIZZIE_CHAPMAN_SR_PERSON_UUID,
									name: 'Lizzie Chapman Sr'
								},
								{
									model: 'COMPANY',
									uuid: SUR_STAGE_MANAGEMENT_LTD_COMPANY_UUID,
									name: 'Sur-Stage Management Ltd',
									members: [
										{
											model: 'PERSON',
											uuid: CHARLOTTE_PADGHAM_SR_PERSON_UUID,
											name: 'Charlotte Padgham Sr'
										}
									]
								}
							]
						}
					]
				},
				producerCredits: [
					{
						model: 'PRODUCER_CREDIT',
						name: 'produced by',
						entities: [
							{
								model: 'PERSON',
								uuid: NICOLAS_KENT_PERSON_UUID,
								name: 'Nicolas Kent'
							},
							{
								model: 'COMPANY',
								uuid: MID_TRICYCLE_THEATRE_COMPANY_UUID,
								name: 'Mid-Tricycle Theatre Company',
								members: [
									{
										model: 'PERSON',
										uuid: ZOË_INGENHAAG_PERSON_UUID,
										name: 'Zoë Ingenhaag'
									}
								]
							}
						]
					}
				],
				cast: [
					{
						model: 'PERSON',
						uuid: RICK_WARDEN_PERSON_UUID,
						name: 'Rick Warden',
						roles: [
							{
								model: 'CHARACTER',
								uuid: BAR_CHARACTER_UUID,
								name: 'Bar',
								qualifier: null,
								isAlternate: false
							}
						]
					}
				],
				creativeCredits: [
					{
						model: 'CREATIVE_CREDIT',
						name: 'Mid-level Lighting Designers',
						entities: [
							{
								model: 'PERSON',
								uuid: HOWARD_HARRISON_PERSON_UUID,
								name: 'Howard Harrison'
							},
							{
								model: 'COMPANY',
								uuid: MID_LIGHTING_DESIGN_LTD_COMPANY_UUID,
								name: 'Mid-Lighting Design Ltd',
								members: [
									{
										model: 'PERSON',
										uuid: JACK_KNOWLES_PERSON_UUID,
										name: 'Jack Knowles'
									}
								]
							}
						]
					}
				],
				crewCredits: [
					{
						model: 'CREW_CREDIT',
						name: 'Mid-level Stage Managers',
						entities: [
							{
								model: 'PERSON',
								uuid: LIZZIE_CHAPMAN_PERSON_UUID,
								name: 'Lizzie Chapman'
							},
							{
								model: 'COMPANY',
								uuid: MID_STAGE_MANAGEMENT_LTD_COMPANY_UUID,
								name: 'Mid-Stage Management Ltd',
								members: [
									{
										model: 'PERSON',
										uuid: CHARLOTTE_PADGHAM_PERSON_UUID,
										name: 'Charlotte Padgham'
									}
								]
							}
						]
					}
				]
			};

			const { surProduction } = buglesAtTheGatesOfJalalabadRodaProduction.body;

			expect(surProduction).to.deep.equal(expectedSurProduction);

		});

	});

	describe('The Great Game: Afghanistan at Tricycle Theatre (production with sub-sub-productions that do not have a sur-venue)', () => {

		it('includes its sub-productions and sub-sub-productions', () => {

			const expectedSubProductions = [
				{
					model: 'PRODUCTION',
					uuid: PART_ONE_INVASIONS_AND_INDEPENDENCE_TRICYCLE_PRODUCTION_UUID,
					name: 'Part One - Invasions and Independence 1842-1930',
					startDate: '2009-04-17',
					pressDate: '2009-04-24',
					endDate: '2009-06-14',
					material: {
						model: 'MATERIAL',
						uuid: PART_ONE_INVASIONS_AND_INDEPENDENCE_MATERIAL_UUID,
						name: 'Part One - Invasions and Independence 1842-1930',
						format: 'sub-collection of plays',
						year: 2009,
						surMaterial: {
							model: 'MATERIAL',
							uuid: THE_GREAT_GAME_AFGHANISTAN_MATERIAL_UUID,
							name: 'The Great Game: Afghanistan',
							surMaterial: null
						},
						writingCredits: [
							{
								model: 'WRITING_CREDIT',
								name: 'by',
								entities: [
									{
										model: 'PERSON',
										uuid: FERDINAND_FOO_PERSON_UUID,
										name: 'Ferdinand Foo'
									},
									{
										model: 'COMPANY',
										uuid: MID_INKISTS_LTD_COMPANY_UUID,
										name: 'Mid-Inkists Ltd'
									}
								]
							}
						]
					},
					venue: {
						model: 'VENUE',
						uuid: TRICYCLE_THEATRE_VENUE_UUID,
						name: 'Tricycle Theatre',
						surVenue: null
					},
					subProductions: [
						{
							model: 'PRODUCTION',
							uuid: BUGLES_AT_THE_GATES_OF_JALALABAD_TRICYCLE_PRODUCTION_UUID,
							name: 'Bugles at the Gates of Jalalabad',
							startDate: '2009-04-17',
							pressDate: '2009-04-24',
							endDate: '2009-06-14',
							material: {
								model: 'MATERIAL',
								uuid: BUGLES_AT_THE_GATES_OF_JALALABAD_MATERIAL_UUID,
								name: 'Bugles at the Gates of Jalalabad',
								format: 'play',
								year: 2009,
								surMaterial: {
									model: 'MATERIAL',
									uuid: PART_ONE_INVASIONS_AND_INDEPENDENCE_MATERIAL_UUID,
									name: 'Part One - Invasions and Independence 1842-1930',
									surMaterial: {
										model: 'MATERIAL',
										uuid: THE_GREAT_GAME_AFGHANISTAN_MATERIAL_UUID,
										name: 'The Great Game: Afghanistan'
									}
								},
								writingCredits: [
									{
										model: 'WRITING_CREDIT',
										name: 'by',
										entities: [
											{
												model: 'PERSON',
												uuid: FERDINAND_FOO_JR_PERSON_UUID,
												name: 'Ferdinand Foo Jr'
											},
											{
												model: 'COMPANY',
												uuid: SUB_INKISTS_LTD_COMPANY_UUID,
												name: 'Sub-Inkists Ltd'
											}
										]
									}
								]
							},
							venue: {
								model: 'VENUE',
								uuid: TRICYCLE_THEATRE_VENUE_UUID,
								name: 'Tricycle Theatre',
								surVenue: null
							},
							producerCredits: [],
							cast: [],
							creativeCredits: [],
							crewCredits: []
						},
						{
							model: 'PRODUCTION',
							uuid: DURANDS_LINE_TRICYCLE_PRODUCTION_UUID,
							name: 'Durand\'s Line',
							startDate: '2009-04-17',
							pressDate: '2009-04-24',
							endDate: '2009-06-14',
							material: {
								model: 'MATERIAL',
								uuid: DURANDS_LINE_MATERIAL_UUID,
								name: 'Durand\'s Line',
								format: 'play',
								year: 2009,
								surMaterial: {
									model: 'MATERIAL',
									uuid: PART_ONE_INVASIONS_AND_INDEPENDENCE_MATERIAL_UUID,
									name: 'Part One - Invasions and Independence 1842-1930',
									surMaterial: {
										model: 'MATERIAL',
										uuid: THE_GREAT_GAME_AFGHANISTAN_MATERIAL_UUID,
										name: 'The Great Game: Afghanistan'
									}
								},
								writingCredits: [
									{
										model: 'WRITING_CREDIT',
										name: 'by',
										entities: [
											{
												model: 'PERSON',
												uuid: FERDINAND_FOO_JR_PERSON_UUID,
												name: 'Ferdinand Foo Jr'
											},
											{
												model: 'COMPANY',
												uuid: SUB_INKISTS_LTD_COMPANY_UUID,
												name: 'Sub-Inkists Ltd'
											}
										]
									}
								]
							},
							venue: {
								model: 'VENUE',
								uuid: TRICYCLE_THEATRE_VENUE_UUID,
								name: 'Tricycle Theatre',
								surVenue: null
							},
							producerCredits: [],
							cast: [],
							creativeCredits: [],
							crewCredits: []
						},
						{
							model: 'PRODUCTION',
							uuid: CAMPAIGN_TRICYCLE_PRODUCTION_UUID,
							name: 'Campaign',
							startDate: '2009-04-17',
							pressDate: '2009-04-24',
							endDate: '2009-06-14',
							material: {
								model: 'MATERIAL',
								uuid: CAMPAIGN_MATERIAL_UUID,
								name: 'Campaign',
								format: 'play',
								year: 2009,
								surMaterial: {
									model: 'MATERIAL',
									uuid: PART_ONE_INVASIONS_AND_INDEPENDENCE_MATERIAL_UUID,
									name: 'Part One - Invasions and Independence 1842-1930',
									surMaterial: {
										model: 'MATERIAL',
										uuid: THE_GREAT_GAME_AFGHANISTAN_MATERIAL_UUID,
										name: 'The Great Game: Afghanistan'
									}
								},
								writingCredits: [
									{
										model: 'WRITING_CREDIT',
										name: 'by',
										entities: [
											{
												model: 'PERSON',
												uuid: FERDINAND_FOO_JR_PERSON_UUID,
												name: 'Ferdinand Foo Jr'
											},
											{
												model: 'COMPANY',
												uuid: SUB_INKISTS_LTD_COMPANY_UUID,
												name: 'Sub-Inkists Ltd'
											}
										]
									}
								]
							},
							venue: {
								model: 'VENUE',
								uuid: TRICYCLE_THEATRE_VENUE_UUID,
								name: 'Tricycle Theatre',
								surVenue: null
							},
							producerCredits: [],
							cast: [],
							creativeCredits: [],
							crewCredits: []
						}
					],
					producerCredits: [],
					cast: [],
					creativeCredits: [],
					crewCredits: []
				},
				{
					model: 'PRODUCTION',
					uuid: PART_TWO_COMMUNISM_THE_MUJAHIDEEN_AND_THE_TALIBAN_TRICYCLE_PRODUCTION_UUID,
					name: 'Part Two - Communism, the Mujahideen and the Taliban 1979-1996',
					startDate: '2009-04-17',
					pressDate: '2009-04-24',
					endDate: '2009-06-14',
					material: {
						model: 'MATERIAL',
						uuid: PART_TWO_COMMUNISM_THE_MUJAHIDEEN_AND_THE_TALIBAN_MATERIAL_UUID,
						name: 'Part Two - Communism, the Mujahideen and the Taliban 1979-1996',
						format: 'sub-collection of plays',
						year: 2009,
						surMaterial: {
							model: 'MATERIAL',
							uuid: THE_GREAT_GAME_AFGHANISTAN_MATERIAL_UUID,
							name: 'The Great Game: Afghanistan',
							surMaterial: null
						},
						writingCredits: [
							{
								model: 'WRITING_CREDIT',
								name: 'by',
								entities: [
									{
										model: 'PERSON',
										uuid: FERDINAND_FOO_PERSON_UUID,
										name: 'Ferdinand Foo'
									},
									{
										model: 'COMPANY',
										uuid: MID_INKISTS_LTD_COMPANY_UUID,
										name: 'Mid-Inkists Ltd'
									}
								]
							}
						]
					},
					venue: {
						model: 'VENUE',
						uuid: TRICYCLE_THEATRE_VENUE_UUID,
						name: 'Tricycle Theatre',
						surVenue: null
					},
					subProductions: [
						{
							model: 'PRODUCTION',
							uuid: BLACK_TULIPS_TRICYCLE_PRODUCTION_UUID,
							name: 'Black Tulips',
							startDate: '2009-04-17',
							pressDate: '2009-04-24',
							endDate: '2009-06-14',
							material: {
								model: 'MATERIAL',
								uuid: BLACK_TULIPS_MATERIAL_UUID,
								name: 'Black Tulips',
								format: 'play',
								year: 2009,
								surMaterial: {
									model: 'MATERIAL',
									uuid: PART_TWO_COMMUNISM_THE_MUJAHIDEEN_AND_THE_TALIBAN_MATERIAL_UUID,
									name: 'Part Two - Communism, the Mujahideen and the Taliban 1979-1996',
									surMaterial: {
										model: 'MATERIAL',
										uuid: THE_GREAT_GAME_AFGHANISTAN_MATERIAL_UUID,
										name: 'The Great Game: Afghanistan'
									}
								},
								writingCredits: [
									{
										model: 'WRITING_CREDIT',
										name: 'by',
										entities: [
											{
												model: 'PERSON',
												uuid: FERDINAND_FOO_JR_PERSON_UUID,
												name: 'Ferdinand Foo Jr'
											},
											{
												model: 'COMPANY',
												uuid: SUB_INKISTS_LTD_COMPANY_UUID,
												name: 'Sub-Inkists Ltd'
											}
										]
									}
								]
							},
							venue: {
								model: 'VENUE',
								uuid: TRICYCLE_THEATRE_VENUE_UUID,
								name: 'Tricycle Theatre',
								surVenue: null
							},
							producerCredits: [],
							cast: [],
							creativeCredits: [],
							crewCredits: []
						},
						{
							model: 'PRODUCTION',
							uuid: BLOOD_AND_GIFTS_TRICYCLE_PRODUCTION_UUID,
							name: 'Blood and Gifts',
							startDate: '2009-04-17',
							pressDate: '2009-04-24',
							endDate: '2009-06-14',
							material: {
								model: 'MATERIAL',
								uuid: BLOOD_AND_GIFTS_MATERIAL_UUID,
								name: 'Blood and Gifts',
								format: 'play',
								year: 2009,
								surMaterial: {
									model: 'MATERIAL',
									uuid: PART_TWO_COMMUNISM_THE_MUJAHIDEEN_AND_THE_TALIBAN_MATERIAL_UUID,
									name: 'Part Two - Communism, the Mujahideen and the Taliban 1979-1996',
									surMaterial: {
										model: 'MATERIAL',
										uuid: THE_GREAT_GAME_AFGHANISTAN_MATERIAL_UUID,
										name: 'The Great Game: Afghanistan'
									}
								},
								writingCredits: [
									{
										model: 'WRITING_CREDIT',
										name: 'by',
										entities: [
											{
												model: 'PERSON',
												uuid: FERDINAND_FOO_JR_PERSON_UUID,
												name: 'Ferdinand Foo Jr'
											},
											{
												model: 'COMPANY',
												uuid: SUB_INKISTS_LTD_COMPANY_UUID,
												name: 'Sub-Inkists Ltd'
											}
										]
									}
								]
							},
							venue: {
								model: 'VENUE',
								uuid: TRICYCLE_THEATRE_VENUE_UUID,
								name: 'Tricycle Theatre',
								surVenue: null
							},
							producerCredits: [],
							cast: [],
							creativeCredits: [],
							crewCredits: []
						},
						{
							model: 'PRODUCTION',
							uuid: MINISKIRTS_OF_KABUL_TRICYCLE_PRODUCTION_UUID,
							name: 'Miniskirts of Kabul',
							startDate: '2009-04-17',
							pressDate: '2009-04-24',
							endDate: '2009-06-14',
							material: {
								model: 'MATERIAL',
								uuid: MINISKIRTS_OF_KABUL_MATERIAL_UUID,
								name: 'Miniskirts of Kabul',
								format: 'play',
								year: 2009,
								surMaterial: {
									model: 'MATERIAL',
									uuid: PART_TWO_COMMUNISM_THE_MUJAHIDEEN_AND_THE_TALIBAN_MATERIAL_UUID,
									name: 'Part Two - Communism, the Mujahideen and the Taliban 1979-1996',
									surMaterial: {
										model: 'MATERIAL',
										uuid: THE_GREAT_GAME_AFGHANISTAN_MATERIAL_UUID,
										name: 'The Great Game: Afghanistan'
									}
								},
								writingCredits: [
									{
										model: 'WRITING_CREDIT',
										name: 'by',
										entities: [
											{
												model: 'PERSON',
												uuid: FERDINAND_FOO_JR_PERSON_UUID,
												name: 'Ferdinand Foo Jr'
											},
											{
												model: 'COMPANY',
												uuid: SUB_INKISTS_LTD_COMPANY_UUID,
												name: 'Sub-Inkists Ltd'
											}
										]
									}
								]
							},
							venue: {
								model: 'VENUE',
								uuid: TRICYCLE_THEATRE_VENUE_UUID,
								name: 'Tricycle Theatre',
								surVenue: null
							},
							producerCredits: [],
							cast: [],
							creativeCredits: [],
							crewCredits: []
						}
					],
					producerCredits: [],
					cast: [],
					creativeCredits: [],
					crewCredits: []
				},
				{
					model: 'PRODUCTION',
					uuid: PART_THREE_ENDURING_FREEDOM_TRICYCLE_PRODUCTION_UUID,
					name: 'Part Three - Enduring Freedom 1996-2009',
					startDate: '2009-04-17',
					pressDate: '2009-04-24',
					endDate: '2009-06-14',
					material: {
						model: 'MATERIAL',
						uuid: PART_THREE_ENDURING_FREEDOM_MATERIAL_UUID,
						name: 'Part Three - Enduring Freedom 1996-2009',
						format: 'sub-collection of plays',
						year: 2009,
						surMaterial: {
							model: 'MATERIAL',
							uuid: THE_GREAT_GAME_AFGHANISTAN_MATERIAL_UUID,
							name: 'The Great Game: Afghanistan',
							surMaterial: null
						},
						writingCredits: [
							{
								model: 'WRITING_CREDIT',
								name: 'by',
								entities: [
									{
										model: 'PERSON',
										uuid: FERDINAND_FOO_PERSON_UUID,
										name: 'Ferdinand Foo'
									},
									{
										model: 'COMPANY',
										uuid: MID_INKISTS_LTD_COMPANY_UUID,
										name: 'Mid-Inkists Ltd'
									}
								]
							}
						]
					},
					venue: {
						model: 'VENUE',
						uuid: TRICYCLE_THEATRE_VENUE_UUID,
						name: 'Tricycle Theatre',
						surVenue: null
					},
					subProductions: [
						{
							model: 'PRODUCTION',
							uuid: HONEY_TRICYCLE_PRODUCTION_UUID,
							name: 'Honey',
							startDate: '2009-04-17',
							pressDate: '2009-04-24',
							endDate: '2009-06-14',
							material: {
								model: 'MATERIAL',
								uuid: HONEY_MATERIAL_UUID,
								name: 'Honey',
								format: 'play',
								year: 2009,
								surMaterial: {
									model: 'MATERIAL',
									uuid: PART_THREE_ENDURING_FREEDOM_MATERIAL_UUID,
									name: 'Part Three - Enduring Freedom 1996-2009',
									surMaterial: {
										model: 'MATERIAL',
										uuid: THE_GREAT_GAME_AFGHANISTAN_MATERIAL_UUID,
										name: 'The Great Game: Afghanistan'
									}
								},
								writingCredits: [
									{
										model: 'WRITING_CREDIT',
										name: 'by',
										entities: [
											{
												model: 'PERSON',
												uuid: FERDINAND_FOO_JR_PERSON_UUID,
												name: 'Ferdinand Foo Jr'
											},
											{
												model: 'COMPANY',
												uuid: SUB_INKISTS_LTD_COMPANY_UUID,
												name: 'Sub-Inkists Ltd'
											}
										]
									}
								]
							},
							venue: {
								model: 'VENUE',
								uuid: TRICYCLE_THEATRE_VENUE_UUID,
								name: 'Tricycle Theatre',
								surVenue: null
							},
							producerCredits: [],
							cast: [],
							creativeCredits: [],
							crewCredits: []
						},
						{
							model: 'PRODUCTION',
							uuid: THE_NIGHT_IS_DARKEST_BEFORE_THE_DAWN_TRICYCLE_PRODUCTION_UUID,
							name: 'The Night Is Darkest Before the Dawn',
							startDate: '2009-04-17',
							pressDate: '2009-04-24',
							endDate: '2009-06-14',
							material: {
								model: 'MATERIAL',
								uuid: THE_NIGHT_IS_DARKEST_BEFORE_THE_DAWN_MATERIAL_UUID,
								name: 'The Night Is Darkest Before the Dawn',
								format: 'play',
								year: 2009,
								surMaterial: {
									model: 'MATERIAL',
									uuid: PART_THREE_ENDURING_FREEDOM_MATERIAL_UUID,
									name: 'Part Three - Enduring Freedom 1996-2009',
									surMaterial: {
										model: 'MATERIAL',
										uuid: THE_GREAT_GAME_AFGHANISTAN_MATERIAL_UUID,
										name: 'The Great Game: Afghanistan'
									}
								},
								writingCredits: [
									{
										model: 'WRITING_CREDIT',
										name: 'by',
										entities: [
											{
												model: 'PERSON',
												uuid: FERDINAND_FOO_JR_PERSON_UUID,
												name: 'Ferdinand Foo Jr'
											},
											{
												model: 'COMPANY',
												uuid: SUB_INKISTS_LTD_COMPANY_UUID,
												name: 'Sub-Inkists Ltd'
											}
										]
									}
								]
							},
							venue: {
								model: 'VENUE',
								uuid: TRICYCLE_THEATRE_VENUE_UUID,
								name: 'Tricycle Theatre',
								surVenue: null
							},
							producerCredits: [],
							cast: [],
							creativeCredits: [],
							crewCredits: []
						},
						{
							model: 'PRODUCTION',
							uuid: ON_THE_SIDE_OF_THE_ANGELS_TRICYCLE_PRODUCTION_UUID,
							name: 'On the Side of the Angels',
							startDate: '2009-04-17',
							pressDate: '2009-04-24',
							endDate: '2009-06-14',
							material: {
								model: 'MATERIAL',
								uuid: ON_THE_SIDE_OF_THE_ANGELS_MATERIAL_UUID,
								name: 'On the Side of the Angels',
								format: 'play',
								year: 2009,
								surMaterial: {
									model: 'MATERIAL',
									uuid: PART_THREE_ENDURING_FREEDOM_MATERIAL_UUID,
									name: 'Part Three - Enduring Freedom 1996-2009',
									surMaterial: {
										model: 'MATERIAL',
										uuid: THE_GREAT_GAME_AFGHANISTAN_MATERIAL_UUID,
										name: 'The Great Game: Afghanistan'
									}
								},
								writingCredits: [
									{
										model: 'WRITING_CREDIT',
										name: 'by',
										entities: [
											{
												model: 'PERSON',
												uuid: FERDINAND_FOO_JR_PERSON_UUID,
												name: 'Ferdinand Foo Jr'
											},
											{
												model: 'COMPANY',
												uuid: SUB_INKISTS_LTD_COMPANY_UUID,
												name: 'Sub-Inkists Ltd'
											}
										]
									}
								]
							},
							venue: {
								model: 'VENUE',
								uuid: TRICYCLE_THEATRE_VENUE_UUID,
								name: 'Tricycle Theatre',
								surVenue: null
							},
							producerCredits: [],
							cast: [],
							creativeCredits: [],
							crewCredits: []
						}
					],
					producerCredits: [],
					cast: [],
					creativeCredits: [],
					crewCredits: []
				}
			];

			const { subProductions } = theGreatGameAfghanistanTricycleProduction.body;

			expect(subProductions).to.deep.equal(expectedSubProductions);

		});

	});

	describe('Part One - Invasions and Independence 1842-1930 at Tricycle Theatre (production with sur-production and sub-productions that do not have a sur-venue)', () => {

		it('includes The Great Game at Tricycle Theatre as its sur-production', () => {

			const expectedSurProduction = {
				model: 'PRODUCTION',
				uuid: THE_GREAT_GAME_AFGHANISTAN_TRICYCLE_PRODUCTION_UUID,
				name: 'The Great Game: Afghanistan',
				startDate: '2009-04-17',
				pressDate: '2009-04-24',
				endDate: '2009-06-14',
				material: {
					model: 'MATERIAL',
					uuid: THE_GREAT_GAME_AFGHANISTAN_MATERIAL_UUID,
					name: 'The Great Game: Afghanistan',
					format: 'collection of plays',
					year: 2009,
					surMaterial: null,
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'by',
							entities: [
								{
									model: 'PERSON',
									uuid: FERDINAND_FOO_SR_PERSON_UUID,
									name: 'Ferdinand Foo Sr'
								},
								{
									model: 'COMPANY',
									uuid: SUR_INKISTS_LTD_COMPANY_UUID,
									name: 'Sur-Inkists Ltd'
								}
							]
						}
					]
				},
				venue: {
					model: 'VENUE',
					uuid: TRICYCLE_THEATRE_VENUE_UUID,
					name: 'Tricycle Theatre',
					surVenue: null
				},
				surProduction: null,
				producerCredits: [],
				cast: [],
				creativeCredits: [],
				crewCredits: []
			};

			const { surProduction } = partOneInvasionsAndIndependenceTricycleProduction.body;

			expect(surProduction).to.deep.equal(expectedSurProduction);

		});

		it('includes its sub-productions', () => {

			const expectedSubProductions = [
				{
					model: 'PRODUCTION',
					uuid: BUGLES_AT_THE_GATES_OF_JALALABAD_TRICYCLE_PRODUCTION_UUID,
					name: 'Bugles at the Gates of Jalalabad',
					startDate: '2009-04-17',
					pressDate: '2009-04-24',
					endDate: '2009-06-14',
					material: {
						model: 'MATERIAL',
						uuid: BUGLES_AT_THE_GATES_OF_JALALABAD_MATERIAL_UUID,
						name: 'Bugles at the Gates of Jalalabad',
						format: 'play',
						year: 2009,
						surMaterial: {
							model: 'MATERIAL',
							uuid: PART_ONE_INVASIONS_AND_INDEPENDENCE_MATERIAL_UUID,
							name: 'Part One - Invasions and Independence 1842-1930',
							surMaterial: {
								model: 'MATERIAL',
								uuid: THE_GREAT_GAME_AFGHANISTAN_MATERIAL_UUID,
								name: 'The Great Game: Afghanistan'
							}
						},
						writingCredits: [
							{
								model: 'WRITING_CREDIT',
								name: 'by',
								entities: [
									{
										model: 'PERSON',
										uuid: FERDINAND_FOO_JR_PERSON_UUID,
										name: 'Ferdinand Foo Jr'
									},
									{
										model: 'COMPANY',
										uuid: SUB_INKISTS_LTD_COMPANY_UUID,
										name: 'Sub-Inkists Ltd'
									}
								]
							}
						]
					},
					venue: {
						model: 'VENUE',
						uuid: TRICYCLE_THEATRE_VENUE_UUID,
						name: 'Tricycle Theatre',
						surVenue: null
					},
					subProductions: [],
					producerCredits: [],
					cast: [],
					creativeCredits: [],
					crewCredits: []
				},
				{
					model: 'PRODUCTION',
					uuid: DURANDS_LINE_TRICYCLE_PRODUCTION_UUID,
					name: 'Durand\'s Line',
					startDate: '2009-04-17',
					pressDate: '2009-04-24',
					endDate: '2009-06-14',
					material: {
						model: 'MATERIAL',
						uuid: DURANDS_LINE_MATERIAL_UUID,
						name: 'Durand\'s Line',
						format: 'play',
						year: 2009,
						surMaterial: {
							model: 'MATERIAL',
							uuid: PART_ONE_INVASIONS_AND_INDEPENDENCE_MATERIAL_UUID,
							name: 'Part One - Invasions and Independence 1842-1930',
							surMaterial: {
								model: 'MATERIAL',
								uuid: THE_GREAT_GAME_AFGHANISTAN_MATERIAL_UUID,
								name: 'The Great Game: Afghanistan'
							}
						},
						writingCredits: [
							{
								model: 'WRITING_CREDIT',
								name: 'by',
								entities: [
									{
										model: 'PERSON',
										uuid: FERDINAND_FOO_JR_PERSON_UUID,
										name: 'Ferdinand Foo Jr'
									},
									{
										model: 'COMPANY',
										uuid: SUB_INKISTS_LTD_COMPANY_UUID,
										name: 'Sub-Inkists Ltd'
									}
								]
							}
						]
					},
					venue: {
						model: 'VENUE',
						uuid: TRICYCLE_THEATRE_VENUE_UUID,
						name: 'Tricycle Theatre',
						surVenue: null
					},
					subProductions: [],
					producerCredits: [],
					cast: [],
					creativeCredits: [],
					crewCredits: []
				},
				{
					model: 'PRODUCTION',
					uuid: CAMPAIGN_TRICYCLE_PRODUCTION_UUID,
					name: 'Campaign',
					startDate: '2009-04-17',
					pressDate: '2009-04-24',
					endDate: '2009-06-14',
					material: {
						model: 'MATERIAL',
						uuid: CAMPAIGN_MATERIAL_UUID,
						name: 'Campaign',
						format: 'play',
						year: 2009,
						surMaterial: {
							model: 'MATERIAL',
							uuid: PART_ONE_INVASIONS_AND_INDEPENDENCE_MATERIAL_UUID,
							name: 'Part One - Invasions and Independence 1842-1930',
							surMaterial: {
								model: 'MATERIAL',
								uuid: THE_GREAT_GAME_AFGHANISTAN_MATERIAL_UUID,
								name: 'The Great Game: Afghanistan'
							}
						},
						writingCredits: [
							{
								model: 'WRITING_CREDIT',
								name: 'by',
								entities: [
									{
										model: 'PERSON',
										uuid: FERDINAND_FOO_JR_PERSON_UUID,
										name: 'Ferdinand Foo Jr'
									},
									{
										model: 'COMPANY',
										uuid: SUB_INKISTS_LTD_COMPANY_UUID,
										name: 'Sub-Inkists Ltd'
									}
								]
							}
						]
					},
					venue: {
						model: 'VENUE',
						uuid: TRICYCLE_THEATRE_VENUE_UUID,
						name: 'Tricycle Theatre',
						surVenue: null
					},
					subProductions: [],
					producerCredits: [],
					cast: [],
					creativeCredits: [],
					crewCredits: []
				}
			];

			const { subProductions } = partOneInvasionsAndIndependenceTricycleProduction.body;

			expect(subProductions).to.deep.equal(expectedSubProductions);

		});

	});

	describe('Bugles at the Gates of Jalalabad at Tricycle Theatre', () => {

		it('includes Part One - Invasions and Independence 1842-1930 at Tricycle Theatre as its sur-production and The Great Game: Afghanistan at Tricycle Theatre as its sur-sur-production', () => {

			const expectedSurProduction = {
				model: 'PRODUCTION',
				uuid: PART_ONE_INVASIONS_AND_INDEPENDENCE_TRICYCLE_PRODUCTION_UUID,
				name: 'Part One - Invasions and Independence 1842-1930',
				startDate: '2009-04-17',
				pressDate: '2009-04-24',
				endDate: '2009-06-14',
				material: {
					model: 'MATERIAL',
					uuid: PART_ONE_INVASIONS_AND_INDEPENDENCE_MATERIAL_UUID,
					name: 'Part One - Invasions and Independence 1842-1930',
					format: 'sub-collection of plays',
					year: 2009,
					surMaterial: {
						model: 'MATERIAL',
						uuid: THE_GREAT_GAME_AFGHANISTAN_MATERIAL_UUID,
						name: 'The Great Game: Afghanistan',
						surMaterial: null
					},
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'by',
							entities: [
								{
									model: 'PERSON',
									uuid: FERDINAND_FOO_PERSON_UUID,
									name: 'Ferdinand Foo'
								},
								{
									model: 'COMPANY',
									uuid: MID_INKISTS_LTD_COMPANY_UUID,
									name: 'Mid-Inkists Ltd'
								}
							]
						}
					]
				},
				venue: {
					model: 'VENUE',
					uuid: TRICYCLE_THEATRE_VENUE_UUID,
					name: 'Tricycle Theatre',
					surVenue: null
				},
				surProduction: {
					model: 'PRODUCTION',
					uuid: THE_GREAT_GAME_AFGHANISTAN_TRICYCLE_PRODUCTION_UUID,
					name: 'The Great Game: Afghanistan',
					startDate: '2009-04-17',
					pressDate: '2009-04-24',
					endDate: '2009-06-14',
					material: {
						model: 'MATERIAL',
						uuid: THE_GREAT_GAME_AFGHANISTAN_MATERIAL_UUID,
						name: 'The Great Game: Afghanistan',
						format: 'collection of plays',
						year: 2009,
						surMaterial: null,
						writingCredits: [
							{
								model: 'WRITING_CREDIT',
								name: 'by',
								entities: [
									{
										model: 'PERSON',
										uuid: FERDINAND_FOO_SR_PERSON_UUID,
										name: 'Ferdinand Foo Sr'
									},
									{
										model: 'COMPANY',
										uuid: SUR_INKISTS_LTD_COMPANY_UUID,
										name: 'Sur-Inkists Ltd'
									}
								]
							}
						]
					},
					venue: {
						model: 'VENUE',
						uuid: TRICYCLE_THEATRE_VENUE_UUID,
						name: 'Tricycle Theatre',
						surVenue: null
					},
					producerCredits: [],
					cast: [],
					creativeCredits: [],
					crewCredits: []
				},
				producerCredits: [],
				cast: [],
				creativeCredits: [],
				crewCredits: []
			};

			const { surProduction } = buglesAtTheGatesOfJalalabadTricycleProduction.body;

			expect(surProduction).to.deep.equal(expectedSurProduction);

		});

	});

	describe('The Great Game: Afghanistan (material)', () => {

		it('includes its productions (but with no sur-productions as does not apply)', () => {

			const expectedProductions = [
				{
					model: 'PRODUCTION',
					uuid: THE_GREAT_GAME_AFGHANISTAN_RODA_PRODUCTION_UUID,
					name: 'The Great Game: Afghanistan',
					startDate: '2010-10-22',
					endDate: '2010-11-07',
					venue: {
						model: 'VENUE',
						uuid: RODA_THEATRE_VENUE_UUID,
						name: 'Roda Theatre',
						surVenue: {
							model: 'VENUE',
							uuid: BERKELEY_REPERTORY_THEATRE_VENUE_UUID,
							name: 'Berkeley Repertory Theatre'
						}
					},
					surProduction: null
				},
				{
					model: 'PRODUCTION',
					uuid: THE_GREAT_GAME_AFGHANISTAN_TRICYCLE_PRODUCTION_UUID,
					name: 'The Great Game: Afghanistan',
					startDate: '2009-04-17',
					endDate: '2009-06-14',
					venue: {
						model: 'VENUE',
						uuid: TRICYCLE_THEATRE_VENUE_UUID,
						name: 'Tricycle Theatre',
						surVenue: null
					},
					surProduction: null
				}
			];

			const { productions } = theGreatGameAfghanistanMaterial.body;

			expect(productions).to.deep.equal(expectedProductions);

		});

	});

	describe('Part One - Invasions and Independence 1842-1930 (material)', () => {

		it('includes its productions and their sur-productions', () => {

			const expectedProductions = [
				{
					model: 'PRODUCTION',
					uuid: PART_ONE_INVASIONS_AND_INDEPENDENCE_RODA_PRODUCTION_UUID,
					name: 'Part One - Invasions and Independence 1842-1930',
					startDate: '2010-10-22',
					endDate: '2010-11-07',
					venue: {
						model: 'VENUE',
						uuid: RODA_THEATRE_VENUE_UUID,
						name: 'Roda Theatre',
						surVenue: {
							model: 'VENUE',
							uuid: BERKELEY_REPERTORY_THEATRE_VENUE_UUID,
							name: 'Berkeley Repertory Theatre'
						}
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: THE_GREAT_GAME_AFGHANISTAN_RODA_PRODUCTION_UUID,
						name: 'The Great Game: Afghanistan',
						surProduction: null
					}
				},
				{
					model: 'PRODUCTION',
					uuid: PART_ONE_INVASIONS_AND_INDEPENDENCE_TRICYCLE_PRODUCTION_UUID,
					name: 'Part One - Invasions and Independence 1842-1930',
					startDate: '2009-04-17',
					endDate: '2009-06-14',
					venue: {
						model: 'VENUE',
						uuid: TRICYCLE_THEATRE_VENUE_UUID,
						name: 'Tricycle Theatre',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: THE_GREAT_GAME_AFGHANISTAN_TRICYCLE_PRODUCTION_UUID,
						name: 'The Great Game: Afghanistan',
						surProduction: null
					}
				}
			];

			const { productions } = partOneInvasionsAndIndependenceMaterial.body;

			expect(productions).to.deep.equal(expectedProductions);

		});

	});

	describe('Bugles at the Gates of Jalalabad (material)', () => {

		it('includes its productions and their sur-productions and sur-sur-productions', () => {

			const expectedProductions = [
				{
					model: 'PRODUCTION',
					uuid: BUGLES_AT_THE_GATES_OF_JALALABAD_RODA_PRODUCTION_UUID,
					name: 'Bugles at the Gates of Jalalabad',
					startDate: '2010-10-22',
					endDate: '2010-11-07',
					venue: {
						model: 'VENUE',
						uuid: RODA_THEATRE_VENUE_UUID,
						name: 'Roda Theatre',
						surVenue: {
							model: 'VENUE',
							uuid: BERKELEY_REPERTORY_THEATRE_VENUE_UUID,
							name: 'Berkeley Repertory Theatre'
						}
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_ONE_INVASIONS_AND_INDEPENDENCE_RODA_PRODUCTION_UUID,
						name: 'Part One - Invasions and Independence 1842-1930',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_RODA_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					}
				},
				{
					model: 'PRODUCTION',
					uuid: BUGLES_AT_THE_GATES_OF_JALALABAD_TRICYCLE_PRODUCTION_UUID,
					name: 'Bugles at the Gates of Jalalabad',
					startDate: '2009-04-17',
					endDate: '2009-06-14',
					venue: {
						model: 'VENUE',
						uuid: TRICYCLE_THEATRE_VENUE_UUID,
						name: 'Tricycle Theatre',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_ONE_INVASIONS_AND_INDEPENDENCE_TRICYCLE_PRODUCTION_UUID,
						name: 'Part One - Invasions and Independence 1842-1930',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_TRICYCLE_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					}
				}
			];

			const { productions } = buglesAtTheGatesOfJalalabadMaterial.body;

			expect(productions).to.deep.equal(expectedProductions);

		});

	});

	describe('Berkeley Repertory Theatre (venue)', () => {

		it('includes productions at this venue, including the specific sub-venue and, where applicable, corresponding sur-productions and sur-sur-productions; will exclude sur-productions when included via sub-production association', () => {

			const expectedProductions = [
				{
					model: 'PRODUCTION',
					uuid: ON_THE_SIDE_OF_THE_ANGELS_RODA_PRODUCTION_UUID,
					name: 'On the Side of the Angels',
					startDate: '2010-10-22',
					endDate: '2010-11-07',
					subVenue: {
						model: 'VENUE',
						uuid: RODA_THEATRE_VENUE_UUID,
						name: 'Roda Theatre'
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_THREE_ENDURING_FREEDOM_RODA_PRODUCTION_UUID,
						name: 'Part Three - Enduring Freedom 1996-2009',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_RODA_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					}
				},
				{
					model: 'PRODUCTION',
					uuid: THE_NIGHT_IS_DARKEST_BEFORE_THE_DAWN_RODA_PRODUCTION_UUID,
					name: 'The Night Is Darkest Before the Dawn',
					startDate: '2010-10-22',
					endDate: '2010-11-07',
					subVenue: {
						model: 'VENUE',
						uuid: RODA_THEATRE_VENUE_UUID,
						name: 'Roda Theatre'
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_THREE_ENDURING_FREEDOM_RODA_PRODUCTION_UUID,
						name: 'Part Three - Enduring Freedom 1996-2009',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_RODA_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					}
				},
				{
					model: 'PRODUCTION',
					uuid: HONEY_RODA_PRODUCTION_UUID,
					name: 'Honey',
					startDate: '2010-10-22',
					endDate: '2010-11-07',
					subVenue: {
						model: 'VENUE',
						uuid: RODA_THEATRE_VENUE_UUID,
						name: 'Roda Theatre'
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_THREE_ENDURING_FREEDOM_RODA_PRODUCTION_UUID,
						name: 'Part Three - Enduring Freedom 1996-2009',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_RODA_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					}
				},
				{
					model: 'PRODUCTION',
					uuid: MINISKIRTS_OF_KABUL_RODA_PRODUCTION_UUID,
					name: 'Miniskirts of Kabul',
					startDate: '2010-10-22',
					endDate: '2010-11-07',
					subVenue: {
						model: 'VENUE',
						uuid: RODA_THEATRE_VENUE_UUID,
						name: 'Roda Theatre'
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_TWO_COMMUNISM_THE_MUJAHIDEEN_AND_THE_TALIBAN_RODA_PRODUCTION_UUID,
						name: 'Part Two - Communism, the Mujahideen and the Taliban 1979-1996',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_RODA_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					}
				},
				{
					model: 'PRODUCTION',
					uuid: BLOOD_AND_GIFTS_RODA_PRODUCTION_UUID,
					name: 'Blood and Gifts',
					startDate: '2010-10-22',
					endDate: '2010-11-07',
					subVenue: {
						model: 'VENUE',
						uuid: RODA_THEATRE_VENUE_UUID,
						name: 'Roda Theatre'
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_TWO_COMMUNISM_THE_MUJAHIDEEN_AND_THE_TALIBAN_RODA_PRODUCTION_UUID,
						name: 'Part Two - Communism, the Mujahideen and the Taliban 1979-1996',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_RODA_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					}
				},
				{
					model: 'PRODUCTION',
					uuid: BLACK_TULIPS_RODA_PRODUCTION_UUID,
					name: 'Black Tulips',
					startDate: '2010-10-22',
					endDate: '2010-11-07',
					subVenue: {
						model: 'VENUE',
						uuid: RODA_THEATRE_VENUE_UUID,
						name: 'Roda Theatre'
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_TWO_COMMUNISM_THE_MUJAHIDEEN_AND_THE_TALIBAN_RODA_PRODUCTION_UUID,
						name: 'Part Two - Communism, the Mujahideen and the Taliban 1979-1996',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_RODA_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					}
				},
				{
					model: 'PRODUCTION',
					uuid: CAMPAIGN_RODA_PRODUCTION_UUID,
					name: 'Campaign',
					startDate: '2010-10-22',
					endDate: '2010-11-07',
					subVenue: {
						model: 'VENUE',
						uuid: RODA_THEATRE_VENUE_UUID,
						name: 'Roda Theatre'
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_ONE_INVASIONS_AND_INDEPENDENCE_RODA_PRODUCTION_UUID,
						name: 'Part One - Invasions and Independence 1842-1930',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_RODA_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					}
				},
				{
					model: 'PRODUCTION',
					uuid: DURANDS_LINE_RODA_PRODUCTION_UUID,
					name: 'Durand\'s Line',
					startDate: '2010-10-22',
					endDate: '2010-11-07',
					subVenue: {
						model: 'VENUE',
						uuid: RODA_THEATRE_VENUE_UUID,
						name: 'Roda Theatre'
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_ONE_INVASIONS_AND_INDEPENDENCE_RODA_PRODUCTION_UUID,
						name: 'Part One - Invasions and Independence 1842-1930',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_RODA_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					}
				},
				{
					model: 'PRODUCTION',
					uuid: BUGLES_AT_THE_GATES_OF_JALALABAD_RODA_PRODUCTION_UUID,
					name: 'Bugles at the Gates of Jalalabad',
					startDate: '2010-10-22',
					endDate: '2010-11-07',
					subVenue: {
						model: 'VENUE',
						uuid: RODA_THEATRE_VENUE_UUID,
						name: 'Roda Theatre'
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_ONE_INVASIONS_AND_INDEPENDENCE_RODA_PRODUCTION_UUID,
						name: 'Part One - Invasions and Independence 1842-1930',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_RODA_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					}
				}
			];

			const { productions } = berkeleyRepertoryTheatreVenue.body;

			expect(productions).to.deep.equal(expectedProductions);

		});

	});

	describe('Roda Theatre (venue)', () => {

		it('includes productions at this venue and, where applicable, corresponding sur-productions and sur-sur-productions; will exclude sur-productions when included via sub-production association', () => {

			const expectedProductions = [
				{
					model: 'PRODUCTION',
					uuid: ON_THE_SIDE_OF_THE_ANGELS_RODA_PRODUCTION_UUID,
					name: 'On the Side of the Angels',
					startDate: '2010-10-22',
					endDate: '2010-11-07',
					subVenue: null,
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_THREE_ENDURING_FREEDOM_RODA_PRODUCTION_UUID,
						name: 'Part Three - Enduring Freedom 1996-2009',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_RODA_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					}
				},
				{
					model: 'PRODUCTION',
					uuid: THE_NIGHT_IS_DARKEST_BEFORE_THE_DAWN_RODA_PRODUCTION_UUID,
					name: 'The Night Is Darkest Before the Dawn',
					startDate: '2010-10-22',
					endDate: '2010-11-07',
					subVenue: null,
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_THREE_ENDURING_FREEDOM_RODA_PRODUCTION_UUID,
						name: 'Part Three - Enduring Freedom 1996-2009',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_RODA_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					}
				},
				{
					model: 'PRODUCTION',
					uuid: HONEY_RODA_PRODUCTION_UUID,
					name: 'Honey',
					startDate: '2010-10-22',
					endDate: '2010-11-07',
					subVenue: null,
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_THREE_ENDURING_FREEDOM_RODA_PRODUCTION_UUID,
						name: 'Part Three - Enduring Freedom 1996-2009',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_RODA_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					}
				},
				{
					model: 'PRODUCTION',
					uuid: MINISKIRTS_OF_KABUL_RODA_PRODUCTION_UUID,
					name: 'Miniskirts of Kabul',
					startDate: '2010-10-22',
					endDate: '2010-11-07',
					subVenue: null,
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_TWO_COMMUNISM_THE_MUJAHIDEEN_AND_THE_TALIBAN_RODA_PRODUCTION_UUID,
						name: 'Part Two - Communism, the Mujahideen and the Taliban 1979-1996',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_RODA_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					}
				},
				{
					model: 'PRODUCTION',
					uuid: BLOOD_AND_GIFTS_RODA_PRODUCTION_UUID,
					name: 'Blood and Gifts',
					startDate: '2010-10-22',
					endDate: '2010-11-07',
					subVenue: null,
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_TWO_COMMUNISM_THE_MUJAHIDEEN_AND_THE_TALIBAN_RODA_PRODUCTION_UUID,
						name: 'Part Two - Communism, the Mujahideen and the Taliban 1979-1996',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_RODA_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					}
				},
				{
					model: 'PRODUCTION',
					uuid: BLACK_TULIPS_RODA_PRODUCTION_UUID,
					name: 'Black Tulips',
					startDate: '2010-10-22',
					endDate: '2010-11-07',
					subVenue: null,
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_TWO_COMMUNISM_THE_MUJAHIDEEN_AND_THE_TALIBAN_RODA_PRODUCTION_UUID,
						name: 'Part Two - Communism, the Mujahideen and the Taliban 1979-1996',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_RODA_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					}
				},
				{
					model: 'PRODUCTION',
					uuid: CAMPAIGN_RODA_PRODUCTION_UUID,
					name: 'Campaign',
					startDate: '2010-10-22',
					endDate: '2010-11-07',
					subVenue: null,
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_ONE_INVASIONS_AND_INDEPENDENCE_RODA_PRODUCTION_UUID,
						name: 'Part One - Invasions and Independence 1842-1930',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_RODA_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					}
				},
				{
					model: 'PRODUCTION',
					uuid: DURANDS_LINE_RODA_PRODUCTION_UUID,
					name: 'Durand\'s Line',
					startDate: '2010-10-22',
					endDate: '2010-11-07',
					subVenue: null,
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_ONE_INVASIONS_AND_INDEPENDENCE_RODA_PRODUCTION_UUID,
						name: 'Part One - Invasions and Independence 1842-1930',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_RODA_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					}
				},
				{
					model: 'PRODUCTION',
					uuid: BUGLES_AT_THE_GATES_OF_JALALABAD_RODA_PRODUCTION_UUID,
					name: 'Bugles at the Gates of Jalalabad',
					startDate: '2010-10-22',
					endDate: '2010-11-07',
					subVenue: null,
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_ONE_INVASIONS_AND_INDEPENDENCE_RODA_PRODUCTION_UUID,
						name: 'Part One - Invasions and Independence 1842-1930',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_RODA_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					}
				}
			];

			const { productions } = rodaTheatreVenue.body;

			expect(productions).to.deep.equal(expectedProductions);

		});

	});

	describe('Nicolas Kent Jr (person)', () => {

		it('includes productions for which they have a producer credit, including the sur-production and sur-sur-production', () => {

			const expectedProducerProductions = [
				{
					model: 'PRODUCTION',
					uuid: ON_THE_SIDE_OF_THE_ANGELS_RODA_PRODUCTION_UUID,
					name: 'On the Side of the Angels',
					startDate: '2010-10-22',
					endDate: '2010-11-07',
					venue: {
						model: 'VENUE',
						uuid: RODA_THEATRE_VENUE_UUID,
						name: 'Roda Theatre',
						surVenue: {
							model: 'VENUE',
							uuid: BERKELEY_REPERTORY_THEATRE_VENUE_UUID,
							name: 'Berkeley Repertory Theatre'
						}
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_THREE_ENDURING_FREEDOM_RODA_PRODUCTION_UUID,
						name: 'Part Three - Enduring Freedom 1996-2009',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_RODA_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					producerCredits: [
						{
							model: 'PRODUCER_CREDIT',
							name: 'produced by',
							entities: [
								{
									model: 'PERSON',
									uuid: NICOLAS_KENT_JR_PERSON_UUID,
									name: 'Nicolas Kent Jr'
								},
								{
									model: 'COMPANY',
									uuid: SUB_TRICYCLE_THEATRE_COMPANY_UUID,
									name: 'Sub-Tricycle Theatre Company',
									members: [
										{
											model: 'PERSON',
											uuid: ZOË_INGENHAAG_JR_PERSON_UUID,
											name: 'Zoë Ingenhaag Jr'
										}
									]
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: THE_NIGHT_IS_DARKEST_BEFORE_THE_DAWN_RODA_PRODUCTION_UUID,
					name: 'The Night Is Darkest Before the Dawn',
					startDate: '2010-10-22',
					endDate: '2010-11-07',
					venue: {
						model: 'VENUE',
						uuid: RODA_THEATRE_VENUE_UUID,
						name: 'Roda Theatre',
						surVenue: {
							model: 'VENUE',
							uuid: BERKELEY_REPERTORY_THEATRE_VENUE_UUID,
							name: 'Berkeley Repertory Theatre'
						}
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_THREE_ENDURING_FREEDOM_RODA_PRODUCTION_UUID,
						name: 'Part Three - Enduring Freedom 1996-2009',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_RODA_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					producerCredits: [
						{
							model: 'PRODUCER_CREDIT',
							name: 'produced by',
							entities: [
								{
									model: 'PERSON',
									uuid: NICOLAS_KENT_JR_PERSON_UUID,
									name: 'Nicolas Kent Jr'
								},
								{
									model: 'COMPANY',
									uuid: SUB_TRICYCLE_THEATRE_COMPANY_UUID,
									name: 'Sub-Tricycle Theatre Company',
									members: [
										{
											model: 'PERSON',
											uuid: ZOË_INGENHAAG_JR_PERSON_UUID,
											name: 'Zoë Ingenhaag Jr'
										}
									]
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: HONEY_RODA_PRODUCTION_UUID,
					name: 'Honey',
					startDate: '2010-10-22',
					endDate: '2010-11-07',
					venue: {
						model: 'VENUE',
						uuid: RODA_THEATRE_VENUE_UUID,
						name: 'Roda Theatre',
						surVenue: {
							model: 'VENUE',
							uuid: BERKELEY_REPERTORY_THEATRE_VENUE_UUID,
							name: 'Berkeley Repertory Theatre'
						}
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_THREE_ENDURING_FREEDOM_RODA_PRODUCTION_UUID,
						name: 'Part Three - Enduring Freedom 1996-2009',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_RODA_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					producerCredits: [
						{
							model: 'PRODUCER_CREDIT',
							name: 'produced by',
							entities: [
								{
									model: 'PERSON',
									uuid: NICOLAS_KENT_JR_PERSON_UUID,
									name: 'Nicolas Kent Jr'
								},
								{
									model: 'COMPANY',
									uuid: SUB_TRICYCLE_THEATRE_COMPANY_UUID,
									name: 'Sub-Tricycle Theatre Company',
									members: [
										{
											model: 'PERSON',
											uuid: ZOË_INGENHAAG_JR_PERSON_UUID,
											name: 'Zoë Ingenhaag Jr'
										}
									]
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: MINISKIRTS_OF_KABUL_RODA_PRODUCTION_UUID,
					name: 'Miniskirts of Kabul',
					startDate: '2010-10-22',
					endDate: '2010-11-07',
					venue: {
						model: 'VENUE',
						uuid: RODA_THEATRE_VENUE_UUID,
						name: 'Roda Theatre',
						surVenue: {
							model: 'VENUE',
							uuid: BERKELEY_REPERTORY_THEATRE_VENUE_UUID,
							name: 'Berkeley Repertory Theatre'
						}
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_TWO_COMMUNISM_THE_MUJAHIDEEN_AND_THE_TALIBAN_RODA_PRODUCTION_UUID,
						name: 'Part Two - Communism, the Mujahideen and the Taliban 1979-1996',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_RODA_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					producerCredits: [
						{
							model: 'PRODUCER_CREDIT',
							name: 'produced by',
							entities: [
								{
									model: 'PERSON',
									uuid: NICOLAS_KENT_JR_PERSON_UUID,
									name: 'Nicolas Kent Jr'
								},
								{
									model: 'COMPANY',
									uuid: SUB_TRICYCLE_THEATRE_COMPANY_UUID,
									name: 'Sub-Tricycle Theatre Company',
									members: [
										{
											model: 'PERSON',
											uuid: ZOË_INGENHAAG_JR_PERSON_UUID,
											name: 'Zoë Ingenhaag Jr'
										}
									]
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: BLOOD_AND_GIFTS_RODA_PRODUCTION_UUID,
					name: 'Blood and Gifts',
					startDate: '2010-10-22',
					endDate: '2010-11-07',
					venue: {
						model: 'VENUE',
						uuid: RODA_THEATRE_VENUE_UUID,
						name: 'Roda Theatre',
						surVenue: {
							model: 'VENUE',
							uuid: BERKELEY_REPERTORY_THEATRE_VENUE_UUID,
							name: 'Berkeley Repertory Theatre'
						}
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_TWO_COMMUNISM_THE_MUJAHIDEEN_AND_THE_TALIBAN_RODA_PRODUCTION_UUID,
						name: 'Part Two - Communism, the Mujahideen and the Taliban 1979-1996',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_RODA_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					producerCredits: [
						{
							model: 'PRODUCER_CREDIT',
							name: 'produced by',
							entities: [
								{
									model: 'PERSON',
									uuid: NICOLAS_KENT_JR_PERSON_UUID,
									name: 'Nicolas Kent Jr'
								},
								{
									model: 'COMPANY',
									uuid: SUB_TRICYCLE_THEATRE_COMPANY_UUID,
									name: 'Sub-Tricycle Theatre Company',
									members: [
										{
											model: 'PERSON',
											uuid: ZOË_INGENHAAG_JR_PERSON_UUID,
											name: 'Zoë Ingenhaag Jr'
										}
									]
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: BLACK_TULIPS_RODA_PRODUCTION_UUID,
					name: 'Black Tulips',
					startDate: '2010-10-22',
					endDate: '2010-11-07',
					venue: {
						model: 'VENUE',
						uuid: RODA_THEATRE_VENUE_UUID,
						name: 'Roda Theatre',
						surVenue: {
							model: 'VENUE',
							uuid: BERKELEY_REPERTORY_THEATRE_VENUE_UUID,
							name: 'Berkeley Repertory Theatre'
						}
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_TWO_COMMUNISM_THE_MUJAHIDEEN_AND_THE_TALIBAN_RODA_PRODUCTION_UUID,
						name: 'Part Two - Communism, the Mujahideen and the Taliban 1979-1996',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_RODA_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					producerCredits: [
						{
							model: 'PRODUCER_CREDIT',
							name: 'produced by',
							entities: [
								{
									model: 'PERSON',
									uuid: NICOLAS_KENT_JR_PERSON_UUID,
									name: 'Nicolas Kent Jr'
								},
								{
									model: 'COMPANY',
									uuid: SUB_TRICYCLE_THEATRE_COMPANY_UUID,
									name: 'Sub-Tricycle Theatre Company',
									members: [
										{
											model: 'PERSON',
											uuid: ZOË_INGENHAAG_JR_PERSON_UUID,
											name: 'Zoë Ingenhaag Jr'
										}
									]
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: CAMPAIGN_RODA_PRODUCTION_UUID,
					name: 'Campaign',
					startDate: '2010-10-22',
					endDate: '2010-11-07',
					venue: {
						model: 'VENUE',
						uuid: RODA_THEATRE_VENUE_UUID,
						name: 'Roda Theatre',
						surVenue: {
							model: 'VENUE',
							uuid: BERKELEY_REPERTORY_THEATRE_VENUE_UUID,
							name: 'Berkeley Repertory Theatre'
						}
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_ONE_INVASIONS_AND_INDEPENDENCE_RODA_PRODUCTION_UUID,
						name: 'Part One - Invasions and Independence 1842-1930',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_RODA_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					producerCredits: [
						{
							model: 'PRODUCER_CREDIT',
							name: 'produced by',
							entities: [
								{
									model: 'PERSON',
									uuid: NICOLAS_KENT_JR_PERSON_UUID,
									name: 'Nicolas Kent Jr'
								},
								{
									model: 'COMPANY',
									uuid: SUB_TRICYCLE_THEATRE_COMPANY_UUID,
									name: 'Sub-Tricycle Theatre Company',
									members: [
										{
											model: 'PERSON',
											uuid: ZOË_INGENHAAG_JR_PERSON_UUID,
											name: 'Zoë Ingenhaag Jr'
										}
									]
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: DURANDS_LINE_RODA_PRODUCTION_UUID,
					name: 'Durand\'s Line',
					startDate: '2010-10-22',
					endDate: '2010-11-07',
					venue: {
						model: 'VENUE',
						uuid: RODA_THEATRE_VENUE_UUID,
						name: 'Roda Theatre',
						surVenue: {
							model: 'VENUE',
							uuid: BERKELEY_REPERTORY_THEATRE_VENUE_UUID,
							name: 'Berkeley Repertory Theatre'
						}
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_ONE_INVASIONS_AND_INDEPENDENCE_RODA_PRODUCTION_UUID,
						name: 'Part One - Invasions and Independence 1842-1930',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_RODA_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					producerCredits: [
						{
							model: 'PRODUCER_CREDIT',
							name: 'produced by',
							entities: [
								{
									model: 'PERSON',
									uuid: NICOLAS_KENT_JR_PERSON_UUID,
									name: 'Nicolas Kent Jr'
								},
								{
									model: 'COMPANY',
									uuid: SUB_TRICYCLE_THEATRE_COMPANY_UUID,
									name: 'Sub-Tricycle Theatre Company',
									members: [
										{
											model: 'PERSON',
											uuid: ZOË_INGENHAAG_JR_PERSON_UUID,
											name: 'Zoë Ingenhaag Jr'
										}
									]
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: BUGLES_AT_THE_GATES_OF_JALALABAD_RODA_PRODUCTION_UUID,
					name: 'Bugles at the Gates of Jalalabad',
					startDate: '2010-10-22',
					endDate: '2010-11-07',
					venue: {
						model: 'VENUE',
						uuid: RODA_THEATRE_VENUE_UUID,
						name: 'Roda Theatre',
						surVenue: {
							model: 'VENUE',
							uuid: BERKELEY_REPERTORY_THEATRE_VENUE_UUID,
							name: 'Berkeley Repertory Theatre'
						}
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_ONE_INVASIONS_AND_INDEPENDENCE_RODA_PRODUCTION_UUID,
						name: 'Part One - Invasions and Independence 1842-1930',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_RODA_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					producerCredits: [
						{
							model: 'PRODUCER_CREDIT',
							name: 'produced by',
							entities: [
								{
									model: 'PERSON',
									uuid: NICOLAS_KENT_JR_PERSON_UUID,
									name: 'Nicolas Kent Jr'
								},
								{
									model: 'COMPANY',
									uuid: SUB_TRICYCLE_THEATRE_COMPANY_UUID,
									name: 'Sub-Tricycle Theatre Company',
									members: [
										{
											model: 'PERSON',
											uuid: ZOË_INGENHAAG_JR_PERSON_UUID,
											name: 'Zoë Ingenhaag Jr'
										}
									]
								}
							]
						}
					]
				}
			];

			const { producerProductions } = nicolasKentJrPerson.body;

			expect(producerProductions).to.deep.equal(expectedProducerProductions);

		});

	});

	describe('Sub-Tricycle Theatre Company (company)', () => {

		it('includes productions for which they have a producer credit, including the sur-production and sur-sur-production', () => {

			const expectedProducerProductions = [
				{
					model: 'PRODUCTION',
					uuid: ON_THE_SIDE_OF_THE_ANGELS_RODA_PRODUCTION_UUID,
					name: 'On the Side of the Angels',
					startDate: '2010-10-22',
					endDate: '2010-11-07',
					venue: {
						model: 'VENUE',
						uuid: RODA_THEATRE_VENUE_UUID,
						name: 'Roda Theatre',
						surVenue: {
							model: 'VENUE',
							uuid: BERKELEY_REPERTORY_THEATRE_VENUE_UUID,
							name: 'Berkeley Repertory Theatre'
						}
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_THREE_ENDURING_FREEDOM_RODA_PRODUCTION_UUID,
						name: 'Part Three - Enduring Freedom 1996-2009',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_RODA_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					producerCredits: [
						{
							model: 'PRODUCER_CREDIT',
							name: 'produced by',
							entities: [
								{
									model: 'PERSON',
									uuid: NICOLAS_KENT_JR_PERSON_UUID,
									name: 'Nicolas Kent Jr'
								},
								{
									model: 'COMPANY',
									uuid: SUB_TRICYCLE_THEATRE_COMPANY_UUID,
									name: 'Sub-Tricycle Theatre Company',
									members: [
										{
											model: 'PERSON',
											uuid: ZOË_INGENHAAG_JR_PERSON_UUID,
											name: 'Zoë Ingenhaag Jr'
										}
									]
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: THE_NIGHT_IS_DARKEST_BEFORE_THE_DAWN_RODA_PRODUCTION_UUID,
					name: 'The Night Is Darkest Before the Dawn',
					startDate: '2010-10-22',
					endDate: '2010-11-07',
					venue: {
						model: 'VENUE',
						uuid: RODA_THEATRE_VENUE_UUID,
						name: 'Roda Theatre',
						surVenue: {
							model: 'VENUE',
							uuid: BERKELEY_REPERTORY_THEATRE_VENUE_UUID,
							name: 'Berkeley Repertory Theatre'
						}
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_THREE_ENDURING_FREEDOM_RODA_PRODUCTION_UUID,
						name: 'Part Three - Enduring Freedom 1996-2009',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_RODA_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					producerCredits: [
						{
							model: 'PRODUCER_CREDIT',
							name: 'produced by',
							entities: [
								{
									model: 'PERSON',
									uuid: NICOLAS_KENT_JR_PERSON_UUID,
									name: 'Nicolas Kent Jr'
								},
								{
									model: 'COMPANY',
									uuid: SUB_TRICYCLE_THEATRE_COMPANY_UUID,
									name: 'Sub-Tricycle Theatre Company',
									members: [
										{
											model: 'PERSON',
											uuid: ZOË_INGENHAAG_JR_PERSON_UUID,
											name: 'Zoë Ingenhaag Jr'
										}
									]
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: HONEY_RODA_PRODUCTION_UUID,
					name: 'Honey',
					startDate: '2010-10-22',
					endDate: '2010-11-07',
					venue: {
						model: 'VENUE',
						uuid: RODA_THEATRE_VENUE_UUID,
						name: 'Roda Theatre',
						surVenue: {
							model: 'VENUE',
							uuid: BERKELEY_REPERTORY_THEATRE_VENUE_UUID,
							name: 'Berkeley Repertory Theatre'
						}
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_THREE_ENDURING_FREEDOM_RODA_PRODUCTION_UUID,
						name: 'Part Three - Enduring Freedom 1996-2009',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_RODA_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					producerCredits: [
						{
							model: 'PRODUCER_CREDIT',
							name: 'produced by',
							entities: [
								{
									model: 'PERSON',
									uuid: NICOLAS_KENT_JR_PERSON_UUID,
									name: 'Nicolas Kent Jr'
								},
								{
									model: 'COMPANY',
									uuid: SUB_TRICYCLE_THEATRE_COMPANY_UUID,
									name: 'Sub-Tricycle Theatre Company',
									members: [
										{
											model: 'PERSON',
											uuid: ZOË_INGENHAAG_JR_PERSON_UUID,
											name: 'Zoë Ingenhaag Jr'
										}
									]
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: MINISKIRTS_OF_KABUL_RODA_PRODUCTION_UUID,
					name: 'Miniskirts of Kabul',
					startDate: '2010-10-22',
					endDate: '2010-11-07',
					venue: {
						model: 'VENUE',
						uuid: RODA_THEATRE_VENUE_UUID,
						name: 'Roda Theatre',
						surVenue: {
							model: 'VENUE',
							uuid: BERKELEY_REPERTORY_THEATRE_VENUE_UUID,
							name: 'Berkeley Repertory Theatre'
						}
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_TWO_COMMUNISM_THE_MUJAHIDEEN_AND_THE_TALIBAN_RODA_PRODUCTION_UUID,
						name: 'Part Two - Communism, the Mujahideen and the Taliban 1979-1996',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_RODA_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					producerCredits: [
						{
							model: 'PRODUCER_CREDIT',
							name: 'produced by',
							entities: [
								{
									model: 'PERSON',
									uuid: NICOLAS_KENT_JR_PERSON_UUID,
									name: 'Nicolas Kent Jr'
								},
								{
									model: 'COMPANY',
									uuid: SUB_TRICYCLE_THEATRE_COMPANY_UUID,
									name: 'Sub-Tricycle Theatre Company',
									members: [
										{
											model: 'PERSON',
											uuid: ZOË_INGENHAAG_JR_PERSON_UUID,
											name: 'Zoë Ingenhaag Jr'
										}
									]
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: BLOOD_AND_GIFTS_RODA_PRODUCTION_UUID,
					name: 'Blood and Gifts',
					startDate: '2010-10-22',
					endDate: '2010-11-07',
					venue: {
						model: 'VENUE',
						uuid: RODA_THEATRE_VENUE_UUID,
						name: 'Roda Theatre',
						surVenue: {
							model: 'VENUE',
							uuid: BERKELEY_REPERTORY_THEATRE_VENUE_UUID,
							name: 'Berkeley Repertory Theatre'
						}
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_TWO_COMMUNISM_THE_MUJAHIDEEN_AND_THE_TALIBAN_RODA_PRODUCTION_UUID,
						name: 'Part Two - Communism, the Mujahideen and the Taliban 1979-1996',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_RODA_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					producerCredits: [
						{
							model: 'PRODUCER_CREDIT',
							name: 'produced by',
							entities: [
								{
									model: 'PERSON',
									uuid: NICOLAS_KENT_JR_PERSON_UUID,
									name: 'Nicolas Kent Jr'
								},
								{
									model: 'COMPANY',
									uuid: SUB_TRICYCLE_THEATRE_COMPANY_UUID,
									name: 'Sub-Tricycle Theatre Company',
									members: [
										{
											model: 'PERSON',
											uuid: ZOË_INGENHAAG_JR_PERSON_UUID,
											name: 'Zoë Ingenhaag Jr'
										}
									]
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: BLACK_TULIPS_RODA_PRODUCTION_UUID,
					name: 'Black Tulips',
					startDate: '2010-10-22',
					endDate: '2010-11-07',
					venue: {
						model: 'VENUE',
						uuid: RODA_THEATRE_VENUE_UUID,
						name: 'Roda Theatre',
						surVenue: {
							model: 'VENUE',
							uuid: BERKELEY_REPERTORY_THEATRE_VENUE_UUID,
							name: 'Berkeley Repertory Theatre'
						}
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_TWO_COMMUNISM_THE_MUJAHIDEEN_AND_THE_TALIBAN_RODA_PRODUCTION_UUID,
						name: 'Part Two - Communism, the Mujahideen and the Taliban 1979-1996',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_RODA_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					producerCredits: [
						{
							model: 'PRODUCER_CREDIT',
							name: 'produced by',
							entities: [
								{
									model: 'PERSON',
									uuid: NICOLAS_KENT_JR_PERSON_UUID,
									name: 'Nicolas Kent Jr'
								},
								{
									model: 'COMPANY',
									uuid: SUB_TRICYCLE_THEATRE_COMPANY_UUID,
									name: 'Sub-Tricycle Theatre Company',
									members: [
										{
											model: 'PERSON',
											uuid: ZOË_INGENHAAG_JR_PERSON_UUID,
											name: 'Zoë Ingenhaag Jr'
										}
									]
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: CAMPAIGN_RODA_PRODUCTION_UUID,
					name: 'Campaign',
					startDate: '2010-10-22',
					endDate: '2010-11-07',
					venue: {
						model: 'VENUE',
						uuid: RODA_THEATRE_VENUE_UUID,
						name: 'Roda Theatre',
						surVenue: {
							model: 'VENUE',
							uuid: BERKELEY_REPERTORY_THEATRE_VENUE_UUID,
							name: 'Berkeley Repertory Theatre'
						}
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_ONE_INVASIONS_AND_INDEPENDENCE_RODA_PRODUCTION_UUID,
						name: 'Part One - Invasions and Independence 1842-1930',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_RODA_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					producerCredits: [
						{
							model: 'PRODUCER_CREDIT',
							name: 'produced by',
							entities: [
								{
									model: 'PERSON',
									uuid: NICOLAS_KENT_JR_PERSON_UUID,
									name: 'Nicolas Kent Jr'
								},
								{
									model: 'COMPANY',
									uuid: SUB_TRICYCLE_THEATRE_COMPANY_UUID,
									name: 'Sub-Tricycle Theatre Company',
									members: [
										{
											model: 'PERSON',
											uuid: ZOË_INGENHAAG_JR_PERSON_UUID,
											name: 'Zoë Ingenhaag Jr'
										}
									]
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: DURANDS_LINE_RODA_PRODUCTION_UUID,
					name: 'Durand\'s Line',
					startDate: '2010-10-22',
					endDate: '2010-11-07',
					venue: {
						model: 'VENUE',
						uuid: RODA_THEATRE_VENUE_UUID,
						name: 'Roda Theatre',
						surVenue: {
							model: 'VENUE',
							uuid: BERKELEY_REPERTORY_THEATRE_VENUE_UUID,
							name: 'Berkeley Repertory Theatre'
						}
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_ONE_INVASIONS_AND_INDEPENDENCE_RODA_PRODUCTION_UUID,
						name: 'Part One - Invasions and Independence 1842-1930',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_RODA_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					producerCredits: [
						{
							model: 'PRODUCER_CREDIT',
							name: 'produced by',
							entities: [
								{
									model: 'PERSON',
									uuid: NICOLAS_KENT_JR_PERSON_UUID,
									name: 'Nicolas Kent Jr'
								},
								{
									model: 'COMPANY',
									uuid: SUB_TRICYCLE_THEATRE_COMPANY_UUID,
									name: 'Sub-Tricycle Theatre Company',
									members: [
										{
											model: 'PERSON',
											uuid: ZOË_INGENHAAG_JR_PERSON_UUID,
											name: 'Zoë Ingenhaag Jr'
										}
									]
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: BUGLES_AT_THE_GATES_OF_JALALABAD_RODA_PRODUCTION_UUID,
					name: 'Bugles at the Gates of Jalalabad',
					startDate: '2010-10-22',
					endDate: '2010-11-07',
					venue: {
						model: 'VENUE',
						uuid: RODA_THEATRE_VENUE_UUID,
						name: 'Roda Theatre',
						surVenue: {
							model: 'VENUE',
							uuid: BERKELEY_REPERTORY_THEATRE_VENUE_UUID,
							name: 'Berkeley Repertory Theatre'
						}
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_ONE_INVASIONS_AND_INDEPENDENCE_RODA_PRODUCTION_UUID,
						name: 'Part One - Invasions and Independence 1842-1930',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_RODA_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					producerCredits: [
						{
							model: 'PRODUCER_CREDIT',
							name: 'produced by',
							entities: [
								{
									model: 'PERSON',
									uuid: NICOLAS_KENT_JR_PERSON_UUID,
									name: 'Nicolas Kent Jr'
								},
								{
									model: 'COMPANY',
									uuid: SUB_TRICYCLE_THEATRE_COMPANY_UUID,
									name: 'Sub-Tricycle Theatre Company',
									members: [
										{
											model: 'PERSON',
											uuid: ZOË_INGENHAAG_JR_PERSON_UUID,
											name: 'Zoë Ingenhaag Jr'
										}
									]
								}
							]
						}
					]
				}
			];

			const { producerProductions } = subTricycleTheatreCompany.body;

			expect(producerProductions).to.deep.equal(expectedProducerProductions);

		});

	});

	describe('Zoë Ingenhaag Jr (person)', () => {

		it('includes productions for which they have a producer credit, including the sur-production and sur-sur-production', () => {

			const expectedProducerProductions = [
				{
					model: 'PRODUCTION',
					uuid: ON_THE_SIDE_OF_THE_ANGELS_RODA_PRODUCTION_UUID,
					name: 'On the Side of the Angels',
					startDate: '2010-10-22',
					endDate: '2010-11-07',
					venue: {
						model: 'VENUE',
						uuid: RODA_THEATRE_VENUE_UUID,
						name: 'Roda Theatre',
						surVenue: {
							model: 'VENUE',
							uuid: BERKELEY_REPERTORY_THEATRE_VENUE_UUID,
							name: 'Berkeley Repertory Theatre'
						}
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_THREE_ENDURING_FREEDOM_RODA_PRODUCTION_UUID,
						name: 'Part Three - Enduring Freedom 1996-2009',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_RODA_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					producerCredits: [
						{
							model: 'PRODUCER_CREDIT',
							name: 'produced by',
							entities: [
								{
									model: 'PERSON',
									uuid: NICOLAS_KENT_JR_PERSON_UUID,
									name: 'Nicolas Kent Jr'
								},
								{
									model: 'COMPANY',
									uuid: SUB_TRICYCLE_THEATRE_COMPANY_UUID,
									name: 'Sub-Tricycle Theatre Company',
									members: [
										{
											model: 'PERSON',
											uuid: ZOË_INGENHAAG_JR_PERSON_UUID,
											name: 'Zoë Ingenhaag Jr'
										}
									]
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: THE_NIGHT_IS_DARKEST_BEFORE_THE_DAWN_RODA_PRODUCTION_UUID,
					name: 'The Night Is Darkest Before the Dawn',
					startDate: '2010-10-22',
					endDate: '2010-11-07',
					venue: {
						model: 'VENUE',
						uuid: RODA_THEATRE_VENUE_UUID,
						name: 'Roda Theatre',
						surVenue: {
							model: 'VENUE',
							uuid: BERKELEY_REPERTORY_THEATRE_VENUE_UUID,
							name: 'Berkeley Repertory Theatre'
						}
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_THREE_ENDURING_FREEDOM_RODA_PRODUCTION_UUID,
						name: 'Part Three - Enduring Freedom 1996-2009',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_RODA_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					producerCredits: [
						{
							model: 'PRODUCER_CREDIT',
							name: 'produced by',
							entities: [
								{
									model: 'PERSON',
									uuid: NICOLAS_KENT_JR_PERSON_UUID,
									name: 'Nicolas Kent Jr'
								},
								{
									model: 'COMPANY',
									uuid: SUB_TRICYCLE_THEATRE_COMPANY_UUID,
									name: 'Sub-Tricycle Theatre Company',
									members: [
										{
											model: 'PERSON',
											uuid: ZOË_INGENHAAG_JR_PERSON_UUID,
											name: 'Zoë Ingenhaag Jr'
										}
									]
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: HONEY_RODA_PRODUCTION_UUID,
					name: 'Honey',
					startDate: '2010-10-22',
					endDate: '2010-11-07',
					venue: {
						model: 'VENUE',
						uuid: RODA_THEATRE_VENUE_UUID,
						name: 'Roda Theatre',
						surVenue: {
							model: 'VENUE',
							uuid: BERKELEY_REPERTORY_THEATRE_VENUE_UUID,
							name: 'Berkeley Repertory Theatre'
						}
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_THREE_ENDURING_FREEDOM_RODA_PRODUCTION_UUID,
						name: 'Part Three - Enduring Freedom 1996-2009',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_RODA_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					producerCredits: [
						{
							model: 'PRODUCER_CREDIT',
							name: 'produced by',
							entities: [
								{
									model: 'PERSON',
									uuid: NICOLAS_KENT_JR_PERSON_UUID,
									name: 'Nicolas Kent Jr'
								},
								{
									model: 'COMPANY',
									uuid: SUB_TRICYCLE_THEATRE_COMPANY_UUID,
									name: 'Sub-Tricycle Theatre Company',
									members: [
										{
											model: 'PERSON',
											uuid: ZOË_INGENHAAG_JR_PERSON_UUID,
											name: 'Zoë Ingenhaag Jr'
										}
									]
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: MINISKIRTS_OF_KABUL_RODA_PRODUCTION_UUID,
					name: 'Miniskirts of Kabul',
					startDate: '2010-10-22',
					endDate: '2010-11-07',
					venue: {
						model: 'VENUE',
						uuid: RODA_THEATRE_VENUE_UUID,
						name: 'Roda Theatre',
						surVenue: {
							model: 'VENUE',
							uuid: BERKELEY_REPERTORY_THEATRE_VENUE_UUID,
							name: 'Berkeley Repertory Theatre'
						}
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_TWO_COMMUNISM_THE_MUJAHIDEEN_AND_THE_TALIBAN_RODA_PRODUCTION_UUID,
						name: 'Part Two - Communism, the Mujahideen and the Taliban 1979-1996',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_RODA_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					producerCredits: [
						{
							model: 'PRODUCER_CREDIT',
							name: 'produced by',
							entities: [
								{
									model: 'PERSON',
									uuid: NICOLAS_KENT_JR_PERSON_UUID,
									name: 'Nicolas Kent Jr'
								},
								{
									model: 'COMPANY',
									uuid: SUB_TRICYCLE_THEATRE_COMPANY_UUID,
									name: 'Sub-Tricycle Theatre Company',
									members: [
										{
											model: 'PERSON',
											uuid: ZOË_INGENHAAG_JR_PERSON_UUID,
											name: 'Zoë Ingenhaag Jr'
										}
									]
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: BLOOD_AND_GIFTS_RODA_PRODUCTION_UUID,
					name: 'Blood and Gifts',
					startDate: '2010-10-22',
					endDate: '2010-11-07',
					venue: {
						model: 'VENUE',
						uuid: RODA_THEATRE_VENUE_UUID,
						name: 'Roda Theatre',
						surVenue: {
							model: 'VENUE',
							uuid: BERKELEY_REPERTORY_THEATRE_VENUE_UUID,
							name: 'Berkeley Repertory Theatre'
						}
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_TWO_COMMUNISM_THE_MUJAHIDEEN_AND_THE_TALIBAN_RODA_PRODUCTION_UUID,
						name: 'Part Two - Communism, the Mujahideen and the Taliban 1979-1996',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_RODA_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					producerCredits: [
						{
							model: 'PRODUCER_CREDIT',
							name: 'produced by',
							entities: [
								{
									model: 'PERSON',
									uuid: NICOLAS_KENT_JR_PERSON_UUID,
									name: 'Nicolas Kent Jr'
								},
								{
									model: 'COMPANY',
									uuid: SUB_TRICYCLE_THEATRE_COMPANY_UUID,
									name: 'Sub-Tricycle Theatre Company',
									members: [
										{
											model: 'PERSON',
											uuid: ZOË_INGENHAAG_JR_PERSON_UUID,
											name: 'Zoë Ingenhaag Jr'
										}
									]
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: BLACK_TULIPS_RODA_PRODUCTION_UUID,
					name: 'Black Tulips',
					startDate: '2010-10-22',
					endDate: '2010-11-07',
					venue: {
						model: 'VENUE',
						uuid: RODA_THEATRE_VENUE_UUID,
						name: 'Roda Theatre',
						surVenue: {
							model: 'VENUE',
							uuid: BERKELEY_REPERTORY_THEATRE_VENUE_UUID,
							name: 'Berkeley Repertory Theatre'
						}
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_TWO_COMMUNISM_THE_MUJAHIDEEN_AND_THE_TALIBAN_RODA_PRODUCTION_UUID,
						name: 'Part Two - Communism, the Mujahideen and the Taliban 1979-1996',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_RODA_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					producerCredits: [
						{
							model: 'PRODUCER_CREDIT',
							name: 'produced by',
							entities: [
								{
									model: 'PERSON',
									uuid: NICOLAS_KENT_JR_PERSON_UUID,
									name: 'Nicolas Kent Jr'
								},
								{
									model: 'COMPANY',
									uuid: SUB_TRICYCLE_THEATRE_COMPANY_UUID,
									name: 'Sub-Tricycle Theatre Company',
									members: [
										{
											model: 'PERSON',
											uuid: ZOË_INGENHAAG_JR_PERSON_UUID,
											name: 'Zoë Ingenhaag Jr'
										}
									]
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: CAMPAIGN_RODA_PRODUCTION_UUID,
					name: 'Campaign',
					startDate: '2010-10-22',
					endDate: '2010-11-07',
					venue: {
						model: 'VENUE',
						uuid: RODA_THEATRE_VENUE_UUID,
						name: 'Roda Theatre',
						surVenue: {
							model: 'VENUE',
							uuid: BERKELEY_REPERTORY_THEATRE_VENUE_UUID,
							name: 'Berkeley Repertory Theatre'
						}
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_ONE_INVASIONS_AND_INDEPENDENCE_RODA_PRODUCTION_UUID,
						name: 'Part One - Invasions and Independence 1842-1930',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_RODA_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					producerCredits: [
						{
							model: 'PRODUCER_CREDIT',
							name: 'produced by',
							entities: [
								{
									model: 'PERSON',
									uuid: NICOLAS_KENT_JR_PERSON_UUID,
									name: 'Nicolas Kent Jr'
								},
								{
									model: 'COMPANY',
									uuid: SUB_TRICYCLE_THEATRE_COMPANY_UUID,
									name: 'Sub-Tricycle Theatre Company',
									members: [
										{
											model: 'PERSON',
											uuid: ZOË_INGENHAAG_JR_PERSON_UUID,
											name: 'Zoë Ingenhaag Jr'
										}
									]
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: DURANDS_LINE_RODA_PRODUCTION_UUID,
					name: 'Durand\'s Line',
					startDate: '2010-10-22',
					endDate: '2010-11-07',
					venue: {
						model: 'VENUE',
						uuid: RODA_THEATRE_VENUE_UUID,
						name: 'Roda Theatre',
						surVenue: {
							model: 'VENUE',
							uuid: BERKELEY_REPERTORY_THEATRE_VENUE_UUID,
							name: 'Berkeley Repertory Theatre'
						}
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_ONE_INVASIONS_AND_INDEPENDENCE_RODA_PRODUCTION_UUID,
						name: 'Part One - Invasions and Independence 1842-1930',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_RODA_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					producerCredits: [
						{
							model: 'PRODUCER_CREDIT',
							name: 'produced by',
							entities: [
								{
									model: 'PERSON',
									uuid: NICOLAS_KENT_JR_PERSON_UUID,
									name: 'Nicolas Kent Jr'
								},
								{
									model: 'COMPANY',
									uuid: SUB_TRICYCLE_THEATRE_COMPANY_UUID,
									name: 'Sub-Tricycle Theatre Company',
									members: [
										{
											model: 'PERSON',
											uuid: ZOË_INGENHAAG_JR_PERSON_UUID,
											name: 'Zoë Ingenhaag Jr'
										}
									]
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: BUGLES_AT_THE_GATES_OF_JALALABAD_RODA_PRODUCTION_UUID,
					name: 'Bugles at the Gates of Jalalabad',
					startDate: '2010-10-22',
					endDate: '2010-11-07',
					venue: {
						model: 'VENUE',
						uuid: RODA_THEATRE_VENUE_UUID,
						name: 'Roda Theatre',
						surVenue: {
							model: 'VENUE',
							uuid: BERKELEY_REPERTORY_THEATRE_VENUE_UUID,
							name: 'Berkeley Repertory Theatre'
						}
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_ONE_INVASIONS_AND_INDEPENDENCE_RODA_PRODUCTION_UUID,
						name: 'Part One - Invasions and Independence 1842-1930',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_RODA_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					producerCredits: [
						{
							model: 'PRODUCER_CREDIT',
							name: 'produced by',
							entities: [
								{
									model: 'PERSON',
									uuid: NICOLAS_KENT_JR_PERSON_UUID,
									name: 'Nicolas Kent Jr'
								},
								{
									model: 'COMPANY',
									uuid: SUB_TRICYCLE_THEATRE_COMPANY_UUID,
									name: 'Sub-Tricycle Theatre Company',
									members: [
										{
											model: 'PERSON',
											uuid: ZOË_INGENHAAG_JR_PERSON_UUID,
											name: 'Zoë Ingenhaag Jr'
										}
									]
								}
							]
						}
					]
				}
			];

			const { producerProductions } = zoëIngenhaagJrPerson.body;

			expect(producerProductions).to.deep.equal(expectedProducerProductions);

		});

	});

	describe('Rick Warden Jr (person)', () => {

		it('includes productions for which they have a cast credit, including the sur-production and sur-sur-production', () => {

			const expectedCastMemberProductions = [
				{
					model: 'PRODUCTION',
					uuid: ON_THE_SIDE_OF_THE_ANGELS_RODA_PRODUCTION_UUID,
					name: 'On the Side of the Angels',
					startDate: '2010-10-22',
					endDate: '2010-11-07',
					venue: {
						model: 'VENUE',
						uuid: RODA_THEATRE_VENUE_UUID,
						name: 'Roda Theatre',
						surVenue: {
							model: 'VENUE',
							uuid: BERKELEY_REPERTORY_THEATRE_VENUE_UUID,
							name: 'Berkeley Repertory Theatre'
						}
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_THREE_ENDURING_FREEDOM_RODA_PRODUCTION_UUID,
						name: 'Part Three - Enduring Freedom 1996-2009',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_RODA_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					roles: [
						{
							model: 'CHARACTER',
							uuid: BAR_JR_CHARACTER_UUID,
							name: 'Bar Jr',
							qualifier: null,
							isAlternate: false
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: THE_NIGHT_IS_DARKEST_BEFORE_THE_DAWN_RODA_PRODUCTION_UUID,
					name: 'The Night Is Darkest Before the Dawn',
					startDate: '2010-10-22',
					endDate: '2010-11-07',
					venue: {
						model: 'VENUE',
						uuid: RODA_THEATRE_VENUE_UUID,
						name: 'Roda Theatre',
						surVenue: {
							model: 'VENUE',
							uuid: BERKELEY_REPERTORY_THEATRE_VENUE_UUID,
							name: 'Berkeley Repertory Theatre'
						}
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_THREE_ENDURING_FREEDOM_RODA_PRODUCTION_UUID,
						name: 'Part Three - Enduring Freedom 1996-2009',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_RODA_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					roles: [
						{
							model: 'CHARACTER',
							uuid: BAR_JR_CHARACTER_UUID,
							name: 'Bar Jr',
							qualifier: null,
							isAlternate: false
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: HONEY_RODA_PRODUCTION_UUID,
					name: 'Honey',
					startDate: '2010-10-22',
					endDate: '2010-11-07',
					venue: {
						model: 'VENUE',
						uuid: RODA_THEATRE_VENUE_UUID,
						name: 'Roda Theatre',
						surVenue: {
							model: 'VENUE',
							uuid: BERKELEY_REPERTORY_THEATRE_VENUE_UUID,
							name: 'Berkeley Repertory Theatre'
						}
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_THREE_ENDURING_FREEDOM_RODA_PRODUCTION_UUID,
						name: 'Part Three - Enduring Freedom 1996-2009',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_RODA_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					roles: [
						{
							model: 'CHARACTER',
							uuid: BAR_JR_CHARACTER_UUID,
							name: 'Bar Jr',
							qualifier: null,
							isAlternate: false
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: MINISKIRTS_OF_KABUL_RODA_PRODUCTION_UUID,
					name: 'Miniskirts of Kabul',
					startDate: '2010-10-22',
					endDate: '2010-11-07',
					venue: {
						model: 'VENUE',
						uuid: RODA_THEATRE_VENUE_UUID,
						name: 'Roda Theatre',
						surVenue: {
							model: 'VENUE',
							uuid: BERKELEY_REPERTORY_THEATRE_VENUE_UUID,
							name: 'Berkeley Repertory Theatre'
						}
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_TWO_COMMUNISM_THE_MUJAHIDEEN_AND_THE_TALIBAN_RODA_PRODUCTION_UUID,
						name: 'Part Two - Communism, the Mujahideen and the Taliban 1979-1996',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_RODA_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					roles: [
						{
							model: 'CHARACTER',
							uuid: BAR_JR_CHARACTER_UUID,
							name: 'Bar Jr',
							qualifier: null,
							isAlternate: false
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: BLOOD_AND_GIFTS_RODA_PRODUCTION_UUID,
					name: 'Blood and Gifts',
					startDate: '2010-10-22',
					endDate: '2010-11-07',
					venue: {
						model: 'VENUE',
						uuid: RODA_THEATRE_VENUE_UUID,
						name: 'Roda Theatre',
						surVenue: {
							model: 'VENUE',
							uuid: BERKELEY_REPERTORY_THEATRE_VENUE_UUID,
							name: 'Berkeley Repertory Theatre'
						}
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_TWO_COMMUNISM_THE_MUJAHIDEEN_AND_THE_TALIBAN_RODA_PRODUCTION_UUID,
						name: 'Part Two - Communism, the Mujahideen and the Taliban 1979-1996',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_RODA_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					roles: [
						{
							model: 'CHARACTER',
							uuid: BAR_JR_CHARACTER_UUID,
							name: 'Bar Jr',
							qualifier: null,
							isAlternate: false
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: BLACK_TULIPS_RODA_PRODUCTION_UUID,
					name: 'Black Tulips',
					startDate: '2010-10-22',
					endDate: '2010-11-07',
					venue: {
						model: 'VENUE',
						uuid: RODA_THEATRE_VENUE_UUID,
						name: 'Roda Theatre',
						surVenue: {
							model: 'VENUE',
							uuid: BERKELEY_REPERTORY_THEATRE_VENUE_UUID,
							name: 'Berkeley Repertory Theatre'
						}
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_TWO_COMMUNISM_THE_MUJAHIDEEN_AND_THE_TALIBAN_RODA_PRODUCTION_UUID,
						name: 'Part Two - Communism, the Mujahideen and the Taliban 1979-1996',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_RODA_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					roles: [
						{
							model: 'CHARACTER',
							uuid: BAR_JR_CHARACTER_UUID,
							name: 'Bar Jr',
							qualifier: null,
							isAlternate: false
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: CAMPAIGN_RODA_PRODUCTION_UUID,
					name: 'Campaign',
					startDate: '2010-10-22',
					endDate: '2010-11-07',
					venue: {
						model: 'VENUE',
						uuid: RODA_THEATRE_VENUE_UUID,
						name: 'Roda Theatre',
						surVenue: {
							model: 'VENUE',
							uuid: BERKELEY_REPERTORY_THEATRE_VENUE_UUID,
							name: 'Berkeley Repertory Theatre'
						}
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_ONE_INVASIONS_AND_INDEPENDENCE_RODA_PRODUCTION_UUID,
						name: 'Part One - Invasions and Independence 1842-1930',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_RODA_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					roles: [
						{
							model: 'CHARACTER',
							uuid: BAR_JR_CHARACTER_UUID,
							name: 'Bar Jr',
							qualifier: null,
							isAlternate: false
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: DURANDS_LINE_RODA_PRODUCTION_UUID,
					name: 'Durand\'s Line',
					startDate: '2010-10-22',
					endDate: '2010-11-07',
					venue: {
						model: 'VENUE',
						uuid: RODA_THEATRE_VENUE_UUID,
						name: 'Roda Theatre',
						surVenue: {
							model: 'VENUE',
							uuid: BERKELEY_REPERTORY_THEATRE_VENUE_UUID,
							name: 'Berkeley Repertory Theatre'
						}
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_ONE_INVASIONS_AND_INDEPENDENCE_RODA_PRODUCTION_UUID,
						name: 'Part One - Invasions and Independence 1842-1930',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_RODA_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					roles: [
						{
							model: 'CHARACTER',
							uuid: BAR_JR_CHARACTER_UUID,
							name: 'Bar Jr',
							qualifier: null,
							isAlternate: false
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: BUGLES_AT_THE_GATES_OF_JALALABAD_RODA_PRODUCTION_UUID,
					name: 'Bugles at the Gates of Jalalabad',
					startDate: '2010-10-22',
					endDate: '2010-11-07',
					venue: {
						model: 'VENUE',
						uuid: RODA_THEATRE_VENUE_UUID,
						name: 'Roda Theatre',
						surVenue: {
							model: 'VENUE',
							uuid: BERKELEY_REPERTORY_THEATRE_VENUE_UUID,
							name: 'Berkeley Repertory Theatre'
						}
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_ONE_INVASIONS_AND_INDEPENDENCE_RODA_PRODUCTION_UUID,
						name: 'Part One - Invasions and Independence 1842-1930',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_RODA_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					roles: [
						{
							model: 'CHARACTER',
							uuid: BAR_JR_CHARACTER_UUID,
							name: 'Bar Jr',
							qualifier: null,
							isAlternate: false
						}
					]
				}
			];

			const { castMemberProductions } = rickWardenJrPerson.body;

			expect(castMemberProductions).to.deep.equal(expectedCastMemberProductions);

		});

	});

	describe('Howard Harrison Jr (person)', () => {

		it('includes productions for which they have a creative team credit, including the sur-production and sur-sur-production', () => {

			const expectedCreativeProductions = [
				{
					model: 'PRODUCTION',
					uuid: ON_THE_SIDE_OF_THE_ANGELS_RODA_PRODUCTION_UUID,
					name: 'On the Side of the Angels',
					startDate: '2010-10-22',
					endDate: '2010-11-07',
					venue: {
						model: 'VENUE',
						uuid: RODA_THEATRE_VENUE_UUID,
						name: 'Roda Theatre',
						surVenue: {
							model: 'VENUE',
							uuid: BERKELEY_REPERTORY_THEATRE_VENUE_UUID,
							name: 'Berkeley Repertory Theatre'
						}
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_THREE_ENDURING_FREEDOM_RODA_PRODUCTION_UUID,
						name: 'Part Three - Enduring Freedom 1996-2009',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_RODA_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					creativeCredits: [
						{
							model: 'CREATIVE_CREDIT',
							name: 'Junior Lighting Designers',
							employerCompany: null,
							coEntities: [
								{
									model: 'COMPANY',
									uuid: SUB_LIGHTING_DESIGN_LTD_COMPANY_UUID,
									name: 'Sub-Lighting Design Ltd',
									members: [
										{
											model: 'PERSON',
											uuid: JACK_KNOWLES_JR_PERSON_UUID,
											name: 'Jack Knowles Jr'
										}
									]
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: THE_NIGHT_IS_DARKEST_BEFORE_THE_DAWN_RODA_PRODUCTION_UUID,
					name: 'The Night Is Darkest Before the Dawn',
					startDate: '2010-10-22',
					endDate: '2010-11-07',
					venue: {
						model: 'VENUE',
						uuid: RODA_THEATRE_VENUE_UUID,
						name: 'Roda Theatre',
						surVenue: {
							model: 'VENUE',
							uuid: BERKELEY_REPERTORY_THEATRE_VENUE_UUID,
							name: 'Berkeley Repertory Theatre'
						}
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_THREE_ENDURING_FREEDOM_RODA_PRODUCTION_UUID,
						name: 'Part Three - Enduring Freedom 1996-2009',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_RODA_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					creativeCredits: [
						{
							model: 'CREATIVE_CREDIT',
							name: 'Junior Lighting Designers',
							employerCompany: null,
							coEntities: [
								{
									model: 'COMPANY',
									uuid: SUB_LIGHTING_DESIGN_LTD_COMPANY_UUID,
									name: 'Sub-Lighting Design Ltd',
									members: [
										{
											model: 'PERSON',
											uuid: JACK_KNOWLES_JR_PERSON_UUID,
											name: 'Jack Knowles Jr'
										}
									]
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: HONEY_RODA_PRODUCTION_UUID,
					name: 'Honey',
					startDate: '2010-10-22',
					endDate: '2010-11-07',
					venue: {
						model: 'VENUE',
						uuid: RODA_THEATRE_VENUE_UUID,
						name: 'Roda Theatre',
						surVenue: {
							model: 'VENUE',
							uuid: BERKELEY_REPERTORY_THEATRE_VENUE_UUID,
							name: 'Berkeley Repertory Theatre'
						}
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_THREE_ENDURING_FREEDOM_RODA_PRODUCTION_UUID,
						name: 'Part Three - Enduring Freedom 1996-2009',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_RODA_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					creativeCredits: [
						{
							model: 'CREATIVE_CREDIT',
							name: 'Junior Lighting Designers',
							employerCompany: null,
							coEntities: [
								{
									model: 'COMPANY',
									uuid: SUB_LIGHTING_DESIGN_LTD_COMPANY_UUID,
									name: 'Sub-Lighting Design Ltd',
									members: [
										{
											model: 'PERSON',
											uuid: JACK_KNOWLES_JR_PERSON_UUID,
											name: 'Jack Knowles Jr'
										}
									]
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: MINISKIRTS_OF_KABUL_RODA_PRODUCTION_UUID,
					name: 'Miniskirts of Kabul',
					startDate: '2010-10-22',
					endDate: '2010-11-07',
					venue: {
						model: 'VENUE',
						uuid: RODA_THEATRE_VENUE_UUID,
						name: 'Roda Theatre',
						surVenue: {
							model: 'VENUE',
							uuid: BERKELEY_REPERTORY_THEATRE_VENUE_UUID,
							name: 'Berkeley Repertory Theatre'
						}
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_TWO_COMMUNISM_THE_MUJAHIDEEN_AND_THE_TALIBAN_RODA_PRODUCTION_UUID,
						name: 'Part Two - Communism, the Mujahideen and the Taliban 1979-1996',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_RODA_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					creativeCredits: [
						{
							model: 'CREATIVE_CREDIT',
							name: 'Junior Lighting Designers',
							employerCompany: null,
							coEntities: [
								{
									model: 'COMPANY',
									uuid: SUB_LIGHTING_DESIGN_LTD_COMPANY_UUID,
									name: 'Sub-Lighting Design Ltd',
									members: [
										{
											model: 'PERSON',
											uuid: JACK_KNOWLES_JR_PERSON_UUID,
											name: 'Jack Knowles Jr'
										}
									]
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: BLOOD_AND_GIFTS_RODA_PRODUCTION_UUID,
					name: 'Blood and Gifts',
					startDate: '2010-10-22',
					endDate: '2010-11-07',
					venue: {
						model: 'VENUE',
						uuid: RODA_THEATRE_VENUE_UUID,
						name: 'Roda Theatre',
						surVenue: {
							model: 'VENUE',
							uuid: BERKELEY_REPERTORY_THEATRE_VENUE_UUID,
							name: 'Berkeley Repertory Theatre'
						}
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_TWO_COMMUNISM_THE_MUJAHIDEEN_AND_THE_TALIBAN_RODA_PRODUCTION_UUID,
						name: 'Part Two - Communism, the Mujahideen and the Taliban 1979-1996',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_RODA_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					creativeCredits: [
						{
							model: 'CREATIVE_CREDIT',
							name: 'Junior Lighting Designers',
							employerCompany: null,
							coEntities: [
								{
									model: 'COMPANY',
									uuid: SUB_LIGHTING_DESIGN_LTD_COMPANY_UUID,
									name: 'Sub-Lighting Design Ltd',
									members: [
										{
											model: 'PERSON',
											uuid: JACK_KNOWLES_JR_PERSON_UUID,
											name: 'Jack Knowles Jr'
										}
									]
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: BLACK_TULIPS_RODA_PRODUCTION_UUID,
					name: 'Black Tulips',
					startDate: '2010-10-22',
					endDate: '2010-11-07',
					venue: {
						model: 'VENUE',
						uuid: RODA_THEATRE_VENUE_UUID,
						name: 'Roda Theatre',
						surVenue: {
							model: 'VENUE',
							uuid: BERKELEY_REPERTORY_THEATRE_VENUE_UUID,
							name: 'Berkeley Repertory Theatre'
						}
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_TWO_COMMUNISM_THE_MUJAHIDEEN_AND_THE_TALIBAN_RODA_PRODUCTION_UUID,
						name: 'Part Two - Communism, the Mujahideen and the Taliban 1979-1996',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_RODA_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					creativeCredits: [
						{
							model: 'CREATIVE_CREDIT',
							name: 'Junior Lighting Designers',
							employerCompany: null,
							coEntities: [
								{
									model: 'COMPANY',
									uuid: SUB_LIGHTING_DESIGN_LTD_COMPANY_UUID,
									name: 'Sub-Lighting Design Ltd',
									members: [
										{
											model: 'PERSON',
											uuid: JACK_KNOWLES_JR_PERSON_UUID,
											name: 'Jack Knowles Jr'
										}
									]
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: CAMPAIGN_RODA_PRODUCTION_UUID,
					name: 'Campaign',
					startDate: '2010-10-22',
					endDate: '2010-11-07',
					venue: {
						model: 'VENUE',
						uuid: RODA_THEATRE_VENUE_UUID,
						name: 'Roda Theatre',
						surVenue: {
							model: 'VENUE',
							uuid: BERKELEY_REPERTORY_THEATRE_VENUE_UUID,
							name: 'Berkeley Repertory Theatre'
						}
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_ONE_INVASIONS_AND_INDEPENDENCE_RODA_PRODUCTION_UUID,
						name: 'Part One - Invasions and Independence 1842-1930',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_RODA_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					creativeCredits: [
						{
							model: 'CREATIVE_CREDIT',
							name: 'Junior Lighting Designers',
							employerCompany: null,
							coEntities: [
								{
									model: 'COMPANY',
									uuid: SUB_LIGHTING_DESIGN_LTD_COMPANY_UUID,
									name: 'Sub-Lighting Design Ltd',
									members: [
										{
											model: 'PERSON',
											uuid: JACK_KNOWLES_JR_PERSON_UUID,
											name: 'Jack Knowles Jr'
										}
									]
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: DURANDS_LINE_RODA_PRODUCTION_UUID,
					name: 'Durand\'s Line',
					startDate: '2010-10-22',
					endDate: '2010-11-07',
					venue: {
						model: 'VENUE',
						uuid: RODA_THEATRE_VENUE_UUID,
						name: 'Roda Theatre',
						surVenue: {
							model: 'VENUE',
							uuid: BERKELEY_REPERTORY_THEATRE_VENUE_UUID,
							name: 'Berkeley Repertory Theatre'
						}
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_ONE_INVASIONS_AND_INDEPENDENCE_RODA_PRODUCTION_UUID,
						name: 'Part One - Invasions and Independence 1842-1930',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_RODA_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					creativeCredits: [
						{
							model: 'CREATIVE_CREDIT',
							name: 'Junior Lighting Designers',
							employerCompany: null,
							coEntities: [
								{
									model: 'COMPANY',
									uuid: SUB_LIGHTING_DESIGN_LTD_COMPANY_UUID,
									name: 'Sub-Lighting Design Ltd',
									members: [
										{
											model: 'PERSON',
											uuid: JACK_KNOWLES_JR_PERSON_UUID,
											name: 'Jack Knowles Jr'
										}
									]
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: BUGLES_AT_THE_GATES_OF_JALALABAD_RODA_PRODUCTION_UUID,
					name: 'Bugles at the Gates of Jalalabad',
					startDate: '2010-10-22',
					endDate: '2010-11-07',
					venue: {
						model: 'VENUE',
						uuid: RODA_THEATRE_VENUE_UUID,
						name: 'Roda Theatre',
						surVenue: {
							model: 'VENUE',
							uuid: BERKELEY_REPERTORY_THEATRE_VENUE_UUID,
							name: 'Berkeley Repertory Theatre'
						}
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_ONE_INVASIONS_AND_INDEPENDENCE_RODA_PRODUCTION_UUID,
						name: 'Part One - Invasions and Independence 1842-1930',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_RODA_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					creativeCredits: [
						{
							model: 'CREATIVE_CREDIT',
							name: 'Junior Lighting Designers',
							employerCompany: null,
							coEntities: [
								{
									model: 'COMPANY',
									uuid: SUB_LIGHTING_DESIGN_LTD_COMPANY_UUID,
									name: 'Sub-Lighting Design Ltd',
									members: [
										{
											model: 'PERSON',
											uuid: JACK_KNOWLES_JR_PERSON_UUID,
											name: 'Jack Knowles Jr'
										}
									]
								}
							]
						}
					]
				}
			];

			const { creativeProductions } = howardHarrisonJrPerson.body;

			expect(creativeProductions).to.deep.equal(expectedCreativeProductions);

		});

	});

	describe('Sub-Lighting Design Ltd (company)', () => {

		it('includes productions for which they have a creative team credit, including the sur-production and sur-sur-production', () => {

			const expectedCreativeProductions = [
				{
					model: 'PRODUCTION',
					uuid: ON_THE_SIDE_OF_THE_ANGELS_RODA_PRODUCTION_UUID,
					name: 'On the Side of the Angels',
					startDate: '2010-10-22',
					endDate: '2010-11-07',
					venue: {
						model: 'VENUE',
						uuid: RODA_THEATRE_VENUE_UUID,
						name: 'Roda Theatre',
						surVenue: {
							model: 'VENUE',
							uuid: BERKELEY_REPERTORY_THEATRE_VENUE_UUID,
							name: 'Berkeley Repertory Theatre'
						}
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_THREE_ENDURING_FREEDOM_RODA_PRODUCTION_UUID,
						name: 'Part Three - Enduring Freedom 1996-2009',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_RODA_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					creativeCredits: [
						{
							model: 'CREATIVE_CREDIT',
							name: 'Junior Lighting Designers',
							members: [
								{
									model: 'PERSON',
									uuid: JACK_KNOWLES_JR_PERSON_UUID,
									name: 'Jack Knowles Jr'
								}
							],
							coEntities: [
								{
									model: 'PERSON',
									uuid: HOWARD_HARRISON_JR_PERSON_UUID,
									name: 'Howard Harrison Jr'
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: THE_NIGHT_IS_DARKEST_BEFORE_THE_DAWN_RODA_PRODUCTION_UUID,
					name: 'The Night Is Darkest Before the Dawn',
					startDate: '2010-10-22',
					endDate: '2010-11-07',
					venue: {
						model: 'VENUE',
						uuid: RODA_THEATRE_VENUE_UUID,
						name: 'Roda Theatre',
						surVenue: {
							model: 'VENUE',
							uuid: BERKELEY_REPERTORY_THEATRE_VENUE_UUID,
							name: 'Berkeley Repertory Theatre'
						}
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_THREE_ENDURING_FREEDOM_RODA_PRODUCTION_UUID,
						name: 'Part Three - Enduring Freedom 1996-2009',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_RODA_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					creativeCredits: [
						{
							model: 'CREATIVE_CREDIT',
							name: 'Junior Lighting Designers',
							members: [
								{
									model: 'PERSON',
									uuid: JACK_KNOWLES_JR_PERSON_UUID,
									name: 'Jack Knowles Jr'
								}
							],
							coEntities: [
								{
									model: 'PERSON',
									uuid: HOWARD_HARRISON_JR_PERSON_UUID,
									name: 'Howard Harrison Jr'
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: HONEY_RODA_PRODUCTION_UUID,
					name: 'Honey',
					startDate: '2010-10-22',
					endDate: '2010-11-07',
					venue: {
						model: 'VENUE',
						uuid: RODA_THEATRE_VENUE_UUID,
						name: 'Roda Theatre',
						surVenue: {
							model: 'VENUE',
							uuid: BERKELEY_REPERTORY_THEATRE_VENUE_UUID,
							name: 'Berkeley Repertory Theatre'
						}
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_THREE_ENDURING_FREEDOM_RODA_PRODUCTION_UUID,
						name: 'Part Three - Enduring Freedom 1996-2009',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_RODA_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					creativeCredits: [
						{
							model: 'CREATIVE_CREDIT',
							name: 'Junior Lighting Designers',
							members: [
								{
									model: 'PERSON',
									uuid: JACK_KNOWLES_JR_PERSON_UUID,
									name: 'Jack Knowles Jr'
								}
							],
							coEntities: [
								{
									model: 'PERSON',
									uuid: HOWARD_HARRISON_JR_PERSON_UUID,
									name: 'Howard Harrison Jr'
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: MINISKIRTS_OF_KABUL_RODA_PRODUCTION_UUID,
					name: 'Miniskirts of Kabul',
					startDate: '2010-10-22',
					endDate: '2010-11-07',
					venue: {
						model: 'VENUE',
						uuid: RODA_THEATRE_VENUE_UUID,
						name: 'Roda Theatre',
						surVenue: {
							model: 'VENUE',
							uuid: BERKELEY_REPERTORY_THEATRE_VENUE_UUID,
							name: 'Berkeley Repertory Theatre'
						}
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_TWO_COMMUNISM_THE_MUJAHIDEEN_AND_THE_TALIBAN_RODA_PRODUCTION_UUID,
						name: 'Part Two - Communism, the Mujahideen and the Taliban 1979-1996',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_RODA_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					creativeCredits: [
						{
							model: 'CREATIVE_CREDIT',
							name: 'Junior Lighting Designers',
							members: [
								{
									model: 'PERSON',
									uuid: JACK_KNOWLES_JR_PERSON_UUID,
									name: 'Jack Knowles Jr'
								}
							],
							coEntities: [
								{
									model: 'PERSON',
									uuid: HOWARD_HARRISON_JR_PERSON_UUID,
									name: 'Howard Harrison Jr'
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: BLOOD_AND_GIFTS_RODA_PRODUCTION_UUID,
					name: 'Blood and Gifts',
					startDate: '2010-10-22',
					endDate: '2010-11-07',
					venue: {
						model: 'VENUE',
						uuid: RODA_THEATRE_VENUE_UUID,
						name: 'Roda Theatre',
						surVenue: {
							model: 'VENUE',
							uuid: BERKELEY_REPERTORY_THEATRE_VENUE_UUID,
							name: 'Berkeley Repertory Theatre'
						}
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_TWO_COMMUNISM_THE_MUJAHIDEEN_AND_THE_TALIBAN_RODA_PRODUCTION_UUID,
						name: 'Part Two - Communism, the Mujahideen and the Taliban 1979-1996',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_RODA_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					creativeCredits: [
						{
							model: 'CREATIVE_CREDIT',
							name: 'Junior Lighting Designers',
							members: [
								{
									model: 'PERSON',
									uuid: JACK_KNOWLES_JR_PERSON_UUID,
									name: 'Jack Knowles Jr'
								}
							],
							coEntities: [
								{
									model: 'PERSON',
									uuid: HOWARD_HARRISON_JR_PERSON_UUID,
									name: 'Howard Harrison Jr'
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: BLACK_TULIPS_RODA_PRODUCTION_UUID,
					name: 'Black Tulips',
					startDate: '2010-10-22',
					endDate: '2010-11-07',
					venue: {
						model: 'VENUE',
						uuid: RODA_THEATRE_VENUE_UUID,
						name: 'Roda Theatre',
						surVenue: {
							model: 'VENUE',
							uuid: BERKELEY_REPERTORY_THEATRE_VENUE_UUID,
							name: 'Berkeley Repertory Theatre'
						}
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_TWO_COMMUNISM_THE_MUJAHIDEEN_AND_THE_TALIBAN_RODA_PRODUCTION_UUID,
						name: 'Part Two - Communism, the Mujahideen and the Taliban 1979-1996',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_RODA_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					creativeCredits: [
						{
							model: 'CREATIVE_CREDIT',
							name: 'Junior Lighting Designers',
							members: [
								{
									model: 'PERSON',
									uuid: JACK_KNOWLES_JR_PERSON_UUID,
									name: 'Jack Knowles Jr'
								}
							],
							coEntities: [
								{
									model: 'PERSON',
									uuid: HOWARD_HARRISON_JR_PERSON_UUID,
									name: 'Howard Harrison Jr'
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: CAMPAIGN_RODA_PRODUCTION_UUID,
					name: 'Campaign',
					startDate: '2010-10-22',
					endDate: '2010-11-07',
					venue: {
						model: 'VENUE',
						uuid: RODA_THEATRE_VENUE_UUID,
						name: 'Roda Theatre',
						surVenue: {
							model: 'VENUE',
							uuid: BERKELEY_REPERTORY_THEATRE_VENUE_UUID,
							name: 'Berkeley Repertory Theatre'
						}
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_ONE_INVASIONS_AND_INDEPENDENCE_RODA_PRODUCTION_UUID,
						name: 'Part One - Invasions and Independence 1842-1930',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_RODA_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					creativeCredits: [
						{
							model: 'CREATIVE_CREDIT',
							name: 'Junior Lighting Designers',
							members: [
								{
									model: 'PERSON',
									uuid: JACK_KNOWLES_JR_PERSON_UUID,
									name: 'Jack Knowles Jr'
								}
							],
							coEntities: [
								{
									model: 'PERSON',
									uuid: HOWARD_HARRISON_JR_PERSON_UUID,
									name: 'Howard Harrison Jr'
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: DURANDS_LINE_RODA_PRODUCTION_UUID,
					name: 'Durand\'s Line',
					startDate: '2010-10-22',
					endDate: '2010-11-07',
					venue: {
						model: 'VENUE',
						uuid: RODA_THEATRE_VENUE_UUID,
						name: 'Roda Theatre',
						surVenue: {
							model: 'VENUE',
							uuid: BERKELEY_REPERTORY_THEATRE_VENUE_UUID,
							name: 'Berkeley Repertory Theatre'
						}
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_ONE_INVASIONS_AND_INDEPENDENCE_RODA_PRODUCTION_UUID,
						name: 'Part One - Invasions and Independence 1842-1930',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_RODA_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					creativeCredits: [
						{
							model: 'CREATIVE_CREDIT',
							name: 'Junior Lighting Designers',
							members: [
								{
									model: 'PERSON',
									uuid: JACK_KNOWLES_JR_PERSON_UUID,
									name: 'Jack Knowles Jr'
								}
							],
							coEntities: [
								{
									model: 'PERSON',
									uuid: HOWARD_HARRISON_JR_PERSON_UUID,
									name: 'Howard Harrison Jr'
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: BUGLES_AT_THE_GATES_OF_JALALABAD_RODA_PRODUCTION_UUID,
					name: 'Bugles at the Gates of Jalalabad',
					startDate: '2010-10-22',
					endDate: '2010-11-07',
					venue: {
						model: 'VENUE',
						uuid: RODA_THEATRE_VENUE_UUID,
						name: 'Roda Theatre',
						surVenue: {
							model: 'VENUE',
							uuid: BERKELEY_REPERTORY_THEATRE_VENUE_UUID,
							name: 'Berkeley Repertory Theatre'
						}
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_ONE_INVASIONS_AND_INDEPENDENCE_RODA_PRODUCTION_UUID,
						name: 'Part One - Invasions and Independence 1842-1930',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_RODA_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					creativeCredits: [
						{
							model: 'CREATIVE_CREDIT',
							name: 'Junior Lighting Designers',
							members: [
								{
									model: 'PERSON',
									uuid: JACK_KNOWLES_JR_PERSON_UUID,
									name: 'Jack Knowles Jr'
								}
							],
							coEntities: [
								{
									model: 'PERSON',
									uuid: HOWARD_HARRISON_JR_PERSON_UUID,
									name: 'Howard Harrison Jr'
								}
							]
						}
					]
				}
			];

			const { creativeProductions } = subLightingDesignLtdCompany.body;

			expect(creativeProductions).to.deep.equal(expectedCreativeProductions);

		});

	});

	describe('Jack Knowles Jr (person)', () => {

		it('includes productions for which they have a creative team credit, including the sur-production and sur-sur-production', () => {

			const expectedCreativeProductions = [
				{
					model: 'PRODUCTION',
					uuid: ON_THE_SIDE_OF_THE_ANGELS_RODA_PRODUCTION_UUID,
					name: 'On the Side of the Angels',
					startDate: '2010-10-22',
					endDate: '2010-11-07',
					venue: {
						model: 'VENUE',
						uuid: RODA_THEATRE_VENUE_UUID,
						name: 'Roda Theatre',
						surVenue: {
							model: 'VENUE',
							uuid: BERKELEY_REPERTORY_THEATRE_VENUE_UUID,
							name: 'Berkeley Repertory Theatre'
						}
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_THREE_ENDURING_FREEDOM_RODA_PRODUCTION_UUID,
						name: 'Part Three - Enduring Freedom 1996-2009',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_RODA_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					creativeCredits: [
						{
							model: 'CREATIVE_CREDIT',
							name: 'Junior Lighting Designers',
							employerCompany: {
								model: 'COMPANY',
								uuid: SUB_LIGHTING_DESIGN_LTD_COMPANY_UUID,
								name: 'Sub-Lighting Design Ltd',
								coMembers: []
							},
							coEntities: [
								{
									model: 'PERSON',
									uuid: HOWARD_HARRISON_JR_PERSON_UUID,
									name: 'Howard Harrison Jr'
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: THE_NIGHT_IS_DARKEST_BEFORE_THE_DAWN_RODA_PRODUCTION_UUID,
					name: 'The Night Is Darkest Before the Dawn',
					startDate: '2010-10-22',
					endDate: '2010-11-07',
					venue: {
						model: 'VENUE',
						uuid: RODA_THEATRE_VENUE_UUID,
						name: 'Roda Theatre',
						surVenue: {
							model: 'VENUE',
							uuid: BERKELEY_REPERTORY_THEATRE_VENUE_UUID,
							name: 'Berkeley Repertory Theatre'
						}
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_THREE_ENDURING_FREEDOM_RODA_PRODUCTION_UUID,
						name: 'Part Three - Enduring Freedom 1996-2009',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_RODA_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					creativeCredits: [
						{
							model: 'CREATIVE_CREDIT',
							name: 'Junior Lighting Designers',
							employerCompany: {
								model: 'COMPANY',
								uuid: SUB_LIGHTING_DESIGN_LTD_COMPANY_UUID,
								name: 'Sub-Lighting Design Ltd',
								coMembers: []
							},
							coEntities: [
								{
									model: 'PERSON',
									uuid: HOWARD_HARRISON_JR_PERSON_UUID,
									name: 'Howard Harrison Jr'
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: HONEY_RODA_PRODUCTION_UUID,
					name: 'Honey',
					startDate: '2010-10-22',
					endDate: '2010-11-07',
					venue: {
						model: 'VENUE',
						uuid: RODA_THEATRE_VENUE_UUID,
						name: 'Roda Theatre',
						surVenue: {
							model: 'VENUE',
							uuid: BERKELEY_REPERTORY_THEATRE_VENUE_UUID,
							name: 'Berkeley Repertory Theatre'
						}
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_THREE_ENDURING_FREEDOM_RODA_PRODUCTION_UUID,
						name: 'Part Three - Enduring Freedom 1996-2009',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_RODA_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					creativeCredits: [
						{
							model: 'CREATIVE_CREDIT',
							name: 'Junior Lighting Designers',
							employerCompany: {
								model: 'COMPANY',
								uuid: SUB_LIGHTING_DESIGN_LTD_COMPANY_UUID,
								name: 'Sub-Lighting Design Ltd',
								coMembers: []
							},
							coEntities: [
								{
									model: 'PERSON',
									uuid: HOWARD_HARRISON_JR_PERSON_UUID,
									name: 'Howard Harrison Jr'
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: MINISKIRTS_OF_KABUL_RODA_PRODUCTION_UUID,
					name: 'Miniskirts of Kabul',
					startDate: '2010-10-22',
					endDate: '2010-11-07',
					venue: {
						model: 'VENUE',
						uuid: RODA_THEATRE_VENUE_UUID,
						name: 'Roda Theatre',
						surVenue: {
							model: 'VENUE',
							uuid: BERKELEY_REPERTORY_THEATRE_VENUE_UUID,
							name: 'Berkeley Repertory Theatre'
						}
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_TWO_COMMUNISM_THE_MUJAHIDEEN_AND_THE_TALIBAN_RODA_PRODUCTION_UUID,
						name: 'Part Two - Communism, the Mujahideen and the Taliban 1979-1996',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_RODA_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					creativeCredits: [
						{
							model: 'CREATIVE_CREDIT',
							name: 'Junior Lighting Designers',
							employerCompany: {
								model: 'COMPANY',
								uuid: SUB_LIGHTING_DESIGN_LTD_COMPANY_UUID,
								name: 'Sub-Lighting Design Ltd',
								coMembers: []
							},
							coEntities: [
								{
									model: 'PERSON',
									uuid: HOWARD_HARRISON_JR_PERSON_UUID,
									name: 'Howard Harrison Jr'
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: BLOOD_AND_GIFTS_RODA_PRODUCTION_UUID,
					name: 'Blood and Gifts',
					startDate: '2010-10-22',
					endDate: '2010-11-07',
					venue: {
						model: 'VENUE',
						uuid: RODA_THEATRE_VENUE_UUID,
						name: 'Roda Theatre',
						surVenue: {
							model: 'VENUE',
							uuid: BERKELEY_REPERTORY_THEATRE_VENUE_UUID,
							name: 'Berkeley Repertory Theatre'
						}
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_TWO_COMMUNISM_THE_MUJAHIDEEN_AND_THE_TALIBAN_RODA_PRODUCTION_UUID,
						name: 'Part Two - Communism, the Mujahideen and the Taliban 1979-1996',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_RODA_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					creativeCredits: [
						{
							model: 'CREATIVE_CREDIT',
							name: 'Junior Lighting Designers',
							employerCompany: {
								model: 'COMPANY',
								uuid: SUB_LIGHTING_DESIGN_LTD_COMPANY_UUID,
								name: 'Sub-Lighting Design Ltd',
								coMembers: []
							},
							coEntities: [
								{
									model: 'PERSON',
									uuid: HOWARD_HARRISON_JR_PERSON_UUID,
									name: 'Howard Harrison Jr'
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: BLACK_TULIPS_RODA_PRODUCTION_UUID,
					name: 'Black Tulips',
					startDate: '2010-10-22',
					endDate: '2010-11-07',
					venue: {
						model: 'VENUE',
						uuid: RODA_THEATRE_VENUE_UUID,
						name: 'Roda Theatre',
						surVenue: {
							model: 'VENUE',
							uuid: BERKELEY_REPERTORY_THEATRE_VENUE_UUID,
							name: 'Berkeley Repertory Theatre'
						}
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_TWO_COMMUNISM_THE_MUJAHIDEEN_AND_THE_TALIBAN_RODA_PRODUCTION_UUID,
						name: 'Part Two - Communism, the Mujahideen and the Taliban 1979-1996',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_RODA_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					creativeCredits: [
						{
							model: 'CREATIVE_CREDIT',
							name: 'Junior Lighting Designers',
							employerCompany: {
								model: 'COMPANY',
								uuid: SUB_LIGHTING_DESIGN_LTD_COMPANY_UUID,
								name: 'Sub-Lighting Design Ltd',
								coMembers: []
							},
							coEntities: [
								{
									model: 'PERSON',
									uuid: HOWARD_HARRISON_JR_PERSON_UUID,
									name: 'Howard Harrison Jr'
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: CAMPAIGN_RODA_PRODUCTION_UUID,
					name: 'Campaign',
					startDate: '2010-10-22',
					endDate: '2010-11-07',
					venue: {
						model: 'VENUE',
						uuid: RODA_THEATRE_VENUE_UUID,
						name: 'Roda Theatre',
						surVenue: {
							model: 'VENUE',
							uuid: BERKELEY_REPERTORY_THEATRE_VENUE_UUID,
							name: 'Berkeley Repertory Theatre'
						}
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_ONE_INVASIONS_AND_INDEPENDENCE_RODA_PRODUCTION_UUID,
						name: 'Part One - Invasions and Independence 1842-1930',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_RODA_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					creativeCredits: [
						{
							model: 'CREATIVE_CREDIT',
							name: 'Junior Lighting Designers',
							employerCompany: {
								model: 'COMPANY',
								uuid: SUB_LIGHTING_DESIGN_LTD_COMPANY_UUID,
								name: 'Sub-Lighting Design Ltd',
								coMembers: []
							},
							coEntities: [
								{
									model: 'PERSON',
									uuid: HOWARD_HARRISON_JR_PERSON_UUID,
									name: 'Howard Harrison Jr'
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: DURANDS_LINE_RODA_PRODUCTION_UUID,
					name: 'Durand\'s Line',
					startDate: '2010-10-22',
					endDate: '2010-11-07',
					venue: {
						model: 'VENUE',
						uuid: RODA_THEATRE_VENUE_UUID,
						name: 'Roda Theatre',
						surVenue: {
							model: 'VENUE',
							uuid: BERKELEY_REPERTORY_THEATRE_VENUE_UUID,
							name: 'Berkeley Repertory Theatre'
						}
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_ONE_INVASIONS_AND_INDEPENDENCE_RODA_PRODUCTION_UUID,
						name: 'Part One - Invasions and Independence 1842-1930',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_RODA_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					creativeCredits: [
						{
							model: 'CREATIVE_CREDIT',
							name: 'Junior Lighting Designers',
							employerCompany: {
								model: 'COMPANY',
								uuid: SUB_LIGHTING_DESIGN_LTD_COMPANY_UUID,
								name: 'Sub-Lighting Design Ltd',
								coMembers: []
							},
							coEntities: [
								{
									model: 'PERSON',
									uuid: HOWARD_HARRISON_JR_PERSON_UUID,
									name: 'Howard Harrison Jr'
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: BUGLES_AT_THE_GATES_OF_JALALABAD_RODA_PRODUCTION_UUID,
					name: 'Bugles at the Gates of Jalalabad',
					startDate: '2010-10-22',
					endDate: '2010-11-07',
					venue: {
						model: 'VENUE',
						uuid: RODA_THEATRE_VENUE_UUID,
						name: 'Roda Theatre',
						surVenue: {
							model: 'VENUE',
							uuid: BERKELEY_REPERTORY_THEATRE_VENUE_UUID,
							name: 'Berkeley Repertory Theatre'
						}
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_ONE_INVASIONS_AND_INDEPENDENCE_RODA_PRODUCTION_UUID,
						name: 'Part One - Invasions and Independence 1842-1930',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_RODA_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					creativeCredits: [
						{
							model: 'CREATIVE_CREDIT',
							name: 'Junior Lighting Designers',
							employerCompany: {
								model: 'COMPANY',
								uuid: SUB_LIGHTING_DESIGN_LTD_COMPANY_UUID,
								name: 'Sub-Lighting Design Ltd',
								coMembers: []
							},
							coEntities: [
								{
									model: 'PERSON',
									uuid: HOWARD_HARRISON_JR_PERSON_UUID,
									name: 'Howard Harrison Jr'
								}
							]
						}
					]
				}
			];

			const { creativeProductions } = jackKnowlesJrPerson.body;

			expect(creativeProductions).to.deep.equal(expectedCreativeProductions);

		});

	});

	describe('Lizzie Chapman Jr (person)', () => {

		it('includes productions for which they have a crew credit, including the sur-production and sur-sur-production', () => {

			const expectedCrewProductions = [
				{
					model: 'PRODUCTION',
					uuid: ON_THE_SIDE_OF_THE_ANGELS_RODA_PRODUCTION_UUID,
					name: 'On the Side of the Angels',
					startDate: '2010-10-22',
					endDate: '2010-11-07',
					venue: {
						model: 'VENUE',
						uuid: RODA_THEATRE_VENUE_UUID,
						name: 'Roda Theatre',
						surVenue: {
							model: 'VENUE',
							uuid: BERKELEY_REPERTORY_THEATRE_VENUE_UUID,
							name: 'Berkeley Repertory Theatre'
						}
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_THREE_ENDURING_FREEDOM_RODA_PRODUCTION_UUID,
						name: 'Part Three - Enduring Freedom 1996-2009',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_RODA_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					crewCredits: [
						{
							model: 'CREW_CREDIT',
							name: 'Junior Stage Managers',
							employerCompany: null,
							coEntities: [
								{
									model: 'COMPANY',
									uuid: SUB_STAGE_MANAGEMENT_LTD_COMPANY_UUID,
									name: 'Sub-Stage Management Ltd',
									members: [
										{
											model: 'PERSON',
											uuid: CHARLOTTE_PADGHAM_JR_PERSON_UUID,
											name: 'Charlotte Padgham Jr'
										}
									]
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: THE_NIGHT_IS_DARKEST_BEFORE_THE_DAWN_RODA_PRODUCTION_UUID,
					name: 'The Night Is Darkest Before the Dawn',
					startDate: '2010-10-22',
					endDate: '2010-11-07',
					venue: {
						model: 'VENUE',
						uuid: RODA_THEATRE_VENUE_UUID,
						name: 'Roda Theatre',
						surVenue: {
							model: 'VENUE',
							uuid: BERKELEY_REPERTORY_THEATRE_VENUE_UUID,
							name: 'Berkeley Repertory Theatre'
						}
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_THREE_ENDURING_FREEDOM_RODA_PRODUCTION_UUID,
						name: 'Part Three - Enduring Freedom 1996-2009',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_RODA_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					crewCredits: [
						{
							model: 'CREW_CREDIT',
							name: 'Junior Stage Managers',
							employerCompany: null,
							coEntities: [
								{
									model: 'COMPANY',
									uuid: SUB_STAGE_MANAGEMENT_LTD_COMPANY_UUID,
									name: 'Sub-Stage Management Ltd',
									members: [
										{
											model: 'PERSON',
											uuid: CHARLOTTE_PADGHAM_JR_PERSON_UUID,
											name: 'Charlotte Padgham Jr'
										}
									]
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: HONEY_RODA_PRODUCTION_UUID,
					name: 'Honey',
					startDate: '2010-10-22',
					endDate: '2010-11-07',
					venue: {
						model: 'VENUE',
						uuid: RODA_THEATRE_VENUE_UUID,
						name: 'Roda Theatre',
						surVenue: {
							model: 'VENUE',
							uuid: BERKELEY_REPERTORY_THEATRE_VENUE_UUID,
							name: 'Berkeley Repertory Theatre'
						}
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_THREE_ENDURING_FREEDOM_RODA_PRODUCTION_UUID,
						name: 'Part Three - Enduring Freedom 1996-2009',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_RODA_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					crewCredits: [
						{
							model: 'CREW_CREDIT',
							name: 'Junior Stage Managers',
							employerCompany: null,
							coEntities: [
								{
									model: 'COMPANY',
									uuid: SUB_STAGE_MANAGEMENT_LTD_COMPANY_UUID,
									name: 'Sub-Stage Management Ltd',
									members: [
										{
											model: 'PERSON',
											uuid: CHARLOTTE_PADGHAM_JR_PERSON_UUID,
											name: 'Charlotte Padgham Jr'
										}
									]
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: MINISKIRTS_OF_KABUL_RODA_PRODUCTION_UUID,
					name: 'Miniskirts of Kabul',
					startDate: '2010-10-22',
					endDate: '2010-11-07',
					venue: {
						model: 'VENUE',
						uuid: RODA_THEATRE_VENUE_UUID,
						name: 'Roda Theatre',
						surVenue: {
							model: 'VENUE',
							uuid: BERKELEY_REPERTORY_THEATRE_VENUE_UUID,
							name: 'Berkeley Repertory Theatre'
						}
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_TWO_COMMUNISM_THE_MUJAHIDEEN_AND_THE_TALIBAN_RODA_PRODUCTION_UUID,
						name: 'Part Two - Communism, the Mujahideen and the Taliban 1979-1996',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_RODA_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					crewCredits: [
						{
							model: 'CREW_CREDIT',
							name: 'Junior Stage Managers',
							employerCompany: null,
							coEntities: [
								{
									model: 'COMPANY',
									uuid: SUB_STAGE_MANAGEMENT_LTD_COMPANY_UUID,
									name: 'Sub-Stage Management Ltd',
									members: [
										{
											model: 'PERSON',
											uuid: CHARLOTTE_PADGHAM_JR_PERSON_UUID,
											name: 'Charlotte Padgham Jr'
										}
									]
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: BLOOD_AND_GIFTS_RODA_PRODUCTION_UUID,
					name: 'Blood and Gifts',
					startDate: '2010-10-22',
					endDate: '2010-11-07',
					venue: {
						model: 'VENUE',
						uuid: RODA_THEATRE_VENUE_UUID,
						name: 'Roda Theatre',
						surVenue: {
							model: 'VENUE',
							uuid: BERKELEY_REPERTORY_THEATRE_VENUE_UUID,
							name: 'Berkeley Repertory Theatre'
						}
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_TWO_COMMUNISM_THE_MUJAHIDEEN_AND_THE_TALIBAN_RODA_PRODUCTION_UUID,
						name: 'Part Two - Communism, the Mujahideen and the Taliban 1979-1996',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_RODA_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					crewCredits: [
						{
							model: 'CREW_CREDIT',
							name: 'Junior Stage Managers',
							employerCompany: null,
							coEntities: [
								{
									model: 'COMPANY',
									uuid: SUB_STAGE_MANAGEMENT_LTD_COMPANY_UUID,
									name: 'Sub-Stage Management Ltd',
									members: [
										{
											model: 'PERSON',
											uuid: CHARLOTTE_PADGHAM_JR_PERSON_UUID,
											name: 'Charlotte Padgham Jr'
										}
									]
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: BLACK_TULIPS_RODA_PRODUCTION_UUID,
					name: 'Black Tulips',
					startDate: '2010-10-22',
					endDate: '2010-11-07',
					venue: {
						model: 'VENUE',
						uuid: RODA_THEATRE_VENUE_UUID,
						name: 'Roda Theatre',
						surVenue: {
							model: 'VENUE',
							uuid: BERKELEY_REPERTORY_THEATRE_VENUE_UUID,
							name: 'Berkeley Repertory Theatre'
						}
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_TWO_COMMUNISM_THE_MUJAHIDEEN_AND_THE_TALIBAN_RODA_PRODUCTION_UUID,
						name: 'Part Two - Communism, the Mujahideen and the Taliban 1979-1996',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_RODA_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					crewCredits: [
						{
							model: 'CREW_CREDIT',
							name: 'Junior Stage Managers',
							employerCompany: null,
							coEntities: [
								{
									model: 'COMPANY',
									uuid: SUB_STAGE_MANAGEMENT_LTD_COMPANY_UUID,
									name: 'Sub-Stage Management Ltd',
									members: [
										{
											model: 'PERSON',
											uuid: CHARLOTTE_PADGHAM_JR_PERSON_UUID,
											name: 'Charlotte Padgham Jr'
										}
									]
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: CAMPAIGN_RODA_PRODUCTION_UUID,
					name: 'Campaign',
					startDate: '2010-10-22',
					endDate: '2010-11-07',
					venue: {
						model: 'VENUE',
						uuid: RODA_THEATRE_VENUE_UUID,
						name: 'Roda Theatre',
						surVenue: {
							model: 'VENUE',
							uuid: BERKELEY_REPERTORY_THEATRE_VENUE_UUID,
							name: 'Berkeley Repertory Theatre'
						}
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_ONE_INVASIONS_AND_INDEPENDENCE_RODA_PRODUCTION_UUID,
						name: 'Part One - Invasions and Independence 1842-1930',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_RODA_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					crewCredits: [
						{
							model: 'CREW_CREDIT',
							name: 'Junior Stage Managers',
							employerCompany: null,
							coEntities: [
								{
									model: 'COMPANY',
									uuid: SUB_STAGE_MANAGEMENT_LTD_COMPANY_UUID,
									name: 'Sub-Stage Management Ltd',
									members: [
										{
											model: 'PERSON',
											uuid: CHARLOTTE_PADGHAM_JR_PERSON_UUID,
											name: 'Charlotte Padgham Jr'
										}
									]
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: DURANDS_LINE_RODA_PRODUCTION_UUID,
					name: 'Durand\'s Line',
					startDate: '2010-10-22',
					endDate: '2010-11-07',
					venue: {
						model: 'VENUE',
						uuid: RODA_THEATRE_VENUE_UUID,
						name: 'Roda Theatre',
						surVenue: {
							model: 'VENUE',
							uuid: BERKELEY_REPERTORY_THEATRE_VENUE_UUID,
							name: 'Berkeley Repertory Theatre'
						}
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_ONE_INVASIONS_AND_INDEPENDENCE_RODA_PRODUCTION_UUID,
						name: 'Part One - Invasions and Independence 1842-1930',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_RODA_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					crewCredits: [
						{
							model: 'CREW_CREDIT',
							name: 'Junior Stage Managers',
							employerCompany: null,
							coEntities: [
								{
									model: 'COMPANY',
									uuid: SUB_STAGE_MANAGEMENT_LTD_COMPANY_UUID,
									name: 'Sub-Stage Management Ltd',
									members: [
										{
											model: 'PERSON',
											uuid: CHARLOTTE_PADGHAM_JR_PERSON_UUID,
											name: 'Charlotte Padgham Jr'
										}
									]
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: BUGLES_AT_THE_GATES_OF_JALALABAD_RODA_PRODUCTION_UUID,
					name: 'Bugles at the Gates of Jalalabad',
					startDate: '2010-10-22',
					endDate: '2010-11-07',
					venue: {
						model: 'VENUE',
						uuid: RODA_THEATRE_VENUE_UUID,
						name: 'Roda Theatre',
						surVenue: {
							model: 'VENUE',
							uuid: BERKELEY_REPERTORY_THEATRE_VENUE_UUID,
							name: 'Berkeley Repertory Theatre'
						}
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_ONE_INVASIONS_AND_INDEPENDENCE_RODA_PRODUCTION_UUID,
						name: 'Part One - Invasions and Independence 1842-1930',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_RODA_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					crewCredits: [
						{
							model: 'CREW_CREDIT',
							name: 'Junior Stage Managers',
							employerCompany: null,
							coEntities: [
								{
									model: 'COMPANY',
									uuid: SUB_STAGE_MANAGEMENT_LTD_COMPANY_UUID,
									name: 'Sub-Stage Management Ltd',
									members: [
										{
											model: 'PERSON',
											uuid: CHARLOTTE_PADGHAM_JR_PERSON_UUID,
											name: 'Charlotte Padgham Jr'
										}
									]
								}
							]
						}
					]
				}
			];

			const { crewProductions } = lizzieChapmanJrPerson.body;

			expect(crewProductions).to.deep.equal(expectedCrewProductions);

		});

	});

	describe('Sub-Stage Management Ltd (company)', () => {

		it('includes productions for which they have a crew credit, including the sur-production and sur-sur-production', () => {

			const expectedCrewProductions = [
				{
					model: 'PRODUCTION',
					uuid: ON_THE_SIDE_OF_THE_ANGELS_RODA_PRODUCTION_UUID,
					name: 'On the Side of the Angels',
					startDate: '2010-10-22',
					endDate: '2010-11-07',
					venue: {
						model: 'VENUE',
						uuid: RODA_THEATRE_VENUE_UUID,
						name: 'Roda Theatre',
						surVenue: {
							model: 'VENUE',
							uuid: BERKELEY_REPERTORY_THEATRE_VENUE_UUID,
							name: 'Berkeley Repertory Theatre'
						}
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_THREE_ENDURING_FREEDOM_RODA_PRODUCTION_UUID,
						name: 'Part Three - Enduring Freedom 1996-2009',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_RODA_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					crewCredits: [
						{
							model: 'CREW_CREDIT',
							name: 'Junior Stage Managers',
							members: [
								{
									model: 'PERSON',
									uuid: CHARLOTTE_PADGHAM_JR_PERSON_UUID,
									name: 'Charlotte Padgham Jr'
								}
							],
							coEntities: [
								{
									model: 'PERSON',
									uuid: LIZZIE_CHAPMAN_JR_PERSON_UUID,
									name: 'Lizzie Chapman Jr'
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: THE_NIGHT_IS_DARKEST_BEFORE_THE_DAWN_RODA_PRODUCTION_UUID,
					name: 'The Night Is Darkest Before the Dawn',
					startDate: '2010-10-22',
					endDate: '2010-11-07',
					venue: {
						model: 'VENUE',
						uuid: RODA_THEATRE_VENUE_UUID,
						name: 'Roda Theatre',
						surVenue: {
							model: 'VENUE',
							uuid: BERKELEY_REPERTORY_THEATRE_VENUE_UUID,
							name: 'Berkeley Repertory Theatre'
						}
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_THREE_ENDURING_FREEDOM_RODA_PRODUCTION_UUID,
						name: 'Part Three - Enduring Freedom 1996-2009',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_RODA_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					crewCredits: [
						{
							model: 'CREW_CREDIT',
							name: 'Junior Stage Managers',
							members: [
								{
									model: 'PERSON',
									uuid: CHARLOTTE_PADGHAM_JR_PERSON_UUID,
									name: 'Charlotte Padgham Jr'
								}
							],
							coEntities: [
								{
									model: 'PERSON',
									uuid: LIZZIE_CHAPMAN_JR_PERSON_UUID,
									name: 'Lizzie Chapman Jr'
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: HONEY_RODA_PRODUCTION_UUID,
					name: 'Honey',
					startDate: '2010-10-22',
					endDate: '2010-11-07',
					venue: {
						model: 'VENUE',
						uuid: RODA_THEATRE_VENUE_UUID,
						name: 'Roda Theatre',
						surVenue: {
							model: 'VENUE',
							uuid: BERKELEY_REPERTORY_THEATRE_VENUE_UUID,
							name: 'Berkeley Repertory Theatre'
						}
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_THREE_ENDURING_FREEDOM_RODA_PRODUCTION_UUID,
						name: 'Part Three - Enduring Freedom 1996-2009',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_RODA_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					crewCredits: [
						{
							model: 'CREW_CREDIT',
							name: 'Junior Stage Managers',
							members: [
								{
									model: 'PERSON',
									uuid: CHARLOTTE_PADGHAM_JR_PERSON_UUID,
									name: 'Charlotte Padgham Jr'
								}
							],
							coEntities: [
								{
									model: 'PERSON',
									uuid: LIZZIE_CHAPMAN_JR_PERSON_UUID,
									name: 'Lizzie Chapman Jr'
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: MINISKIRTS_OF_KABUL_RODA_PRODUCTION_UUID,
					name: 'Miniskirts of Kabul',
					startDate: '2010-10-22',
					endDate: '2010-11-07',
					venue: {
						model: 'VENUE',
						uuid: RODA_THEATRE_VENUE_UUID,
						name: 'Roda Theatre',
						surVenue: {
							model: 'VENUE',
							uuid: BERKELEY_REPERTORY_THEATRE_VENUE_UUID,
							name: 'Berkeley Repertory Theatre'
						}
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_TWO_COMMUNISM_THE_MUJAHIDEEN_AND_THE_TALIBAN_RODA_PRODUCTION_UUID,
						name: 'Part Two - Communism, the Mujahideen and the Taliban 1979-1996',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_RODA_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					crewCredits: [
						{
							model: 'CREW_CREDIT',
							name: 'Junior Stage Managers',
							members: [
								{
									model: 'PERSON',
									uuid: CHARLOTTE_PADGHAM_JR_PERSON_UUID,
									name: 'Charlotte Padgham Jr'
								}
							],
							coEntities: [
								{
									model: 'PERSON',
									uuid: LIZZIE_CHAPMAN_JR_PERSON_UUID,
									name: 'Lizzie Chapman Jr'
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: BLOOD_AND_GIFTS_RODA_PRODUCTION_UUID,
					name: 'Blood and Gifts',
					startDate: '2010-10-22',
					endDate: '2010-11-07',
					venue: {
						model: 'VENUE',
						uuid: RODA_THEATRE_VENUE_UUID,
						name: 'Roda Theatre',
						surVenue: {
							model: 'VENUE',
							uuid: BERKELEY_REPERTORY_THEATRE_VENUE_UUID,
							name: 'Berkeley Repertory Theatre'
						}
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_TWO_COMMUNISM_THE_MUJAHIDEEN_AND_THE_TALIBAN_RODA_PRODUCTION_UUID,
						name: 'Part Two - Communism, the Mujahideen and the Taliban 1979-1996',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_RODA_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					crewCredits: [
						{
							model: 'CREW_CREDIT',
							name: 'Junior Stage Managers',
							members: [
								{
									model: 'PERSON',
									uuid: CHARLOTTE_PADGHAM_JR_PERSON_UUID,
									name: 'Charlotte Padgham Jr'
								}
							],
							coEntities: [
								{
									model: 'PERSON',
									uuid: LIZZIE_CHAPMAN_JR_PERSON_UUID,
									name: 'Lizzie Chapman Jr'
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: BLACK_TULIPS_RODA_PRODUCTION_UUID,
					name: 'Black Tulips',
					startDate: '2010-10-22',
					endDate: '2010-11-07',
					venue: {
						model: 'VENUE',
						uuid: RODA_THEATRE_VENUE_UUID,
						name: 'Roda Theatre',
						surVenue: {
							model: 'VENUE',
							uuid: BERKELEY_REPERTORY_THEATRE_VENUE_UUID,
							name: 'Berkeley Repertory Theatre'
						}
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_TWO_COMMUNISM_THE_MUJAHIDEEN_AND_THE_TALIBAN_RODA_PRODUCTION_UUID,
						name: 'Part Two - Communism, the Mujahideen and the Taliban 1979-1996',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_RODA_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					crewCredits: [
						{
							model: 'CREW_CREDIT',
							name: 'Junior Stage Managers',
							members: [
								{
									model: 'PERSON',
									uuid: CHARLOTTE_PADGHAM_JR_PERSON_UUID,
									name: 'Charlotte Padgham Jr'
								}
							],
							coEntities: [
								{
									model: 'PERSON',
									uuid: LIZZIE_CHAPMAN_JR_PERSON_UUID,
									name: 'Lizzie Chapman Jr'
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: CAMPAIGN_RODA_PRODUCTION_UUID,
					name: 'Campaign',
					startDate: '2010-10-22',
					endDate: '2010-11-07',
					venue: {
						model: 'VENUE',
						uuid: RODA_THEATRE_VENUE_UUID,
						name: 'Roda Theatre',
						surVenue: {
							model: 'VENUE',
							uuid: BERKELEY_REPERTORY_THEATRE_VENUE_UUID,
							name: 'Berkeley Repertory Theatre'
						}
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_ONE_INVASIONS_AND_INDEPENDENCE_RODA_PRODUCTION_UUID,
						name: 'Part One - Invasions and Independence 1842-1930',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_RODA_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					crewCredits: [
						{
							model: 'CREW_CREDIT',
							name: 'Junior Stage Managers',
							members: [
								{
									model: 'PERSON',
									uuid: CHARLOTTE_PADGHAM_JR_PERSON_UUID,
									name: 'Charlotte Padgham Jr'
								}
							],
							coEntities: [
								{
									model: 'PERSON',
									uuid: LIZZIE_CHAPMAN_JR_PERSON_UUID,
									name: 'Lizzie Chapman Jr'
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: DURANDS_LINE_RODA_PRODUCTION_UUID,
					name: 'Durand\'s Line',
					startDate: '2010-10-22',
					endDate: '2010-11-07',
					venue: {
						model: 'VENUE',
						uuid: RODA_THEATRE_VENUE_UUID,
						name: 'Roda Theatre',
						surVenue: {
							model: 'VENUE',
							uuid: BERKELEY_REPERTORY_THEATRE_VENUE_UUID,
							name: 'Berkeley Repertory Theatre'
						}
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_ONE_INVASIONS_AND_INDEPENDENCE_RODA_PRODUCTION_UUID,
						name: 'Part One - Invasions and Independence 1842-1930',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_RODA_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					crewCredits: [
						{
							model: 'CREW_CREDIT',
							name: 'Junior Stage Managers',
							members: [
								{
									model: 'PERSON',
									uuid: CHARLOTTE_PADGHAM_JR_PERSON_UUID,
									name: 'Charlotte Padgham Jr'
								}
							],
							coEntities: [
								{
									model: 'PERSON',
									uuid: LIZZIE_CHAPMAN_JR_PERSON_UUID,
									name: 'Lizzie Chapman Jr'
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: BUGLES_AT_THE_GATES_OF_JALALABAD_RODA_PRODUCTION_UUID,
					name: 'Bugles at the Gates of Jalalabad',
					startDate: '2010-10-22',
					endDate: '2010-11-07',
					venue: {
						model: 'VENUE',
						uuid: RODA_THEATRE_VENUE_UUID,
						name: 'Roda Theatre',
						surVenue: {
							model: 'VENUE',
							uuid: BERKELEY_REPERTORY_THEATRE_VENUE_UUID,
							name: 'Berkeley Repertory Theatre'
						}
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_ONE_INVASIONS_AND_INDEPENDENCE_RODA_PRODUCTION_UUID,
						name: 'Part One - Invasions and Independence 1842-1930',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_RODA_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					crewCredits: [
						{
							model: 'CREW_CREDIT',
							name: 'Junior Stage Managers',
							members: [
								{
									model: 'PERSON',
									uuid: CHARLOTTE_PADGHAM_JR_PERSON_UUID,
									name: 'Charlotte Padgham Jr'
								}
							],
							coEntities: [
								{
									model: 'PERSON',
									uuid: LIZZIE_CHAPMAN_JR_PERSON_UUID,
									name: 'Lizzie Chapman Jr'
								}
							]
						}
					]
				}
			];

			const { crewProductions } = subStageManagementLtdCompany.body;

			expect(crewProductions).to.deep.equal(expectedCrewProductions);

		});

	});

	describe('Charlotte Padgham Jr (person)', () => {

		it('includes productions for which they have a crew credit, including the sur-production and sur-sur-production', () => {

			const expectedCrewProductions = [
				{
					model: 'PRODUCTION',
					uuid: ON_THE_SIDE_OF_THE_ANGELS_RODA_PRODUCTION_UUID,
					name: 'On the Side of the Angels',
					startDate: '2010-10-22',
					endDate: '2010-11-07',
					venue: {
						model: 'VENUE',
						uuid: RODA_THEATRE_VENUE_UUID,
						name: 'Roda Theatre',
						surVenue: {
							model: 'VENUE',
							uuid: BERKELEY_REPERTORY_THEATRE_VENUE_UUID,
							name: 'Berkeley Repertory Theatre'
						}
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_THREE_ENDURING_FREEDOM_RODA_PRODUCTION_UUID,
						name: 'Part Three - Enduring Freedom 1996-2009',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_RODA_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					crewCredits: [
						{
							model: 'CREW_CREDIT',
							name: 'Junior Stage Managers',
							employerCompany: {
								model: 'COMPANY',
								uuid: SUB_STAGE_MANAGEMENT_LTD_COMPANY_UUID,
								name: 'Sub-Stage Management Ltd',
								coMembers: []
							},
							coEntities: [
								{
									model: 'PERSON',
									uuid: LIZZIE_CHAPMAN_JR_PERSON_UUID,
									name: 'Lizzie Chapman Jr'
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: THE_NIGHT_IS_DARKEST_BEFORE_THE_DAWN_RODA_PRODUCTION_UUID,
					name: 'The Night Is Darkest Before the Dawn',
					startDate: '2010-10-22',
					endDate: '2010-11-07',
					venue: {
						model: 'VENUE',
						uuid: RODA_THEATRE_VENUE_UUID,
						name: 'Roda Theatre',
						surVenue: {
							model: 'VENUE',
							uuid: BERKELEY_REPERTORY_THEATRE_VENUE_UUID,
							name: 'Berkeley Repertory Theatre'
						}
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_THREE_ENDURING_FREEDOM_RODA_PRODUCTION_UUID,
						name: 'Part Three - Enduring Freedom 1996-2009',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_RODA_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					crewCredits: [
						{
							model: 'CREW_CREDIT',
							name: 'Junior Stage Managers',
							employerCompany: {
								model: 'COMPANY',
								uuid: SUB_STAGE_MANAGEMENT_LTD_COMPANY_UUID,
								name: 'Sub-Stage Management Ltd',
								coMembers: []
							},
							coEntities: [
								{
									model: 'PERSON',
									uuid: LIZZIE_CHAPMAN_JR_PERSON_UUID,
									name: 'Lizzie Chapman Jr'
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: HONEY_RODA_PRODUCTION_UUID,
					name: 'Honey',
					startDate: '2010-10-22',
					endDate: '2010-11-07',
					venue: {
						model: 'VENUE',
						uuid: RODA_THEATRE_VENUE_UUID,
						name: 'Roda Theatre',
						surVenue: {
							model: 'VENUE',
							uuid: BERKELEY_REPERTORY_THEATRE_VENUE_UUID,
							name: 'Berkeley Repertory Theatre'
						}
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_THREE_ENDURING_FREEDOM_RODA_PRODUCTION_UUID,
						name: 'Part Three - Enduring Freedom 1996-2009',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_RODA_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					crewCredits: [
						{
							model: 'CREW_CREDIT',
							name: 'Junior Stage Managers',
							employerCompany: {
								model: 'COMPANY',
								uuid: SUB_STAGE_MANAGEMENT_LTD_COMPANY_UUID,
								name: 'Sub-Stage Management Ltd',
								coMembers: []
							},
							coEntities: [
								{
									model: 'PERSON',
									uuid: LIZZIE_CHAPMAN_JR_PERSON_UUID,
									name: 'Lizzie Chapman Jr'
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: MINISKIRTS_OF_KABUL_RODA_PRODUCTION_UUID,
					name: 'Miniskirts of Kabul',
					startDate: '2010-10-22',
					endDate: '2010-11-07',
					venue: {
						model: 'VENUE',
						uuid: RODA_THEATRE_VENUE_UUID,
						name: 'Roda Theatre',
						surVenue: {
							model: 'VENUE',
							uuid: BERKELEY_REPERTORY_THEATRE_VENUE_UUID,
							name: 'Berkeley Repertory Theatre'
						}
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_TWO_COMMUNISM_THE_MUJAHIDEEN_AND_THE_TALIBAN_RODA_PRODUCTION_UUID,
						name: 'Part Two - Communism, the Mujahideen and the Taliban 1979-1996',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_RODA_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					crewCredits: [
						{
							model: 'CREW_CREDIT',
							name: 'Junior Stage Managers',
							employerCompany: {
								model: 'COMPANY',
								uuid: SUB_STAGE_MANAGEMENT_LTD_COMPANY_UUID,
								name: 'Sub-Stage Management Ltd',
								coMembers: []
							},
							coEntities: [
								{
									model: 'PERSON',
									uuid: LIZZIE_CHAPMAN_JR_PERSON_UUID,
									name: 'Lizzie Chapman Jr'
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: BLOOD_AND_GIFTS_RODA_PRODUCTION_UUID,
					name: 'Blood and Gifts',
					startDate: '2010-10-22',
					endDate: '2010-11-07',
					venue: {
						model: 'VENUE',
						uuid: RODA_THEATRE_VENUE_UUID,
						name: 'Roda Theatre',
						surVenue: {
							model: 'VENUE',
							uuid: BERKELEY_REPERTORY_THEATRE_VENUE_UUID,
							name: 'Berkeley Repertory Theatre'
						}
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_TWO_COMMUNISM_THE_MUJAHIDEEN_AND_THE_TALIBAN_RODA_PRODUCTION_UUID,
						name: 'Part Two - Communism, the Mujahideen and the Taliban 1979-1996',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_RODA_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					crewCredits: [
						{
							model: 'CREW_CREDIT',
							name: 'Junior Stage Managers',
							employerCompany: {
								model: 'COMPANY',
								uuid: SUB_STAGE_MANAGEMENT_LTD_COMPANY_UUID,
								name: 'Sub-Stage Management Ltd',
								coMembers: []
							},
							coEntities: [
								{
									model: 'PERSON',
									uuid: LIZZIE_CHAPMAN_JR_PERSON_UUID,
									name: 'Lizzie Chapman Jr'
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: BLACK_TULIPS_RODA_PRODUCTION_UUID,
					name: 'Black Tulips',
					startDate: '2010-10-22',
					endDate: '2010-11-07',
					venue: {
						model: 'VENUE',
						uuid: RODA_THEATRE_VENUE_UUID,
						name: 'Roda Theatre',
						surVenue: {
							model: 'VENUE',
							uuid: BERKELEY_REPERTORY_THEATRE_VENUE_UUID,
							name: 'Berkeley Repertory Theatre'
						}
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_TWO_COMMUNISM_THE_MUJAHIDEEN_AND_THE_TALIBAN_RODA_PRODUCTION_UUID,
						name: 'Part Two - Communism, the Mujahideen and the Taliban 1979-1996',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_RODA_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					crewCredits: [
						{
							model: 'CREW_CREDIT',
							name: 'Junior Stage Managers',
							employerCompany: {
								model: 'COMPANY',
								uuid: SUB_STAGE_MANAGEMENT_LTD_COMPANY_UUID,
								name: 'Sub-Stage Management Ltd',
								coMembers: []
							},
							coEntities: [
								{
									model: 'PERSON',
									uuid: LIZZIE_CHAPMAN_JR_PERSON_UUID,
									name: 'Lizzie Chapman Jr'
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: CAMPAIGN_RODA_PRODUCTION_UUID,
					name: 'Campaign',
					startDate: '2010-10-22',
					endDate: '2010-11-07',
					venue: {
						model: 'VENUE',
						uuid: RODA_THEATRE_VENUE_UUID,
						name: 'Roda Theatre',
						surVenue: {
							model: 'VENUE',
							uuid: BERKELEY_REPERTORY_THEATRE_VENUE_UUID,
							name: 'Berkeley Repertory Theatre'
						}
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_ONE_INVASIONS_AND_INDEPENDENCE_RODA_PRODUCTION_UUID,
						name: 'Part One - Invasions and Independence 1842-1930',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_RODA_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					crewCredits: [
						{
							model: 'CREW_CREDIT',
							name: 'Junior Stage Managers',
							employerCompany: {
								model: 'COMPANY',
								uuid: SUB_STAGE_MANAGEMENT_LTD_COMPANY_UUID,
								name: 'Sub-Stage Management Ltd',
								coMembers: []
							},
							coEntities: [
								{
									model: 'PERSON',
									uuid: LIZZIE_CHAPMAN_JR_PERSON_UUID,
									name: 'Lizzie Chapman Jr'
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: DURANDS_LINE_RODA_PRODUCTION_UUID,
					name: 'Durand\'s Line',
					startDate: '2010-10-22',
					endDate: '2010-11-07',
					venue: {
						model: 'VENUE',
						uuid: RODA_THEATRE_VENUE_UUID,
						name: 'Roda Theatre',
						surVenue: {
							model: 'VENUE',
							uuid: BERKELEY_REPERTORY_THEATRE_VENUE_UUID,
							name: 'Berkeley Repertory Theatre'
						}
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_ONE_INVASIONS_AND_INDEPENDENCE_RODA_PRODUCTION_UUID,
						name: 'Part One - Invasions and Independence 1842-1930',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_RODA_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					crewCredits: [
						{
							model: 'CREW_CREDIT',
							name: 'Junior Stage Managers',
							employerCompany: {
								model: 'COMPANY',
								uuid: SUB_STAGE_MANAGEMENT_LTD_COMPANY_UUID,
								name: 'Sub-Stage Management Ltd',
								coMembers: []
							},
							coEntities: [
								{
									model: 'PERSON',
									uuid: LIZZIE_CHAPMAN_JR_PERSON_UUID,
									name: 'Lizzie Chapman Jr'
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: BUGLES_AT_THE_GATES_OF_JALALABAD_RODA_PRODUCTION_UUID,
					name: 'Bugles at the Gates of Jalalabad',
					startDate: '2010-10-22',
					endDate: '2010-11-07',
					venue: {
						model: 'VENUE',
						uuid: RODA_THEATRE_VENUE_UUID,
						name: 'Roda Theatre',
						surVenue: {
							model: 'VENUE',
							uuid: BERKELEY_REPERTORY_THEATRE_VENUE_UUID,
							name: 'Berkeley Repertory Theatre'
						}
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_ONE_INVASIONS_AND_INDEPENDENCE_RODA_PRODUCTION_UUID,
						name: 'Part One - Invasions and Independence 1842-1930',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_RODA_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					crewCredits: [
						{
							model: 'CREW_CREDIT',
							name: 'Junior Stage Managers',
							employerCompany: {
								model: 'COMPANY',
								uuid: SUB_STAGE_MANAGEMENT_LTD_COMPANY_UUID,
								name: 'Sub-Stage Management Ltd',
								coMembers: []
							},
							coEntities: [
								{
									model: 'PERSON',
									uuid: LIZZIE_CHAPMAN_JR_PERSON_UUID,
									name: 'Lizzie Chapman Jr'
								}
							]
						}
					]
				}
			];

			const { crewProductions } = charlottePadghamJrPerson.body;

			expect(crewProductions).to.deep.equal(expectedCrewProductions);

		});

	});

	describe('Bar Jr (character)', () => {

		it('includes productions in which character was portrayed, including the sur-production and sur-sur-production', () => {

			const expectedProductions = [
				{
					model: 'PRODUCTION',
					uuid: ON_THE_SIDE_OF_THE_ANGELS_RODA_PRODUCTION_UUID,
					name: 'On the Side of the Angels',
					startDate: '2010-10-22',
					endDate: '2010-11-07',
					venue: {
						model: 'VENUE',
						uuid: RODA_THEATRE_VENUE_UUID,
						name: 'Roda Theatre',
						surVenue: {
							model: 'VENUE',
							uuid: BERKELEY_REPERTORY_THEATRE_VENUE_UUID,
							name: 'Berkeley Repertory Theatre'
						}
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_THREE_ENDURING_FREEDOM_RODA_PRODUCTION_UUID,
						name: 'Part Three - Enduring Freedom 1996-2009',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_RODA_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					performers: [
						{
							model: 'PERSON',
							uuid: RICK_WARDEN_JR_PERSON_UUID,
							name: 'Rick Warden Jr',
							roleName: 'Bar Jr',
							qualifier: null,
							isAlternate: false,
							otherRoles: []
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: THE_NIGHT_IS_DARKEST_BEFORE_THE_DAWN_RODA_PRODUCTION_UUID,
					name: 'The Night Is Darkest Before the Dawn',
					startDate: '2010-10-22',
					endDate: '2010-11-07',
					venue: {
						model: 'VENUE',
						uuid: RODA_THEATRE_VENUE_UUID,
						name: 'Roda Theatre',
						surVenue: {
							model: 'VENUE',
							uuid: BERKELEY_REPERTORY_THEATRE_VENUE_UUID,
							name: 'Berkeley Repertory Theatre'
						}
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_THREE_ENDURING_FREEDOM_RODA_PRODUCTION_UUID,
						name: 'Part Three - Enduring Freedom 1996-2009',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_RODA_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					performers: [
						{
							model: 'PERSON',
							uuid: RICK_WARDEN_JR_PERSON_UUID,
							name: 'Rick Warden Jr',
							roleName: 'Bar Jr',
							qualifier: null,
							isAlternate: false,
							otherRoles: []
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: HONEY_RODA_PRODUCTION_UUID,
					name: 'Honey',
					startDate: '2010-10-22',
					endDate: '2010-11-07',
					venue: {
						model: 'VENUE',
						uuid: RODA_THEATRE_VENUE_UUID,
						name: 'Roda Theatre',
						surVenue: {
							model: 'VENUE',
							uuid: BERKELEY_REPERTORY_THEATRE_VENUE_UUID,
							name: 'Berkeley Repertory Theatre'
						}
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_THREE_ENDURING_FREEDOM_RODA_PRODUCTION_UUID,
						name: 'Part Three - Enduring Freedom 1996-2009',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_RODA_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					performers: [
						{
							model: 'PERSON',
							uuid: RICK_WARDEN_JR_PERSON_UUID,
							name: 'Rick Warden Jr',
							roleName: 'Bar Jr',
							qualifier: null,
							isAlternate: false,
							otherRoles: []
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: MINISKIRTS_OF_KABUL_RODA_PRODUCTION_UUID,
					name: 'Miniskirts of Kabul',
					startDate: '2010-10-22',
					endDate: '2010-11-07',
					venue: {
						model: 'VENUE',
						uuid: RODA_THEATRE_VENUE_UUID,
						name: 'Roda Theatre',
						surVenue: {
							model: 'VENUE',
							uuid: BERKELEY_REPERTORY_THEATRE_VENUE_UUID,
							name: 'Berkeley Repertory Theatre'
						}
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_TWO_COMMUNISM_THE_MUJAHIDEEN_AND_THE_TALIBAN_RODA_PRODUCTION_UUID,
						name: 'Part Two - Communism, the Mujahideen and the Taliban 1979-1996',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_RODA_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					performers: [
						{
							model: 'PERSON',
							uuid: RICK_WARDEN_JR_PERSON_UUID,
							name: 'Rick Warden Jr',
							roleName: 'Bar Jr',
							qualifier: null,
							isAlternate: false,
							otherRoles: []
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: BLOOD_AND_GIFTS_RODA_PRODUCTION_UUID,
					name: 'Blood and Gifts',
					startDate: '2010-10-22',
					endDate: '2010-11-07',
					venue: {
						model: 'VENUE',
						uuid: RODA_THEATRE_VENUE_UUID,
						name: 'Roda Theatre',
						surVenue: {
							model: 'VENUE',
							uuid: BERKELEY_REPERTORY_THEATRE_VENUE_UUID,
							name: 'Berkeley Repertory Theatre'
						}
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_TWO_COMMUNISM_THE_MUJAHIDEEN_AND_THE_TALIBAN_RODA_PRODUCTION_UUID,
						name: 'Part Two - Communism, the Mujahideen and the Taliban 1979-1996',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_RODA_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					performers: [
						{
							model: 'PERSON',
							uuid: RICK_WARDEN_JR_PERSON_UUID,
							name: 'Rick Warden Jr',
							roleName: 'Bar Jr',
							qualifier: null,
							isAlternate: false,
							otherRoles: []
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: BLACK_TULIPS_RODA_PRODUCTION_UUID,
					name: 'Black Tulips',
					startDate: '2010-10-22',
					endDate: '2010-11-07',
					venue: {
						model: 'VENUE',
						uuid: RODA_THEATRE_VENUE_UUID,
						name: 'Roda Theatre',
						surVenue: {
							model: 'VENUE',
							uuid: BERKELEY_REPERTORY_THEATRE_VENUE_UUID,
							name: 'Berkeley Repertory Theatre'
						}
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_TWO_COMMUNISM_THE_MUJAHIDEEN_AND_THE_TALIBAN_RODA_PRODUCTION_UUID,
						name: 'Part Two - Communism, the Mujahideen and the Taliban 1979-1996',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_RODA_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					performers: [
						{
							model: 'PERSON',
							uuid: RICK_WARDEN_JR_PERSON_UUID,
							name: 'Rick Warden Jr',
							roleName: 'Bar Jr',
							qualifier: null,
							isAlternate: false,
							otherRoles: []
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: CAMPAIGN_RODA_PRODUCTION_UUID,
					name: 'Campaign',
					startDate: '2010-10-22',
					endDate: '2010-11-07',
					venue: {
						model: 'VENUE',
						uuid: RODA_THEATRE_VENUE_UUID,
						name: 'Roda Theatre',
						surVenue: {
							model: 'VENUE',
							uuid: BERKELEY_REPERTORY_THEATRE_VENUE_UUID,
							name: 'Berkeley Repertory Theatre'
						}
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_ONE_INVASIONS_AND_INDEPENDENCE_RODA_PRODUCTION_UUID,
						name: 'Part One - Invasions and Independence 1842-1930',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_RODA_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					performers: [
						{
							model: 'PERSON',
							uuid: RICK_WARDEN_JR_PERSON_UUID,
							name: 'Rick Warden Jr',
							roleName: 'Bar Jr',
							qualifier: null,
							isAlternate: false,
							otherRoles: []
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: DURANDS_LINE_RODA_PRODUCTION_UUID,
					name: 'Durand\'s Line',
					startDate: '2010-10-22',
					endDate: '2010-11-07',
					venue: {
						model: 'VENUE',
						uuid: RODA_THEATRE_VENUE_UUID,
						name: 'Roda Theatre',
						surVenue: {
							model: 'VENUE',
							uuid: BERKELEY_REPERTORY_THEATRE_VENUE_UUID,
							name: 'Berkeley Repertory Theatre'
						}
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_ONE_INVASIONS_AND_INDEPENDENCE_RODA_PRODUCTION_UUID,
						name: 'Part One - Invasions and Independence 1842-1930',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_RODA_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					performers: [
						{
							model: 'PERSON',
							uuid: RICK_WARDEN_JR_PERSON_UUID,
							name: 'Rick Warden Jr',
							roleName: 'Bar Jr',
							qualifier: null,
							isAlternate: false,
							otherRoles: []
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: BUGLES_AT_THE_GATES_OF_JALALABAD_RODA_PRODUCTION_UUID,
					name: 'Bugles at the Gates of Jalalabad',
					startDate: '2010-10-22',
					endDate: '2010-11-07',
					venue: {
						model: 'VENUE',
						uuid: RODA_THEATRE_VENUE_UUID,
						name: 'Roda Theatre',
						surVenue: {
							model: 'VENUE',
							uuid: BERKELEY_REPERTORY_THEATRE_VENUE_UUID,
							name: 'Berkeley Repertory Theatre'
						}
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_ONE_INVASIONS_AND_INDEPENDENCE_RODA_PRODUCTION_UUID,
						name: 'Part One - Invasions and Independence 1842-1930',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_RODA_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					performers: [
						{
							model: 'PERSON',
							uuid: RICK_WARDEN_JR_PERSON_UUID,
							name: 'Rick Warden Jr',
							roleName: 'Bar Jr',
							qualifier: null,
							isAlternate: false,
							otherRoles: []
						}
					]
				}
			];

			const { productions } = barJrCharacter.body;

			expect(productions).to.deep.equal(expectedProductions);

		});

	});

	describe('productions list', () => {

		it('includes productions and, where applicable, corresponding sur-productions and sur-sur-productions; will exclude sur-productions as these will be included via their sub-productions', async () => {

			const response = await chai.request(app)
				.get('/productions');

			const expectedResponseBody = [
				{
					model: 'PRODUCTION',
					uuid: ON_THE_SIDE_OF_THE_ANGELS_RODA_PRODUCTION_UUID,
					name: 'On the Side of the Angels',
					startDate: '2010-10-22',
					endDate: '2010-11-07',
					venue: {
						model: 'VENUE',
						uuid: RODA_THEATRE_VENUE_UUID,
						name: 'Roda Theatre',
						surVenue: {
							model: 'VENUE',
							uuid: BERKELEY_REPERTORY_THEATRE_VENUE_UUID,
							name: 'Berkeley Repertory Theatre'
						}
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_THREE_ENDURING_FREEDOM_RODA_PRODUCTION_UUID,
						name: 'Part Three - Enduring Freedom 1996-2009',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_RODA_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					}
				},
				{
					model: 'PRODUCTION',
					uuid: THE_NIGHT_IS_DARKEST_BEFORE_THE_DAWN_RODA_PRODUCTION_UUID,
					name: 'The Night Is Darkest Before the Dawn',
					startDate: '2010-10-22',
					endDate: '2010-11-07',
					venue: {
						model: 'VENUE',
						uuid: RODA_THEATRE_VENUE_UUID,
						name: 'Roda Theatre',
						surVenue: {
							model: 'VENUE',
							uuid: BERKELEY_REPERTORY_THEATRE_VENUE_UUID,
							name: 'Berkeley Repertory Theatre'
						}
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_THREE_ENDURING_FREEDOM_RODA_PRODUCTION_UUID,
						name: 'Part Three - Enduring Freedom 1996-2009',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_RODA_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					}
				},
				{
					model: 'PRODUCTION',
					uuid: HONEY_RODA_PRODUCTION_UUID,
					name: 'Honey',
					startDate: '2010-10-22',
					endDate: '2010-11-07',
					venue: {
						model: 'VENUE',
						uuid: RODA_THEATRE_VENUE_UUID,
						name: 'Roda Theatre',
						surVenue: {
							model: 'VENUE',
							uuid: BERKELEY_REPERTORY_THEATRE_VENUE_UUID,
							name: 'Berkeley Repertory Theatre'
						}
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_THREE_ENDURING_FREEDOM_RODA_PRODUCTION_UUID,
						name: 'Part Three - Enduring Freedom 1996-2009',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_RODA_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					}
				},
				{
					model: 'PRODUCTION',
					uuid: MINISKIRTS_OF_KABUL_RODA_PRODUCTION_UUID,
					name: 'Miniskirts of Kabul',
					startDate: '2010-10-22',
					endDate: '2010-11-07',
					venue: {
						model: 'VENUE',
						uuid: RODA_THEATRE_VENUE_UUID,
						name: 'Roda Theatre',
						surVenue: {
							model: 'VENUE',
							uuid: BERKELEY_REPERTORY_THEATRE_VENUE_UUID,
							name: 'Berkeley Repertory Theatre'
						}
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_TWO_COMMUNISM_THE_MUJAHIDEEN_AND_THE_TALIBAN_RODA_PRODUCTION_UUID,
						name: 'Part Two - Communism, the Mujahideen and the Taliban 1979-1996',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_RODA_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					}
				},
				{
					model: 'PRODUCTION',
					uuid: BLOOD_AND_GIFTS_RODA_PRODUCTION_UUID,
					name: 'Blood and Gifts',
					startDate: '2010-10-22',
					endDate: '2010-11-07',
					venue: {
						model: 'VENUE',
						uuid: RODA_THEATRE_VENUE_UUID,
						name: 'Roda Theatre',
						surVenue: {
							model: 'VENUE',
							uuid: BERKELEY_REPERTORY_THEATRE_VENUE_UUID,
							name: 'Berkeley Repertory Theatre'
						}
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_TWO_COMMUNISM_THE_MUJAHIDEEN_AND_THE_TALIBAN_RODA_PRODUCTION_UUID,
						name: 'Part Two - Communism, the Mujahideen and the Taliban 1979-1996',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_RODA_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					}
				},
				{
					model: 'PRODUCTION',
					uuid: BLACK_TULIPS_RODA_PRODUCTION_UUID,
					name: 'Black Tulips',
					startDate: '2010-10-22',
					endDate: '2010-11-07',
					venue: {
						model: 'VENUE',
						uuid: RODA_THEATRE_VENUE_UUID,
						name: 'Roda Theatre',
						surVenue: {
							model: 'VENUE',
							uuid: BERKELEY_REPERTORY_THEATRE_VENUE_UUID,
							name: 'Berkeley Repertory Theatre'
						}
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_TWO_COMMUNISM_THE_MUJAHIDEEN_AND_THE_TALIBAN_RODA_PRODUCTION_UUID,
						name: 'Part Two - Communism, the Mujahideen and the Taliban 1979-1996',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_RODA_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					}
				},
				{
					model: 'PRODUCTION',
					uuid: CAMPAIGN_RODA_PRODUCTION_UUID,
					name: 'Campaign',
					startDate: '2010-10-22',
					endDate: '2010-11-07',
					venue: {
						model: 'VENUE',
						uuid: RODA_THEATRE_VENUE_UUID,
						name: 'Roda Theatre',
						surVenue: {
							model: 'VENUE',
							uuid: BERKELEY_REPERTORY_THEATRE_VENUE_UUID,
							name: 'Berkeley Repertory Theatre'
						}
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_ONE_INVASIONS_AND_INDEPENDENCE_RODA_PRODUCTION_UUID,
						name: 'Part One - Invasions and Independence 1842-1930',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_RODA_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					}
				},
				{
					model: 'PRODUCTION',
					uuid: DURANDS_LINE_RODA_PRODUCTION_UUID,
					name: 'Durand\'s Line',
					startDate: '2010-10-22',
					endDate: '2010-11-07',
					venue: {
						model: 'VENUE',
						uuid: RODA_THEATRE_VENUE_UUID,
						name: 'Roda Theatre',
						surVenue: {
							model: 'VENUE',
							uuid: BERKELEY_REPERTORY_THEATRE_VENUE_UUID,
							name: 'Berkeley Repertory Theatre'
						}
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_ONE_INVASIONS_AND_INDEPENDENCE_RODA_PRODUCTION_UUID,
						name: 'Part One - Invasions and Independence 1842-1930',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_RODA_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					}
				},
				{
					model: 'PRODUCTION',
					uuid: BUGLES_AT_THE_GATES_OF_JALALABAD_RODA_PRODUCTION_UUID,
					name: 'Bugles at the Gates of Jalalabad',
					startDate: '2010-10-22',
					endDate: '2010-11-07',
					venue: {
						model: 'VENUE',
						uuid: RODA_THEATRE_VENUE_UUID,
						name: 'Roda Theatre',
						surVenue: {
							model: 'VENUE',
							uuid: BERKELEY_REPERTORY_THEATRE_VENUE_UUID,
							name: 'Berkeley Repertory Theatre'
						}
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_ONE_INVASIONS_AND_INDEPENDENCE_RODA_PRODUCTION_UUID,
						name: 'Part One - Invasions and Independence 1842-1930',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_RODA_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					}
				},
				{
					model: 'PRODUCTION',
					uuid: ON_THE_SIDE_OF_THE_ANGELS_TRICYCLE_PRODUCTION_UUID,
					name: 'On the Side of the Angels',
					startDate: '2009-04-17',
					endDate: '2009-06-14',
					venue: {
						model: 'VENUE',
						uuid: TRICYCLE_THEATRE_VENUE_UUID,
						name: 'Tricycle Theatre',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_THREE_ENDURING_FREEDOM_TRICYCLE_PRODUCTION_UUID,
						name: 'Part Three - Enduring Freedom 1996-2009',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_TRICYCLE_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					}
				},
				{
					model: 'PRODUCTION',
					uuid: THE_NIGHT_IS_DARKEST_BEFORE_THE_DAWN_TRICYCLE_PRODUCTION_UUID,
					name: 'The Night Is Darkest Before the Dawn',
					startDate: '2009-04-17',
					endDate: '2009-06-14',
					venue: {
						model: 'VENUE',
						uuid: TRICYCLE_THEATRE_VENUE_UUID,
						name: 'Tricycle Theatre',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_THREE_ENDURING_FREEDOM_TRICYCLE_PRODUCTION_UUID,
						name: 'Part Three - Enduring Freedom 1996-2009',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_TRICYCLE_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					}
				},
				{
					model: 'PRODUCTION',
					uuid: HONEY_TRICYCLE_PRODUCTION_UUID,
					name: 'Honey',
					startDate: '2009-04-17',
					endDate: '2009-06-14',
					venue: {
						model: 'VENUE',
						uuid: TRICYCLE_THEATRE_VENUE_UUID,
						name: 'Tricycle Theatre',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_THREE_ENDURING_FREEDOM_TRICYCLE_PRODUCTION_UUID,
						name: 'Part Three - Enduring Freedom 1996-2009',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_TRICYCLE_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					}
				},
				{
					model: 'PRODUCTION',
					uuid: MINISKIRTS_OF_KABUL_TRICYCLE_PRODUCTION_UUID,
					name: 'Miniskirts of Kabul',
					startDate: '2009-04-17',
					endDate: '2009-06-14',
					venue: {
						model: 'VENUE',
						uuid: TRICYCLE_THEATRE_VENUE_UUID,
						name: 'Tricycle Theatre',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_TWO_COMMUNISM_THE_MUJAHIDEEN_AND_THE_TALIBAN_TRICYCLE_PRODUCTION_UUID,
						name: 'Part Two - Communism, the Mujahideen and the Taliban 1979-1996',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_TRICYCLE_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					}
				},
				{
					model: 'PRODUCTION',
					uuid: BLOOD_AND_GIFTS_TRICYCLE_PRODUCTION_UUID,
					name: 'Blood and Gifts',
					startDate: '2009-04-17',
					endDate: '2009-06-14',
					venue: {
						model: 'VENUE',
						uuid: TRICYCLE_THEATRE_VENUE_UUID,
						name: 'Tricycle Theatre',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_TWO_COMMUNISM_THE_MUJAHIDEEN_AND_THE_TALIBAN_TRICYCLE_PRODUCTION_UUID,
						name: 'Part Two - Communism, the Mujahideen and the Taliban 1979-1996',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_TRICYCLE_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					}
				},
				{
					model: 'PRODUCTION',
					uuid: BLACK_TULIPS_TRICYCLE_PRODUCTION_UUID,
					name: 'Black Tulips',
					startDate: '2009-04-17',
					endDate: '2009-06-14',
					venue: {
						model: 'VENUE',
						uuid: TRICYCLE_THEATRE_VENUE_UUID,
						name: 'Tricycle Theatre',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_TWO_COMMUNISM_THE_MUJAHIDEEN_AND_THE_TALIBAN_TRICYCLE_PRODUCTION_UUID,
						name: 'Part Two - Communism, the Mujahideen and the Taliban 1979-1996',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_TRICYCLE_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					}
				},
				{
					model: 'PRODUCTION',
					uuid: CAMPAIGN_TRICYCLE_PRODUCTION_UUID,
					name: 'Campaign',
					startDate: '2009-04-17',
					endDate: '2009-06-14',
					venue: {
						model: 'VENUE',
						uuid: TRICYCLE_THEATRE_VENUE_UUID,
						name: 'Tricycle Theatre',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_ONE_INVASIONS_AND_INDEPENDENCE_TRICYCLE_PRODUCTION_UUID,
						name: 'Part One - Invasions and Independence 1842-1930',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_TRICYCLE_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					}
				},
				{
					model: 'PRODUCTION',
					uuid: DURANDS_LINE_TRICYCLE_PRODUCTION_UUID,
					name: 'Durand\'s Line',
					startDate: '2009-04-17',
					endDate: '2009-06-14',
					venue: {
						model: 'VENUE',
						uuid: TRICYCLE_THEATRE_VENUE_UUID,
						name: 'Tricycle Theatre',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_ONE_INVASIONS_AND_INDEPENDENCE_TRICYCLE_PRODUCTION_UUID,
						name: 'Part One - Invasions and Independence 1842-1930',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_TRICYCLE_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					}
				},
				{
					model: 'PRODUCTION',
					uuid: BUGLES_AT_THE_GATES_OF_JALALABAD_TRICYCLE_PRODUCTION_UUID,
					name: 'Bugles at the Gates of Jalalabad',
					startDate: '2009-04-17',
					endDate: '2009-06-14',
					venue: {
						model: 'VENUE',
						uuid: TRICYCLE_THEATRE_VENUE_UUID,
						name: 'Tricycle Theatre',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_ONE_INVASIONS_AND_INDEPENDENCE_TRICYCLE_PRODUCTION_UUID,
						name: 'Part One - Invasions and Independence 1842-1930',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_TRICYCLE_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					}
				}
			];

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);

		});

	});

});
