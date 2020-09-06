import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { createSandbox } from 'sinon';
import { v4 as uuid } from 'uuid';

import app from '../../src/app';
import purgeDatabase from '../test-helpers/neo4j/purge-database';

describe('Roles with alternating cast', () => {

	chai.use(chaiHttp);

	const AUSTIN_CHARACTER_UUID = '4';
	const LEE_CHARACTER_UUID = '5';
	const TRUE_WEST_CRUCIBLE_PRODUCTION_UUID = '6';
	const CRUCIBLE_THEATRE_UUID = '7';
	const NIGEL_HARMAN_PERSON_UUID = '9';
	const JOHN_LIGHT_PERSON_UUID = '10';
	const TRUE_WEST_VAUDEVILLE_PRODUCTION_UUID = '11';
	const VAUDEVILLE_THEATRE_UUID = '12';
	const KIT_HARINGTON_PERSON_UUID = '14';
	const JOHNNY_FLYNN_PERSON_UUID = '15';

	let austinCharacter;
	let leeCharacter;
	let trueWestCrucibleProduction;
	let trueWestVaudevilleProduction;
	let nigelHarmanPerson;
	let johnLightPerson;
	let kitHaringtonPerson;
	let johnnyFlynnPerson;

	const sandbox = createSandbox();

	before(async () => {

		let uuidCallCount = 0;

		sandbox.stub(uuid, 'v4').callsFake(() => (uuidCallCount++).toString());

		await purgeDatabase();

		await chai.request(app)
			.post('/playtexts')
			.send({
				name: 'True West',
				characters: [
					{
						name: 'Austin'
					},
					{
						name: 'Lee'
					}
				]
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'True West',
				theatre: {
					name: 'Crucible Theatre'
				},
				playtext: {
					name: 'True West'
				},
				cast: [
					{
						name: 'Nigel Harman',
						roles: [
							{
								name: 'Austin'
							},
							{
								name: 'Lee'
							}
						]
					},
					{
						name: 'John Light',
						roles: [
							{
								name: 'Lee'
							},
							{
								name: 'Austin'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'True West',
				theatre: {
					name: 'Vaudeville Theatre'
				},
				playtext: {
					name: 'True West'
				},
				cast: [
					{
						name: 'Kit Harington',
						roles: [
							{
								name: 'Austin'
							},
							{
								name: 'Lee'
							}
						]
					},
					{
						name: 'Johnny Flynn',
						roles: [
							{
								name: 'Lee'
							},
							{
								name: 'Austin'
							}
						]
					}
				]
			});

		austinCharacter = await chai.request(app)
			.get(`/characters/${AUSTIN_CHARACTER_UUID}`);

		leeCharacter = await chai.request(app)
			.get(`/characters/${LEE_CHARACTER_UUID}`);

		trueWestCrucibleProduction = await chai.request(app)
			.get(`/productions/${TRUE_WEST_CRUCIBLE_PRODUCTION_UUID}`);

		trueWestVaudevilleProduction = await chai.request(app)
			.get(`/productions/${TRUE_WEST_VAUDEVILLE_PRODUCTION_UUID}`);

		nigelHarmanPerson = await chai.request(app)
			.get(`/people/${NIGEL_HARMAN_PERSON_UUID}`);

		johnLightPerson = await chai.request(app)
			.get(`/people/${JOHN_LIGHT_PERSON_UUID}`);

		kitHaringtonPerson = await chai.request(app)
			.get(`/people/${KIT_HARINGTON_PERSON_UUID}`);

		johnnyFlynnPerson = await chai.request(app)
			.get(`/people/${JOHNNY_FLYNN_PERSON_UUID}`);

	});

	after(() => {

		sandbox.restore();

	});

	describe('Austin (character)', () => {

		it('includes productions in which character was portrayed (including performers who portrayed them)', () => {

			const expectedTrueWestCrucibleProductionCredit = {
				model: 'production',
				uuid: TRUE_WEST_CRUCIBLE_PRODUCTION_UUID,
				name: 'True West',
				theatre: {
					model: 'theatre',
					uuid: CRUCIBLE_THEATRE_UUID,
					name: 'Crucible Theatre'
				},
				performers: [
					{
						model: 'person',
						uuid: NIGEL_HARMAN_PERSON_UUID,
						name: 'Nigel Harman',
						roleName: 'Austin',
						qualifier: null,
						otherRoles: [
							{
								model: 'character',
								uuid: LEE_CHARACTER_UUID,
								name: 'Lee',
								qualifier: null
							}
						]
					},
					{
						model: 'person',
						uuid: JOHN_LIGHT_PERSON_UUID,
						name: 'John Light',
						roleName: 'Austin',
						qualifier: null,
						otherRoles: [
							{
								model: 'character',
								uuid: LEE_CHARACTER_UUID,
								name: 'Lee',
								qualifier: null
							}
						]
					}
				]
			};

			const expectedTrueWestVaudevilleProductionCredit = {
				model: 'production',
				uuid: TRUE_WEST_VAUDEVILLE_PRODUCTION_UUID,
				name: 'True West',
				theatre: {
					model: 'theatre',
					uuid: VAUDEVILLE_THEATRE_UUID,
					name: 'Vaudeville Theatre'
				},
				performers: [
					{
						model: 'person',
						uuid: KIT_HARINGTON_PERSON_UUID,
						name: 'Kit Harington',
						roleName: 'Austin',
						qualifier: null,
						otherRoles: [
							{
								model: 'character',
								uuid: LEE_CHARACTER_UUID,
								name: 'Lee',
								qualifier: null
							}
						]
					},
					{
						model: 'person',
						uuid: JOHNNY_FLYNN_PERSON_UUID,
						name: 'Johnny Flynn',
						roleName: 'Austin',
						qualifier: null,
						otherRoles: [
							{
								model: 'character',
								uuid: LEE_CHARACTER_UUID,
								name: 'Lee',
								qualifier: null
							}
						]
					}
				]
			};

			const { productions } = austinCharacter.body;

			const trueWestCrucibleProductionCredit =
				productions.find(production => production.uuid === TRUE_WEST_CRUCIBLE_PRODUCTION_UUID);

			const trueWestVaudevilleProductionCredit =
				productions.find(production => production.uuid === TRUE_WEST_VAUDEVILLE_PRODUCTION_UUID);

			expect(productions.length).to.equal(2);
			expect(expectedTrueWestCrucibleProductionCredit).to.deep.equal(trueWestCrucibleProductionCredit);
			expect(expectedTrueWestVaudevilleProductionCredit).to.deep.equal(trueWestVaudevilleProductionCredit);

		});

	});

	describe('Lee (character)', () => {

		it('includes productions in which character was portrayed (including performers who portrayed them)', () => {

			const expectedTrueWestCrucibleProductionCredit = {
				model: 'production',
				uuid: TRUE_WEST_CRUCIBLE_PRODUCTION_UUID,
				name: 'True West',
				theatre: {
					model: 'theatre',
					uuid: CRUCIBLE_THEATRE_UUID,
					name: 'Crucible Theatre'
				},
				performers: [
					{
						model: 'person',
						uuid: NIGEL_HARMAN_PERSON_UUID,
						name: 'Nigel Harman',
						roleName: 'Lee',
						qualifier: null,
						otherRoles: [
							{
								model: 'character',
								uuid: AUSTIN_CHARACTER_UUID,
								name: 'Austin',
								qualifier: null
							}
						]
					},
					{
						model: 'person',
						uuid: JOHN_LIGHT_PERSON_UUID,
						name: 'John Light',
						roleName: 'Lee',
						qualifier: null,
						otherRoles: [
							{
								model: 'character',
								uuid: AUSTIN_CHARACTER_UUID,
								name: 'Austin',
								qualifier: null
							}
						]
					}
				]
			};

			const expectedTrueWestVaudevilleProductionCredit = {
				model: 'production',
				uuid: TRUE_WEST_VAUDEVILLE_PRODUCTION_UUID,
				name: 'True West',
				theatre: {
					model: 'theatre',
					uuid: VAUDEVILLE_THEATRE_UUID,
					name: 'Vaudeville Theatre'
				},
				performers: [
					{
						model: 'person',
						uuid: KIT_HARINGTON_PERSON_UUID,
						name: 'Kit Harington',
						roleName: 'Lee',
						qualifier: null,
						otherRoles: [
							{
								model: 'character',
								uuid: AUSTIN_CHARACTER_UUID,
								name: 'Austin',
								qualifier: null
							}
						]
					},
					{
						model: 'person',
						uuid: JOHNNY_FLYNN_PERSON_UUID,
						name: 'Johnny Flynn',
						roleName: 'Lee',
						qualifier: null,
						otherRoles: [
							{
								model: 'character',
								uuid: AUSTIN_CHARACTER_UUID,
								name: 'Austin',
								qualifier: null
							}
						]
					}
				]
			};

			const { productions } = leeCharacter.body;

			const trueWestCrucibleProductionCredit =
				productions.find(production => production.uuid === TRUE_WEST_CRUCIBLE_PRODUCTION_UUID);

			const trueWestVaudevilleProductionCredit =
				productions.find(production => production.uuid === TRUE_WEST_VAUDEVILLE_PRODUCTION_UUID);

			expect(productions.length).to.equal(2);
			expect(expectedTrueWestCrucibleProductionCredit).to.deep.equal(trueWestCrucibleProductionCredit);
			expect(expectedTrueWestVaudevilleProductionCredit).to.deep.equal(trueWestVaudevilleProductionCredit);

		});

	});

	describe('True West at Crucible Theatre (production)', () => {

		it('includes cast with Nigel Harman as Austin and Lee, and John Light as Lee and Austin', () => {

			const expectedCastMemberNigelHarman = {
				model: 'person',
				uuid: NIGEL_HARMAN_PERSON_UUID,
				name: 'Nigel Harman',
				roles: [
					{
						model: 'character',
						uuid: AUSTIN_CHARACTER_UUID,
						name: 'Austin',
						qualifier: null
					},
					{
						model: 'character',
						uuid: LEE_CHARACTER_UUID,
						name: 'Lee',
						qualifier: null
					}
				]
			};

			const expectedCastMemberJohnLight = {
				model: 'person',
				uuid: JOHN_LIGHT_PERSON_UUID,
				name: 'John Light',
				roles: [
					{
						model: 'character',
						uuid: LEE_CHARACTER_UUID,
						name: 'Lee',
						qualifier: null
					},
					{
						model: 'character',
						uuid: AUSTIN_CHARACTER_UUID,
						name: 'Austin',
						qualifier: null
					}
				]
			};

			const { cast } = trueWestCrucibleProduction.body;

			const castMemberNigelHarman = cast.find(castMember => castMember.uuid === NIGEL_HARMAN_PERSON_UUID);
			const castMemberJohnLight = cast.find(castMember => castMember.uuid === JOHN_LIGHT_PERSON_UUID);

			expect(cast.length).to.equal(2);
			expect(castMemberNigelHarman).to.deep.equal(expectedCastMemberNigelHarman);
			expect(castMemberJohnLight).to.deep.equal(expectedCastMemberJohnLight);

		});

	});

	describe('True West at Vaudeville Theatre (production)', () => {

		it('includes cast with Kit Harington as Austin and Lee, and Johnny Flynn as Lee and Austin', () => {

			const expectedCastMemberKitHarington = {
				model: 'person',
				uuid: KIT_HARINGTON_PERSON_UUID,
				name: 'Kit Harington',
				roles: [
					{
						model: 'character',
						uuid: AUSTIN_CHARACTER_UUID,
						name: 'Austin',
						qualifier: null
					},
					{
						model: 'character',
						uuid: LEE_CHARACTER_UUID,
						name: 'Lee',
						qualifier: null
					}
				]
			};

			const expectedCastMemberJohnnyFlynn = {
				model: 'person',
				uuid: JOHNNY_FLYNN_PERSON_UUID,
				name: 'Johnny Flynn',
				roles: [
					{
						model: 'character',
						uuid: LEE_CHARACTER_UUID,
						name: 'Lee',
						qualifier: null
					},
					{
						model: 'character',
						uuid: AUSTIN_CHARACTER_UUID,
						name: 'Austin',
						qualifier: null
					}
				]
			};

			const { cast } = trueWestVaudevilleProduction.body;

			const castMemberKitHarington = cast.find(castMember => castMember.uuid === KIT_HARINGTON_PERSON_UUID);
			const castMemberJohnnyFlynn = cast.find(castMember => castMember.uuid === JOHNNY_FLYNN_PERSON_UUID);

			expect(cast.length).to.equal(2);
			expect(castMemberKitHarington).to.deep.equal(expectedCastMemberKitHarington);
			expect(castMemberJohnnyFlynn).to.deep.equal(expectedCastMemberJohnnyFlynn);

		});

	});

	describe('Nigel Harman (person)', () => {

		it('includes production with his portrayals of Austin and Lee', () => {

			const expectedProductionCredit = {
				model: 'production',
				uuid: TRUE_WEST_CRUCIBLE_PRODUCTION_UUID,
				name: 'True West',
				theatre: {
					model: 'theatre',
					uuid: CRUCIBLE_THEATRE_UUID,
					name: 'Crucible Theatre'
				},
				roles: [
					{
						model: 'character',
						uuid: AUSTIN_CHARACTER_UUID,
						name: 'Austin',
						qualifier: null
					},
					{
						model: 'character',
						uuid: LEE_CHARACTER_UUID,
						name: 'Lee',
						qualifier: null
					}
				]
			};

			const { productions } = nigelHarmanPerson.body;

			const productionCredit =
				productions.find(production => production.uuid === TRUE_WEST_CRUCIBLE_PRODUCTION_UUID);

			expect(productions.length).to.equal(1);
			expect(productionCredit).to.deep.equal(expectedProductionCredit);

		});

	});

	describe('John Light (person)', () => {

		it('includes production with his portrayals of Lee and Austin', () => {

			const expectedProductionCredit = {
				model: 'production',
				uuid: TRUE_WEST_CRUCIBLE_PRODUCTION_UUID,
				name: 'True West',
				theatre: {
					model: 'theatre',
					uuid: CRUCIBLE_THEATRE_UUID,
					name: 'Crucible Theatre'
				},
				roles: [
					{
						model: 'character',
						uuid: LEE_CHARACTER_UUID,
						name: 'Lee',
						qualifier: null
					},
					{
						model: 'character',
						uuid: AUSTIN_CHARACTER_UUID,
						name: 'Austin',
						qualifier: null
					}
				]
			};

			const { productions } = johnLightPerson.body;

			const productionCredit =
				productions.find(production => production.uuid === TRUE_WEST_CRUCIBLE_PRODUCTION_UUID);

			expect(productions.length).to.equal(1);
			expect(productionCredit).to.deep.equal(expectedProductionCredit);

		});

	});

	describe('Kit Harington (person)', () => {

		it('includes production with his portrayals of Austin and Lee', () => {

			const expectedProductionCredit = {
				model: 'production',
				uuid: TRUE_WEST_VAUDEVILLE_PRODUCTION_UUID,
				name: 'True West',
				theatre: {
					model: 'theatre',
					uuid: VAUDEVILLE_THEATRE_UUID,
					name: 'Vaudeville Theatre'
				},
				roles: [
					{
						model: 'character',
						uuid: AUSTIN_CHARACTER_UUID,
						name: 'Austin',
						qualifier: null
					},
					{
						model: 'character',
						uuid: LEE_CHARACTER_UUID,
						name: 'Lee',
						qualifier: null
					}
				]
			};

			const { productions } = kitHaringtonPerson.body;

			const productionCredit =
				productions.find(production => production.uuid === TRUE_WEST_VAUDEVILLE_PRODUCTION_UUID);

			expect(productions.length).to.equal(1);
			expect(productionCredit).to.deep.equal(expectedProductionCredit);

		});

	});

	describe('Johnny Flynn (person)', () => {

		it('includes production with his portrayals of Lee and Austin', () => {

			const expectedProductionCredit = {
				model: 'production',
				uuid: TRUE_WEST_VAUDEVILLE_PRODUCTION_UUID,
				name: 'True West',
				theatre: {
					model: 'theatre',
					uuid: VAUDEVILLE_THEATRE_UUID,
					name: 'Vaudeville Theatre'
				},
				roles: [
					{
						model: 'character',
						uuid: LEE_CHARACTER_UUID,
						name: 'Lee',
						qualifier: null
					},
					{
						model: 'character',
						uuid: AUSTIN_CHARACTER_UUID,
						name: 'Austin',
						qualifier: null
					}
				]
			};

			const { productions } = johnnyFlynnPerson.body;

			const productionCredit =
				productions.find(production => production.uuid === TRUE_WEST_VAUDEVILLE_PRODUCTION_UUID);

			expect(productions.length).to.equal(1);
			expect(productionCredit).to.deep.equal(expectedProductionCredit);

		});

	});

});
