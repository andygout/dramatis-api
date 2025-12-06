import { expect } from 'chai';
import esmock from 'esmock';
import { assert, createStubInstance, spy } from 'sinon';

import { FestivalSeries } from '../../../src/models/index.js';

describe('Festival model', () => {

	let stubs;

	const FestivalSeriesStub = function () {

		return createStubInstance(FestivalSeries);

	};

	beforeEach(() => {

		stubs = {
			models: {
				FestivalSeries: FestivalSeriesStub
			}
		};

	});

	const createSubject = () =>
		esmock(
			'../../../src/models/Festival.js',
			{},
			// globalmocks: mock definitions imported everywhere.
			// Required for when functions are invoked by ancestor class methods.
			{
				'../../../src/models/index.js': stubs.models
			}
		);

	describe('constructor method', () => {

		describe('festivalSeries property', () => {

			it('assigns instance if absent from props', async () => {

				const Festival = await createSubject();

				const instance = new Festival({ name: '2008' });

				expect(instance.festivalSeries instanceof FestivalSeries).to.be.true;

			});

			it('assigns instance if included in props', async () => {

				const Festival = await createSubject();

				const instance = new Festival({
					name: '2008',
					festivalSeries: {
						name: 'Edinburgh International Festival'
					}
				});

				expect(instance.festivalSeries instanceof FestivalSeries).to.be.true;

			});

		});

	});

	describe('runInputValidations method', () => {

		it('calls instance\'s validate methods and associated models\' validate methods', async () => {

			const Festival = await createSubject();

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

			assert.callOrder(
				instance.validateName,
				instance.validateDifferentiator,
				instance.festivalSeries.validateName,
				instance.festivalSeries.validateDifferentiator
			);
			assert.calledOnceWithExactly(instance.validateName, { isRequired: true });
			assert.calledOnceWithExactly(instance.validateDifferentiator);
			assert.calledOnceWithExactly(instance.festivalSeries.validateName, { isRequired: false });
			assert.calledOnceWithExactly(instance.festivalSeries.validateDifferentiator);

		});

	});

});
