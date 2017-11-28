import { expect } from 'chai';
import proxyquire from 'proxyquire';
import sinon from 'sinon';

import Character from '../../../server/models/character';

import dbQueryFixture from '../../fixtures/db-query';

let stubs;
let instance;

const CharacterStub = function () {

	this.validate = sinon.stub();

};

beforeEach(() => {

	stubs = {
		cypherQueriesPlaytext: {
			getCreateQuery: sinon.stub().returns('getCreateQuery response'),
			getEditQuery: sinon.stub().returns('getEditQuery response'),
			getUpdateQuery: sinon.stub().returns('getUpdateQuery response'),
			getShowQuery: sinon.stub().returns('getShowQuery response')
		},
		cypherQueriesShared: {
			getValidateQuery: sinon.stub().returns('getValidateQuery response'),
			getDeleteQuery: sinon.stub().returns('getDeleteQuery response'),
			getListQuery: sinon.stub().returns('getListQuery response')
		},
		dbQuery: sinon.stub().resolves(dbQueryFixture),
		prepareAsParams: sinon.stub().returns('prepareAsParams response'),
		trimStrings: sinon.stub(),
		validateString: sinon.stub().returns([]),
		verifyErrorPresence: sinon.stub().returns(false),
		Character: CharacterStub
	};

	instance = createInstance();

});

const createSubject = (stubOverrides = {}) =>
	proxyquire('../../../server/models/playtext', {
		'../database/cypher-queries/playtext': stubs.cypherQueriesPlaytext,
		'../database/cypher-queries/shared': stubs.cypherQueriesShared,
		'../database/db-query': stubOverrides.dbQuery || stubs.dbQuery,
		'../lib/prepare-as-params': stubs.prepareAsParams,
		'../lib/trim-strings': stubs.trimStrings,
		'../lib/validate-string': stubOverrides.validateString || stubs.validateString,
		'../lib/verify-error-presence': stubOverrides.verifyErrorPresence || stubs.verifyErrorPresence,
		'./character': stubOverrides.Character || stubs.Character
	});

const createInstance = (stubOverrides = {}, props = { name: 'Hamlet', characters: [{ name: 'Hamlet' }] }) => {

	const subject = createSubject(stubOverrides);

	return new subject(props);

};

describe('Playtext model', () => {

	describe('constructor method', () => {

		describe('characters property', () => {

			it('will assign as empty array if not included in props', () => {

				const props = { name: 'Hamlet' };
				instance = createInstance({}, props);
				expect(instance.characters).to.deep.eq([]);

			});

			it('will assign as array of characters if included in props, filtering out those with empty string names', () => {

				const CharacterStubOverride = function () { return sinon.createStubInstance(Character); };
				const props = { name: 'Hamlet', characters: [{ name: 'Hamlet' }, { name: '' }] };
				instance = createInstance({ Character: CharacterStubOverride }, props);
				expect(instance.characters.length).to.eq(1);
				expect(instance.characters[0].constructor.name).to.eq('Character');

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

	describe('validateInDb method', () => {

		it('will validate update in database', done => {

			instance.validateInDb().then(() => {
				expect(stubs.cypherQueriesShared.getValidateQuery.calledOnce).to.be.true;
				expect(stubs.cypherQueriesShared.getValidateQuery.calledWithExactly(instance.model)).to.be.true;
				expect(stubs.dbQuery.calledOnce).to.be.true;
				expect(stubs.dbQuery.calledWithExactly(
					{ query: 'getValidateQuery response', params: instance }
				)).to.be.true;
				done();
			});

		});

		context('valid data (results returned that indicate name does not already exist)', () => {

			it('will not add properties to errors property', done => {

				instance = createInstance({ dbQuery: sinon.stub().resolves({ instanceCount: 0 }) });
				instance.validateInDb().then(() => {
					expect(instance.errors).not.to.have.property('name');
					expect(instance.errors).to.deep.eq({});
					done();
				});

			});

		});

		context('invalid data (results returned that indicate name already exists)', () => {

			it('will add properties that are arrays to errors property', done => {

				instance = createInstance({ dbQuery: sinon.stub().resolves({ instanceCount: 1 }) });
				instance.validateInDb().then(() => {
					expect(instance.errors)
						.to.have.property('name')
						.that.is.an('array')
						.that.deep.eq(['Name already exists']);
					done();
				});

			});

		});

	});

	describe('setErrorStatus method', () => {

		it('will call instance validate method + associated models\' validate methods then verifyErrorPresence', () => {

			sinon.spy(instance, 'validate');
			instance.setErrorStatus();
			sinon.assert.callOrder(
				instance.validate.withArgs({ required: true }),
				instance.characters[0].validate.withArgs(),
				stubs.verifyErrorPresence.withArgs(instance)
			);
			expect(instance.validate.calledOnce).to.be.true;
			expect(instance.characters[0].validate.calledOnce).to.be.true;
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

			it('will create', done => {

				sinon.spy(instance, 'setErrorStatus');
				sinon.spy(instance, 'validateInDb');
				instance.createUpdate(stubs.cypherQueriesPlaytext.getCreateQuery).then(result => {
					sinon.assert.callOrder(
						instance.setErrorStatus.withArgs(),
						instance.validateInDb.withArgs(),
						stubs.verifyErrorPresence.withArgs(instance),
						stubs.cypherQueriesPlaytext.getCreateQuery.withArgs(),
						stubs.prepareAsParams.withArgs(instance),
						stubs.dbQuery.withArgs({ query: 'getCreateQuery response', params: 'prepareAsParams response' })
					);
					expect(instance.setErrorStatus.calledOnce).to.be.true;
					expect(instance.validateInDb.calledOnce).to.be.true;
					expect(stubs.verifyErrorPresence.calledTwice).to.be.true;
					expect(stubs.cypherQueriesPlaytext.getCreateQuery.calledOnce).to.be.true;
					expect(stubs.prepareAsParams.calledOnce).to.be.true;
					expect(stubs.dbQuery.calledTwice).to.be.true;
					expect(result).to.deep.eq(dbQueryFixture);
					done();
				});

			});

			it('will update', done => {

				sinon.spy(instance, 'setErrorStatus');
				sinon.spy(instance, 'validateInDb');
				instance.createUpdate(stubs.cypherQueriesPlaytext.getUpdateQuery).then(result => {
					sinon.assert.callOrder(
						instance.setErrorStatus.withArgs(),
						instance.validateInDb.withArgs(),
						stubs.verifyErrorPresence.withArgs(instance),
						stubs.cypherQueriesPlaytext.getUpdateQuery.withArgs(),
						stubs.prepareAsParams.withArgs(instance),
						stubs.dbQuery.withArgs({ query: 'getUpdateQuery response', params: 'prepareAsParams response' })
					);
					expect(instance.setErrorStatus.calledOnce).to.be.true;
					expect(instance.validateInDb.calledOnce).to.be.true;
					expect(stubs.verifyErrorPresence.calledTwice).to.be.true;
					expect(stubs.cypherQueriesPlaytext.getUpdateQuery.calledOnce).to.be.true;
					expect(stubs.prepareAsParams.calledOnce).to.be.true;
					expect(stubs.dbQuery.calledTwice).to.be.true;
					expect(result).to.deep.eq(dbQueryFixture);
					done();
				});

			});

		});

		context('invalid data', () => {

			context('initial validation errors caused by submitted values', () => {

				it('will return instance without creating', done => {

					const verifyErrorPresenceStub = sinon.stub().returns(true);
					const getCreateUpdateQueryStub = sinon.stub();
					instance = createInstance({ verifyErrorPresence: verifyErrorPresenceStub });
					sinon.spy(instance, 'setErrorStatus');
					sinon.spy(instance, 'validateInDb');
					instance.createUpdate(getCreateUpdateQueryStub).then(result => {
						expect(instance.setErrorStatus.calledOnce).to.be.true;
						expect(verifyErrorPresenceStub.calledOnce).to.be.true;
						expect(instance.validateInDb.notCalled).to.be.true;
						expect(getCreateUpdateQueryStub.notCalled).to.be.true;
						expect(stubs.prepareAsParams.notCalled).to.be.true;
						expect(stubs.dbQuery.notCalled).to.be.true;
						expect(result).to.deep.eq({ playtext: instance });
						done();
					});

				});

			});

			context('secondary validation errors caused by database checks', () => {

				it('will return instance without creating', done => {

					const verifyErrorPresenceStub = sinon.stub();
					verifyErrorPresenceStub.onFirstCall().returns(false).onSecondCall().returns(true);
					const getCreateUpdateQueryStub = sinon.stub();
					instance = createInstance({ verifyErrorPresence: verifyErrorPresenceStub });
					sinon.spy(instance, 'setErrorStatus');
					sinon.spy(instance, 'validateInDb');
					instance.createUpdate(getCreateUpdateQueryStub).then(result => {
						sinon.assert.callOrder(
							instance.setErrorStatus.withArgs(),
							instance.validateInDb.withArgs(),
							verifyErrorPresenceStub.withArgs(instance)
						);
						expect(instance.setErrorStatus.calledOnce).to.be.true;
						expect(instance.validateInDb.calledOnce).to.be.true;
						expect(verifyErrorPresenceStub.calledTwice).to.be.true;
						expect(getCreateUpdateQueryStub.notCalled).to.be.true;
						expect(stubs.prepareAsParams.notCalled).to.be.true;
						expect(stubs.dbQuery.calledOnce).to.be.true;
						expect(result).to.deep.eq({ playtext: instance });
						done();
					});

				});

			});

		});

	});

	describe('create method', () => {

		it('will call createUpdate method', done => {

			sinon.spy(instance, 'createUpdate');
			instance.create(stubs.cypherQueriesPlaytext.getCreateQuery).then(() => {
				expect(instance.createUpdate.calledOnce).to.be.true;
				expect(instance.createUpdate.calledWithExactly(stubs.cypherQueriesPlaytext.getCreateQuery)).to.be.true;
				done();
			});

		});

	});

	describe('edit method', () => {

		it('will get edit data', done => {

			instance.edit().then(result => {
				expect(stubs.cypherQueriesPlaytext.getEditQuery.calledOnce).to.be.true;
				expect(stubs.cypherQueriesPlaytext.getEditQuery.calledWithExactly()).to.be.true;
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

		it('will call createUpdate method', done => {

			sinon.spy(instance, 'createUpdate');
			instance.update(stubs.cypherQueriesPlaytext.getUpdateQuery).then(() => {
				expect(instance.createUpdate.calledOnce).to.be.true;
				expect(instance.createUpdate.calledWithExactly(stubs.cypherQueriesPlaytext.getUpdateQuery)).to.be.true;
				done();
			});

		});

	});

	describe('delete method', () => {

		it('will delete', done => {

			instance.delete().then(result => {
				expect(stubs.cypherQueriesShared.getDeleteQuery.calledOnce).to.be.true;
				expect(stubs.cypherQueriesShared.getDeleteQuery.calledWithExactly(instance.model)).to.be.true;
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
				expect(stubs.cypherQueriesPlaytext.getShowQuery.calledOnce).to.be.true;
				expect(stubs.cypherQueriesPlaytext.getShowQuery.calledWithExactly()).to.be.true;
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
				expect(stubs.cypherQueriesShared.getListQuery.calledWithExactly('playtext')).to.be.true;
				expect(stubs.dbQuery.calledOnce).to.be.true;
				expect(stubs.dbQuery.calledWithExactly({ query: 'getListQuery response' })).to.be.true;
				expect(result).to.deep.eq(dbQueryFixture);
				done();
			});

		});

	});

});
