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
		dbQuery: sinon.stub().resolves(dbQueryFixture)
	};

	instance = createInstance();

});

const createSubject = () =>
	proxyquire('../../../server/models/character', {
		'../database/cypher-queries/shared': stubs.cypherQueriesShared,
		'../database/db-query': stubs.dbQuery
	});

const createInstance = () => {

	const subject = createSubject();

	return new subject({ name: 'Hamlet' });

};

describe('Character model', () => {

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

});
