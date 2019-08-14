import { expect } from 'chai';
import proxyquire from 'proxyquire';
import sinon from 'sinon';

import neo4jQueryFixture from '../../fixtures/neo4j-query';

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
		neo4jQuery: sinon.stub().resolves(neo4jQueryFixture),
		verifyErrorPresence: sinon.stub().returns(false)
	};

	instance = createInstance();

});

const createSubject = (stubOverrides = {}) =>
	proxyquire('../../../server/models/theatre', {
		'../clients/neo4j': stubOverrides.neo4jQuery || stubs.neo4jQuery,
		'../database/cypher-queries/shared': stubs.cypherQueriesShared,
		'../database/cypher-queries/theatre': stubs.cypherQueriesTheatre,
		'../lib/verify-error-presence': stubOverrides.verifyErrorPresence || stubs.verifyErrorPresence
	});

const createInstance = (stubOverrides = {}) => {

	const subject = createSubject(stubOverrides);

	return new subject({ uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx', name: 'Almeida Theatre' });

};

describe('Theatre model', () => {

	describe('validateDeleteInDb method', () => {

		it('will validate delete in database', async () => {

			await instance.validateDeleteInDb();
			expect(stubs.cypherQueriesTheatre.getValidateDeleteQuery.calledOnce).to.be.true;
			expect(stubs.cypherQueriesTheatre.getValidateDeleteQuery.calledWithExactly()).to.be.true;
			expect(stubs.neo4jQuery.calledOnce).to.be.true;
			expect(stubs.neo4jQuery.calledWithExactly(
				{ query: 'getValidateDeleteQuery response', params: instance }
			)).to.be.true;

		});

		context('valid data (results returned that indicate no dependent associations exist)', () => {

			it('will not add properties to errors property', async () => {

				instance = createInstance({ neo4jQuery: sinon.stub().resolves({ relationshipCount: 0 }) });
				await instance.validateDeleteInDb();
				expect(instance.errors).not.to.have.property('associations');
				expect(instance.errors).to.deep.eq({});

			});

		});

		context('invalid data (results returned that indicate dependent associations exist)', () => {

			it('will add properties that are arrays to errors property', async () => {

				instance = createInstance({ neo4jQuery: sinon.stub().resolves({ relationshipCount: 1 }) });
				await instance.validateDeleteInDb();
				expect(instance.errors)
					.to.have.property('associations')
					.that.is.an('array')
					.that.deep.eq(['productions']);

			});

		});

	});

	describe('delete method', () => {

		context('no dependent associations', () => {

			it('will delete', async () => {

				sinon.spy(instance, 'validateDeleteInDb');
				const result = await instance.delete();
				sinon.assert.callOrder(
					instance.validateDeleteInDb.withArgs(),
					stubs.cypherQueriesTheatre.getValidateDeleteQuery.withArgs(),
					stubs.neo4jQuery.withArgs({ query: 'getValidateDeleteQuery response', params: instance }),
					stubs.verifyErrorPresence.withArgs(instance),
					stubs.cypherQueriesShared.getDeleteQuery.withArgs(instance.model),
					stubs.neo4jQuery.withArgs({ query: 'getDeleteQuery response', params: instance })
				);
				expect(instance.validateDeleteInDb.calledOnce).to.be.true;
				expect(stubs.cypherQueriesTheatre.getValidateDeleteQuery.calledOnce).to.be.true;
				expect(stubs.neo4jQuery.calledTwice).to.be.true;
				expect(stubs.verifyErrorPresence.calledOnce).to.be.true;
				expect(stubs.cypherQueriesShared.getDeleteQuery.calledOnce).to.be.true;
				expect(result).to.deep.eq(neo4jQueryFixture);

			});

		});

		context('dependent associations', () => {

			it('will return instance without deleting', async () => {

				const verifyErrorPresenceStub = sinon.stub().returns(true);
				instance = createInstance({ verifyErrorPresence: verifyErrorPresenceStub });
				sinon.spy(instance, 'validateDeleteInDb');
				const result = await instance.delete();
				sinon.assert.callOrder(
					instance.validateDeleteInDb.withArgs(),
					stubs.cypherQueriesTheatre.getValidateDeleteQuery.withArgs(),
					stubs.neo4jQuery.withArgs({ query: 'getValidateDeleteQuery response', params: instance }),
					verifyErrorPresenceStub.withArgs(instance)
				);
				expect(instance.validateDeleteInDb.calledOnce).to.be.true;
				expect(stubs.cypherQueriesTheatre.getValidateDeleteQuery.calledOnce).to.be.true;
				expect(stubs.neo4jQuery.calledOnce).to.be.true;
				expect(verifyErrorPresenceStub.calledOnce).to.be.true;
				expect(stubs.cypherQueriesShared.getDeleteQuery.notCalled).to.be.true;
				expect(result).to.deep.eq({ theatre: instance });

			});

		});

	});

});
