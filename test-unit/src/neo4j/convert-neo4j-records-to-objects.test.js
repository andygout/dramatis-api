import assert from 'node:assert/strict';
import { afterEach, beforeEach, describe, it } from 'node:test';

import esmock from 'esmock';
import { restore, stub } from 'sinon';

describe('Convert Neo4j Records To Objects module', () => {
	let stubs;
	let convertNeo4jRecordsToObjects;

	beforeEach(async () => {
		stubs = {
			convertNeo4jFieldsToJsValues: stub().returnsArg(0)
		};

		convertNeo4jRecordsToObjects = await esmock('../../../src/neo4j/convert-neo4j-records-to-objects.js', {
			'../../../src/neo4j/convert-neo4j-fields-to-js-values.js': stubs.convertNeo4jFieldsToJsValues
		});
	});

	afterEach(() => {
		restore();
	});

	it('returns false if no error values present', async () => {
		const neo4Response = {
			records: [
				{
					keys: ['model', 'uuid', 'name', 'differentiator', 'writingCredits'],
					_fields: [
						'MATERIAL',
						'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
						'3 Winters',
						null,
						[
							{
								name: 'by',
								model: 'WRITING_CREDIT',
								entities: [
									{
										model: 'PERSON',
										uuid: 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy',
										name: 'Tena Štivičić'
									}
								]
							}
						]
					]
				}
			]
		};

		const expectedResult = [
			{
				model: 'MATERIAL',
				uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
				name: '3 Winters',
				differentiator: null,
				writingCredits: [
					{
						model: 'WRITING_CREDIT',
						name: 'by',
						entities: [
							{
								model: 'PERSON',
								uuid: 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy',
								name: 'Tena Štivičić'
							}
						]
					}
				]
			}
		];

		const result = convertNeo4jRecordsToObjects(neo4Response);

		assert.deepEqual(result, expectedResult);
	});
});
