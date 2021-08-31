import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { createSandbox } from 'sinon';
import { v4 as uuid } from 'uuid';

import app from '../../src/app';
import purgeDatabase from '../test-helpers/neo4j/purge-database';

describe('Awards with award ceremonies', () => {

	chai.use(chaiHttp);

	const LAURENCE_OLIVIER_AWARDS_TWO_THOUSAND_AND_NINETEEN_AWARD_CEREMONY_UUID = '2';
	const LAURENCE_OLIVIER_AWARDS_AWARD_UUID = '3';
	const LAURENCE_OLIVIER_AWARDS_TWO_THOUSAND_AND_TWENTY_AWARD_CEREMONY_UUID = '6';
	const LAURENCE_OLIVIER_AWARDS_TWO_THOUSAND_AND_EIGHTEEN_AWARD_CEREMONY_UUID = '10';
	const EVENING_STANDARD_THEATRE_AWARDS_TWO_THOUSAND_AND_EIGHTEEN_AWARD_CEREMONY_UUID = '14';
	const EVENING_STANDARD_THEATRE_AWARDS_AWARD_UUID = '15';
	const EVENING_STANDARD_THEATRE_AWARDS_TWO_THOUSAND_AND_NINETEEN_AWARD_CEREMONY_UUID = '18';
	const EVENING_STANDARD_THEATRE_AWARDS_TWO_THOUSAND_AND_SEVENTEEN_AWARD_CEREMONY_UUID = '22';

	let laurenceOlivierAwardsAward;
	let eveningStandardTheatreAwardsAward;

	const sandbox = createSandbox();

	before(async () => {

		let uuidCallCount = 0;

		sandbox.stub(uuid, 'v4').callsFake(() => (uuidCallCount++).toString());

		await purgeDatabase();

		await chai.request(app)
			.post('/awards/ceremonies')
			.send({
				name: '2019',
				award: {
					name: 'Laurence Olivier Awards'
				}
			});

		await chai.request(app)
			.post('/awards/ceremonies')
			.send({
				name: '2020',
				award: {
					name: 'Laurence Olivier Awards'
				}
			});

		await chai.request(app)
			.post('/awards/ceremonies')
			.send({
				name: '2018',
				award: {
					name: 'Laurence Olivier Awards'
				}
			});

		await chai.request(app)
			.post('/awards/ceremonies')
			.send({
				name: '2018',
				award: {
					name: 'Evening Standard Theatre Awards'
				}
			});

		await chai.request(app)
			.post('/awards/ceremonies')
			.send({
				name: '2019',
				award: {
					name: 'Evening Standard Theatre Awards'
				}
			});

		await chai.request(app)
			.post('/awards/ceremonies')
			.send({
				name: '2017',
				award: {
					name: 'Evening Standard Theatre Awards'
				}
			});

		laurenceOlivierAwardsAward = await chai.request(app)
			.get(`/awards/${LAURENCE_OLIVIER_AWARDS_AWARD_UUID}`);

		eveningStandardTheatreAwardsAward = await chai.request(app)
			.get(`/awards/${EVENING_STANDARD_THEATRE_AWARDS_AWARD_UUID}`);

	});

	after(() => {

		sandbox.restore();

	});

	describe('Laurence Olivier Awards (award)', () => {

		it('includes its ceremonies', () => {

			const expectedAwardCeremonies = [
				{
					model: 'AWARD_CEREMONY',
					uuid: LAURENCE_OLIVIER_AWARDS_TWO_THOUSAND_AND_TWENTY_AWARD_CEREMONY_UUID,
					name: '2020'
				},
				{
					model: 'AWARD_CEREMONY',
					uuid: LAURENCE_OLIVIER_AWARDS_TWO_THOUSAND_AND_NINETEEN_AWARD_CEREMONY_UUID,
					name: '2019'
				},
				{
					model: 'AWARD_CEREMONY',
					uuid: LAURENCE_OLIVIER_AWARDS_TWO_THOUSAND_AND_EIGHTEEN_AWARD_CEREMONY_UUID,
					name: '2018'
				}
			];

			const { awardCeremonies } = laurenceOlivierAwardsAward.body;

			expect(awardCeremonies).to.deep.equal(expectedAwardCeremonies);

		});

	});

	describe('Evening Standard Theatre Awards (award)', () => {

		it('includes its ceremonies', () => {

			const expectedAwardCeremonies = [
				{
					model: 'AWARD_CEREMONY',
					uuid: EVENING_STANDARD_THEATRE_AWARDS_TWO_THOUSAND_AND_NINETEEN_AWARD_CEREMONY_UUID,
					name: '2019'
				},
				{
					model: 'AWARD_CEREMONY',
					uuid: EVENING_STANDARD_THEATRE_AWARDS_TWO_THOUSAND_AND_EIGHTEEN_AWARD_CEREMONY_UUID,
					name: '2018'
				},
				{
					model: 'AWARD_CEREMONY',
					uuid: EVENING_STANDARD_THEATRE_AWARDS_TWO_THOUSAND_AND_SEVENTEEN_AWARD_CEREMONY_UUID,
					name: '2017'
				}
			];

			const { awardCeremonies } = eveningStandardTheatreAwardsAward.body;

			expect(awardCeremonies).to.deep.equal(expectedAwardCeremonies);

		});

	});

});
