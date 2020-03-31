import { expect } from 'chai';
import { assert, createSandbox, spy } from 'sinon';

import * as hasErrorsModule from '../../../server/lib/has-errors';
import Theatre from '../../../server/models/Theatre';
import * as cypherQueries from '../../../server/neo4j/cypher-queries';
import * as neo4jQueryModule from '../../../server/neo4j/query';
import neo4jQueryFixture from '../../fixtures/neo4j-query';

describe('Theatre model', () => {

	let stubs;
	let instance;

	const sandbox = createSandbox();

	beforeEach(() => {

		stubs = {
			hasErrors: sandbox.stub(hasErrorsModule, 'hasErrors').returns(false),
			getValidateDeleteQueries: {
				theatre:
					sandbox.stub(cypherQueries.getValidateDeleteQueries, 'theatre')
						.returns('getValidateDeleteQuery response')
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

	describe('validateDeleteInDb method', () => {

		it('validates delete in database', async () => {

			await instance.validateDeleteInDb();
			expect(stubs.getValidateDeleteQueries.theatre.calledOnce).to.be.true;
			expect(stubs.getValidateDeleteQueries.theatre.calledWithExactly()).to.be.true;
			expect(stubs.neo4jQuery.calledOnce).to.be.true;
			expect(stubs.neo4jQuery.calledWithExactly(
				{ query: 'getValidateDeleteQuery response', params: instance }
			)).to.be.true;

		});

		context('valid data (results returned that indicate no dependent associations exist)', () => {

			it('will not add properties to errors property', async () => {

				stubs.neo4jQuery.resolves({ relationshipCount: 0 });
				await instance.validateDeleteInDb();
				expect(instance.errors).not.to.have.property('associations');
				expect(instance.errors).to.deep.eq({});

			});

		});

		context('invalid data (results returned that indicate dependent associations exist)', () => {

			it('adds properties whose values are arrays to errors property', async () => {

				stubs.neo4jQuery.resolves({ relationshipCount: 1 });
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

			it('deletes', async () => {

				spy(instance, 'validateDeleteInDb');
				const result = await instance.delete();
				assert.callOrder(
					instance.validateDeleteInDb.withArgs(),
					stubs.getValidateDeleteQueries.theatre.withArgs(),
					stubs.neo4jQuery.withArgs({ query: 'getValidateDeleteQuery response', params: instance }),
					stubs.hasErrors.withArgs(instance),
					stubs.sharedQueries.getDeleteQuery.withArgs(instance.model),
					stubs.neo4jQuery.withArgs({ query: 'getDeleteQuery response', params: instance })
				);
				expect(instance.validateDeleteInDb.calledOnce).to.be.true;
				expect(stubs.getValidateDeleteQueries.theatre.calledOnce).to.be.true;
				expect(stubs.neo4jQuery.calledTwice).to.be.true;
				expect(stubs.hasErrors.calledOnce).to.be.true;
				expect(stubs.sharedQueries.getDeleteQuery.calledOnce).to.be.true;
				expect(result).to.deep.eq(neo4jQueryFixture);

			});

		});

		context('dependent associations', () => {

			it('returns instance without deleting', async () => {

				stubs.hasErrors.returns(true);
				spy(instance, 'validateDeleteInDb');
				const result = await instance.delete();
				assert.callOrder(
					instance.validateDeleteInDb.withArgs(),
					stubs.getValidateDeleteQueries.theatre.withArgs(),
					stubs.neo4jQuery.withArgs({ query: 'getValidateDeleteQuery response', params: instance }),
					stubs.hasErrors.withArgs(instance)
				);
				expect(instance.validateDeleteInDb.calledOnce).to.be.true;
				expect(stubs.getValidateDeleteQueries.theatre.calledOnce).to.be.true;
				expect(stubs.neo4jQuery.calledOnce).to.be.true;
				expect(stubs.hasErrors.calledOnce).to.be.true;
				expect(stubs.sharedQueries.getDeleteQuery.notCalled).to.be.true;
				expect(result).to.deep.eq({ theatre: instance });

			});

		});

	});

});
