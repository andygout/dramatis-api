import assert from 'node:assert/strict';
import { beforeEach, describe, it } from 'node:test';

import esmock from 'esmock';

import { SubVenue } from '../../../src/models/index.js';

describe('Venue model', () => {
	let stubs;
	let Venue;

	const SubVenueStub = function (props = {}) {
		const instance = new SubVenue(props);

		instance.validateName = this?.mock?.fn ? this.mock.fn() : instance.validateName;
		instance.validateDifferentiator = this?.mock?.fn ? this.mock.fn() : instance.validateDifferentiator;
		instance.validateNoAssociationWithSelf = this?.mock?.fn ? this.mock.fn() : instance.validateNoAssociationWithSelf;
		instance.validateUniquenessInGroup = this?.mock?.fn ? this.mock.fn() : instance.validateUniquenessInGroup;
		instance.runDatabaseValidations = this?.mock?.fn ? this.mock.fn(async () => {}) : instance.runDatabaseValidations;

		return instance;
	};

	beforeEach(async (test) => {
		stubs = {
			getDuplicateIndicesModule: {
				getDuplicateBaseInstanceIndices: test.mock.fn(() => [])
			},
			models: {
				SubVenue: SubVenueStub.bind(test)
			}
		};

		Venue = await esmock(
			'../../../src/models/Venue.js',
			{},
			// globalmocks: mock definitions imported everywhere.
			// Required for when functions are invoked by ancestor class methods.
			{
				'../../../src/lib/get-duplicate-indices.js': stubs.getDuplicateIndicesModule,
				'../../../src/models/index.js': stubs.models
			}
		);
	});

	describe('constructor method', () => {
		describe('subVenues property', () => {
			it('assigns empty array if absent from props', async () => {
				const instance = new Venue({ name: 'National Theatre' });

				assert.deepEqual(instance.subVenues, []);
			});

			it('assigns array of subVenues if included in props, retaining those with empty or whitespace-only string names', async () => {
				const instance = new Venue({
					name: 'National Theatre',
					subVenues: [
						{
							name: 'Olivier Theatre'
						},
						{
							name: ''
						},
						{
							name: ' '
						}
					]
				});

				assert.equal(instance.subVenues.length, 3);
				assert.ok(instance.subVenues[0] instanceof SubVenue);
				assert.ok(instance.subVenues[1] instanceof SubVenue);
				assert.ok(instance.subVenues[2] instanceof SubVenue);
			});
		});
	});

	describe('runInputValidations method', () => {
		it("calls instance's validate methods and associated models' validate methods", async (test) => {
			const instance = new Venue({
				name: 'National Theatre',
				differentiator: '',
				subVenues: [
					{
						name: 'Olivier Theatre',
						differentiator: ''
					}
				]
			});

			test.mock.method(instance, 'validateName');
			test.mock.method(instance, 'validateDifferentiator');

			instance.runInputValidations();

			assert.equal(instance.validateName.mock.callCount(), 1);
			assert.deepEqual(instance.validateName.mock.calls[0].arguments, [{ isRequired: true }]);
			assert.equal(instance.validateDifferentiator.mock.callCount(), 1);
			assert.deepEqual(instance.validateDifferentiator.mock.calls[0].arguments, []);
			assert.equal(stubs.getDuplicateIndicesModule.getDuplicateBaseInstanceIndices.mock.callCount(), 1);
			assert.deepEqual(
				stubs.getDuplicateIndicesModule.getDuplicateBaseInstanceIndices.mock.calls[0].arguments,
				[instance.subVenues]
			);
			assert.equal(instance.subVenues[0].validateName.mock.callCount(), 1);
			assert.deepEqual(instance.subVenues[0].validateName.mock.calls[0].arguments, [{ isRequired: false }]);
			assert.equal(instance.subVenues[0].validateDifferentiator.mock.callCount(), 1);
			assert.deepEqual(instance.subVenues[0].validateDifferentiator.mock.calls[0].arguments, []);
			assert.equal(instance.subVenues[0].validateNoAssociationWithSelf.mock.callCount(), 1);
			assert.deepEqual(instance.subVenues[0].validateNoAssociationWithSelf.mock.calls[0].arguments, [{
				name: 'National Theatre',
				differentiator: ''
			}]);
			assert.equal(instance.subVenues[0].validateUniquenessInGroup.mock.callCount(), 1);
			assert.deepEqual(instance.subVenues[0].validateUniquenessInGroup.mock.calls[0].arguments, [{ isDuplicate: false }]);
		});
	});

	describe('runDatabaseValidations method', () => {
		it("calls associated subVenues' runDatabaseValidations method", async (test) => {
			const instance = new Venue({
				uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
				name: 'National Theatre',
				subVenues: [
					{
						name: 'Olivier Theatre'
					}
				]
			});

			test.mock.method(instance, 'validateUniquenessInDatabase');

			await instance.runDatabaseValidations();

			assert.equal(instance.validateUniquenessInDatabase.mock.callCount(), 1);
			assert.deepEqual(instance.validateUniquenessInDatabase.mock.calls[0].arguments, []);
			assert.equal(instance.subVenues[0].runDatabaseValidations.mock.callCount(), 1);
			assert.deepEqual(instance.subVenues[0].runDatabaseValidations.mock.calls[0].arguments, [{
				subjectVenueUuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
			}]);
		});
	});
});
