import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { getTrimmedOrEmptyString } from '../../../src/lib/strings.js';

describe('Strings module', () => {
	describe('getTrimmedOrEmptyString function', () => {
		it('assigns empty string if value is undefined', () => {
			assert.equal(getTrimmedOrEmptyString(undefined), '');
		});

		it('assigns empty string if value is empty string', () => {
			assert.equal(getTrimmedOrEmptyString(''), '');
		});

		it('assigns empty string if value is whitespace-only string', () => {
			assert.equal(getTrimmedOrEmptyString(' '), '');
		});

		it('assigns value if value is string with length', () => {
			assert.equal(getTrimmedOrEmptyString('foobar'), 'foobar');
		});

		it('assigns trimmed value if value is string with leading and trailing whitespace', () => {
			assert.equal(getTrimmedOrEmptyString(' foobar '), 'foobar');
		});
	});
});
