import { expect } from 'chai';
import { assert, createSandbox, spy } from 'sinon';

import Theatre from '../../../src/models/Theatre';
import * as cypherQueries from '../../../src/neo4j/cypher-queries';
import * as neo4jQueryModule from '../../../src/neo4j/query';

describe('Theatre model', () => {

	let stubs;
	let instance;

	const sandbox = createSandbox();

	beforeEach(() => {

		stubs = {
			getDeleteQueries: {
				theatre: sandbox.stub(cypherQueries.getDeleteQueries, 'theatre').returns('getDeleteQuery response')
			},
			neo4jQuery: sandbox.stub(neo4jQueryModule, 'neo4jQuery')
		};

		instance = new Theatre({ uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx', name: 'Almeida Theatre' });

	});

	afterEach(() => {

		sandbox.restore();

	});

	describe('delete method', () => {

		context('instance has no associations', () => {

			it('deletes instance and returns object with its model and name properties', async () => {

				stubs.neo4jQuery.resolves({ model: 'theatre', name: 'Almeida Theatre', isDeleted: true });
				spy(instance, 'addPropertyError');
				spy(instance, 'setErrorStatus');
				const result = await instance.delete();
				assert.callOrder(
					stubs.getDeleteQueries.theatre,
					stubs.neo4jQuery
				);
				expect(stubs.getDeleteQueries.theatre.calledOnce).to.be.true;
				expect(stubs.getDeleteQueries.theatre.calledWithExactly()).to.be.true;
				expect(stubs.neo4jQuery.calledOnce).to.be.true;
				expect(stubs.neo4jQuery.calledWithExactly(
					{ query: 'getDeleteQuery response', params: instance }
				)).to.be.true;
				expect(instance.addPropertyError.notCalled).to.be.true;
				expect(instance.setErrorStatus.notCalled).to.be.true;
				expect(result).to.deep.eq({ model: 'theatre', name: 'Almeida Theatre' });

			});

		});

		context('instance has associations', () => {

			it('returns instance without deleting', async () => {

				stubs.neo4jQuery.resolves({ model: 'theatre', name: 'Almeida Theatre', isDeleted: false });
				spy(instance, 'addPropertyError');
				spy(instance, 'setErrorStatus');
				const result = await instance.delete();
				assert.callOrder(
					stubs.getDeleteQueries.theatre,
					stubs.neo4jQuery
				);
				expect(stubs.getDeleteQueries.theatre.calledOnce).to.be.true;
				expect(stubs.getDeleteQueries.theatre.calledWithExactly()).to.be.true;
				expect(stubs.neo4jQuery.calledOnce).to.be.true;
				expect(stubs.neo4jQuery.calledWithExactly(
					{ query: 'getDeleteQuery response', params: instance }
				)).to.be.true;
				expect(instance.addPropertyError.calledOnce).to.be.true;
				expect(instance.addPropertyError.calledWithExactly('associations', 'productions')).to.be.true;
				expect(instance.setErrorStatus.calledOnce).to.be.true;
				expect(instance.setErrorStatus.calledWithExactly()).to.be.true;
				expect(result).to.deep.eq(instance);

			});

		});

	});

});
