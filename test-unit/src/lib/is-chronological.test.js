import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import isChronological from '../../../src/lib/is-chronological.js';

describe('Is Chronological module', () => {
	describe('date x is not after date y', () => {
		describe('BCE date is before BCE date', () => {
			it('returns true', () => {
				assert.equal(isChronological('-2184-01-01', '-2183-01-01'), true);

				// `new Date('-0044-01-01')` → Fri Jan 01 2044 00:00:00 GMT+0000 (GMT+00:00)
				// `new Date('-0000-01-01')` → Sat Jan 01 2000 00:00:00 GMT+0000 (GMT+00:00)
				assert.equal(isChronological('-0044-01-01', '-0000-01-01'), true);

				// `new Date('-0044-01-01')` → Fri Jan 01 2044 00:00:00 GMT+0000 (GMT+00:00)
				// `new Date('0000-01-01')` → Sat Jan 01 2000 00:00:00 GMT+0000 (GMT+00:00)
				assert.equal(isChronological('-0044-01-01', '0000-01-01'), true);
			});
		});

		describe('BCE date is equal to BCE date', () => {
			it('returns true', () => {
				assert.equal(isChronological('-2184-01-01', '-2184-01-01'), true);
			});
		});

		describe('BCE date is before CE date', () => {
			it('returns true', () => {
				assert.equal(isChronological('-2184-01-01', '1962-01-01'), true);

				// `new Date('-0044-01-01')` → Fri Jan 01 2044 00:00:00 GMT+0000 (GMT+00:00)
				assert.equal(isChronological('-0044-01-01', '1962-01-01'), true);
			});
		});

		describe('non-BCE/CE date is before CE date', () => {
			it('returns true', () => {
				// `new Date('-0000-01-01')` → Sat Jan 01 2000 00:00:00 GMT+0000 (GMT+00:00)
				assert.equal(isChronological('-0000-01-01', '1962-01-01'), true);

				// `new Date('0000-01-01')` → Sat Jan 01 2000 00:00:00 GMT+0000 (GMT+00:00)
				assert.equal(isChronological('0000-01-01', '1962-01-01'), true);
			});
		});

		describe('CE date is before CE date', () => {
			it('returns true', () => {
				assert.equal(isChronological('1962-01-01', '1963-01-01'), true);

				// `new Date(79, 07, 24)` → Fri Aug 24 1979 00:00:00 GMT+0100 (British Summer Time)
				assert.equal(isChronological('0079-08-24', '1962-01-01'), true);
			});
		});

		describe('CE date is equal to CE date', () => {
			it('returns true', () => {
				assert.equal(isChronological('1962-01-01', '1962-01-01'), true);
			});
		});
	});

	describe('date x is after date y', () => {
		describe('BCE date is after BCE date', () => {
			it('returns false', () => {
				assert.equal(isChronological('-2183-01-01', '-2184-01-01'), false);
			});
		});

		describe('CE date is after BCE date', () => {
			it('returns false', () => {
				assert.equal(isChronological('1962-01-01', '-2184-01-01'), false);
			});
		});

		describe('CE date is after CE date', () => {
			it('returns false', () => {
				assert.equal(isChronological('1963-01-01', '1962-01-01'), false);
			});
		});
	});
});
