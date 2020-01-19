import { expect } from 'chai';

import { getDuplicateNameIndices } from '../../../server/lib/get-duplicate-name-indices';

describe('Get Duplicate Name Indices module', () => {

	context('duplicates do not exist', () => {

		it('returns an empty array', () => {

			const result = getDuplicateNameIndices(
				[
					{ name: 'Ian McKellen' },
					{ name: 'Patrick Stewart' },
					{ name: 'Simon Callow' },
					{ name: 'Ronald Pickup' }
				]
			);

			expect(result).to.deep.eq([]);

		});

	});

	context('duplicates exist', () => {

		context('duplicates of a single name', () => {

			it('returns an array of indices of duplicate name values', () => {

				const result = getDuplicateNameIndices(
					[
						{ name: 'Ian McKellen' },
						{ name: 'Patrick Stewart' },
						{ name: 'Simon Callow' },
						{ name: 'Ian McKellen' },
						{ name: 'Ronald Pickup' }
					]
				);

				expect(result).to.deep.eq([0, 3]);

			});

		});

		context('duplicates of two different names', () => {

			it('returns an array of indices of duplicate name values', () => {

				const result = getDuplicateNameIndices(
					[
						{ name: 'Ian McKellen' },
						{ name: 'Patrick Stewart' },
						{ name: 'Simon Callow' },
						{ name: 'Patrick Stewart' },
						{ name: 'Ian McKellen' },
						{ name: 'Ronald Pickup' }
					]
				);

				expect(result).to.deep.eq([0, 1, 3, 4]);

			});

		});

		context('duplicates of two different names, and a pair of duplicate empty strings', () => {

			it('returns an array of indices of duplicate name values only, ignoring the empty strings', () => {

				const result = getDuplicateNameIndices(
					[
						{ name: 'Ian McKellen' },
						{ name: '' },
						{ name: 'Patrick Stewart' },
						{ name: 'Simon Callow' },
						{ name: '' },
						{ name: 'Patrick Stewart' },
						{ name: 'Ian McKellen' },
						{ name: 'Ronald Pickup' }
					]
				);

				expect(result).to.deep.eq([0, 2, 5, 6]);

			});

		});

	});

});
