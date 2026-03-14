import assert from 'node:assert/strict';
import { afterEach, beforeEach, describe, it } from 'node:test';

import esmock from 'esmock';
import { assert as sinonAssert, createStubInstance, restore, spy, stub } from 'sinon';

import { SubVenue } from '../../../src/models/index.js';

describe('Venue model', () => {
	let stubs;
	let Venue;

	const SubVenueStub = function () {
		return createStubInstance(SubVenue);
	};

	beforeEach(async () => {
		stubs = {
			getDuplicateIndicesModule: {
				getDuplicateBaseInstanceIndices: stub().returns([])
			},
			models: {
				SubVenue: SubVenueStub
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

	afterEach(() => {
		restore();
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
		it("calls instance's validate methods and associated models' validate methods", async () => {
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

			spy(instance, 'validateName');
			spy(instance, 'validateDifferentiator');

			instance.runInputValidations();

			sinonAssert.callOrder(
				instance.validateName,
				instance.validateDifferentiator,
				stubs.getDuplicateIndicesModule.getDuplicateBaseInstanceIndices,
				instance.subVenues[0].validateName,
				instance.subVenues[0].validateDifferentiator,
				instance.subVenues[0].validateNoAssociationWithSelf,
				instance.subVenues[0].validateUniquenessInGroup
			);
			sinonAssert.calledOnceWithExactly(instance.validateName, { isRequired: true });
			sinonAssert.calledOnceWithExactly(instance.validateDifferentiator);
			sinonAssert.calledOnceWithExactly(
				stubs.getDuplicateIndicesModule.getDuplicateBaseInstanceIndices,
				instance.subVenues
			);
			sinonAssert.calledOnceWithExactly(instance.subVenues[0].validateName, { isRequired: false });
			sinonAssert.calledOnceWithExactly(instance.subVenues[0].validateDifferentiator);
			sinonAssert.calledOnceWithExactly(instance.subVenues[0].validateNoAssociationWithSelf, {
				name: 'National Theatre',
				differentiator: ''
			});
			sinonAssert.calledOnceWithExactly(instance.subVenues[0].validateUniquenessInGroup, { isDuplicate: false });
		});
	});

	describe('runDatabaseValidations method', () => {
		it("calls associated subVenues' runDatabaseValidations method", async () => {
			const instance = new Venue({
				uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
				name: 'National Theatre',
				subVenues: [
					{
						name: 'Olivier Theatre'
					}
				]
			});

			stub(instance, 'validateUniquenessInDatabase');

			await instance.runDatabaseValidations();

			sinonAssert.calledOnceWithExactly(instance.validateUniquenessInDatabase);
			sinonAssert.calledOnceWithExactly(instance.subVenues[0].runDatabaseValidations, {
				subjectVenueUuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
			});
		});
	});
});
