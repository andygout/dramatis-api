import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { neo4jQuery } from '../../src/neo4j/query.js';

describe('Database setup', () => {
	it('returns the expected constraints', async () => {
		const query = 'SHOW CONSTRAINTS';

		const constraints = await neo4jQuery({ query, params: {} }, { isArrayResult: true });

		const expectedConstraints = [
			{ labelsOrTypes: ['Award'], properties: ['uuid'] },
			{ labelsOrTypes: ['AwardCeremony'], properties: ['uuid'] },
			{ labelsOrTypes: ['Character'], properties: ['uuid'] },
			{ labelsOrTypes: ['Company'], properties: ['uuid'] },
			{ labelsOrTypes: ['Festival'], properties: ['uuid'] },
			{ labelsOrTypes: ['FestivalSeries'], properties: ['uuid'] },
			{ labelsOrTypes: ['Locale'], properties: ['uuid'] },
			{ labelsOrTypes: ['Material'], properties: ['uuid'] },
			{ labelsOrTypes: ['Person'], properties: ['uuid'] },
			{ labelsOrTypes: ['Place'], properties: ['uuid'] },
			{ labelsOrTypes: ['Production'], properties: ['uuid'] },
			{ labelsOrTypes: ['Season'], properties: ['uuid'] },
			{ labelsOrTypes: ['Time'], properties: ['uuid'] },
			{ labelsOrTypes: ['Venue'], properties: ['uuid'] }
		];

		assert.deepEqual(
			constraints
				.toSorted((a, b) => a.labelsOrTypes[0].localeCompare(b.labelsOrTypes[0]))
				.map(({ labelsOrTypes, properties }) => ({
					labelsOrTypes,
					properties
				})),
			expectedConstraints
		);
	});

	it('returns the expected range indexes', async () => {
		const query = "SHOW INDEXES WHERE type = 'RANGE'";

		const rangeIndexes = await neo4jQuery({ query, params: {} }, { isArrayResult: true });

		const expectedRangeIndexes = [
			{ labelsOrTypes: ['Award'], properties: ['name'] },
			{ labelsOrTypes: ['Award'], properties: ['uuid'] },
			{ labelsOrTypes: ['AwardCeremony'], properties: ['name'] },
			{ labelsOrTypes: ['AwardCeremony'], properties: ['uuid'] },
			{ labelsOrTypes: ['Character'], properties: ['name'] },
			{ labelsOrTypes: ['Character'], properties: ['uuid'] },
			{ labelsOrTypes: ['Company'], properties: ['name'] },
			{ labelsOrTypes: ['Company'], properties: ['uuid'] },
			{ labelsOrTypes: ['Festival'], properties: ['name'] },
			{ labelsOrTypes: ['Festival'], properties: ['uuid'] },
			{ labelsOrTypes: ['FestivalSeries'], properties: ['name'] },
			{ labelsOrTypes: ['FestivalSeries'], properties: ['uuid'] },
			{ labelsOrTypes: ['Locale'], properties: ['name'] },
			{ labelsOrTypes: ['Locale'], properties: ['uuid'] },
			{ labelsOrTypes: ['Material'], properties: ['name'] },
			{ labelsOrTypes: ['Material'], properties: ['uuid'] },
			{ labelsOrTypes: ['Person'], properties: ['name'] },
			{ labelsOrTypes: ['Person'], properties: ['uuid'] },
			{ labelsOrTypes: ['Place'], properties: ['name'] },
			{ labelsOrTypes: ['Place'], properties: ['uuid'] },
			{ labelsOrTypes: ['Production'], properties: ['uuid'] },
			{ labelsOrTypes: ['Season'], properties: ['name'] },
			{ labelsOrTypes: ['Season'], properties: ['uuid'] },
			{ labelsOrTypes: ['Time'], properties: ['fromDate'] },
			{ labelsOrTypes: ['Time'], properties: ['name'] },
			{ labelsOrTypes: ['Time'], properties: ['toDate'] },
			{ labelsOrTypes: ['Time'], properties: ['uuid'] },
			{ labelsOrTypes: ['Venue'], properties: ['name'] },
			{ labelsOrTypes: ['Venue'], properties: ['uuid'] }
		];

		assert.deepEqual(
			rangeIndexes
				.toSorted(
					(a, b) =>
						a.labelsOrTypes[0].localeCompare(b.labelsOrTypes[0]) ||
						a.properties[0].localeCompare(b.properties[0])
				)
				.map(({ labelsOrTypes, properties }) => ({
					labelsOrTypes,
					properties
				})),
			expectedRangeIndexes
		);
	});

	it('returns the expected full-text indexes', async () => {
		const query = "SHOW INDEXES WHERE type = 'FULLTEXT'";

		const fullTextIndexes = await neo4jQuery({ query, params: {} }, { isArrayResult: true });

		const expectedFullTextIndexes = [
			{
				name: 'names',
				labelsOrTypes: [
					'Award',
					'AwardCeremony',
					'Character',
					'Company',
					'Festival',
					'FestivalSeries',
					'Locale',
					'Material',
					'Person',
					'Place',
					'Production',
					'Season',
					'Time',
					'Venue'
				],
				properties: ['name']
			}
		];

		assert.deepEqual(
			fullTextIndexes.map(({ name, labelsOrTypes, properties }) => ({
				name,
				labelsOrTypes,
				properties
			})),
			expectedFullTextIndexes
		);
	});
});
