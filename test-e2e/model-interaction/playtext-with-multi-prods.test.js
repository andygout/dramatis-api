import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { createSandbox } from 'sinon';
import { v4 as uuid } from 'uuid';

import app from '../../src/app';
import purgeDatabase from '../test-helpers/neo4j/purge-database';

describe('Playtext with multiple productions', () => {

	chai.use(chaiHttp);

	const MEASURE_FOR_MEASURE_NATIONAL_PRODUCTION_UUID = '0';
	const MEASURE_FOR_MEASURE_PLAYTEXT_UUID = '1';
	const NATIONAL_THEATRE_UUID = '2';
	const MEASURE_FOR_MEASURE_ALMEIDA_PRODUCTION_UUID = '3';
	const ALMEIDA_THEATRE_UUID = '5';
	const MEASURE_FOR_MEASURE_DONMAR_PRODUCTION_UUID = '6';
	const DONMAR_WAREHOUSE_THEATRE_UUID = '8';

	let measureForMeasurePlaytext;
	let measureForMeasureNationalProduction;
	let measureForMeasureAlmeidaProduction;
	let measureForMeasureDonmarProduction;

	const sandbox = createSandbox();

	before(async () => {

		let uuidCallCount = 0;

		sandbox.stub(uuid, 'v4').callsFake(() => (uuidCallCount++).toString());

		await purgeDatabase();

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Measure for Measure',
				theatre: {
					name: 'National Theatre'
				},
				playtext: {
					name: 'Measure for Measure'
				}
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Measure for Measure',
				theatre: {
					name: 'Almeida Theatre'
				},
				playtext: {
					name: 'Measure for Measure'
				}
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Measure for Measure',
				theatre: {
					name: 'Donmar Warehouse'
				},
				playtext: {
					name: 'Measure for Measure'
				}
			});

		measureForMeasurePlaytext = await chai.request(app)
			.get(`/playtexts/${MEASURE_FOR_MEASURE_PLAYTEXT_UUID}`);

		measureForMeasureNationalProduction = await chai.request(app)
			.get(`/productions/${MEASURE_FOR_MEASURE_NATIONAL_PRODUCTION_UUID}`);

		measureForMeasureAlmeidaProduction = await chai.request(app)
			.get(`/productions/${MEASURE_FOR_MEASURE_ALMEIDA_PRODUCTION_UUID}`);

		measureForMeasureDonmarProduction = await chai.request(app)
			.get(`/productions/${MEASURE_FOR_MEASURE_DONMAR_PRODUCTION_UUID}`);

	});

	after(() => {

		sandbox.restore();

	});

	describe('Measure for Measure (playtext)', () => {

		it('includes productions of playtext', () => {

			const expectedProductions = [
				{
					model: 'production',
					uuid: MEASURE_FOR_MEASURE_ALMEIDA_PRODUCTION_UUID,
					name: 'Measure for Measure',
					theatre: {
						model: 'theatre',
						uuid: ALMEIDA_THEATRE_UUID,
						name: 'Almeida Theatre',
						surTheatre: null
					}
				},
				{
					model: 'production',
					uuid: MEASURE_FOR_MEASURE_DONMAR_PRODUCTION_UUID,
					name: 'Measure for Measure',
					theatre: {
						model: 'theatre',
						uuid: DONMAR_WAREHOUSE_THEATRE_UUID,
						name: 'Donmar Warehouse',
						surTheatre: null
					}
				},
				{
					model: 'production',
					uuid: MEASURE_FOR_MEASURE_NATIONAL_PRODUCTION_UUID,
					name: 'Measure for Measure',
					theatre: {
						model: 'theatre',
						uuid: NATIONAL_THEATRE_UUID,
						name: 'National Theatre',
						surTheatre: null
					}
				}
			];

			const { productions } = measureForMeasurePlaytext.body;

			expect(productions).to.deep.equal(expectedProductions);

		});

	});

	describe('Measure for Measure at National Theatre (production)', () => {

		it('attributes playtext as Measure for Measure', () => {

			const expectedPlaytext = {
				model: 'playtext',
				uuid: MEASURE_FOR_MEASURE_PLAYTEXT_UUID,
				name: 'Measure for Measure'
			};

			const { playtext } = measureForMeasureNationalProduction.body;

			expect(playtext).to.deep.equal(expectedPlaytext);

		});

	});

	describe('Measure for Measure at Almeida Theatre (production)', () => {

		it('attributes playtext as Measure for Measure', () => {

			const expectedPlaytext = {
				model: 'playtext',
				uuid: MEASURE_FOR_MEASURE_PLAYTEXT_UUID,
				name: 'Measure for Measure'
			};

			const { playtext } = measureForMeasureAlmeidaProduction.body;

			expect(playtext).to.deep.equal(expectedPlaytext);

		});

	});

	describe('Measure for Measure at Donmar Warehouse (production)', () => {

		it('attributes playtext as Measure for Measure', () => {

			const expectedPlaytext = {
				model: 'playtext',
				uuid: MEASURE_FOR_MEASURE_PLAYTEXT_UUID,
				name: 'Measure for Measure'
			};

			const { playtext } = measureForMeasureDonmarProduction.body;

			expect(playtext).to.deep.equal(expectedPlaytext);

		});

	});

});
