import { expect } from 'chai';

import {
	getDuplicateEntities,
	isEntityInArray
} from '../../../src/lib/get-duplicate-entity-info';

describe('Get Duplicate Info module', () => {

	describe('getDuplicateEntities function', () => {

		context('duplicates exist at the top level', () => {

			it('returns an array of unique duplicates', () => {

				const arrayOfEntities = [
					{
						model: 'person',
						name: 'Nicholas Hytner',
						differentiator: ''
					},
					{
						model: 'person',
						name: 'Vicki Mortimer',
						differentiator: ''
					},
					{
						model: 'person',
						name: 'Nicholas Hytner',
						differentiator: ''
					},
					{
						model: 'person',
						name: 'Jon Clark',
						differentiator: ''
					},
					{
						model: 'person',
						name: 'Nicholas Hytner',
						differentiator: ''
					}
				];

				const result = getDuplicateEntities(arrayOfEntities);

				const expectedResult = [
					{
						model: 'person',
						name: 'Nicholas Hytner',
						differentiator: ''
					}
				];

				expect(result).to.deep.equal(expectedResult);

			});

		});

		context('duplicates exist at the nested level', () => {

			it('returns an array of unique duplicates', () => {

				const arrayOfEntities = [
					{
						model: 'company',
						name: 'Mesmer',
						differentiator: ''
					},
					{
						model: 'company',
						name: '59 Productions',
						differentiator: '',
						creditedMembers: [
							{
								model: 'person',
								name: 'Leo Warner',
								differentiator: ''
							},
							{
								model: 'person',
								name: 'Leo Warner',
								differentiator: ''
							}
						]
					},
					{
						model: 'person',
						name: 'Akhila Krishnan',
						differentiator: ''
					}
				];

				const result = getDuplicateEntities(arrayOfEntities);

				const expectedResult = [
					{
						model: 'person',
						name: 'Leo Warner',
						differentiator: ''
					}
				];

				expect(result).to.deep.equal(expectedResult);

			});

		});

		context('duplicates exist at the top level and nested level', () => {

			it('returns an array of unique duplicates', () => {

				const arrayOfEntities = [
					{
						model: 'person',
						name: 'Dick Straker',
						differentiator: ''
					},
					{
						model: 'company',
						name: 'Mesmer',
						differentiator: '',
						creditedMembers: [
							{
								model: 'person',
								name: 'Dick Straker',
								differentiator: ''
							},
							{
								model: 'person',
								name: 'Mark Grimmer',
								differentiator: ''
							}
						]
					},
					{
						model: 'person',
						name: 'Akhila Krishnan',
						differentiator: ''
					}
				];

				const result = getDuplicateEntities(arrayOfEntities);

				const expectedResult = [
					{
						model: 'person',
						name: 'Dick Straker',
						differentiator: ''
					}
				];

				expect(result).to.deep.equal(expectedResult);

			});

		});

		context('duplicates exist at the nested level in separate arrays', () => {

			it('returns an array of unique duplicates', () => {

				const arrayOfEntities = [
					{
						model: 'person',
						name: 'Nina Dunn',
						differentiator: ''
					},
					{
						model: 'company',
						name: '59 Productions',
						differentiator: '',
						creditedMembers: [
							{
								model: 'person',
								name: 'Leo Warner',
								differentiator: ''
							},
							{
								model: 'person',
								name: 'Ian William Galloway',
								differentiator: ''
							}
						]
					},
					{
						model: 'company',
						name: 'Mesmer',
						differentiator: '',
						creditedMembers: [
							{
								model: 'person',
								name: 'Ian William Galloway',
								differentiator: ''
							},
							{
								model: 'person',
								name: 'John O\'Connell',
								differentiator: ''
							}
						]
					},
					{
						model: 'person',
						name: 'Akhila Krishnan',
						differentiator: ''
					}
				];

				const result = getDuplicateEntities(arrayOfEntities);

				const expectedResult = [
					{
						model: 'person',
						name: 'Ian William Galloway',
						differentiator: ''
					}
				];

				expect(result).to.deep.equal(expectedResult);

			});

		});

		context('multiple duplicates exist in various formations', () => {

			it('returns an array of unique duplicates', () => {

				const arrayOfEntities = [
					{
						model: 'person',
						name: 'Mark Grimmer',
						differentiator: ''
					},
					{
						model: 'company',
						name: '59 Productions',
						differentiator: '',
						creditedMembers: [
							{
								model: 'person',
								name: 'Leo Warner',
								differentiator: ''
							},
							{
								model: 'person',
								name: 'Mark Grimmer',
								differentiator: ''
							},
							{
								model: 'person',
								name: 'Ian William Galloway',
								differentiator: ''
							}
						]
					},
					{
						model: 'company',
						name: 'Mesmer',
						differentiator: '',
						creditedMembers: [
							{
								model: 'person',
								name: 'Ian William Galloway',
								differentiator: ''
							},
							{
								model: 'person',
								name: 'John O\'Connell',
								differentiator: ''
							},
							{
								model: 'person',
								name: 'Ian William Galloway',
								differentiator: ''
							}
						]
					},
					{
						model: 'person',
						name: 'Mark Grimmer',
						differentiator: ''
					},
					{
						model: 'person',
						name: 'Akhila Krishnan',
						differentiator: ''
					}
				];

				const result = getDuplicateEntities(arrayOfEntities);

				const expectedResult = [
					{
						model: 'person',
						name: 'Mark Grimmer',
						differentiator: ''
					},
					{
						model: 'person',
						name: 'Ian William Galloway',
						differentiator: ''
					}
				];

				expect(result).to.deep.equal(expectedResult);

			});

		});

		context('duplicates exist of entities with empty string name values', () => {

			it('ignores entities with empty string name values', () => {

				const arrayOfEntities = [
					{
						model: 'person',
						name: '',
						differentiator: ''
					},
					{
						model: 'company',
						name: '',
						differentiator: ''
					},
					{
						model: 'company',
						name: '59 Productions',
						differentiator: '',
						creditedMembers: [
							{
								model: 'person',
								name: 'Leo Warner',
								differentiator: ''
							},
							{
								model: 'person',
								name: '',
								differentiator: ''
							}
						]
					},
					{
						model: 'company',
						name: '',
						differentiator: ''
					},
					{
						model: 'company',
						name: 'Mesmer',
						differentiator: '',
						creditedMembers: [
							{
								model: 'person',
								name: '',
								differentiator: ''
							},
							{
								model: 'person',
								name: 'John O\'Connell',
								differentiator: ''
							}
						]
					},
					{
						model: 'person',
						name: 'Akhila Krishnan',
						differentiator: ''
					}
				];

				const result = getDuplicateEntities(arrayOfEntities);

				const expectedResult = [];

				expect(result).to.deep.equal(expectedResult);

			});

		});

	});

	describe('isEntityInArray function', () => {

		context('entity is in array', () => {

			it('returns true', () => {

				const entity = { model: 'person', name: 'Ian McKellen', differentiator: '' };

				const array = [
					{ model: 'person', name: 'Patrick Stewart', differentiator: '' },
					{ model: 'person', name: 'Ian McKellen', differentiator: '' },
					{ model: 'person', name: 'Chiwetel Ejiofor', differentiator: '' }
				];

				const result = isEntityInArray(entity, array);

				expect(result).to.be.true;

			});

		});

		context('entity is not in array', () => {

			it('returns false', () => {

				const entity = { model: 'person', name: 'Ian McKellen', differentiator: '' };

				const array = [
					{ model: 'person', name: 'Patrick Stewart', differentiator: '' },
					{ model: 'company', name: 'Ian Mckellen', differentiator: '' },
					{ model: 'person', name: 'Ian Mckellen', differentiator: '1' },
					{ model: 'person', name: 'Chiwetel Ejiofor', differentiator: '' }
				];

				const result = isEntityInArray(entity, array);

				expect(result).to.be.false;

			});

		});

	});

});
