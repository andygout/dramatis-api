import assert from 'node:assert/strict';
import { afterEach, beforeEach, describe, it } from 'node:test';

import esmock from 'esmock';
import { assert as sinonAssert, createStubInstance, restore, stub } from 'sinon';

import { Locale, Place, TimeBase } from '../../../src/models/index.js';

describe('Setting model', () => {
	let stubs;
	let Setting;

	const LocaleStub = function () {
		return createStubInstance(Locale);
	};

	const PlaceStub = function () {
		return createStubInstance(Place);
	};

	const TimeBaseStub = function () {
		return createStubInstance(TimeBase);
	};

	beforeEach(async () => {
		stubs = {
			isValidDate: stub().returns(true),
			stringsModule: {
				getTrimmedOrEmptyString: stub().callsFake((arg) => arg?.trim() || '')
			},
			models: {
				Locale: LocaleStub,
				Place: PlaceStub,
				TimeBase: TimeBaseStub
			}
		};

		Setting = await esmock(
			'../../../src/models/Setting.js',
			{},
			// globalmocks: mock definitions imported everywhere.
			// Required for when functions are invoked by ancestor class methods.
			{
				'../../../src/models/index.js': stubs.models
			}
		);
	});

	afterEach(() => {
		restore();
	});

	describe('constructor method', () => {
		describe('time property', () => {
			it('assigns instance if absent from props', async () => {
				const instance = new Setting();

				assert.ok(instance.time instanceof TimeBase);
			});

			it('assigns instance if included in props', async () => {
				const instance = new Setting({
					time: {
						name: '1809'
					}
				});

				assert.ok(instance.time instanceof TimeBase);
			});
		});

		describe('place property', () => {
			it('assigns instance if absent from props', async () => {
				const instance = new Setting();

				assert.ok(instance.place instanceof Place);
			});

			it('assigns instance if included in props', async () => {
				const instance = new Setting({
					place: {
						name: 'Derbyshire'
					}
				});

				assert.ok(instance.place instanceof Place);
			});
		});

		describe('locale property', () => {
			it('assigns instance if absent from props', async () => {
				const instance = new Setting();

				assert.ok(instance.locale instanceof Locale);
			});

			it('assigns instance if included in props', async () => {
				const instance = new Setting({
					locale: {
						name: 'Stately home'
					}
				});

				assert.ok(instance.locale instanceof Locale);
			});
		});
	});

	describe('runInputValidations method', () => {
		it("calls instance's validate methods and associated models' validate methods", async () => {
			const instance = new Setting({
				time: {
					name: '1809'
				},
				place: {
					name: 'Derbyshire'
				},
				locale: {
					name: 'Stately home'
				}
			});

			instance.runInputValidations({ isDuplicate: false });

			sinonAssert.callOrder(
				instance.time.validateName,
				instance.time.validateDifferentiator,
				instance.time.validateUniquenessInGroup,
				instance.place.validateName,
				instance.place.validateDifferentiator,
				instance.place.validateUniquenessInGroup,
				instance.locale.validateName,
				instance.locale.validateDifferentiator,
				instance.locale.validateUniquenessInGroup
			);
			sinonAssert.calledOnceWithExactly(instance.time.validateName, { isRequired: false });
			sinonAssert.calledOnceWithExactly(instance.time.validateDifferentiator);
			sinonAssert.calledOnceWithExactly(instance.time.validateUniquenessInGroup, { isDuplicate: false });
			sinonAssert.calledOnceWithExactly(instance.place.validateName, { isRequired: false });
			sinonAssert.calledOnceWithExactly(instance.place.validateDifferentiator);
			sinonAssert.calledOnceWithExactly(instance.place.validateUniquenessInGroup, { isDuplicate: false });
			sinonAssert.calledOnceWithExactly(instance.locale.validateName, { isRequired: false });
			sinonAssert.calledOnceWithExactly(instance.locale.validateDifferentiator);
			sinonAssert.calledOnceWithExactly(instance.locale.validateUniquenessInGroup, { isDuplicate: false });
		});
	});
});
