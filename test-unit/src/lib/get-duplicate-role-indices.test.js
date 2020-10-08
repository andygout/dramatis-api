import { expect } from 'chai';

import { getDuplicateRoleIndices } from '../../../src/lib/get-duplicate-role-indices';

describe('Get Duplicate Role Indices module', () => {

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
