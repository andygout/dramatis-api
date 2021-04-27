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
		stubs.capitalise.withArgs('venue').returns('Venue');

	});

	afterEach(() => {

		sandbox.restore();

	});

	describe('getExistenceQuery function', () => {

		it('returns requisite query', () => {

			const result = cypherQueriesShared.getExistenceQuery('venue');
			expect(stubs.capitalise.calledOnce).to.be.true;
			expect(stubs.capitalise.calledWithExactly('venue')).to.be.true;
			expect(removeExcessWhitespace(result)).to.equal(removeExcessWhitespace(`
				MATCH (n:Venue { uuid: $uuid })

				RETURN n
			`));

		});

	});

	describe('getDuplicateRecordCountQuery function', () => {

		it('returns requisite query', () => {

			const result = cypherQueriesShared.getDuplicateRecordCountQuery('venue', undefined);
			expect(stubs.capitalise.calledOnce).to.be.true;
			expect(stubs.capitalise.calledWithExactly('venue')).to.be.true;
			expect(removeExcessWhitespace(result)).to.equal(removeExcessWhitespace(`
				MATCH (n:Venue { name: $name })
					WHERE
						(
							($differentiator IS NULL AND n.differentiator IS NULL) OR
							$differentiator = n.differentiator
						) AND
						(
							$uuid IS NULL OR
							$uuid <> n.uuid
						)

				RETURN SIGN(COUNT(n)) AS instanceCount
			`));

		});

	});

	describe('getCreateQuery function', () => {

		it('returns requisite query', () => {

			const result = cypherQueriesShared.getCreateQuery('venue');
			expect(stubs.capitalise.calledTwice).to.be.true;
			expect(stubs.capitalise.firstCall.calledWithExactly('venue')).to.be.true;
			expect(stubs.capitalise.secondCall.calledWithExactly('venue')).to.be.true;
			expect(removeExcessWhitespace(result)).to.equal(removeExcessWhitespace(`
				CREATE (n:Venue { uuid: $uuid, name: $name, differentiator: $differentiator })

				WITH n

				MATCH (n:Venue { uuid: $uuid })

				RETURN
					'venue' AS model,
					n.uuid AS uuid,
					n.name AS name,
					n.differentiator AS differentiator
			`));

		});

	});

	describe('getEditQuery function', () => {

		it('returns requisite query', () => {

			const result = cypherQueriesShared.getEditQuery('venue');
			expect(stubs.capitalise.calledOnce).to.be.true;
			expect(stubs.capitalise.calledWithExactly('venue')).to.be.true;
			expect(removeExcessWhitespace(result)).to.equal(removeExcessWhitespace(`
				MATCH (n:Venue { uuid: $uuid })

				RETURN
					'venue' AS model,
					n.uuid AS uuid,
					n.name AS name,
					n.differentiator AS differentiator
			`));

		});

	});

	describe('getUpdateQuery function', () => {

		it('returns requisite query', () => {

			const result = cypherQueriesShared.getUpdateQuery('venue');
			expect(stubs.capitalise.calledTwice).to.be.true;
			expect(stubs.capitalise.firstCall.calledWithExactly('venue')).to.be.true;
			expect(stubs.capitalise.secondCall.calledWithExactly('venue')).to.be.true;
			expect(removeExcessWhitespace(result)).to.equal(removeExcessWhitespace(`
				MATCH (n:Venue { uuid: $uuid })
					SET
						n.name = $name,
						n.differentiator = $differentiator

				WITH n

				MATCH (n:Venue { uuid: $uuid })

				RETURN
					'venue' AS model,
					n.uuid AS uuid,
					n.name AS name,
					n.differentiator AS differentiator
			`));

		});

	});

	describe('getDeleteQuery function', () => {

		it('returns requisite query', () => {

			const result = cypherQueriesShared.getDeleteQuery('venue');
			expect(stubs.capitalise.calledOnce).to.be.true;
			expect(stubs.capitalise.calledWithExactly('venue')).to.be.true;
			expect(removeExcessWhitespace(result)).to.equal(removeExcessWhitespace(`
				MATCH (:Venue { uuid: $uuid })

				OPTIONAL MATCH (deletableInstance:Venue { uuid: $uuid })
					WHERE NOT (deletableInstance)-[]-()

				OPTIONAL MATCH (undeletableInstance:Venue { uuid: $uuid })
					-[]-(undeleteableInstanceAssociate)

				UNWIND
					CASE undeleteableInstanceAssociate WHEN NULL
						THEN [null]
						ELSE LABELS(undeleteableInstanceAssociate)
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
						'venue' AS model,
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

			const result = cypherQueriesShared.getListQuery('venue');
			expect(stubs.capitalise.calledOnce).to.be.true;
			expect(stubs.capitalise.calledWithExactly('venue')).to.be.true;
			expect(removeExcessWhitespace(result)).to.equal(removeExcessWhitespace(`
				MATCH (n:Venue)

				RETURN
					'venue' AS model,
					n.uuid AS uuid,
					n.name AS name

				ORDER BY n.name

				LIMIT 100
			`));

		});

	});

});
