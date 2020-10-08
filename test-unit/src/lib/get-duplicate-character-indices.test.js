import { expect } from 'chai';

import { getDuplicateCharacterIndices } from '../../../src/lib/get-duplicate-character-indices';

describe('Get Duplicate Character Indices module', () => {

	context('duplicates do not exist', () => {

		it('returns an empty array', () => {

			const result = getDuplicateCharacterIndices(
				[
					{ name: 'Foo', underlyingName: '', differentiator: '', qualifier: '', group: '' },
					{ name: 'Foo', underlyingName: '', differentiator: '1', qualifier: '', group: '' },
					{ name: 'Foo', underlyingName: '', differentiator: '2', qualifier: '', group: '' },
					{ name: 'Foo', underlyingName: '', differentiator: '', qualifier: 'younger', group: '' },
					{ name: 'Foo', underlyingName: '', differentiator: '', qualifier: 'older', group: '' },
					{ name: 'Foo', underlyingName: '', differentiator: '', qualifier: '', group: 'Romans' },
					{ name: 'Foo', underlyingName: '', differentiator: '', qualifier: '', group: 'Goths' },
					{ name: 'Foo', underlyingName: '', differentiator: '', qualifier: 'younger', group: 'Romans' },
					{ name: 'Foo', underlyingName: '', differentiator: '', qualifier: 'younger', group: 'Goths' },
					{ name: 'Foo', underlyingName: '', differentiator: '', qualifier: 'older', group: 'Romans' },
					{ name: 'Foo', underlyingName: '', differentiator: '', qualifier: 'older', group: 'Goths' },
					{ name: 'Foo', underlyingName: '', differentiator: '1', qualifier: 'younger', group: '' },
					{ name: 'Foo', underlyingName: '', differentiator: '1', qualifier: 'older', group: '' },
					{ name: 'Foo', underlyingName: '', differentiator: '1', qualifier: '', group: 'Romans' },
					{ name: 'Foo', underlyingName: '', differentiator: '1', qualifier: '', group: 'Goths' },
					{ name: 'Foo', underlyingName: '', differentiator: '1', qualifier: 'younger', group: 'Romans' },
					{ name: 'Foo', underlyingName: '', differentiator: '1', qualifier: 'younger', group: 'Goths' },
					{ name: 'Foo', underlyingName: '', differentiator: '1', qualifier: 'older', group: 'Romans' },
					{ name: 'Foo', underlyingName: '', differentiator: '1', qualifier: 'older', group: 'Goths' },
					{ name: 'Foo', underlyingName: '', differentiator: '2', qualifier: 'younger', group: '' },
					{ name: 'Foo', underlyingName: '', differentiator: '2', qualifier: 'older', group: '' },
					{ name: 'Foo', underlyingName: '', differentiator: '2', qualifier: '', group: 'Romans' },
					{ name: 'Foo', underlyingName: '', differentiator: '2', qualifier: '', group: 'Goths' },
					{ name: 'Foo', underlyingName: '', differentiator: '2', qualifier: 'younger', group: 'Romans' },
					{ name: 'Foo', underlyingName: '', differentiator: '2', qualifier: 'younger', group: 'Goths' },
					{ name: 'Foo', underlyingName: '', differentiator: '2', qualifier: 'older', group: 'Romans' },
					{ name: 'Foo', underlyingName: '', differentiator: '2', qualifier: 'older', group: 'Goths' },
					{ name: 'Bar', underlyingName: '', differentiator: '', qualifier: '', group: '' },
					{ name: 'Bar', underlyingName: '', differentiator: '1', qualifier: '', group: '' },
					{ name: 'Bar', underlyingName: '', differentiator: '2', qualifier: '', group: '' },
					{ name: 'Bar', underlyingName: '', differentiator: '', qualifier: 'younger', group: '' },
					{ name: 'Bar', underlyingName: '', differentiator: '', qualifier: 'older', group: '' },
					{ name: 'Bar', underlyingName: '', differentiator: '', qualifier: '', group: 'Romans' },
					{ name: 'Bar', underlyingName: '', differentiator: '', qualifier: '', group: 'Goths' },
					{ name: 'Bar', underlyingName: '', differentiator: '', qualifier: 'younger', group: 'Romans' },
					{ name: 'Bar', underlyingName: '', differentiator: '', qualifier: 'younger', group: 'Goths' },
					{ name: 'Bar', underlyingName: '', differentiator: '', qualifier: 'older', group: 'Romans' },
					{ name: 'Bar', underlyingName: '', differentiator: '', qualifier: 'older', group: 'Goths' },
					{ name: 'Bar', underlyingName: '', differentiator: '1', qualifier: 'younger', group: '' },
					{ name: 'Bar', underlyingName: '', differentiator: '1', qualifier: 'older', group: '' },
					{ name: 'Bar', underlyingName: '', differentiator: '1', qualifier: '', group: 'Romans' },
					{ name: 'Bar', underlyingName: '', differentiator: '1', qualifier: '', group: 'Goths' },
					{ name: 'Bar', underlyingName: '', differentiator: '1', qualifier: 'younger', group: 'Romans' },
					{ name: 'Bar', underlyingName: '', differentiator: '1', qualifier: 'younger', group: 'Goths' },
					{ name: 'Bar', underlyingName: '', differentiator: '1', qualifier: 'older', group: 'Romans' },
					{ name: 'Bar', underlyingName: '', differentiator: '1', qualifier: 'older', group: 'Goths' },
					{ name: 'Bar', underlyingName: '', differentiator: '2', qualifier: 'younger', group: '' },
					{ name: 'Bar', underlyingName: '', differentiator: '2', qualifier: 'older', group: '' },
					{ name: 'Bar', underlyingName: '', differentiator: '2', qualifier: '', group: 'Romans' },
					{ name: 'Bar', underlyingName: '', differentiator: '2', qualifier: '', group: 'Goths' },
					{ name: 'Bar', underlyingName: '', differentiator: '2', qualifier: 'younger', group: 'Romans' },
					{ name: 'Bar', underlyingName: '', differentiator: '2', qualifier: 'younger', group: 'Goths' },
					{ name: 'Bar', underlyingName: '', differentiator: '2', qualifier: 'older', group: 'Romans' },
					{ name: 'Bar', underlyingName: '', differentiator: '2', qualifier: 'older', group: 'Goths' }
				]
			);

			expect(result).to.deep.equal([]);

		});

	});

	context('duplicates exist', () => {

		it('returns an array of indices of duplicate items, ignoring items with empty string name values', () => {

			const result = getDuplicateCharacterIndices(
				[
					{ name: 'Foo', underlyingName: '', differentiator: '1', qualifier: 'younger', group: 'Romans' },
					{ name: 'Bar', underlyingName: '', differentiator: '1', qualifier: 'younger', group: 'Romans' },
					{ name: '', underlyingName: '', differentiator: '1', qualifier: 'younger', group: 'Romans' },
					{ name: 'Baz', underlyingName: '', differentiator: '1', qualifier: 'younger', group: 'Romans' },
					{ name: 'Foo', underlyingName: '', differentiator: '1', qualifier: 'younger', group: 'Romans' },
					{ name: 'Bar', underlyingName: '', differentiator: '1', qualifier: 'younger', group: 'Romans' },
					{ name: '', underlyingName: '', differentiator: '1', qualifier: 'younger', group: 'Romans' },
					{ name: 'Qux', underlyingName: '', differentiator: '1', qualifier: 'younger', group: 'Romans' }
				]
			);

			expect(result).to.deep.equal([0, 1, 4, 5]);

		});

		it('considers entries where the name value matches (even when underlyingName value differs) as duplicates', () => {

			const result = getDuplicateCharacterIndices(
				[
					{ name: 'Foo', underlyingName: 'Bar', differentiator: '', qualifier: '', group: '' },
					{ name: 'Foo', underlyingName: 'Baz', differentiator: '', qualifier: '', group: '' }
				]
			);

			expect(result).to.deep.equal([0, 1]);

		});

		it('considers entries where the evaluated underlying name matches as duplicates', () => {

			const result = getDuplicateCharacterIndices(
				[
					{ name: 'Foo', underlyingName: '', differentiator: '', qualifier: '', group: '' },
					{ name: 'Bar', underlyingName: 'Foo', differentiator: '', qualifier: '', group: '' },
					{ name: 'Baz', underlyingName: '', differentiator: '', qualifier: '', group: '' },
					{ name: 'Qux', underlyingName: 'Quux', differentiator: '', qualifier: '', group: '' },
					{ name: 'Quuz', underlyingName: 'Quux', differentiator: '', qualifier: '', group: '' }
				]
			);

			expect(result).to.deep.equal([0, 1, 3, 4]);

		});

	});

});
