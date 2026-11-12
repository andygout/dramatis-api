import assert from 'node:assert/strict';
import { afterEach, beforeEach, describe, it } from 'node:test';

import esmock from 'esmock';
import { assert as sinonAssert, restore, spy, stub } from 'sinon';

const context = describe;

describe('Place model', () => {
	let stubs;
	let Place;

	beforeEach(async () => {
		stubs = {
			stringsModule: {
				getTrimmedOrEmptyString: stub().callsFake((arg) => arg?.trim() || '')
			}
		};

		Place = await esmock(
			'../../../src/models/Place.js',
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

	describe('runInputValidations method', () => {
		it("calls instance's validation methods", () => {
			const instance = new Place({ name: 'London' });

			spy(instance, 'validateName');
			spy(instance, 'validateDifferentiator');

			instance.runInputValidations();

			sinonAssert.calledOnceWithExactly(instance.validateName, { isRequired: true });
			sinonAssert.calledOnceWithExactly(instance.validateDifferentiator);
		});
	});
});
