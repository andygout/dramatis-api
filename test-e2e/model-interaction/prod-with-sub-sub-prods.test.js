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
	const BUGLES_AT_THE_GATES_OF_JALALABAD_MATERIAL_UUID = '7';
	const BAR_CHARACTER_UUID = '9';
	const PART_ONE_INVASIONS_AND_INDEPENDENCE_MATERIAL_UUID = '27';
	const THE_GREAT_GAME_AFGHANISTAN_MATERIAL_UUID = '93';
	const BUGLES_AT_THE_GATES_OF_JALALABAD_RODA_PRODUCTION_UUID = '98';
	const NICOLAS_KENT_PERSON_UUID = '101';
	const TRICYCLE_THEATRE_COMPANY_UUID = '102';
	const ZOË_INGENHAAG_PERSON_UUID = '103';
	const RICK_WARDEN_PERSON_UUID = '104';
	const HOWARD_HARRISON_PERSON_UUID = '105';
	const LIGHTING_DESIGN_LTD_COMPANY_UUID = '106';
	const JACK_KNOWLES_PERSON_UUID = '107';
	const LIZZIE_CHAPMAN_PERSON_UUID = '108';
	const STAGE_MANAGEMENT_LTD_COMPANY_UUID = '109';
	const CHARLOTTE_PADGHAM_PERSON_UUID = '110';
	const DURANDS_LINE_RODA_PRODUCTION_UUID = '111';
	const CAMPAIGN_RODA_PRODUCTION_UUID = '124';
	const PART_ONE_INVASIONS_AND_INDEPENDENCE_RODA_PRODUCTION_UUID = '137';
	const BLACK_TULIPS_RODA_PRODUCTION_UUID = '140';
	const BLOOD_AND_GIFTS_RODA_PRODUCTION_UUID = '153';
	const MINISKIRTS_OF_KABUL_RODA_PRODUCTION_UUID = '166';
	const PART_TWO_COMMUNISM_THE_MUJAHIDEEN_AND_THE_TALIBAN_RODA_PRODUCTION_UUID = '179';
	const HONEY_RODA_PRODUCTION_UUID = '182';
	const THE_NIGHT_IS_DARKEST_BEFORE_THE_DAWN_RODA_PRODUCTION_UUID = '195';
	const ON_THE_SIDE_OF_THE_ANGELS_RODA_PRODUCTION_UUID = '208';
	const PART_THREE_ENDURING_FREEDOM_RODA_PRODUCTION_UUID = '221';
	const THE_GREAT_GAME_AFGHANISTAN_RODA_PRODUCTION_UUID = '224';
	const BUGLES_AT_THE_GATES_OF_JALALABAD_TRICYCLE_PRODUCTION_UUID = '227';
	const TRICYCLE_THEATRE_VENUE_UUID = '229';
	const DURANDS_LINE_TRICYCLE_PRODUCTION_UUID = '230';
	const CAMPAIGN_TRICYCLE_PRODUCTION_UUID = '233';
	const PART_ONE_INVASIONS_AND_INDEPENDENCE_TRICYCLE_PRODUCTION_UUID = '236';
	const BLACK_TULIPS_TRICYCLE_PRODUCTION_UUID = '239';
	const BLOOD_AND_GIFTS_TRICYCLE_PRODUCTION_UUID = '242';
	const MINISKIRTS_OF_KABUL_TRICYCLE_PRODUCTION_UUID = '245';
	const PART_TWO_COMMUNISM_THE_MUJAHIDEEN_AND_THE_TALIBAN_TRICYCLE_PRODUCTION_UUID = '248';
	const HONEY_TRICYCLE_PRODUCTION_UUID = '251';
	const THE_NIGHT_IS_DARKEST_BEFORE_THE_DAWN_TRICYCLE_PRODUCTION_UUID = '254';
	const ON_THE_SIDE_OF_THE_ANGELS_TRICYCLE_PRODUCTION_UUID = '257';
	const PART_THREE_ENDURING_FREEDOM_TRICYCLE_PRODUCTION_UUID = '260';
	const THE_GREAT_GAME_AFGHANISTAN_TRICYCLE_PRODUCTION_UUID = '263';

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
	let nicolasKentPerson;
	let tricycleTheatreCompany;
	let zoëIngenhaagPerson;
	let rickWardenPerson;
	let howardHarrisonPerson;
	let lightingDesignLtdCompany;
	let jackKnowlesPerson;
	let lizzieChapmanPerson;
	let stageManagementLtdCompany;
	let charlottePadghamPerson;
	let barCharacter;

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
				name: 'Durand\'s Line',
				format: 'play',
				year: '2009',
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
				name: 'Campaign',
				format: 'play',
				year: '2009',
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
				name: 'Part One - Invasions and Independence 1842-1930',
				format: 'sub-collection of plays',
				year: '2009',
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
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Black Tulips',
				format: 'play',
				year: '2009',
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
				name: 'Blood and Gifts',
				format: 'play',
				year: '2009',
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
				name: 'Miniskirts of Kabul',
				format: 'play',
				year: '2009',
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
				name: 'Part Two - Communism, the Mujahideen and the Taliban 1979-1996',
				format: 'sub-collection of plays',
				year: '2009',
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
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Honey',
				format: 'play',
				year: '2009',
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
				name: 'The Night Is Darkest Before the Dawn',
				format: 'play',
				year: '2009',
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
				name: 'On the Side of the Angels',
				format: 'play',
				year: '2009',
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
				name: 'Part Three - Enduring Freedom 1996-2009',
				format: 'sub-collection of plays',
				year: '2009',
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
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'The Great Game: Afghanistan',
				format: 'collection of plays',
				year: '2009',
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
								name: 'Nicolas Kent'
							},
							{
								model: 'COMPANY',
								name: 'Tricycle Theatre Company',
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
						name: 'Lighting Designers',
						entities: [
							{
								name: 'Howard Harrison'
							},
							{
								model: 'COMPANY',
								name: 'Lighting Design Ltd',
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
						name: 'Stage Managers',
						entities: [
							{
								name: 'Lizzie Chapman'
							},
							{
								model: 'COMPANY',
								name: 'Stage Management Ltd',
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
								name: 'Nicolas Kent'
							},
							{
								model: 'COMPANY',
								name: 'Tricycle Theatre Company',
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
						name: 'Lighting Designers',
						entities: [
							{
								name: 'Howard Harrison'
							},
							{
								model: 'COMPANY',
								name: 'Lighting Design Ltd',
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
						name: 'Stage Managers',
						entities: [
							{
								name: 'Lizzie Chapman'
							},
							{
								model: 'COMPANY',
								name: 'Stage Management Ltd',
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
								name: 'Nicolas Kent'
							},
							{
								model: 'COMPANY',
								name: 'Tricycle Theatre Company',
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
						name: 'Lighting Designers',
						entities: [
							{
								name: 'Howard Harrison'
							},
							{
								model: 'COMPANY',
								name: 'Lighting Design Ltd',
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
						name: 'Stage Managers',
						entities: [
							{
								name: 'Lizzie Chapman'
							},
							{
								model: 'COMPANY',
								name: 'Stage Management Ltd',
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
								name: 'Nicolas Kent'
							},
							{
								model: 'COMPANY',
								name: 'Tricycle Theatre Company',
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
						name: 'Lighting Designers',
						entities: [
							{
								name: 'Howard Harrison'
							},
							{
								model: 'COMPANY',
								name: 'Lighting Design Ltd',
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
						name: 'Stage Managers',
						entities: [
							{
								name: 'Lizzie Chapman'
							},
							{
								model: 'COMPANY',
								name: 'Stage Management Ltd',
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
								name: 'Nicolas Kent'
							},
							{
								model: 'COMPANY',
								name: 'Tricycle Theatre Company',
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
						name: 'Lighting Designers',
						entities: [
							{
								name: 'Howard Harrison'
							},
							{
								model: 'COMPANY',
								name: 'Lighting Design Ltd',
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
						name: 'Stage Managers',
						entities: [
							{
								name: 'Lizzie Chapman'
							},
							{
								model: 'COMPANY',
								name: 'Stage Management Ltd',
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
								name: 'Nicolas Kent'
							},
							{
								model: 'COMPANY',
								name: 'Tricycle Theatre Company',
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
						name: 'Lighting Designers',
						entities: [
							{
								name: 'Howard Harrison'
							},
							{
								model: 'COMPANY',
								name: 'Lighting Design Ltd',
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
						name: 'Stage Managers',
						entities: [
							{
								name: 'Lizzie Chapman'
							},
							{
								model: 'COMPANY',
								name: 'Stage Management Ltd',
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
								name: 'Nicolas Kent'
							},
							{
								model: 'COMPANY',
								name: 'Tricycle Theatre Company',
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
						name: 'Lighting Designers',
						entities: [
							{
								name: 'Howard Harrison'
							},
							{
								model: 'COMPANY',
								name: 'Lighting Design Ltd',
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
						name: 'Stage Managers',
						entities: [
							{
								name: 'Lizzie Chapman'
							},
							{
								model: 'COMPANY',
								name: 'Stage Management Ltd',
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
								name: 'Nicolas Kent'
							},
							{
								model: 'COMPANY',
								name: 'Tricycle Theatre Company',
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
						name: 'Lighting Designers',
						entities: [
							{
								name: 'Howard Harrison'
							},
							{
								model: 'COMPANY',
								name: 'Lighting Design Ltd',
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
						name: 'Stage Managers',
						entities: [
							{
								name: 'Lizzie Chapman'
							},
							{
								model: 'COMPANY',
								name: 'Stage Management Ltd',
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
								name: 'Nicolas Kent'
							},
							{
								model: 'COMPANY',
								name: 'Tricycle Theatre Company',
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
						name: 'Lighting Designers',
						entities: [
							{
								name: 'Howard Harrison'
							},
							{
								model: 'COMPANY',
								name: 'Lighting Design Ltd',
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
						name: 'Stage Managers',
						entities: [
							{
								name: 'Lizzie Chapman'
							},
							{
								model: 'COMPANY',
								name: 'Stage Management Ltd',
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

		nicolasKentPerson = await chai.request(app)
			.get(`/people/${NICOLAS_KENT_PERSON_UUID}`);

		tricycleTheatreCompany = await chai.request(app)
			.get(`/companies/${TRICYCLE_THEATRE_COMPANY_UUID}`);

		zoëIngenhaagPerson = await chai.request(app)
			.get(`/people/${ZOË_INGENHAAG_PERSON_UUID}`);

		rickWardenPerson = await chai.request(app)
			.get(`/people/${RICK_WARDEN_PERSON_UUID}`);

		howardHarrisonPerson = await chai.request(app)
			.get(`/people/${HOWARD_HARRISON_PERSON_UUID}`);

		lightingDesignLtdCompany = await chai.request(app)
			.get(`/companies/${LIGHTING_DESIGN_LTD_COMPANY_UUID}`);

		jackKnowlesPerson = await chai.request(app)
			.get(`/people/${JACK_KNOWLES_PERSON_UUID}`);

		lizzieChapmanPerson = await chai.request(app)
			.get(`/people/${LIZZIE_CHAPMAN_PERSON_UUID}`);

		stageManagementLtdCompany = await chai.request(app)
			.get(`/companies/${STAGE_MANAGEMENT_LTD_COMPANY_UUID}`);

		charlottePadghamPerson = await chai.request(app)
			.get(`/people/${CHARLOTTE_PADGHAM_PERSON_UUID}`);

		barCharacter = await chai.request(app)
			.get(`/characters/${BAR_CHARACTER_UUID}`);

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
					subProductions: [
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
							}
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: PART_TWO_COMMUNISM_THE_MUJAHIDEEN_AND_THE_TALIBAN_RODA_PRODUCTION_UUID,
					name: 'Part Two - Communism, the Mujahideen and the Taliban 1979-1996',
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
					subProductions: [
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
							}
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: PART_THREE_ENDURING_FREEDOM_RODA_PRODUCTION_UUID,
					name: 'Part Three - Enduring Freedom 1996-2009',
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
					subProductions: [
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
							}
						},
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
							}
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
					subProductions: []
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
					subProductions: []
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
					subProductions: []
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
					name: 'The Great Game: Afghanistan'
				}
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
					endDate: '2009-06-14',
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
							endDate: '2009-06-14',
							venue: {
								model: 'VENUE',
								uuid: TRICYCLE_THEATRE_VENUE_UUID,
								name: 'Tricycle Theatre',
								surVenue: null
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
							}
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: PART_TWO_COMMUNISM_THE_MUJAHIDEEN_AND_THE_TALIBAN_TRICYCLE_PRODUCTION_UUID,
					name: 'Part Two - Communism, the Mujahideen and the Taliban 1979-1996',
					startDate: '2009-04-17',
					endDate: '2009-06-14',
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
							endDate: '2009-06-14',
							venue: {
								model: 'VENUE',
								uuid: TRICYCLE_THEATRE_VENUE_UUID,
								name: 'Tricycle Theatre',
								surVenue: null
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
							}
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: PART_THREE_ENDURING_FREEDOM_TRICYCLE_PRODUCTION_UUID,
					name: 'Part Three - Enduring Freedom 1996-2009',
					startDate: '2009-04-17',
					endDate: '2009-06-14',
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
							endDate: '2009-06-14',
							venue: {
								model: 'VENUE',
								uuid: TRICYCLE_THEATRE_VENUE_UUID,
								name: 'Tricycle Theatre',
								surVenue: null
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
							}
						}
					]
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
				endDate: '2009-06-14',
				venue: {
					model: 'VENUE',
					uuid: TRICYCLE_THEATRE_VENUE_UUID,
					name: 'Tricycle Theatre',
					surVenue: null
				},
				surProduction: null
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
					endDate: '2009-06-14',
					venue: {
						model: 'VENUE',
						uuid: TRICYCLE_THEATRE_VENUE_UUID,
						name: 'Tricycle Theatre',
						surVenue: null
					},
					subProductions: []
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
					subProductions: []
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
					subProductions: []
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
					name: 'The Great Game: Afghanistan'
				}
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

	describe('Nicolas Kent (person)', () => {

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
									uuid: NICOLAS_KENT_PERSON_UUID,
									name: 'Nicolas Kent'
								},
								{
									model: 'COMPANY',
									uuid: TRICYCLE_THEATRE_COMPANY_UUID,
									name: 'Tricycle Theatre Company',
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
									uuid: NICOLAS_KENT_PERSON_UUID,
									name: 'Nicolas Kent'
								},
								{
									model: 'COMPANY',
									uuid: TRICYCLE_THEATRE_COMPANY_UUID,
									name: 'Tricycle Theatre Company',
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
									uuid: NICOLAS_KENT_PERSON_UUID,
									name: 'Nicolas Kent'
								},
								{
									model: 'COMPANY',
									uuid: TRICYCLE_THEATRE_COMPANY_UUID,
									name: 'Tricycle Theatre Company',
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
									uuid: NICOLAS_KENT_PERSON_UUID,
									name: 'Nicolas Kent'
								},
								{
									model: 'COMPANY',
									uuid: TRICYCLE_THEATRE_COMPANY_UUID,
									name: 'Tricycle Theatre Company',
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
									uuid: NICOLAS_KENT_PERSON_UUID,
									name: 'Nicolas Kent'
								},
								{
									model: 'COMPANY',
									uuid: TRICYCLE_THEATRE_COMPANY_UUID,
									name: 'Tricycle Theatre Company',
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
									uuid: NICOLAS_KENT_PERSON_UUID,
									name: 'Nicolas Kent'
								},
								{
									model: 'COMPANY',
									uuid: TRICYCLE_THEATRE_COMPANY_UUID,
									name: 'Tricycle Theatre Company',
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
									uuid: NICOLAS_KENT_PERSON_UUID,
									name: 'Nicolas Kent'
								},
								{
									model: 'COMPANY',
									uuid: TRICYCLE_THEATRE_COMPANY_UUID,
									name: 'Tricycle Theatre Company',
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
									uuid: NICOLAS_KENT_PERSON_UUID,
									name: 'Nicolas Kent'
								},
								{
									model: 'COMPANY',
									uuid: TRICYCLE_THEATRE_COMPANY_UUID,
									name: 'Tricycle Theatre Company',
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
									uuid: NICOLAS_KENT_PERSON_UUID,
									name: 'Nicolas Kent'
								},
								{
									model: 'COMPANY',
									uuid: TRICYCLE_THEATRE_COMPANY_UUID,
									name: 'Tricycle Theatre Company',
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
					]
				}
			];

			const { producerProductions } = nicolasKentPerson.body;

			expect(producerProductions).to.deep.equal(expectedProducerProductions);

		});

	});

	describe('Tricycle Theatre Company (company)', () => {

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
									uuid: NICOLAS_KENT_PERSON_UUID,
									name: 'Nicolas Kent'
								},
								{
									model: 'COMPANY',
									uuid: TRICYCLE_THEATRE_COMPANY_UUID,
									name: 'Tricycle Theatre Company',
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
									uuid: NICOLAS_KENT_PERSON_UUID,
									name: 'Nicolas Kent'
								},
								{
									model: 'COMPANY',
									uuid: TRICYCLE_THEATRE_COMPANY_UUID,
									name: 'Tricycle Theatre Company',
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
									uuid: NICOLAS_KENT_PERSON_UUID,
									name: 'Nicolas Kent'
								},
								{
									model: 'COMPANY',
									uuid: TRICYCLE_THEATRE_COMPANY_UUID,
									name: 'Tricycle Theatre Company',
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
									uuid: NICOLAS_KENT_PERSON_UUID,
									name: 'Nicolas Kent'
								},
								{
									model: 'COMPANY',
									uuid: TRICYCLE_THEATRE_COMPANY_UUID,
									name: 'Tricycle Theatre Company',
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
									uuid: NICOLAS_KENT_PERSON_UUID,
									name: 'Nicolas Kent'
								},
								{
									model: 'COMPANY',
									uuid: TRICYCLE_THEATRE_COMPANY_UUID,
									name: 'Tricycle Theatre Company',
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
									uuid: NICOLAS_KENT_PERSON_UUID,
									name: 'Nicolas Kent'
								},
								{
									model: 'COMPANY',
									uuid: TRICYCLE_THEATRE_COMPANY_UUID,
									name: 'Tricycle Theatre Company',
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
									uuid: NICOLAS_KENT_PERSON_UUID,
									name: 'Nicolas Kent'
								},
								{
									model: 'COMPANY',
									uuid: TRICYCLE_THEATRE_COMPANY_UUID,
									name: 'Tricycle Theatre Company',
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
									uuid: NICOLAS_KENT_PERSON_UUID,
									name: 'Nicolas Kent'
								},
								{
									model: 'COMPANY',
									uuid: TRICYCLE_THEATRE_COMPANY_UUID,
									name: 'Tricycle Theatre Company',
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
									uuid: NICOLAS_KENT_PERSON_UUID,
									name: 'Nicolas Kent'
								},
								{
									model: 'COMPANY',
									uuid: TRICYCLE_THEATRE_COMPANY_UUID,
									name: 'Tricycle Theatre Company',
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
					]
				}
			];

			const { producerProductions } = tricycleTheatreCompany.body;

			expect(producerProductions).to.deep.equal(expectedProducerProductions);

		});

	});

	describe('Zoë Ingenhaag (person)', () => {

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
									uuid: NICOLAS_KENT_PERSON_UUID,
									name: 'Nicolas Kent'
								},
								{
									model: 'COMPANY',
									uuid: TRICYCLE_THEATRE_COMPANY_UUID,
									name: 'Tricycle Theatre Company',
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
									uuid: NICOLAS_KENT_PERSON_UUID,
									name: 'Nicolas Kent'
								},
								{
									model: 'COMPANY',
									uuid: TRICYCLE_THEATRE_COMPANY_UUID,
									name: 'Tricycle Theatre Company',
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
									uuid: NICOLAS_KENT_PERSON_UUID,
									name: 'Nicolas Kent'
								},
								{
									model: 'COMPANY',
									uuid: TRICYCLE_THEATRE_COMPANY_UUID,
									name: 'Tricycle Theatre Company',
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
									uuid: NICOLAS_KENT_PERSON_UUID,
									name: 'Nicolas Kent'
								},
								{
									model: 'COMPANY',
									uuid: TRICYCLE_THEATRE_COMPANY_UUID,
									name: 'Tricycle Theatre Company',
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
									uuid: NICOLAS_KENT_PERSON_UUID,
									name: 'Nicolas Kent'
								},
								{
									model: 'COMPANY',
									uuid: TRICYCLE_THEATRE_COMPANY_UUID,
									name: 'Tricycle Theatre Company',
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
									uuid: NICOLAS_KENT_PERSON_UUID,
									name: 'Nicolas Kent'
								},
								{
									model: 'COMPANY',
									uuid: TRICYCLE_THEATRE_COMPANY_UUID,
									name: 'Tricycle Theatre Company',
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
									uuid: NICOLAS_KENT_PERSON_UUID,
									name: 'Nicolas Kent'
								},
								{
									model: 'COMPANY',
									uuid: TRICYCLE_THEATRE_COMPANY_UUID,
									name: 'Tricycle Theatre Company',
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
									uuid: NICOLAS_KENT_PERSON_UUID,
									name: 'Nicolas Kent'
								},
								{
									model: 'COMPANY',
									uuid: TRICYCLE_THEATRE_COMPANY_UUID,
									name: 'Tricycle Theatre Company',
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
									uuid: NICOLAS_KENT_PERSON_UUID,
									name: 'Nicolas Kent'
								},
								{
									model: 'COMPANY',
									uuid: TRICYCLE_THEATRE_COMPANY_UUID,
									name: 'Tricycle Theatre Company',
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
					]
				}
			];

			const { producerProductions } = zoëIngenhaagPerson.body;

			expect(producerProductions).to.deep.equal(expectedProducerProductions);

		});

	});

	describe('Rick Warden (person)', () => {

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
							uuid: BAR_CHARACTER_UUID,
							name: 'Bar',
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
							uuid: BAR_CHARACTER_UUID,
							name: 'Bar',
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
							uuid: BAR_CHARACTER_UUID,
							name: 'Bar',
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
							uuid: BAR_CHARACTER_UUID,
							name: 'Bar',
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
							uuid: BAR_CHARACTER_UUID,
							name: 'Bar',
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
							uuid: BAR_CHARACTER_UUID,
							name: 'Bar',
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
							uuid: BAR_CHARACTER_UUID,
							name: 'Bar',
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
							uuid: BAR_CHARACTER_UUID,
							name: 'Bar',
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
							uuid: BAR_CHARACTER_UUID,
							name: 'Bar',
							qualifier: null,
							isAlternate: false
						}
					]
				}
			];

			const { castMemberProductions } = rickWardenPerson.body;

			expect(castMemberProductions).to.deep.equal(expectedCastMemberProductions);

		});

	});

	describe('Howard Harrison (person)', () => {

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
							name: 'Lighting Designers',
							employerCompany: null,
							coEntities: [
								{
									model: 'COMPANY',
									uuid: LIGHTING_DESIGN_LTD_COMPANY_UUID,
									name: 'Lighting Design Ltd',
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
							name: 'Lighting Designers',
							employerCompany: null,
							coEntities: [
								{
									model: 'COMPANY',
									uuid: LIGHTING_DESIGN_LTD_COMPANY_UUID,
									name: 'Lighting Design Ltd',
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
							name: 'Lighting Designers',
							employerCompany: null,
							coEntities: [
								{
									model: 'COMPANY',
									uuid: LIGHTING_DESIGN_LTD_COMPANY_UUID,
									name: 'Lighting Design Ltd',
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
							name: 'Lighting Designers',
							employerCompany: null,
							coEntities: [
								{
									model: 'COMPANY',
									uuid: LIGHTING_DESIGN_LTD_COMPANY_UUID,
									name: 'Lighting Design Ltd',
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
							name: 'Lighting Designers',
							employerCompany: null,
							coEntities: [
								{
									model: 'COMPANY',
									uuid: LIGHTING_DESIGN_LTD_COMPANY_UUID,
									name: 'Lighting Design Ltd',
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
							name: 'Lighting Designers',
							employerCompany: null,
							coEntities: [
								{
									model: 'COMPANY',
									uuid: LIGHTING_DESIGN_LTD_COMPANY_UUID,
									name: 'Lighting Design Ltd',
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
							name: 'Lighting Designers',
							employerCompany: null,
							coEntities: [
								{
									model: 'COMPANY',
									uuid: LIGHTING_DESIGN_LTD_COMPANY_UUID,
									name: 'Lighting Design Ltd',
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
							name: 'Lighting Designers',
							employerCompany: null,
							coEntities: [
								{
									model: 'COMPANY',
									uuid: LIGHTING_DESIGN_LTD_COMPANY_UUID,
									name: 'Lighting Design Ltd',
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
							name: 'Lighting Designers',
							employerCompany: null,
							coEntities: [
								{
									model: 'COMPANY',
									uuid: LIGHTING_DESIGN_LTD_COMPANY_UUID,
									name: 'Lighting Design Ltd',
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
					]
				}
			];

			const { creativeProductions } = howardHarrisonPerson.body;

			expect(creativeProductions).to.deep.equal(expectedCreativeProductions);

		});

	});

	describe('Lighting Design Ltd (company)', () => {

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
							name: 'Lighting Designers',
							members: [
								{
									model: 'PERSON',
									uuid: JACK_KNOWLES_PERSON_UUID,
									name: 'Jack Knowles'
								}
							],
							coEntities: [
								{
									model: 'PERSON',
									uuid: HOWARD_HARRISON_PERSON_UUID,
									name: 'Howard Harrison'
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
							name: 'Lighting Designers',
							members: [
								{
									model: 'PERSON',
									uuid: JACK_KNOWLES_PERSON_UUID,
									name: 'Jack Knowles'
								}
							],
							coEntities: [
								{
									model: 'PERSON',
									uuid: HOWARD_HARRISON_PERSON_UUID,
									name: 'Howard Harrison'
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
							name: 'Lighting Designers',
							members: [
								{
									model: 'PERSON',
									uuid: JACK_KNOWLES_PERSON_UUID,
									name: 'Jack Knowles'
								}
							],
							coEntities: [
								{
									model: 'PERSON',
									uuid: HOWARD_HARRISON_PERSON_UUID,
									name: 'Howard Harrison'
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
							name: 'Lighting Designers',
							members: [
								{
									model: 'PERSON',
									uuid: JACK_KNOWLES_PERSON_UUID,
									name: 'Jack Knowles'
								}
							],
							coEntities: [
								{
									model: 'PERSON',
									uuid: HOWARD_HARRISON_PERSON_UUID,
									name: 'Howard Harrison'
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
							name: 'Lighting Designers',
							members: [
								{
									model: 'PERSON',
									uuid: JACK_KNOWLES_PERSON_UUID,
									name: 'Jack Knowles'
								}
							],
							coEntities: [
								{
									model: 'PERSON',
									uuid: HOWARD_HARRISON_PERSON_UUID,
									name: 'Howard Harrison'
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
							name: 'Lighting Designers',
							members: [
								{
									model: 'PERSON',
									uuid: JACK_KNOWLES_PERSON_UUID,
									name: 'Jack Knowles'
								}
							],
							coEntities: [
								{
									model: 'PERSON',
									uuid: HOWARD_HARRISON_PERSON_UUID,
									name: 'Howard Harrison'
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
							name: 'Lighting Designers',
							members: [
								{
									model: 'PERSON',
									uuid: JACK_KNOWLES_PERSON_UUID,
									name: 'Jack Knowles'
								}
							],
							coEntities: [
								{
									model: 'PERSON',
									uuid: HOWARD_HARRISON_PERSON_UUID,
									name: 'Howard Harrison'
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
							name: 'Lighting Designers',
							members: [
								{
									model: 'PERSON',
									uuid: JACK_KNOWLES_PERSON_UUID,
									name: 'Jack Knowles'
								}
							],
							coEntities: [
								{
									model: 'PERSON',
									uuid: HOWARD_HARRISON_PERSON_UUID,
									name: 'Howard Harrison'
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
							name: 'Lighting Designers',
							members: [
								{
									model: 'PERSON',
									uuid: JACK_KNOWLES_PERSON_UUID,
									name: 'Jack Knowles'
								}
							],
							coEntities: [
								{
									model: 'PERSON',
									uuid: HOWARD_HARRISON_PERSON_UUID,
									name: 'Howard Harrison'
								}
							]
						}
					]
				}
			];

			const { creativeProductions } = lightingDesignLtdCompany.body;

			expect(creativeProductions).to.deep.equal(expectedCreativeProductions);

		});

	});

	describe('Jack Knowles (person)', () => {

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
							name: 'Lighting Designers',
							employerCompany: {
								model: 'COMPANY',
								uuid: LIGHTING_DESIGN_LTD_COMPANY_UUID,
								name: 'Lighting Design Ltd',
								coMembers: []
							},
							coEntities: [
								{
									model: 'PERSON',
									uuid: HOWARD_HARRISON_PERSON_UUID,
									name: 'Howard Harrison'
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
							name: 'Lighting Designers',
							employerCompany: {
								model: 'COMPANY',
								uuid: LIGHTING_DESIGN_LTD_COMPANY_UUID,
								name: 'Lighting Design Ltd',
								coMembers: []
							},
							coEntities: [
								{
									model: 'PERSON',
									uuid: HOWARD_HARRISON_PERSON_UUID,
									name: 'Howard Harrison'
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
							name: 'Lighting Designers',
							employerCompany: {
								model: 'COMPANY',
								uuid: LIGHTING_DESIGN_LTD_COMPANY_UUID,
								name: 'Lighting Design Ltd',
								coMembers: []
							},
							coEntities: [
								{
									model: 'PERSON',
									uuid: HOWARD_HARRISON_PERSON_UUID,
									name: 'Howard Harrison'
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
							name: 'Lighting Designers',
							employerCompany: {
								model: 'COMPANY',
								uuid: LIGHTING_DESIGN_LTD_COMPANY_UUID,
								name: 'Lighting Design Ltd',
								coMembers: []
							},
							coEntities: [
								{
									model: 'PERSON',
									uuid: HOWARD_HARRISON_PERSON_UUID,
									name: 'Howard Harrison'
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
							name: 'Lighting Designers',
							employerCompany: {
								model: 'COMPANY',
								uuid: LIGHTING_DESIGN_LTD_COMPANY_UUID,
								name: 'Lighting Design Ltd',
								coMembers: []
							},
							coEntities: [
								{
									model: 'PERSON',
									uuid: HOWARD_HARRISON_PERSON_UUID,
									name: 'Howard Harrison'
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
							name: 'Lighting Designers',
							employerCompany: {
								model: 'COMPANY',
								uuid: LIGHTING_DESIGN_LTD_COMPANY_UUID,
								name: 'Lighting Design Ltd',
								coMembers: []
							},
							coEntities: [
								{
									model: 'PERSON',
									uuid: HOWARD_HARRISON_PERSON_UUID,
									name: 'Howard Harrison'
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
							name: 'Lighting Designers',
							employerCompany: {
								model: 'COMPANY',
								uuid: LIGHTING_DESIGN_LTD_COMPANY_UUID,
								name: 'Lighting Design Ltd',
								coMembers: []
							},
							coEntities: [
								{
									model: 'PERSON',
									uuid: HOWARD_HARRISON_PERSON_UUID,
									name: 'Howard Harrison'
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
							name: 'Lighting Designers',
							employerCompany: {
								model: 'COMPANY',
								uuid: LIGHTING_DESIGN_LTD_COMPANY_UUID,
								name: 'Lighting Design Ltd',
								coMembers: []
							},
							coEntities: [
								{
									model: 'PERSON',
									uuid: HOWARD_HARRISON_PERSON_UUID,
									name: 'Howard Harrison'
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
							name: 'Lighting Designers',
							employerCompany: {
								model: 'COMPANY',
								uuid: LIGHTING_DESIGN_LTD_COMPANY_UUID,
								name: 'Lighting Design Ltd',
								coMembers: []
							},
							coEntities: [
								{
									model: 'PERSON',
									uuid: HOWARD_HARRISON_PERSON_UUID,
									name: 'Howard Harrison'
								}
							]
						}
					]
				}
			];

			const { creativeProductions } = jackKnowlesPerson.body;

			expect(creativeProductions).to.deep.equal(expectedCreativeProductions);

		});

	});

	describe('Lizzie Chapman (person)', () => {

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
							name: 'Stage Managers',
							employerCompany: null,
							coEntities: [
								{
									model: 'COMPANY',
									uuid: STAGE_MANAGEMENT_LTD_COMPANY_UUID,
									name: 'Stage Management Ltd',
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
							name: 'Stage Managers',
							employerCompany: null,
							coEntities: [
								{
									model: 'COMPANY',
									uuid: STAGE_MANAGEMENT_LTD_COMPANY_UUID,
									name: 'Stage Management Ltd',
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
							name: 'Stage Managers',
							employerCompany: null,
							coEntities: [
								{
									model: 'COMPANY',
									uuid: STAGE_MANAGEMENT_LTD_COMPANY_UUID,
									name: 'Stage Management Ltd',
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
							name: 'Stage Managers',
							employerCompany: null,
							coEntities: [
								{
									model: 'COMPANY',
									uuid: STAGE_MANAGEMENT_LTD_COMPANY_UUID,
									name: 'Stage Management Ltd',
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
							name: 'Stage Managers',
							employerCompany: null,
							coEntities: [
								{
									model: 'COMPANY',
									uuid: STAGE_MANAGEMENT_LTD_COMPANY_UUID,
									name: 'Stage Management Ltd',
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
							name: 'Stage Managers',
							employerCompany: null,
							coEntities: [
								{
									model: 'COMPANY',
									uuid: STAGE_MANAGEMENT_LTD_COMPANY_UUID,
									name: 'Stage Management Ltd',
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
							name: 'Stage Managers',
							employerCompany: null,
							coEntities: [
								{
									model: 'COMPANY',
									uuid: STAGE_MANAGEMENT_LTD_COMPANY_UUID,
									name: 'Stage Management Ltd',
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
							name: 'Stage Managers',
							employerCompany: null,
							coEntities: [
								{
									model: 'COMPANY',
									uuid: STAGE_MANAGEMENT_LTD_COMPANY_UUID,
									name: 'Stage Management Ltd',
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
							name: 'Stage Managers',
							employerCompany: null,
							coEntities: [
								{
									model: 'COMPANY',
									uuid: STAGE_MANAGEMENT_LTD_COMPANY_UUID,
									name: 'Stage Management Ltd',
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

			const { crewProductions } = lizzieChapmanPerson.body;

			expect(crewProductions).to.deep.equal(expectedCrewProductions);

		});

	});

	describe('Stage Management Ltd (company)', () => {

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
							name: 'Stage Managers',
							members: [
								{
									model: 'PERSON',
									uuid: CHARLOTTE_PADGHAM_PERSON_UUID,
									name: 'Charlotte Padgham'
								}
							],
							coEntities: [
								{
									model: 'PERSON',
									uuid: LIZZIE_CHAPMAN_PERSON_UUID,
									name: 'Lizzie Chapman'
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
							name: 'Stage Managers',
							members: [
								{
									model: 'PERSON',
									uuid: CHARLOTTE_PADGHAM_PERSON_UUID,
									name: 'Charlotte Padgham'
								}
							],
							coEntities: [
								{
									model: 'PERSON',
									uuid: LIZZIE_CHAPMAN_PERSON_UUID,
									name: 'Lizzie Chapman'
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
							name: 'Stage Managers',
							members: [
								{
									model: 'PERSON',
									uuid: CHARLOTTE_PADGHAM_PERSON_UUID,
									name: 'Charlotte Padgham'
								}
							],
							coEntities: [
								{
									model: 'PERSON',
									uuid: LIZZIE_CHAPMAN_PERSON_UUID,
									name: 'Lizzie Chapman'
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
							name: 'Stage Managers',
							members: [
								{
									model: 'PERSON',
									uuid: CHARLOTTE_PADGHAM_PERSON_UUID,
									name: 'Charlotte Padgham'
								}
							],
							coEntities: [
								{
									model: 'PERSON',
									uuid: LIZZIE_CHAPMAN_PERSON_UUID,
									name: 'Lizzie Chapman'
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
							name: 'Stage Managers',
							members: [
								{
									model: 'PERSON',
									uuid: CHARLOTTE_PADGHAM_PERSON_UUID,
									name: 'Charlotte Padgham'
								}
							],
							coEntities: [
								{
									model: 'PERSON',
									uuid: LIZZIE_CHAPMAN_PERSON_UUID,
									name: 'Lizzie Chapman'
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
							name: 'Stage Managers',
							members: [
								{
									model: 'PERSON',
									uuid: CHARLOTTE_PADGHAM_PERSON_UUID,
									name: 'Charlotte Padgham'
								}
							],
							coEntities: [
								{
									model: 'PERSON',
									uuid: LIZZIE_CHAPMAN_PERSON_UUID,
									name: 'Lizzie Chapman'
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
							name: 'Stage Managers',
							members: [
								{
									model: 'PERSON',
									uuid: CHARLOTTE_PADGHAM_PERSON_UUID,
									name: 'Charlotte Padgham'
								}
							],
							coEntities: [
								{
									model: 'PERSON',
									uuid: LIZZIE_CHAPMAN_PERSON_UUID,
									name: 'Lizzie Chapman'
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
							name: 'Stage Managers',
							members: [
								{
									model: 'PERSON',
									uuid: CHARLOTTE_PADGHAM_PERSON_UUID,
									name: 'Charlotte Padgham'
								}
							],
							coEntities: [
								{
									model: 'PERSON',
									uuid: LIZZIE_CHAPMAN_PERSON_UUID,
									name: 'Lizzie Chapman'
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
							name: 'Stage Managers',
							members: [
								{
									model: 'PERSON',
									uuid: CHARLOTTE_PADGHAM_PERSON_UUID,
									name: 'Charlotte Padgham'
								}
							],
							coEntities: [
								{
									model: 'PERSON',
									uuid: LIZZIE_CHAPMAN_PERSON_UUID,
									name: 'Lizzie Chapman'
								}
							]
						}
					]
				}
			];

			const { crewProductions } = stageManagementLtdCompany.body;

			expect(crewProductions).to.deep.equal(expectedCrewProductions);

		});

	});

	describe('Charlotte Padgham (person)', () => {

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
							name: 'Stage Managers',
							employerCompany: {
								model: 'COMPANY',
								uuid: STAGE_MANAGEMENT_LTD_COMPANY_UUID,
								name: 'Stage Management Ltd',
								coMembers: []
							},
							coEntities: [
								{
									model: 'PERSON',
									uuid: LIZZIE_CHAPMAN_PERSON_UUID,
									name: 'Lizzie Chapman'
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
							name: 'Stage Managers',
							employerCompany: {
								model: 'COMPANY',
								uuid: STAGE_MANAGEMENT_LTD_COMPANY_UUID,
								name: 'Stage Management Ltd',
								coMembers: []
							},
							coEntities: [
								{
									model: 'PERSON',
									uuid: LIZZIE_CHAPMAN_PERSON_UUID,
									name: 'Lizzie Chapman'
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
							name: 'Stage Managers',
							employerCompany: {
								model: 'COMPANY',
								uuid: STAGE_MANAGEMENT_LTD_COMPANY_UUID,
								name: 'Stage Management Ltd',
								coMembers: []
							},
							coEntities: [
								{
									model: 'PERSON',
									uuid: LIZZIE_CHAPMAN_PERSON_UUID,
									name: 'Lizzie Chapman'
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
							name: 'Stage Managers',
							employerCompany: {
								model: 'COMPANY',
								uuid: STAGE_MANAGEMENT_LTD_COMPANY_UUID,
								name: 'Stage Management Ltd',
								coMembers: []
							},
							coEntities: [
								{
									model: 'PERSON',
									uuid: LIZZIE_CHAPMAN_PERSON_UUID,
									name: 'Lizzie Chapman'
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
							name: 'Stage Managers',
							employerCompany: {
								model: 'COMPANY',
								uuid: STAGE_MANAGEMENT_LTD_COMPANY_UUID,
								name: 'Stage Management Ltd',
								coMembers: []
							},
							coEntities: [
								{
									model: 'PERSON',
									uuid: LIZZIE_CHAPMAN_PERSON_UUID,
									name: 'Lizzie Chapman'
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
							name: 'Stage Managers',
							employerCompany: {
								model: 'COMPANY',
								uuid: STAGE_MANAGEMENT_LTD_COMPANY_UUID,
								name: 'Stage Management Ltd',
								coMembers: []
							},
							coEntities: [
								{
									model: 'PERSON',
									uuid: LIZZIE_CHAPMAN_PERSON_UUID,
									name: 'Lizzie Chapman'
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
							name: 'Stage Managers',
							employerCompany: {
								model: 'COMPANY',
								uuid: STAGE_MANAGEMENT_LTD_COMPANY_UUID,
								name: 'Stage Management Ltd',
								coMembers: []
							},
							coEntities: [
								{
									model: 'PERSON',
									uuid: LIZZIE_CHAPMAN_PERSON_UUID,
									name: 'Lizzie Chapman'
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
							name: 'Stage Managers',
							employerCompany: {
								model: 'COMPANY',
								uuid: STAGE_MANAGEMENT_LTD_COMPANY_UUID,
								name: 'Stage Management Ltd',
								coMembers: []
							},
							coEntities: [
								{
									model: 'PERSON',
									uuid: LIZZIE_CHAPMAN_PERSON_UUID,
									name: 'Lizzie Chapman'
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
							name: 'Stage Managers',
							employerCompany: {
								model: 'COMPANY',
								uuid: STAGE_MANAGEMENT_LTD_COMPANY_UUID,
								name: 'Stage Management Ltd',
								coMembers: []
							},
							coEntities: [
								{
									model: 'PERSON',
									uuid: LIZZIE_CHAPMAN_PERSON_UUID,
									name: 'Lizzie Chapman'
								}
							]
						}
					]
				}
			];

			const { crewProductions } = charlottePadghamPerson.body;

			expect(crewProductions).to.deep.equal(expectedCrewProductions);

		});

	});

	describe('Bar (character)', () => {

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
							uuid: RICK_WARDEN_PERSON_UUID,
							name: 'Rick Warden',
							roleName: 'Bar',
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
							uuid: RICK_WARDEN_PERSON_UUID,
							name: 'Rick Warden',
							roleName: 'Bar',
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
							uuid: RICK_WARDEN_PERSON_UUID,
							name: 'Rick Warden',
							roleName: 'Bar',
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
							uuid: RICK_WARDEN_PERSON_UUID,
							name: 'Rick Warden',
							roleName: 'Bar',
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
							uuid: RICK_WARDEN_PERSON_UUID,
							name: 'Rick Warden',
							roleName: 'Bar',
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
							uuid: RICK_WARDEN_PERSON_UUID,
							name: 'Rick Warden',
							roleName: 'Bar',
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
							uuid: RICK_WARDEN_PERSON_UUID,
							name: 'Rick Warden',
							roleName: 'Bar',
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
							uuid: RICK_WARDEN_PERSON_UUID,
							name: 'Rick Warden',
							roleName: 'Bar',
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
							uuid: RICK_WARDEN_PERSON_UUID,
							name: 'Rick Warden',
							roleName: 'Bar',
							qualifier: null,
							isAlternate: false,
							otherRoles: []
						}
					]
				}
			];

			const { productions } = barCharacter.body;

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
