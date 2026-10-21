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

	describe('constructor method', () => {
		context('bounding box coordinates are absent', () => {
			it('assigns null to each coordinate', () => {
				const instance = new Place();

				assert.equal(instance.minLatitude, null);
				assert.equal(instance.maxLatitude, null);
				assert.equal(instance.minLongitude, null);
				assert.equal(instance.maxLongitude, null);
			});
		});

		context('bounding box coordinates are dismissible values', () => {
			it('assigns null to each coordinate', () => {
				const instance = new Place({
					minLatitude: '',
					maxLatitude: ' ',
					minLongitude: null,
					maxLongitude: undefined
				});

				assert.equal(instance.minLatitude, null);
				assert.equal(instance.maxLatitude, null);
				assert.equal(instance.minLongitude, null);
				assert.equal(instance.maxLongitude, null);
			});
		});

		context('bounding box coordinates (expressed as numbers) are present', () => {
			it('assigns each coordinate as a number', () => {
				const instance = new Place({
					minLatitude: 51.2867601,
					maxLatitude: 51.6918741,
					minLongitude: -0.5103751,
					maxLongitude: 0.3340155
				});

				assert.equal(instance.minLatitude, 51.2867601);
				assert.equal(instance.maxLatitude, 51.6918741);
				assert.equal(instance.minLongitude, -0.5103751);
				assert.equal(instance.maxLongitude, 0.3340155);
			});
		});

		context('bounding box coordinates (expressed as strings) are present', () => {
			it('assigns each coordinate converted to a number', () => {
				const instance = new Place({
					minLatitude: '51.2867601',
					maxLatitude: '51.6918741',
					minLongitude: '-0.5103751',
					maxLongitude: '0.3340155'
				});

				assert.equal(instance.minLatitude, 51.2867601);
				assert.equal(instance.maxLatitude, 51.6918741);
				assert.equal(instance.minLongitude, -0.5103751);
				assert.equal(instance.maxLongitude, 0.3340155);
			});
		});

		context('bounding box coordinates (expressed as strings that cannot be parsed as numbers) are present', () => {
			it('assigns return value from getTrimmedOrEmptyString called with props value', () => {
				const instance = new Place({
					minLatitude: 'foo',
					maxLatitude: ' bar',
					minLongitude: 'baz ',
					maxLongitude: ' qux '
				});

				sinonAssert.calledWithExactly(stubs.stringsModule.getTrimmedOrEmptyString.thirdCall, 'foo');
				sinonAssert.calledWithExactly(stubs.stringsModule.getTrimmedOrEmptyString.getCall(3), ' bar');
				sinonAssert.calledWithExactly(stubs.stringsModule.getTrimmedOrEmptyString.getCall(4), 'baz ');
				sinonAssert.calledWithExactly(stubs.stringsModule.getTrimmedOrEmptyString.getCall(5), ' qux ');
				assert.equal(instance.minLatitude, 'foo');
				assert.equal(instance.maxLatitude, 'bar');
				assert.equal(instance.minLongitude, 'baz');
				assert.equal(instance.maxLongitude, 'qux');
			});
		});
	});

	describe('runInputValidations method', () => {
		it("calls instance's validation methods", () => {
			const instance = new Place({ name: 'London' });

			spy(instance, 'validateName');
			spy(instance, 'validateDifferentiator');
			spy(instance, 'validateBoundingBoxCoordinates');

			instance.runInputValidations();

			sinonAssert.calledOnceWithExactly(instance.validateName, { isRequired: true });
			sinonAssert.calledOnceWithExactly(instance.validateDifferentiator);
			sinonAssert.calledOnceWithExactly(instance.validateBoundingBoxCoordinates);
		});
	});

	describe('validateBoundingBoxCoordinates method', () => {
		context('valid data', () => {
			context('all bounding box coordinates are absent', () => {
				it('will not call addPropertyError', () => {
					const instance = new Place({ name: 'London' });

					spy(instance, 'addPropertyError');

					instance.validateBoundingBoxCoordinates();

					sinonAssert.notCalled(instance.addPropertyError);
				});
			});

			context('all bounding box coordinates are numbers, in range, and ordered', () => {
				it('will not call addPropertyError', () => {
					const instance = new Place({
						name: 'London',
						minLatitude: 51.2867601,
						maxLatitude: 51.6918741,
						minLongitude: -0.5103751,
						maxLongitude: 0.3340155
					});

					spy(instance, 'addPropertyError');

					instance.validateBoundingBoxCoordinates();

					sinonAssert.notCalled(instance.addPropertyError);
				});
			});
		});

		context('invalid data', () => {
			context('only some bounding box coordinates are provided', () => {
				it('adds an error to each missing coordinate', () => {
					const instance = new Place({ minLatitude: 51.2867601 });

					spy(instance, 'addPropertyError');

					instance.validateBoundingBoxCoordinates();

					sinonAssert.calledThrice(instance.addPropertyError);
					sinonAssert.calledWithExactly(
						instance.addPropertyError.firstCall,
						'maxLatitude',
						'All four bounding box coordinates must be provided'
					);
					sinonAssert.calledWithExactly(
						instance.addPropertyError.secondCall,
						'minLongitude',
						'All four bounding box coordinates must be provided'
					);
					sinonAssert.calledWithExactly(
						instance.addPropertyError.thirdCall,
						'maxLongitude',
						'All four bounding box coordinates must be provided'
					);
				});
			});

			context('bounding box coordinate that cannot be parsed as a number', () => {
				it('adds a number error to applicable coordinate', () => {
					const instance = new Place({
						minLatitude: 'foobar',
						maxLatitude: 51.6918741,
						minLongitude: -0.5103751,
						maxLongitude: 0.3340155
					});

					spy(instance, 'addPropertyError');

					instance.validateBoundingBoxCoordinates();

					sinonAssert.calledOnceWithExactly(
						instance.addPropertyError,
						'minLatitude',
						'Value must be a number'
					);
				});
			});

			context('bounding box coordinate that is infinite', () => {
				it('adds a finite number error to applicable coordinate', () => {
					const instance = new Place({
						minLatitude: Infinity,
						maxLatitude: 51.6918741,
						minLongitude: -0.5103751,
						maxLongitude: 0.3340155
					});

					spy(instance, 'addPropertyError');

					instance.validateBoundingBoxCoordinates();

					sinonAssert.calledOnceWithExactly(
						instance.addPropertyError,
						'minLatitude',
						'Value must be a finite number'
					);
				});
			});

			context('bounding box coordinates that are outside their valid geographic ranges', () => {
				it('adds an error to applicable coordinates', () => {
					const instance = new Place({
						minLatitude: -91,
						maxLatitude: 91,
						minLongitude: -181,
						maxLongitude: 181
					});

					spy(instance, 'addPropertyError');

					instance.validateBoundingBoxCoordinates();

					assert.equal(instance.addPropertyError.callCount, 4);
					sinonAssert.calledWithExactly(
						instance.addPropertyError.firstCall,
						'minLatitude',
						'Latitude must be between -90 and 90'
					);
					sinonAssert.calledWithExactly(
						instance.addPropertyError.secondCall,
						'maxLatitude',
						'Latitude must be between -90 and 90'
					);
					sinonAssert.calledWithExactly(
						instance.addPropertyError.thirdCall,
						'minLongitude',
						'Longitude must be between -180 and 180'
					);
					sinonAssert.calledWithExactly(
						instance.addPropertyError.getCall(3),
						'maxLongitude',
						'Longitude must be between -180 and 180'
					);
				});
			});

			context('minimum bounding box coordinates exceed maximum bounding box coordinates', () => {
				it('adds an error to both latitude and longitude coordinates', () => {
					const instance = new Place({
						minLatitude: 52,
						maxLatitude: 51,
						minLongitude: 1,
						maxLongitude: 0
					});

					spy(instance, 'addPropertyError');

					instance.validateBoundingBoxCoordinates();

					assert.equal(instance.addPropertyError.callCount, 4);
					sinonAssert.calledWithExactly(
						instance.addPropertyError.firstCall,
						'minLatitude',
						'Minimum latitude must not exceed maximum latitude'
					);
					sinonAssert.calledWithExactly(
						instance.addPropertyError.secondCall,
						'maxLatitude',
						'Maximum latitude must not be below minimum latitude'
					);
					sinonAssert.calledWithExactly(
						instance.addPropertyError.thirdCall,
						'minLongitude',
						'Minimum longitude must not exceed maximum longitude'
					);
					sinonAssert.calledWithExactly(
						instance.addPropertyError.getCall(3),
						'maxLongitude',
						'Maximum longitude must not be below minimum longitude'
					);
				});
			});
		});
	});
});
