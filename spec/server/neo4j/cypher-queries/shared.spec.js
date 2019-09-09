import { expect } from 'chai';
import sinon from 'sinon';

import * as strings from '../../../../server/lib/strings';
import * as cypherQueriesShared from '../../../../server/neo4j/cypher-queries/shared';
import { removeWhitespace } from '../../../spec-helpers';

describe('Cypher Queries Shared module', () => {

	let stubs;

	const sandbox = sinon.createSandbox();

	beforeEach(() => {

		stubs = {
			capitalise: sandbox.stub(strings, 'capitalise')
		};

		stubs.capitalise.withArgs('production').returns('Production');
		stubs.capitalise.withArgs('theatre').returns('Theatre');

	});

	afterEach(() => {

		sandbox.restore();

	});

	context('Production model usage', () => {

		describe('getListQuery function', () => {

			it('returns requisite query', () => {

				const result = cypherQueriesShared.getListQuery('production');
				expect(stubs.capitalise.calledOnce).to.be.true;
				expect(stubs.capitalise.calledWithExactly('production')).to.be.true;
				expect(removeWhitespace(result)).to.eq(removeWhitespace(`
					MATCH (n:Production)-[:PLAYS_AT]->(t:Theatre)

					RETURN
						'production' AS model,
						n.uuid AS uuid,
						n.name AS name
						, { model: 'theatre', uuid: t.uuid, name: t.name } AS theatre
				`));

			});

		});

	});

	context('Theatre (i.e. non-Production) model usage', () => {

		describe('getValidateQuery function', () => {

			context('uuid argument given is undefined (i.e. requested as part of create action)', () => {

				it('returns requisite query', () => {

					const result = cypherQueriesShared.getValidateQuery('theatre', undefined);
					expect(stubs.capitalise.calledOnce).to.be.true;
					expect(stubs.capitalise.calledWithExactly('theatre')).to.be.true;
					expect(removeWhitespace(result)).to.eq(removeWhitespace(`
						MATCH (n:Theatre { name: $name })

						RETURN SIGN(COUNT(n)) AS instanceCount
					`));

				});

			});

			context('uuid argument given is valid string (i.e. requested as part of update action)', () => {

				it('returns requisite query', () => {

					const result =
						cypherQueriesShared.getValidateQuery('theatre', 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx');
					expect(stubs.capitalise.calledOnce).to.be.true;
					expect(stubs.capitalise.calledWithExactly('theatre')).to.be.true;
					expect(removeWhitespace(result)).to.eq(removeWhitespace(`
						MATCH (n:Theatre { name: $name })
							WHERE n.uuid <> $uuid

						RETURN SIGN(COUNT(n)) AS instanceCount
					`));

				});

			});

		});

		describe('getCreateQuery function', () => {

			it('returns requisite query', () => {

				const result = cypherQueriesShared.getCreateQuery('theatre');
				expect(stubs.capitalise.calledOnce).to.be.true;
				expect(stubs.capitalise.calledWithExactly('theatre')).to.be.true;
				expect(removeWhitespace(result)).to.eq(removeWhitespace(`
					CREATE (n:Theatre { uuid: $uuid, name: $name })

					RETURN
						'theatre' AS model,
						n.uuid AS uuid,
						n.name AS name
				`));

			});

		});

		describe('getEditQuery function', () => {

			it('returns requisite query', () => {

				const result = cypherQueriesShared.getEditQuery('theatre');
				expect(stubs.capitalise.calledOnce).to.be.true;
				expect(stubs.capitalise.calledWithExactly('theatre')).to.be.true;
				expect(removeWhitespace(result)).to.eq(removeWhitespace(`
					MATCH (n:Theatre { uuid: $uuid })

					RETURN
						'theatre' AS model,
						n.uuid AS uuid,
						n.name AS name
				`));

			});

		});

		describe('getUpdateQuery function', () => {

			it('returns requisite query', () => {

				const result = cypherQueriesShared.getUpdateQuery('theatre');
				expect(stubs.capitalise.calledOnce).to.be.true;
				expect(stubs.capitalise.calledWithExactly('theatre')).to.be.true;
				expect(removeWhitespace(result)).to.eq(removeWhitespace(`
					MATCH (n:Theatre { uuid: $uuid })
						SET n.name = $name

					RETURN
						'theatre' AS model,
						n.uuid AS uuid,
						n.name AS name
				`));

			});

		});

		describe('getDeleteQuery function', () => {

			it('returns requisite query', () => {

				const result = cypherQueriesShared.getDeleteQuery('theatre');
				expect(stubs.capitalise.calledOnce).to.be.true;
				expect(stubs.capitalise.calledWithExactly('theatre')).to.be.true;
				expect(removeWhitespace(result)).to.eq(removeWhitespace(`
					MATCH (n:Theatre { uuid: $uuid })

					WITH n, n.name AS name
						DETACH DELETE n

					RETURN
						'theatre' AS model,
						name
				`));

			});

		});

		describe('getListQuery function', () => {

			it('returns requisite query', () => {

				const result = cypherQueriesShared.getListQuery('theatre');
				expect(stubs.capitalise.calledOnce).to.be.true;
				expect(stubs.capitalise.calledWithExactly('theatre')).to.be.true;
				expect(removeWhitespace(result)).to.eq(removeWhitespace(`
					MATCH (n:Theatre)

					RETURN
						'theatre' AS model,
						n.uuid AS uuid,
						n.name AS name
				`));

			});

		});

	});

});
