import { expect } from 'chai';
import proxyquire from 'proxyquire';
import sinon from 'sinon';

import Character from '../../../server/models/character';
import neo4jQueryFixture from '../../fixtures/neo4j-query';

describe('Playtext model', () => {

	let stubs;
	let instance;

	const CharacterStub = function () {

		this.validate = sinon.stub();

	};

	beforeEach(() => {

		stubs = {
			prepareAsParamsModule: {
				prepareAsParams: sinon.stub().returns('prepareAsParams response')
			},
			Base: {
				hasErrorsModule: {
					hasErrors: sinon.stub().returns(false)
				},
				validateStringModule: {
					validateString: sinon.stub().returns([])
				},
				cypherQueriesShared: {
					getValidateQuery: sinon.stub().returns('getValidateQuery response')
				},
				neo4jQueryModule: {
					neo4jQuery: sinon.stub().resolves(neo4jQueryFixture)
				}
			},
			Character: CharacterStub,
			neo4jQueryModule: {
				neo4jQuery: sinon.stub().resolves(neo4jQueryFixture)
			}
		};

		instance = createInstance();

	});

	const createSubject = (stubOverrides = {}) =>
		proxyquire('../../../server/models/playtext', {
			'../lib/prepare-as-params': stubs.prepareAsParamsModule,
			'../neo4j/query': stubs.neo4jQueryModule,
			'./base': proxyquire('../../../server/models/base', {
				'../lib/has-errors': stubOverrides.hasErrorsModule || stubs.Base.hasErrorsModule,
				'../lib/validate-string': stubs.Base.validateStringModule,
				'../neo4j/cypher-queries/shared': stubs.Base.cypherQueriesShared,
				'../neo4j/query': stubs.Base.neo4jQueryModule
			}),
			'./character': stubOverrides.Character || stubs.Character
		});

	const createInstance = (stubOverrides = {}, props = { name: 'Hamlet', characters: [{ name: 'Hamlet' }] }) => {

		const Playtext = createSubject(stubOverrides);

		return new Playtext(props);

	};

	describe('constructor method', () => {

		describe('characters property', () => {

			it('assigns empty array if absent from props', () => {

				const props = { name: 'Hamlet' };
				const instance = createInstance({}, props);
				expect(instance.characters).to.deep.eq([]);

			});

			it('assigns array of characters if included in props, retaining those with empty or whitespace-only string names', () => {

				const CharacterStubOverride = function () { return sinon.createStubInstance(Character); };
				const props = {
					name: 'Hamlet',
					characters: [
						{ name: 'Hamlet' },
						{ name: '' },
						{ name: ' ' }
					]
				};
				const instance = createInstance({ Character: CharacterStubOverride }, props);
				expect(instance.characters.length).to.eq(3);
				expect(instance.characters[0].constructor.name).to.eq('Character');
				expect(instance.characters[1].constructor.name).to.eq('Character');
				expect(instance.characters[2].constructor.name).to.eq('Character');

			});

		});

	});

	describe('runValidations method', () => {

		it('calls instance validate method and associated models\' validate methods', () => {

			sinon.spy(instance, 'validate');
			instance.runValidations();
			sinon.assert.callOrder(
				instance.validate.withArgs({ requiresName: true }),
				instance.characters[0].validate.withArgs()
			);
			expect(instance.validate.calledOnce).to.be.true;
			expect(instance.characters[0].validate.calledOnce).to.be.true;

		});

	});

	describe('createUpdate method', () => {

		context('valid data', () => {

			it('creates using provided function to get appropriate query', async () => {

				const getCreateQueryStub = sinon.stub().returns('getCreateQuery response');
				sinon.spy(instance, 'runValidations');
				sinon.spy(instance, 'setErrorStatus');
				sinon.spy(instance, 'validateInDb');
				const result = await instance.createUpdate(getCreateQueryStub);
				sinon.assert.callOrder(
					instance.runValidations.withArgs(),
					instance.setErrorStatus.withArgs(),
					instance.validateInDb.withArgs(),
					stubs.Base.hasErrorsModule.hasErrors.withArgs(instance),
					getCreateQueryStub.withArgs(),
					stubs.prepareAsParamsModule.prepareAsParams.withArgs(instance),
					stubs.neo4jQueryModule.neo4jQuery
						.withArgs({ query: 'getCreateQuery response', params: 'prepareAsParams response' })
				);
				expect(instance.runValidations.calledOnce).to.be.true;
				expect(instance.setErrorStatus.calledTwice).to.be.true;
				expect(stubs.Base.hasErrorsModule.hasErrors.calledTwice).to.be.true;
				expect(instance.validateInDb.calledOnce).to.be.true;
				expect(getCreateQueryStub.calledOnce).to.be.true;
				expect(stubs.prepareAsParamsModule.prepareAsParams.calledOnce).to.be.true;
				expect(stubs.neo4jQueryModule.neo4jQuery.calledOnce).to.be.true;
				expect(result.constructor.name).to.eq('Playtext');

			});

			it('updates using provided function to get appropriate query', async () => {

				const getUpdateQueryStub = sinon.stub().returns('getUpdateQuery response');
				sinon.spy(instance, 'runValidations');
				sinon.spy(instance, 'setErrorStatus');
				sinon.spy(instance, 'validateInDb');
				const result = await instance.createUpdate(getUpdateQueryStub);
				sinon.assert.callOrder(
					instance.runValidations.withArgs(),
					instance.setErrorStatus.withArgs(),
					instance.validateInDb.withArgs(),
					stubs.Base.hasErrorsModule.hasErrors.withArgs(instance),
					getUpdateQueryStub.withArgs(),
					stubs.prepareAsParamsModule.prepareAsParams.withArgs(instance),
					stubs.neo4jQueryModule.neo4jQuery.withArgs(
						{ query: 'getUpdateQuery response', params: 'prepareAsParams response' }
					)
				);
				expect(instance.runValidations.calledOnce).to.be.true;
				expect(instance.setErrorStatus.calledTwice).to.be.true;
				expect(stubs.Base.hasErrorsModule.hasErrors.calledTwice).to.be.true;
				expect(instance.validateInDb.calledOnce).to.be.true;
				expect(getUpdateQueryStub.calledOnce).to.be.true;
				expect(stubs.prepareAsParamsModule.prepareAsParams.calledOnce).to.be.true;
				expect(stubs.neo4jQueryModule.neo4jQuery.calledOnce).to.be.true;
				expect(result.constructor.name).to.eq('Playtext');

			});

		});

		context('invalid data', () => {

			context('initial validation errors caused by submitted values', () => {

				it('returns instance without creating', async () => {

					const hasErrorsModuleStub = { hasErrors: sinon.stub().returns(true) };
					const getCreateUpdateQueryStub = sinon.stub();
					const instance = createInstance({ hasErrorsModule: hasErrorsModuleStub });
					sinon.spy(instance, 'runValidations');
					sinon.spy(instance, 'setErrorStatus');
					sinon.spy(instance, 'validateInDb');
					const result = await instance.createUpdate(getCreateUpdateQueryStub);
					expect(instance.runValidations.calledOnce).to.be.true;
					expect(instance.setErrorStatus.calledOnce).to.be.true;
					expect(hasErrorsModuleStub.hasErrors.calledOnce).to.be.true;
					expect(instance.validateInDb.notCalled).to.be.true;
					expect(getCreateUpdateQueryStub.notCalled).to.be.true;
					expect(stubs.prepareAsParamsModule.prepareAsParams.notCalled).to.be.true;
					expect(stubs.neo4jQueryModule.neo4jQuery.notCalled).to.be.true;
					expect(result).to.deep.eq(instance);

				});

			});

			context('secondary validation errors caused by database checks', () => {

				it('returns instance without creating', async () => {

					const hasErrorsModuleStub = { hasErrors: sinon.stub() };
					hasErrorsModuleStub.hasErrors
						.onFirstCall().returns(false)
						.onSecondCall().returns(true);
					const getCreateUpdateQueryStub = sinon.stub();
					const instance = createInstance({ hasErrorsModule: hasErrorsModuleStub });
					sinon.spy(instance, 'runValidations');
					sinon.spy(instance, 'setErrorStatus');
					sinon.spy(instance, 'validateInDb');
					const result = await instance.createUpdate(getCreateUpdateQueryStub);
					sinon.assert.callOrder(
						instance.setErrorStatus.withArgs(),
						instance.validateInDb.withArgs(),
						hasErrorsModuleStub.hasErrors.withArgs(instance)
					);
					expect(instance.runValidations.calledOnce).to.be.true;
					expect(instance.setErrorStatus.calledTwice).to.be.true;
					expect(hasErrorsModuleStub.hasErrors.calledTwice).to.be.true;
					expect(instance.validateInDb.calledOnce).to.be.true;
					expect(getCreateUpdateQueryStub.notCalled).to.be.true;
					expect(stubs.prepareAsParamsModule.prepareAsParams.notCalled).to.be.true;
					expect(stubs.neo4jQueryModule.neo4jQuery.notCalled).to.be.true;
					expect(result).to.deep.eq(instance);

				});

			});

		});

	});

});
