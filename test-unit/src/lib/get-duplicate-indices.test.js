import { expect } from 'chai';

import {
	getDuplicateBaseInstanceIndices,
	getDuplicateCharacterIndices,
	getDuplicateRoleIndices,
	getDuplicateWriterIndices
} from '../../../src/lib/get-duplicate-indices';

describe('Get Duplicate Indices module', () => {

	describe('getDuplicateBaseInstanceIndices function', () => {

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

	describe('getDuplicateCharacterIndices function', () => {

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

	describe('getDuplicateRoleIndices function', () => {

		context('duplicates do not exist', () => {

			it('returns an empty array', () => {

				const result = getDuplicateRoleIndices(
					[
						{ name: 'Foo', characterName: '', characterDifferentiator: '', qualifier: '' },
						{ name: 'Foo', characterName: '', characterDifferentiator: '1', qualifier: '' },
						{ name: 'Foo', characterName: '', characterDifferentiator: '2', qualifier: '' },
						{ name: 'Foo', characterName: '', characterDifferentiator: '', qualifier: 'younger' },
						{ name: 'Foo', characterName: '', characterDifferentiator: '', qualifier: 'older' },
						{ name: 'Foo', characterName: '', characterDifferentiator: '1', qualifier: 'younger' },
						{ name: 'Foo', characterName: '', characterDifferentiator: '1', qualifier: 'older' },
						{ name: 'Foo', characterName: '', characterDifferentiator: '2', qualifier: 'younger' },
						{ name: 'Foo', characterName: '', characterDifferentiator: '2', qualifier: 'older' },
						{ name: 'Bar', characterName: '', characterDifferentiator: '', qualifier: '' },
						{ name: 'Bar', characterName: '', characterDifferentiator: '1', qualifier: '' },
						{ name: 'Bar', characterName: '', characterDifferentiator: '2', qualifier: '' },
						{ name: 'Bar', characterName: '', characterDifferentiator: '', qualifier: 'younger' },
						{ name: 'Bar', characterName: '', characterDifferentiator: '', qualifier: 'older' },
						{ name: 'Bar', characterName: '', characterDifferentiator: '1', qualifier: 'younger' },
						{ name: 'Bar', characterName: '', characterDifferentiator: '1', qualifier: 'older' },
						{ name: 'Bar', characterName: '', characterDifferentiator: '2', qualifier: 'younger' },
						{ name: 'Bar', characterName: '', characterDifferentiator: '2', qualifier: 'older' }
					]
				);

				expect(result).to.deep.equal([]);

			});

		});

		context('duplicates exist', () => {

			it('returns an array of indices of duplicate items, ignoring items with empty string name values', () => {

				const result = getDuplicateRoleIndices(
					[
						{ name: 'Foo', characterName: '', characterDifferentiator: '1', qualifier: 'younger' },
						{ name: 'Bar', characterName: '', characterDifferentiator: '1', qualifier: 'younger' },
						{ name: '', characterName: '', characterDifferentiator: '1', qualifier: 'younger' },
						{ name: 'Baz', characterName: '', characterDifferentiator: '1', qualifier: 'younger' },
						{ name: 'Foo', characterName: '', characterDifferentiator: '1', qualifier: 'younger' },
						{ name: 'Bar', characterName: '', characterDifferentiator: '1', qualifier: 'younger' },
						{ name: '', characterName: '', characterDifferentiator: '1', qualifier: 'younger' },
						{ name: 'Qux', characterName: '', characterDifferentiator: '1', qualifier: 'younger' }
					]
				);

				expect(result).to.deep.equal([0, 1, 4, 5]);

			});

			it('considers entries where the name value matches (even when characterName value differs) as duplicates', () => {

				const result = getDuplicateRoleIndices(
					[
						{ name: 'Foo', characterName: 'Bar', characterDifferentiator: '', qualifier: '' },
						{ name: 'Foo', characterName: 'Baz', characterDifferentiator: '', qualifier: '' }
					]
				);

				expect(result).to.deep.equal([0, 1]);

			});

			it('considers entries where the evaluated character name matches as duplicates', () => {

				const result = getDuplicateRoleIndices(
					[
						{ name: 'Foo', characterName: '', characterDifferentiator: '', qualifier: '' },
						{ name: 'Bar', characterName: 'Foo', characterDifferentiator: '', qualifier: '' },
						{ name: 'Baz', characterName: '', characterDifferentiator: '', qualifier: '' },
						{ name: 'Qux', characterName: 'Quux', characterDifferentiator: '', qualifier: '' },
						{ name: 'Quuz', characterName: 'Quux', characterDifferentiator: '', qualifier: '' }
					]
				);

				expect(result).to.deep.equal([0, 1, 3, 4]);

			});

		});

	});

	describe('getDuplicateWriterIndices function', () => {

		context('duplicates do not exist', () => {

			it('returns an empty array', () => {

				const result = getDuplicateWriterIndices(
					[
						{ name: 'Foo', differentiator: '', model: '' },
						{ name: 'Foo', differentiator: '1', model: '' },
						{ name: 'Foo', differentiator: '2', model: '' },
						{ name: 'Foo', differentiator: '', model: 'material' },
						{ name: 'Foo', differentiator: '1', model: 'material' },
						{ name: 'Foo', differentiator: '2', model: 'material' },
						{ name: 'Bar', differentiator: '', model: '' },
						{ name: 'Bar', differentiator: '1', model: '' },
						{ name: 'Bar', differentiator: '2', model: '' },
						{ name: 'Bar', differentiator: '', model: 'material' },
						{ name: 'Bar', differentiator: '1', model: 'material' },
						{ name: 'Bar', differentiator: '2', model: 'material' }
					]
				);

				expect(result).to.deep.equal([]);

			});

		});

		context('duplicates exist', () => {

			it('returns an array of indices of duplicate items, ignoring items with empty string name values', () => {

				const result = getDuplicateWriterIndices(
					[
						{ name: 'Foo', differentiator: '1', qualifier: '' },
						{ name: 'Bar', differentiator: '1', qualifier: 'material' },
						{ name: '', differentiator: '1', qualifier: '' },
						{ name: 'Baz', differentiator: '1', qualifier: '' },
						{ name: 'Foo', differentiator: '1', qualifier: '' },
						{ name: 'Bar', differentiator: '1', qualifier: 'material' },
						{ name: '', differentiator: '1', qualifier: '' },
						{ name: 'Qux', differentiator: '1', qualifier: '' }
					]
				);

				expect(result).to.deep.equal([0, 1, 4, 5]);

			});

		});

	});

});
