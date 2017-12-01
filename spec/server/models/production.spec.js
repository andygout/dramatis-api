import { expect } from 'chai';
import proxyquire from 'proxyquire';
import sinon from 'sinon';

import Person from '../../../server/models/person';

import dbQueryFixture from '../../fixtures/db-query';

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
		dbQuery: sinon.stub().resolves(dbQueryFixture),
		prepareAsParams: sinon.stub().returns('prepareAsParams response'),
		verifyErrorPresence: sinon.stub().returns(false),
		Base: {
			trimStrings: sinon.stub(),
			validateString: sinon.stub().returns([])
		},
		Person: PersonStub,
		Playtext: PlaytextStub,
		Theatre: TheatreStub
	};

	instance = createInstance();

});

const createSubject = (stubOverrides = {}) =>
	proxyquire('../../../server/models/production', {
		'../database/db-query': stubs.dbQuery,
		'../lib/prepare-as-params': stubs.prepareAsParams,
		'../lib/verify-error-presence': stubOverrides.verifyErrorPresence || stubs.verifyErrorPresence,
		'./base': proxyquire('../../../server/models/base', {
			'../lib/trim-strings': stubs.Base.trimStrings,
			'../lib/validate-string': stubs.Base.validateString
		}),
		'./person': stubOverrides.Person || stubs.Person,
		'./playtext': stubs.Playtext,
		'./theatre': stubs.Theatre
	});

const createInstance = (stubOverrides = {}, props = { name: 'Hamlet', cast: [{ name: 'Patrick Stewart' }] }) => {

	const subject = createSubject(stubOverrides);

	return new subject(props);

};

describe('Production model', () => {

	describe('constructor method', () => {

		describe('cast property', () => {

			it('will assign as empty array if not included in props', () => {

				const props = { name: 'Hamlet' };
				instance = createInstance({}, props);
				expect(instance.cast).to.deep.eq([]);

			});

			it('will assign as array of cast if included in props, filtering out those with empty string names', () => {

				const PersonStubOverride = function () { return sinon.createStubInstance(Person); };
				const props = { name: 'Hamlet', cast: [{ name: 'Patrick Stewart' }, { name: '' }] };
				instance = createInstance({ Person: PersonStubOverride }, props);
				expect(instance.cast.length).to.eq(1);
				expect(instance.cast[0].constructor.name).to.eq('Person');

			});

		});

	});

	describe('setErrorStatus method', () => {

		it('will call instance validate method + associated models\' validate methods then verifyErrorPresence', () => {

			sinon.spy(instance, 'validate');
			instance.setErrorStatus();
			sinon.assert.callOrder(
				instance.validate.withArgs({ required: true }),
				instance.theatre.validate.withArgs({ required: true }),
				instance.playtext.validate.withArgs(),
				instance.cast[0].validate.withArgs(),
				instance.cast[0].roles[0].validate.withArgs(),
				stubs.verifyErrorPresence.withArgs(instance)
			);
			expect(instance.validate.calledOnce).to.be.true;
			expect(instance.theatre.validate.calledOnce).to.be.true;
			expect(instance.playtext.validate.calledOnce).to.be.true;
			expect(instance.cast[0].validate.calledOnce).to.be.true;
			expect(instance.cast[0].roles[0].validate.calledOnce).to.be.true;
			expect(stubs.verifyErrorPresence.calledOnce).to.be.true;

		});

		context('valid data', () => {

			it('will set instance hasError property to false and return same value', () => {

				expect(instance.setErrorStatus()).to.be.false;
				expect(instance.hasError).to.be.false;

			});

		});

		context('invalid data', () => {

			it('will set instance hasError property to true and return same value', () => {

				instance = createInstance({ verifyErrorPresence: sinon.stub().returns(true) });
				expect(instance.setErrorStatus()).to.be.true;
				expect(instance.hasError).to.be.true;

			});

		});

	});

	describe('createUpdate method', () => {

		context('valid data', () => {

			it('will create using provided function to get appropriate query', done => {

				const getCreateQueryStub = sinon.stub().returns('getCreateQuery response');
				sinon.spy(instance, 'setErrorStatus');
				instance.createUpdate(getCreateQueryStub).then(result => {
					sinon.assert.callOrder(
						instance.setErrorStatus.withArgs(),
						getCreateQueryStub.withArgs(),
						stubs.prepareAsParams.withArgs(instance),
						stubs.dbQuery.withArgs({ query: 'getCreateQuery response', params: 'prepareAsParams response' })
					);
					expect(instance.setErrorStatus.calledOnce).to.be.true;
					expect(getCreateQueryStub.calledOnce).to.be.true;
					expect(stubs.prepareAsParams.calledOnce).to.be.true;
					expect(stubs.dbQuery.calledOnce).to.be.true;
					expect(result).to.deep.eq(dbQueryFixture);
					done();
				});

			});

			it('will update using provided function to get appropriate query', done => {

				const getUpdateQueryStub = sinon.stub().returns('getUpdateQuery response');
				sinon.spy(instance, 'setErrorStatus');
				instance.createUpdate(getUpdateQueryStub).then(result => {
					sinon.assert.callOrder(
						instance.setErrorStatus.withArgs(),
						getUpdateQueryStub.withArgs(),
						stubs.prepareAsParams.withArgs(instance),
						stubs.dbQuery.withArgs({ query: 'getUpdateQuery response', params: 'prepareAsParams response' })
					);
					expect(instance.setErrorStatus.calledOnce).to.be.true;
					expect(getUpdateQueryStub.calledOnce).to.be.true;
					expect(stubs.prepareAsParams.calledOnce).to.be.true;
					expect(stubs.dbQuery.calledOnce).to.be.true;
					expect(result).to.deep.eq(dbQueryFixture);
					done();
				});

			});

		});

		context('invalid data', () => {

			it('will return instance without creating', done => {

				const getCreateUpdateQueryStub = sinon.stub();
				instance = createInstance({ verifyErrorPresence: sinon.stub().returns(true) });
				sinon.spy(instance, 'setErrorStatus');
				instance.createUpdate(getCreateUpdateQueryStub).then(result => {
					expect(instance.setErrorStatus.calledOnce).to.be.true;
					expect(instance.setErrorStatus.calledWithExactly()).to.be.true;
					expect(getCreateUpdateQueryStub.notCalled).to.be.true;
					expect(stubs.prepareAsParams.notCalled).to.be.true;
					expect(stubs.dbQuery.notCalled).to.be.true;
					expect(result).to.deep.eq({ instance });
					done();
				});

			});

		});

	});

});
