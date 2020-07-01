import { expect } from 'chai';
import proxyquire from 'proxyquire';
import { assert, createStubInstance, spy, stub } from 'sinon';

import { Character } from '../../../src/models';
import neo4jQueryFixture from '../../fixtures/neo4j-query';

describe('Playtext model', () => {

	let stubs;
	let instance;

	const DEFAULT_INSTANCE_PROPS = {
		name: 'The Tragedy of Hamlet, Prince of Denmark',
		characters: [{ name: 'Hamlet' }]
	};

	const CharacterStub = function () {

		return createStubInstance(Character);

	};

	beforeEach(() => {

		stubs = {
			getDuplicateNameIndicesModule: {
				getDuplicateNameIndices: stub().returns([])
			},
			prepareAsParamsModule: {
				prepareAsParams: stub().returns('prepareAsParams response')
			},
			Base: {
				hasErrorsModule: {
					hasErrors: stub().returns(false)
				},
				validateStringModule: {
					validateString: stub().returns([])
				},
				cypherQueries: {
					sharedQueries: {
						getValidateQuery:
							stub().returns('getValidateQuery response')
					}
				},
				neo4jQueryModule: {
					neo4jQuery: stub().resolves(neo4jQueryFixture)
				}
			},
			models: {
				Character: CharacterStub
			},
			neo4jQueryModule: {
				neo4jQuery: stub().resolves(neo4jQueryFixture)
			}
		};

		instance = createInstance();

	});

	const createSubject = (stubOverrides = {}) =>
		proxyquire('../../../src/models/Playtext', {
			'../lib/get-duplicate-name-indices': stubs.getDuplicateNameIndicesModule,
			'../lib/prepare-as-params': stubs.prepareAsParamsModule,
			'../neo4j/query': stubs.neo4jQueryModule,
			'./Base': proxyquire('../../../src/models/Base', {
				'../lib/has-errors': stubOverrides.hasErrorsModule || stubs.Base.hasErrorsModule,
				'../lib/validate-string': stubs.Base.validateStringModule,
				'../neo4j/cypher-queries': stubs.Base.cypherQueries,
				'../neo4j/query': stubs.Base.neo4jQueryModule
			}),
			'.': stubs.models
		}).default;

	const createInstance = (stubOverrides = {}, props = DEFAULT_INSTANCE_PROPS) => {

		const Playtext = createSubject(stubOverrides);

		return new Playtext(props);

	};

	describe('constructor method', () => {

		describe('characters property', () => {

			it('assigns empty array if absent from props', () => {

				const props = { name: 'The Tragedy of Hamlet, Prince of Denmark' };
				const instance = createInstance({}, props);
				expect(instance.characters).to.deep.eq([]);

			});

			it('assigns array of characters if included in props, retaining those with empty or whitespace-only string names', () => {

				const props = {
					name: 'The Tragedy of Hamlet, Prince of Denmark',
					characters: [
						{ name: 'Hamlet' },
						{ name: '' },
						{ name: ' ' }
					]
				};
				const instance = createInstance({}, props);
				expect(instance.characters.length).to.eq(3);
				expect(instance.characters[0] instanceof Character).to.be.true;
				expect(instance.characters[1] instanceof Character).to.be.true;
				expect(instance.characters[2] instanceof Character).to.be.true;

			});

		});

	});

	describe('runValidations method', () => {

		it('calls instance validate method and associated models\' validate methods', () => {

			spy(instance, 'validate');
			instance.runValidations();
			assert.callOrder(
				instance.validate.withArgs({ requiresName: true }),
				stubs.getDuplicateNameIndicesModule.getDuplicateNameIndices.withArgs(instance.characters),
				instance.characters[0].validateGroupItem.withArgs({ hasDuplicateName: false })
			);
			expect(instance.validate.calledOnce).to.be.true;
			expect(stubs.getDuplicateNameIndicesModule.getDuplicateNameIndices.calledOnce).to.be.true;
			expect(instance.characters[0].validateGroupItem.calledOnce).to.be.true;

		});

	});

	describe('createUpdate method', () => {

		context('valid data', () => {

			it('creates using provided function to get appropriate query', async () => {

				const getCreateQueryStub = stub().returns('getCreateQuery response');
				spy(instance, 'runValidations');
				spy(instance, 'validateInDb');
				spy(instance, 'setErrorStatus');
				const result = await instance.createUpdate(getCreateQueryStub);
				assert.callOrder(
					instance.runValidations.withArgs(),
					instance.validateInDb.withArgs(),
					stubs.Base.cypherQueries.sharedQueries.getValidateQuery.withArgs(instance.model, instance.uuid),
					stubs.Base.neo4jQueryModule.neo4jQuery.withArgs({ query: 'getValidateQuery response', params: instance }),
					instance.setErrorStatus.withArgs(),
					stubs.Base.hasErrorsModule.hasErrors.withArgs(instance),
					getCreateQueryStub.withArgs(),
					stubs.prepareAsParamsModule.prepareAsParams.withArgs(instance),
					stubs.neo4jQueryModule.neo4jQuery
						.withArgs({ query: 'getCreateQuery response', params: 'prepareAsParams response' })
				);
				expect(instance.runValidations.calledOnce).to.be.true;
				expect(instance.validateInDb.calledOnce).to.be.true;
				expect(stubs.Base.cypherQueries.sharedQueries.getValidateQuery.calledOnce).to.be.true;
				expect(stubs.Base.neo4jQueryModule.neo4jQuery.calledOnce).to.be.true;
				expect(instance.setErrorStatus.calledOnce).to.be.true;
				expect(stubs.Base.hasErrorsModule.hasErrors.calledOnce).to.be.true;
				expect(getCreateQueryStub.calledOnce).to.be.true;
				expect(stubs.prepareAsParamsModule.prepareAsParams.calledOnce).to.be.true;
				expect(stubs.neo4jQueryModule.neo4jQuery.calledOnce).to.be.true;
				expect(result.constructor.name).to.eq('Playtext');

			});

			it('updates using provided function to get appropriate query', async () => {

				const getUpdateQueryStub = stub().returns('getUpdateQuery response');
				spy(instance, 'runValidations');
				spy(instance, 'validateInDb');
				spy(instance, 'setErrorStatus');
				const result = await instance.createUpdate(getUpdateQueryStub);
				assert.callOrder(
					instance.runValidations.withArgs(),
					instance.validateInDb.withArgs(),
					stubs.Base.cypherQueries.sharedQueries.getValidateQuery.withArgs(instance.model, instance.uuid),
					stubs.Base.neo4jQueryModule.neo4jQuery.withArgs({ query: 'getValidateQuery response', params: instance }),
					instance.setErrorStatus.withArgs(),
					stubs.Base.hasErrorsModule.hasErrors.withArgs(instance),
					getUpdateQueryStub.withArgs(),
					stubs.prepareAsParamsModule.prepareAsParams.withArgs(instance),
					stubs.neo4jQueryModule.neo4jQuery.withArgs(
						{ query: 'getUpdateQuery response', params: 'prepareAsParams response' }
					)
				);
				expect(instance.runValidations.calledOnce).to.be.true;
				expect(instance.validateInDb.calledOnce).to.be.true;
				expect(stubs.Base.cypherQueries.sharedQueries.getValidateQuery.calledOnce).to.be.true;
				expect(stubs.Base.neo4jQueryModule.neo4jQuery.calledOnce).to.be.true;
				expect(instance.setErrorStatus.calledOnce).to.be.true;
				expect(stubs.Base.hasErrorsModule.hasErrors.calledOnce).to.be.true;
				expect(getUpdateQueryStub.calledOnce).to.be.true;
				expect(stubs.prepareAsParamsModule.prepareAsParams.calledOnce).to.be.true;
				expect(stubs.neo4jQueryModule.neo4jQuery.calledOnce).to.be.true;
				expect(result.constructor.name).to.eq('Playtext');

			});

		});

		context('invalid data', () => {

			it('returns instance without creating', async () => {

				const hasErrorsModuleStub = { hasErrors: stub().returns(true) };
				const getCreateUpdateQueryStub = stub();
				const instance = createInstance({ hasErrorsModule: hasErrorsModuleStub });
				spy(instance, 'runValidations');
				spy(instance, 'validateInDb');
				spy(instance, 'setErrorStatus');
				const result = await instance.createUpdate(getCreateUpdateQueryStub);
				assert.callOrder(
					instance.runValidations.withArgs(),
					instance.validateInDb.withArgs(),
					stubs.Base.cypherQueries.sharedQueries.getValidateQuery.withArgs(instance.model, instance.uuid),
					stubs.Base.neo4jQueryModule.neo4jQuery.withArgs({ query: 'getValidateQuery response', params: instance }),
					instance.setErrorStatus.withArgs(),
					hasErrorsModuleStub.hasErrors.withArgs(instance)
				);
				expect(instance.runValidations.calledOnce).to.be.true;
				expect(instance.validateInDb.calledOnce).to.be.true;
				expect(stubs.Base.cypherQueries.sharedQueries.getValidateQuery.calledOnce).to.be.true;
				expect(stubs.Base.neo4jQueryModule.neo4jQuery.calledOnce).to.be.true;
				expect(instance.setErrorStatus.calledOnce).to.be.true;
				expect(hasErrorsModuleStub.hasErrors.calledOnce).to.be.true;
				expect(getCreateUpdateQueryStub.notCalled).to.be.true;
				expect(stubs.prepareAsParamsModule.prepareAsParams.notCalled).to.be.true;
				expect(stubs.neo4jQueryModule.neo4jQuery.notCalled).to.be.true;
				expect(result).to.deep.eq(instance);

			});

		});

	});

});
