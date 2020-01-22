import chai from 'chai';
import chaiHttp from 'chai-http';
import { createSandbox } from 'sinon';
import { v4 as uuid } from 'uuid';

import app from '../../server/app';
import purgeDatabase from '../test-helpers/neo4j/purge-database';

chai.use(chaiHttp);

const expect = chai.expect;

describe('Cast member with multiple production credits', () => {

	const TEMPEST_ROYAL_SHAKESPEARE_PRODUCTION_UUID = '0';
	const ROYAL_SHAKESPEARE_THEATRE_UUID = '1';
	const PATRICK_STEWART_PERSON_UUID = '3';
	const MACBETH_GIELGUD_PRODUCTION_UUID = '4';
	const GIELGUD_THEATRE_UUID = '5';
	const WAITING_FOR_GODOT_HAYMARKET_PRODUCTION_UUID = '8';
	const HAYMARKET_THEATRE_UUID = '9';

	let patrickStewartPerson;
	let tempestRoyalShakespeareProduction;
	let macbethGielgudProduction;
	let waitingForGodotHaymarketProduction;

	const sandbox = createSandbox();

	before(async () => {

		let uuidCallCount = 0;

		sandbox.stub(uuid, 'v4').callsFake(() => (uuidCallCount++).toString());

		await purgeDatabase();

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'The Tempest',
				theatre: {
					name: 'Royal Shakespeare Theatre'
				},
				cast: [
					{
						name: 'Patrick Stewart',
						roles: [
							{
								name: 'Prospero',
								characterName: ''
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Macbeth',
				theatre: {
					name: 'Gielgud Theatre'
				},
				cast: [
					{
						name: 'Patrick Stewart',
						roles: [
							{
								name: 'Macbeth',
								characterName: ''
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Waiting for Godot',
				theatre: {
					name: 'Theatre Royal Haymarket'
				},
				cast: [
					{
						name: 'Patrick Stewart',
						roles: [
							{
								name: 'Vladimir',
								characterName: ''
							}
						]
					}
				]
			});

		patrickStewartPerson = await chai.request(app)
			.get(`/people/${PATRICK_STEWART_PERSON_UUID}`);

		tempestRoyalShakespeareProduction = await chai.request(app)
			.get(`/productions/${TEMPEST_ROYAL_SHAKESPEARE_PRODUCTION_UUID}`);

		macbethGielgudProduction = await chai.request(app)
			.get(`/productions/${MACBETH_GIELGUD_PRODUCTION_UUID}`);

		waitingForGodotHaymarketProduction = await chai.request(app)
			.get(`/productions/${WAITING_FOR_GODOT_HAYMARKET_PRODUCTION_UUID}`);

	});

	after(() => {

		sandbox.restore();

	});

	describe('Patrick Stewart (person)', () => {

		it('includes productions in which cast member performed (including characters they portrayed)', () => {

			const expectedTempestRoyalShakespeareProductionCredit = {
				model: 'production',
				uuid: TEMPEST_ROYAL_SHAKESPEARE_PRODUCTION_UUID,
				name: 'The Tempest',
				theatre: {
					model: 'theatre',
					uuid: ROYAL_SHAKESPEARE_THEATRE_UUID,
					name: 'Royal Shakespeare Theatre'
				},
				roles: [
					{
						model: 'character',
						uuid: null,
						name: 'Prospero'
					}
				]
			};

			const expectedMacbethGielgudProductionCredit = {
				model: 'production',
				uuid: MACBETH_GIELGUD_PRODUCTION_UUID,
				name: 'Macbeth',
				theatre: {
					model: 'theatre',
					uuid: GIELGUD_THEATRE_UUID,
					name: 'Gielgud Theatre'
				},
				roles: [
					{
						model: 'character',
						uuid: null,
						name: 'Macbeth'
					}
				]
			};

			const expectedWaitingForGodotHaymarketProductionCredit = {
				model: 'production',
				uuid: WAITING_FOR_GODOT_HAYMARKET_PRODUCTION_UUID,
				name: 'Waiting for Godot',
				theatre: {
					model: 'theatre',
					uuid: HAYMARKET_THEATRE_UUID,
					name: 'Theatre Royal Haymarket'
				},
				roles: [
					{
						model: 'character',
						uuid: null,
						name: 'Vladimir'
					}
				]
			};

			const { productions } = patrickStewartPerson.body;

			const tempestRoyalShakespeareProductionCredit =
				productions.find(production => production.uuid === TEMPEST_ROYAL_SHAKESPEARE_PRODUCTION_UUID);

			const macbethGielgudProductionCredit =
				productions.find(production => production.uuid === MACBETH_GIELGUD_PRODUCTION_UUID);

			const waitingForGodotHaymarketProductionCredit =
				productions.find(production => production.uuid === WAITING_FOR_GODOT_HAYMARKET_PRODUCTION_UUID);

			expect(productions.length).to.equal(3);
			expect(expectedTempestRoyalShakespeareProductionCredit)
				.to.deep.equal(tempestRoyalShakespeareProductionCredit);
			expect(expectedMacbethGielgudProductionCredit).to.deep.equal(macbethGielgudProductionCredit);
			expect(expectedWaitingForGodotHaymarketProductionCredit)
				.to.deep.equal(waitingForGodotHaymarketProductionCredit);

		});

	});

	describe('The Tempest at Royal Shakespeare Theatre (production)', () => {

		it('includes Patrick Stewart in its cast (including character he portrayed)', () => {

			const expectedCastMemberPatrickStewart = {
				model: 'person',
				uuid: PATRICK_STEWART_PERSON_UUID,
				name: 'Patrick Stewart',
				roles: [
					{
						model: 'character',
						uuid: null,
						name: 'Prospero'
					}
				]
			};

			const { cast } = tempestRoyalShakespeareProduction.body;

			const castMemberPatrickStewart =
				cast.find(castMember => castMember.uuid === PATRICK_STEWART_PERSON_UUID);

			expect(expectedCastMemberPatrickStewart).to.deep.equal(castMemberPatrickStewart);

		});

	});

	describe('Macbeth at Gielgud Theatre (production)', () => {

		it('includes Patrick Stewart in its cast (including character he portrayed)', () => {

			const expectedCastMemberPatrickStewart = {
				model: 'person',
				uuid: PATRICK_STEWART_PERSON_UUID,
				name: 'Patrick Stewart',
				roles: [
					{
						model: 'character',
						uuid: null,
						name: 'Macbeth'
					}
				]
			};

			const { cast } = macbethGielgudProduction.body;

			const castMemberPatrickStewart =
				cast.find(castMember => castMember.uuid === PATRICK_STEWART_PERSON_UUID);

			expect(expectedCastMemberPatrickStewart).to.deep.equal(castMemberPatrickStewart);

		});

	});

	describe('Waiting for Godot at Theatre Royal Haymarket (production)', () => {

		it('includes Patrick Stewart in its cast (including character he portrayed)', () => {

			const expectedCastMemberPatrickStewart = {
				model: 'person',
				uuid: PATRICK_STEWART_PERSON_UUID,
				name: 'Patrick Stewart',
				roles: [
					{
						model: 'character',
						uuid: null,
						name: 'Vladimir'
					}
				]
			};

			const { cast } = waitingForGodotHaymarketProduction.body;

			const castMemberPatrickStewart =
				cast.find(castMember => castMember.uuid === PATRICK_STEWART_PERSON_UUID);

			expect(expectedCastMemberPatrickStewart).to.deep.equal(castMemberPatrickStewart);

		});

	});

});
