import crypto from 'crypto';

import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { createSandbox } from 'sinon';

import app from '../../src/app';
import countNodesWithLabel from '../test-helpers/neo4j/count-nodes-with-label';
import createNode from '../test-helpers/neo4j/create-node';
import purgeDatabase from '../test-helpers/neo4j/purge-database';

describe('Uniqueness in database: Award ceremonies API', () => {

	chai.use(chaiHttp);

	const sandbox = createSandbox();

	describe('Award ceremony award uniqueness in database', () => {

		const TWO_THOUSAND_AND_TWENTY_AWARD_CEREMONY_UUID = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';

		const expectedAwardCriticsCircleTheatreAwards1 = {
			model: 'AWARD',
			name: 'Critics\' Circle Theatre Awards',
			differentiator: '',
			errors: {}
		};

		const expectedAwardCriticsCircleTheatreAwards2 = {
			model: 'AWARD',
			name: 'Critics\' Circle Theatre Awards',
			differentiator: '1',
			errors: {}
		};

		before(async () => {

			let uuidCallCount = 0;

			sandbox.stub(crypto, 'randomUUID').callsFake(() => (uuidCallCount++).toString());

			await purgeDatabase();

			await createNode({
				label: 'AwardCeremony',
				uuid: TWO_THOUSAND_AND_TWENTY_AWARD_CEREMONY_UUID,
				name: '2020'
			});

		});

		after(() => {

			sandbox.restore();

		});

		it('updates award ceremony and creates award that does not have a differentiator', async () => {

			expect(await countNodesWithLabel('Award')).to.equal(0);

			const response = await chai.request(app)
				.put(`/awards/ceremonies/${TWO_THOUSAND_AND_TWENTY_AWARD_CEREMONY_UUID}`)
				.send({
					name: '2020',
					award: {
						name: 'Critics\' Circle Theatre Awards'
					}
				});

			expect(response).to.have.status(200);
			expect(response.body.award).to.deep.equal(expectedAwardCriticsCircleTheatreAwards1);
			expect(await countNodesWithLabel('Award')).to.equal(1);

		});

		it('updates award ceremony and creates award that has same name as existing award but uses a differentiator', async () => {

			expect(await countNodesWithLabel('Award')).to.equal(1);

			const response = await chai.request(app)
				.put(`/awards/ceremonies/${TWO_THOUSAND_AND_TWENTY_AWARD_CEREMONY_UUID}`)
				.send({
					name: '2020',
					award: {
						name: 'Critics\' Circle Theatre Awards',
						differentiator: '1'
					}
				});

			expect(response).to.have.status(200);
			expect(response.body.award).to.deep.equal(expectedAwardCriticsCircleTheatreAwards2);
			expect(await countNodesWithLabel('Award')).to.equal(2);

		});

		it('updates award ceremony and uses existing award that does not have a differentiator', async () => {

			expect(await countNodesWithLabel('Award')).to.equal(2);

			const response = await chai.request(app)
				.put(`/awards/ceremonies/${TWO_THOUSAND_AND_TWENTY_AWARD_CEREMONY_UUID}`)
				.send({
					name: '2020',
					award: {
						name: 'Critics\' Circle Theatre Awards'
					}
				});

			expect(response).to.have.status(200);
			expect(response.body.award).to.deep.equal(expectedAwardCriticsCircleTheatreAwards1);
			expect(await countNodesWithLabel('Award')).to.equal(2);

		});

		it('updates award ceremony and uses existing award that has a differentiator', async () => {

			expect(await countNodesWithLabel('Award')).to.equal(2);

			const response = await chai.request(app)
				.put(`/awards/ceremonies/${TWO_THOUSAND_AND_TWENTY_AWARD_CEREMONY_UUID}`)
				.send({
					name: '2020',
					award: {
						name: 'Critics\' Circle Theatre Awards',
						differentiator: '1'
					}
				});

			expect(response).to.have.status(200);
			expect(response.body.award).to.deep.equal(expectedAwardCriticsCircleTheatreAwards2);
			expect(await countNodesWithLabel('Award')).to.equal(2);

		});

	});

});
