import { expect } from 'chai';
import proxyquire from 'proxyquire';
import sinon from 'sinon';

import dbQueryFixture from '../../fixtures/db-query';

let stubs;
let instance;

beforeEach(() => {

	stubs = {
		cypherQueriesShared: {
			getDeleteQuery: sinon.stub().returns('getDeleteQuery response')
		},
		cypherQueriesTheatre: {
			getValidateDeleteQuery: sinon.stub().returns('getValidateDeleteQuery response')
		},
		dbQuery: sinon.stub().resolves(dbQueryFixture),
		verifyErrorPresence: sinon.stub().returns(false)
	};

	instance = createInstance();

});

const createSubject = (stubOverrides = {}) =>
	proxyquire('../../../server/models/theatre', {
		'../database/cypher-queries/shared': stubs.cypherQueriesShared,
		'../database/cypher-queries/theatre': stubs.cypherQueriesTheatre,
		'../database/db-query': stubOverrides.dbQuery || stubs.dbQuery,
		'../lib/verify-error-presence': stubOverrides.verifyErrorPresence || stubs.verifyErrorPresence
	});

const createInstance = (stubOverrides = {}) => {

	const subject = createSubject(stubOverrides);

	return new subject({ uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx', name: 'Almeida Theatre' });

};

describe('Theatre model', () => {

	describe('validateDeleteInDb method', () => {

		it('will validate delete in database', done => {

			instance.validateDeleteInDb().then(() => {
				expect(stubs.cypherQueriesTheatre.getValidateDeleteQuery.calledOnce).to.be.true;
				expect(stubs.cypherQueriesTheatre.getValidateDeleteQuery.calledWithExactly()).to.be.true;
				expect(stubs.dbQuery.calledOnce).to.be.true;
				expect(stubs.dbQuery.calledWithExactly(
					{ query: 'getValidateDeleteQuery response', params: instance }
				)).to.be.true;
				done();
			});

		});

		context('valid data (results returned that indicate no dependent associations exist)', () => {

			it('will not add properties to errors property', done => {

				instance = createInstance({ dbQuery: sinon.stub().resolves({ relationshipCount: 0 }) });
				instance.validateDeleteInDb().then(() => {
					expect(instance.errors).not.to.have.property('associations');
					expect(instance.errors).to.deep.eq({});
					done();
				});

			});

		});

		context('invalid data (results returned that indicate dependent associations exist)', () => {

			it('will add properties that are arrays to errors property', done => {

				instance = createInstance({ dbQuery: sinon.stub().resolves({ relationshipCount: 1 }) });
				instance.validateDeleteInDb().then(() => {
					expect(instance.errors)
						.to.have.property('associations')
						.that.is.an('array')
						.that.deep.eq(['productions']);
					done();
				});

			});

		});

	});

	describe('delete method', () => {

		context('no dependent associations', () => {

			it('will delete', done => {

				sinon.spy(instance, 'validateDeleteInDb');
				instance.delete().then(result => {
					sinon.assert.callOrder(
						instance.validateDeleteInDb.withArgs(),
						stubs.cypherQueriesTheatre.getValidateDeleteQuery.withArgs(),
						stubs.dbQuery.withArgs({ query: 'getValidateDeleteQuery response', params: instance }),
						stubs.verifyErrorPresence.withArgs(instance),
						stubs.cypherQueriesShared.getDeleteQuery.withArgs(instance.model),
						stubs.dbQuery.withArgs({ query: 'getDeleteQuery response', params: instance })
					);
					expect(instance.validateDeleteInDb.calledOnce).to.be.true;
					expect(stubs.cypherQueriesTheatre.getValidateDeleteQuery.calledOnce).to.be.true;
					expect(stubs.dbQuery.calledTwice).to.be.true;
					expect(stubs.verifyErrorPresence.calledOnce).to.be.true;
					expect(stubs.cypherQueriesShared.getDeleteQuery.calledOnce).to.be.true;
					expect(result).to.deep.eq(dbQueryFixture);
					done();
				});

			});

		});

		context('dependent associations', () => {

			it('will return instance without deleting', done => {

				const verifyErrorPresenceStub = sinon.stub().returns(true);
				instance = createInstance({ verifyErrorPresence: verifyErrorPresenceStub });
				sinon.spy(instance, 'validateDeleteInDb');
				instance.delete().then(result => {
					sinon.assert.callOrder(
						instance.validateDeleteInDb.withArgs(),
						stubs.cypherQueriesTheatre.getValidateDeleteQuery.withArgs(),
						stubs.dbQuery.withArgs({ query: 'getValidateDeleteQuery response', params: instance }),
						verifyErrorPresenceStub.withArgs(instance)
					);
					expect(instance.validateDeleteInDb.calledOnce).to.be.true;
					expect(stubs.cypherQueriesTheatre.getValidateDeleteQuery.calledOnce).to.be.true;
					expect(stubs.dbQuery.calledOnce).to.be.true;
					expect(verifyErrorPresenceStub.calledOnce).to.be.true;
					expect(stubs.cypherQueriesShared.getDeleteQuery.notCalled).to.be.true;
					expect(result).to.deep.eq({ theatre: instance });
					done();
				});

			});

		});

	});

});
