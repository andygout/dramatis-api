import { expect } from 'chai';

import * as cypherQueriesValidation from '../../../../src/neo4j/cypher-queries/validation';
import removeExcessWhitespace from '../../../test-helpers/remove-excess-whitespace';

describe('Cypher Queries Validation module', () => {

	describe('getExistenceQuery function', () => {

		it('returns requisite query', () => {

			const result = cypherQueriesValidation.getExistenceQuery('VENUE');
			expect(removeExcessWhitespace(result)).to.equal(removeExcessWhitespace(`
				MATCH (n:Venue { uuid: $uuid })

				RETURN n
			`));

		});

	});

	describe('getDuplicateRecordCountQuery function', () => {

		it('returns requisite query', () => {

			const result = cypherQueriesValidation.getDuplicateRecordCountQuery('VENUE', undefined);
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

				RETURN SIGN(COUNT(n)) AS duplicateRecordCount
			`));

		});

	});

});
