import { expect } from 'chai';
import proxyquire from 'proxyquire';
import sinon from 'sinon';

import Person from '../../../server/models/person';
import neo4jQueryFixture from '../../fixtures/neo4j-query';

describe('Production model', () => {

	let stubs;
	let instance;

	const RoleStub = function () {

		this.validate = sinon.stub();

	};

	const PersonStub = function () {

		this.roles = [new RoleStub];
		this.validate = sinon.stub();

	};

	const PlaytextStub = function () {

		this.validate = sinon.stub();

	};

	const TheatreStub = function () {

		this.validate = sinon.stub();

	};

	beforeEach(() => {

		stubs = {
			prepareAsParamsModule: {
				prepareAsParams: sinon.stub().returns('prepareAsParams response')
			},
			verifyErrorPresenceModule: {
				verifyErrorPresence: sinon.stub().returns(false)
			},
			Base: {
				validateStringModule: {
					validateString: sinon.stub().returns([])
				}
			},
			Person: PersonStub,
			Playtext: PlaytextStub,
			Theatre: TheatreStub,
			neo4jQueryModule: {
				neo4jQuery: sinon.stub().resolves(neo4jQueryFixture)
			}
		};

		instance = createInstance();

	});

	const createSubject = (stubOverrides = {}) =>
		proxyquire('../../../server/models/production', {
			'../lib/prepare-as-params': stubs.prepareAsParamsModule,
			'../lib/verify-error-presence': stubOverrides.verifyErrorPresenceModule || stubs.verifyErrorPresenceModule,
			'../neo4j/query': stubs.neo4jQueryModule,
			'./base': proxyquire('../../../server/models/base', {
				'../lib/validate-string': stubs.Base.validateStringModule
			}),
			'./person': stubOverrides.Person || stubs.Person,
			'./playtext': stubs.Playtext,
			'./theatre': stubs.Theatre
		});

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

			it('assigns array of cast if included in props, filtering out those with empty or whitespace-only string names', () => {

				const PersonStubOverride = function () { return sinon.createStubInstance(Person); };
				const props = {
					name: 'Hamlet',
					cast: [
						{ name: 'Patrick Stewart' },
						{ name: '' },
						{ name: ' ' }
					]
				};
				const instance = createInstance({ Person: PersonStubOverride }, props);
				expect(instance.cast.length).to.eq(1);
				expect(instance.cast[0].constructor.name).to.eq('Person');

			});

		});

	});

	describe('setErrorStatus method', () => {

		it('calls instance validate method and associated models\' validate methods then verifyErrorPresence', () => {

			sinon.spy(instance, 'validate');
			instance.setErrorStatus();
			sinon.assert.callOrder(
				instance.validate.withArgs({ required: true }),
				instance.theatre.validate.withArgs({ required: true }),
				instance.playtext.validate.withArgs(),
				instance.cast[0].validate.withArgs(),
				instance.cast[0].roles[0].validate.withArgs(),
				stubs.verifyErrorPresenceModule.verifyErrorPresence.withArgs(instance)
			);
			expect(instance.validate.calledOnce).to.be.true;
			expect(instance.theatre.validate.calledOnce).to.be.true;
			expect(instance.playtext.validate.calledOnce).to.be.true;
			expect(instance.cast[0].validate.calledOnce).to.be.true;
			expect(instance.cast[0].roles[0].validate.calledOnce).to.be.true;
			expect(stubs.verifyErrorPresenceModule.verifyErrorPresence.calledOnce).to.be.true;

		});

		context('valid data', () => {

			it('sets instance hasError property to false and returns same value', () => {

				expect(instance.setErrorStatus()).to.be.false;
				expect(instance.hasError).to.be.false;

			});

		});

		context('invalid data', () => {

			it('sets instance hasError property to true and returns same value', () => {

				const instance = createInstance(
					{
						verifyErrorPresenceModule: {
							verifyErrorPresence: sinon.stub().returns(true)
						}
					}
				);
				expect(instance.setErrorStatus()).to.be.true;
				expect(instance.hasError).to.be.true;

			});

		});

	});

	describe('createUpdate method', () => {

		context('valid data', () => {

			it('creates using provided function to get appropriate query', async () => {

				const getCreateQueryStub = sinon.stub().returns('getCreateQuery response');
				sinon.spy(instance, 'setErrorStatus');
				const result = await instance.createUpdate(getCreateQueryStub);
				sinon.assert.callOrder(
					instance.setErrorStatus.withArgs(),
					getCreateQueryStub.withArgs(),
					stubs.prepareAsParamsModule.prepareAsParams.withArgs(instance),
					stubs.neo4jQueryModule.neo4jQuery.withArgs(
						{ query: 'getCreateQuery response', params: 'prepareAsParams response' }
					)
				);
				expect(instance.setErrorStatus.calledOnce).to.be.true;
				expect(getCreateQueryStub.calledOnce).to.be.true;
				expect(stubs.prepareAsParamsModule.prepareAsParams.calledOnce).to.be.true;
				expect(stubs.neo4jQueryModule.neo4jQuery.calledOnce).to.be.true;
				expect(result).to.deep.eq(neo4jQueryFixture);

			});

			it('updates using provided function to get appropriate query', async () => {

				const getUpdateQueryStub = sinon.stub().returns('getUpdateQuery response');
				sinon.spy(instance, 'setErrorStatus');
				const result = await instance.createUpdate(getUpdateQueryStub);
				sinon.assert.callOrder(
					instance.setErrorStatus.withArgs(),
					getUpdateQueryStub.withArgs(),
					stubs.prepareAsParamsModule.prepareAsParams.withArgs(instance),
					stubs.neo4jQueryModule.neo4jQuery.withArgs(
						{ query: 'getUpdateQuery response', params: 'prepareAsParams response' }
					)
				);
				expect(instance.setErrorStatus.calledOnce).to.be.true;
				expect(getUpdateQueryStub.calledOnce).to.be.true;
				expect(stubs.prepareAsParamsModule.prepareAsParams.calledOnce).to.be.true;
				expect(stubs.neo4jQueryModule.neo4jQuery.calledOnce).to.be.true;
				expect(result).to.deep.eq(neo4jQueryFixture);

			});

		});

		context('invalid data', () => {

			it('returns instance without creating', async () => {

				const getCreateUpdateQueryStub = sinon.stub();
				const instance = createInstance(
					{
						verifyErrorPresenceModule: {
							verifyErrorPresence: sinon.stub().returns(true)
						}
					}
				);
				sinon.spy(instance, 'setErrorStatus');
				const result = await instance.createUpdate(getCreateUpdateQueryStub);
				expect(instance.setErrorStatus.calledOnce).to.be.true;
				expect(instance.setErrorStatus.calledWithExactly()).to.be.true;
				expect(getCreateUpdateQueryStub.notCalled).to.be.true;
				expect(stubs.prepareAsParamsModule.prepareAsParams.notCalled).to.be.true;
				expect(stubs.neo4jQueryModule.neo4jQuery.notCalled).to.be.true;
				expect(result).to.deep.eq(instance);

			});

		});

	});

});
