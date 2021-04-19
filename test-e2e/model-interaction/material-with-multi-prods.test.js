import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { createSandbox } from 'sinon';
import { v4 as uuid } from 'uuid';

import app from '../../src/app';
import purgeDatabase from '../test-helpers/neo4j/purge-database';

describe('Material with multiple productions', () => {

	chai.use(chaiHttp);

	const TWELFTH_NIGHT_MATERIAL_UUID = '2';
	const TWELFTH_NIGHT_GLOBE_PRODUCTION_UUID = '4';
	const SHAKESPEARES_GLOBE_THEATRE_UUID = '6';
	const TWELFTH_NIGHT_OR_WHAT_YOU_WILL_DONMAR_PRODUCTION_UUID = '7';
	const DONMAR_WAREHOUSE_THEATRE_UUID = '9';
	const TWELFTH_NIGHT_NATIONAL_PRODUCTION_UUID = '10';
	const NATIONAL_THEATRE_UUID = '12';

	let twelfthNightMaterial;
	let twelfthNightGlobeProduction;
	let twelfthNightDonmarProduction;
	let twelfthNightNationalProduction;

	const sandbox = createSandbox();

	before(async () => {

		let uuidCallCount = 0;

		sandbox.stub(uuid, 'v4').callsFake(() => (uuidCallCount++).toString());

		await purgeDatabase();

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Twelfth Night',
				format: 'play'
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
				theatre: {
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
				theatre: {
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
				theatre: {
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

		it('includes productions of material ordered by production name then theatre name', () => {

			const expectedProductions = [
				{
					model: 'production',
					uuid: TWELFTH_NIGHT_NATIONAL_PRODUCTION_UUID,
					name: 'Twelfth Night',
					startDate: '2011-01-11',
					endDate: '2011-03-02',
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
					startDate: '2012-09-22',
					endDate: '2012-10-14',
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
					startDate: '2002-10-11',
					endDate: '2002-11-30',
					theatre: {
						model: 'theatre',
						uuid: DONMAR_WAREHOUSE_THEATRE_UUID,
						name: 'Donmar Warehouse',
						surTheatre: null
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
				model: 'material',
				uuid: TWELFTH_NIGHT_MATERIAL_UUID,
				name: 'Twelfth Night',
				format: 'play',
				writingCredits: []
			};

			const { material } = twelfthNightGlobeProduction.body;

			expect(material).to.deep.equal(expectedMaterial);

		});

	});

	describe('Twelfth Night at Donmar Warehouse (production)', () => {

		it('attributes material as Twelfth Night', () => {

			const expectedMaterial = {
				model: 'material',
				uuid: TWELFTH_NIGHT_MATERIAL_UUID,
				name: 'Twelfth Night',
				format: 'play',
				writingCredits: []
			};

			const { material } = twelfthNightDonmarProduction.body;

			expect(material).to.deep.equal(expectedMaterial);

		});

	});

	describe('Twelfth Night at National Theatre (production)', () => {

		it('attributes material as Twelfth Night', () => {

			const expectedMaterial = {
				model: 'material',
				uuid: TWELFTH_NIGHT_MATERIAL_UUID,
				name: 'Twelfth Night',
				format: 'play',
				writingCredits: []
			};

			const { material } = twelfthNightNationalProduction.body;

			expect(material).to.deep.equal(expectedMaterial);

		});

	});

});
