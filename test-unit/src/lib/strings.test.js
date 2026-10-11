import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { getTrimmedOrEmptyString } from '../../../src/lib/strings.js';

const context = describe;

describe('Strings module', () => {
	describe('getTrimmedOrEmptyString function', () => {
		context('input value is undefined', () => {
			it('returns empty string', () => {
				assert.equal(getTrimmedOrEmptyString(undefined), '');
			});
		});

		context('input value is empty string', () => {
			it('returns empty string', () => {
				assert.equal(getTrimmedOrEmptyString(''), '');
			});
		});

		context('input value is whitespace-only string', () => {
			it('returns empty string', () => {
				assert.equal(getTrimmedOrEmptyString(' '), '');
			});
		});

		context('input value is string with length', () => {
			it('returns input value unchanged', () => {
				assert.equal(getTrimmedOrEmptyString('foobar'), 'foobar');
			});
		});

		context('input value is string with leading and trailing whitespace', () => {
			it('returns trimmed input value', () => {
				assert.equal(getTrimmedOrEmptyString(' foobar '), 'foobar');
			});
		});
	});
});
