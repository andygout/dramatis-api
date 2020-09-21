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
						{ name: 'Cinna', differentiator: '1' },
						{ name: 'Julius Caesar', differentiator: '' },
						{ name: 'Mark Antony', differentiator: '' },
						{ name: 'Soothsayer', differentiator: '' },
						{ name: 'Mark Antony', differentiator: '1' },
						{ name: 'Cinna', differentiator: '2' }
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

		context('array items with group', () => {

			it('returns an empty array', () => {

				const result = getDuplicateIndices(
					[
						{ name: 'Alisa Kos', group: '' },
						{ name: 'Lucija Kos', group: '' },
						{ name: 'Aleksander King', group: '' },
						{ name: 'Alisa Kos', group: '2011' },
						{ name: 'Lucija Kos', group: '2011' },
						{ name: 'Aleksander King', group: '1990' },
						{ name: 'Alisa Kos', group: '1990' },
						{ name: 'Lucija Kos', group: '1990' },
						{ name: 'Aleksander King', group: '1945' }
					]
				);

				expect(result).to.deep.equal([]);

			});

		});

		context('array items with differentiator, qualifier, and group', () => {

			it('returns an empty array', () => {

				const result = getDuplicateIndices(
					[
						{ name: 'Foo', differentiator: '', qualifier: '', group: '' },
						{ name: 'Foo', differentiator: '1', qualifier: '', group: '' },
						{ name: 'Foo', differentiator: '2', qualifier: '', group: '' },
						{ name: 'Foo', differentiator: '', qualifier: 'younger', group: '' },
						{ name: 'Foo', differentiator: '', qualifier: 'older', group: '' },
						{ name: 'Foo', differentiator: '', qualifier: '', group: 'Romans' },
						{ name: 'Foo', differentiator: '', qualifier: '', group: 'Goths' },
						{ name: 'Foo', differentiator: '', qualifier: 'younger', group: 'Romans' },
						{ name: 'Foo', differentiator: '', qualifier: 'younger', group: 'Goths' },
						{ name: 'Foo', differentiator: '', qualifier: 'older', group: 'Romans' },
						{ name: 'Foo', differentiator: '', qualifier: 'older', group: 'Goths' },
						{ name: 'Foo', differentiator: '1', qualifier: 'younger', group: '' },
						{ name: 'Foo', differentiator: '1', qualifier: 'older', group: '' },
						{ name: 'Foo', differentiator: '1', qualifier: '', group: 'Romans' },
						{ name: 'Foo', differentiator: '1', qualifier: '', group: 'Goths' },
						{ name: 'Foo', differentiator: '1', qualifier: 'younger', group: 'Romans' },
						{ name: 'Foo', differentiator: '1', qualifier: 'younger', group: 'Goths' },
						{ name: 'Foo', differentiator: '1', qualifier: 'older', group: 'Romans' },
						{ name: 'Foo', differentiator: '1', qualifier: 'older', group: 'Goths' },
						{ name: 'Foo', differentiator: '2', qualifier: 'younger', group: '' },
						{ name: 'Foo', differentiator: '2', qualifier: 'older', group: '' },
						{ name: 'Foo', differentiator: '2', qualifier: '', group: 'Romans' },
						{ name: 'Foo', differentiator: '2', qualifier: '', group: 'Goths' },
						{ name: 'Foo', differentiator: '2', qualifier: 'younger', group: 'Romans' },
						{ name: 'Foo', differentiator: '2', qualifier: 'younger', group: 'Goths' },
						{ name: 'Foo', differentiator: '2', qualifier: 'older', group: 'Romans' },
						{ name: 'Foo', differentiator: '2', qualifier: 'older', group: 'Goths' },
						{ name: 'Bar', differentiator: '', qualifier: '', group: '' },
						{ name: 'Bar', differentiator: '1', qualifier: '', group: '' },
						{ name: 'Bar', differentiator: '2', qualifier: '', group: '' },
						{ name: 'Bar', differentiator: '', qualifier: 'younger', group: '' },
						{ name: 'Bar', differentiator: '', qualifier: 'older', group: '' },
						{ name: 'Bar', differentiator: '', qualifier: '', group: 'Romans' },
						{ name: 'Bar', differentiator: '', qualifier: '', group: 'Goths' },
						{ name: 'Bar', differentiator: '', qualifier: 'younger', group: 'Romans' },
						{ name: 'Bar', differentiator: '', qualifier: 'younger', group: 'Goths' },
						{ name: 'Bar', differentiator: '', qualifier: 'older', group: 'Romans' },
						{ name: 'Bar', differentiator: '', qualifier: 'older', group: 'Goths' },
						{ name: 'Bar', differentiator: '1', qualifier: 'younger', group: '' },
						{ name: 'Bar', differentiator: '1', qualifier: 'older', group: '' },
						{ name: 'Bar', differentiator: '1', qualifier: '', group: 'Romans' },
						{ name: 'Bar', differentiator: '1', qualifier: '', group: 'Goths' },
						{ name: 'Bar', differentiator: '1', qualifier: 'younger', group: 'Romans' },
						{ name: 'Bar', differentiator: '1', qualifier: 'younger', group: 'Goths' },
						{ name: 'Bar', differentiator: '1', qualifier: 'older', group: 'Romans' },
						{ name: 'Bar', differentiator: '1', qualifier: 'older', group: 'Goths' },
						{ name: 'Bar', differentiator: '2', qualifier: 'younger', group: '' },
						{ name: 'Bar', differentiator: '2', qualifier: 'older', group: '' },
						{ name: 'Bar', differentiator: '2', qualifier: '', group: 'Romans' },
						{ name: 'Bar', differentiator: '2', qualifier: '', group: 'Goths' },
						{ name: 'Bar', differentiator: '2', qualifier: 'younger', group: 'Romans' },
						{ name: 'Bar', differentiator: '2', qualifier: 'younger', group: 'Goths' },
						{ name: 'Bar', differentiator: '2', qualifier: 'older', group: 'Romans' },
						{ name: 'Bar', differentiator: '2', qualifier: 'older', group: 'Goths' }
					]
				);

				expect(result).to.deep.equal([]);

			});

		});

	});

	context('duplicates exist', () => {

		context('array items without differentiator or qualifier', () => {

			context('single pair of duplicate items', () => {

				it('returns an array of indices of duplicate items', () => {

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

			context('two pairs of duplicate items', () => {

				it('returns an array of indices of duplicate items', () => {

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

			context('two pairs of duplicate items, and a single pair of duplicate items with empty string name values', () => {

				it('returns an array of indices of duplicate items, ignoring items with empty string name values', () => {

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

			context('single pair of duplicate items', () => {

				it('returns an array of indices of duplicate items', () => {

					const result = getDuplicateIndices(
						[
							{ name: 'Cinna', differentiator: '1' },
							{ name: 'Julius Caesar', differentiator: '' },
							{ name: 'Soothsayer', differentiator: '' },
							{ name: 'Cinna', differentiator: '1' }
						]
					);

					expect(result).to.deep.equal([0, 3]);

				});

			});

			context('two pairs of duplicate items', () => {

				it('returns an array of indices of duplicate items', () => {

					const result = getDuplicateIndices(
						[
							{ name: 'Cinna', differentiator: '1' },
							{ name: 'Julius Caesar', differentiator: '' },
							{ name: 'Mark Antony', differentiator: '' },
							{ name: 'Soothsayer', differentiator: '' },
							{ name: 'Mark Antony', differentiator: '' },
							{ name: 'Cinna', differentiator: '1' }
						]
					);

					expect(result).to.deep.equal([0, 2, 4, 5]);

				});

			});

			context('two pairs of duplicate items, and a single pair of duplicate items with empty string name values', () => {

				it('returns an array of indices of duplicate items, ignoring items with empty string name values', () => {

					const result = getDuplicateIndices(
						[
							{ name: 'Cinna', differentiator: '1' },
							{ name: '', differentiator: '' },
							{ name: 'Julius Caesar', differentiator: '' },
							{ name: 'Mark Antony', differentiator: '' },
							{ name: '', differentiator: '' },
							{ name: 'Soothsayer', differentiator: '' },
							{ name: 'Mark Antony', differentiator: '' },
							{ name: 'Cinna', differentiator: '1' }
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

		context('array items with group', () => {

			context('single pair of duplicate items', () => {

				it('returns an array of indices of duplicate items', () => {

					const result = getDuplicateIndices(
						[
							{ name: 'Alisa Kos', group: '2011' },
							{ name: 'Lucija Kos', group: '2011' },
							{ name: 'Aleksander King', group: '1990' },
							{ name: 'Alisa Kos', group: '1990' },
							{ name: 'Lucija Kos', group: '2011' },
							{ name: 'Aleksander King', group: '1945' }
						]
					);

					expect(result).to.deep.equal([1, 4]);

				});

			});

			context('two pairs of duplicate items', () => {

				it('returns an array of indices of duplicate items', () => {

					const result = getDuplicateIndices(
						[
							{ name: 'Alisa Kos', group: '2011' },
							{ name: 'Lucija Kos', group: '2011' },
							{ name: 'Aleksander King', group: '' },
							{ name: 'Alisa Kos', group: '1990' },
							{ name: 'Lucija Kos', group: '2011' },
							{ name: 'Aleksander King', group: '' }
						]
					);

					expect(result).to.deep.equal([1, 2, 4, 5]);

				});

			});

			context('two pairs of duplicate items, and a single pair of duplicate items with empty string name values', () => {

				it('returns an array of indices of duplicate items, ignoring items with empty string name values', () => {

					const result = getDuplicateIndices(
						[
							{ name: 'Alisa Kos', group: '2011' },
							{ name: 'Lucija Kos', group: '2011' },
							{ name: '', group: '' },
							{ name: 'Aleksander King', group: '' },
							{ name: 'Alisa Kos', group: '1990' },
							{ name: 'Lucija Kos', group: '2011' },
							{ name: '', group: '' },
							{ name: 'Aleksander King', group: '' }
						]
					);

					expect(result).to.deep.equal([1, 3, 5, 7]);

				});

			});

		});

		context('array items with differentiator, qualifier, and group', () => {

			context('single pair of duplicate items', () => {

				it('returns an array of indices of duplicate items', () => {

					const result = getDuplicateIndices(
						[
							{ name: 'Foo', differentiator: '1', qualifier: 'younger', group: 'Romans' },
							{ name: 'Bar', differentiator: '1', qualifier: 'younger', group: 'Romans' },
							{ name: 'Foo', differentiator: '1', qualifier: 'younger', group: 'Romans' },
							{ name: 'Baz', differentiator: '1', qualifier: 'younger', group: 'Romans' }
						]
					);

					expect(result).to.deep.equal([0, 2]);

				});

			});

			context('two pairs of duplicate items', () => {

				it('returns an array of indices of duplicate items', () => {

					const result = getDuplicateIndices(
						[
							{ name: 'Foo', differentiator: '1', qualifier: 'younger', group: 'Romans' },
							{ name: 'Bar', differentiator: '1', qualifier: 'younger', group: 'Romans' },
							{ name: 'Baz', differentiator: '1', qualifier: 'younger', group: 'Romans' },
							{ name: 'Foo', differentiator: '1', qualifier: 'younger', group: 'Romans' },
							{ name: 'Bar', differentiator: '1', qualifier: 'younger', group: 'Romans' },
							{ name: 'Qux', differentiator: '1', qualifier: 'younger', group: 'Romans' }
						]
					);

					expect(result).to.deep.equal([0, 1, 3, 4]);

				});

			});

			context('two pairs of duplicate items, and a single pair of duplicate items with empty string name values', () => {

				it('returns an array of indices of duplicate items, ignoring items with empty string name values', () => {

					const result = getDuplicateIndices(
						[
							{ name: 'Foo', differentiator: '1', qualifier: 'younger', group: 'Romans' },
							{ name: 'Bar', differentiator: '1', qualifier: 'younger', group: 'Romans' },
							{ name: '', differentiator: '1', qualifier: 'younger', group: 'Romans' },
							{ name: 'Baz', differentiator: '1', qualifier: 'younger', group: 'Romans' },
							{ name: 'Foo', differentiator: '1', qualifier: 'younger', group: 'Romans' },
							{ name: 'Bar', differentiator: '1', qualifier: 'younger', group: 'Romans' },
							{ name: '', differentiator: '1', qualifier: 'younger', group: 'Romans' },
							{ name: 'Qux', differentiator: '1', qualifier: 'younger', group: 'Romans' }
						]
					);

					expect(result).to.deep.equal([0, 1, 4, 5]);

				});

			});

		});

	});

});
