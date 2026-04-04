import assert from 'node:assert/strict';
import { beforeEach, describe, it } from 'node:test';

import esmock from 'esmock';

import { FestivalSeries } from '../../../src/models/index.js';

describe('Festival model', () => {
	let stubs;
	let Festival;

	const FestivalSeriesStub = function () {
		return new FestivalSeries();
	};

	beforeEach(async (test) => {
		stubs = {
			models: {
				FestivalSeries: FestivalSeriesStub
			}
		};

		Festival = await esmock(
			'../../../src/models/Festival.js',
			{},
			// globalmocks: mock definitions imported everywhere.
			// Required for when functions are invoked by ancestor class methods.
			{
				'../../../src/models/index.js': stubs.models
			}
		);
	});

	describe('constructor method', () => {
		describe('festivalSeries property', () => {
			it('assigns instance if absent from props', async () => {
				const instance = new Festival({ name: '2008' });

				assert.ok(instance.festivalSeries instanceof FestivalSeries);
			});

			it('assigns instance if included in props', async () => {
				const instance = new Festival({
					name: '2008',
					festivalSeries: {
						name: 'Edinburgh International Festival'
					}
				});

				assert.ok(instance.festivalSeries instanceof FestivalSeries);
			});
		});
	});

	describe('runInputValidations method', () => {
		it("calls instance's validate methods and associated models' validate methods", async (test) => {
			const instance = new Festival({
				name: '2008',
				differentiator: '',
				festivalSeries: {
					name: 'Edinburgh International Festival',
					differentiator: ''
				}
			});
			const callOrder = [];

			const originalValidateName = instance.validateName;
			const originalValidateDifferentiator = instance.validateDifferentiator;
			const originalFestivalSeriesValidateName = instance.festivalSeries.validateName;
			const originalFestivalSeriesValidateDifferentiator = instance.festivalSeries.validateDifferentiator;

			test.mock.method(instance, 'validateName', function (...args) {
				callOrder.push('instance.validateName');

				return originalValidateName.apply(this, args);
			});
			test.mock.method(instance, 'validateDifferentiator', function (...args) {
				callOrder.push('instance.validateDifferentiator');

				return originalValidateDifferentiator.apply(this, args);
			});
			test.mock.method(instance.festivalSeries, 'validateName', function (...args) {
				callOrder.push('instance.festivalSeries.validateName');

				return originalFestivalSeriesValidateName.apply(this, args);
			});
			test.mock.method(instance.festivalSeries, 'validateDifferentiator', function (...args) {
				callOrder.push('instance.festivalSeries.validateDifferentiator');

				return originalFestivalSeriesValidateDifferentiator.apply(this, args);
			});

			instance.runInputValidations();

			assert.deepStrictEqual(callOrder, [
				'instance.validateName',
				'instance.validateDifferentiator',
				'instance.festivalSeries.validateName',
				'instance.festivalSeries.validateDifferentiator'
			]);
			assert.strictEqual(instance.validateName.mock.calls.length, 1);
			assert.deepStrictEqual(instance.validateName.mock.calls[0].arguments, [{ isRequired: true }]);
			assert.strictEqual(instance.validateDifferentiator.mock.calls.length, 1);
			assert.deepStrictEqual(instance.validateDifferentiator.mock.calls[0].arguments, []);
			assert.strictEqual(instance.festivalSeries.validateName.mock.calls.length, 1);
			assert.deepStrictEqual(instance.festivalSeries.validateName.mock.calls[0].arguments, [{ isRequired: false }]);
			assert.strictEqual(instance.festivalSeries.validateDifferentiator.mock.calls.length, 1);
			assert.deepStrictEqual(instance.festivalSeries.validateDifferentiator.mock.calls[0].arguments, []);
		});
	});
});
