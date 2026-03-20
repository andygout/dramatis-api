import assert from 'node:assert/strict';
import { afterEach, beforeEach, describe, it } from 'node:test';

import esmock from 'esmock';
import { assert as sinonAssert, createStubInstance, restore, spy } from 'sinon';

import { FestivalSeries } from '../../../src/models/index.js';

describe('Festival model', () => {
	let stubs;
	let Festival;

	const FestivalSeriesStub = function () {
		return createStubInstance(FestivalSeries);
	};

	beforeEach(async () => {
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

	afterEach(() => {
		restore();
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
		it("calls instance's validate methods and associated models' validate methods", async () => {
			const instance = new Festival({
				name: '2008',
				differentiator: '',
				festivalSeries: {
					name: 'Edinburgh International Festival',
					differentiator: ''
				}
			});

			spy(instance, 'validateName');
			spy(instance, 'validateDifferentiator');

			instance.runInputValidations();

			sinonAssert.callOrder(
				instance.validateName,
				instance.validateDifferentiator,
				instance.festivalSeries.validateName,
				instance.festivalSeries.validateDifferentiator
			);
			sinonAssert.calledOnceWithExactly(instance.validateName, { isRequired: true });
			sinonAssert.calledOnceWithExactly(instance.validateDifferentiator);
			sinonAssert.calledOnceWithExactly(instance.festivalSeries.validateName, { isRequired: false });
			sinonAssert.calledOnceWithExactly(instance.festivalSeries.validateDifferentiator);
		});
	});
});
