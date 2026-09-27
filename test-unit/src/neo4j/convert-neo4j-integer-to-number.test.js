import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import neo4j from 'neo4j-driver';

import convertNeo4jIntegerToNumber from '../../../src/neo4j/convert-neo4j-integer-to-number.js';

const context = describe;

describe('Convert Neo4j Integer To Number module', () => {
	context('Neo4j integer is within the safe integer range', () => {
		it('converts a positive Neo4j integer to a number', () => {
			const inputValue = neo4j.int(42);

			const result = convertNeo4jIntegerToNumber(inputValue);

			assert.equal(result, 42);
		});

		it('converts zero to a number', () => {
			const inputValue = neo4j.int(0);

			const result = convertNeo4jIntegerToNumber(inputValue);

			assert.equal(result, 0);
		});

		it('converts the largest safe integer to a number', () => {
			const inputValue = neo4j.int('9007199254740991');

			const result = convertNeo4jIntegerToNumber(inputValue);

			assert.equal(result, Number.MAX_SAFE_INTEGER);
		});

		it('converts the smallest safe integer to a number', () => {
			const inputValue = neo4j.int('-9007199254740991');

			const result = convertNeo4jIntegerToNumber(inputValue);

			assert.equal(result, Number.MIN_SAFE_INTEGER);
		});
	});

	context('Neo4j integer is outside the safe integer range', () => {
		it('returns null for an integer above the largest safe integer', () => {
			const inputValue = neo4j.int('9007199254740992');

			const result = convertNeo4jIntegerToNumber(inputValue);

			assert.equal(result, null);
		});

		it('returns null for an integer below the smallest safe integer', () => {
			const inputValue = neo4j.int('-9007199254740992');

			const result = convertNeo4jIntegerToNumber(inputValue);

			assert.equal(result, null);
		});
	});
});
