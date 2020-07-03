import { expect } from 'chai';
import { assert, createSandbox, spy } from 'sinon';

import * as hasErrorsModule from '../../../src/lib/has-errors';
import Theatre from '../../../src/models/Theatre';
import * as cypherQueries from '../../../src/neo4j/cypher-queries';
import * as neo4jQueryModule from '../../../src/neo4j/query';
import neo4jQueryFixture from '../../fixtures/neo4j-query';

describe('Theatre model', () => {

	let stubs;
	let instance;

	const sandbox = createSandbox();

	beforeEach(() => {

		stubs = {
			hasErrors: sandbox.stub(hasErrorsModule, 'hasErrors').returns(false),
			getValidateDeleteRequestQueries: {
				theatre:
					sandbox.stub(cypherQueries.getValidateDeleteRequestQueries, 'theatre')
						.returns('getValidateDeleteRequestQuery response')
			},
			sharedQueries: {
				getDeleteQuery:
					sandbox.stub(cypherQueries.sharedQueries, 'getDeleteQuery').returns('getDeleteQuery response')
			},
			neo4jQuery: sandbox.stub(neo4jQueryModule, 'neo4jQuery').resolves(neo4jQueryFixture)
		};

		instance = new Theatre({ uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx', name: 'Almeida Theatre' });

	});

	afterEach(() => {

		sandbox.restore();

	});

	describe('validateDeleteRequestInDatabase method', () => {

		context('valid data (results returned that indicate no dependent associations exist)', () => {

			it('will not add properties to errors property', async () => {

				stubs.neo4jQuery.resolves({ relationshipCount: 0 });
				spy(instance, 'addPropertyError');
				await instance.validateDeleteRequestInDatabase();
				assert.callOrder(
					stubs.getValidateDeleteRequestQueries.theatre,
					stubs.neo4jQuery
				);
				expect(stubs.getValidateDeleteRequestQueries.theatre.calledOnce).to.be.true;
				expect(stubs.getValidateDeleteRequestQueries.theatre.calledWithExactly()).to.be.true;
				expect(stubs.neo4jQuery.calledOnce).to.be.true;
				expect(stubs.neo4jQuery.calledWithExactly(
					{ query: 'getValidateDeleteRequestQuery response', params: instance }
				)).to.be.true;
				expect(instance.addPropertyError.notCalled).to.be.true;
				expect(instance.errors).not.to.have.property('associations');
				expect(instance.errors).to.deep.eq({});

			});

		});

		context('invalid data (results returned that indicate dependent associations exist)', () => {

			it('adds properties whose values are arrays to errors property', async () => {

				stubs.neo4jQuery.resolves({ relationshipCount: 1 });
				spy(instance, 'addPropertyError');
				await instance.validateDeleteRequestInDatabase();
				assert.callOrder(
					stubs.getValidateDeleteRequestQueries.theatre,
					stubs.neo4jQuery,
					instance.addPropertyError
				);
				expect(stubs.getValidateDeleteRequestQueries.theatre.calledOnce).to.be.true;
				expect(stubs.getValidateDeleteRequestQueries.theatre.calledWithExactly()).to.be.true;
				expect(stubs.neo4jQuery.calledOnce).to.be.true;
				expect(stubs.neo4jQuery.calledWithExactly(
					{ query: 'getValidateDeleteRequestQuery response', params: instance }
				)).to.be.true;
				expect(instance.addPropertyError.calledOnce).to.be.true;
				expect(instance.addPropertyError.calledWithExactly('associations', 'productions')).to.be.true;
				expect(instance.errors)
					.to.have.property('associations')
					.that.is.an('array')
					.that.deep.eq(['productions']);

			});

		});

	});

	describe('delete method', () => {

		context('no dependent associations', () => {

			it('deletes', async () => {

				spy(instance, 'validateDeleteRequestInDatabase');
				spy(instance, 'setErrorStatus');
				const result = await instance.delete();
				assert.callOrder(
					instance.validateDeleteRequestInDatabase,
					instance.setErrorStatus,
					stubs.sharedQueries.getDeleteQuery,
					stubs.neo4jQuery
				);
				expect(instance.validateDeleteRequestInDatabase.calledOnce).to.be.true;
				expect(instance.validateDeleteRequestInDatabase.calledWithExactly()).to.be.true;
				expect(instance.setErrorStatus.calledOnce).to.be.true;
				expect(instance.setErrorStatus.calledWithExactly()).to.be.true;
				expect(stubs.sharedQueries.getDeleteQuery.calledOnce).to.be.true;
				expect(stubs.sharedQueries.getDeleteQuery.calledWithExactly(instance.model)).to.be.true;
				expect(stubs.neo4jQuery.calledTwice).to.be.true;
				expect(stubs.neo4jQuery.firstCall.calledWithExactly(
					{ query: 'getValidateDeleteRequestQuery response', params: instance }
				)).to.be.true;
				expect(stubs.neo4jQuery.secondCall.calledWithExactly(
					{ query: 'getDeleteQuery response', params: instance }
				)).to.be.true;
				expect(result).to.deep.eq(neo4jQueryFixture);

			});

		});

		context('dependent associations', () => {

			it('returns instance without deleting', async () => {

				stubs.hasErrors.returns(true);
				spy(instance, 'validateDeleteRequestInDatabase');
				spy(instance, 'setErrorStatus');
				const result = await instance.delete();
				assert.callOrder(
					instance.validateDeleteRequestInDatabase,
					instance.setErrorStatus
				);
				expect(instance.validateDeleteRequestInDatabase.calledOnce).to.be.true;
				expect(instance.validateDeleteRequestInDatabase.calledWithExactly()).to.be.true;
				expect(instance.setErrorStatus.calledOnce).to.be.true;
				expect(instance.setErrorStatus.calledWithExactly()).to.be.true;
				expect(stubs.sharedQueries.getDeleteQuery.notCalled).to.be.true;
				expect(stubs.neo4jQuery.calledOnce).to.be.true;
				expect(stubs.neo4jQuery.calledWithExactly(
					{ query: 'getValidateDeleteRequestQuery response', params: instance }
				)).to.be.true;
				expect(result).to.deep.eq({ theatre: instance });

			});

		});

	});

});
