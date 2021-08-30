import { expect } from 'chai';

import * as cypherQueriesShared from '../../../../src/neo4j/cypher-queries/shared';
import removeExcessWhitespace from '../../../test-helpers/remove-excess-whitespace';

describe('Cypher Queries Shared module', () => {

	describe('getExistenceQuery function', () => {

		it('returns requisite query', () => {

			const result = cypherQueriesShared.getExistenceQuery('VENUE');
			expect(removeExcessWhitespace(result)).to.equal(removeExcessWhitespace(`
				MATCH (n:Venue { uuid: $uuid })

				RETURN n
			`));

		});

	});

	describe('getDuplicateRecordCountQuery function', () => {

		it('returns requisite query', () => {

			const result = cypherQueriesShared.getDuplicateRecordCountQuery('VENUE', undefined);
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

			const result = cypherQueriesShared.getCreateQuery('VENUE');
			expect(removeExcessWhitespace(result)).to.equal(removeExcessWhitespace(`
				CREATE (n:Venue { uuid: $uuid, name: $name, differentiator: $differentiator })

				WITH n

				MATCH (n:Venue { uuid: $uuid })

				RETURN
					'VENUE' AS model,
					n.uuid AS uuid,
					n.name AS name,
					n.differentiator AS differentiator
			`));

		});

	});

	describe('getEditQuery function', () => {

		it('returns requisite query', () => {

			const result = cypherQueriesShared.getEditQuery('VENUE');
			expect(removeExcessWhitespace(result)).to.equal(removeExcessWhitespace(`
				MATCH (n:Venue { uuid: $uuid })

				RETURN
					'VENUE' AS model,
					n.uuid AS uuid,
					n.name AS name,
					n.differentiator AS differentiator
			`));

		});

	});

	describe('getUpdateQuery function', () => {

		it('returns requisite query', () => {

			const result = cypherQueriesShared.getUpdateQuery('VENUE');
			expect(removeExcessWhitespace(result)).to.equal(removeExcessWhitespace(`
				MATCH (n:Venue { uuid: $uuid })
					SET
						n.name = $name,
						n.differentiator = $differentiator

				WITH n

				MATCH (n:Venue { uuid: $uuid })

				RETURN
					'VENUE' AS model,
					n.uuid AS uuid,
					n.name AS name,
					n.differentiator AS differentiator
			`));

		});

	});

	describe('getDeleteQuery function', () => {

		it('returns requisite query', () => {

			const result = cypherQueriesShared.getDeleteQuery('VENUE');
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

			const result = cypherQueriesShared.getListQuery('VENUE');
			expect(removeExcessWhitespace(result)).to.equal(removeExcessWhitespace(`
				MATCH (n:Venue)

				RETURN
					'VENUE' AS model,
					n.uuid AS uuid,
					n.name AS name

				ORDER BY n.name

				LIMIT 100
			`));

		});

	});

});
