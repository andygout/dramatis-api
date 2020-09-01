import { expect } from 'chai';

import { getDuplicateIndices } from '../../../src/lib/get-duplicate-indices';

describe('Get Duplicate Indices module', () => {

	context('duplicates do not exist', () => {

		context('array items without differentiator', () => {

			it('returns an empty array', () => {

				const result = getDuplicateIndices(
					[
						{ name: 'Ian McKellen' },
						{ name: 'Patrick Stewart' },
						{ name: 'Simon Callow' },
						{ name: 'Ronald Pickup' }
					]
				);

				expect(result).to.deep.equal([]);

			});

		});

		context('array items with differentiator', () => {

			it('returns an empty array', () => {

				const result = getDuplicateIndices(
					[
						{ name: 'Lucia', differentiator: '1' },
						{ name: 'Dunya', differentiator: '' },
						{ name: 'Karolina', differentiator: '' },
						{ name: 'Karl', differentiator: '' },
						{ name: 'Karolina', differentiator: '1' },
						{ name: 'Lucia', differentiator: '2' }
					]
				);

				expect(result).to.deep.equal([]);

			});

		});

	});

	context('duplicates exist', () => {

		context('array items without differentiator', () => {

			context('duplicates of a single name', () => {

				it('returns an array of indices of duplicate name values', () => {

					const result = getDuplicateIndices(
						[
							{ name: 'Ian McKellen' },
							{ name: 'Patrick Stewart' },
							{ name: 'Simon Callow' },
							{ name: 'Ian McKellen' },
							{ name: 'Ronald Pickup' }
						]
					);

					expect(result).to.deep.equal([0, 3]);

				});

			});

			context('duplicates of two different names', () => {

				it('returns an array of indices of duplicate name values', () => {

					const result = getDuplicateIndices(
						[
							{ name: 'Ian McKellen' },
							{ name: 'Patrick Stewart' },
							{ name: 'Simon Callow' },
							{ name: 'Patrick Stewart' },
							{ name: 'Ian McKellen' },
							{ name: 'Ronald Pickup' }
						]
					);

					expect(result).to.deep.equal([0, 1, 3, 4]);

				});

			});

			context('duplicates of two different names, and a pair of duplicate empty strings', () => {

				it('returns an array of indices of duplicate name values only, ignoring the empty strings', () => {

					const result = getDuplicateIndices(
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

					expect(result).to.deep.equal([0, 2, 5, 6]);

				});

			});

		});

		context('array items with differentiator', () => {

			context('duplicates of a single name', () => {

				it('returns an array of indices of duplicate name values', () => {

					const result = getDuplicateIndices(
						[
							{ name: 'Lucia', differentiator: '1' },
							{ name: 'Dunya', differentiator: '' },
							{ name: 'Karl', differentiator: '' },
							{ name: 'Lucia', differentiator: '1' }
						]
					);

					expect(result).to.deep.equal([0, 3]);

				});

			});

			context('duplicates of two different names', () => {

				it('returns an array of indices of duplicate name values', () => {

					const result = getDuplicateIndices(
						[
							{ name: 'Lucia', differentiator: '1' },
							{ name: 'Dunya', differentiator: '' },
							{ name: 'Karolina', differentiator: '' },
							{ name: 'Karl', differentiator: '' },
							{ name: 'Karolina', differentiator: '' },
							{ name: 'Lucia', differentiator: '1' }
						]
					);

					expect(result).to.deep.equal([0, 2, 4, 5]);

				});

			});

			context('duplicates of two different names, and a pair of duplicate empty strings', () => {

				it('returns an array of indices of duplicate name values only, ignoring the empty strings', () => {

					const result = getDuplicateIndices(
						[
							{ name: 'Lucia', differentiator: '1' },
							{ name: '', differentiator: '' },
							{ name: 'Dunya', differentiator: '' },
							{ name: 'Karolina', differentiator: '' },
							{ name: '', differentiator: '' },
							{ name: 'Karl', differentiator: '' },
							{ name: 'Karolina', differentiator: '' },
							{ name: 'Lucia', differentiator: '1' }
						]
					);

					expect(result).to.deep.equal([0, 3, 6, 7]);

				});

			});

		});

	});

});
