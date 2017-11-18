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
		cypherQueriesProduction: {
			getCreateQuery: sinon.stub().returns('getCreateQuery response'),
			getEditQuery: sinon.stub().returns('getEditQuery response'),
			getUpdateQuery: sinon.stub().returns('getUpdateQuery response'),
			getDeleteQuery: sinon.stub().returns('getDeleteQuery response'),
			getShowQuery: sinon.stub().returns('getShowQuery response')
		},
		cypherQueriesShared: {
			getListQuery: sinon.stub().returns('getListQuery response')
		},
		prepareAsParams: sinon.stub().returns('prepareAsParams response'),
		trimStrings: sinon.stub(),
		validateString: sinon.stub().returns([]),
		verifyErrorPresence: sinon.stub().returns(false),
		Person: PersonStub,
		Playtext: PlaytextStub,
		Theatre: TheatreStub
	};

	instance = createInstance();

});

const createSubject = (stubOverrides = {}) =>
	proxyquire('../../../server/models/production', {
		'../database/cypher-queries/production': stubs.cypherQueriesProduction,
		'../database/cypher-queries/shared': stubs.cypherQueriesShared,
		'../database/db-query': stubs.dbQuery,
		'../lib/prepare-as-params': stubs.prepareAsParams,
		'../lib/trim-strings': stubs.trimStrings,
		'../lib/validate-string': stubOverrides.validateString || stubs.validateString,
		'../lib/verify-error-presence': stubOverrides.verifyErrorPresence || stubs.verifyErrorPresence,
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

	describe('validate method', () => {

		it('will trim strings before validating name', () => {

			instance.validate();
			expect(stubs.trimStrings.calledBefore(stubs.validateString)).to.be.true;
			expect(stubs.trimStrings.calledOnce).to.be.true;
			expect(stubs.trimStrings.calledWithExactly(instance)).to.be.true;
			expect(stubs.validateString.calledOnce).to.be.true;
			expect(stubs.validateString.calledWithExactly(instance.name, {})).to.be.true;

		});

		context('valid data', () => {

			it('will not add properties to errors property', () => {

				instance.validate();
				expect(instance.errors).not.to.have.property('name');
				expect(instance.errors).to.deep.eq({});

			});

		});

		context('invalid data', () => {

			it('will add properties that are arrays to errors property', () => {

				instance = createInstance({ validateString: sinon.stub().returns(['Name is too short']) });
				instance.validate();
				expect(instance.errors)
					.to.have.property('name')
					.that.is.an('array')
					.that.deep.eq(['Name is too short']);

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

	describe('create method', () => {

		context('valid data', () => {

			it('will create', done => {

				sinon.spy(instance, 'setErrorStatus');
				instance.create().then(result => {
					sinon.assert.callOrder(
						instance.setErrorStatus.withArgs(),
						stubs.cypherQueriesProduction.getCreateQuery.withArgs(),
						stubs.prepareAsParams.withArgs(instance),
						stubs.dbQuery.withArgs({ query: 'getCreateQuery response', params: 'prepareAsParams response' })
					);
					expect(instance.setErrorStatus.calledOnce).to.be.true;
					expect(stubs.cypherQueriesProduction.getCreateQuery.calledOnce).to.be.true;
					expect(stubs.prepareAsParams.calledOnce).to.be.true;
					expect(stubs.dbQuery.calledOnce).to.be.true;
					expect(result).to.deep.eq(dbQueryFixture);
					done();
				});

			});

		});

		context('invalid data', () => {

			it('will return instance without creating', done => {

				instance = createInstance({ verifyErrorPresence: sinon.stub().returns(true) });
				sinon.spy(instance, 'setErrorStatus');
				instance.create().then(result => {
					expect(instance.setErrorStatus.calledOnce).to.be.true;
					expect(instance.setErrorStatus.calledWithExactly()).to.be.true;
					expect(stubs.cypherQueriesProduction.getCreateQuery.notCalled).to.be.true;
					expect(stubs.prepareAsParams.notCalled).to.be.true;
					expect(stubs.dbQuery.notCalled).to.be.true;
					expect(result).to.deep.eq({ production: instance });
					done();
				});

			});

		});

	});

	describe('edit method', () => {

		it('will get edit data', done => {

			instance.edit().then(result => {
				expect(stubs.cypherQueriesProduction.getEditQuery.calledOnce).to.be.true;
				expect(stubs.cypherQueriesProduction.getEditQuery.calledWithExactly()).to.be.true;
				expect(stubs.dbQuery.calledOnce).to.be.true;
				expect(stubs.dbQuery.calledWithExactly(
					{ query: 'getEditQuery response', params: instance }
				)).to.be.true;
				expect(result).to.deep.eq(dbQueryFixture);
				done();
			});

		});

	});

	describe('update method', () => {

		context('valid data', () => {

			it('will update', done => {

				sinon.spy(instance, 'setErrorStatus');
				instance.update().then(result => {
					sinon.assert.callOrder(
						instance.setErrorStatus.withArgs(),
						stubs.cypherQueriesProduction.getUpdateQuery.withArgs(),
						stubs.prepareAsParams.withArgs(instance),
						stubs.dbQuery.withArgs({ query: 'getUpdateQuery response', params: 'prepareAsParams response' })
					);
					expect(instance.setErrorStatus.calledOnce).to.be.true;
					expect(stubs.cypherQueriesProduction.getUpdateQuery.calledOnce).to.be.true;
					expect(stubs.prepareAsParams.calledOnce).to.be.true;
					expect(stubs.dbQuery.calledOnce).to.be.true;
					expect(result).to.deep.eq(dbQueryFixture);
					done();
				});

			});

		});

		context('invalid data', () => {

			it('will return instance without updating', done => {

				instance = createInstance({ verifyErrorPresence: sinon.stub().returns(true) });
				sinon.spy(instance, 'setErrorStatus');
				instance.update().then(result => {
					expect(instance.setErrorStatus.calledOnce).to.be.true;
					expect(instance.setErrorStatus.calledWithExactly()).to.be.true;
					expect(stubs.cypherQueriesProduction.getUpdateQuery.notCalled).to.be.true;
					expect(stubs.prepareAsParams.notCalled).to.be.true;
					expect(stubs.dbQuery.notCalled).to.be.true;
					expect(result).to.deep.eq({ production: instance });
					done();
				});

			});

		});

	});

	describe('delete method', () => {

		it('will delete', done => {

			instance.delete().then(result => {
				expect(stubs.cypherQueriesProduction.getDeleteQuery.calledOnce).to.be.true;
				expect(stubs.cypherQueriesProduction.getDeleteQuery.calledWithExactly()).to.be.true;
				expect(stubs.dbQuery.calledOnce).to.be.true;
				expect(stubs.dbQuery.calledWithExactly(
					{ query: 'getDeleteQuery response', params: instance }
				)).to.be.true;
				expect(result).to.deep.eq(dbQueryFixture);
				done();
			});

		});

	});

	describe('show method', () => {

		it('will get show data', done => {

			instance.show().then(result => {
				expect(stubs.cypherQueriesProduction.getShowQuery.calledOnce).to.be.true;
				expect(stubs.cypherQueriesProduction.getShowQuery.calledWithExactly()).to.be.true;
				expect(stubs.dbQuery.calledOnce).to.be.true;
				expect(stubs.dbQuery.calledWithExactly(
					{ query: 'getShowQuery response', params: instance }
				)).to.be.true;
				expect(result).to.deep.eq(dbQueryFixture);
				done();
			});

		});

	});

	describe('list method', () => {

		it('will get list data', done => {

			const subject = createSubject();
			subject.list().then(result => {
				expect(stubs.cypherQueriesShared.getListQuery.calledOnce).to.be.true;
				expect(stubs.cypherQueriesShared.getListQuery.calledWithExactly('production')).to.be.true;
				expect(stubs.dbQuery.calledOnce).to.be.true;
				expect(stubs.dbQuery.calledWithExactly({ query: 'getListQuery response' })).to.be.true;
				expect(result).to.deep.eq(dbQueryFixture);
				done();
			});

		});

	});

});
