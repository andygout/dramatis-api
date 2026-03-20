import assert from 'node:assert/strict';
import { afterEach, beforeEach, describe, it } from 'node:test';

import esmock from 'esmock';
import { assert as sinonAssert, restore, spy, stub } from 'sinon';

describe('ProductionIdentifier model', () => {
	let stubs;
	let ProductionIdentifier;

	beforeEach(async () => {
		stubs = {
			stringsModule: {
				getTrimmedOrEmptyString: stub().callsFake((arg) => arg?.trim() || '')
			}
		};

		ProductionIdentifier = await esmock(
			'../../../src/models/ProductionIdentifier.js',
			{},
			// globalmocks: mock definitions imported everywhere.
			// Required for when functions are invoked by ancestor class methods.
			{
				'../../../src/lib/strings.js': stubs.stringsModule
			}
		);
	});

	afterEach(() => {
		restore();
	});

	describe('constructor method', () => {
		it('calls getTrimmedOrEmptyString to get values to assign to properties', async () => {
			new ProductionIdentifier();

			assert.equal(stubs.stringsModule.getTrimmedOrEmptyString.callCount, 1);
		});

		describe('uuid property', () => {
			it('assigns return value from getTrimmedOrEmptyString called with props value', async () => {
				const instance = new ProductionIdentifier({ uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' });

				sinonAssert.calledWithExactly(
					stubs.stringsModule.getTrimmedOrEmptyString,
					'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
				);

				assert.equal(instance.uuid, 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx');
			});
		});
	});

	describe('validateUuid method', () => {
		it('will call validateStringForProperty method', async () => {
			const instance = new ProductionIdentifier({ uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' });

			spy(instance, 'validateStringForProperty');

			instance.validateUuid();

			sinonAssert.calledOnceWithExactly(instance.validateStringForProperty, 'uuid', { isRequired: false });
		});
	});
});
