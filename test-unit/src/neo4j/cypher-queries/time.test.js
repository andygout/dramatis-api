import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import * as cypherQueriesVenue from '../../../../src/neo4j/cypher-queries/time/index.js';
import removeExcessWhitespace from '../../../test-helpers/remove-excess-whitespace.js';

describe('Cypher Queries Time module', () => {
	describe('getCreateQuery function', () => {
		it('returns requisite query', () => {
			const result = cypherQueriesVenue.getCreateQuery();

			const compactedResult = removeExcessWhitespace(result);

			const startSegment = removeExcessWhitespace(`
				CREATE (time:Time {
					uuid: $uuid,
					name: $name,
					differentiator: $differentiator,
					fromDate: $fromDate,
					toDate: $toDate
				})
			`);

			const middleSegment = removeExcessWhitespace(`WITH time`);

			const endSegment = removeExcessWhitespace(`
				RETURN
					time.uuid AS uuid,
					time.name AS name,
					time.differentiator AS differentiator,
					time.fromDate AS fromDate,
					time.toDate AS toDate
			`);

			assert.equal(compactedResult.startsWith(startSegment), true);
			assert.equal(compactedResult.includes(middleSegment), true);
			assert.equal(compactedResult.endsWith(endSegment), true);
		});
	});

	describe('getUpdateQuery function', () => {
		it('returns requisite query', () => {
			const result = cypherQueriesVenue.getUpdateQuery();

			const compactedResult = removeExcessWhitespace(result);

			const startSegment = removeExcessWhitespace(`
				MATCH (time:Time { uuid: $uuid })

				SET
					time.name = $name,
					time.differentiator = $differentiator,
					time.fromDate = $fromDate,
					time.toDate = $toDate
			`);

			const middleSegment = removeExcessWhitespace(`WITH time`);

			const endSegment = removeExcessWhitespace(`
				RETURN
					time.uuid AS uuid,
					time.name AS name,
					time.differentiator AS differentiator,
					time.fromDate AS fromDate,
					time.toDate AS toDate
			`);

			assert.equal(compactedResult.startsWith(startSegment), true);
			assert.equal(compactedResult.includes(middleSegment), true);
			assert.equal(compactedResult.endsWith(endSegment), true);
		});
	});
});
