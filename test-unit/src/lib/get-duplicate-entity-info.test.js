import { expect } from 'chai';

import {
	getDuplicateEntities,
	isEntityInArray
} from '../../../src/lib/get-duplicate-entity-info';
import applyModelGetter from '../../test-helpers/apply-model-getter';

describe('Get Duplicate Info module', () => {

	describe('getDuplicateEntities function', () => {

		context('duplicates exist at the top level', () => {

			it('returns an array of unique duplicates', () => {

				const arrayOfEntities = [
					applyModelGetter({ name: 'Nicholas Hytner', differentiator: '' }, 'person'),
					applyModelGetter({ name: 'Vicki Mortimer', differentiator: '' }, 'person'),
					applyModelGetter({ name: 'Nicholas Hytner', differentiator: '' }, 'person'),
					applyModelGetter({ name: 'Jon Clark', differentiator: '' }, 'person'),
					applyModelGetter({ name: 'Nicholas Hytner', differentiator: '' }, 'person')
				];

				const result = getDuplicateEntities(arrayOfEntities);

				const expectedResult = [
					{
						name: 'Nicholas Hytner',
						differentiator: ''
					}
				];

				expect(result).to.deep.equal(expectedResult);
				expect(result[0].model).to.equal('person');

			});

		});

		context('duplicates exist at the nested level', () => {

			it('returns an array of unique duplicates', () => {

				const arrayOfEntities = [
					applyModelGetter({
						name: 'Mesmer',
						differentiator: ''
					}, 'company'),
					applyModelGetter({
						name: '59 Productions',
						differentiator: '',
						creditedMembers: [
							applyModelGetter({
								name: 'Leo Warner',
								differentiator: ''
							}, 'person'),
							applyModelGetter({
								name: 'Leo Warner',
								differentiator: ''
							}, 'person')
						]
					}, 'company'),
					applyModelGetter({
						name: 'Akhila Krishnan',
						differentiator: ''
					}, 'person')
				];

				const result = getDuplicateEntities(arrayOfEntities);

				const expectedResult = [
					{
						name: 'Leo Warner',
						differentiator: ''
					}
				];

				expect(result).to.deep.equal(expectedResult);
				expect(result[0].model).to.equal('person');

			});

		});

		context('duplicates exist at the top level and nested level', () => {

			it('returns an array of unique duplicates', () => {

				const arrayOfEntities = [
					applyModelGetter({
						name: 'Dick Straker',
						differentiator: ''
					}, 'person'),
					applyModelGetter({
						name: 'Mesmer',
						differentiator: '',
						creditedMembers: [
							applyModelGetter({
								name: 'Dick Straker',
								differentiator: ''
							}, 'person'),
							applyModelGetter({
								name: 'Mark Grimmer',
								differentiator: ''
							}, 'person')
						]
					}, 'company'),
					applyModelGetter({
						name: 'Akhila Krishnan',
						differentiator: ''
					}, 'person')
				];

				const result = getDuplicateEntities(arrayOfEntities);

				const expectedResult = [
					{
						name: 'Dick Straker',
						differentiator: ''
					}
				];

				expect(result).to.deep.equal(expectedResult);
				expect(result[0].model).to.equal('person');

			});

		});

		context('duplicates exist at the nested level in separate arrays', () => {

			it('returns an array of unique duplicates', () => {

				const arrayOfEntities = [
					applyModelGetter({
						name: 'Nina Dunn',
						differentiator: ''
					}, 'person'),
					applyModelGetter({
						name: '59 Productions',
						differentiator: '',
						creditedMembers: [
							applyModelGetter({
								name: 'Leo Warner',
								differentiator: ''
							}, 'person'),
							applyModelGetter({
								name: 'Ian William Galloway',
								differentiator: ''
							}, 'person')
						]
					}, 'company'),
					applyModelGetter({
						name: 'Mesmer',
						differentiator: '',
						creditedMembers: [
							applyModelGetter({
								name: 'Ian William Galloway',
								differentiator: ''
							}, 'person'),
							applyModelGetter({
								name: 'John O\'Connell',
								differentiator: ''
							}, 'person')
						]
					}, 'company'),
					applyModelGetter({
						name: 'Akhila Krishnan',
						differentiator: ''
					}, 'person')
				];

				const result = getDuplicateEntities(arrayOfEntities);

				const expectedResult = [
					{
						name: 'Ian William Galloway',
						differentiator: ''
					}
				];

				expect(result).to.deep.equal(expectedResult);
				expect(result[0].model).to.equal('person');

			});

		});

		context('multiple duplicates exist in various formations', () => {

			it('returns an array of unique duplicates', () => {

				const arrayOfEntities = [
					applyModelGetter({
						name: 'Mark Grimmer',
						differentiator: ''
					}, 'person'),
					applyModelGetter({
						name: '59 Productions',
						differentiator: '',
						creditedMembers: [
							applyModelGetter({
								name: 'Leo Warner',
								differentiator: ''
							}, 'person'),
							applyModelGetter({
								name: 'Mark Grimmer',
								differentiator: ''
							}, 'person'),
							applyModelGetter({
								name: 'Ian William Galloway',
								differentiator: ''
							}, 'person')
						]
					}, 'company'),
					applyModelGetter({
						name: 'Mesmer',
						differentiator: '',
						creditedMembers: [
							applyModelGetter({
								name: 'Ian William Galloway',
								differentiator: ''
							}, 'person'),
							applyModelGetter({
								name: 'John O\'Connell',
								differentiator: ''
							}, 'person'),
							applyModelGetter({
								name: 'Ian William Galloway',
								differentiator: ''
							}, 'person')
						]
					}, 'company'),
					applyModelGetter({
						name: 'Mark Grimmer',
						differentiator: ''
					}, 'person'),
					applyModelGetter({
						name: 'Akhila Krishnan',
						differentiator: ''
					}, 'person')
				];

				const result = getDuplicateEntities(arrayOfEntities);

				const expectedResult = [
					{
						name: 'Mark Grimmer',
						differentiator: ''
					},
					{
						name: 'Ian William Galloway',
						differentiator: ''
					}
				];

				expect(result).to.deep.equal(expectedResult);
				expect(result[0].model).to.equal('person');
				expect(result[1].model).to.equal('person');

			});

		});

		context('duplicates exist of entities with empty string name values', () => {

			it('ignores entities with empty string name values', () => {

				const arrayOfEntities = [
					applyModelGetter({
						name: '',
						differentiator: ''
					}, 'person'),
					applyModelGetter({
						name: '',
						differentiator: ''
					}, 'company'),
					applyModelGetter({
						name: '59 Productions',
						differentiator: '',
						creditedMembers: [
							applyModelGetter({
								name: 'Leo Warner',
								differentiator: ''
							}, 'person'),
							applyModelGetter({
								name: '',
								differentiator: ''
							}, 'person')
						]
					}, 'company'),
					applyModelGetter({
						name: '',
						differentiator: ''
					}, 'company'),
					applyModelGetter({
						name: 'Mesmer',
						differentiator: '',
						creditedMembers: [
							applyModelGetter({
								name: '',
								differentiator: ''
							}, 'person'),
							applyModelGetter({
								name: 'John O\'Connell',
								differentiator: ''
							}, 'person')
						]
					}, 'company'),
					applyModelGetter({
						name: 'Akhila Krishnan',
						differentiator: ''
					}, 'person')
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

				const entity = applyModelGetter({ name: 'Ian McKellen', differentiator: '' }, 'person');

				const array = [
					applyModelGetter({ name: 'Patrick Stewart', differentiator: '' }, 'person'),
					applyModelGetter({ name: 'Ian McKellen', differentiator: '' }, 'person'),
					applyModelGetter({ name: 'Chiwetel Ejiofor', differentiator: '' }, 'person')
				];

				const result = isEntityInArray(entity, array);

				expect(result).to.be.true;

			});

		});

		context('entity is not in array', () => {

			it('returns false', () => {

				const entity = applyModelGetter({ name: 'Ian McKellen', differentiator: '' }, 'person');

				const array = [
					applyModelGetter({ name: 'Patrick Stewart', differentiator: '' }, 'person'),
					applyModelGetter({ name: 'Ian McKellen', differentiator: '' }, 'company'),
					applyModelGetter({ name: 'Ian McKellen', differentiator: '1' }, 'person'),
					applyModelGetter({ name: 'Chiwetel Ejiofor', differentiator: '' }, 'person')
				];

				const result = isEntityInArray(entity, array);

				expect(result).to.be.false;

			});

		});

	});

});
