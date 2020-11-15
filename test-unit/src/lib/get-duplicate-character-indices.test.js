import { expect } from 'chai';

import { getDuplicateCharacterIndices } from '../../../src/lib/get-duplicate-character-indices';

describe('Get Duplicate Character Indices module', () => {

	context('duplicates do not exist', () => {

		it('returns an empty array', () => {

			const result = getDuplicateCharacterIndices(
				[
					{ name: 'Foo', underlyingName: '', differentiator: '', qualifier: '' },
					{ name: 'Foo', underlyingName: '', differentiator: '1', qualifier: '' },
					{ name: 'Foo', underlyingName: '', differentiator: '2', qualifier: '' },
					{ name: 'Foo', underlyingName: '', differentiator: '', qualifier: 'younger' },
					{ name: 'Foo', underlyingName: '', differentiator: '', qualifier: 'older' },
					{ name: 'Foo', underlyingName: '', differentiator: '1', qualifier: 'younger' },
					{ name: 'Foo', underlyingName: '', differentiator: '1', qualifier: 'older' },
					{ name: 'Foo', underlyingName: '', differentiator: '2', qualifier: 'younger' },
					{ name: 'Foo', underlyingName: '', differentiator: '2', qualifier: 'older' },
					{ name: 'Bar', underlyingName: '', differentiator: '', qualifier: '' },
					{ name: 'Bar', underlyingName: '', differentiator: '1', qualifier: '' },
					{ name: 'Bar', underlyingName: '', differentiator: '2', qualifier: '' },
					{ name: 'Bar', underlyingName: '', differentiator: '', qualifier: 'younger' },
					{ name: 'Bar', underlyingName: '', differentiator: '', qualifier: 'older' },
					{ name: 'Bar', underlyingName: '', differentiator: '1', qualifier: 'younger' },
					{ name: 'Bar', underlyingName: '', differentiator: '1', qualifier: 'older' },
					{ name: 'Bar', underlyingName: '', differentiator: '2', qualifier: 'younger' },
					{ name: 'Bar', underlyingName: '', differentiator: '2', qualifier: 'older' }
				]
			);

			expect(result).to.deep.equal([]);

		});

	});

	context('duplicates exist', () => {

		it('returns an array of indices of duplicate items, ignoring items with empty string name values', () => {

			const result = getDuplicateCharacterIndices(
				[
					{ name: 'Foo', underlyingName: '', differentiator: '1', qualifier: 'younger' },
					{ name: 'Bar', underlyingName: '', differentiator: '1', qualifier: 'younger' },
					{ name: '', underlyingName: '', differentiator: '1', qualifier: 'younger' },
					{ name: 'Baz', underlyingName: '', differentiator: '1', qualifier: 'younger' },
					{ name: 'Foo', underlyingName: '', differentiator: '1', qualifier: 'younger' },
					{ name: 'Bar', underlyingName: '', differentiator: '1', qualifier: 'younger' },
					{ name: '', underlyingName: '', differentiator: '1', qualifier: 'younger' },
					{ name: 'Qux', underlyingName: '', differentiator: '1', qualifier: 'younger' }
				]
			);

			expect(result).to.deep.equal([0, 1, 4, 5]);

		});

		it('considers entries where the name value matches (even when underlyingName value differs) as duplicates', () => {

			const result = getDuplicateCharacterIndices(
				[
					{ name: 'Foo', underlyingName: 'Bar', differentiator: '', qualifier: '' },
					{ name: 'Foo', underlyingName: 'Baz', differentiator: '', qualifier: '' }
				]
			);

			expect(result).to.deep.equal([0, 1]);

		});

		it('considers entries where the evaluated underlying name matches as duplicates', () => {

			const result = getDuplicateCharacterIndices(
				[
					{ name: 'Foo', underlyingName: '', differentiator: '', qualifier: '' },
					{ name: 'Bar', underlyingName: 'Foo', differentiator: '', qualifier: '' },
					{ name: 'Baz', underlyingName: '', differentiator: '', qualifier: '' },
					{ name: 'Qux', underlyingName: 'Quux', differentiator: '', qualifier: '' },
					{ name: 'Quuz', underlyingName: 'Quux', differentiator: '', qualifier: '' }
				]
			);

			expect(result).to.deep.equal([0, 1, 3, 4]);

		});

	});

});
