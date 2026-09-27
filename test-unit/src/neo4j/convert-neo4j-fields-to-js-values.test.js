import assert from 'node:assert/strict';
import { afterEach, beforeEach, describe, it } from 'node:test';

import esmock from 'esmock';
import { assert as sinonAssert, restore, stub } from 'sinon';

import neo4j from 'neo4j-driver';

const context = describe;

describe('Convert Neo4j Fields To JavaScript Values module', () => {
	let stubs;
	let convertNeo4jFieldsToJsValues;

	beforeEach(async () => {
		stubs = {
			convertAstronomicalToHistoricalDate: stub().returns('convertAstronomicalToHistoricalDate response'),
			convertNeo4jIntegerToNumber: stub().returns('convertNeo4jIntegerToNumber response')
		};

		convertNeo4jFieldsToJsValues = await esmock('../../../src/neo4j/convert-neo4j-fields-to-js-values.js', {
			'../../../src/neo4j/convert-astronomical-to-historical-date.js': stubs.convertAstronomicalToHistoricalDate,
			'../../../src/neo4j/convert-neo4j-integer-to-number.js': stubs.convertNeo4jIntegerToNumber
		});
	});

	afterEach(() => {
		restore();
	});

	describe('Neo4j dates', () => {
		const NEO4J_DATE = new neo4j.types.Date(neo4j.int(1972), neo4j.int(6), neo4j.int(17));

		context('Neo4j date is input value', () => {
			it('assigns return value of convertAstronomicalToHistoricalDate()', () => {
				const inputValue = NEO4J_DATE;

				const result = convertNeo4jFieldsToJsValues(inputValue);

				sinonAssert.calledOnce(stubs.convertAstronomicalToHistoricalDate);
				assert.equal(result, 'convertAstronomicalToHistoricalDate response');
			});
		});

		context('Neo4j date is top level property', () => {
			it('assigns return value of convertAstronomicalToHistoricalDate()', () => {
				const inputValue = { foo: NEO4J_DATE };

				const result = convertNeo4jFieldsToJsValues(inputValue);

				sinonAssert.calledOnce(stubs.convertAstronomicalToHistoricalDate);
				assert.deepEqual(result, { foo: 'convertAstronomicalToHistoricalDate response' });
			});
		});

		context('Neo4j date is top level property where input value is an array', () => {
			it('assigns return value of convertAstronomicalToHistoricalDate()', () => {
				const inputValue = [{ foo: NEO4J_DATE }];

				const result = convertNeo4jFieldsToJsValues(inputValue);

				sinonAssert.calledOnce(stubs.convertAstronomicalToHistoricalDate);
				assert.deepEqual(result, [{ foo: 'convertAstronomicalToHistoricalDate response' }]);
			});
		});

		context('Neo4j date is nested level property', () => {
			it('assigns return value of convertAstronomicalToHistoricalDate()', () => {
				const inputValue = { foo: { bar: NEO4J_DATE } };

				const result = convertNeo4jFieldsToJsValues(inputValue);

				sinonAssert.calledOnce(stubs.convertAstronomicalToHistoricalDate);
				assert.deepEqual(result, { foo: { bar: 'convertAstronomicalToHistoricalDate response' } });
			});
		});

		context('Neo4j date is nested level property where input value is an array', () => {
			it('assigns return value of convertAstronomicalToHistoricalDate()', () => {
				const inputValue = [{ foo: { bar: NEO4J_DATE } }];

				const result = convertNeo4jFieldsToJsValues(inputValue);

				sinonAssert.calledOnce(stubs.convertAstronomicalToHistoricalDate);
				assert.deepEqual(result, [{ foo: { bar: 'convertAstronomicalToHistoricalDate response' } }]);
			});
		});

		context('Neo4j date is property in array at top level', () => {
			it('assigns return value of convertAstronomicalToHistoricalDate()', () => {
				const inputValue = { foo: [{ bar: NEO4J_DATE }] };

				const result = convertNeo4jFieldsToJsValues(inputValue);

				sinonAssert.calledOnce(stubs.convertAstronomicalToHistoricalDate);
				assert.deepEqual(result, { foo: [{ bar: 'convertAstronomicalToHistoricalDate response' }] });
			});
		});

		context('Neo4j date is property in array at top level where input value is an array', () => {
			it('assigns return value of convertAstronomicalToHistoricalDate()', () => {
				const inputValue = [{ foo: [{ bar: NEO4J_DATE }] }];

				const result = convertNeo4jFieldsToJsValues(inputValue);

				sinonAssert.calledOnce(stubs.convertAstronomicalToHistoricalDate);
				assert.deepEqual(result, [{ foo: [{ bar: 'convertAstronomicalToHistoricalDate response' }] }]);
			});
		});

		context('Neo4j date is property in array at nested level (nested in object)', () => {
			it('assigns return value of convertAstronomicalToHistoricalDate()', () => {
				const inputValue = { foo: { bar: [{ baz: NEO4J_DATE }] } };

				const result = convertNeo4jFieldsToJsValues(inputValue);

				sinonAssert.calledOnce(stubs.convertAstronomicalToHistoricalDate);
				assert.deepEqual(result, { foo: { bar: [{ baz: 'convertAstronomicalToHistoricalDate response' }] } });
			});
		});

		context(
			'Neo4j date is property in array at nested level (nested in object) where input value is an array',
			() => {
				it('assigns return value of convertAstronomicalToHistoricalDate()', () => {
					const inputValue = [{ foo: { bar: [{ baz: NEO4J_DATE }] } }];

					const result = convertNeo4jFieldsToJsValues(inputValue);

					sinonAssert.calledOnce(stubs.convertAstronomicalToHistoricalDate);
					assert.deepEqual(result, [
						{ foo: { bar: [{ baz: 'convertAstronomicalToHistoricalDate response' }] } }
					]);
				});
			}
		);

		context('Neo4j date is property in array at nested level (nested in array)', () => {
			it('assigns return value of convertAstronomicalToHistoricalDate()', () => {
				const inputValue = { foo: [{ bar: [{ baz: NEO4J_DATE }] }] };

				const result = convertNeo4jFieldsToJsValues(inputValue);

				sinonAssert.calledOnce(stubs.convertAstronomicalToHistoricalDate);
				assert.deepEqual(result, { foo: [{ bar: [{ baz: 'convertAstronomicalToHistoricalDate response' }] }] });
			});
		});

		context(
			'Neo4j date is property in array at nested level (nested in array) where input value is an array',
			() => {
				it('assigns return value of convertAstronomicalToHistoricalDate()', () => {
					const inputValue = [{ foo: [{ bar: [{ baz: NEO4J_DATE }] }] }];

					const result = convertNeo4jFieldsToJsValues(inputValue);

					sinonAssert.calledOnce(stubs.convertAstronomicalToHistoricalDate);
					assert.deepEqual(result, [
						{ foo: [{ bar: [{ baz: 'convertAstronomicalToHistoricalDate response' }] }] }
					]);
				});
			}
		);
	});

	describe('Neo4j integers', () => {
		const NEO4J_INTEGER = neo4j.int(1);

		context('Neo4j integer is input value', () => {
			it('converts Neo4j integer to number', () => {
				const inputValue = NEO4J_INTEGER;

				const result = convertNeo4jFieldsToJsValues(inputValue);

				sinonAssert.calledOnce(stubs.convertNeo4jIntegerToNumber);
				assert.equal(result, 'convertNeo4jIntegerToNumber response');
			});
		});

		context('Neo4j integer is top level property', () => {
			it('converts Neo4j integer to number', () => {
				const inputValue = { foo: NEO4J_INTEGER };

				const result = convertNeo4jFieldsToJsValues(inputValue);

				sinonAssert.calledOnce(stubs.convertNeo4jIntegerToNumber);
				assert.deepEqual(result, { foo: 'convertNeo4jIntegerToNumber response' });
			});
		});

		context('Neo4j integer is top level property where input value is an array', () => {
			it('converts Neo4j integer to number', () => {
				const inputValue = [{ foo: NEO4J_INTEGER }];

				const result = convertNeo4jFieldsToJsValues(inputValue);

				sinonAssert.calledOnce(stubs.convertNeo4jIntegerToNumber);
				assert.deepEqual(result, [{ foo: 'convertNeo4jIntegerToNumber response' }]);
			});
		});

		context('Neo4j integer is nested level property', () => {
			it('converts Neo4j integer to number', () => {
				const inputValue = { foo: { bar: NEO4J_INTEGER } };

				const result = convertNeo4jFieldsToJsValues(inputValue);

				sinonAssert.calledOnce(stubs.convertNeo4jIntegerToNumber);
				assert.deepEqual(result, { foo: { bar: 'convertNeo4jIntegerToNumber response' } });
			});
		});

		context('Neo4j integer is nested level property where input value is an array', () => {
			it('converts Neo4j integer to number', () => {
				const inputValue = [{ foo: { bar: NEO4J_INTEGER } }];

				const result = convertNeo4jFieldsToJsValues(inputValue);

				sinonAssert.calledOnce(stubs.convertNeo4jIntegerToNumber);
				assert.deepEqual(result, [{ foo: { bar: 'convertNeo4jIntegerToNumber response' } }]);
			});
		});

		context('Neo4j integer is property in array at top level', () => {
			it('converts Neo4j integer to number', () => {
				const inputValue = { foo: [{ bar: NEO4J_INTEGER }] };

				const result = convertNeo4jFieldsToJsValues(inputValue);

				sinonAssert.calledOnce(stubs.convertNeo4jIntegerToNumber);
				assert.deepEqual(result, { foo: [{ bar: 'convertNeo4jIntegerToNumber response' }] });
			});
		});

		context('Neo4j integer is property in array at top level where input value is an array', () => {
			it('converts Neo4j integer to number', () => {
				const inputValue = [{ foo: [{ bar: NEO4J_INTEGER }] }];

				const result = convertNeo4jFieldsToJsValues(inputValue);

				sinonAssert.calledOnce(stubs.convertNeo4jIntegerToNumber);
				assert.deepEqual(result, [{ foo: [{ bar: 'convertNeo4jIntegerToNumber response' }] }]);
			});
		});

		context('Neo4j integer is property in array at nested level (nested in object)', () => {
			it('converts Neo4j integer to number', () => {
				const inputValue = { foo: { bar: [{ baz: NEO4J_INTEGER }] } };

				const result = convertNeo4jFieldsToJsValues(inputValue);

				sinonAssert.calledOnce(stubs.convertNeo4jIntegerToNumber);
				assert.deepEqual(result, { foo: { bar: [{ baz: 'convertNeo4jIntegerToNumber response' }] } });
			});
		});

		context(
			'Neo4j integer is property in array at nested level (nested in object) where input value is an array',
			() => {
				it('converts Neo4j integer to number', () => {
					const inputValue = [{ foo: { bar: [{ baz: NEO4J_INTEGER }] } }];

					const result = convertNeo4jFieldsToJsValues(inputValue);

					sinonAssert.calledOnce(stubs.convertNeo4jIntegerToNumber);
					assert.deepEqual(result, [{ foo: { bar: [{ baz: 'convertNeo4jIntegerToNumber response' }] } }]);
				});
			}
		);

		context('Neo4j integer is property in array at nested level (nested in array)', () => {
			it('converts Neo4j integer to number', () => {
				const inputValue = { foo: [{ bar: [{ baz: NEO4J_INTEGER }] }] };

				const result = convertNeo4jFieldsToJsValues(inputValue);

				sinonAssert.calledOnce(stubs.convertNeo4jIntegerToNumber);
				assert.deepEqual(result, { foo: [{ bar: [{ baz: 'convertNeo4jIntegerToNumber response' }] }] });
			});
		});

		context(
			'Neo4j integer is property in array at nested level (nested in array) where input value is an array',
			() => {
				it('converts Neo4j integer to number', () => {
					const inputValue = [{ foo: [{ bar: [{ baz: NEO4J_INTEGER }] }] }];

					const result = convertNeo4jFieldsToJsValues(inputValue);

					sinonAssert.calledOnce(stubs.convertNeo4jIntegerToNumber);
					assert.deepEqual(result, [{ foo: [{ bar: [{ baz: 'convertNeo4jIntegerToNumber response' }] }] }]);
				});
			}
		);
	});

	describe('Empty objects', () => {
		context('Empty object in array as input value', () => {
			it('leaves empty object value untouched', () => {
				const inputValue = [{}];

				const result = convertNeo4jFieldsToJsValues(inputValue);

				assert.deepEqual(result, [{}]);
			});
		});

		context('Empty object in array at top level', () => {
			it('leaves empty object value untouched', () => {
				const inputValue = { foo: [{}] };

				const result = convertNeo4jFieldsToJsValues(inputValue);

				assert.deepEqual(result, { foo: [{}] });
			});
		});

		context('Empty object in array at top level where input value is an array', () => {
			it('leaves empty object value untouched', () => {
				const inputValue = [{ foo: [{}] }];

				const result = convertNeo4jFieldsToJsValues(inputValue);

				assert.deepEqual(result, [{ foo: [{}] }]);
			});
		});

		context('Empty object in array at nested level (nested in object)', () => {
			it('leaves empty object value untouched', () => {
				const inputValue = { foo: { bar: [{}] } };

				const result = convertNeo4jFieldsToJsValues(inputValue);

				assert.deepEqual(result, { foo: { bar: [{}] } });
			});
		});

		context('Empty object in array at nested level (nested in object) where input value is an array', () => {
			it('leaves empty object value untouched', () => {
				const inputValue = [{ foo: { bar: [{}] } }];

				const result = convertNeo4jFieldsToJsValues(inputValue);

				assert.deepEqual(result, [{ foo: { bar: [{}] } }]);
			});
		});

		context('Empty object in array at nested level (nested in array)', () => {
			it('leaves empty object value untouched', () => {
				const inputValue = { foo: [{ bar: [{}] }] };

				const result = convertNeo4jFieldsToJsValues(inputValue);

				assert.deepEqual(result, { foo: [{ bar: [{}] }] });
			});
		});

		context('Empty object in array at nested level (nested in array) where input value is an array', () => {
			it('leaves empty object value untouched', () => {
				const inputValue = [{ foo: [{ bar: [{}] }] }];

				const result = convertNeo4jFieldsToJsValues(inputValue);

				assert.deepEqual(result, [{ foo: [{ bar: [{}] }] }]);
			});
		});
	});

	describe('Strings', () => {
		context('String in array as input value', () => {
			it('leaves string value untouched', () => {
				const inputValue = ['string'];

				const result = convertNeo4jFieldsToJsValues(inputValue);

				assert.deepEqual(result, ['string']);
			});
		});

		context('String in array at top level', () => {
			it('leaves string value untouched', () => {
				const inputValue = { foo: ['string'] };

				const result = convertNeo4jFieldsToJsValues(inputValue);

				assert.deepEqual(result, { foo: ['string'] });
			});
		});

		context('String in array at top level where input value is an array', () => {
			it('leaves string value untouched', () => {
				const inputValue = [{ foo: ['string'] }];

				const result = convertNeo4jFieldsToJsValues(inputValue);

				assert.deepEqual(result, [{ foo: ['string'] }]);
			});
		});

		context('String in array at nested level (nested in object)', () => {
			it('leaves string value untouched', () => {
				const inputValue = { foo: { bar: ['string'] } };

				const result = convertNeo4jFieldsToJsValues(inputValue);

				assert.deepEqual(result, { foo: { bar: ['string'] } });
			});
		});

		context('String in array at nested level (nested in object) where input value is an array', () => {
			it('leaves string value untouched', () => {
				const inputValue = [{ foo: { bar: ['string'] } }];

				const result = convertNeo4jFieldsToJsValues(inputValue);

				assert.deepEqual(result, [{ foo: { bar: ['string'] } }]);
			});
		});

		context('String in array at nested level (nested in array)', () => {
			it('leaves string value untouched', () => {
				const inputValue = { foo: [{ bar: ['string'] }] };

				const result = convertNeo4jFieldsToJsValues(inputValue);

				assert.deepEqual(result, { foo: [{ bar: ['string'] }] });
			});
		});

		context('String in array at nested level (nested in array) where input value is an array', () => {
			it('leaves string value untouched', () => {
				const inputValue = [{ foo: [{ bar: ['string'] }] }];

				const result = convertNeo4jFieldsToJsValues(inputValue);

				assert.deepEqual(result, [{ foo: [{ bar: ['string'] }] }]);
			});
		});
	});
});
