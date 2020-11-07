import { expect } from 'chai';

import { getDuplicateWriterIndices } from '../../../src/lib/get-duplicate-writer-indices';

describe('Get Duplicate Writer Indices module', () => {

	context('duplicates do not exist', () => {

		it('returns an empty array', () => {

			const result = getDuplicateWriterIndices(
				[
					{ name: 'Foo', differentiator: '', group: '' },
					{ name: 'Foo', differentiator: '1', group: '' },
					{ name: 'Foo', differentiator: '2', group: '' },
					{ name: 'Foo', differentiator: '', group: 'adaptation by' },
					{ name: 'Foo', differentiator: '', group: 'translated by' },
					{ name: 'Foo', differentiator: '1', group: 'adaptation by' },
					{ name: 'Foo', differentiator: '1', group: 'translated by' },
					{ name: 'Foo', differentiator: '2', group: 'adaptation by' },
					{ name: 'Foo', differentiator: '2', group: 'translated by' },
					{ name: 'Bar', differentiator: '', group: '' },
					{ name: 'Bar', differentiator: '1', group: '' },
					{ name: 'Bar', differentiator: '2', group: '' },
					{ name: 'Bar', differentiator: '', group: 'adaptation by' },
					{ name: 'Bar', differentiator: '', group: 'translated by' },
					{ name: 'Bar', differentiator: '1', group: 'adaptation by' },
					{ name: 'Bar', differentiator: '1', group: 'translated by' },
					{ name: 'Bar', differentiator: '2', group: 'adaptation by' },
					{ name: 'Bar', differentiator: '2', group: 'translated by' }
				]
			);

			expect(result).to.deep.equal([]);

		});

	});

	context('duplicates exist', () => {

		it('returns an array of indices of duplicate items, ignoring items with empty string name values', () => {

			const result = getDuplicateWriterIndices(
				[
					{ name: 'Foo', differentiator: '1', group: 'adaptation by' },
					{ name: 'Bar', differentiator: '1', group: 'adaptation by' },
					{ name: '', differentiator: '1', group: 'adaptation by' },
					{ name: 'Baz', differentiator: '1', group: 'adaptation by' },
					{ name: 'Foo', differentiator: '1', group: 'adaptation by' },
					{ name: 'Bar', differentiator: '1', group: 'adaptation by' },
					{ name: '', differentiator: '1', group: 'adaptation by' },
					{ name: 'Qux', differentiator: '1', group: 'adaptation by' }
				]
			);

			expect(result).to.deep.equal([0, 1, 4, 5]);

		});

	});

});
