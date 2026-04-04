import assert from 'node:assert/strict';
import { beforeEach, describe, it } from 'node:test';

import esmock from 'esmock';

describe('ProductionIdentifier model', () => {
	let stubs;
	let ProductionIdentifier;

	beforeEach(async (test) => {
		stubs = {
			stringsModule: {
				getTrimmedOrEmptyString: test.mock.fn((arg) => arg?.trim() || '')
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

	describe('constructor method', () => {
		it('calls getTrimmedOrEmptyString to get values to assign to properties', async () => {
			new ProductionIdentifier();

			assert.equal(stubs.stringsModule.getTrimmedOrEmptyString.mock.calls.length, 1);
		});

		describe('uuid property', () => {
			it('assigns return value from getTrimmedOrEmptyString called with props value', async () => {
				const instance = new ProductionIdentifier({ uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' });

				assert.deepStrictEqual(
					stubs.stringsModule.getTrimmedOrEmptyString.mock.calls[0].arguments,
					['xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx']
				);

				assert.equal(instance.uuid, 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx');
			});
		});
	});

	describe('validateUuid method', () => {
		it('will call validateStringForProperty method', async (test) => {
			const instance = new ProductionIdentifier({ uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' });

			test.mock.method(instance, 'validateStringForProperty', () => undefined);

			instance.validateUuid();

			assert.strictEqual(instance.validateStringForProperty.mock.calls.length, 1);
			assert.deepStrictEqual(instance.validateStringForProperty.mock.calls[0].arguments, ['uuid', { isRequired: false }]);
		});
	});
});
