import { expect } from 'chai';
import { createSandbox } from 'sinon';

import * as strings from '../../../../src/lib/strings';
import * as cypherQueriesShared from '../../../../src/neo4j/cypher-queries/shared';
import removeExcessWhitespace from '../../../test-helpers/remove-excess-whitespace';

describe('Cypher Queries Shared module', () => {

	let stubs;

	const sandbox = createSandbox();

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
				expect(removeExcessWhitespace(result)).to.equal(removeExcessWhitespace(`
					MATCH (n:Production)

					OPTIONAL MATCH (n)-[:PLAYS_AT]->(t:Theatre)

					RETURN
						'production' AS model,
						n.uuid AS uuid,
						n.name AS name
						, CASE WHEN t IS NULL
							THEN null
							ELSE { model: 'theatre', uuid: t.uuid, name: t.name, differentiator: t.differentiator }
						END AS theatre

					LIMIT 100
				`));

			});

		});

	});

	context('Theatre (i.e. non-Production) model usage', () => {

		describe('getExistenceQuery function', () => {

			it('returns requisite query', () => {

				const result = cypherQueriesShared.getExistenceQuery('theatre');
				expect(stubs.capitalise.calledOnce).to.be.true;
				expect(stubs.capitalise.calledWithExactly('theatre')).to.be.true;
				expect(removeExcessWhitespace(result)).to.equal(removeExcessWhitespace(`
					MATCH (n:Theatre { uuid: $uuid })

					RETURN n
				`));

			});

		});

		describe('getDuplicateRecordCountQuery function', () => {

			it('returns requisite query', () => {

				const result = cypherQueriesShared.getDuplicateRecordCountQuery('theatre', undefined);
				expect(stubs.capitalise.calledOnce).to.be.true;
				expect(stubs.capitalise.calledWithExactly('theatre')).to.be.true;
				expect(removeExcessWhitespace(result)).to.equal(removeExcessWhitespace(`
					MATCH (n:Theatre { name: $name })
						WHERE
							(
								($differentiator IS NULL AND n.differentiator IS NULL) OR
								($differentiator = n.differentiator)
							) AND
							(
								($uuid IS NULL) OR
								($uuid <> n.uuid)
							)

					RETURN SIGN(COUNT(n)) AS instanceCount
				`));

			});

		});

		describe('getCreateQuery function', () => {

			it('returns requisite query', () => {

				const result = cypherQueriesShared.getCreateQuery('theatre');
				expect(stubs.capitalise.calledTwice).to.be.true;
				expect(stubs.capitalise.firstCall.calledWithExactly('theatre')).to.be.true;
				expect(stubs.capitalise.secondCall.calledWithExactly('theatre')).to.be.true;
				expect(removeExcessWhitespace(result)).to.equal(removeExcessWhitespace(`
					CREATE (n:Theatre { uuid: $uuid, name: $name, differentiator: $differentiator })

					WITH n

					MATCH (n:Theatre { uuid: $uuid })

					RETURN
						'theatre' AS model,
						n.uuid AS uuid,
						n.name AS name,
						n.differentiator AS differentiator
				`));

			});

		});

		describe('getEditQuery function', () => {

			it('returns requisite query', () => {

				const result = cypherQueriesShared.getEditQuery('theatre');
				expect(stubs.capitalise.calledOnce).to.be.true;
				expect(stubs.capitalise.calledWithExactly('theatre')).to.be.true;
				expect(removeExcessWhitespace(result)).to.equal(removeExcessWhitespace(`
					MATCH (n:Theatre { uuid: $uuid })

					RETURN
						'theatre' AS model,
						n.uuid AS uuid,
						n.name AS name,
						n.differentiator AS differentiator
				`));

			});

		});

		describe('getUpdateQuery function', () => {

			it('returns requisite query', () => {

				const result = cypherQueriesShared.getUpdateQuery('theatre');
				expect(stubs.capitalise.calledTwice).to.be.true;
				expect(stubs.capitalise.firstCall.calledWithExactly('theatre')).to.be.true;
				expect(stubs.capitalise.secondCall.calledWithExactly('theatre')).to.be.true;
				expect(removeExcessWhitespace(result)).to.equal(removeExcessWhitespace(`
					MATCH (n:Theatre { uuid: $uuid })
						SET
							n.name = $name,
							n.differentiator = $differentiator

					WITH n

					MATCH (n:Theatre { uuid: $uuid })

					RETURN
						'theatre' AS model,
						n.uuid AS uuid,
						n.name AS name,
						n.differentiator AS differentiator
				`));

			});

		});

		describe('getDeleteQuery function', () => {

			it('returns requisite query', () => {

				const result = cypherQueriesShared.getDeleteQuery('theatre');
				expect(stubs.capitalise.calledOnce).to.be.true;
				expect(stubs.capitalise.calledWithExactly('theatre')).to.be.true;
				expect(removeExcessWhitespace(result)).to.equal(removeExcessWhitespace(`
					MATCH (:Theatre { uuid: $uuid })

					OPTIONAL MATCH (deletableInstance:Theatre { uuid: $uuid })
						WHERE NOT (deletableInstance)-[]-()

					OPTIONAL MATCH (undeletableInstance:Theatre { uuid: $uuid })
						-[]-(undeleteableInstanceAssociate)

					UNWIND
						CASE WHEN undeleteableInstanceAssociate IS NOT NULL
							THEN LABELS(undeleteableInstanceAssociate)
							ELSE [null]
						END AS associateLabel

						WITH
							DISTINCT(associateLabel) AS distinctAssociateLabel,
							undeletableInstance,
							deletableInstance
							ORDER BY distinctAssociateLabel

						WITH
							undeletableInstance,
							deletableInstance,
							deletableInstance IS NOT NULL AS isDeleted,
							deletableInstance.name AS deletableInstanceName,
							deletableInstance.differentiator AS deletableInstancedifferentiator,
							COLLECT(distinctAssociateLabel) AS associatedModels

						DETACH DELETE deletableInstance

						RETURN
							'theatre' AS model,
							CASE WHEN isDeleted
								THEN deletableInstanceName
								ELSE undeletableInstance.name
							END AS name,
							CASE WHEN isDeleted
								THEN deletableInstancedifferentiator
								ELSE undeletableInstance.differentiator
							END AS differentiator,
							isDeleted,
							associatedModels
				`));

			});

		});

		describe('getListQuery function', () => {

			it('returns requisite query', () => {

				const result = cypherQueriesShared.getListQuery('theatre');
				expect(stubs.capitalise.calledOnce).to.be.true;
				expect(stubs.capitalise.calledWithExactly('theatre')).to.be.true;
				expect(removeExcessWhitespace(result)).to.equal(removeExcessWhitespace(`
					MATCH (n:Theatre)

					RETURN
						'theatre' AS model,
						n.uuid AS uuid,
						n.name AS name
						, n.differentiator AS differentiator

					LIMIT 100
				`));

			});

		});

	});

});
