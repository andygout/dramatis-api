import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { createSandbox } from 'sinon';
import { v4 as uuid } from 'uuid';

import app from '../../src/app';
import purgeDatabase from '../test-helpers/neo4j/purge-database';

describe('Playtext with multiple productions', () => {

	chai.use(chaiHttp);

	const TWELFTH_NIGHT_GLOBE_PRODUCTION_UUID = '0';
	const TWELFTH_NIGHT_PLAYTEXT_UUID = '1';
	const SHAKESPEARES_GLOBE_THEATRE_UUID = '2';
	const TWELFTH_NIGHT_OR_WHAT_YOU_WILL_DONMAR_PRODUCTION_UUID = '3';
	const DONMAR_WAREHOUSE_THEATRE_UUID = '5';
	const TWELFTH_NIGHT_NATIONAL_PRODUCTION_UUID = '6';
	const NATIONAL_THEATRE_UUID = '8';

	let twelfthNightPlaytext;
	let twelfthNightGlobeProduction;
	let twelfthNightDonmarProduction;
	let twelfthNightNationalProduction;

	const sandbox = createSandbox();

	before(async () => {

		let uuidCallCount = 0;

		sandbox.stub(uuid, 'v4').callsFake(() => (uuidCallCount++).toString());

		await purgeDatabase();

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Twelfth Night',
				playtext: {
					name: 'Twelfth Night'
				},
				theatre: {
					name: 'Shakespeare\'s Globe'
				}
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Twelfth Night, or What You Will',
				playtext: {
					name: 'Twelfth Night'
				},
				theatre: {
					name: 'Donmar Warehouse'
				}
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Twelfth Night',
				playtext: {
					name: 'Twelfth Night'
				},
				theatre: {
					name: 'National Theatre'
				}
			});

		twelfthNightPlaytext = await chai.request(app)
			.get(`/playtexts/${TWELFTH_NIGHT_PLAYTEXT_UUID}`);

		twelfthNightGlobeProduction = await chai.request(app)
			.get(`/productions/${TWELFTH_NIGHT_GLOBE_PRODUCTION_UUID}`);

		twelfthNightDonmarProduction = await chai.request(app)
			.get(`/productions/${TWELFTH_NIGHT_OR_WHAT_YOU_WILL_DONMAR_PRODUCTION_UUID}`);

		twelfthNightNationalProduction = await chai.request(app)
			.get(`/productions/${TWELFTH_NIGHT_NATIONAL_PRODUCTION_UUID}`);

	});

	after(() => {

		sandbox.restore();

	});

	describe('Twelfth Night (playtext)', () => {

		it('includes productions of playtext ordered by production name then theatre name', () => {

			const expectedProductions = [
				{
					model: 'production',
					uuid: TWELFTH_NIGHT_NATIONAL_PRODUCTION_UUID,
					name: 'Twelfth Night',
					theatre: {
						model: 'theatre',
						uuid: NATIONAL_THEATRE_UUID,
						name: 'National Theatre',
						surTheatre: null
					}
				},
				{
					model: 'production',
					uuid: TWELFTH_NIGHT_GLOBE_PRODUCTION_UUID,
					name: 'Twelfth Night',
					theatre: {
						model: 'theatre',
						uuid: SHAKESPEARES_GLOBE_THEATRE_UUID,
						name: 'Shakespeare\'s Globe',
						surTheatre: null
					}
				},
				{
					model: 'production',
					uuid: TWELFTH_NIGHT_OR_WHAT_YOU_WILL_DONMAR_PRODUCTION_UUID,
					name: 'Twelfth Night, or What You Will',
					theatre: {
						model: 'theatre',
						uuid: DONMAR_WAREHOUSE_THEATRE_UUID,
						name: 'Donmar Warehouse',
						surTheatre: null
					}
				}
			];

			const { productions } = twelfthNightPlaytext.body;

			expect(productions).to.deep.equal(expectedProductions);

		});

	});

	describe('Twelfth Night at Shakespeare\'s Globe (production)', () => {

		it('attributes playtext as Twelfth Night', () => {

			const expectedPlaytext = {
				model: 'playtext',
				uuid: TWELFTH_NIGHT_PLAYTEXT_UUID,
				name: 'Twelfth Night',
				writerGroups: []
			};

			const { playtext } = twelfthNightGlobeProduction.body;

			expect(playtext).to.deep.equal(expectedPlaytext);

		});

	});

	describe('Twelfth Night at Donmar Warehouse (production)', () => {

		it('attributes playtext as Twelfth Night', () => {

			const expectedPlaytext = {
				model: 'playtext',
				uuid: TWELFTH_NIGHT_PLAYTEXT_UUID,
				name: 'Twelfth Night',
				writerGroups: []
			};

			const { playtext } = twelfthNightDonmarProduction.body;

			expect(playtext).to.deep.equal(expectedPlaytext);

		});

	});

	describe('Twelfth Night at National Theatre (production)', () => {

		it('attributes playtext as Twelfth Night', () => {

			const expectedPlaytext = {
				model: 'playtext',
				uuid: TWELFTH_NIGHT_PLAYTEXT_UUID,
				name: 'Twelfth Night',
				writerGroups: []
			};

			const { playtext } = twelfthNightNationalProduction.body;

			expect(playtext).to.deep.equal(expectedPlaytext);

		});

	});

});
