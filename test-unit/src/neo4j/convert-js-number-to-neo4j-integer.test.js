import assert from 'node:assert/strict';
import { afterEach, beforeEach, describe, it } from 'node:test';

import esmock from 'esmock';
import { assert as sinonAssert, restore, stub } from 'sinon';

describe('Convert JavaScript Number To Neo4j Integer module', () => {
	let stubs;
	let convertJsNumberToNeo4jInteger;

	beforeEach(async () => {
		stubs = {
			neo4j: {
				int: stub().returns('Neo4j Int response')
			}
		};

		convertJsNumberToNeo4jInteger = await esmock('../../../src/neo4j/convert-js-number-to-neo4j-integer.js', {
			'neo4j-driver': stubs.neo4j
		});
	});

	afterEach(() => {
		restore();
	});

	it('returns the return value of neo4j.int()', async () => {
		const inputValue = 0;

		const result = convertJsNumberToNeo4jInteger(inputValue);

		sinonAssert.calledOnce(stubs.neo4j.int);
		sinonAssert.calledWithExactly(stubs.neo4j.int, inputValue);
		assert.equal(result, 'Neo4j Int response');
	});
});
