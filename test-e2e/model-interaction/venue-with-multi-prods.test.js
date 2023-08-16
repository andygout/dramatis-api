import crypto from 'crypto';

import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { createSandbox } from 'sinon';

import app from '../../src/app';
import { purgeDatabase } from '../test-helpers/neo4j';

describe('Venue with multiple productions', () => {

	chai.use(chaiHttp);

	const A_STREETCAR_NAMED_DESIRE_DONMAR_PRODUCTION_UUID = '0';
	const DONMAR_WAREHOUSE_VENUE_UUID = '2';
	const LIFE_IS_A_DREAM_DONMAR_PRODUCTION_UUID = '4';
	const RED_DONMAR_PRODUCTION_UUID = '8';

	let donmarWarehouseVenue;
	let streetcarNamedDesireDonmarProduction;
	let lifeIsADreamDonmarProduction;
	let redDonmarProduction;

	const sandbox = createSandbox();

	before(async () => {

		let uuidCallCount = 0;

		sandbox.stub(crypto, 'randomUUID').callsFake(() => (uuidCallCount++).toString());

		await purgeDatabase();

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'A Streetcar Named Desire',
				startDate: '2009-07-23',
				pressDate: '2009-07-28',
				endDate: '2009-10-03',
				venue: {
					name: 'Donmar Warehouse'
				}
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Life is a Dream',
				startDate: '2009-10-08',
				pressDate: '2009-10-13',
				endDate: '2009-11-28',
				venue: {
					name: 'Donmar Warehouse'
				}
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Red',
				startDate: '2009-12-03',
				pressDate: '2009-12-08',
				endDate: '2010-02-06',
				venue: {
					name: 'Donmar Warehouse'
				}
			});

		donmarWarehouseVenue = await chai.request(app)
			.get(`/venues/${DONMAR_WAREHOUSE_VENUE_UUID}`);

		streetcarNamedDesireDonmarProduction = await chai.request(app)
			.get(`/productions/${A_STREETCAR_NAMED_DESIRE_DONMAR_PRODUCTION_UUID}`);

		lifeIsADreamDonmarProduction = await chai.request(app)
			.get(`/productions/${LIFE_IS_A_DREAM_DONMAR_PRODUCTION_UUID}`);

		redDonmarProduction = await chai.request(app)
			.get(`/productions/${RED_DONMAR_PRODUCTION_UUID}`);

	});

	after(() => {

		sandbox.restore();

	});

	describe('Donmar Warehouse (venue)', () => {

		it('includes productions at this venue', () => {

			const expectedProductions = [
				{
					model: 'PRODUCTION',
					uuid: RED_DONMAR_PRODUCTION_UUID,
					name: 'Red',
					startDate: '2009-12-03',
					endDate: '2010-02-06',
					subVenue: null,
					surProduction: null
				},
				{
					model: 'PRODUCTION',
					uuid: LIFE_IS_A_DREAM_DONMAR_PRODUCTION_UUID,
					name: 'Life is a Dream',
					startDate: '2009-10-08',
					endDate: '2009-11-28',
					subVenue: null,
					surProduction: null
				},
				{
					model: 'PRODUCTION',
					uuid: A_STREETCAR_NAMED_DESIRE_DONMAR_PRODUCTION_UUID,
					name: 'A Streetcar Named Desire',
					startDate: '2009-07-23',
					endDate: '2009-10-03',
					subVenue: null,
					surProduction: null
				}
			];

			const { productions } = donmarWarehouseVenue.body;

			expect(productions).to.deep.equal(expectedProductions);

		});

	});

	describe('A Streetcar Named Desire at Donmar Warehouse (production)', () => {

		it('attributes venue as Donmar Warehouse', () => {

			const expectedVenue = {
				model: 'VENUE',
				uuid: DONMAR_WAREHOUSE_VENUE_UUID,
				name: 'Donmar Warehouse',
				surVenue: null
			};

			const { venue } = streetcarNamedDesireDonmarProduction.body;

			expect(venue).to.deep.equal(expectedVenue);

		});

	});

	describe('Life is a Dream at Donmar Warehouse (production)', () => {

		it('attributes venue as Donmar Warehouse', () => {

			const expectedVenue = {
				model: 'VENUE',
				uuid: DONMAR_WAREHOUSE_VENUE_UUID,
				name: 'Donmar Warehouse',
				surVenue: null
			};

			const { venue } = lifeIsADreamDonmarProduction.body;

			expect(venue).to.deep.equal(expectedVenue);

		});

	});

	describe('Red at Donmar Warehouse (production)', () => {

		it('attributes venue as Donmar Warehouse', () => {

			const expectedVenue = {
				model: 'VENUE',
				uuid: DONMAR_WAREHOUSE_VENUE_UUID,
				name: 'Donmar Warehouse',
				surVenue: null
			};

			const { venue } = redDonmarProduction.body;

			expect(venue).to.deep.equal(expectedVenue);

		});

	});

});
