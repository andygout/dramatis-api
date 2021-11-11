import { expect } from 'chai';

import {
	getDuplicateEntities,
	isEntityInArray
} from '../../../src/lib/get-duplicate-entity-info';
import applyModelGetter from '../../test-helpers/apply-model-getter';

describe('Get Duplicate Entity Info module', () => {

	describe('getDuplicateEntities function', () => {

		context('duplicates exist at the top level', () => {

			it('returns an array of unique duplicates', () => {

				const arrayOfEntities = [
					applyModelGetter({ name: 'Nicholas Hytner', differentiator: '' }, 'PERSON'),
					applyModelGetter({ name: 'Vicki Mortimer', differentiator: '' }, 'PERSON'),
					applyModelGetter({ name: 'Nicholas Hytner', differentiator: '' }, 'PERSON'),
					applyModelGetter({ name: 'Jon Clark', differentiator: '' }, 'PERSON'),
					applyModelGetter({ name: 'Nicholas Hytner', differentiator: '' }, 'PERSON')
				];

				const result = getDuplicateEntities(arrayOfEntities);

				const expectedResult = [
					{
						name: 'Nicholas Hytner',
						differentiator: ''
					}
				];

				expect(result).to.deep.equal(expectedResult);
				expect(result[0].model).to.equal('PERSON');

			});

		});

		context('duplicates exist at the nested level', () => {

			it('returns an array of unique duplicates', () => {

				const arrayOfEntities = [
					applyModelGetter({
						name: 'Mesmer',
						differentiator: ''
					}, 'COMPANY'),
					applyModelGetter({
						name: '59 Productions',
						differentiator: '',
						creditedMembers: [
							applyModelGetter({
								name: 'Leo Warner',
								differentiator: ''
							}, 'PERSON'),
							applyModelGetter({
								name: 'Leo Warner',
								differentiator: ''
							}, 'PERSON')
						]
					}, 'COMPANY'),
					applyModelGetter({
						name: 'Autograph',
						differentiator: '',
						nominatedMembers: [
							applyModelGetter({
								name: 'Ian Dickinson',
								differentiator: ''
							}, 'PERSON'),
							applyModelGetter({
								name: 'Ian Dickinson',
								differentiator: ''
							}, 'PERSON')
						]
					}, 'COMPANY'),
					applyModelGetter({
						name: 'Akhila Krishnan',
						differentiator: ''
					}, 'PERSON')
				];

				const result = getDuplicateEntities(arrayOfEntities);

				const expectedResult = [
					{
						name: 'Leo Warner',
						differentiator: ''
					},
					{
						name: 'Ian Dickinson',
						differentiator: ''
					}
				];

				expect(result).to.deep.equal(expectedResult);
				expect(result[0].model).to.equal('PERSON');

			});

		});

		context('duplicates exist at the top level and nested level', () => {

			it('returns an array of unique duplicates', () => {

				const arrayOfEntities = [
					applyModelGetter({
						name: 'Dick Straker',
						differentiator: ''
					}, 'PERSON'),
					applyModelGetter({
						name: 'Mesmer',
						differentiator: '',
						creditedMembers: [
							applyModelGetter({
								name: 'Dick Straker',
								differentiator: ''
							}, 'PERSON'),
							applyModelGetter({
								name: 'Mark Grimmer',
								differentiator: ''
							}, 'PERSON')
						]
					}, 'COMPANY'),
					applyModelGetter({
						name: 'Andrew Bruce',
						differentiator: ''
					}, 'PERSON'),
					applyModelGetter({
						name: 'Autograph',
						differentiator: '',
						nominatedMembers: [
							applyModelGetter({
								name: 'Andrew Bruce',
								differentiator: ''
							}, 'PERSON'),
							applyModelGetter({
								name: 'Nick Lidster',
								differentiator: ''
							}, 'PERSON')
						]
					}, 'COMPANY'),
					applyModelGetter({
						name: 'Akhila Krishnan',
						differentiator: ''
					}, 'PERSON')
				];

				const result = getDuplicateEntities(arrayOfEntities);

				const expectedResult = [
					{
						name: 'Dick Straker',
						differentiator: ''
					},
					{
						name: 'Andrew Bruce',
						differentiator: ''
					}
				];

				expect(result).to.deep.equal(expectedResult);
				expect(result[0].model).to.equal('PERSON');

			});

		});

		context('duplicates exist at the nested level in separate arrays', () => {

			it('returns an array of unique duplicates', () => {

				const arrayOfEntities = [
					applyModelGetter({
						name: 'Nina Dunn',
						differentiator: ''
					}, 'PERSON'),
					applyModelGetter({
						name: '59 Productions',
						differentiator: '',
						creditedMembers: [
							applyModelGetter({
								name: 'Leo Warner',
								differentiator: ''
							}, 'PERSON'),
							applyModelGetter({
								name: 'Ian William Galloway',
								differentiator: ''
							}, 'PERSON')
						]
					}, 'COMPANY'),
					applyModelGetter({
						name: 'Mesmer',
						differentiator: '',
						creditedMembers: [
							applyModelGetter({
								name: 'Ian William Galloway',
								differentiator: ''
							}, 'PERSON'),
							applyModelGetter({
								name: 'John O\'Connell',
								differentiator: ''
							}, 'PERSON')
						]
					}, 'COMPANY'),
					applyModelGetter({
						name: 'Autograph',
						differentiator: '',
						nominatedMembers: [
							applyModelGetter({
								name: 'Terry Jardine',
								differentiator: ''
							}, 'PERSON'),
							applyModelGetter({
								name: 'Nick Lidster',
								differentiator: ''
							}, 'PERSON')
						]
					}, 'COMPANY'),
					applyModelGetter({
						name: 'Soundwaves Ltd',
						differentiator: '',
						nominatedMembers: [
							applyModelGetter({
								name: 'Brian Ronan',
								differentiator: ''
							}, 'PERSON'),
							applyModelGetter({
								name: 'Terry Jardine',
								differentiator: ''
							}, 'PERSON')
						]
					}, 'COMPANY'),
					applyModelGetter({
						name: 'Akhila Krishnan',
						differentiator: ''
					}, 'PERSON')
				];

				const result = getDuplicateEntities(arrayOfEntities);

				const expectedResult = [
					{
						name: 'Ian William Galloway',
						differentiator: ''
					},
					{
						name: 'Terry Jardine',
						differentiator: ''
					}
				];

				expect(result).to.deep.equal(expectedResult);
				expect(result[0].model).to.equal('PERSON');

			});

		});

		context('multiple duplicates exist in various formations', () => {

			it('returns an array of unique duplicates', () => {

				const arrayOfEntities = [
					applyModelGetter({
						name: 'Mark Grimmer',
						differentiator: ''
					}, 'PERSON'),
					applyModelGetter({
						name: '59 Productions',
						differentiator: '',
						creditedMembers: [
							applyModelGetter({
								name: 'Leo Warner',
								differentiator: ''
							}, 'PERSON'),
							applyModelGetter({
								name: 'Mark Grimmer',
								differentiator: ''
							}, 'PERSON'),
							applyModelGetter({
								name: 'Ian William Galloway',
								differentiator: ''
							}, 'PERSON')
						]
					}, 'COMPANY'),
					applyModelGetter({
						name: 'Mesmer',
						differentiator: '',
						creditedMembers: [
							applyModelGetter({
								name: 'Ian William Galloway',
								differentiator: ''
							}, 'PERSON'),
							applyModelGetter({
								name: 'John O\'Connell',
								differentiator: ''
							}, 'PERSON'),
							applyModelGetter({
								name: 'Ian William Galloway',
								differentiator: ''
							}, 'PERSON')
						]
					}, 'COMPANY'),
					applyModelGetter({
						name: 'Autograph',
						differentiator: '',
						nominatedMembers: [
							applyModelGetter({
								name: 'Terry Jardine',
								differentiator: ''
							}, 'PERSON'),
							applyModelGetter({
								name: 'Nick Lidster',
								differentiator: ''
							}, 'PERSON'),
							applyModelGetter({
								name: 'Terry Jardine',
								differentiator: ''
							}, 'PERSON')
						]
					}, 'COMPANY'),
					applyModelGetter({
						name: 'Soundwaves Ltd',
						differentiator: '',
						nominatedMembers: [
							applyModelGetter({
								name: 'Andrew Bruce',
								differentiator: ''
							}, 'PERSON'),
							applyModelGetter({
								name: 'Brian Ronan',
								differentiator: ''
							}, 'PERSON'),
							applyModelGetter({
								name: 'Terry Jardine',
								differentiator: ''
							}, 'PERSON')
						]
					}, 'COMPANY'),
					applyModelGetter({
						name: 'Mark Grimmer',
						differentiator: ''
					}, 'PERSON'),
					applyModelGetter({
						name: 'Akhila Krishnan',
						differentiator: ''
					}, 'PERSON')
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
					},
					{
						name: 'Terry Jardine',
						differentiator: ''
					}
				];

				expect(result).to.deep.equal(expectedResult);
				expect(result[0].model).to.equal('PERSON');
				expect(result[1].model).to.equal('PERSON');

			});

		});

		context('duplicates exist of entities with empty string name values', () => {

			it('ignores entities with empty string name values', () => {

				const arrayOfEntities = [
					applyModelGetter({
						name: '',
						differentiator: ''
					}, 'PERSON'),
					applyModelGetter({
						name: '',
						differentiator: ''
					}, 'COMPANY'),
					applyModelGetter({
						name: '59 Productions',
						differentiator: '',
						creditedMembers: [
							applyModelGetter({
								name: 'Leo Warner',
								differentiator: ''
							}, 'PERSON'),
							applyModelGetter({
								name: '',
								differentiator: ''
							}, 'PERSON')
						]
					}, 'COMPANY'),
					applyModelGetter({
						name: '',
						differentiator: ''
					}, 'COMPANY'),
					applyModelGetter({
						name: 'Mesmer',
						differentiator: '',
						creditedMembers: [
							applyModelGetter({
								name: '',
								differentiator: ''
							}, 'PERSON'),
							applyModelGetter({
								name: 'John O\'Connell',
								differentiator: ''
							}, 'PERSON')
						]
					}, 'COMPANY'),
					applyModelGetter({
						name: 'Autograph',
						differentiator: '',
						nominatedMembers: [
							applyModelGetter({
								name: '',
								differentiator: ''
							}, 'PERSON'),
							applyModelGetter({
								name: 'Terry Jardine',
								differentiator: ''
							}, 'PERSON')
						]
					}, 'COMPANY'),
					applyModelGetter({
						name: 'Soundwaves Ltd',
						differentiator: '',
						nominatedMembers: [
							applyModelGetter({
								name: 'Brian Ronan',
								differentiator: ''
							}, 'PERSON'),
							applyModelGetter({
								name: '',
								differentiator: ''
							}, 'PERSON')
						]
					}, 'COMPANY'),
					applyModelGetter({
						name: 'Akhila Krishnan',
						differentiator: ''
					}, 'PERSON')
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

				const entity = applyModelGetter({ name: 'Ian McKellen', differentiator: '' }, 'PERSON');

				const array = [
					applyModelGetter({ name: 'Patrick Stewart', differentiator: '' }, 'PERSON'),
					applyModelGetter({ name: 'Ian McKellen', differentiator: '' }, 'PERSON'),
					applyModelGetter({ name: 'Chiwetel Ejiofor', differentiator: '' }, 'PERSON')
				];

				const result = isEntityInArray(entity, array);

				expect(result).to.be.true;

			});

		});

		context('entity is not in array', () => {

			it('returns false', () => {

				const entity = applyModelGetter({ name: 'Ian McKellen', differentiator: '' }, 'PERSON');

				const array = [
					applyModelGetter({ name: 'Patrick Stewart', differentiator: '' }, 'PERSON'),
					applyModelGetter({ name: 'Ian McKellen', differentiator: '' }, 'COMPANY'),
					applyModelGetter({ name: 'Ian McKellen', differentiator: '1' }, 'PERSON'),
					applyModelGetter({ name: 'Chiwetel Ejiofor', differentiator: '' }, 'PERSON')
				];

				const result = isEntityInArray(entity, array);

				expect(result).to.be.false;

			});

		});

	});

});
