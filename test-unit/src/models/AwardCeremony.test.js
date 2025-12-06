import { expect } from 'chai';
import esmock from 'esmock';
import { assert, createStubInstance, spy, stub } from 'sinon';

import { Award, AwardCeremonyCategory } from '../../../src/models/index.js';

describe('AwardCeremony model', () => {

	let stubs;

	const AwardStub = function () {

		return createStubInstance(Award);

	};

	const AwardCeremonyCategoryStub = function () {

		return createStubInstance(AwardCeremonyCategory);

	};

	beforeEach(() => {

		stubs = {
			getDuplicateIndicesModule: {
				getDuplicateBaseInstanceIndices: stub().returns([])
			},
			prepareAsParamsModule: {
				prepareAsParams: stub().returns({
					uuid: 'UUID_VALUE',
					name: 'NAME_VALUE',
					award: {
						name: 'AWARD_UUID_VALUE',
						differentiator: 'AWARD_DIFFERENTIATOR_VALUE'
					}
				})
			},
			models: {
				Award: AwardStub,
				AwardCeremonyCategory: AwardCeremonyCategoryStub
			},
			cypherQueriesModule: {
				validationQueries: {
					getAwardContextualDuplicateRecordCheckQuery: stub()
						.returns('getAwardContextualDuplicateRecordCheckQuery response')
				}
			},
			neo4jQueryModule: {
				neo4jQuery: stub().resolves({ neo4jQueryMockResponseProperty: 'neo4jQueryMockResponseValue' })
			}
		};

	});

	const createSubject = () =>
		esmock(
			'../../../src/models/AwardCeremony.js',
			{},
			// globalmocks: mock definitions imported everywhere.
			// Required for when functions are invoked by ancestor class methods.
			{
				'../../../src/lib/get-duplicate-indices.js': stubs.getDuplicateIndicesModule,
				'../../../src/lib/prepare-as-params.js': stubs.prepareAsParamsModule,
				'../../../src/models/index.js': stubs.models,
				'../../../src/neo4j/cypher-queries/index.js': stubs.cypherQueriesModule,
				'../../../src/neo4j/query.js': stubs.neo4jQueryModule
			}
		);

	describe('constructor method', () => {

		describe('award property', () => {

			it('assigns instance if absent from props', async () => {

				const AwardCeremony = await createSubject();

				const instance = new AwardCeremony({ name: '2020' });

				expect(instance.award instanceof Award).to.be.true;

			});

			it('assigns instance if included in props', async () => {

				const AwardCeremony = await createSubject();

				const instance = new AwardCeremony({
					name: '2020',
					award: {
						name: 'Laurence Olivier Awards'
					}
				});

				expect(instance.award instanceof Award).to.be.true;

			});

		});

		describe('categories property', () => {

			it('assigns empty array if absent from props', async () => {

				const AwardCeremony = await createSubject();

				const instance = new AwardCeremony({ name: '2020' });

				expect(instance.categories).to.deep.equal([]);

			});

			it('assigns array of category instances, retaining those with empty or whitespace-only string names', async () => {

				const AwardCeremony = await createSubject();

				const instance = new AwardCeremony({
					name: '2020',
					categories: [
						{
							name: 'Best New Play'
						},
						{
							name: ''
						},
						{
							name: ' '
						}
					]
				});

				expect(instance.categories.length).to.equal(3);
				expect(instance.categories[0] instanceof AwardCeremonyCategory).to.be.true;
				expect(instance.categories[1] instanceof AwardCeremonyCategory).to.be.true;
				expect(instance.categories[2] instanceof AwardCeremonyCategory).to.be.true;

			});

		});

	});

	describe('runInputValidations method', () => {

		it('calls instance\'s validate methods and associated models\' validate methods', async () => {

			const AwardCeremony = await createSubject();

			const instance = new AwardCeremony({
				name: '2020',
				categories: [
					{
						name: 'Best New Play'
					}
				]
			});

			spy(instance, 'validateName');

			instance.runInputValidations();

			assert.callOrder(
				instance.validateName,
				instance.award.validateName,
				instance.award.validateDifferentiator,
				stubs.getDuplicateIndicesModule.getDuplicateBaseInstanceIndices,
				instance.categories[0].runInputValidations
			);
			assert.calledOnceWithExactly(instance.validateName, { isRequired: true });
			assert.calledOnceWithExactly(instance.award.validateName, { isRequired: false });
			assert.calledOnceWithExactly(instance.award.validateDifferentiator);
			assert.calledOnceWithExactly(
				stubs.getDuplicateIndicesModule.getDuplicateBaseInstanceIndices,
				instance.categories
			);
			assert.calledOnceWithExactly(instance.categories[0].runInputValidations, { isDuplicate: false });

		});

	});

	describe('runDatabaseValidations method', () => {

		it('calls instance\'s validateAwardContextualUniquenessInDatabase method and associated categories\' runDatabaseValidations method', async () => {

			const AwardCeremony = await createSubject();

			const instance = new AwardCeremony({
				name: '2020',
				categories: [
					{
						name: 'Best New Play'
					}
				]
			});

			spy(instance, 'validateAwardContextualUniquenessInDatabase');

			await instance.runDatabaseValidations();

			assert.calledOnceWithExactly(instance.validateAwardContextualUniquenessInDatabase);
			assert.calledOnceWithExactly(instance.categories[0].runDatabaseValidations);

		});

	});

	describe('validateAwardContextualUniquenessInDatabase method', () => {

		context('valid data (results returned that indicate name does not already exist for given award)', () => {

			it('will not call addPropertyError method', async () => {

				const AwardCeremony = await createSubject();

				const instance = new AwardCeremony();

				stubs.neo4jQueryModule.neo4jQuery.resolves({ isDuplicateRecord: false });

				spy(instance, 'addPropertyError');

				await instance.validateAwardContextualUniquenessInDatabase();

				assert.callOrder(
					stubs.prepareAsParamsModule.prepareAsParams,
					stubs.cypherQueriesModule.validationQueries.getAwardContextualDuplicateRecordCheckQuery,
					stubs.neo4jQueryModule.neo4jQuery
				);
				assert.calledOnceWithExactly(stubs.prepareAsParamsModule.prepareAsParams, instance);
				assert.calledOnceWithExactly(
					stubs.cypherQueriesModule.validationQueries.getAwardContextualDuplicateRecordCheckQuery
				);
				assert.calledOnceWithExactly(
					stubs.neo4jQueryModule.neo4jQuery,
					{
						query: 'getAwardContextualDuplicateRecordCheckQuery response',
						params: {
							uuid: 'UUID_VALUE',
							name: 'NAME_VALUE',
							award: {
								name: 'AWARD_UUID_VALUE',
								differentiator: 'AWARD_DIFFERENTIATOR_VALUE'
							}
						}
					}
				);
				assert.notCalled(instance.addPropertyError);
				assert.notCalled(instance.award.addPropertyError);

			});

		});

		context('invalid data (results returned that indicate name already exists  for given award)', () => {

			it('will call addPropertyError method', async () => {

				const AwardCeremony = await createSubject();

				const instance = new AwardCeremony();

				stubs.neo4jQueryModule.neo4jQuery.resolves({ isDuplicateRecord: true });

				spy(instance, 'addPropertyError');

				await instance.validateAwardContextualUniquenessInDatabase();

				assert.callOrder(
					stubs.prepareAsParamsModule.prepareAsParams,
					stubs.cypherQueriesModule.validationQueries.getAwardContextualDuplicateRecordCheckQuery,
					stubs.neo4jQueryModule.neo4jQuery,
					instance.addPropertyError
				);
				assert.calledOnceWithExactly(stubs.prepareAsParamsModule.prepareAsParams, instance);
				assert.calledOnceWithExactly(
					stubs.cypherQueriesModule.validationQueries.getAwardContextualDuplicateRecordCheckQuery
				);
				assert.calledOnceWithExactly(
					stubs.neo4jQueryModule.neo4jQuery,
					{
						query: 'getAwardContextualDuplicateRecordCheckQuery response',
						params: {
							uuid: 'UUID_VALUE',
							name: 'NAME_VALUE',
							award: {
								name: 'AWARD_UUID_VALUE',
								differentiator: 'AWARD_DIFFERENTIATOR_VALUE'
							}
						}
					}
				);
				assert.calledOnceWithExactly(
					instance.addPropertyError,
					'name', 'Award ceremony already exists for given award'
				);
				assert.calledTwice(instance.award.addPropertyError);
				assert.calledWithExactly(
					instance.award.addPropertyError.firstCall,
					'name', 'Award ceremony already exists for given award'
				);
				assert.calledWithExactly(
					instance.award.addPropertyError.secondCall,
					'differentiator', 'Award ceremony already exists for given award'
				);

			});

		});

	});

});
