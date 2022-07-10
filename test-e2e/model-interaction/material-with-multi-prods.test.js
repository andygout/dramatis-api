import crypto from 'crypto';

import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { createSandbox } from 'sinon';

import app from '../../src/app';
import purgeDatabase from '../test-helpers/neo4j/purge-database';

describe('Material with multiple productions', () => {

	chai.use(chaiHttp);

	const TWELFTH_NIGHT_MATERIAL_UUID = '2';
	const TWELFTH_NIGHT_GLOBE_PRODUCTION_UUID = '4';
	const SHAKESPEARES_GLOBE_VENUE_UUID = '6';
	const TWELFTH_NIGHT_OR_WHAT_YOU_WILL_DONMAR_PRODUCTION_UUID = '7';
	const DONMAR_WAREHOUSE_VENUE_UUID = '9';
	const TWELFTH_NIGHT_NATIONAL_PRODUCTION_UUID = '10';
	const NATIONAL_THEATRE_VENUE_UUID = '12';

	let twelfthNightMaterial;
	let twelfthNightGlobeProduction;
	let twelfthNightDonmarProduction;
	let twelfthNightNationalProduction;

	const sandbox = createSandbox();

	before(async () => {

		let uuidCallCount = 0;

		sandbox.stub(crypto, 'randomUUID').callsFake(() => (uuidCallCount++).toString());

		await purgeDatabase();

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Twelfth Night',
				format: 'play',
				year: '1602'
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Twelfth Night',
				startDate: '2012-09-22',
				endDate: '2012-10-14',
				material: {
					name: 'Twelfth Night'
				},
				venue: {
					name: 'Shakespeare\'s Globe'
				}
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Twelfth Night, or What You Will',
				startDate: '2002-10-11',
				pressDate: '2002-10-22',
				endDate: '2002-11-30',
				material: {
					name: 'Twelfth Night'
				},
				venue: {
					name: 'Donmar Warehouse'
				}
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Twelfth Night',
				startDate: '2011-01-11',
				pressDate: '2011-01-18',
				endDate: '2011-03-02',
				material: {
					name: 'Twelfth Night'
				},
				venue: {
					name: 'National Theatre'
				}
			});

		twelfthNightMaterial = await chai.request(app)
			.get(`/materials/${TWELFTH_NIGHT_MATERIAL_UUID}`);

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

	describe('Twelfth Night (material)', () => {

		it('includes productions of material ordered by production name then venue name', () => {

			const expectedProductions = [
				{
					model: 'PRODUCTION',
					uuid: TWELFTH_NIGHT_GLOBE_PRODUCTION_UUID,
					name: 'Twelfth Night',
					startDate: '2012-09-22',
					endDate: '2012-10-14',
					venue: {
						model: 'VENUE',
						uuid: SHAKESPEARES_GLOBE_VENUE_UUID,
						name: 'Shakespeare\'s Globe',
						surVenue: null
					}
				},
				{
					model: 'PRODUCTION',
					uuid: TWELFTH_NIGHT_NATIONAL_PRODUCTION_UUID,
					name: 'Twelfth Night',
					startDate: '2011-01-11',
					endDate: '2011-03-02',
					venue: {
						model: 'VENUE',
						uuid: NATIONAL_THEATRE_VENUE_UUID,
						name: 'National Theatre',
						surVenue: null
					}
				},
				{
					model: 'PRODUCTION',
					uuid: TWELFTH_NIGHT_OR_WHAT_YOU_WILL_DONMAR_PRODUCTION_UUID,
					name: 'Twelfth Night, or What You Will',
					startDate: '2002-10-11',
					endDate: '2002-11-30',
					venue: {
						model: 'VENUE',
						uuid: DONMAR_WAREHOUSE_VENUE_UUID,
						name: 'Donmar Warehouse',
						surVenue: null
					}
				}
			];

			const { productions } = twelfthNightMaterial.body;

			expect(productions).to.deep.equal(expectedProductions);

		});

	});

	describe('Twelfth Night at Shakespeare\'s Globe (production)', () => {

		it('attributes material as Twelfth Night', () => {

			const expectedMaterial = {
				model: 'MATERIAL',
				uuid: TWELFTH_NIGHT_MATERIAL_UUID,
				name: 'Twelfth Night',
				format: 'play',
				year: 1602,
				surMaterial: null,
				writingCredits: []
			};

			const { material } = twelfthNightGlobeProduction.body;

			expect(material).to.deep.equal(expectedMaterial);

		});

	});

	describe('Twelfth Night at Donmar Warehouse (production)', () => {

		it('attributes material as Twelfth Night', () => {

			const expectedMaterial = {
				model: 'MATERIAL',
				uuid: TWELFTH_NIGHT_MATERIAL_UUID,
				name: 'Twelfth Night',
				format: 'play',
				year: 1602,
				surMaterial: null,
				writingCredits: []
			};

			const { material } = twelfthNightDonmarProduction.body;

			expect(material).to.deep.equal(expectedMaterial);

		});

	});

	describe('Twelfth Night at National Theatre (production)', () => {

		it('attributes material as Twelfth Night', () => {

			const expectedMaterial = {
				model: 'MATERIAL',
				uuid: TWELFTH_NIGHT_MATERIAL_UUID,
				name: 'Twelfth Night',
				format: 'play',
				year: 1602,
				surMaterial: null,
				writingCredits: []
			};

			const { material } = twelfthNightNationalProduction.body;

			expect(material).to.deep.equal(expectedMaterial);

		});

	});

});
