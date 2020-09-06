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

		context('array items with qualifier', () => {

			it('returns an empty array', () => {

				const result = getDuplicateIndices(
					[
						{ name: 'The Piper', qualifier: '' },
						{ name: 'Esme', qualifier: 'younger' },
						{ name: 'Jan', qualifier: '' },
						{ name: 'Max', qualifier: '' },
						{ name: 'Esme', qualifier: 'older' },
						{ name: 'Alice', qualifier: '' }
					]
				);

				expect(result).to.deep.equal([]);

			});

		});

		context('array items with differentiator and qualifier', () => {

			it('returns an empty array', () => {

				const result = getDuplicateIndices(
					[
						{ name: 'Foo', differentiator: '', qualifier: '' },
						{ name: 'Foo', differentiator: '1', qualifier: '' },
						{ name: 'Foo', differentiator: '2', qualifier: '' },
						{ name: 'Foo', differentiator: '', qualifier: 'younger' },
						{ name: 'Foo', differentiator: '', qualifier: 'older' },
						{ name: 'Foo', differentiator: '1', qualifier: 'younger' },
						{ name: 'Foo', differentiator: '1', qualifier: 'older' },
						{ name: 'Foo', differentiator: '2', qualifier: 'younger' },
						{ name: 'Foo', differentiator: '2', qualifier: 'older' },
						{ name: 'Bar', differentiator: '', qualifier: '' },
						{ name: 'Bar', differentiator: '1', qualifier: '' },
						{ name: 'Bar', differentiator: '2', qualifier: '' },
						{ name: 'Bar', differentiator: '', qualifier: 'younger' },
						{ name: 'Bar', differentiator: '', qualifier: 'older' },
						{ name: 'Bar', differentiator: '1', qualifier: 'younger' },
						{ name: 'Bar', differentiator: '1', qualifier: 'older' },
						{ name: 'Bar', differentiator: '2', qualifier: 'younger' },
						{ name: 'Bar', differentiator: '2', qualifier: 'older' }
					]
				);

				expect(result).to.deep.equal([]);

			});

		});

	});

	context('duplicates exist', () => {

		context('array items without differentiator or qualifier', () => {

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

		context('array items with qualifier', () => {

			context('single pair of duplicate items', () => {

				it('returns an array of indices of duplicate items', () => {

					const result = getDuplicateIndices(
						[
							{ name: 'The Piper', qualifier: '' },
							{ name: 'Esme', qualifier: 'younger' },
							{ name: 'Jan', qualifier: '' },
							{ name: 'Max', qualifier: '' },
							{ name: 'Esme', qualifier: 'younger' },
							{ name: 'Alice', qualifier: '' }
						]
					);

					expect(result).to.deep.equal([1, 4]);

				});

			});

			context('two pairs of duplicate items', () => {

				it('returns an array of indices of duplicate items', () => {

					const result = getDuplicateIndices(
						[
							{ name: 'The Piper', qualifier: '' },
							{ name: 'Esme', qualifier: 'younger' },
							{ name: 'Jan', qualifier: '' },
							{ name: 'Max', qualifier: '' },
							{ name: 'Jan', qualifier: '' },
							{ name: 'Esme', qualifier: 'younger' },
							{ name: 'Alice', qualifier: '' }
						]
					);

					expect(result).to.deep.equal([1, 2, 4, 5]);

				});

			});

			context('two pairs of duplicate items, and a single pair of duplicate items with empty string name values', () => {

				it('returns an array of indices of duplicate items, ignoring items with empty string name values', () => {

					const result = getDuplicateIndices(
						[
							{ name: 'The Piper', qualifier: '' },
							{ name: 'Esme', qualifier: 'younger' },
							{ name: '', qualifier: '' },
							{ name: 'Jan', qualifier: '' },
							{ name: 'Max', qualifier: '' },
							{ name: '', qualifier: '' },
							{ name: 'Jan', qualifier: '' },
							{ name: 'Esme', qualifier: 'younger' },
							{ name: 'Alice', qualifier: '' }
						]
					);

					expect(result).to.deep.equal([1, 3, 6, 7]);

				});

			});

		});

		context('array items with differentiator and qualifier', () => {

			context('single pair of duplicate items', () => {

				it('returns an array of indices of duplicate items', () => {

					const result = getDuplicateIndices(
						[
							{ name: 'Foo', differentiator: '1', qualifier: 'younger' },
							{ name: 'Bar', differentiator: '1', qualifier: 'younger' },
							{ name: 'Foo', differentiator: '1', qualifier: 'younger' },
							{ name: 'Baz', differentiator: '1', qualifier: 'younger' }
						]
					);

					expect(result).to.deep.equal([0, 2]);

				});

			});

			context('two pairs of duplicate items', () => {

				it('returns an array of indices of duplicate items', () => {

					const result = getDuplicateIndices(
						[
							{ name: 'Foo', differentiator: '1', qualifier: 'younger' },
							{ name: 'Bar', differentiator: '1', qualifier: 'younger' },
							{ name: 'Baz', differentiator: '1', qualifier: 'younger' },
							{ name: 'Foo', differentiator: '1', qualifier: 'younger' },
							{ name: 'Bar', differentiator: '1', qualifier: 'younger' },
							{ name: 'Qux', differentiator: '1', qualifier: 'younger' }
						]
					);

					expect(result).to.deep.equal([0, 1, 3, 4]);

				});

			});

			context('two pairs of duplicate items, and a single pair of duplicate items with empty string name values', () => {

				it('returns an array of indices of duplicate items, ignoring items with empty string name values', () => {

					const result = getDuplicateIndices(
						[
							{ name: 'Foo', differentiator: '1', qualifier: 'younger' },
							{ name: 'Bar', differentiator: '1', qualifier: 'younger' },
							{ name: '', differentiator: '1', qualifier: 'younger' },
							{ name: 'Baz', differentiator: '1', qualifier: 'younger' },
							{ name: 'Foo', differentiator: '1', qualifier: 'younger' },
							{ name: 'Bar', differentiator: '1', qualifier: 'younger' },
							{ name: '', differentiator: '1', qualifier: 'younger' },
							{ name: 'Qux', differentiator: '1', qualifier: 'younger' }
						]
					);

					expect(result).to.deep.equal([0, 1, 4, 5]);

				});

			});

		});

	});

});
