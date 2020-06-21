import { expect } from 'chai';
import proxyquire from 'proxyquire';
import sinon from 'sinon';

import { BasicModel, PersonCastMember, Theatre } from '../../../src/models';
import neo4jQueryFixture from '../../fixtures/neo4j-query';

describe('Production model', () => {

	let stubs;
	let instance;

	const BasicModelStub = function () {

		return sinon.createStubInstance(BasicModel);

	};

	const PersonCastMemberStub = function () {

		return sinon.createStubInstance(PersonCastMember);

	};

	const TheatreStub = function () {

		return sinon.createStubInstance(Theatre);

	};

	beforeEach(() => {

		stubs = {
			getDuplicateNameIndicesModule: {
				getDuplicateNameIndices: sinon.stub().returns([])
			},
			prepareAsParamsModule: {
				prepareAsParams: sinon.stub().returns('prepareAsParams response')
			},
			hasErrorsModule: {
				hasErrors: sinon.stub().returns(false)
			},
			Base: {
				hasErrorsModule: {
					hasErrors: sinon.stub().returns(false)
				},
				validateStringModule: {
					validateString: sinon.stub().returns([])
				},
				neo4jQueryModule: {
					neo4jQuery: sinon.stub().resolves(neo4jQueryFixture)
				}
			},
			models: {
				BasicModel: BasicModelStub,
				PersonCastMember: PersonCastMemberStub,
				Theatre: TheatreStub
			},
			neo4jQueryModule: {
				neo4jQuery: sinon.stub().resolves(neo4jQueryFixture)
			}
		};

		instance = createInstance();

	});

	const createSubject = (stubOverrides = {}) =>
		proxyquire('../../../src/models/Production', {
			'../lib/prepare-as-params': stubs.prepareAsParamsModule,
			'../lib/get-duplicate-name-indices': stubs.getDuplicateNameIndicesModule,
			'../neo4j/query': stubs.neo4jQueryModule,
			'./Base': proxyquire('../../../src/models/Base', {
				'../lib/has-errors': stubOverrides.hasErrorsModule || stubs.Base.hasErrorsModule,
				'../lib/validate-string': stubs.Base.validateStringModule,
				'../neo4j/query': stubs.Base.neo4jQueryModule
			}),
			'.': stubs.models
		}).default;

	const createInstance = (stubOverrides = {}, props = { name: 'Hamlet', cast: [{ name: 'Patrick Stewart' }] }) => {

		const Production = createSubject(stubOverrides);

		return new Production(props);

	};

	describe('constructor method', () => {

		describe('cast property', () => {

			it('assigns empty array if absent from props', () => {

				const props = { name: 'Hamlet' };
				const instance = createInstance({}, props);
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
				const instance = createInstance({}, props);
				expect(instance.cast.length).to.eq(3);
				expect(instance.cast[0] instanceof PersonCastMember).to.be.true;
				expect(instance.cast[1] instanceof PersonCastMember).to.be.true;
				expect(instance.cast[2] instanceof PersonCastMember).to.be.true;

			});

		});

	});

	describe('runValidations method', () => {

		it('calls instance validate method and associated models\' validate methods', () => {

			sinon.spy(instance, 'validate');
			instance.runValidations();
			sinon.assert.callOrder(
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

				const getCreateQueryStub = sinon.stub().returns('getCreateQuery response');
				sinon.spy(instance, 'runValidations');
				sinon.spy(instance, 'setErrorStatus');
				const result = await instance.createUpdate(getCreateQueryStub);
				sinon.assert.callOrder(
					instance.runValidations.withArgs(),
					instance.setErrorStatus.withArgs(),
					getCreateQueryStub.withArgs(),
					stubs.prepareAsParamsModule.prepareAsParams.withArgs(instance),
					stubs.neo4jQueryModule.neo4jQuery.withArgs(
						{ query: 'getCreateQuery response', params: 'prepareAsParams response' }
					)
				);
				expect(instance.runValidations.calledOnce).to.be.true;
				expect(instance.setErrorStatus.calledOnce).to.be.true;
				expect(getCreateQueryStub.calledOnce).to.be.true;
				expect(stubs.prepareAsParamsModule.prepareAsParams.calledOnce).to.be.true;
				expect(stubs.neo4jQueryModule.neo4jQuery.calledOnce).to.be.true;
				expect(result.constructor.name).to.eq('Production');

			});

			it('updates using provided function to get appropriate query', async () => {

				const getUpdateQueryStub = sinon.stub().returns('getUpdateQuery response');
				sinon.spy(instance, 'runValidations');
				sinon.spy(instance, 'setErrorStatus');
				const result = await instance.createUpdate(getUpdateQueryStub);
				sinon.assert.callOrder(
					instance.runValidations.withArgs(),
					instance.setErrorStatus.withArgs(),
					getUpdateQueryStub.withArgs(),
					stubs.prepareAsParamsModule.prepareAsParams.withArgs(instance),
					stubs.neo4jQueryModule.neo4jQuery.withArgs(
						{ query: 'getUpdateQuery response', params: 'prepareAsParams response' }
					)
				);
				expect(instance.runValidations.calledOnce).to.be.true;
				expect(instance.setErrorStatus.calledOnce).to.be.true;
				expect(getUpdateQueryStub.calledOnce).to.be.true;
				expect(stubs.prepareAsParamsModule.prepareAsParams.calledOnce).to.be.true;
				expect(stubs.neo4jQueryModule.neo4jQuery.calledOnce).to.be.true;
				expect(result.constructor.name).to.eq('Production');

			});

		});

		context('invalid data', () => {

			it('returns instance without creating', async () => {

				const getCreateUpdateQueryStub = sinon.stub();
				const instance = createInstance(
					{
						hasErrorsModule: {
							hasErrors: sinon.stub().returns(true)
						}
					}
				);
				sinon.spy(instance, 'runValidations');
				sinon.spy(instance, 'setErrorStatus');
				const result = await instance.createUpdate(getCreateUpdateQueryStub);
				expect(instance.runValidations.calledOnce).to.be.true;
				expect(instance.setErrorStatus.calledOnce).to.be.true;
				expect(getCreateUpdateQueryStub.notCalled).to.be.true;
				expect(stubs.prepareAsParamsModule.prepareAsParams.notCalled).to.be.true;
				expect(stubs.neo4jQueryModule.neo4jQuery.notCalled).to.be.true;
				expect(result).to.deep.eq(instance);

			});

		});

	});

});
