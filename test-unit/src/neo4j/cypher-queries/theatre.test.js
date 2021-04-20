import { expect } from 'chai';

import * as cypherQueriesTheatre from '../../../../src/neo4j/cypher-queries/theatre';
import removeExcessWhitespace from '../../../test-helpers/remove-excess-whitespace';

describe('Cypher Queries Theatre module', () => {

	describe('getCreateQuery function', () => {

		it('returns requisite query', () => {

			const result = cypherQueriesTheatre.getCreateQuery();

			const compactedResult = removeExcessWhitespace(result);

			const startSegment = removeExcessWhitespace(`
				CREATE (theatre:Theatre { uuid: $uuid, name: $name, differentiator: $differentiator })
			`);

			const middleSegment = removeExcessWhitespace(`
				CREATE (theatre)-[:HAS_SUB_THEATRE { position: subTheatreParam.position }]->(subTheatre)
			`);

			const endSegment = removeExcessWhitespace(`
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
			`);

			expect(compactedResult.startsWith(startSegment)).to.be.true;
			expect(compactedResult.includes(middleSegment)).to.be.true;
			expect(compactedResult.endsWith(endSegment)).to.be.true;

		});

	});

	describe('getUpdateQuery function', () => {

		it('returns requisite query', () => {

			const result = cypherQueriesTheatre.getUpdateQuery();

			const compactedResult = removeExcessWhitespace(result);

			const startSegment = removeExcessWhitespace(`
				MATCH (theatre:Theatre { uuid: $uuid })

				OPTIONAL MATCH (theatre)-[relationship:HAS_SUB_THEATRE]->(:Theatre)

				DELETE relationship

				WITH DISTINCT theatre

				SET
					theatre.name = $name,
					theatre.differentiator = $differentiator
			`);

			const middleSegment = removeExcessWhitespace(`
				CREATE (theatre)-[:HAS_SUB_THEATRE { position: subTheatreParam.position }]->(subTheatre)
			`);

			const endSegment = removeExcessWhitespace(`
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
			`);

			expect(compactedResult.startsWith(startSegment)).to.be.true;
			expect(compactedResult.includes(middleSegment)).to.be.true;
			expect(compactedResult.endsWith(endSegment)).to.be.true;

		});

	});

});
