import { expect } from 'chai';
import { createSandbox } from 'sinon';

import * as convertNeo4jIntegersToNumbersModule from '../../../src/neo4j/convert-neo4j-integers-to-numbers';
import { convertNeo4jRecordsToObjects } from '../../../src/neo4j/convert-neo4j-records-to-objects';

describe('Convert Neo4j Records To Objects module', () => {

	const sandbox = createSandbox();

	beforeEach(() => {

		sandbox.stub(convertNeo4jIntegersToNumbersModule, 'convertNeo4jIntegersToNumbers').returnsArg(0);

	});

	afterEach(() => {

		sandbox.restore();

	});

	it('returns false if no error values present', () => {

		const neo4Response = {
			records: [
				{
					keys: [
						'model',
						'uuid',
						'name',
						'differentiator',
						'writerGroups'
					],
					_fields: [
						'material',
						'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
						'3 Winters',
						null,
						[
							{
								name: 'by',
								model: 'writerGroup',
								writers: [
									{
										name: 'Tena Štivičić',
										model: 'person',
										uuid: 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy'
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
				model: 'material',
				uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
				name: '3 Winters',
				differentiator: null,
				writerGroups: [
					{
						name: 'by',
						model: 'writerGroup',
						writers: [
							{
								name: 'Tena Štivičić',
								model: 'person',
								uuid: 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy'
							}
						]
					}
				]
			}
		];

		const result = convertNeo4jRecordsToObjects(neo4Response);

		expect(result).to.deep.equal(expectedResult);

	});

});
