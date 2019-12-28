import chai from 'chai';
import chaiHttp from 'chai-http';
import { createSandbox } from 'sinon';
import { v4 as uuid } from 'uuid';

import app from '../../server/app';
import purgeDatabase from '../test-helpers/neo4j/purge-database';

chai.use(chaiHttp);

const expect = chai.expect;

describe('Theatre with multiple productions', () => {

	const STREETCAR_NAMED_DESIRE_DONMAR_PRODUCTION_UUID = '0';
	const DONMAR_WAREHOUSE_THEATRE_UUID = '1';
	const LIFE_IS_A_DREAM_DONMAR_PRODUCTION_UUID = '3';
	const RED_DONMAR_PRODUCTION_UUID = '6';

	let donmarWarehouseTheatre;
	let streetcarNamedDesireDonmarProduction;
	let lifeIsADreamDonmarProduction;
	let redDonmarProduction;

	const sandbox = createSandbox();

	before(async () => {

		let uuidCallCount = 0;

		sandbox.stub(uuid, 'v4').callsFake(() => (uuidCallCount++).toString());

		await purgeDatabase();

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'A Streetcar Named Desire',
				theatre: {
					name: 'Donmar Warehouse'
				}
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Life is a Dream',
				theatre: {
					name: 'Donmar Warehouse'
				}
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Red',
				theatre: {
					name: 'Donmar Warehouse'
				}
			});

		donmarWarehouseTheatre = await chai.request(app)
			.get(`/theatres/${DONMAR_WAREHOUSE_THEATRE_UUID}`);

		streetcarNamedDesireDonmarProduction = await chai.request(app)
			.get(`/productions/${STREETCAR_NAMED_DESIRE_DONMAR_PRODUCTION_UUID}`);

		lifeIsADreamDonmarProduction = await chai.request(app)
			.get(`/productions/${LIFE_IS_A_DREAM_DONMAR_PRODUCTION_UUID}`);

		redDonmarProduction = await chai.request(app)
			.get(`/productions/${RED_DONMAR_PRODUCTION_UUID}`);

	});

	after(() => {

		sandbox.restore();

	});

	describe('Donmar Warehouse (theatre)', () => {

		it('includes productions at this theatre', () => {

			const expectedStreetcarNamedDesireDonmarProductionCredit = {
				model: 'production',
				uuid: STREETCAR_NAMED_DESIRE_DONMAR_PRODUCTION_UUID,
				name: 'A Streetcar Named Desire'
			};

			const expectedLifeIsADreamDonmarProductionCredit = {
				model: 'production',
				uuid: LIFE_IS_A_DREAM_DONMAR_PRODUCTION_UUID,
				name: 'Life is a Dream'
			};

			const expectedRedDonmarProductionCredit = {
				model: 'production',
				uuid: RED_DONMAR_PRODUCTION_UUID,
				name: 'Red'
			};

			const { productions } = donmarWarehouseTheatre.body;

			const streetcarNamedDesireDonmarProductionCredit =
				productions.find(production => production.uuid === STREETCAR_NAMED_DESIRE_DONMAR_PRODUCTION_UUID);

			const lifeIsADreamDonmarProductionCredit =
				productions.find(production => production.uuid === LIFE_IS_A_DREAM_DONMAR_PRODUCTION_UUID);

			const redDonmarProductionCredit =
				productions.find(production => production.uuid === RED_DONMAR_PRODUCTION_UUID);

			expect(productions.length).to.equal(3);
			expect(expectedStreetcarNamedDesireDonmarProductionCredit)
				.to.deep.equal(streetcarNamedDesireDonmarProductionCredit);
			expect(expectedLifeIsADreamDonmarProductionCredit).to.deep.equal(lifeIsADreamDonmarProductionCredit);
			expect(expectedRedDonmarProductionCredit).to.deep.equal(redDonmarProductionCredit);

		});

	});

	describe('A Streetcar Named Desire at Donmar Warehouse (production)', () => {

		it('attributes theatre as Donmar Warehouse', () => {

			const expectedTheatreDonmarWarehouse = {
				model: 'theatre',
				uuid: DONMAR_WAREHOUSE_THEATRE_UUID,
				name: 'Donmar Warehouse'
			};

			const { theatre } = streetcarNamedDesireDonmarProduction.body;

			expect(expectedTheatreDonmarWarehouse).to.deep.equal(theatre);

		});

	});

	describe('Life is a Dream at Donmar Warehouse (production)', () => {

		it('attributes theatre as Donmar Warehouse', () => {

			const expectedTheatreDonmarWarehouse = {
				model: 'theatre',
				uuid: DONMAR_WAREHOUSE_THEATRE_UUID,
				name: 'Donmar Warehouse'
			};

			const { theatre } = lifeIsADreamDonmarProduction.body;

			expect(expectedTheatreDonmarWarehouse).to.deep.equal(theatre);

		});

	});

	describe('Red at Donmar Warehouse (production)', () => {

		it('attributes theatre as Donmar Warehouse', () => {

			const expectedTheatreDonmarWarehouse = {
				model: 'theatre',
				uuid: DONMAR_WAREHOUSE_THEATRE_UUID,
				name: 'Donmar Warehouse'
			};

			const { theatre } = redDonmarProduction.body;

			expect(expectedTheatreDonmarWarehouse).to.deep.equal(theatre);

		});

	});

});
