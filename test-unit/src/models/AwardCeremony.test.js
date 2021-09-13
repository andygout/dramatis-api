import { expect } from 'chai';
import proxyquire from 'proxyquire';
import { assert, createStubInstance, spy, stub } from 'sinon';

import { Award, AwardCeremonyCategory } from '../../../src/models';

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
				getAwardContextualDuplicateRecordCountQuery: stub()
					.returns('getAwardContextualDuplicateRecordCountQuery response')
			},
			neo4jQueryModule: {
				neo4jQuery: stub().resolves({ neo4jQueryMockResponseProperty: 'neo4jQueryMockResponseValue' })
			}
		};

	});

	const createSubject = () =>
		proxyquire('../../../src/models/AwardCeremony', {
			'../lib/prepare-as-params': stubs.prepareAsParamsModule,
			'.': stubs.models,
			'../neo4j/cypher-queries': stubs.cypherQueriesModule,
			'../neo4j/query': stubs.neo4jQueryModule
		}).default;

	const createInstance = props => {

		const AwardCeremony = createSubject();

		return new AwardCeremony(props);

	};

	describe('constructor method', () => {

		describe('categories property', () => {

			it('assigns array of category instances, retaining those with empty or whitespace-only string names', () => {

				const props = {
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
				};
				const instance = createInstance(props);
				expect(instance.categories.length).to.equal(3);
				expect(instance.categories[0] instanceof AwardCeremonyCategory).to.be.true;
				expect(instance.categories[1] instanceof AwardCeremonyCategory).to.be.true;
				expect(instance.categories[2] instanceof AwardCeremonyCategory).to.be.true;

			});

		});

	});

	describe('runInputValidations method', () => {

		it('calls instance validate method and associated models\' validate methods', () => {

			const instance = createInstance();
			spy(instance, 'validateName');
			instance.runInputValidations();
			assert.callOrder(
				instance.validateName,
				instance.award.validateName,
				instance.award.validateDifferentiator
			);
			expect(instance.validateName.calledOnce).to.be.true;
			expect(instance.validateName.calledWithExactly({ isRequired: true })).to.be.true;
			expect(instance.award.validateName.calledOnce).to.be.true;
			expect(instance.award.validateName.calledWithExactly({ isRequired: false })).to.be.true;
			expect(instance.award.validateDifferentiator.calledOnce).to.be.true;
			expect(instance.award.validateDifferentiator.calledWithExactly()).to.be.true;

		});

	});

	describe('runDatabaseValidations method', () => {

		it('calls instance validate method and associated models\' validate methods', async () => {

			const instance = createInstance();
			spy(instance, 'validateAwardContextualUniquenessInDatabase');
			await instance.runDatabaseValidations();
			expect(instance.validateAwardContextualUniquenessInDatabase.calledOnce).to.be.true;
			expect(instance.validateAwardContextualUniquenessInDatabase.calledWithExactly()).to.be.true;

		});

	});

	describe('validateAwardContextualUniquenessInDatabase method', () => {

		context('valid data (results returned that indicate name does not already exist for given award)', () => {

			it('will not call addPropertyError method', async () => {

				const instance = createInstance();
				stubs.neo4jQueryModule.neo4jQuery.resolves({ duplicateRecordCount: 0 });
				spy(instance, 'addPropertyError');
				await instance.validateAwardContextualUniquenessInDatabase();
				assert.callOrder(
					stubs.prepareAsParamsModule.prepareAsParams,
					stubs.cypherQueriesModule.getAwardContextualDuplicateRecordCountQuery,
					stubs.neo4jQueryModule.neo4jQuery
				);
				expect(stubs.prepareAsParamsModule.prepareAsParams.calledOnce).to.be.true;
				expect(stubs.prepareAsParamsModule.prepareAsParams.calledWithExactly(instance)).to.be.true;
				expect(stubs.cypherQueriesModule.getAwardContextualDuplicateRecordCountQuery.calledOnce).to.be.true;
				expect(stubs.cypherQueriesModule.getAwardContextualDuplicateRecordCountQuery.calledWithExactly())
					.to.be.true;
				expect(stubs.neo4jQueryModule.neo4jQuery.calledOnce).to.be.true;
				expect(stubs.neo4jQueryModule.neo4jQuery.calledWithExactly(
					{
						query: 'getAwardContextualDuplicateRecordCountQuery response',
						params: {
							uuid: 'UUID_VALUE',
							name: 'NAME_VALUE',
							award: {
								name: 'AWARD_UUID_VALUE',
								differentiator: 'AWARD_DIFFERENTIATOR_VALUE'
							}
						}
					}
				)).to.be.true;
				expect(instance.addPropertyError.notCalled).to.be.true;
				expect(instance.award.addPropertyError.notCalled).to.be.true;

			});

		});

		context('invalid data (results returned that indicate name already exists  for given award)', () => {

			it('will call addPropertyError method', async () => {

				const instance = createInstance();
				stubs.neo4jQueryModule.neo4jQuery.resolves({ duplicateRecordCount: 1 });
				spy(instance, 'addPropertyError');
				await instance.validateAwardContextualUniquenessInDatabase();
				assert.callOrder(
					stubs.prepareAsParamsModule.prepareAsParams,
					stubs.cypherQueriesModule.getAwardContextualDuplicateRecordCountQuery,
					stubs.neo4jQueryModule.neo4jQuery,
					instance.addPropertyError
				);
				expect(stubs.prepareAsParamsModule.prepareAsParams.calledOnce).to.be.true;
				expect(stubs.prepareAsParamsModule.prepareAsParams.calledWithExactly(instance)).to.be.true;
				expect(stubs.cypherQueriesModule.getAwardContextualDuplicateRecordCountQuery.calledOnce).to.be.true;
				expect(stubs.cypherQueriesModule.getAwardContextualDuplicateRecordCountQuery.calledWithExactly())
					.to.be.true;
				expect(stubs.neo4jQueryModule.neo4jQuery.calledOnce).to.be.true;
				expect(stubs.neo4jQueryModule.neo4jQuery.calledWithExactly(
					{
						query: 'getAwardContextualDuplicateRecordCountQuery response',
						params: {
							uuid: 'UUID_VALUE',
							name: 'NAME_VALUE',
							award: {
								name: 'AWARD_UUID_VALUE',
								differentiator: 'AWARD_DIFFERENTIATOR_VALUE'
							}
						}
					}
				)).to.be.true;
				expect(instance.addPropertyError.calledOnce).to.be.true;
				expect(instance.addPropertyError.calledWithExactly(
					'name', 'Award ceremony already exists for given award'
				)).to.be.true;
				expect(instance.award.addPropertyError.calledTwice).to.be.true;
				expect(instance.award.addPropertyError.firstCall.calledWithExactly(
					'name', 'Award ceremony already exists for given award'
				)).to.be.true;
				expect(instance.award.addPropertyError.secondCall.calledWithExactly(
					'differentiator', 'Award ceremony already exists for given award'
				)).to.be.true;

			});

		});

	});

});
