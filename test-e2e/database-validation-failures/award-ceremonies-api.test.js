import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';

import app from '../../src/app';
import countNodesWithLabel from '../test-helpers/neo4j/count-nodes-with-label';
import createNode from '../test-helpers/neo4j/create-node';
import createRelationship from '../test-helpers/neo4j/create-relationship';
import isNodeExistent from '../test-helpers/neo4j/is-node-existent';
import purgeDatabase from '../test-helpers/neo4j/purge-database';

describe('Database validation failures: Award ceremonies API', () => {

	chai.use(chaiHttp);

	describe('attempt to create instance', () => {

		before(async () => {

			await purgeDatabase();

		});

		context('nominated production uuid does not exist in database', () => {

			it('returns instance with appropriate errors attached', async () => {

				expect(await countNodesWithLabel('AwardCeremony')).to.equal(0);

				const response = await chai.request(app)
					.post('/awards/ceremonies')
					.send({
						name: '2020',
						award: {
							name: 'Laurence Olivier Awards'
						},
						categories: [
							{
								name: 'Best Revival',
								nominations: [
									{
										productions: [
											{
												uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
											}
										]
									}
								]
							}
						]
					});

				const expectedResponseBody = {
					model: 'AWARD_CEREMONY',
					name: '2020',
					hasErrors: true,
					errors: {},
					award: {
						model: 'AWARD',
						name: 'Laurence Olivier Awards',
						differentiator: '',
						errors: {}
					},
					categories: [
						{
							model: 'AWARD_CEREMONY_CATEGORY',
							name: 'Best Revival',
							errors: {},
							nominations: [
								{
									model: 'NOMINATION',
									isWinner: false,
									errors: {},
									entities: [],
									productions: [
										{
											model: 'PRODUCTION_IDENTIFIER',
											uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
											errors: {
												uuid: [
													'Production with this UUID does not exist'
												]
											}
										}
									],
									materials: []
								}
							]
						}
					]
				};

				expect(response).to.have.status(200);
				expect(response.body).to.deep.equal(expectedResponseBody);
				expect(await countNodesWithLabel('AwardCeremony')).to.equal(0);

			});

		});

	});

	describe('attempt to update instance', () => {

		const TWO_THOUSAND_AND_TWENTY_AWARD_CEREMONY_UUID = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';
		const LAURENCE_OLIVIER_AWARDS_AWARD_UUID = 'zzzzzzzz-zzzz-zzzz-zzzz-zzzzzzzzzzzz';

		before(async () => {

			await purgeDatabase();

			await createNode({
				label: 'AwardCeremony',
				uuid: TWO_THOUSAND_AND_TWENTY_AWARD_CEREMONY_UUID,
				name: '2020'
			});

			await createNode({
				label: 'Award',
				uuid: LAURENCE_OLIVIER_AWARDS_AWARD_UUID,
				name: 'Laurence Olivier Awards'
			});

			await createRelationship({
				sourceLabel: 'Award',
				sourceUuid: LAURENCE_OLIVIER_AWARDS_AWARD_UUID,
				destinationLabel: 'AwardCeremony',
				destinationUuid: TWO_THOUSAND_AND_TWENTY_AWARD_CEREMONY_UUID,
				relationshipName: 'PRESENTED_AT'
			});

		});

		context('nominated production uuid does not exist in database', () => {

			it('returns instance with appropriate errors attached', async () => {

				expect(await countNodesWithLabel('AwardCeremony')).to.equal(1);

				const response = await chai.request(app)
					.put(`/awards/ceremonies/${TWO_THOUSAND_AND_TWENTY_AWARD_CEREMONY_UUID}`)
					.send({
						name: '2020',
						award: {
							name: 'Laurence Olivier Awards'
						},
						categories: [
							{
								name: 'Best Revival',
								nominations: [
									{
										productions: [
											{
												uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
											}
										]
									}
								]
							}
						]
					});

				const expectedResponseBody = {
					model: 'AWARD_CEREMONY',
					uuid: TWO_THOUSAND_AND_TWENTY_AWARD_CEREMONY_UUID,
					name: '2020',
					hasErrors: true,
					errors: {},
					award: {
						model: 'AWARD',
						name: 'Laurence Olivier Awards',
						differentiator: '',
						errors: {}
					},
					categories: [
						{
							model: 'AWARD_CEREMONY_CATEGORY',
							name: 'Best Revival',
							errors: {},
							nominations: [
								{
									model: 'NOMINATION',
									isWinner: false,
									errors: {},
									entities: [],
									productions: [
										{
											model: 'PRODUCTION_IDENTIFIER',
											uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
											errors: {
												uuid: [
													'Production with this UUID does not exist'
												]
											}
										}
									],
									materials: []
								}
							]
						}
					]
				};

				expect(response).to.have.status(200);
				expect(response.body).to.deep.equal(expectedResponseBody);
				expect(await countNodesWithLabel('AwardCeremony')).to.equal(1);
				expect(await isNodeExistent({
					label: 'AwardCeremony',
					name: '2020',
					uuid: TWO_THOUSAND_AND_TWENTY_AWARD_CEREMONY_UUID
				})).to.be.true;

			});

		});

	});

});