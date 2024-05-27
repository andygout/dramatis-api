import { expect } from 'chai';
import proxyquire from 'proxyquire';
import { assert, createStubInstance, spy } from 'sinon';

import { FestivalSeries } from '../../../src/models';

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

		proxyquire('../../../src/models/Festival', {
			'.': stubs.models
		}).default;

	const createInstance = props => {

		const Festival = createSubject();

		return new Festival(props);

	};

	describe('constructor method', () => {

		describe('festivalSeries property', () => {

			it('assigns instance if absent from props', () => {

				const instance = createInstance({ name: '2008' });
				expect(instance.festivalSeries instanceof FestivalSeries).to.be.true;

			});

			it('assigns instance if included in props', () => {

				const instance = createInstance({
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

		it('calls instance\'s validate methods and associated models\' validate methods', () => {

			const props = {
				name: '2008',
				differentiator: '',
				festivalSeries: {
					name: 'Edinburgh International Festival',
					differentiator: ''
				}
			};
			const instance = createInstance(props);
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
