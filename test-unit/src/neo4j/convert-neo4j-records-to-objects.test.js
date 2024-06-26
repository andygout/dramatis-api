import { expect } from 'chai';
import { createSandbox } from 'sinon';

import * as convertNeo4jIntegersToNumbersModule from '../../../src/neo4j/convert-neo4j-integers-to-numbers';
import { convertNeo4jRecordsToObjects } from '../../../src/neo4j/convert-neo4j-records-to-objects';

const sandbox = createSandbox();

describe('Convert Neo4j Records To Objects module', () => {

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
						'writingCredits'
					],
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

		expect(result).to.deep.equal(expectedResult);

	});

});
