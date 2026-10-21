import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import * as cypherQueriesVenue from '../../../../src/neo4j/cypher-queries/place/index.js';
import removeExcessWhitespace from '../../../test-helpers/remove-excess-whitespace.js';

describe('Cypher Queries Place module', () => {
	describe('getCreateQuery function', () => {
		it('returns requisite query', () => {
			const result = cypherQueriesVenue.getCreateQuery();

			const compactedResult = removeExcessWhitespace(result);

			const startSegment = removeExcessWhitespace(`
				CREATE (place:Place {
					uuid: $uuid,
					name: $name,
					differentiator: $differentiator,
					minLatitude: $minLatitude,
					maxLatitude: $maxLatitude,
					minLongitude: $minLongitude,
					maxLongitude: $maxLongitude
				})
			`);

			const middleSegment = removeExcessWhitespace(`WITH place`);

			const endSegment = removeExcessWhitespace(`
				RETURN
					place.uuid AS uuid,
					place.name AS name,
					place.differentiator AS differentiator,
					place.minLatitude AS minLatitude,
					place.maxLatitude AS maxLatitude,
					place.minLongitude AS minLongitude,
					place.maxLongitude AS maxLongitude
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
				MATCH (place:Place { uuid: $uuid })

				SET
					place.name = $name,
					place.differentiator = $differentiator,
					place.minLatitude = $minLatitude,
					place.maxLatitude = $maxLatitude,
					place.minLongitude = $minLongitude,
					place.maxLongitude = $maxLongitude
			`);

			const middleSegment = removeExcessWhitespace(`WITH place`);

			const endSegment = removeExcessWhitespace(`
				RETURN
					place.uuid AS uuid,
					place.name AS name,
					place.differentiator AS differentiator,
					place.minLatitude AS minLatitude,
					place.maxLatitude AS maxLatitude,
					place.minLongitude AS minLongitude,
					place.maxLongitude AS maxLongitude
			`);

			assert.equal(compactedResult.startsWith(startSegment), true);
			assert.equal(compactedResult.includes(middleSegment), true);
			assert.equal(compactedResult.endsWith(endSegment), true);
		});
	});
});
