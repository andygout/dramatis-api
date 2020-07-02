import { expect } from 'chai';
import proxyquire from 'proxyquire';
import { assert, createStubInstance, spy, stub } from 'sinon';

import { BasicModel, PersonCastMember, Theatre } from '../../../src/models';
import neo4jQueryFixture from '../../fixtures/neo4j-query';

describe('Production model', () => {

	let stubs;
	let instance;

	const BasicModelStub = function () {

		return createStubInstance(BasicModel);

	};

	const PersonCastMemberStub = function () {

		return createStubInstance(PersonCastMember);

	};

	const TheatreStub = function () {

		return createStubInstance(Theatre);

	};

	beforeEach(() => {

		stubs = {
			getDuplicateNameIndicesModule: {
				getDuplicateNameIndices: stub().returns([])
			},
			prepareAsParamsModule: {
				prepareAsParams: stub().returns('prepareAsParams response')
			},
			hasErrorsModule: {
				hasErrors: stub().returns(false)
			},
			Base: {
				hasErrorsModule: {
					hasErrors: stub().returns(false)
				},
				validateStringModule: {
					validateString: stub().returns([])
				},
				neo4jQueryModule: {
					neo4jQuery: stub().resolves(neo4jQueryFixture)
				}
			},
			models: {
				BasicModel: BasicModelStub,
				PersonCastMember: PersonCastMemberStub,
				Theatre: TheatreStub
			},
			neo4jQueryModule: {
				neo4jQuery: stub().resolves(neo4jQueryFixture)
			}
		};

		instance = createInstance();

	});

	const createSubject = () =>
		proxyquire('../../../src/models/Production', {
			'../lib/prepare-as-params': stubs.prepareAsParamsModule,
			'../lib/get-duplicate-name-indices': stubs.getDuplicateNameIndicesModule,
			'../neo4j/query': stubs.neo4jQueryModule,
			'./Base': proxyquire('../../../src/models/Base', {
				'../lib/has-errors': stubs.Base.hasErrorsModule,
				'../lib/validate-string': stubs.Base.validateStringModule,
				'../neo4j/query': stubs.Base.neo4jQueryModule
			}),
			'.': stubs.models
		}).default;

	const createInstance = (props = { name: 'Hamlet', cast: [{ name: 'Patrick Stewart' }] }) => {

		const Production = createSubject();

		return new Production(props);

	};

	describe('constructor method', () => {

		describe('cast property', () => {

			it('assigns empty array if absent from props', () => {

				const props = { name: 'Hamlet' };
				const instance = createInstance(props);
				expect(instance.cast).to.deep.eq([]);

			});

			it('assigns array of cast if included in props, retaining those with empty or whitespace-only string names', () => {

				const props = {
					name: 'Hamlet',
					cast: [
						{ name: 'Patrick Stewart' },
						{ name: '' },
						{ name: ' ' }
					]
				};
				const instance = createInstance(props);
				expect(instance.cast.length).to.eq(3);
				expect(instance.cast[0] instanceof PersonCastMember).to.be.true;
				expect(instance.cast[1] instanceof PersonCastMember).to.be.true;
				expect(instance.cast[2] instanceof PersonCastMember).to.be.true;

			});

		});

	});

	describe('runValidations method', () => {

		it('calls instance validate method and associated models\' validate methods', () => {

			spy(instance, 'validate');
			instance.runValidations();
			assert.callOrder(
				instance.validate.withArgs({ requiresName: true }),
				instance.theatre.validate.withArgs({ requiresName: true }),
				instance.playtext.validate.withArgs(),
				stubs.getDuplicateNameIndicesModule.getDuplicateNameIndices.withArgs(instance.cast),
				instance.cast[0].runValidations.withArgs()
			);
			expect(instance.validate.calledOnce).to.be.true;
			expect(instance.theatre.validate.calledOnce).to.be.true;
			expect(instance.playtext.validate.calledOnce).to.be.true;
			expect(stubs.getDuplicateNameIndicesModule.getDuplicateNameIndices.calledOnce).to.be.true;
			expect(instance.cast[0].runValidations.calledOnce).to.be.true;

		});

	});

	describe('createUpdate method', () => {

		context('valid data', () => {

			it('creates using provided function to get appropriate query', async () => {

				const getCreateQueryStub = stub().returns('getCreateQuery response');
				spy(instance, 'runValidations');
				spy(instance, 'setErrorStatus');
				const result = await instance.createUpdate(getCreateQueryStub);
				assert.callOrder(
					instance.runValidations.withArgs(),
					instance.setErrorStatus.withArgs(),
					stubs.Base.hasErrorsModule.hasErrors.withArgs(instance),
					getCreateQueryStub.withArgs(),
					stubs.prepareAsParamsModule.prepareAsParams.withArgs(instance),
					stubs.neo4jQueryModule.neo4jQuery.withArgs(
						{ query: 'getCreateQuery response', params: 'prepareAsParams response' }
					)
				);
				expect(instance.runValidations.calledOnce).to.be.true;
				expect(instance.setErrorStatus.calledOnce).to.be.true;
				expect(stubs.Base.hasErrorsModule.hasErrors.calledOnce).to.be.true;
				expect(getCreateQueryStub.calledOnce).to.be.true;
				expect(stubs.prepareAsParamsModule.prepareAsParams.calledOnce).to.be.true;
				expect(stubs.neo4jQueryModule.neo4jQuery.calledOnce).to.be.true;
				expect(result.constructor.name).to.eq('Production');

			});

			it('updates using provided function to get appropriate query', async () => {

				const getUpdateQueryStub = stub().returns('getUpdateQuery response');
				spy(instance, 'runValidations');
				spy(instance, 'setErrorStatus');
				const result = await instance.createUpdate(getUpdateQueryStub);
				assert.callOrder(
					instance.runValidations.withArgs(),
					instance.setErrorStatus.withArgs(),
					stubs.Base.hasErrorsModule.hasErrors.withArgs(instance),
					getUpdateQueryStub.withArgs(),
					stubs.prepareAsParamsModule.prepareAsParams.withArgs(instance),
					stubs.neo4jQueryModule.neo4jQuery.withArgs(
						{ query: 'getUpdateQuery response', params: 'prepareAsParams response' }
					)
				);
				expect(instance.runValidations.calledOnce).to.be.true;
				expect(instance.setErrorStatus.calledOnce).to.be.true;
				expect(stubs.Base.hasErrorsModule.hasErrors.calledOnce).to.be.true;
				expect(getUpdateQueryStub.calledOnce).to.be.true;
				expect(stubs.prepareAsParamsModule.prepareAsParams.calledOnce).to.be.true;
				expect(stubs.neo4jQueryModule.neo4jQuery.calledOnce).to.be.true;
				expect(result.constructor.name).to.eq('Production');

			});

		});

		context('invalid data', () => {

			it('returns instance without creating', async () => {

				stubs.Base.hasErrorsModule.hasErrors.returns(true);
				const getCreateUpdateQueryStub = stub();
				spy(instance, 'runValidations');
				spy(instance, 'setErrorStatus');
				const result = await instance.createUpdate(getCreateUpdateQueryStub);
				assert.callOrder(
					instance.runValidations.withArgs(),
					instance.setErrorStatus.withArgs(),
					stubs.Base.hasErrorsModule.hasErrors.withArgs(instance)
				);
				expect(instance.runValidations.calledOnce).to.be.true;
				expect(instance.setErrorStatus.calledOnce).to.be.true;
				expect(stubs.Base.hasErrorsModule.hasErrors.calledOnce).to.be.true;
				expect(getCreateUpdateQueryStub.notCalled).to.be.true;
				expect(stubs.prepareAsParamsModule.prepareAsParams.notCalled).to.be.true;
				expect(stubs.neo4jQueryModule.neo4jQuery.notCalled).to.be.true;
				expect(result).to.deep.eq(instance);

			});

		});

	});

});
