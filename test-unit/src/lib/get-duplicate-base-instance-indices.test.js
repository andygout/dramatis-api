import { expect } from 'chai';

import { getDuplicateBaseInstanceIndices } from '../../../src/lib/get-duplicate-base-instance-indices';

describe('Get Duplicate Base Instance Indices module', () => {

	context('duplicates do not exist', () => {

		it('returns an empty array', () => {

			const result = getDuplicateBaseInstanceIndices(
				[
					{ name: 'Foo', differentiator: '1' },
					{ name: 'Bar', differentiator: '' },
					{ name: 'Baz', differentiator: '' },
					{ name: 'Qux', differentiator: '' },
					{ name: 'Baz', differentiator: '1' },
					{ name: 'Foo', differentiator: '2' }
				]
			);

			expect(result).to.deep.equal([]);

		});

	});

	context('duplicates exist', () => {

		it('returns an array of indices of duplicate items, ignoring items with empty string name values', () => {

			const result = getDuplicateBaseInstanceIndices(
				[
					{ name: 'Foo', differentiator: '1' },
					{ name: '', differentiator: '' },
					{ name: 'Bar', differentiator: '' },
					{ name: 'Baz', differentiator: '' },
					{ name: '', differentiator: '' },
					{ name: 'Qux', differentiator: '' },
					{ name: 'Baz', differentiator: '' },
					{ name: 'Foo', differentiator: '1' }
				]
			);

			expect(result).to.deep.equal([0, 3, 6, 7]);

		});

	});

});
