import { expect } from 'chai';

import * as cypherQueriesTheatre from '../../../../src/neo4j/cypher-queries/theatre';
import removeExcessWhitespace from '../../../test-helpers/remove-excess-whitespace';

describe('Cypher Queries Theatre module', () => {

	describe('getCreateQuery function', () => {

		it('returns requisite query', () => {

			const result = cypherQueriesTheatre.getCreateQuery();
			expect(removeExcessWhitespace(result)).to.equal(removeExcessWhitespace(`
				CREATE (theatre:Theatre { uuid: $uuid, name: $name, differentiator: $differentiator })

				WITH theatre

				UNWIND (CASE $subTheatres WHEN [] THEN [null] ELSE $subTheatres END) AS subTheatreParam

					OPTIONAL MATCH (existingTheatre:Theatre { name: subTheatreParam.name })
						WHERE
							(subTheatreParam.differentiator IS NULL AND existingTheatre.differentiator IS NULL) OR
							subTheatreParam.differentiator = existingTheatre.differentiator

					FOREACH (item IN CASE subTheatreParam WHEN NULL THEN [] ELSE [1] END |
						MERGE (subTheatre:Theatre {
							uuid: COALESCE(existingTheatre.uuid, subTheatreParam.uuid),
							name: subTheatreParam.name
						})
							ON CREATE SET subTheatre.differentiator = subTheatreParam.differentiator

						CREATE (theatre)-[:INCLUDES_SUB_THEATRE { position: subTheatreParam.position }]->(subTheatre)
					)

				WITH DISTINCT theatre

				MATCH (theatre:Theatre { uuid: $uuid })

				OPTIONAL MATCH (theatre)-[subTheatreRel:INCLUDES_SUB_THEATRE]->(subTheatre:Theatre)

				WITH theatre, subTheatreRel, subTheatre
					ORDER BY subTheatreRel.position

				RETURN
					'theatre' AS model,
					theatre.uuid AS uuid,
					theatre.name AS name,
					theatre.differentiator AS differentiator,
					COLLECT(
						CASE subTheatre WHEN NULL
							THEN null
							ELSE subTheatre { .name, .differentiator }
						END
					) + [{}] AS subTheatres
			`));

		});

	});

	describe('getUpdateQuery function', () => {

		it('returns requisite query', () => {

			const result = cypherQueriesTheatre.getUpdateQuery();
			expect(removeExcessWhitespace(result)).to.equal(removeExcessWhitespace(`
				MATCH (theatre:Theatre { uuid: $uuid })

				OPTIONAL MATCH (theatre)-[relationship:INCLUDES_SUB_THEATRE]->(:Theatre)

				DELETE relationship

				WITH DISTINCT theatre

				SET
					theatre.name = $name,
					theatre.differentiator = $differentiator

				WITH theatre

				UNWIND (CASE $subTheatres WHEN [] THEN [null] ELSE $subTheatres END) AS subTheatreParam

					OPTIONAL MATCH (existingTheatre:Theatre { name: subTheatreParam.name })
						WHERE
							(subTheatreParam.differentiator IS NULL AND existingTheatre.differentiator IS NULL) OR
							subTheatreParam.differentiator = existingTheatre.differentiator

					FOREACH (item IN CASE subTheatreParam WHEN NULL THEN [] ELSE [1] END |
						MERGE (subTheatre:Theatre {
							uuid: COALESCE(existingTheatre.uuid, subTheatreParam.uuid),
							name: subTheatreParam.name
						})
							ON CREATE SET subTheatre.differentiator = subTheatreParam.differentiator

						CREATE (theatre)-[:INCLUDES_SUB_THEATRE { position: subTheatreParam.position }]->(subTheatre)
					)

				WITH DISTINCT theatre

				MATCH (theatre:Theatre { uuid: $uuid })

				OPTIONAL MATCH (theatre)-[subTheatreRel:INCLUDES_SUB_THEATRE]->(subTheatre:Theatre)

				WITH theatre, subTheatreRel, subTheatre
					ORDER BY subTheatreRel.position

				RETURN
					'theatre' AS model,
					theatre.uuid AS uuid,
					theatre.name AS name,
					theatre.differentiator AS differentiator,
					COLLECT(
						CASE subTheatre WHEN NULL
							THEN null
							ELSE subTheatre { .name, .differentiator }
						END
					) + [{}] AS subTheatres
			`));

		});

	});

});
